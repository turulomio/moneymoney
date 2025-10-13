<template>
    <div>    
        <h1>{{ title }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid">
                <v-text-field data-test="ConceptsCU_Name" :readonly="props.mode=='D'" density="compact" v-model="new_concept.name" :label="$t('Set concept')" :placeholder="$t('Set concept')" :rules="RulesString(200,true)" counter="200" autofocus/>
                <AutocompleteOperationstypes data-test="ConceptsCU_OperationsTypes" :readonly="props.mode=='D' || editing" density="compact" v-model="new_concept.operationstypes" :label="$t('Select an operation type')" :type="1" :rules="RulesSelection(true)" />
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" data-test="ConceptsCU_Button" @click="accept" :disabled="!form_valid">{{ button }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script setup>
    import axios from 'axios'
    import { useStore } from '@/store'
    import { RulesSelection, RulesString } from 'vuetify_rules'
    import { newParseResponseError, myheaders } from '@/functions'
    import AutocompleteOperationstypes from './AutocompleteOperationstypes.vue'
    import { ref, computed } from 'vue'
    import { useI18n } from 'vue-i18n'

    const props = defineProps({
        concept: {
            required: true // Null to create, io object to update
        },
        mode: {
            required: true // Can be CUD
        }
    })

    const emit = defineEmits(['cruded'])
    const { t } = useI18n()
    const store = useStore()

    const form_valid = ref(false)
    const new_concept = ref(Object.assign({}, props.concept))
    const editing = ref(false) // Assuming this might be used for readonly logic
    const form = ref(null)

    const title = computed(() => {
        if (props.mode === "D") return t("Deleting concept")
        if (props.mode === "U") return t("Updating concept")
        return t("Creating a new concept")
    })

    const button = computed(() => {
        if (props.mode === "U") return t("Update")
        if (props.mode === "C") return t("Add")
        return t("Delete")
    })

    function accept() {
        if (!form_valid.value) {
            form.value.validate()
            return
        }

        if (props.mode === "U") {
            axios.put(new_concept.value.url, new_concept.value, myheaders())
                .then((response) => {
                    store.concepts.set(response.data.url, response.data)
                    emit("cruded")
                }, (error) => {
                    newParseResponseError(error, t, store)
                })
        } else if (props.mode === "C") {
            axios.post(`${store.apiroot}/api/concepts/`, new_concept.value, myheaders())
                .then((response) => {
                    store.concepts.set(response.data.url, response.data)
                    emit("cruded")
                }, (error) => {
                    newParseResponseError(error, t, store)
                })
        } else if (props.mode === "D") {
            if (!confirm(t("Do you want to delete this concept?"))) {
                return
            }
            axios.delete(new_concept.value.url, myheaders())
                .then((response) => {
                    store.concepts.delete(response.data.url, response.data)
                    emit("cruded")
                }, (error) => {
                    newParseResponseError(error, t, store)
                })
        }
    }
</script>
