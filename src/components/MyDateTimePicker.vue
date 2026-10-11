<template>
    <div>
        <v-menu v-model="menu" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
                <div class="d-flex flex-row">
                    <v-text-field :data-test="`${dataTest}_Menu`" v-model="representation" style="min-width: 300px;" :label="label" v-bind="props" :readonly="true" :disabled="readonly" :clearable="clearable && !readonly" @click:clear.stop="clear">
                        <template v-slot:prepend>
                            <v-icon :data-test="`${dataTest}_Icon`" :disabled="readonly" @click.stop="setCurrentTime">mdi-calendar-clock</v-icon>
                        </template>
                    </v-text-field>
                </div>
            </template>
            <v-card width="660" class="pa-2">
                <div class="d-flex flex-row">
                    <v-date-picker v-model="date" density="compact" show-adjacent-months hide-header color="primary" class="border-e" />
                    <div class="pa-3 flex-grow-1 d-flex flex-column justify-space-between">
                        <div>
                            <div class="text-caption text-medium-emphasis mb-2 font-weight-medium">{{ $t('Time') }}</div>
                            <div class="d-flex align-center ga-1 mb-2">
                                <v-text-field :data-test="`${dataTest}_Hours`" v-model.number="hours" density="compact" variant="outlined" hide-details="auto" :label="$t('Set hours')" :rules="RulesInteger(2, true)" style="max-width: 85px;" @change="onChangeTime" />
                                <span class="text-h6 pb-1">:</span>
                                <v-text-field :data-test="`${dataTest}_Minutes`" v-model.number="minutes" density="compact" variant="outlined" hide-details="auto" :label="$t('Set minutes')" :rules="RulesInteger(2, true)" style="max-width: 85px;" @change="onChangeTime" />
                                <span class="text-h6 pb-1">:</span>
                                <v-text-field :data-test="`${dataTest}_Seconds`" v-model.number="seconds" density="compact" variant="outlined" hide-details="auto" :label="$t('Set seconds')" :rules="RulesInteger(2, true)" style="max-width: 85px;" @change="onChangeTime" />
                            </div>
                            <v-text-field v-if="showmicroseconds" :data-test="`${dataTest}_Microseconds`" v-model.number="microseconds" density="compact" variant="outlined" hide-details="auto" class="mb-2" :label="$t('Set microseconds')" :rules="RulesInteger(6, true)" @change="onChangeTime" />
                            <v-autocomplete v-if="showtimezone" :data-test="`${dataTest}_Timezone`" v-model="inputTimezone" :items="allTimezones" density="compact" variant="outlined" hide-details class="mb-2" :label="$t('Time zone')" @update:model-value="onChangeInputTimezone" />
                        </div>
                        <div class="mt-3 pt-2 border-t">
                            <v-text-field :data-test="`${dataTest}_RepresentationPreview`" :model-value="representationPreview" density="compact" variant="outlined" bg-color="#f5f5f5" hide-details readonly class="mb-2 representation-preview-text" :label="representationLabel" prepend-inner-icon="mdi-clock-check-outline" />
                            <div class="d-flex justify-space-between align-center">
                                <v-btn size="small" variant="text" prepend-icon="mdi-clock-outline" @click="setCurrentTime">{{ $t('Now') }}</v-btn>
                                <v-btn size="small" color="primary" variant="tonal" @click="menu = false">{{ $t('Close') }}</v-btn>
                            </div>
                        </div>
                    </div>
                </div>
            </v-card>
        </v-menu>
    </div>
</template>

<script setup>
/**
 * MyDateTimePicker component.
 * Allows picking date and time (hours, minutes, seconds, microseconds) in an input timezone,
 * emits ISO UTC string representations, and formats text-field representation in representationTimezone.
 * On load, input timezone initializes to representationTimezone (or browser/system timezone).
 * Changing input timezone preserves the fields in the dropdown and recalculates representation & UTC ISO.
 */
import { ref, computed, watch, useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'
import { RulesInteger } from 'vuetify_rules'
import moment from 'moment-timezone'

const props = defineProps({
    /** @type {import('vue').PropType<string|null>} modelValue in ISO UTC format or null */
    modelValue: {
        required: true,
        validator: (val) => val === null || typeof val === 'string'
    },
    /** @type {import('vue').PropType<boolean>} */
    readonly: {
        type: Boolean,
        default: false
    },
    /** @type {import('vue').PropType<boolean>} */
    clearable: {
        type: Boolean,
        default: false
    },
    /** @type {import('vue').PropType<string>} */
    dataTest: {
        type: String,
        default: 'MyDateTimePicker'
    },
    /** @type {import('vue').PropType<string|null>} Timezone for representation and initial load. If null, falls back to browser/system timezone */
    representationTimezone: {
        type: String,
        required: false,
        default: null
    },
    /** @type {import('vue').PropType<boolean>} Whether to show microseconds field */
    showmicroseconds: {
        type: Boolean,
        default: false
    },
    /** @type {import('vue').PropType<boolean>} Whether to show timezone selector and representation preview */
    showtimezone: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()
const { t } = useI18n()

/** @type {string[]} list of all timezone identifiers supported by moment-timezone */
const allTimezones = moment.tz.names()

/**
 * Gets the browser or system timezone.
 * @returns {string}
 */
function getSystemTimezone() {
    return moment.tz.guess()
}

/** Active representation timezone (prop or system timezone fallback) */
const effectiveRepresentationTimezone = computed(() => {
    return props.representationTimezone || getSystemTimezone()
})

/** @type {import('vue').Ref<boolean>} */
const menu = ref(false)
/** @type {import('vue').Ref<Date|null>} */
const date = ref(null)
/** @type {import('vue').Ref<number|null>} */
const hours = ref(null)
/** @type {import('vue').Ref<number|null>} */
const minutes = ref(null)
/** @type {import('vue').Ref<number|null>} */
const seconds = ref(null)
/** @type {import('vue').Ref<number|null>} */
const microseconds = ref(null)
/** @type {import('vue').Ref<string>} Input timezone used when editing date/time. Initializes to representationTimezone */
const inputTimezone = ref(effectiveRepresentationTimezone.value)
/** @type {import('vue').Ref<string>} */
const representation = ref('')

/** Label for activator text field showing representation timezone when showtimezone is true */
const label = computed(() => {
    const baseLabel = attrs.label || t('Select a date and a time')
    return props.showtimezone ? `${baseLabel} (${effectiveRepresentationTimezone.value})` : baseLabel
})

/** Label for preview field inside dialog */
const representationLabel = computed(() => {
    return `${t('Representation')} (${effectiveRepresentationTimezone.value})`
})

/** Representation preview inside dropdown under timezone */
const representationPreview = computed(() => {
    return representation.value
})

/**
 * Formats an ISO string according to representation timezone.
 * @param {string|null} val
 * @returns {string}
 */
function formatRepresentation(val) {
    if (!val || typeof val !== 'string') return ''
    const m = moment.tz(val, effectiveRepresentationTimezone.value)
    return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : ''
}

/**
 * Parses an ISO string into widget date/time parts according to specified timezone.
 * @param {string|null} isoString
 * @param {string} tz
 */
function string2widget(isoString, tz = (inputTimezone.value || effectiveRepresentationTimezone.value)) {
    if (!isoString) {
        date.value = null
        hours.value = null
        minutes.value = null
        seconds.value = null
        microseconds.value = null
        return
    }
    const m = moment.tz(isoString, tz)
    if (!m.isValid()) return
    date.value = m.toDate()
    hours.value = m.hours()
    minutes.value = m.minutes()
    seconds.value = m.seconds()
    microseconds.value = m.milliseconds() * 1000
}

/**
 * Builds an ISO UTC string from current widget date, time and inputTimezone.
 * @returns {string|null}
 */
function widget2string() {
    if (!date.value || hours.value == null || hours.value === '') {
        return null
    }
    const tz = inputTimezone.value || effectiveRepresentationTimezone.value
    const d = new Date(date.value)
    const m = moment.tz(
        {
            year: d.getFullYear(),
            month: d.getMonth(),
            date: d.getDate(),
            hour: hours.value || 0,
            minute: minutes.value || 0,
            second: seconds.value || 0,
            millisecond: Math.floor((microseconds.value || 0) / 1000)
        },
        tz
    )
    return m.toISOString()
}

/**
 * Updates text representation in representation timezone.
 * @param {string|null} val
 */
function updateRepresentation(val) {
    representation.value = formatRepresentation(val)
}

/**
 * Handler for date picker selection changes.
 */
function onDateChange() {
    if (hours.value == null) {
        const now = moment.tz(inputTimezone.value || effectiveRepresentationTimezone.value)
        hours.value = now.hours()
        minutes.value = now.minutes()
        seconds.value = now.seconds()
        microseconds.value = now.milliseconds() * 1000
    }
    const newVal = widget2string()
    updateRepresentation(newVal)
    emit('update:modelValue', newVal)
}

/**
 * Handler for changes in the time input fields.
 */
function onChangeTime() {
    const newVal = widget2string()
    updateRepresentation(newVal)
    emit('update:modelValue', newVal)
}

/**
 * Handler for changes in input timezone autocomplete.
 * Preserves the current numbers in the inputs (date, hours, minutes, seconds)
 * and recalculates the UTC ISO value and the representation string.
 */
function onChangeInputTimezone() {
    const newVal = widget2string()
    updateRepresentation(newVal)
    emit('update:modelValue', newVal)
}

/**
 * Clears selected datetime value.
 */
function clear() {
    string2widget(null)
    updateRepresentation(null)
    emit('update:modelValue', null)
}

/**
 * Sets current local date and time.
 */
function setCurrentTime() {
    if (props.readonly) return
    const nowIso = new Date().toISOString()
    string2widget(nowIso, inputTimezone.value || effectiveRepresentationTimezone.value)
    updateRepresentation(nowIso)
    emit('update:modelValue', nowIso)
}

watch(
    effectiveRepresentationTimezone,
    () => {
        // Al cambiar representationTimezone externamente, solo se actualiza la representación
        updateRepresentation(props.modelValue)
    }
)

watch(
    () => props.modelValue,
    (newVal) => {
        if (!menu.value) {
            // Cuando el diálogo no está abierto, al recibir nuevo modelValue inicializa el timezone de entrada
            inputTimezone.value = effectiveRepresentationTimezone.value
            string2widget(newVal, inputTimezone.value)
        }
        updateRepresentation(newVal)
    },
    { immediate: true }
)

watch(date, (newDate, oldDate) => {
    if (newDate && (!oldDate || newDate.getTime() !== oldDate.getTime())) {
        onDateChange()
    }
})

// Initialize default value when not clearable and modelValue is null
if (!props.clearable && props.modelValue == null) {
    setCurrentTime()
}
</script>

<style scoped>
.representation-preview-text :deep(input) {
    color: #424242 !important;
    font-weight: 600 !important;
}
</style>
