
<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete :items="$store.state.catalogs.investments" v-model="newio.investments" :label="$t('Select an investment')" item-text="fullname" item-value="url" required :rules="RulesSelection(true)"></v-autocomplete>
                <MyDateTimePicker v-model="newio.datetime" v-if="editing==true" :label="$t('Set investment operation date and time')"></MyDateTimePicker>
                <v-autocomplete :items="$store.state.catalogs.operationstypes" v-model="newio.operationstypes" :label="$t('Select an operation type')" item-text="name" item-value="url" required :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field v-model="newio.shares" type="number" :label="$t('Set investment operation shares')" required :placeholder="$t('Set investment operation shares')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field v-model="newio.price" type="number" :label="$t('Set investment operation price')" required :placeholder="$t('Set investment operation price')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field v-model="newio.taxes" type="number" :label="$t('Set investment operation taxes')" required :placeholder="$t('Set investment operation taxes')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field v-model="newio.commission" type="number" :label="$t('Set investment operation commission')" required :placeholder="$t('Set investment operation commission')" :rules="RulesInteger(10,true)" counter="10"/>            
                <v-text-field v-model="newio.comment" type="text" :label="$t('Set investment operation comment')" required :placeholder="$t('Set investment operation comment')" :rules="RulesString(255,false)" counter="255"/>      
                <v-text-field v-model="newio.currency_conversion" type="number" :label="$t('Set investment operation currency conversion')" required :placeholder="$t('Set investment operation currency conversion')" :rules="RulesInteger(10,true)" counter="10"/>      
                <v-checkbox v-model="newio.show_in_ranges" :label="$t('Show in ranges?')" ></v-checkbox>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="accept()" :disabled="!form_valid">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
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
                newio:this.empty_io(),
                editing:false,
            }
        },
        methods: {        
            empty_io(){
                return {
                    datetime: new Date().toISOString(),
                    operationstypes: `${this.$store.state.apiroot}/api/operationstypes/4/`,
                    shares:0,
                    taxes:0,
                    commission:0,
                    price:0,
                    comment:"",
                    show_in_ranges:true,
                    currency_conversion:1,
                    investments: null,
                    url: null,
                }
            },
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
                            this.newio=this.empty_io()
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/investmentsoperations/`, this.newio,  this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.$emit("cruded")
                            this.newio=this.empty_io()
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },

        },
        mounted(){
            console.log(this.io)
            if (this.io!=null){
                this.newio=Object.create(Object.getPrototypeOf(this.io), Object.getOwnPropertyDescriptors(this.io))
                console.log(this.io==this.newio)
                //Due to it comes from django Investmentsoperations class
                this.newio.investments=`${this.$store.state.apiroot}/api/investments/${this.newio.investments_id}/`
                this.newio.operationstypes=`${this.$store.state.apiroot}/api/operationstypes/${this.newio.operationstypes_id}/`
                this.newio.url=`${this.$store.state.apiroot}/api/investmentsoperations/${this.newio.id}/`
                this.editing=true
            } else{
               this.newio.investments=this.investment.url
            }
            console.log(this.newio)
        }
    }
</script>

