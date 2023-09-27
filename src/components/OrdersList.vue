<template>
    <div>    
        <h1>{{ $t('Orders list') }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>
        <div class="d-flex justify-center mb-4">
            <v-card width="20%" class="pa-5">
                <v-select density="compact" :label="$t('Filter by order state')" v-model="state" :items="items_state" item-value="id" item-title="name" />
            </v-card>
        </div>
        <v-card outlined class="ma-4 pa-4">

            <v-data-table density="compact" :headers="headers" :items="data" class="elevation-1 cursorpointer" :sort-by="getSort()" :loading="loading_table"  @click:row="orderView" :items-per-page="10000" >
                <template #item.price="{ item }">
                    <div class="text-right" v-html="currency_html(item.price, item.currency )"></div>
                </template>  
                <template #item.amount="{ item }">
                    <div class="text-right" v-html="currency_html(item.amount, item.currency )"></div>
                </template>  
                <template #item.percentage_from_price="{ item }">
                    <div class="text-right" v-html="percentage_html(item.percentage_from_price )"></div>
                </template>  
                <template #item.shares="{item}"><div class="text-right">{{ item.shares }}</div></template>
                <template #item.executed="{ item }">
                    <div v-html="localtime(item.executed )"></div>
                </template>  
                <template #item.actions="{item}">
                    <v-icon small class="mr-2" @click.stop="executeOrder(item)">mdi-play</v-icon>
                    <v-icon small class="mr-2" @click.stop="editItem(item)">mdi-pencil</v-icon>
                    <v-icon small @click.stop="deleteItem(item)">mdi-delete</v-icon>
                </template>          
                <template #tbody v-if="data.length>0">
                    <tr class="totalrow pa-6">
                        <td colspan="2">{{ $t("Total ([0] registers)").format(data.length) }}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </template>    
                <template #bottom ></template>                        
            </v-data-table>
        </v-card>
        <div class="d-flex justify-center mb-4">
                <v-btn color="primary" class="mr-4" @click="products_autoupdate" :loading="products_updating">{{ $t("Products autoupdate")}}
                    <v-badge inline v-show="update_errors>0" color="error" class="ml-2" :content="$t('[0] errors').format(update_errors)"/>
                </v-btn>
        </div>
        <!-- Order CU dialog -->
        <v-dialog v-model="dialog_cu" max-width="550">
            <v-card class="pa-4">
                <OrdersCU :order="order" :mode="order_mode" @cruded="on_OrdersCU_cruded" :key="key"></OrdersCU>
            </v-card>
        </v-dialog>

        <!-- Order View dialog -->
        <v-dialog v-model="dialog_reinvest">
            <v-card class="pa-4">
                <InvestmentsoperationsReinvest :ios_id="ios_id" v-if="order!=null" :price="order.price" :shares="order.shares" :investments="new Array(this.order.investments)" :key="key" />
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
    import axios from 'axios'
    import OrdersCU from './OrdersCU.vue'
    import InvestmentsoperationsReinvest from './InvestmentsoperationsReinvest.vue'
    import MyMenuInline from './MyMenuInline.vue'
    import {empty_order,empty_ios_simulation_operation,empty_ios} from '../empty_objects.js'
    export default {
        components:{
            MyMenuInline,
            OrdersCU,
            InvestmentsoperationsReinvest,
        },
        data(){ 
            return{
                items_state: [
                    {"id":0, "name":this.$t("Active")},
                    {"id":1, "name":this.$t("Expired")},
                    {"id":2, "name":this.$t("Executed")},
                ],
                state: 0,
                headers: [
                    { title: this.$t('Date'), sortable: true, key: 'date',  width: "6%"},
                    { title: this.$t('Expiration'), key: 'expiration',  width: "6%"},
                    { title: this.$t('Investment'), key: 'investmentsname'},
                    { title: this.$t('Shares'), key: 'shares', align:'end',  width: "7%"},
                    { title: this.$t('Price'), key: 'price', align:'end',  width: "7%"},
                    { title: this.$t('Amount'), key: 'amount', align:'end',  width: "7%"},
                    { title: this.$t('% from price'), key: 'percentage_from_price', align:'end', sortable:"true",  width: "7%"},
                    { title: this.$t('Executed'), key: 'executed', align:'end',  width: "10%"},
                    { title: this.$t('Actions'), key: 'actions', sortable: false , width: "8%"},
                ],
                data:[],
                menuinline_items: [
                    {
                        subheader: this.$t("Order options"),
                        children: [
                            {
                                name:this.$t("Add a new order"),
                                icon: "mdi-pencil",
                                code: function(){
                                    this.order=this.empty_order()
                                    this.order_mode="C"
                                    this.dialog_cu=true
                                    this.key=this.key+1
                                }.bind(this),
                            },
                        ]
                    },
                ],
                dialog_cu:false,
                order: null,
                order_mode: null,
                loading_table:false,
                //Reinvest
                dialog_reinvest:false,
                ios_id:null,
                key:0,
                //Products auto update
                products_updating:false,
                update_errors:0,
            }
        },
        watch:{
            state () {
                this.update_table()
            },
        },
        methods: {
            empty_order,
            empty_ios,
            empty_ios_simulation_operation,
            on_OrdersCU_cruded(){
                this.dialog_cu=false
                this.update_table()
            },
            editItem (item) {
                this.order=item
                this.order_mode="U"
                this.key=this.key+1
                this.dialog_cu=true
            },
            executeOrder (item) {
                this.order=item
                this.order_mode="E"
                this.key=this.key+1
                this.dialog_cu=true
            },
            orderView(event,object) {    
                this.order=object.item
                var investments_id=this.id_from_hyperlinked_url(object.item.investments)
                var simulation=this.empty_ios()
                simulation.investments.push(investments_id)
                simulation.currency=this.store().profile.currency
                return axios.post(`${this.store().apiroot}/ios/`, simulation, this.myheaders())
                .then((response)=>{
                    this.ios_id=response.data[investments_id]
                    this.key=this.key+1
                    this.dialog_reinvest=true
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            deleteItem (item) {

                this.order=item
                this.order_mode="D"
                this.key=this.key+1
                this.dialog_cu=true

            },            
            getSort(){
                if (this.state==0){//Active
                    return [{key:'percentage_from_price',order:'desc'}]
                } else if (this.state==1) { //expired
                    return [{key:'expiration',order:'desc'}]
                } else if (this.state==2) { //executed
                    return [{key:'executed',order:'desc'}]
                }
            },
            update_table(){
                this.loading_table=true
                var url=""
                if (this.state==0){//Active
                    url=`${this.store().apiroot}/api/orders/?active=true`
                } else if (this.state==1) { //expired
                    url=`${this.store().apiroot}/api/orders/?expired=true`
                } else if (this.state==2) { //executed
                    url=`${this.store().apiroot}/api/orders/?executed=true`
                }


                axios.get(url, this.myheaders())
                .then((response) => {
                    this.data=response.data
                    this.loading_table=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            setCheckboxLabel(){
                if (this.showActive== true){
                    return this.$t("Uncheck to see inactive orders")
                } else {
                    return this.$t("Check to see active orders")
                }
            },

            products_autoupdate(){
                this.products_updating=true
                axios.post(`${this.store().apiroot}/products/update/`, {auto:true,}, this.myheaders())
                .then((response) => {
                        this.update_errors=0
                        response.data.forEach(o=>{
                            if (o.log.includes("Product")) this.update_errors=this.update_errors+1
                        })
                        this.update_table()
                        this.products_updating=false
                }, (error) => {
                    this.parseResponseError(error)
                })
            },

        },
        mounted(){
            this.update_table()
        }
    }
</script>

