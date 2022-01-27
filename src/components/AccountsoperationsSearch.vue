
<template>
    <div>    
        <h1>{{ $t(`Accounts operations search`) }}</h1>
        <v-card outlined class="ma-4 pa-4">   
            <v-row>
            <v-text-field  class="pa-4" v-model="search" type="text" :label="$t('Enter a string to search')" :placeholder="$t('Operation comment')" autofocus  counter="200"/>
            <v-btn class="mt-2 "  color="error" @click="on_button_click()">{{ $t("Search") }}</v-btn>
            </v-row>
            <TableAccountOperations :homogeneous="false" :items="items_ao" height="400" class=" flex-grow-1 flex-shrink-0" @editAO="editAO" @deleteAO="deleteAO" :key="key"></TableAccountOperations>
        </v-card>
        <!-- DIALOG ACCOUNTSOPERATIONS ADD/UPDATE -->
        <v-dialog v-model="dialog_ao" max-width="550">
            <v-card class="pa-8">
                <AccountsoperationsCU :ao="ao" :key="key" @cruded="on_AccountsoperationsCU_cruded"></AccountsoperationsCU>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import AccountsoperationsCU from './AccountsoperationsCU.vue'
    import TableAccountOperations from './TableAccountOperations.vue'
    export default {
        components:{
            AccountsoperationsCU,
            TableAccountOperations,
        },
        props:{
        },
        data(){ 
            return {
                items_ao:[],
                ao:null,
                loading_ao:false,
                search:"",

                key:0,
                dialog_ao:false
            }
        },
        methods: {
            editAO (item) {
                this.ao=item
                this.dialog_ao=true
            },
            deleteAO (item) {
               var r = confirm(this.$t("Do you want to delete this account operation?"))
               if(r == false) {
                  return
               }
                axios.delete(item.url, this.myheaders())
                .then((response) => {
                    console.log(response);
                    this.update_table()
                    this.$emit("cruded")
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_AccountsoperationsCU_cruded(){
                this.dialog_ao=false
                this.$emit("cruded")
                this.update_table()
            },
            on_button_click(){
                this.update_table()
            },
            update_table(){
                if (this.search.length<2){
                    alert(this.$t("You must enter at least two characters"))
                    return
                }
                this.loading_ao=true
                axios.get(`${this.$store.state.apiroot}/api/accountsoperations/?search=${this.search}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.items_ao=response.data
                    this.loading_ao=false
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
        },
        mounted(){
        }
    }
</script>

