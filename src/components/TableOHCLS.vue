<template>
    <div>
        <v-data-table ref="table" density="compact" :headers="table_headers" :items="items" class="elevation-1" :sort-by="[{key:'datetime',order:'asc'}]" fixed-header :height="$attrs.height" :items-per-page="10000" >
            <template #item.datetime="{item}">
                <div>{{ localtime(item.datetime)}}</div>
            </template>        
            <template #item.open="{item}">
                <div v-html="currency_html(item.open,product.currency, product.decimals)"></div>
            </template>     
            <template #item.close="{item}">
                <div v-html="currency_html(item.close,product.currency, product.decimals)"></div>
            </template>     
            <template #item.high="{item}">
                <div v-html="currency_html(item.high,product.currency, product.decimals)"></div>
            </template>     
            <template #item.low="{item}">
                <div v-html="currency_html(item.low,product.currency, product.decimals)"></div>
            </template>   
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="deleteOHCL(item)">mdi-delete</v-icon>
            </template>
                <template #bottom ></template>   
        </v-data-table>
    </div>
</template>
<script setup>
    import { ref, computed, onMounted, nextTick, defineExpose } from 'vue'
    import axios from 'axios'
    import { useStore } from "@/store"
    import { localtime } from 'vuetify_rules'
    import { parseResponseError, currency_html, myheaders } from '@/functions'
    import { useI18n } from 'vue-i18n'

    const props = defineProps({
        items: {
            required: true
        },
        product: {   // Must be a product object
            required: true
        },
    })

    const emit = defineEmits(['cruded'])

    const store = useStore()
    const { t } = useI18n()

    const table = ref(null)

    function deleteOHCL(item){
        var r = confirm(t("Do you want to delete this OHCL quotes?"))
        if(r == false) {
            return
        } 
        var headers={...myheaders(),data:{product:props.product.url,date:item.date}}
        axios.delete(`${store.apiroot}/products/quotes/ohcl/`, headers)
        .then(() => {
            emit("cruded")
        }, (error) => {
            parseResponseError(error)
        });
    }

    const table_headers = computed(() => [
        { title: t('Date and time'), key: 'date', sortable: true },
        { title: t('Open'), key: 'open', sortable: true },
        { title: t('High'), key: 'high', sortable: true },
        { title: t('Close'), key: 'close', sortable: true },
        { title: t('Low'), key: 'low', sortable: true },
        { title: t('Actions'), key: 'actions', sortable: false },
    ])

    async function gotoLastRow(){
        await nextTick()
        const tableWrapper = table.value?.$el?.querySelector('.v-table__wrapper')
        if (tableWrapper) {
            tableWrapper.scrollTop = tableWrapper.scrollHeight
        }
    }

    onMounted(() => {
        gotoLastRow()
    })

    defineExpose({
        gotoLastRow,
    })
</script>