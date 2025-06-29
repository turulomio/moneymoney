<template>
    <v-autocomplete :readonly="readonly" :items="new_accounts" v-model="new_value" :label="mylabel"  item-title="fullname" :return-object="returnObject" item-value="url" :multiple="multiple">
      <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :title="item.raw.fullname" :class="!item.raw.active ? 'text-grey' : ''" />
        </template>         
        <template v-slot:selection="{ props, item }">
            <v-list-item v-bind="props" :title="item.raw.fullname" />
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
        accounts: {
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

    const new_accounts = computed(() => {
        if (props.accounts.length > 0) {
            return props.accounts
        }
        return getArrayFromMap(store.accounts)
    })

    const mylabel = computed(() => {
        if (attrs.label) {
            return attrs.label
        }
        return props.multiple ? t('Select accounts') : t('Select an account')
    })

</script>