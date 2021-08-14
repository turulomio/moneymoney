<template>
    <div>
        <h1>{{ $t(`Strategy details of '${strategy.name }'`)}}
        <MyMenuInline :items="items" @selected="MyMenuInlineSelection"></MyMenuInline>  </h1>

        <p><strong>{{ $t('Id')}}: </strong>{{ strategy.id }}</p>
        <p><strong>{{ $t('Number')}}: </strong>{{ strategy.number }}</p>
        <p><strong>{{ $t('Currency')}}: </strong>{{ strategy.currency }}</p>

    
        <v-tabs v-model="tab">
            <v-tab key="ao">{{ $t("Strategy operations")}}</v-tab>
            <v-tab key="cc">{{ $t("Credit cards")}}</v-tab>
            <v-tab-item key="ao">     
                <v-card class="pa-4 d-flex justify-center" outlined style="min-width: 100px; max-width: 100%;">
                    <v-date-picker dense no-title class="mymonthpicker " ref="monthpicker" v-model="monthpicker" type="month"></v-date-picker>
                    <v-divider class="mx-2" vertical ></v-divider>
                    
                </v-card>
            </v-tab-item>
            <v-tab-item key="cc">
                <v-card class="padding" outlined>
                    <v-checkbox v-model="showActiveCC" :label="setCheckboxLabelCC()" @click="on_chkActive_cc()" ></v-checkbox>
                    <v-data-table dense :headers="table_cc_headers" :items="table_cc"  class="elevation-1" disable-pagination  hide-default-footer sort-by="name" fixed-header max-height="400">         
                        <template v-slot:[`item.deferred`]="{ item }">
                            <v-simple-checkbox v-model="item.deferred" disabled></v-simple-checkbox>
                        </template>  
                        <template v-slot:[`item.maximumbalance`]="{ item }">
                            <div v-html="currency_html(item.maximumbalance, item.strategy_currency )"></div>
                        </template>  
                        <template v-slot:[`item.balance`]="{ item }">
                            <div v-html="currency_html(item.balance, item.strategy_currency )"></div>
                        </template>     
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon v-if="item.deferred" small class="mr-2" @click="viewCC(item)">mdi-eye</v-icon>
                            <v-icon v-if="!item.deferred" small class="mr-2" @click="CCONotDeferred(item)">mdi-plus</v-icon>
                            <v-icon small class="mr-2" @click="editCC(item)">mdi-pencil</v-icon>
                            <v-icon small @click="deleteCC(item)" v-if="item.is_deletable">mdi-delete</v-icon>
                        </template>
                    </v-data-table>   
                </v-card>
            </v-tab-item>
        </v-tabs>  
        <!-- DIALOG ACCOUNTSOPERATIONS ADD/UPDATE -->
        <v-dialog v-model="dialog_ao" max-width="550">
            <v-card class="pa-4">
                <v-card-title class="headline">{{dialog_title_ao()}}</v-card-title>
                <v-form ref="form_ao" v-model="form_valid_ao" lazy-validation>
                    <v-autocomplete :items="$store.state.catalogs.strategies.filter(v =>v.active==true)" v-model="ao.strategies" :label="$t('Select an strategy')" item-text="name" item-value="url" required :rules="RulesSelection(true)"></v-autocomplete>
                    <MyDateTimePicker label="Select operation date and time" v-model="ao.datetime"> </MyDateTimePicker>
                    <v-autocomplete :items="$store.state.catalogs.concepts" v-model="ao.concepts" :label="$t('Select a concept')" item-text="name" item-value="url" required :rules="RulesSelection(true)"></v-autocomplete>
                    <v-text-field ref="ao_amount" v-model="ao.amount" type="number" :label="$t('Operation amount')" required :placeholder="$t('Strategy number')" :rules="RulesFloat(30,true)" counter="30"/>
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
        <!-- DIALOG CREDIT CARD ADD/UPDATE -->
        <v-dialog v-model="dialog_cc" max-width="550">
            <v-card class="pa-4">
                <v-card-title class="headline">{{dialog_title_cc()}}</v-card-title>
                <v-form ref="form" v-model="form_valid_cc" lazy-validation>
                    <v-autocomplete :items="$store.state.catalogs.strategies.filter(v =>v.active==true)" v-model="cc.strategies" :label="$t('Select an strategy')" item-text="name" item-value="url" required :rules="RulesSelection(true)"></v-autocomplete>
                    <v-text-field v-model="cc.name" type="text" :label="$t('Credit card name')" required :placeholder="$t('Credit card name')" autofocus  counter="200" :rules="RulesString(200,true)"/>
                    <v-text-field v-model="cc.number" type="text" :label="$t('Credit card number')" required :placeholder="$t('Credit card number')" counter="30" :rules="RulesString(30,false)"/>
                    <v-text-field v-model="cc.maximumbalance" type="number" :label="$t('Credit card maximum balance')" required :placeholder="$t('Credit card maximum balance')" :rules="RulesInteger(10,true)" counter="10"/>
                    <v-checkbox v-model="cc.active" :label="$t('Is active?')"></v-checkbox>
                    <v-checkbox v-model="cc.deferred" :label="$t('Has deferred payments?')"></v-checkbox>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="acceptDialogCC()" :disabled="!form_valid_cc">{{ $t("Add") }}</v-btn>
                    <v-btn color="error" @click="dialog_cc = false">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <!-- DIALOG CREDIT CARD VIEW -->
        <v-dialog v-model="dialog_ccview">
            <v-card class="pa-4">
                <CreditcardsView :cc="cc" :strategy="strategy"></CreditcardsView>
            </v-card>
        </v-dialog>
    </div>
</template>  
<script>     
    import axios from 'axios' 
    import MyMenuInline from './MyMenuInline.vue'
    import CreditcardsView from './CreditcardsView.vue'
    import MyDateTimePicker from './MyDateTimePicker.vue'
    export default {
        components:{
            MyMenuInline,
            CreditcardsView,
            MyDateTimePicker,
        },
        props:{
            strategy:{
                required:true,
            }
        },
        data () {
            return {
                monthpicker: new Date().toISOString().substr(0, 7),
                tab:0,
                items_ao: [],           
                items: [
                    { subheader:this.$t('Strategy orders'), children: [
                            { 
                                name:this.$t('Add an strategy transfer'), 
                                code: function(this_){
                                    this_.editing_ao=false
                                    this_.strategy=this_.empty_strategy()
                                    this_.dialog_ao=true
                                },
                                icon: "mdi-plus" 
                            },
                        ]
                    },
                    { subheader:this.$t('Strategy operations orders'), children: [
                            { 
                                name:this.$t('Add an strategy operation'), 
                                code: function(this_){
                                    this_.editing_ao=false
                                    this_.ao=this_.empty_strategy()
                                    this_.dialog_ao=true
                                },
                                icon: "mdi-plus" 
                            },

                        ]
                    },
                    { subheader:this.$t('Credit card orders'), children: [
                            { 
                                name:this.$t('Add a credit card'), 
                                code: function(this_){
                                    this_.editing_cc=false
                                    this_.cc=this_.empty_credit_card()
                                    this_.dialog_cc=true
                                },
                                icon: "mdi-plus" 
                            },
                        ]
                    },
                ],
                // DIALOG CREDIT CARDS
                table_cc_headers:[
                    { text: this.$t('Name'), value: 'name',sortable: true },
                    { text: this.$t('Number'), value: 'number',sortable: false},
                    { text: this.$t('Deferred'), value: 'deferred',sortable: false},
                    { text: this.$t('Maximum balance'), value: 'maximumbalance',sortable: false, align:"right"},
                    { text: this.$t('Balance'), value: 'balance',sortable: true ,align:"right"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ],
                table_cc:[],
                showActiveCC:true,
                form_valid_cc:true,
                dialog_cc:false,
                editing_cc:false,
                cc: this.empty_credit_card(),

                // DIALOG ACCOUNT OPERATIONS
                form_valid_ao:true,
                dialog_ao:false,
                editing_ao:false,
                following_ao:false,
                ao: this.empty_strategy(),

                // DIALOG CREDIT CARDS VIEW
                dialog_ccview:false,
            }  
        },
        watch:{
            monthpicker: function (){
                this.refreshTable()
            }
        },
        methods: {
            CCONotDeferred(item){
                this.editing_ao=false
                this.ao=this.empty_strategy()
                this.ao.comment=item.name + ". "
                this.dialog_ao=true
                
            },
            dialog_title_ao(){
                if(this.editing_ao==true){
                    return this.$t("Updating strategy operation")
                } else {
                    return this.$t("Creating a new strategy operation")
                }
            },
            dialog_title_cc(){
                if(this.editing_cc==true){
                    return this.$t("Updating credit card")
                } else {
                    return this.$t("Creating a new credit card")
                }
            },
            empty_strategy(){
                return {
                    datetime: new Date().toISOString(),
                    concepts: null,
                    operationstypes:null,
                    amount: 0,
                    comment: "",    
                    strategies: this.strategy.url,
                }
            },
            empty_credit_card(){
                return {
                    name: "",
                    number: "",
                    deferred: false,
                    maximumbalance: 0,
                    active: true,   
                    strategies: this.strategy.url,
                }
            },
            MyMenuInlineSelection(item){
                item.code(this)
            },
            refreshTable(){
                //var this_=this //Needs this inside axios seems with browser vue method
                axios.get(`${this.$store.state.apiroot}/strategiesoperations/withbalance/?strategy=${this.strategy.id}&year=${this.monthpicker.slice(0,4)}&month=${this.monthpicker.slice(5,7)}`, this.myheaders())                
                .then((response) => {
                    this.items_ao=response.data;
                    console.log(this.items_ao)
                    this.$refs.table_ao.gotoLastRow()
                }) 
                .catch((error) => {
                    console.log(error)
                    alert("Something is wrong")
                });
            },
            refreshTableCC(){
                //var this_=this //Needs this inside axios seems with browser vue method
                axios.get(`${this.$store.state.apiroot}/creditcards/withbalance/?strategy=${this.strategy.id}&active=${this.showActiveCC}`, this.myheaders())                
                .then((response) => {
                    this.table_cc=response.data;
                }) 
                .catch((error) => {
                    console.log(error)
                    alert("Something is wrong")
                });
            },
          
            editCC(item){
                this.cc=item
                this.editing_cc=true
                this.dialog_cc=true
            },
            viewCC(item){
                this.cc=item
                this.dialog_ccview=true
            },
            deleteCC(item){
                var r = confirm(this.$t("Do you want to delete this credit card?"))
                if(r == false) {
                    return
                }  
                r = confirm(this.$t("Are you sure?. If you used this credit card you should mark it as inactive"))
                if(r == false) {
                    return
                }  
                axios.delete(item.url, this.myheaders())
                .then((response) => {
                    console.log(response);
                    this.refreshTableCC()
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_chkActive_cc(){
                this.refreshTableCC()
            },
            setCheckboxLabelCC(){
                if (this.showActiveCC == true){
                    return this.$t("Uncheck to see inactive credit cards")
                } else {
                    return this.$t("Check to see active credit cards")
                }
            },
            acceptDialogAO(){
                //Validation
                if( this.$refs.form_ao.validate()==false) return
                var operationtype=this.get_operationstypes_from_concept(this.ao.concepts)
                this.ao.operationstypes=operationtype.url
                if (operationtype.id==1 && this.ao.amount>0){
                     alert(this.$t("Amount must be negative"))
                     return
                }
                if (operationtype.id==2 && this.ao.amount<0) {
                    alert(this.$t("Amount must be positive"))
                    return
                }

                //Accept
                if (this.editing_ao==true){               
                    axios.put(this.ao.url, this.ao, this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.refreshTable()     
                            this.dialog_ao=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/strategiesoperations/`, this.ao,  this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.refreshTable()                             
                            if (this.following_ao==true){
                                this.dialog_ao=true
                                var dt=this.zulu2date(this.ao.datetime)
                                var olddtseconds=this.zulu2date(this.ao.datetime).getSeconds()
                                dt.setSeconds(olddtseconds+60)
                                this.ao.datetime=this.date2zulu(dt)
                            } else {  
                                this.dialog_ao=false
                            }
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
            acceptDialogCC(){
                console.log(this.cc)
                if (this.editing_cc==true){               
                    axios.put(this.cc.url, this.cc, this.myheaders())
                    .then((response) => {
                            console.log(response.data)
                            this.refreshTableCC()     
                            this.dialog_cc=false
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else{
                    axios.post(`${this.$store.state.apiroot}/api/creditcards/`, this.cc,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.refreshTableCC()
                        this.dialog_cc=false
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
                var r = confirm(this.$t("Do you want to delete this strategy operation?"))
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
            this.refreshTable()
            this.refreshTableCC()
        }
    }
</script>

