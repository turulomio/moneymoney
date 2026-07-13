<template>
    <div>
        <v-card>
            <h1>{{ title }}</h1>
            <v-form ref="form" v-model="form_valid" v-if="new_split">
                <v-col>
                    <MyDateTimePicker :readonly="mode=='D'" v-model="new_split.datetime" :label="t('Select split date and time')" />
                    <v-text-field :readonly="mode=='D'" v-model.number="new_split.before" :label="t('Before')" :rules="[v => !!v || t('Required'), v => Number.isInteger(v) && v > 0 || t('Must be greater than zero')]"></v-text-field>
                    <v-text-field :readonly="mode=='D'" v-model.number="new_split.after" :label="t('After')" :rules="[v => !!v || t('Required'), v => Number.isInteger(v) && v > 0 || t('Must be greater than zero')]"></v-text-field>
                    <v-textarea :readonly="mode=='D'" v-model="new_split.comment" :label="t('Comment')" :rules="RulesString(255, false)"></v-textarea>
                </v-col>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="submit()" :disabled="!form_valid">{{ button }}</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useStore } from '@/store'
import { useDialogs } from '@/composables/useDialogs'
import MyDateTimePicker from './MyDateTimePicker.vue'
import { RulesString } from 'vuetify_rules'
import { useI18n } from 'vue-i18n'

const props = defineProps({
    split: {
        required: true
    },
    mode: {
        required: true // CUD
    }
})

const emit = defineEmits(['cruded'])

const { t } = useI18n()
const store = useStore()
const { confirm: myConfirm } = useDialogs()

const form_valid = ref(false)
const new_split = ref(Object.assign({}, props.split))
const form = ref(null)

const title = computed(() => {
    if (props.mode === 'C') return t('Add a split')
    if (props.mode === 'U') return t('Update split')
    if (props.mode === 'D') return t('Delete split')
    return ''
})

const button = computed(() => {
    if (props.mode === 'C') return t('Add')
    if (props.mode === 'U') return t('Update')
    if (props.mode === 'D') return t('Delete')
    return ''
})

async function submit() {
    if (!form_valid.value) {
        form.value.validate()
        return
    }

    if (props.mode === 'C') {
        axios.post(`${store.apiroot}/api/splits/`, new_split.value)
            .then(() => {
                emit('cruded')
            })
    } else if (props.mode === 'U') {
        axios.put(new_split.value.url, new_split.value)
            .then(() => {
                emit('cruded')
            })
    } else if (props.mode === 'D') {
        if (!await myConfirm(t('Do you want to delete this split?'))) {
            return
        }
        axios.delete(new_split.value.url)
            .then(() => {
                emit('cruded')
            })
    }
}
</script>
