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
            <v-card ref="pickerCardRef" width="660" class="pa-2" @keydown.capture.tab="onCardTab">
                <div class="d-flex flex-row">
                    <v-date-picker v-model="date" density="compact" show-adjacent-months hide-header color="primary" class="border-e no-tab-datepicker" />
                    <div class="pa-3 flex-grow-1 d-flex flex-column justify-space-between">
                        <div>
                            <div class="text-caption text-medium-emphasis mb-2 font-weight-medium">{{ $t('Time') }}</div>
                            <div class="d-flex align-center ga-1 mb-2">
                                <v-number-input :data-test="`${dataTest}_Hours`" v-model="hours" :min="0" :max="23" density="compact" variant="outlined" control-variant="stacked" hide-details="auto" :label="$t('Hours')" style="max-width: 95px;" class="focusable-time-input" @update:model-value="onChangeTime" />
                                <span class="text-h6 pb-1">:</span>
                                <v-number-input :data-test="`${dataTest}_Minutes`" v-model="minutes" :min="0" :max="59" density="compact" variant="outlined" control-variant="stacked" hide-details="auto" :label="$t('Minutes')" style="max-width: 95px;" class="focusable-time-input" @update:model-value="onChangeTime" />
                                <span class="text-h6 pb-1">:</span>
                                <v-number-input :data-test="`${dataTest}_Seconds`" v-model="seconds" :min="0" :max="59" density="compact" variant="outlined" control-variant="stacked" hide-details="auto" :label="$t('Seconds')" style="max-width: 95px;" class="focusable-time-input" @update:model-value="onChangeTime" />
                            </div>
                            <v-number-input v-if="showmicroseconds" :data-test="`${dataTest}_Microseconds`" v-model="microseconds" :min="0" :max="999999" density="compact" variant="outlined" control-variant="stacked" hide-details="auto" class="mb-2 focusable-time-input" :label="$t('Set microseconds')" @update:model-value="onChangeTime" />
                            <v-autocomplete v-if="showtimezone" :data-test="`${dataTest}_Timezone`" v-model="inputTimezone" :items="allTimezones" density="compact" variant="outlined" hide-details class="mb-2 focusable-time-input" :label="$t('Time zone')" @update:model-value="onChangeInputTimezone" />
                        </div>
                        <div class="mt-3 pt-2 border-t">
                            <v-text-field :data-test="`${dataTest}_RepresentationPreview`" :model-value="representationPreview" density="compact" variant="outlined" bg-color="#f5f5f5" hide-details readonly tabindex="-1" class="mb-2 representation-preview-text" :label="representationLabel" prepend-inner-icon="mdi-clock-check-outline" />
                            <div class="d-flex justify-space-between align-center">
                                <v-btn size="small" variant="text" prepend-icon="mdi-clock-outline" tabindex="-1" @click="setCurrentTime">{{ $t('Now') }}</v-btn>
                                <v-btn size="small" color="primary" variant="tonal" tabindex="-1" @click="menu = false">{{ $t('Close') }}</v-btn>
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
/** @type {import('vue').Ref<HTMLElement|null>} */
const pickerCardRef = ref(null)
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

/**
 * Returns focusable time and timezone input elements inside the card.
 * @returns {HTMLInputElement[]}
 */
function getFocusableTimeInputs() {
    if (!pickerCardRef.value) return []
    const cardEl = pickerCardRef.value.$el || pickerCardRef.value
    // Encuentra los inputs de texto de los v-number-input y del v-autocomplete
    const inputs = Array.from(cardEl.querySelectorAll('.focusable-time-input input:not([type="hidden"])'))
    return inputs.filter((el) => !el.disabled && el.offsetParent !== null)
}

/**
 * Traps Tab and Shift+Tab navigation strictly within the time/timezone input fields in a loop.
 * @param {KeyboardEvent} e
 */
function onCardTab(e) {
    const inputs = getFocusableTimeInputs()
    if (!inputs.length) return

    e.preventDefault()
    e.stopPropagation()

    const activeEl = document.activeElement
    let currentIndex = inputs.indexOf(activeEl)
    if (currentIndex === -1 && activeEl) {
        currentIndex = inputs.findIndex((inp) => inp.closest('.focusable-time-input') === activeEl.closest('.focusable-time-input'))
    }

    if (e.shiftKey) {
        if (currentIndex <= 0) {
            inputs[inputs.length - 1].focus()
            inputs[inputs.length - 1].select?.()
        } else {
            inputs[currentIndex - 1].focus()
            inputs[currentIndex - 1].select?.()
        }
    } else {
        if (currentIndex === -1 || currentIndex >= inputs.length - 1) {
            inputs[0].focus()
            inputs[0].select?.()
        } else {
            inputs[currentIndex + 1].focus()
            inputs[currentIndex + 1].select?.()
        }
    }
}

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

watch(menu, (isOpen) => {
    if (isOpen) {
        // En cuanto el menu se despliega, neutraliza los botones del calendario y los steppers para que no capturen foco
        const focusHours = () => {
            const cardEl = pickerCardRef.value?.$el || pickerCardRef.value
            if (cardEl) {
                cardEl.querySelectorAll('.no-tab-datepicker button, .v-number-input__control button').forEach((btn) => btn.setAttribute('tabindex', '-1'))
            }
            const inputs = getFocusableTimeInputs()
            if (inputs.length) {
                inputs[0].focus()
                inputs[0].select?.()
            }
        }
        setTimeout(focusHours, 40)
        setTimeout(focusHours, 120)
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

.no-tab-datepicker :deep(button),
.no-tab-datepicker :deep([tabindex]) {
    tabindex: -1 !important;
}
</style>
