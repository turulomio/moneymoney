
<template>
    <div>    
        <h1>{{ title }}</h1>
        <v-card outlined class="ma-4 pa-4">
            <p class="bold">{{ $t("Account operations") }}</p>
            <TableAccountOperations showaccount showtotal :items="data.ao" height="250" class="flex-grow-1 flex-shrink-0" @editAO="editAO" @deleteAO="deleteAO" :key="'AO'+key"/>
            <p class="mt-4 bold">{{ $t("Credit card operations") }}</p>
            <TableCreditcardsOperations showcc showtotal :items="data.cco" height="250" class=" flex-grow-1 flex-shrink-0" :key="'CC'+key" />
            <p class="mt-4 bold" v-html="total"></p>
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
    import TableAccountOperations from './TableAccountOperations.vue'
    import AccountsoperationsCU from './AccountsoperationsCU.vue'
    import TableCreditcardsOperations from './TableCreditcardsOperations.vue'
    export default {
        components:{
            TableAccountOperations,
            TableCreditcardsOperations,
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
                data:[],
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

            },
            total: function(){
                return this.$t("Total: {0}").format(this.localcurrency_html(this.listobjects_sum(this.data.ao,"amount")+this.listobjects_sum(this.data.cco,"amount")))
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
                axios.get(`${this.concept}historical_report_detail/?year=${this.year}&month=${this.month}` , this.myheaders())
                .then( (response)=> {
                    console.log(response.data)
                    this.data=response.data.data
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
