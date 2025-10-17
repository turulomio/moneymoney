<template>
    <v-data-table density="compact" ref="table_oc" :headers="table_headers" :items="items" class="elevation-1"  :sort-by="[{key:'datetime',order:'asc'}]" fixed-header :height="$attrs.height" :loading="$attrs.loading" :items-per-page="10000" >
        <template #item.datetime="{item}">
            <div>{{ localtime(item.datetime)}}</div>
        </template>   
        <template #item.shares="{item}">
            <div class="text-right" v-html="item.shares"></div>
        </template>             
        <template #item.investments="{item}">
            <div>{{ getMapObjectById("investments",item.investments_id).fullname }}</div>
        </template>                    
        <template #item.operationstypes="{item}">
            <div>{{ getMapObjectById("operationstypes",item.operationstypes_id).localname }}</div>
        </template>
        <template #item.price_account="{item}">
            <div class="text-right" v-html="currency_html(item.price_account, item.currency_account)"></div>
        </template>        
        <template #item.price_investment="{item}">
            <div class="text-right" v-html="currency_html(item.price_investment, item.currency_product)"></div>
        </template>  
        <template #item.price_user="{item}">
            <div class="text-right" v-html="currency_html(item.price_user, currency(item))"></div>
        </template>  
        <template #item.gains_gross_account="{item}">
            <div class="text-right" v-html="currency_html(item.gains_gross_account, currency(item))"></div>
        </template>  
        <template #item.gains_gross_investment="{item}">
            <div class="text-right" v-html="currency_html(item.gains_gross_investment, currency(item))"></div>
        </template>  
        <template #item.gains_gross_user="{item}">
            <div class="text-right" v-html="currency_html(item.gains_gross_user, currency(item))"></div>
        </template>  
        

         
        <template #item.invested_account="{item}">
            <div class="text-right" v-html="currency_html(item.invested_account, currency(item))"></div>
        </template>  
        <template #item.invested_investment="{item}">
            <div class="text-right" v-html="currency_html(item.invested_investment, currency(item))"></div>
        </template>
        <template #item.invested_user="{item}">
            <div class="text-right" v-html="currency_html(item.invested_user, currency(item))"></div>
        </template> 
        
        <template #item.balance_account="{item}">
            <div class="text-right" v-html="currency_html(item.balance_account, currency(item))"></div>
        </template>  
        <template #item.balance_investment="{item}">
            <div class="text-right" v-html="currency_html(item.balance_investment, currency(item))"></div>
        </template>  
        <template #item.balance_user="{item}">
            <div class="text-right" v-html="currency_html(item.balance_user, currency(item))"></div>
        </template> 

        <template #item.percentage_annual_investment="{item}">
            <div class="text-right" v-html="percentage_html(item.percentage_annual_investment)"></div>
        </template>
        <template #item.percentage_apr_investment="{item}">
            <div class="text-right" v-html="percentage_html(item.percentage_apr_investment)"></div>
        </template>
        <template #item.percentage_total_investment="{item}">
            <div class="text-right" v-html="percentage_html(item.gains_gross_investment/item.invested_investment)"></div>
        </template>   
        
        <template #item.percentage_annual_user="{item}">
            <div class="text-right" v-html="percentage_html(item.percentage_annual_user)"></div>
        </template>
        <template #item.percentage_apr_user="{item}">
            <div class="text-right" v-html="percentage_html(item.percentage_apr_user)"></div>
        </template>
        <template #item.percentage_total_user="{item}">
            <div class="text-right" v-html="percentage_html(item.gains_gross_user/item.invested_user)"></div>
        </template>   

        <template #tbody>
            <tr class="totalrow" v-if="items.length>0 && showtotal">
                <td>{{ f($t("Total ([0] registers)"), [items.length])}}</td>               
                <td v-if="showinvestment"></td>

                <td></td>          
                <td v-if="all_items_have_same_product" class="text-right" v-html="listobjects_sum(items, 'shares')"></td>
                <td v-if="!all_items_have_same_product"></td>          
                <td v-if="all_items_have_same_product" class="text-right" v-html="currency_html(listobjects_average_ponderated(items,'price_' + output, 'shares'), total_currency)"></td>
                <td v-if="!all_items_have_same_product"></td>
                <td v-if="all_items_have_same_currency" class="text-right" v-html="currency_html(items.reduce((accum,item) => accum + item['invested_'+ output], 0), total_currency)"></td>
                <td v-if="!all_items_have_same_currency"></td>          
                <td v-if="all_items_have_same_currency" class="text-right" v-html="currency_html(items.reduce((accum,item) => accum + item['balance_'+ output], 0), total_currency)"></td>                <td v-if="all_items_have_same_currency" class="text-right" v-html="currency_html(items.reduce((accum,item) => accum + item['gains_gross_'+ output], 0), total_currency)"></td>
                <td v-if="!all_items_have_same_currency"></td>
                <td></td>
                <td v-if="all_items_have_same_product" class="text-right" v-html="percentage_html(total_apr)"></td>
                <td v-if="!all_items_have_same_product"></td>
                <td v-if="all_items_have_same_product" class="text-right" v-html="percentage_html(items.reduce((accum,item) => accum + item.gains_gross_investment, 0)/items.reduce((accum,item) => accum + item.invested_investment, 0))"></td>
                <td v-if="!all_items_have_same_product"></td>

            </tr>
        </template>
                <template #bottom ></template>   
    </v-data-table>   
</template>
<script setup>
    import { ref, computed, onMounted, nextTick } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { listobjects_sum, listobjects_average_ponderated, getMapObjectById, currency_html, percentage_html } from '@/functions'
    import { localtime, f } from 'vuetify_rules'

    const props = defineProps({
        items: {
            required: true
        },
        showinvestment:{// Items must have accounts attribute
            type: Boolean,
            required:false,
            default: false,
        },
        output:{ // account, investment, user
            required:true,
        },
        showtotal:{// Items must have currency attribute
            type: Boolean,
            required:false,
            default: false,
        },
    })

    const { t } = useI18n()
    const table_oc = ref(null)

    // To sum shares and average price
    // Checks if all have the same investments_id == same products_id
    const all_items_have_same_product = computed(() => {
        if (props.items.length === 0) return false
        const first_investment_id = props.items[0].investments_id
        return props.items.every(item => item.investments_id === first_investment_id)
    })

    // To sum amounts
    const all_items_have_same_currency = computed(() => {
        if (props.items.length === 0) return false
        const first_currency = currency(props.items[0])
        return props.items.every(item => currency(item) === first_currency)
    })

    const total_currency = computed(() => {
        if (props.items.length === 0) return "Bad currency"
        return currency(props.items[0])
    })

    const total_apr = computed(() => {
        //Calculate total items apr
        let sumshares = 0
        let sumsharesxapr = 0

        props.items.forEach(o => {
            sumshares = sumshares + o.shares
            sumsharesxapr = sumsharesxapr + o.shares * o[`percentage_apr_${props.output}`]
        })
        return sumsharesxapr / sumshares
    })

    // Currencies are part of the item
    function currency(item){
        if (props.output === "account"){
            return item.currency_account
        } else if (props.output === "investment"){
            return item.currency_product
        } else if (props.output === "user"){
            return item.currency_user
        }
    }

    const table_headers = computed(() => {
        let r
        if (props.output === "account"){
            r = [
                { title: t('Date and time'), key: 'datetime',sortable: true },
                { title: t('Operation'), key: 'operationstypes',sortable: true },
                { title: t('Shares'), key: 'shares',sortable: false, align:'end'},
                { title: t('Price'), key: 'price_account',sortable: false, align:'end'},
                { title: t('Invested'), key: 'invested_account',sortable: false, align:'end'},
                { title: t('Balance'), key: 'balance_account',sortable: false, align:'end'},
                { title: t('Gross gains'), key: 'gains_gross_account',sortable: false, align:'end'},
                { title: t('% annual'), key: 'percentage_annual_account',sortable: false, align:'end'},
                { title: t('% APR'), key: 'percentage_apr_account',sortable: false, align:'end'},
                { title: t('% Total'), key: 'percentage_total_account',sortable: false, align:'end'},
            ]
        } else if (props.output === "investment"){
            r = [
                { title: t('Date and time'), key: 'datetime',sortable: true },
                { title: t('Operation'), key: 'operationstypes',sortable: true },
                { title: t('Shares'), key: 'shares',sortable: false, align:'end'},
                { title: t('Price'), key: 'price_investment',sortable: false, align:'end'},
                { title: t('Invested'), key: 'invested_investment',sortable: false, align:'end'},
                { title: t('Balance'), key: 'balance_investment',sortable: false, align:'end'},
                { title: t('Gross gains'), key: 'gains_gross_investment',sortable: false, align:'end'},
                { title: t('% annual'), key: 'percentage_annual_investment',sortable: false, align:'end'},
                { title: t('% TAE'), key: 'percentage_apr_investment',sortable: false, align:'end'},
                { title: t('% Total'), key: 'percentage_total_investment',sortable: false, align:'end'},
            ]
        } else if (props.output === "user"){
            r = [
                { title: t('Date and time'), key: 'datetime',sortable: true },
                { title: t('Operation'), key: 'operationstypes',sortable: true },
                { title: t('Shares'), key: 'shares',sortable: false, align:'end'},
                { title: t('Price'), key: 'price_user',sortable: false, align:'end'},
                { title: t('Invested'), key: 'invested_user',sortable: false, align:'end'},
                { title: t('Balance'), key: 'balance_user',sortable: false, align:'end'},
                { title: t('Gross gains'), key: 'gains_gross_user',sortable: false, align:'end'},
                { title: t('% annual'), key: 'percentage_annual_user',sortable: false, align:'end'},
                { title: t('% TAE'), key: 'percentage_apr_user',sortable: false, align:'end'},
                { title: t('% Total'), key: 'percentage_total_user',sortable: false, align:'end'},
            ]
        }
        if (props.showinvestment === true){
            r.splice(1, 0, { title: t('Name'), key: 'investments', sortable: true });
        }
        return r
    })

    async function gotoLastRow(){
        await nextTick()
        const tableWrapper = table_oc.value?.$el?.querySelector('.v-table__wrapper')
        if (tableWrapper) {
            tableWrapper.scrollTop = tableWrapper.scrollHeight
        }
    }

    onMounted(() => {
        gotoLastRow()
    })
</script>
