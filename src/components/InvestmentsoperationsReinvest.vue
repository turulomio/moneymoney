<template>
    <div>
        <h1>{{ title }}
            <MyMenuInline data-test="InvestmentsoperationsReinvest_MyMenuInline" :items="menu_items"/>
        </h1>                

        <v-card class="pa-4 mb-3 mt-3"  >
            <v-form ref="form" v-model="form_valid" class="pa-4" data-test="InvestmentsoperationsReinvest_Form">
                <v-row>
                    <v-select data-test="InvestmentsoperationsReinvest_ReinvestOrDivest" class="mr-5" :items="re_or_di_items" v-model="re_or_di" :label="t('Do you want to reinvest or divest?')"  item-title="name" item-value="id" :rules="RulesSelection(true)" @update:model-value="refreshTables"></v-select>  
                    <v-select data-test="InvestmentsoperationsReinvest_ViewOption" class="mr-5" :disabled="loading || (ios_id_after==null)" :items="viewoptions" v-model="viewoption" :label="t('Set a view option')"  item-title="name" item-value="id" :rules="RulesSelection(true)" @update:model-value="refreshTables"></v-select>  
                </v-row>
                <v-row>                
                    <v-text-field data-test="InvestmentsoperationsReinvest_NewPrice" class="mr-5" v-model.number="newprice"  :label="t('Set order price')" :placeholder="t('Set order price')" :rules="RulesFloatGEZ(10,true, product.decimals)" counter="10"/>
                    <v-text-field data-test="InvestmentsoperationsReinvest_NewShares" v-model.number="newshares"  :label="t('Set order shares')" :placeholder="t('Set order shares')" :rules="RulesFloat(14,true,6)" counter="14"/>
                </v-row>
                <v-row>
                    <v-select data-test="InvestmentsoperationsReinvest_GainsMethods" class="mr-5" :items="gains_methods" v-model="gains_method" :label="t('Set a method to calculate gains')"  item-title="name" item-value="id" :rules="RulesSelection(true)"></v-select>  
                    <v-text-field data-test="InvestmentsoperationsReinvest_GainsValue" class="mr-5" autoindex="1" :disabled="loading" v-model.number="gains_value"  :label="t('Gains method value')" :placeholder="t('Gains method value')" :rules="RulesFloat(8,true,6)" counter="8"/>
                    <v-btn data-test="InvestmentsoperationsReinvest_ButtonAddOrder" class="ml-5" color="error" @click="add_order">{{ t("Add order") }}</v-btn>                 
                    <v-btn data-test="InvestmentsoperationsReinvest_ButtonSimulate" class="ml-5" color="primary" @click="make_all_axios_after">{{ t("Simulate") }}</v-btn>               
                </v-row>
            </v-form>  

        </v-card>
        <v-tabs v-if="ios_id_current" bg-color="secondary" v-model="tab" grow show-arrows>
            <v-tab data-test="InvestmentsoperationsReinvest_TabCurrent" key="current">{{ t('Current investment operations') }}</v-tab>
            <v-tab data-test="InvestmentsoperationsReinvest_TabOperations" key="operations">{{ t('Investment operations') }}</v-tab>
            <v-tab data-test="InvestmentsoperationsReinvest_TabHistorical" key="historical">{{ t('Historical investment operations') }}</v-tab>
            <v-tab data-test="InvestmentsoperationsReinvest_TabChart" key="chart">{{ t('Investment chart') }}</v-tab>
        </v-tabs>
        <v-window v-if="ios_id_current" v-model="tab">
            <v-window-item key="current">      
                <div>
                    <v-card>
                        <TableInvestmentOperationsCurrent showtotal :items="ios_id_current.io_current" output="investment" height="400" :key="key" :loading="loading" />
                    </v-card>
                </div>
            </v-window-item>
            <v-window-item key="operations">          
                <div>
                    <v-card>
                        <TableInvestmentOperations :items="ios_id_current.io" height="400" :key="key" output="investment" :loading="loading" />
                    </v-card>
                </div>
            </v-window-item>
            <v-window-item key="historical">     
                <div>            
                    <v-card>
                        <TableInvestmentOperationsHistorical :items="ios_id_current.io_historical" height="400" output="investment" :key="key" :loading="loading" showtotal />
                    </v-card>
                </div>
            </v-window-item>
            <v-window-item key="chart">     
                <div> 
                    <v-card>
                        <ChartInvestments :data="chart_data" height="400" :key="key" :loading="loading"></ChartInvestments>
                    </v-card>
                </div>
            </v-window-item>
        </v-window> 

        <!-- Order CU dialog -->
        <v-dialog v-model="dialog_order_cu" max-width="550">
            <v-card class="pa-4" data-test="InvestmentsoperationsReinvest_OrdersCUDialog">
                <OrdersCU :order="order" mode="C" :key="key" @cruded="on_OrdersCU_cruded" :investments="[investment,]"></OrdersCU>
            </v-card>
        </v-dialog>
    </div>
</template>  
<script setup>
    import { ref, computed, onMounted } from 'vue'
    import axios from 'axios'
    import { useStore } from "@/store"
    import { useI18n } from 'vue-i18n'
    import MyMenuInline from './MyMenuInline.vue'
    import {empty_order, empty_ios,empty_ios_simulation_operation,empty_investments_chart,empty_investments_chart_limit_line} from '../empty_objects.js'
    import { my_round, RulesSelection,RulesFloat,RulesFloatGEZ,parseNumber,f } from 'vuetify_rules'
    import ChartInvestments from './ChartInvestments.vue'
    import OrdersCU from './OrdersCU.vue'
    import TableInvestmentOperations from './TableInvestmentOperations.vue'
    import TableInvestmentOperationsHistorical from './TableInvestmentOperationsHistorical.vue'
    import TableInvestmentOperationsCurrent from './TableInvestmentOperationsCurrent.vue'
    import { myheaders, getMapObjectById } from '@/functions'

    const props = defineProps({
        ios_id: { //object plinvestmentsoperations id can be investment or virtual investment (Merged)
                    //it uses only current_operations to make simulation 
            required: true,
        },
        shares: {
            type: Number,
            required: false,
            default: 0,
        },
        price: {
            type: Number,
            required: false,
            default: 0,
        }
    })

    const { t } = useI18n()
    const store = useStore()

    const title = ref("")
    const re_or_di = ref(1)
    const viewoption = ref(1)
    const gains_method = ref(1)
    const tab = ref(0)
    const key = ref(0)
    const gains_value = ref(10)
    const dialog_order_cu = ref(false)
    const order = ref(null)
    const newshares = ref(0)
    const newprice = ref(0)
    const chart_data = ref(null)
    const ohcls = ref(null)
    const ios_id_after = ref(null)
    const loading = ref(false)
    const form_valid = ref(false)
    const form = ref(null)

    const re_or_di_items = [
        {id:1, name: t('Reinvest')},
        {id:2, name: t('Divest')},
    ]
    const viewoptions = [
        {id:1, name: t('Before simulation')},
        {id:2, name: t('After simulation')},
    ]
    const gains_methods = [
        {id:1, name: t('Gain a porcentage from invested amount')},
        {id:2, name: t('Gain a fixed amount')},
    ]

    const menu_items = [
        {
            subheader: t('Options to reinvest'),
            children: [
                {
                    name: t('Integer shares from amount to reinvest'),
                    code: () => {
                        var amount=parseNumber(prompt( t("Please set the amount to invest in this order"), 10000 ));
                        newshares.value=parseInt(amount/newprice.value)
                    },
                    icon: "mdi-book-plus",
                },
                {
                    name: t('Decimal shares from amount to reinvest'),
                    code: () => {
                        var amount=parseNumber(prompt( t("Please set the amount to invest in this order"), 10000 ));
                        newshares.value=amount/newprice.value
                    },
                    icon: "mdi-book-plus",
                },
            ]
        },
        {
            subheader: t('Options to divest'),
            children: [
                {
                    name: t('Integer shares to consolidate losses'),
                    code: () => {
                        if (re_or_di.value==1){
                            alert(t("Please select divest option to use this action"))
                            return
                        }
                        
                        var losses=parseNumber(prompt( t("Please set losses to consolidate (Positive amount)"), 500 ));

                        var resultado=0
                        for (var i = 0; i < props.ios_id.io_current.length; i++) {
                            var o=props.ios_id.io_current[i]
                            var gains=o.gains_gross_investment
                            if (losses+gains==0){
                                resultado=resultado+o.shares
                                break
                            } else if (losses+gains>0){
                                resultado=resultado+o.shares
                                losses=losses+gains
                            } else if (losses+gains<0){
                                resultado=resultado+Math.abs(parseInt(losses*o.shares/gains))
                                break
                            }
                        }
                        newshares.value=-resultado
                    },
                    icon: "mdi-book-plus",
                },
                {
                    name: t('Decimal shares to consolidate losses'),
                    code: () => {
                        if (re_or_di.value==1){
                            alert(t("Please select divest option to use this action"))
                            return
                        }
                        var losses=parseNumber(prompt( t("Please set losses to consolidate (Positive amount)"), 500 ));

                        var resultado=0
                        for (var i = 0; i < props.ios_id.io_current.length; i++) {
                            var o=props.ios_id.io_current[i]
                            var gains=o.gains_gross_investment
                            if (losses+gains==0){
                                resultado=resultado+o.shares
                                break
                            } else if (losses+gains>0){
                                resultado=resultado+o.shares
                                losses=losses+gains
                            } else if (losses+gains<0){
                                resultado=resultado+Math.abs(losses*o.shares/gains)
                                break
                            }
                        }
                        newshares.value=-my_round(resultado,6)
                    },
                    icon: "mdi-book-plus",
                },
            ]
        },
    ]

    const ios_id_current = computed(() => {
        return (viewoption.value == 1) ? props.ios_id : ios_id_after.value
    })

    const product = computed(() => {
        if (!ios_id_current.value) return {}
        return getMapObjectById("products", ios_id_current.value.data.products_id)
    })

    const investment = computed(() => {
        if (!ios_id_current.value) return null
        return getMapObjectById("investments", ios_id_current.value.data.investments_id)
    })

    function set_title(){
        if (re_or_di.value==1){
            title.value= t("Reinvest dialog")
        } else {
            title.value=t("Divest dialog")
        }
    }

    function add_order(){
        order.value=empty_order()
        order.value.price=newprice.value
        order.value.shares=newshares.value
        order.value.investments=investment.value.url
        key.value=key.value+1
        dialog_order_cu.value=true
    }

    function on_OrdersCU_cruded(){
        dialog_order_cu.value=false
    }

    function refreshProductQuotes(){
        return axios.get(`${store.apiroot}/products/quotes/ohcl?product=${product.value.url}`, myheaders())
    }

    function simulateOrderAfter(){
        var simulation=empty_ios()
        simulation.investments.push(parseInt(props.ios_id.data.investments_id))
        simulation.currency=store.profile.currency

        var operation=empty_ios_simulation_operation()
        operation.shares=newshares.value
        operation.price=newprice.value
        operation.comment="Simulation 1"
        operation.investments_id=parseInt(props.ios_id.data.investments_id)
        simulation.simulation.push(operation)
        return axios.post(`${store.apiroot}/ios/`, simulation, myheaders())
    }

    function make_all_axios_before(){
        loading.value=true
        axios.all([refreshProductQuotes(),])
        .then(([resQuotes,]) => {
            ohcls.value=resQuotes.data
            loading.value=false
            refreshTables()
        });
    }

    function make_all_axios_after(){  
        //Calculate shares before
        var shares_before=0
        props.ios_id.io_current.forEach(o=>{
            shares_before=shares_before + o.shares
        }) 

        if (newshares.value<=0 && re_or_di.value==1){
            alert(t("To reinvest shares must be positive"))
            return
        }
        if (newshares.value>=0 && re_or_di.value==2){
            alert(t("To divest shares must be negative"))
            return
        }

        if (Math.abs(newshares.value)>=shares_before && re_or_di.value==2){
            alert(f(t("You're divesting the whole investment shares ([0])"), [Math.abs(newshares.value)]))
            return
        }
        viewoption.value=2
        loading.value=true
        axios.all([simulateOrderAfter(),])
        .then(([resAfter,]) => {
            ios_id_after.value=resAfter.data[props.ios_id.data.investments_id]
            loading.value=false
            refreshTables()
        });
    }

    function refreshTables(){
        set_title()
        var ll
        chart_data.value=empty_investments_chart()
        chart_data.value.ios_id=ios_id_current.value
        chart_data.value.ohcls=ohcls.value
        if (props.ios_id.io_current.length>0){                  
            //Calculate shares before
            var shares_before=0
            props.ios_id.io_current.forEach(o=>{
                shares_before=shares_before + o.shares
            }) 
            ll=empty_investments_chart_limit_line()
            ll.buy=props.ios_id.total_io_current.average_price_investment
            ll.average=props.ios_id.total_io_current.average_price_investment
            if (gains_method.value==1){
                ll.sell=ll.average*(1+gains_value.value/100)
            } else {//P_f={P_o Ac Ap +G } over {Ac Ap } Fixed amount
                ll.sell=(ll.average*shares_before*product.value.real_leveraged_multiplier+gains_value.value)/(shares_before*product.value.real_leveraged_multiplier)
            }
            chart_data.value.limitlines.push(ll)
        }

        if(viewoption.value==2 && ios_id_current.value){//After
            //Calculate shares after
            var shares_after=0
            ios_id_current.value.io_current.forEach(o=>{
                shares_after=shares_after + o.shares
            }) 
            var ll2=empty_investments_chart_limit_line()
            ll2.buy=newprice.value
            ll2.average=ios_id_current.value.total_io_current.average_price_investment
            if (gains_method.value==1){
                ll2.sell=ll2.average*(1+gains_value.value/100)
            } else {//P_f={P_o Ac Ap +G } over {Ac Ap } Fixed amount
                ll2.sell=(ll2.average*shares_after*product.value.real_leveraged_multiplier+gains_value.value)/(shares_after*product.value.real_leveraged_multiplier)
            }
            chart_data.value.limitlines.push(ll2)
        }
        key.value=key.value+1
    }

    onMounted(() => {
        newshares.value=props.shares
        newprice.value=props.price
        make_all_axios_before()
    })
</script>
