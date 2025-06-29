<template>
    <v-autocomplete :readonly="readonly" :items="new_products" v-model="new_value" :label="mylabel"  item-title="fullname" :return-object="returnObject" item-value="url" :multiple="multiple">
      <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :prepend-icon="`mr-3 fi fib fi-${item.raw.flag}`" :title="item.raw.fullname" :class="item.raw.obsolete ? 'text-grey' : ''" />
        </template>         
        <template v-slot:selection="{ props, item }">
            <v-list-item v-bind="props" :prepend-icon="`pl-6 mr-3 fi fib fi-${item.raw.flag}`" :title="item.raw.fullname" />
        </template> 
    </v-autocomplete>
</template>

<script setup>
    import { computed, useAttrs } from 'vue'
    import { useStore } from "@/store"
    import { useI18n } from 'vue-i18n'
    import { getArrayFromMap } from "@/functions"

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
        products: {
            type: Array,
            required:false,
            default: () => [],
        },
        multiple: {
            type: Boolean,
            required: false,
            default: false,
        }
    })

    const emit = defineEmits(['update:modelValue'])

    const store = useStore()
    const { t } = useI18n()
    const attrs = useAttrs()

    const new_value = computed({
        get: () => props.modelValue,
        set: (value) => emit('update:modelValue', value)
    })

    const new_products = computed(() => {
        if (props.products.length > 0) {
            return props.products
        }
        return getArrayFromMap(store.products)
    })

    const mylabel = computed(() => {
        if (attrs.label) {
            return attrs.label
        }
        return props.multiple ? t('Select products') : t('Select a product')
    })
</script>