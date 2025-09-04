<template>
    <div>    
        <h1>{{ f(t(`'[0]' transfers`), [investment.fullname]) }}
            <MyMenuInline :items="menuinline_items" data-test="StrategiesList_MyMenuInline"/>
        </h1>
    </div>
</template>

<script setup>
    import axios from 'axios'
    import { useStore } from "@/store"
    import MyMenuInline from './MyMenuInline.vue'    
    import { parseResponseError, myheaders } from '@/functions'
    import { ref, onMounted, watch, defineProps } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { f } from 'vuetify_rules'

    const { t } = useI18n()
    const store = useStore()

    const props = defineProps({
        investment: Object, // Investment object
    })
    const showActive = ref(true)
    const strategies_items = ref([])
    const menuinline_items = ref([
        {
            subheader: t("Strategy options"),
            children: [
                {
                    name: t("Add a new fast operations strategy"),
                    icon: "mdi-pencil",
                    code: () => {
                        // strategy.value = empty_strategy_fast_operations()
                        strategy_mode.value = "C"
                        key.value = key.value + 1
                        dialog_strategy_fast_operations_cu.value = true
                    }
                },
            ]
        },
    ])
    const dialog_strategy_fast_operations_cu = ref(false)
    const strategy_mode = ref(null)
    const loading_strategies = ref(false)
    const key = ref(0)

    watch(showActive, () => {
        update_table()
    })


    function update_table(){
        loading_strategies.value = true
        axios.get(`${store.apiroot}/api/strategies/withbalance/?active=${showActive.value}`, myheaders())
        .then((response) => {
            strategies_items.value = response.data
            console.log(strategies_items.value)
            loading_strategies.value = false
        }, (error) => {
            parseResponseError(error)
        });
    }

    onMounted(() => {
        console.log("Investment", props.investment)
        // update_table()
    })
</script>