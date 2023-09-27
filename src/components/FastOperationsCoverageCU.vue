<template>
    <div class="pa-5">
        <v-card>
            <h1>{{ title() }}</h1>
            <v-form ref="form" v-model="form_valid" v-if='foc!=null'>
                <v-col>
                    <MyDateTimePicker :readonly="mode=='D'" :label="$t('Select date and time')" v-model="new_foc.datetime" />
                    <v-autocomplete :readonly="mode=='D'" :items="getArrayFromMap(store().investments)" v-model="new_foc.investments" :label="$t('Select an investment')" item-title="fullname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                    <v-text-field :readonly="mode=='D'" v-model.number="new_foc.amount" :label="$t('Enter an amount')" :placeholder="$t('Enter an amount')" :rules="RulesFloat(30,true,6)" />
                    <v-text-field v-model="new_foc.comment" type="text" :label="$t('Enter a comment')" :counter="200" :placeholder="$t('Enter a comment')" :rules="RulesString(200, false)" />
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
    import MyDateTimePicker from './MyDateTimePicker.vue'
    export default {
        components:{
            MyDateTimePicker,
        },
        props: {
            foc: {
                required: true,
            },
            mode: {
                required: true // Can be CUD
            }
        },
        data(){ 
            return{
                
                new_foc: null,
                form_valid:false,
            }
        },
        methods:{
            title(){
                if (this.mode=="U"){
                    return this.$t("Updating a fast operations coverage")
                } else  if (this.mode=="C"){
                    return this.$t("Adding a new fast operations coverage")
                } else  if (this.mode=="D"){
                    return this.$t("Deleting a fast operations coverage")
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
                    axios.post(`${this.store().apiroot}/api/fastoperationscoverage/`, this.new_foc, this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else if (this.mode=="U"){

                    axios.put(this.new_foc.url, this.new_foc, this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                } else if (this.mode=="D"){
                    var r = confirm(this.$t("Do you want to delete this fast operations coverage?"))
                    if(r == false) {
                        return
                    } 
                    axios.delete(this.new_foc.url, this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
            },
            
        },
        created(){
            this.new_foc=Object.assign({},this.foc)
        }
    }
</script>
