
<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete :items="$store.state.catalogs.investments" v-model="newio.investments" :label="$t('Select an investment')" item-text="fullname" item-value="url" required :rules="RulesSelection(true)"></v-autocomplete>
                <MyDateTimePicker v-model="newio.executed" v-if="editing==true" :label="$t('Set investment execution date and time')"></MyDateTimePicker>
                <v-text-field v-model="newio.price" type="number" :label="$t('Set investment price')" required :placeholder="$t('Set investment price')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field v-model="newio.shares" type="number" :label="$t('Set investment shares')" required :placeholder="$t('Set investment shares')" :rules="RulesInteger(10,true)" counter="10"/>
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
                    operationstypes:null,
                    shares:0,
                    taxes:0,
                    commission:0,
                    price:0,
                    comment:"",
                    show_in_ranges:null,
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

                this.editing=true
            }
            console.log(this.newio)
        }
    }
</script>

