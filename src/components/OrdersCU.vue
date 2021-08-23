
<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <MyDatePicker v-model="neworder.date" :label="$t('Set order date')"></MyDatePicker>
                <MyDatePicker v-model="neworder.expiration" :label="$t('Set order expiration date')"></MyDatePicker>
                <v-autocomplete :items="$store.state.catalogs.investments" v-model="neworder.investments" :label="$t('Select an investment')" item-text="fullname" item-value="url" required :rules="RulesSelection(true)"></v-autocomplete>
                <MyDateTimePicker v-model="neworder.executed" v-if="editing==true" :label="$t('Set order execution date and time')"></MyDateTimePicker>
                <v-text-field v-model="neworder.price" type="number" :label="$t('Set order price')" required :placeholder="$t('Set order price')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field v-model="neworder.shares" type="number" :label="$t('Set order shares')" required :placeholder="$t('Set order shares')" :rules="RulesInteger(10,true)" counter="10"/>
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
    import MyDatePicker from './MyDatePicker.vue'
    import MyDateTimePicker from './MyDateTimePicker.vue'
    export default {
        components: {
            MyDatePicker,
            MyDateTimePicker,
        },
        props: {
            // An account object
            order: {
                required: true // Null to create, order object to update
            }
        },
        data(){ 
            return {
                form_valid:false,
                neworder:this.empty_order(),
                editing:false,
            }
        },
        methods: {        
            empty_order(){
                return {
                    date: new Date().toISOString().split("T")[0],
                    executed: null,
                    expiration: null,
                    investments: null,
                    price: 0,
                    shares: 0,
                }
            },
            title(){
                if (this.editing){
                    return this.$t("Updating order")
                } else {
                    return this.$t("Creating a new order")
                }
            },
            button(){
                if (this.editing){
                    return this.$t("Update order")
                } else {
                    return this.$t("Add order")
                }
            },
            accept(){
                console.log("Accepting")
                console.log(this.neworder.price)
                if (this.editing==true){
                    axios.put(this.neworder.url, this.neworder,  this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.$emit("cruded")
                            this.editing=false
                            this.neworder=this.empty_order()
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/orders/`, this.neworder,  this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.$emit("cruded")
                            this.neworder=this.empty_order()
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },

        },
        mounted(){
            console.log(this.order)
            if (this.order!=null){
                //this.neworder=Object.create(this.order)
                this.neworder={}
                this.neworder.url=this.order.url
                this.neworder.date=this.order.date
                this.neworder.expiration=this.order.expiration
                this.neworder.executed=this.order.executed
                this.neworder.investments=this.order.investments
                this.neworder.shares=this.order.shares
                this.neworder.price=this.order.price

                this.editing=true
            }
            console.log(this.neworder)
        }
    }
</script>

