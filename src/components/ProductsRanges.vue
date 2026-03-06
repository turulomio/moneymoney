<template>
    <div data-test="ProductsRanges">
        <h1> {{ $t('Product ranges') }}</h1>
        <v-card class="ma-4 pa-4">   
            
            <v-form ref="form" v-model="form_valid">             
                <v-row class="d-flex pl-5 pr-5 mx-auto">
                <AutocompleteProducts data-test="ProductsRanges_Product" class="mr-5" v-model="newpr.product" :rules="RulesSelection(true)" />
                <v-autocomplete data-test="ProductsRanges_Investments" class="mr-5" :items="getInvestmentsByProduct(newpr.product)" v-model="newpr.investments" :label="$t('Select investments to include')" item-title="fullname" item-value="url" multiple :rules="RulesSelection(true)" chips></v-autocomplete>

                </v-row>
                <v-row class="pl-5 pr-5">                
                <v-select data-test="ProductsRanges_RecomendationMethod" class="mr-5" :items="getArrayFromMap(store.recomendation_methods)" v-model="newpr.recomendation_methods" :label="$t('Set recomendation method')"  item-title="name" item-value="id" :rules="RulesSelection(true)"></v-select>  

                <v-text-field data-test="ProductsRanges_PercentageBetweenRanges" class="mr-5" v-model.number="newpr.percentage_between_ranges"  :label="$t('Set percentage between ranges')" :placeholder="$t('Set percentage between ranges')" :rules="RulesFloat(10,true,6)" counter="10"/>
                <v-text-field data-test="ProductsRanges_PercentageGains" class="mr-5" v-model.number="newpr.percentage_gains"  :label="$t('Set percentage gains')" :placeholder="$t('Set percentage gains')" :rules="RulesFloat(10,true,6)" counter="10"/>
                <v-text-field data-test="ProductsRanges_AmountToInvest" class="mr-5" v-model.number="newpr.amount_to_invest"  :label="$t('Set the amount to invest')" :placeholder="$t('Set the amount to invest')" :rules="RulesFloat(10,true,6)" counter="10"/>

                <v-text-field data-test="ProductsRanges_AdditionalRanges" class="mr-5" v-model.number="newpr.additional_ranges"  :label="$t('Additional ranges to show')" :placeholder="$t('Additional ranges to show')" :rules="RulesInteger(2,true)" counter="2"/>
                <v-checkbox data-test="ProductsRanges_TotalizedOperations" class="mr-5" v-model="newpr.totalized_operations" :label="$t('Show totalized investments operations?')" ></v-checkbox>
                <v-btn data-test="ProductsRanges_ButtonShow" class="mt-2" color="primary" @click="accept" :disabled="!form_valid">{{ $t("Show ranges") }}</v-btn>

                </v-row>
            </v-form>
        </v-card>
                    <p >{{ currentpricelabel }}</p>

        <v-card flat class="ma-4 pa-4">
            <v-tabs v-model="tab" grow bg-color="secondary">
                <v-tab key="0" data-test="ProductsRanges_TabTable">{{ $t('Product ranges table') }}</v-tab>
                <v-tab key="1" data-test="ProductsRanges_TabChart">{{ $t('Product ranges chart') }}</v-tab>
            </v-tabs>
            <v-window v-model="tab">
            <v-window-item key="0">
                <v-card flat>
                    <v-data-table data-test="ProductsRanges_Table" density="compact" :headers="tableHeaders" :items="tableData" class="elevation-1" :sort-by="['value']" :sort-type="['desc']" fixed-header height="360"     :items-per-page="10000" >
                        <template #item.value="{item}">
                            <div  @click="showLimits(item)" :class="item.current_in_range ? 'boldgreen' : ''">{{currency_string(item.value, prdata.product.currency) }}</div>
                        </template>    
                            <template #item.recomendation_invest="{item}">
                            <v-icon small v-if="item.recomendation_invest" >mdi-check-outline</v-icon>
                        </template>                        
                            <template #item.investments_inside="{item}">
                            <div v-for="o in item.investments_inside" :key="o.name" @click="on_investments_inside_click(o)">{{ f($t("[0]. Invested: [1]"), [o.name, currency_string(o.invested, prdata.product.currency)]) }}<br></div>
                        </template>                      
                            <template #item.orders_inside="{item}">
                            <div  v-for="o in item.orders_inside" :key="o.name" @click="on_orders_inside_click(o)">{{ f($t("[0]. Amount: [1]"), [o.name, currency_string(o.amount, prdata.product.currency)]) }}<br></div>
                        </template>
                            <template #item.actions="{item}">
                            <v-icon :data-test="`ProductsRanges_Table_IconAddOrder${item.id}`" small class="mr-2" @click="addOrder(item)" :color="(item.recomendation_invest) ? '' : 'red'">mdi-cart</v-icon>
                        </template>
                        <template #bottom ></template>   
                    </v-data-table>   
                    </v-card>
                </v-window-item>
                <v-window-item key="1" >
                    <div style="height: 600px;" data-test="ProductsRanges_Chart">
                        <ChartProductsRanges v-if="showchart" :prdata="prdata" autoresize data-test="ProductsRanges_Chart_Component" />
                    </div>
                </v-window-item>
            </v-window>
        </v-card>
        <!-- Order CU dialog -->
        <v-dialog v-model="dialog_ordercu" max-width="40%">
            <v-card class="pa-4">
                <OrdersCU :order="order" mode="C" @cruded="on_OrdersCU_cruded" :key="key"  :investments="investments_for_orders" />
            </v-card>
        </v-dialog>
        <!-- Orders LIST -->
        <v-dialog v-model="dialog_orders_list" @click:outside="on_dialog_orders_list_click_outside">
            <v-card class="pa-4">
                <OrdersList :key="key"></OrdersList>
            </v-card>
        </v-dialog>
        <!-- Investment view  -->
        <v-dialog v-model="dialog_investment_view" @click:outside="on_dialog_investment_view_click_outside">
            <v-card class="pa-4">
                <InvestmentsView :key="key" :investment_id="investment.id"></InvestmentsView>
            </v-card>
        </v-dialog>
    </div>
</template>


<script setup>
    import { ref, computed, watch } from 'vue'
    import { useI18n } from 'vue-i18n'
    import {empty_products_ranges, empty_order} from '../empty_objects.js'
    import { useStore } from "@/store"
    import { RulesSelection, RulesInteger, RulesFloat, f } from 'vuetify_rules'
    import axios from 'axios'
    import { parseResponseError, currency_string, myheaders, getArrayFromMap, getInvestmentsByProduct } from '@/functions.js'

    const props = defineProps({
        pr:{
            required:false,
        }
    })

    const store = useStore()
    const { t } = useI18n()
    const form = ref(null)

    const showchart = ref(false)
    const tab = ref(null)
    const tableHeaders = ref([
        { title: t('Value'), key: 'value',sortable: true, width:"7%"},
        { title: t('Must Invest'), key: 'recomendation_invest',sortable: false, width:"5%"},
        { title: t('Investments'),  sortable: false, key: 'investments_inside'},
        { title: t('Orders'),  sortable: false, key: 'orders_inside'},
        { title: t('Actions'), key: 'actions', sortable: false , width:"7%"},
    ])
    const newpr = ref(empty_products_ranges())
    const currentpricelabel = ref("")
    const prdata = ref(null)
    const form_valid = ref(false)
    const tableData = ref([])
    const loading = ref(false)

    //Dialog OrderCU
    const dialog_ordercu = ref(false)
    const order = ref(null)
    const key = ref(0)

    //Dialog orders list
    const dialog_orders_list = ref(false)

    //Dialog investment view
    const dialog_investment_view = ref(false)
    const investment = ref(null)

    watch(tab, () => {
        showchart.value = false
        if (tab.value == 1) setTimeout(() => { showchart.value = true }, 300)
    })

    const investments_for_orders = computed(() => {
        //Show only investments in this product range
        const r=[]
        if (newpr.value.investments){
            newpr.value.investments.forEach(o=>{
                r.push(store.investments.get(o))
            })
        }
        return r
    })

    function accept(){
        if (form_valid.value!=true) {
            form.value.validate()
            return
        }
        refreshTable()
    }

    function addOrder(item){
        order.value=empty_order()
        order.value.price=item.value
        order.value.current_price=prdata.value.product.last
        order.value.shares=Math.floor(newpr.value.amount_to_invest/order.value.price)
        console.log(order.value)
        key.value=key.value+1
        dialog_ordercu.value=true
    }

    function refreshTable(){
        loading.value=true
        var headers={...myheaders(),params:newpr.value}
        axios.get(`${store.apiroot}/products/ranges/`, headers)
        .then((response) => {
            console.log("Products ranges", response.data)
            prdata.value=response.data
            tableData.value=prdata.value.pr
            currentpricelabel.value= f(t("Current price: [0]"), [currency_string(prdata.value.product.last, prdata.value.product.currency)]) + ". "
            Object.keys(prdata.value.dataframe[0]).filter(key => !["date", "open", "high", "low", "close", "products_id"].includes(key)).forEach(indicator=> {
                currentpricelabel.value+= ` ${indicator}: ${currency_string(prdata.value.dataframe[prdata.value.dataframe.length-1][indicator], prdata.value.product.currency)}`
            })
            loading.value=false
        }, (error) => {
            parseResponseError(error, t, store)
        });
    }

    function showLimits(item){
        let s=f(t("Range center: [0]"), [currency_string(item.value, prdata.value.product.currency)])
        alert(`${s}\n${item.limits}`)
    }

    function on_OrdersCU_cruded(){
        dialog_ordercu.value=false
        refreshTable()
    }

    function on_orders_inside_click(){
        dialog_orders_list.value=true
    }

    function on_dialog_orders_list_click_outside(){
        dialog_orders_list.value=false
        refreshTable()
    }

    function on_investments_inside_click(inv){
        investment.value=inv
        dialog_investment_view.value=true
    }

    function on_dialog_investment_view_click_outside(){
        dialog_investment_view.value=false
        refreshTable()
    }

    if (props.pr!=null){
        newpr.value=Object.assign({},props.pr)
        refreshTable()
    }
</script>
