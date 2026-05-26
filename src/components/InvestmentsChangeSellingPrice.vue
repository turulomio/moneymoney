<template>
    <div>
        <h1 class="mb-2">{{ $t("Change selling price") }}</h1>
        <div v-if="snackbar_message==''">
            <div v-html="$t('Table with all investments with the same product as current investment:')"></div>
            <v-data-table ref="table" v-model="selected_ids" show-select :headers="tableHeaders" :items="data" class="elevation-1 mt-2" density="compact" height="300" fixed-header :items-per-page="10000" >
                <template #item.fullname="{item}">
                    {{ useStore().investments.get(item.url).fullname }}
                </template>            
                <template #item.selling_price="{item}">
                    <div class="text-right">{{ currency_string(item.selling_price, item.currency)}}</div>
                </template>
                <template #item.average_price="{item}">
                    <div class="text-right">{{ currency_string(item.average_price, item.currency)}}</div>
                </template>
                <template #item.invested_investment="{item}">
                    <div class="text-right">{{ currency_string(item.invested_investment, item.currency)}}</div>
                </template>
                <template #item.balance_investment="{item}">
                    <div class="text-right">{{ currency_string(item.balance_investment, item.currency)}}</div>
                </template>
                <template #bottom ></template>   
            </v-data-table>
            <DisplayValues :items="displayvalues()" :minimized_items="5" :key="key"></DisplayValues>

            <v-tabs  bg-color="secondary" dark v-model="tab" grow>
                <v-tab key="percentage">{{ $t("Set a gains percentage") }}</v-tab>
                <v-tab key="gain">{{ $t("Set a gain") }}</v-tab>
                <v-tab key="price">{{ $t("Set a price") }}</v-tab>
                <v-tab key="range" v-if="selected_ids.length==1 && investment.id==selected_ids[0]">{{ $t("Set a range for current investment strategy") }}</v-tab>
            </v-tabs>
            <v-window v-model="tab">
                <v-window-item key="percentage">      
                    <v-card class="pa-3" outlined>
                        <v-text-field :name="$t('Set a gains percentage')" v-model.number="percentage" :counter="10" :label="$t('Set a gains percentage')" :placeholder="$t('Enter an amount')" :rules="RulesFloat(10,true,6)" autofocus></v-text-field>
                    </v-card>
                </v-window-item>
                <v-window-item key="gain">     
                    <v-card class="pa-3" outlined>
                        <v-text-field :name="$t('Set a gain')" v-model.number="gains" :counter="10" :label="$t('Set a gain')" :placeholder="$t('Enter an amount')" :rules="RulesFloat(10,true,6)"></v-text-field>
                    </v-card>
                </v-window-item>
                <v-window-item key="price">     
                    <v-card class="pa-3" outlined>
                        <v-text-field data-test="InvestmentsChangeSellingPrice_Price" :name="$t('Set a price')" v-model.number="price" :counter="10" :label="$t('Set a price')" :placeholder="$t('Enter an amount')" :rules="RulesFloat(10,true,6)"></v-text-field>
                    </v-card>
                </v-window-item>
                <v-window-item key="range">     
                    <v-card class="pa-3" outlined>
                        <v-select :items="strategies" v-model="strategy" :label="$t('Set current investment strategy')"  item-title="name" return-object :rules="RulesSelection(true)"></v-select>  
                        <v-select :items="strategy_ranges" v-model="strategy_range" :label="$t('Set a strategy range')"  item-title="name" item-value="value" :rules="RulesSelection(true)"></v-select>  
                    </v-card>
                </v-window-item>
            </v-window>    
            <div class="pa-4" width="100%">
                <v-form ref="form" v-model="form_valid">
                    <MyDatePicker v-model="selling_expiration" :label="$t('Selling expiration')" :clearable="true"/>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn data-test="InvestmentsChangeSellingPrice_ButtonSubmit" color="primary" @click="submit()">{{ button_text }}</v-btn>
                        <v-btn data-test="InvestmentsChangeSellingPrice_ButtonSubmitNull" color="error" @click="submit_null()">{{ $t("Set null values") }}</v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-form>
            </div>
        </div>
        <div v-else>
            <div v-html="snackbar_message"></div>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="InvestmentsChangeSellingPrice_ButtonCloseMessage" color="error" @click="on_message_close()">{{ $t("Close message")}}</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </div>
    </div>
</template>

<script setup>
    import { ref, watch, computed, onMounted } from 'vue'
    import axios from 'axios'
    import { useStore, currency_string, getMapObjectById   } from '@/store'
    import DisplayValues from './DisplayValues.vue'
    import MyDatePicker from './MyDatePicker.vue'
    import { empty_products_ranges, empty_ios } from '../empty_objects.js'
    import { my_round, RulesSelection, RulesFloat, f } from 'vuetify_rules'
    import { hyperlinked_url } from '@/functions.js'
    import { useI18n } from 'vue-i18n'
    import { useDialogs } from '@/composables/useDialogs'

    const { t } = useI18n()
    const { alert: myAlert } = useDialogs()
    const emit = defineEmits(['cruded'])

    const props = defineProps({
        investment: {
            required: true}
    })

    const tab = ref(2)
    const form_valid = ref(false)
    const plio = ref(null)
    const data = ref([])
    const selected_ids = ref([])
    const tableHeaders = [
        { title: t('Id'), key: 'id', sortable: true },
        { title: t('Name'), key: 'fullname', sortable: true },
        { title: t('Shares'), key: 'shares', sortable: true, align: 'end' },
        { title: t('Selling price'), key: 'selling_price', sortable: true, align: 'end' },
        { title: t('Selling expiration'), key: 'selling_expiration', sortable: true, align: 'end' },
        { title: t('Average price'), key: 'average_price', sortable: true, align: 'end' },
        { title: t('Invested'), key: 'invested_investment', sortable: true, align: 'end' },
        { title: t('Balance'), key: 'balance_investment', sortable: true, align: 'end' },
    ]
    const selected_invested = ref(0)
    const selling_expiration = ref(props.investment.selling_expiration || new Date().toISOString().substring(0, 10))
    const selected_selling_price = ref(NaN)
    const selected_average_price = ref(0)
    const selected_shares = ref(0)
    const button_text = ref(t("Calculate your selling price"))
    const gains = ref(500)
    const price = ref(props.investment.selling_price || 0)
    const percentage = ref(10)
    const key = ref(0)
    const loading_ios = ref(false)
    const snackbar_message = ref("")

    const product = ref(useStore().products.get(props.investment.products))

    const strategies = ref([])
    const strategy = ref(null)
    const strategy_ranges = ref([])
    const strategy_range = ref(null)

    const investments_same_product = computed(() => {
        var r = []
        if (!product.value) return r
        useStore().investments.forEach(inv => {
            if (inv.products == product.value.url && inv.active) {
                r.push(inv.id)
            }
        })
        return r
    })

    const expected_gains = computed(() => {
        if (!product.value || isNaN(selected_selling_price.value) || isNaN(selected_average_price.value)) return 0
        return (selected_selling_price.value - selected_average_price.value) * selected_shares.value * product.value.real_leveraged_multiplier
    })

    const displayvalues = () => {
        if (!product.value) return []
        return [
            { title: t('Selected invested amount'), value: currency_string(selected_invested.value, product.value.currency) },
            { title: t('Number of shares selected'), value: selected_shares.value },
            { title: t('Average price of selected shares'), value: currency_string(selected_average_price.value, product.value.currency) },
            { title: t('Product leverage'), value: useStore().leverages.get(product.value.leverages).multiplier },
            { title: t('Product real leverage'), value: product.value.real_leveraged_multiplier },
        ]
    }

    const selling_price_to_gain_money = (money) => {
        var PF = 0
        if (selected_shares.value > 0) {
            PF = (money + selected_average_price.value * selected_shares.value * product.value.real_leveraged_multiplier) / (selected_shares.value * product.value.real_leveraged_multiplier)
        }
        else if (selected_shares.value < 0) {
            PF = (-money + selected_average_price.value * selected_shares.value * product.value.real_leveraged_multiplier) / (selected_shares.value * product.value.real_leveraged_multiplier)
        }
        return PF
    }

    const selling_price_to_gain_percentage_of_invested = (percentage_val) => {
        var gains_val = selected_invested.value * percentage_val / 100
        return selling_price_to_gain_money(gains_val)
    }

    const calculate = () => {
        selected_shares.value = 0
        selected_invested.value = 0
        data.value.forEach(o => {
            if (selected_ids.value.includes(o.id)) {
                selected_shares.value = selected_shares.value + o.shares
                selected_invested.value = selected_invested.value + o.invested_investment
            }
        })
        if (selected_shares.value != 0) {
            var selected_sharesbyaverage = 0
            data.value.forEach(o => {
                if (selected_ids.value.includes(o.id)) {
                    selected_sharesbyaverage = selected_sharesbyaverage + o.shares * o.average_price
                }
            })
            selected_average_price.value = selected_sharesbyaverage / selected_shares.value
        } else {
            selected_average_price.value = 0
        }
        if (tab.value == 0) {
            selected_selling_price.value = selling_price_to_gain_percentage_of_invested(percentage.value)
        } else if (tab.value == 1) {
            selected_selling_price.value = selling_price_to_gain_money(gains.value)
        } else if (tab.value == 2) {
            selected_selling_price.value = price.value
        } else if (tab.value == 3) {
            selected_selling_price.value = strategy_range.value
        }
        button_text.value = f(t("Set selected investments selling price to [0] to gain [1]"), [
            currency_string(selected_selling_price.value, product.value.currency, product.value.decimals),
            currency_string(expected_gains.value, product.value.currency, 2)
        ])
    }

    const show_snackbar_message = () => {
        var r = "<p>" + t("Selling price was updated sucessfully.") + "</p>"
        r = r + "<p>" + t("Don't forget to set this order in your bank:") + "</p>"
        r = r + "<ul>"
        r = r + "<li>" + t("Investment") + `: ${props.investment.fullname}</li>`
        r = r + "<li>" + t("Shares") + `: ${selected_shares.value}</li>`
        r = r + "<li>" + t("Price") + `: ${currency_string(selected_selling_price.value, product.value.currency, product.value.decimals)}</li>`
        if (selling_expiration.value) r = r + "<li>" + t("Expiration") + `: ${selling_expiration.value}</li>`
        r = r + "</ul>"
        r = r + "<p>" + t("Expected gains") + `: ${currency_string(expected_gains.value, product.value.currency, 2)}</p>`

        snackbar_message.value = r
    }

    const submit_method = async (price_val, expiration_val) => {
        selling_expiration.value = expiration_val
        if (selling_expiration.value != null && new Date(selling_expiration.value).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
            await myAlert(t("Selling expiration date is in the past"))
        }

        var s = new Array()
        selected_ids.value.forEach(v => s.push(hyperlinked_url("investments", v)))
        var p = {
            selling_expiration: selling_expiration.value,
            investments: s,
            selling_price: my_round(price_val, product.value.decimals)}
        axios.post(`${useStore().apiroot}/investments/changesellingprice/`, p)
            .then((response) => {
                response.data.forEach(o => {
                    useStore().investments.set(o.url, o)
                })
                loading_ios.value = false
                key.value = key.value + 1
                show_snackbar_message()
            });
    }

    const submit = () => {
        submit_method(selected_selling_price.value, selling_expiration.value)
    }

    const submit_null = () => {
        submit_method(null, null)
    }

    const on_message_close = () => {
        snackbar_message.value = ""
        emit("cruded")
    }

    const refreshInvestments = (select_current) => {
        loading_ios.value = true
        var simulation = empty_ios()
        simulation.investments = investments_same_product.value
        simulation.currency = useStore().profile.currency
        simulation.mode = 2
        return axios.post(`${useStore().apiroot}/ios/`, simulation)
            .then((response) => {
                plio.value = response.data
                var o
                var ios_id

                investments_same_product.value.forEach(investments_id => {
                    ios_id = plio.value[investments_id.toString()]
                    var inv = getMapObjectById("investments", investments_id)
                    o = {
                        id: investments_id,
                        url: inv.url,
                        name: (props.investment.url == inv.url) ? inv.fullname + " (current)" : inv.fullname,
                        shares: ios_id.total_io_current.shares,
                        selling_price: inv.selling_price,
                        selling_expiration: inv.selling_expiration,
                        average_price: ios_id.total_io_current.average_price_investment,
                        invested_investment: ios_id.total_io_current.invested_investment,
                        balance_investment: ios_id.total_io_current.balance_investment,
                        currency: ios_id.data.currency_product}
                    data.value.push(o)
                    if (select_current == true && o.url == props.investment.url) {
                        selected_ids.value.push(o.id)
                    }
                    calculate()
                })
                loading_ios.value = false
                key.value = key.value + 1
            });
    }

    const refreshStrategies = () => {
        axios.get(`${useStore().apiroot}/api/strategies/?investment=${props.investment.url}&active=true&type=2`)
            .then((response) => {
                strategies.value = response.data
            });
    }

    watch([gains, percentage, price, tab, strategy_range, selected_ids], () => {
        calculate()
    })

    watch(strategy, (item) => {
        var pr = empty_products_ranges()
        pr.product = `${useStore().apiroot}/api/products/${item.additional1}/`
        pr.percentage_between_ranges = item.additional2
        pr.percentage_gains = item.additional3
        pr.amount_to_invest = item.additional4
        pr.recomendation_methods = item.additional5
        pr.totalized_operations = item.additional6
        pr.investments = item.investments
        axios.get(`${useStore().apiroot}/products/ranges/`, { params: pr })
            .then((response) => {
                strategy_ranges.value = []
                response.data.pr.forEach(element => {
                    var investments_string = ""
                    element.investments_inside.forEach(o => {
                        investments_string = investments_string + o.name
                    })
                    strategy_ranges.value.push({ name: `${element.value} ${investments_string}`, value: element.value })
                });
            });
    })

    onMounted(() => {
        refreshStrategies()
        refreshInvestments(true)
    })
</script>
