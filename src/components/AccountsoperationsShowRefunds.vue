<template>
    <div>    
        <h1>{{ t("Show refunds for selected account operation") }}</h1>
        <v-card outlined class="ma-4 pa-4">   
            <TableAccountOperations showaccount showtotal :items="items" height="400" class=" flex-grow-1 flex-shrink-0" :key="key" @cruded="on_TableAccountOperations_cruded"/>
        </v-card>
            <p>{{ f(t(`Final amount after refunds: [0]`), [ currency_generic_string( props.ao.amount+listobjects_sum(items,"amount"), props.ao.currency ) ] )}}</p>
    </div>
</template>

<script setup>
    import axios from 'axios'
    import { ref, onMounted } from 'vue'
    import { currency_generic_string } from '@/store'
    import TableAccountOperations from './TableAccountOperations.vue'
    import { listobjects_sum } from '@/functions'
    import { useI18n } from 'vue-i18n'
    import {f} from 'vuetify_rules'

    const props = defineProps({
        ao: { // Account operation object
            required: true}})

    const { t } = useI18n()

    const items = ref([])
    const key = ref(0)

    function on_TableAccountOperations_cruded(){
        update_table()
    }

    function update_table(){
        axios.get(`${props.ao.url}get_refunds/`)
            .then((response) => {
                items.value = response.data
                key.value++
            });
    }

    onMounted(() => {
        update_table()
    })
</script>
