<template>
    <v-autocomplete :readonly="props.readonly" :items="items" v-model="new_value" :label="mylabel"  item-title="localname" :return-object="props.returnObject" item-value="url">
        <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :prepend-icon="mr-3" :title="item.raw.localname" />
        </template>
        <template v-slot:selection="{ props, item }">
            <v-list-item v-bind="props" :prepend-icon="pl-6" :title="item.raw.localname" />
        </template>
    </v-autocomplete>
</template>

<script setup>
import { ref, computed, watch, useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from "@/store"
import {getArrayFromMap} from "@/functions"

const props = defineProps({
    modelValue: {
        required: true,
    },
    returnObject:{
        type: Boolean,
        required:false,
        default:false,
    },
    readonly: {
        type: Boolean,
        required: false,
        default: false
    },
    type: {
        /**
        * Types 
        *    1: For NewConcepts
        *    2: For Investments Operations
        */
        type: Number,
        required: true,
    }
})

const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()
const { t } = useI18n()

const items= ref([])
if (props.type == 1) {
    items.value=getArrayFromMap(useStore().operationstypes).filter( o => [1,2].includes(o.id))
} else if (props.type == 2) {
    items.value=getArrayFromMap(useStore().operationstypes).filter( o => [4,5,6,9,10].includes(o.id))
}


const new_value = ref(props.modelValue)

const mylabel = computed(() => {
    if ('label' in attrs) return attrs.label
    return t('Select an operation type')
})

watch(() => props.modelValue, (newValue) => {
    new_value.value = newValue
})

watch(new_value, (newValue) => {
    emit('update:modelValue', newValue)
})

</script>