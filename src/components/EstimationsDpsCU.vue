<template>
    <div>
        <v-card>
            <h1>{{ title() }}</h1>
            <v-form ref="form" v-model="form_valid" v-if='estimation!=null'>
                <v-col>
                    <v-text-field v-model.number="new_estimation.year" :counter="4" :label="$t('Year')" :placeholder="$t('Enter a year')" :rules="RulesInteger(4,true)"></v-text-field>
                    <v-text-field v-model.number="new_estimation.estimation" :label="$t('Estimation')" :counter="10" :placeholder="$t('Enter a estimation')" autofocus @focus="$event.target.select()" :rules="RulesFloat(10, true, 6)"></v-text-field>
                </v-col>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="submit()">{{ button() }}</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </div>
</template>

<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import { RulesFloat,RulesInteger } from 'vuetify_rules'
    import { parseResponseError } from '@/functions'
    export default {
        props: {
            estimation: {
                required: true,
            },
            mode: {
                required: true // Can be CUD
            }
        },
        data(){ 
            return{
                
                new_estimation: null,
                form_valid:false,
            }
        },
        methods:{
            useStore,
            RulesFloat,
            RulesInteger,
            parseResponseError,
            title(){
                if (this.mode=="U"){
                    return this.$t("Updating a DPS estimation")
                } else  if (this.mode=="C"){
                    return this.$t("Adding a new DPS estimation")
                } else  if (this.mode=="D"){
                    return this.$t("Deleting a DPS estimation")
                }
            },
            button(){
                if (this.mode=="U"){
                    return this.$t("Update")
                } else  if (this.mode=="C"){
                    return this.$t("Create")
                } else  if (this.mode=="D"){
                    return this.$t("Delete")
                }
            },    
            submit(){
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                if (this.mode=="C"){   
                    axios.post(`${this.useStore().apiroot}/api/estimationsdps/`, this.new_estimation, this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="U"){

                    axios.put(this.new_estimation.url, this.new_estimation, this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                } else if (this.mode=="D"){
                    var r = confirm(this.$t("Do you want to delete this DPS estimation?"))
                    if(r == false) {
                        return
                    } 
                    axios.delete(this.new_estimation.url, this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
            },
            
        },
        created(){
            this.new_estimation=Object.assign({},this.estimation)
        }
    }
</script>
