<template>
    <div>    
        <h1>{{ f(t(`'[0]' transfers`), [investment.fullname]) }}
            <MyMenuInline :items="menuinline_items" data-test="InvestmentsTransfers_MyMenuInline"/>
        </h1>
        <TableInvestmentsTransfers ref="table_it" :items="items" :investment="investment" :key="key" :loading="loading" @cruded="on_cruded" />
    </div>
</template>

<script setup>
    import axios from 'axios'
    import { useStore } from "@/store"
    import MyMenuInline from './MyMenuInline.vue'    
    import { myheaders, newParseResponseError } from '@/functions'
    import { ref, onMounted } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { f } from 'vuetify_rules'
    import TableInvestmentsTransfers from './TableInvestmentsTransfers.vue'

    const { t } = useI18n()

    const props = defineProps({
        investment: null, // Investment object
    })

    const items = ref([])
    const key=ref(0)
    const table_it=ref(null)

    const menuinline_items = ref([
        {
            subheader: t("Investments transfers options"),
            children: [
                {
                    name: t("Add a new investment transfer"),
                    icon: "mdi-plus",
                    code: () => {
                        table_it.value.addTransfer()
                    }
                },
            ]
        },
    ])

    const loading = ref(false)

    function on_cruded(){
        update_table()
    }


    function update_table(){
        loading.value = true
        axios.get(`${useStore().apiroot}/api/investmentstransfers/?investment=${props.investment.url}`, myheaders())
        .then((response) => {
            items.value = response.data
            loading.value = false
            key.value++
        }, (error) => {
            newParseResponseError(error, t, useStore())
        });
    }

    onMounted(() => {
        update_table()
    })
</script>