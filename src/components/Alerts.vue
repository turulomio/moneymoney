<template>
    <div v-if="useStore().logged && useStore().catalogsLoaded" class="mx-15 px-10 mb-4" data-test="AlertsContainer">
        <div class="d-flex align-center justify-center my-3">
            <h3 class="text-h6 font-weight-medium mr-2">{{ t("User warnings") }}</h3>
            <v-progress-circular v-if="loading" color="primary" indeterminate size="20" width="2"></v-progress-circular>
        </div>

        <div v-if="alerts">
            <v-alert density="compact" class="mb-2" outlined type="warning" v-if="time_message.length>0"> {{time_message}}</v-alert>   
            <v-alert class="mb-2" type="error" variant="outlined" v-if="alerts.orders_expired.length>0"> 
                <p>{{f(t("Orders expired in last [0] days :"), [alerts.expired_days])}}</p>
                <ul>    
                    <li v-for="(order,i) in alerts.orders_expired" :key="i">      - {{ order.expiration }}. {{ order.investmentsname}}</li>
                </ul>
            </v-alert>
            <v-alert class="mb-2" type="error" variant="outlined" v-if="alerts.banks_inactive_with_balance.length>0"> 
                <p>{{t("Inactive banks with balance:")}}</p>
                <ul>    
                    <li v-for="(bank,i) in alerts.banks_inactive_with_balance" :key="i">      - {{ f(t(`Bank '[0]' has a total balance of [1]`), [bank.localname, currency_string(bank.balance_total, useStore().profile.currency)]) }}.  </li>
                </ul>
            </v-alert>
            <v-alert class="mb-2" type="error" variant="outlined" v-if="alerts.accounts_inactive_with_balance.length>0"> 
                <p>{{t("Inactive accounts with balance:")}}</p>
                <ul>    
                    <li v-for="(account,i) in alerts.accounts_inactive_with_balance" :key="i">    - {{ f(t(`Account '[0]' has a total balance of [1]`), [account.localname, currency_string(account.balance_user, useStore().profile.currency)]) }}.  </li>
                </ul>
            </v-alert>
            <v-alert class="mb-2" type="error" variant="outlined" v-if="alerts.investments_inactive_with_balance.length>0"> 
                <p>{{t("Inactive investments with balance:")}}</p>
                <ul>    
                    <li v-for="(investment,i) in alerts.investments_inactive_with_balance" :key="i">    - {{ f(t(`Investment '[0]' has a total balance of [1]`), [investment.data.name, currency_string(investment.total_io_current.balance_user, useStore().profile.currency)]) }}.  </li> 
                </ul>
            </v-alert>
            <v-alert class="mb-2" type="error" variant="outlined" v-if="alerts.investments_transfers_unfinished.length>0"> 
                <p>{{t("Unfinished investments transfers:")}}</p>
                <ul>    
                    <li v-for="(it,i) in alerts.investments_transfers_unfinished" :key="i">    - {{ f(t(`Investments transfer started at '[0]' from '[1]'`), [localtime(it.datetime_origin), useStore().investments.get(it.investments_origin).fullname])}}.  </li> 
                </ul>
            </v-alert>
            <v-alert class="mb-2" type="error" variant="outlined" v-if="alerts.products_without_quotes_before_operations && alerts.products_without_quotes_before_operations.length>0"> 
                <p>{{t("Products without quotes before investments / currency exchange operations:")}}</p>
                <ul>    
                    <li v-for="(item,i) in alerts.products_without_quotes_before_operations" :key="i" class="d-flex align-center my-1">
                        <span class="mr-2">-</span>
                        <v-icon v-if="getProduct(item)?.flag" :class="'mr-2 fi fib fi-'+getProduct(item).flag" small :title="getCountryNameByCode(getProduct(item).flag)"></v-icon>
                        <a href="#" class="cursorpointer font-weight-bold mr-2" :class="getProduct(item)?.obsolete ? 'text-decoration-line-through' : ''" @click.prevent="openProductView(item)">{{ getProduct(item)?.fullname || getProduct(item)?.name || item.product_url }}</a>
                        <v-btn icon="mdi-plus" density="compact" size="small" variant="text" color="primary" :title="t('Add a quote')" @click.stop="openAddQuote(item)"></v-btn>
                    </li> 
                </ul>
            </v-alert>
            <v-alert class="mb-2" type="success" variant="outlined" v-if="(alerts.banks_inactive_with_balance.length + alerts.investments_inactive_with_balance.length + alerts.orders_expired.length + alerts.accounts_inactive_with_balance.length + alerts.investments_transfers_unfinished.length + (alerts.products_without_quotes_before_operations ? alerts.products_without_quotes_before_operations.length : 0))==0"> 
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
    import ProductsView from './ProductsView.vue'
    import QuotesCU from './QuotesCU.vue'
    import { empty_quote } from '../empty_objects.js'
    import moment from 'moment'
    import { f, localtime } from 'vuetify_rules'
    import { ref, computed, watch, onMounted } from 'vue'
    import { useI18n } from 'vue-i18n'

    /**
     * Internationalization instance.
     * @type {{ t: Function }}
     */
    const { t } = useI18n()

    /**
     * Calculated time skew between browser and server (ms).
     * @type {import('vue').Ref<number|null>}
     */
    const diff_time = ref(null)

    /**
     * Holds the alerts payload retrieved from backend /alerts/.
     * @type {import('vue').Ref<Object|null>}
     */
    const alerts = ref(null)

    /**
     * Loading flag while fetching alerts from API.
     * @type {import('vue').Ref<boolean>}
     */
    const loading = ref(false)

    /**
     * Modal visibility and state for inspecting a product.
     * @type {import('vue').Ref<boolean>}
     */
    const dialog_product_view = ref(false)
    const selected_product = ref(null)
    const product_view_key = ref(0)

    /**
     * Modal visibility and state for creating a missing quote.
     * @type {import('vue').Ref<boolean>}
     */
    const dialog_quotes_cu = ref(false)
    const new_quote = ref(null)
    const quotes_cu_key = ref(0)

    /**
     * Resolves product object from global store catalog or returns the fallback item.
     * @param {Object|string} item - Product item or product URL from alert payload.
     * @returns {Object|null}
     */
    function getProduct(item) {
        if (!item) return null
        if (typeof item === 'string') {
            return useStore().products.get(item) || { url: item, fullname: item }
        }
        const url = item.product_url || item.url
        if (url && useStore().products.has(url)) {
            return useStore().products.get(url)
        }
        return item
    }

    /**
     * Opens the ProductsView modal dialog for a selected product.
     * @param {Object|string} item - Product item or product URL.
     * @returns {void}
     */
    function openProductView(item) {
        selected_product.value = getProduct(item)
        product_view_key.value++
        dialog_product_view.value = true
    }

    /**
     * Opens the QuotesCU modal dialog to add a quote 1 minute prior to the required operation.
     * @param {Object} item - Item containing product reference and operation datetime.
     * @returns {void}
     */
    function openAddQuote(item) {
        const prod = getProduct(item)
        const q = empty_quote()
        q.products = item.product_url || prod?.url || item.url
        const op_datetime = item.datetime || item.first_investmentoperation_datetime || item.first_operation_datetime || item.investmentoperation_datetime || item.operation_datetime || item.first_datetime || (typeof item === 'object' ? Object.values(item).find(v => typeof v === 'string' && moment(v, moment.ISO_8601, true).isValid()) : null) || prod?.datetime || alerts.value?.server_time || new Date().toISOString()
        q.datetime = moment(op_datetime).subtract(1, 'minute').toISOString()
        new_quote.value = q
        quotes_cu_key.value++
        dialog_quotes_cu.value = true
    }

    /**
     * Callback when a quote has been successfully created/updated in QuotesCU.
     * @returns {void}
     */
    function on_quote_cruded() {
        dialog_quotes_cu.value = false
        get_alerts()
    }

    /**
     * Computed message for time skew warning if difference exceeds 1000ms.
     * @type {import('vue').ComputedRef<string>}
     */
    const time_message = computed(() => {
        if (diff_time.value === null) return ""
        return (Math.abs(diff_time.value) >= 1000) ? f(t("There is a time difference between the browser and the server of [0] ms. Please contact server administrator."), [diff_time.value]) : ""
    })

    /**
     * Fetches user warnings and alerts from /alerts/ endpoint.
     * @returns {Promise<void>}
     */
    function get_alerts(){
        if (!useStore().logged || !useStore().catalogsLoaded) return Promise.resolve()
        loading.value = true
        return axios.get(`${useStore().apiroot}/alerts/`)
        .then((response) => {
            alerts.value = response.data
            console.log(alerts.value)
        })
        .finally(() => {
            loading.value = false
        });
    }

    /**
     * Independently performs a fast HTTP request to compute clock difference with RTT compensation.
     * @returns {Promise<void>}
     */
    async function check_time_diff() {
        if (!useStore().logged || !useStore().catalogsLoaded) return
        try {
            const t0 = Date.now()
            const response = await axios.get(`${useStore().apiroot}/catalog_manager/`, { noparse: true })
            const t1 = Date.now()
            const rtt = t1 - t0

            let server_timestamp = null
            if (response.data && response.data.server_time) {
                server_timestamp = new Date(response.data.server_time).getTime()
            } else {
                const dateHeader = response.headers?.['date'] || (typeof response.headers?.get === 'function' ? response.headers.get('date') : null)
                if (dateHeader) {
                    server_timestamp = new Date(dateHeader).getTime()
                }
            }

            if (server_timestamp !== null) {
                const local_estimated = t0 + Math.round(rtt / 2)
                diff_time.value = local_estimated - server_timestamp
                console.log(`Local estimated: ${new Date(local_estimated).toISOString()}`)
                console.log(`Server time: ${new Date(server_timestamp).toISOString()}`)
                console.log(`Difference (ms): ${diff_time.value}`)
            }
        } catch (error) {
            console.error("Failed to check server time difference:", error)
        }
    }

    /**
     * Expose methods for parent components if manual refresh is needed.
     */
    defineExpose({
        get_alerts,
        check_time_diff
    })

    /**
     * Fetch alerts on component mount if user is logged in and catalogs are already loaded.
     */
    onMounted(() => {
        if (useStore().logged && useStore().catalogsLoaded) {
            get_alerts()
            check_time_diff()
        }
    })

    /**
     * Watch login and catalog loading status to trigger alerts fetch only when authenticated and catalogs are available.
     */
    watch(() => useStore().logged && useStore().catalogsLoaded, (ready) => {
        if (ready) {
            get_alerts()
            check_time_diff()
        } else {
            alerts.value = null
            diff_time.value = null
            loading.value = false
        }
    })
</script>
