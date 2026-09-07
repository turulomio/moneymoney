<template>
    <div>
        <v-overlay data-test="Home_LoadingOverlay" :model-value="loading_bootstrap" class="align-center justify-center" persistent>
            <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <h1>{{ t("Wellcome to Money Money") }}</h1>
        <h2>{{ `${useStore().version} (${useStore().versiondate.toISOString().slice(0,10)})` }}</h2>
        <v-img :src="imgUrl" height="200px" contain ></v-img>
        <div v-if="alerts" data-test="Home_AlertsContainer">
            <v-alert density="compact" class="mx-15 px-10 mb-2" outlined type="warning" v-if="time_message.length>0"> {{time_message}}</v-alert>   
            <v-alert class="mx-15 px-10 mb-2" type="error" variant="outlined" v-if="alerts.orders_expired.length>0"> 
                <p>{{f(t("Orders expired in last [0] days :"), [alerts.expired_days])}}</p>
                <ul>    
                    <li v-for="(order,i) in alerts.orders_expired" :key="i">      - {{ order.expiration }}. {{ order.investmentsname}}</li>
                </ul>
            </v-alert>
            <v-alert class="mx-15 px-10 mb-2" type="error" variant="outlined" v-if="alerts.banks_inactive_with_balance.length>0"> 
                <p>{{t("Inactive banks with balance:")}}</p>
                <ul>    
                    <li v-for="(bank,i) in alerts.banks_inactive_with_balance" :key="i">      - {{ f(t(`Bank '[0]' has a total balance of [1]`), [bank.localname, currency_string(bank.balance_total, useStore().profile.currency)]) }}.  </li>
                </ul>
            </v-alert>
            <v-alert class="mx-15 px-10 mb-2" type="error" variant="outlined" v-if="alerts.accounts_inactive_with_balance.length>0"> 
                <p>{{t("Inactive accounts with balance:")}}</p>
                <ul>    
                    <li v-for="(account,i) in alerts.accounts_inactive_with_balance" :key="i">    - {{ f(t(`Account '[0]' has a total balance of [1]`), [account.localname, currency_string(account.balance_user, useStore().profile.currency)]) }}.  </li>
                </ul>
            </v-alert>
            <v-alert class="mx-15 px-10 mb-2" type="error" variant="outlined" v-if="alerts.investments_inactive_with_balance.length>0"> 
                <p>{{t("Inactive investments with balance:")}}</p>
                <ul>    
                    <li v-for="(investment,i) in alerts.investments_inactive_with_balance" :key="i">    - {{ f(t(`Investment '[0]' has a total balance of [1]`), [investment.data.name, currency_string(investment.total_io_current.balance_user, useStore().profile.currency)]) }}.  </li> 
                </ul>
            </v-alert>
            <v-alert class="mx-15 px-10 mb-2" type="error" variant="outlined" v-if="alerts.investments_transfers_unfinished.length>0"> 
                <p>{{t("Unfinished investments transfers:")}}</p>
                <ul>    
                    <li v-for="(it,i) in alerts.investments_transfers_unfinished" :key="i">    - {{ f(t(`Investments transfer started at '[0]' from '[1]'`), [localtime(it.datetime_origin), useStore().investments.get(it.investments_origin).fullname])}}.  </li> 
                </ul>
            </v-alert>
            <v-alert class="mx-15 px-10 mb-2" type="error" variant="outlined" v-if="alerts.products_without_quotes_before_operations && alerts.products_without_quotes_before_operations.length>0"> 
                <p>{{t("Products without quotes before operations:")}}</p>
                <ul>    
                    <li v-for="(product_item,i) in alerts.products_without_quotes_before_operations" :key="i" class="d-flex align-center my-1">
                        <span class="mr-2">-</span>
                        <v-icon v-if="product_item.flag" :class="'mr-2 fi fib fi-'+product_item.flag" small :title="getCountryNameByCode(product_item.flag)"></v-icon>
                        <a href="#" class="cursorpointer font-weight-bold mr-2" :class="product_item.obsolete ? 'text-decoration-line-through' : ''" @click.prevent="openProductView(product_item)">{{ product_item.fullname || product_item.name }}</a>
                        <v-btn icon="mdi-plus" density="compact" size="small" variant="text" color="primary" :title="t('Add a quote')" @click.stop="openAddQuote(product_item)"></v-btn>
                    </li> 
                </ul>
            </v-alert>
            <v-alert class="mx-15 px-10 mb-2" type="success" variant="outlined" v-if="(alerts.banks_inactive_with_balance.length + alerts.investments_inactive_with_balance.length + alerts.orders_expired.length + alerts.accounts_inactive_with_balance.length + alerts.investments_transfers_unfinished.length + (alerts.products_without_quotes_before_operations ? alerts.products_without_quotes_before_operations.length : 0))==0"> 
                <p>{{t("You haven't alerts, everything is fine")}}</p>
            </v-alert>
        </div>

        <!-- DIALOG PRODUCT VIEW -->
        <v-dialog v-model="dialog_product_view" width="90%">
            <v-card class="pa-4" v-if="selected_product">
                <ProductsView :product="selected_product" :key="product_view_key" />
            </v-card>
        </v-dialog>

        <!-- DIALOG QUOTE CU -->
        <v-dialog v-model="dialog_quotes_cu" width="65%">
            <v-card class="pa-4" v-if="new_quote">
                <QuotesCU :quote="new_quote" mode="C" :key="quotes_cu_key" @cruded="on_quote_cruded" />
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
    import axios from 'axios'
    import { useStore, currency_string, getCountryNameByCode } from '@/store'
    import imgUrl from '@/assets/moneymoney.png'
    import ProductsView from './ProductsView.vue'
    import QuotesCU from './QuotesCU.vue'
    import { empty_quote } from '../empty_objects.js'
    import moment from 'moment'
    
    import { f, localtime } from 'vuetify_rules'
    import { ref, computed, watch } from 'vue'
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n()

    const diff_time = ref(null)
    const alerts = ref(null)
    const loading_bootstrap = ref(false)
    const dialog_product_view = ref(false)
    const selected_product = ref(null)
    const product_view_key = ref(0)
    const dialog_quotes_cu = ref(false)
    const new_quote = ref(null)
    const quotes_cu_key = ref(0)

    function openProductView(product) {
        selected_product.value = product
        product_view_key.value++
        dialog_product_view.value = true
    }

    function openAddQuote(product) {
        const q = empty_quote()
        q.products = product.url
        const base_time = product.datetime || product.operation_datetime || alerts.value?.server_time || new Date().toISOString()
        q.datetime = moment(base_time).subtract(1, 'minute').toISOString()
        new_quote.value = q
        quotes_cu_key.value++
        dialog_quotes_cu.value = true
    }

    function on_quote_cruded() {
        dialog_quotes_cu.value = false
        get_alerts()
    }

    const time_message = computed(() => {
        if (diff_time.value === null) return ""
        return (Math.abs(diff_time.value) >= 1000) ? f(t("There is a time difference between the browser and the server of [0] ms. Please contact server administrator."), [diff_time.value]) : ""
    })

    function get_alerts(){
        if (!useStore().logged) return Promise.resolve()
        return axios.get(`${useStore().apiroot}/alerts/`)
        .then((response) => {
            alerts.value = response.data
            console.log(alerts.value)
            let local = new Date()
            let server = new Date(alerts.value.server_time)
            diff_time.value = local - server

            console.log(`Local time: ${local.toISOString()}`)
            console.log(`Server time: ${server.toISOString()}`)
            console.log(`Difference (ms): ${diff_time.value}`)
        });
    }

    watch(() => useStore().logged,  async (logged) => {
        if (logged) {
            loading_bootstrap.value = true
            try {
                const store = useStore()
                const promises = [get_alerts()]
                if (!store.catalogsLoaded) {
                    promises.push(store.updateAll().then(() => {
                        store.catalogsLoaded = true
                    }))
                }
                await Promise.all(promises)
            } catch (error) {
                console.error("Bootstrap data load failed:", error)
            } finally {
                loading_bootstrap.value = false
            }
        } else {
            alerts.value = null
            diff_time.value = null
        }
    }, { immediate: true })

</script>