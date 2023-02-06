
<template>
    <div>    
        <h1>{{ title }}</h1>
        <v-card outlined class="ma-4 pa-4">
            <TableAccountOperations showaccount showtotal :items="items_ao" height="400" class="flex-grow-1 flex-shrink-0" @editAO="editAO" @deleteAO="deleteAO" :key="key"/>
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
            TableAccountOperations,
            AccountsoperationsCU,
        },
        props:{
            concept: {//url
                required: true
            },
            year: {
                type: Number,
                required: true,
            },
            month:{ //Only hides account if true
                type: Number,
                required:false,
            },
        },
        data(){ 
            return {
                items_ao:[],
                ao:null,
                loading:false,
                search:"",

                key:0,
                dialog_ao:false
            }
        },
        computed:{
            title: function(){
                var concept=this.$store.getters.getObjectByUrl("concepts",this.concept)
                if (this.month==null){
                    return this.$t("'{0}' operations at year {1}").format(concept.localname,this.year)
                } else {
                    return this.$t("'{0}' operations at {1}-{2}").format(concept.localname,this.year,this.month)
                }

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
                this.loading=true
                axios.get(`${this.$store.state.apiroot}/api/accountsoperations/?concept=${this.concept}&year=${this.year}&month=${this.month}` , this.myheaders())
                .then( (response)=> {
                    console.log(response.data)
                    this.items_ao=response.data
                    this.key=this.key+1;
                    this.loading=false
                }) 
                .catch((error) => {
                    this.parseResponseError(error)
                });
            },
        },
        mounted(){
            this.update_table()
        }
    }
</script>
