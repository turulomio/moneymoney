<template>
    <div>    
        <h1>{{ title }}
            <MyMenuInline :items="menuinline_items"/>
        </h1>           
        <div class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid">                
                <MyDateTimePicker :readonly="mode=='D'" v-model="new_quote.datetime" :label="t('Set quote date and time')" />
                <AutocompleteProducts :readonly="mode=='D'" v-model="new_quote.products" :rules="RulesSelection(true)"  />
                <v-text-field data-test="QuotesCU_Quote"  :readonly="mode=='D'" v-model.number="new_quote.quote"  :label="t('Set quote')" :placeholder="t('Set quote')" :rules="RulesFloatGEZ(12,true,product_object.decimals)" counter="12" autofocus/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="QuotesCU_Button" color="primary" @click="accept()">{{ button }}</v-btn>
            </v-card-actions>
        </div>
    </div>
</template>
<script setup>
    import axios from 'axios'
    import { useStore } from "@/store"
    import { RulesSelection,RulesFloatGEZ } from 'vuetify_rules'
    import AutocompleteProducts from './AutocompleteProducts.vue'
    import moment from 'moment-timezone';
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import MyMenuInline from './MyMenuInline.vue'
    import { myheaders, parseResponseError } from '@/functions.js'
    import { ref, computed } from 'vue';
    import { useI18n } from 'vue-i18n'


    const props = defineProps({
        quote: { //A quote object
            required: true 
        },
        mode: {
            required: true // Corrected typo from 'requited'
        }
    });

    const emit = defineEmits(['cruded']);

    const { t } = useI18n()

    const store = useStore();

    const form_valid = ref(false);
    const new_quote = ref(Object.assign({}, props.quote));
    console.log(new_quote.value)
    console.log(product_object.value)
    const form = ref(null); // Reference for the v-form component

    const product_object = computed(() => {
        return store.products.get(new_quote.value.products);
    });

    const product_stockmarket = computed(() => {
        return store.stockmarkets.get(product_object.value.stockmarkets);
    });

    const menuinline_items = [
        {
            subheader: t("Date and time options"),
            children: [
                {
                    name: t("Set the time at the start of the futures stock market"),
                    icon: "mdi-calendar",
                    code: () => {
                       new_quote.value.datetime = moment(`${new_quote.value.datetime.slice(0,10)}T${product_stockmarket.value.starts_futures}`).toISOString();
                    },
                },
                {
                    name: t("Set the time at the start of the stock market"),
                    icon: "mdi-calendar ",
                    code: () => {
                       new_quote.value.datetime = moment(`${new_quote.value.datetime.slice(0,10)}T${product_stockmarket.value.starts}`).toISOString();
                    },
                },
                {
                    name: t("Set the time at the close of the stock market"),
                    icon: "mdi-calendar ",
                    code: () => {
                       new_quote.value.datetime = moment(`${new_quote.value.datetime.slice(0,10)}T${product_stockmarket.value.closes}Z`).toISOString();
                    },
                },
                {
                    name: t("Set the time at the close of the futures stock market"),
                    icon: "mdi-calendar ",
                    code: () => {
                       new_quote.value.datetime = moment(`${new_quote.value.datetime.slice(0,10)}T${product_stockmarket.value.closes_futures}`).toISOString();
                    },
                },
            ]
        },
    ];

    const title = computed(() => {
        if (props.mode === "C") return t("Add a quote");
        if (props.mode === "U") return t("Update quote");
        if (props.mode === "D") return t("Delete quote");
        return ''; // Default return for unexpected modes
    });

    const button = computed(() => {
        if (props.mode === "C") return t("Add");
        if (props.mode === "U") return t("Update");
        if (props.mode === "D") return t("Delete");
        return ''; // Default return for unexpected modes
    });

    async function accept() {
        const { valid } = await form.value.validate();
        if (!valid) {
            return;
        }

        if (props.mode === "U"){
            axios.put(new_quote.value.url, new_quote.value, myheaders())
                    .then(() => {
                            emit("cruded");
                    }, (error) => {
                        parseResponseError(error);
                    })
                } else if (props.mode === "C") {
                    axios.post(`${store.apiroot}/api/quotes/`, new_quote.value, myheaders())
                    .then(() => {
                            emit("cruded");
                    }, (error) => {
                        parseResponseError(error);
                    })
                } else if (props.mode === "D") {
                    const r = confirm(t("Do you want to delete this quote?"));
                    if(r === false) {
                        return
                    } 
                    axios.delete(new_quote.value.url, myheaders())
                    .then(() => {
                        emit("cruded");
                    }, (error) => {
                        parseResponseError(error);
                    })
                }
    }
</script>
