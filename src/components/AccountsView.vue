<template>
    <div>
        <h1>{{ $t(`Account details of '${account.name }'`)}}
        <MyMenuInline :items="items" @selected="MyMenuInlineSelection"></MyMenuInline>  </h1>

        <p><strong>{{ $t('Id')}}: </strong>{{ account.id }}</p>
        <p><strong>{{ $t('Number')}}: </strong>{{ account.number }}</p>
        <p><strong>{{ $t('Currency')}}: </strong>{{ account.currency }}</p>

    
        <v-tabs v-model="tab">
            <v-tab key="ao">{{ $t("Account operations")}}</v-tab>
            <v-tab key="cc">{{ $t("Credit cards")}}</v-tab>
            <v-tab-item key="ao">     
                <v-card class="pa-4 d-flex justify-center" outlined style="min-width: 100px; max-width: 100%;">
                    <v-date-picker dense no-title class="mymonthpicker " ref="monthpicker" v-model="monthpicker" type="month"></v-date-picker>
                    <v-divider class="mx-2" vertical ></v-divider>
                    <TableAccountOperations homogeneous :items="items_ao" :currency_account="account.currency" height="400" url_root="{% url 'home' %}" ref="table_ao" class=" flex-grow-1 flex-shrink-0" :locale='this.$i18n.locale' @editAO="editAO" @deleteAO="deleteAO"></TableAccountOperations>
                </v-card>
            </v-tab-item>
            <v-tab-item key="cc">
                <v-card class="padding" outlined>
                    <v-data-table dense :headers="table_cc_headers" :items="table_cc"  class="elevation-1" disable-pagination  hide-default-footer sort-by="name" fixed-header max-height="400">         
                        <template v-slot:[`item.deferred`]="{ item }">
                            <v-simple-checkbox v-model="item.deferred" disabled></v-simple-checkbox>
                        </template>  
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon small class="mr-2" @click="editAO(item)">mdi-pencil</v-icon>
                            <v-icon small class="mr-2" @click="deleteAO(item)">mdi-delete</v-icon>
                        </template>
                    </v-data-table>   
                </v-card>
            </v-tab-item>
        </v-tabs>  
        <!-- DIALOG ACCOUNTSOPERATIONS ADD/UPDATE -->
        <v-dialog v-model="dialog_ao" max-width="550">
            <v-card class="pa-4">
                <v-card-title class="headline">{{dialog_title_ao()}}</v-card-title>
                <v-form ref="form" v-model="form_valid_ao" lazy-validation>
                    <v-autocomplete :items="$store.state.catalogs.accounts.filter(v =>v.active==true)" v-model="ao.accounts" :label="$t('Select an account')" item-text="name" item-value="url" required :rules="RulesSelection(false)"></v-autocomplete>
                    <v-datetime-picker label="Select operation date and time" v-model="ao.datetime" timeFormat="hh:mm:ss" :timePickerProps="{
      format: '24hr', useSeconds:true }"> </v-datetime-picker>
                    <v-autocomplete :items="$store.state.catalogs.concepts" v-model="ao.concepts" :label="$t('Select a concept')" item-text="name" item-value="url" required :rules="RulesSelection(false)"></v-autocomplete>
                    <v-text-field v-model="ao.amount" type="number" :label="$t('Operation amount')" required :placeholder="$t('Account number')" :rules="RulesString(30,true)" counter="30"/>
                    <v-text-field v-model="ao.comment" type="text" :label="$t('Operation comment')" required :placeholder="$t('Operation comment')" autofocus  counter="200"/>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="following_ao=false;acceptDialogAO()" :disabled="!form_valid_ao">{{ $t("Add") }}</v-btn>
                    <v-btn color="primary" @click="following_ao=true;acceptDialogAO()" :disabled="!form_valid_ao" v-if="editing_ao==false">{{ $t("Add and follow") }}</v-btn>
                    <v-btn color="error" @click="dialog_ao = false">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>  
<script>     
    import axios from 'axios' 
    import MyMenuInline from './MyMenuInline.vue'
    import TableAccountOperations from './TableAccountOperations.vue'
    export default {
        components:{
            MyMenuInline,
            TableAccountOperations,
        },
        props:{
            account:{
                required:true,
            }
        },
        data () {
            return {
                monthpicker: new Date().toISOString().substr(0, 7),
                tab:0,
                items_ao: [],           
                items: [
                    { subheader:this.$t('Account orders'), children: [
                            { 
                                name:this.$t('Add an account transfer'), 
                                code: function(this_){
                                    console.log("HOLA")
                                    this_.editing_ao=false
                                    this_.account=this_.empty_account_operation()
                                    this_.dialog_ao=true
                                },
                                icon: "mdi-plus" 
                            },
                        ]
                    },
                    { subheader:this.$t('Account operations orders'), children: [
                            { 
                                name:this.$t('Add an account operation'), 
                                code: function(this_){
                                    this_.editing_ao=false
                                    this_.ao=this_.empty_account_operation()
                                    this_.dialog_ao=true
                                },
                                icon: "mdi-plus" 
                            },

                        ]
                    },
                    { subheader:this.$t('Credit card orders'), children: [
                            { 
                                name:this.$t('Add a credit card'), 
                                type: "redirection", 
                                command: "{% url 'creditcard_new' accounts_id=account.id)", 
                                icon: "mdi-plus" 
                            },
                        ]
                    },
                ],
                table_cc_headers:[
                    { text: this.$t('Name'), value: 'name',sortable: true },
                    { text: this.$t('Number'), value: 'number',sortable: false},
                    { text: this.$t('Deferred'), value: 'deferred',sortable: false},
                    { text: this.$t('Maximum balance'), value: 'maximumbalance',sortable: false, align:"right"},
                    { text: this.$t('Balance'), value: 'balance',sortable: true ,align:"right"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ],
                table_cc:[],

                // DIALOG ACCOUNT OPERATIONS
                form_valid_ao:true,
                dialog_ao:false,
                editing_ao:false,
                folowing_ao:false,
                ao: this.empty_account_operation()
            }  
        },
        watch:{
            monthpicker: function (){
                this.refreshTable()
            }
        },
        methods: {

            dialog_title_ao(){
                if(this.editing==true){
                    return this.$t("Updating account operation")
                } else {
                    return this.$t("Creating a new account operation")
                }
            },
            empty_account_operation(){
                return {
                    datetime: new Date(),
                    concepts: null,
                    operationstypes:null,
                    amount: 0,
                    comment: "",    
                    accounts: this.account.url,
                }
            },
            MyMenuInlineSelection(item){
                item.code(this)
            },
            refreshTable(){
                //var this_=this //Needs this inside axios seems with browser vue method
                axios.get(`${this.$store.state.apiroot}/accountsoperations/withbalance/?account=${this.account.id}&year=${this.monthpicker.slice(0,4)}&month=${this.monthpicker.slice(5,7)}`, this.myheaders())                
                .then((response) => {
                    this.items_ao=response.data;
                    this.$refs.table_ao.gotoLastRow()
                }) 
                .catch((error) => {
                    console.log(error)
                    alert("Something is wrong")
                });
            },
          
            editCC(item){
                window.location.href="{% url 'creditcard_view' pk=9999 %}".replace("9999", item.id)
            },
            deleteCC(item){
                window.location.href="{% url 'creditcard_delete' pk=9999 %}".replace("9999", item.id)
            },

            acceptDialogAO(){
                console.log(this.ao)
                console.log(this.get_concept(this.ao.concepts))
                this.ao.operationstypes=this.get_concept(this.ao.concepts).operationstypes
                console.log(this.ao.operationstypes)
                if (this.editing_ao==true){               
                    axios.put(this.ao.url, this.ao, this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.refreshTable()     
                            this.dialog_ao=false
                            this.editing_ao=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/accountsoperations/`, this.ao,  this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.refreshTable()                             
                            if (this.folowing_ao==true){
                                this.ao.datetime=this.ao.datetime.setSeconds(this.ao.datetime.getSeconds()+1)
                            } else {  
                                this.dialog_ao=false
                            }
                this.acceptDialogAO();
                var old_ao=this.ao
                this.ao=this.empty_account_operation()
                this.ao.datetime=old_ao.datetime.setSeconds( old_ao.datetime.getSeconds() + 1 )
                this.dialog_ao=true
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },

            editAO (item) {
                console.log(item)
                this.ao=item
                this.ao.datetime=new Date(this.ao.datetime)
                this.editing_ao=true
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
                    this.refreshTable()
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
        },
        mounted(){
            console.log(this.$refs)
            this.refreshTable()
        }
    }
</script>

