<template>
    <div>
        <h1>{{ title }}</h1>
        <v-card class="pa-8 mt-2">
            <v-form ref="form">
                <v-text-field data-test="StrategyPairsCU_Name" :readonly="mode === 'D'" v-model="new_strategy.strategy.name" :label="t('Set strategy name')" :placeholder="t('Set strategy name')" :rules="RulesString(200, true)" counter="200" autofocus />
                <v-row class="d-flex flex-row mx-auto mt-2" justify="center">
                    <MyDateTimePicker data-test="StrategyPairsCU_DtFrom" class="mr-4" :readonly="mode === 'D'" v-model="new_strategy.strategy.dt_from" :label="t('Date and time strategy start')" />
                    <MyDateTimePicker data-test="StrategyPairsCU_DtTo" :readonly="mode === 'D'" v-model="new_strategy.strategy.dt_to" :label="t('Date and time strategy end')" :clearable="true" />
                </v-row>
                <v-select data-test="StrategyPairsCU_Type" readonly :items="getArrayFromMap(store.strategiestypes)" v-model="new_strategy.strategy.type" :label="t('Select strategy type')" item-title="name" item-value="id" :rules="RulesSelection(true)"></v-select>
                <v-textarea data-test="StrategyPairsCU_Comment" :readonly="mode === 'D'" v-model="new_strategy.strategy.comment" :label="t('Set strategy comment')" :placeholder="t('Set strategy comment')" :rules="RulesString(200, false)" counter="200"></v-textarea>
                <AutocompleteAccounts data-test="StrategyPairsCU_Account" v-model="new_strategy.account" :readonly="mode === 'D'" />
                <AutocompleteProducts data-test="StrategyPairsCU_BetterProduct" :readonly="mode === 'D'" v-model="new_strategy.better_product" />
                <AutocompleteProducts data-test="StrategyPairsCU_WorseProduct" :readonly="mode === 'D'" v-model="new_strategy.worse_product" />
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="StrategyPairsCU_Button" color="primary" @click="accept()">{{ button_text }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script setup>
    import { ref, computed } from 'vue'
    import axios from 'axios'
    import { useStore } from "@/store"
    import { useI18n } from 'vue-i18n'
    import MyDateTimePicker from './MyDateTimePicker.vue'
    import AutocompleteAccounts from '@/components/AutocompleteAccounts.vue'
    import AutocompleteProducts from '@/components/AutocompleteProducts.vue'
    import { RulesSelection, RulesString } from 'vuetify_rules'
    import { getArrayFromMap, parseResponseError, myheaders } from '@/functions'

    const props = defineProps({
        strategy: {
            required: true
        },
        mode: {
            type: String,
            required: true, // C, R, U, D
        },
    })

    const emit = defineEmits(['cruded'])

    const { t } = useI18n()
    const store = useStore()

    const form = ref(null)
    const new_strategy = ref(JSON.parse(JSON.stringify(props.strategy)))

    const title = computed(() => {
        if (props.mode === "U") {
            return t("Updating strategy")
        } else if (props.mode === "C") {
            return t("Creating a new strategy")
        } else if (props.mode === "D") {
            return t("Deleting strategy")
        }
        return ""
    })

    const button_text = computed(() => {
        if (props.mode === "U") {
            return t("Update")
        } else if (props.mode === "C") {
            return t("Create")
        } else if (props.mode === "D") {
            return t("Delete")
        }
        return ""
    })

    async function accept() {
        const { valid } = await form.value.validate()
        if (!valid) return

        if (props.mode === "U") {
            axios.put(new_strategy.value.url, new_strategy.value, myheaders())
                .then(() => {
                    emit("cruded")
                }, (error) => {
                    parseResponseError(error)
                })
        } else if (props.mode === "C") {
            axios.post(`${store.apiroot}/api/strategies_pairsinsameaccount/`, new_strategy.value, myheaders())
                .then(() => {
                    emit("cruded")
                }, (error) => {
                    parseResponseError(error)
                })
        } else if (props.mode === "D") {
            if (confirm(t("This pairs in same account strategy will be deleted. Do you want to continue?"))) {
                axios.delete(new_strategy.value.url, myheaders())
                    .then(() => {
                        emit("cruded")
                    }, (error) => {
                        parseResponseError(error)
                    });
            }
        }
    }
</script>
