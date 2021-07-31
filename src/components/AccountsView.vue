<template>
    <div>
        <h1>{{ $t(`Account details of '${account.name }'`)}}
        <MyMenuInline :items="items"></MyMenuInline>  </h1>

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
                    <TableAccountOperations homogeneous :items="items_ao" :currency_account="account.currency" height="400" url_root="{% url 'home' %}" ref="table_ao" class=" flex-grow-1 flex-shrink-0" :locale='this.$i18n.locale'></TableAccountOperations>
                </v-card>
            </v-tab-item>
            <v-tab-item key="cc">
                <v-card class="padding" outlined>
                    <v-data-table dense :headers="table_cc_headers" :items="table_cc"  class="elevation-1" disable-pagination  hide-default-footer sort-by="name" fixed-header max-height="400">         
                        <template v-slot:[`item.deferred`]="{ item }">
                            <v-simple-checkbox v-model="item.deferred" disabled></v-simple-checkbox>
                        </template>  
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon small class="mr-2" @click="editCC(item)">mdi-pencil</v-icon>
                            <v-icon small class="mr-2" @click="deleteCC(item)">mdi-delete</v-icon>
                        </template>
                    </v-data-table>   
                </v-card>
            </v-tab-item>
        </v-tabs>  
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
                    { subheader:"{% trans 'Account orders' %}", children: [
                            { name:"{% trans 'Add an account transfer' %}", type: "redirection", command: "{% url 'account_transfer' origin=account.id %}", icon: "mdi-plus" },
                            { name:"{% trans 'Update this account' %}", type: "redirection", command: "{% url 'account_update' pk=account.id %}", icon: "mdi-pencil" },
                            { name:"{% trans 'Add a new investment' %}", type: "redirection", command: "{% url 'investment_new' accounts_id=account.id %}", icon: "mdi-plus" },
                        ]
                    },
                    { subheader:"{% trans 'Account operations orders' %}", children: [
                            { name:"{% trans 'Add an account operation' %}", type: "redirection", command: "{% url 'accountoperation_new' accounts_id=account.id %}", icon: "mdi-plus" },
                        ]
                    },
                    { subheader:"{% trans 'Credit card orders' %}", children: [
                            { name:"{% trans 'Add a credit card' %}", type: "redirection", command: "{% url 'creditcard_new' accounts_id=account.id %}", icon: "mdi-plus" },
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
            }  
        },
        watch:{
            monthpicker: function (){
                this.refreshTable()
            }
        },
        methods: {
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
            
            currency(value){
                return this.currency_html(value, this.account.currency)
            },
            editCC(item){
                window.location.href="{% url 'creditcard_view' pk=9999 %}".replace("9999", item.id)
            },
            deleteCC(item){
                window.location.href="{% url 'creditcard_delete' pk=9999 %}".replace("9999", item.id)
            },
        },
        mounted(){
            console.log(this.$refs)
            this.refreshTable()
        }
    }
</script>

