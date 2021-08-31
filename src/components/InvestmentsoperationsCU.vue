
<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete dense :items="$store.state.catalogs.investments" v-model="newio.investments" :label="$t('Select an investment')" item-text="fullname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <MyDateTimePicker v-model="newio.datetime" :label="$t('Set investment operation date and time')"></MyDateTimePicker>
                <v-autocomplete dense :items="$store.state.catalogs.operationstypes" v-model="newio.operationstypes" :label="$t('Select an operation type')" item-text="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field dense v-model.number="newio.shares" type="number" :label="$t('Set investment operation shares')" :placeholder="$t('Set investment operation shares')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field dense v-model.number="newio.price" type="number" :label="$t('Set investment operation price')" :placeholder="$t('Set investment operation price')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field dense v-model.number="newio.taxes" type="number" :label="$t('Set investment operation taxes')" :placeholder="$t('Set investment operation taxes')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field dense v-model.number="newio.commission" type="number" :label="$t('Set investment operation commission')" :placeholder="$t('Set investment operation commission')" :rules="RulesInteger(10,true)" counter="10"/>            
                <v-text-field dense v-model="newio.comment" type="text" :label="$t('Set investment operation comment')" :placeholder="$t('Set investment operation comment')" :rules="RulesString(255,false)" counter="255"/>      
                <v-text-field dense v-model.number="newio.currency_conversion" type="number" :label="$t('Set investment operation currency conversion')" :placeholder="$t('Set investment operation currency conversion')" :rules="RulesInteger(10,true)" counter="10"/>      
                <v-checkbox dense v-model="newio.show_in_ranges" :label="$t('Show in ranges?')" ></v-checkbox>
            </v-form>
            <div v-html="foot()"></div>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="accept()" :disabled="!form_valid">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import {empty_io} from '../empty_objects.js'
    import MyDateTimePicker from './MyDateTimePicker.vue'
    export default {
        components: {
            MyDateTimePicker,
        },
        props: {
            // An account object
            io: {
                required: true // Null to create, io object to update
            },
            investment: {
                required: false // Solo necesaria cuando viene de añadir io y queremos especificar la inversion
            }
        },
        data(){ 
            return {
                form_valid:false,
                newio: null,
                editing:false,
            }
        },
        methods: {
            empty_io,
            title(){
                if (this.editing){
                    return this.$t("Updating investment operation")
                } else {
                    return this.$t("Creating a new investment operation")
                }
            },
            button(){
                if (this.editing){
                    return this.$t("Update investment operation")
                } else {
                    return this.$t("Add investment operation")
                }
            },
            accept(){
                console.log("Accepting")
                if (this.editing==true){
                    axios.put(this.newio.url, this.newio,  this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.$emit("cruded")
                            this.editing=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/investmentsoperations/`, this.newio,  this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
            foot(){
                var gross=this.newio.shares*this.newio.price
                var net=0
                if (this.newio.shares>0){
                    net=gross+this.newio.taxes+this.newio.commission
                } else {
                    net=gross-this.newio.taxes-this.newio.commission
                }
                return this.$t(`Gross balance: ${this.currency_html(gross, this.investment.currency)}. Net balance: ${this.currency_html(net, this.investment.currency)}`)
            },
            setShares(value){
                this.newio.shares=value
            }

        },
        created(){
            if ( this.io.url!=null){ // EDITING TIENE IO URL
                this.editing=true
            } else { // NEW IO BUT SETTING VALUES WITH URL=null
                this.editing=false
            }
            this.newio=Object.assign({},this.io)
        }
    }
</script>
