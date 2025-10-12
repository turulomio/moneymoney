
<template>
    <v-card class="px-6 pt-8 pb-4 d-flex justify-center" flat>
        <v-btn data-test="MyMonthPicker_ButtonSubsYear" @click="subtractYear()" class="mr-2">&#60;&#60;</v-btn>
        <v-btn data-test="MyMonthPicker_ButtonSubsMonth" @click="subtractMonth()" class="mr-2">&#60;</v-btn>
        <v-text-field data-test="MyMonthPicker_Year" v-model.number="new_value.year" density="compact" class="mr-2 " :label="$t('Select a year')" style="max-width: 200px;" />
        <v-select data-test="MyMonthPicker_Month" v-model="new_value.month" density="compact" class="mr-2 " :items="months" :label="$t('Select a month')" style="max-width: 200px;" />
        <v-btn data-test="MyMonthPicker_ButtonAddYear" @click="addMonth()" class="mr-2">&#62;</v-btn>
        <v-btn data-test="MyMonthPicker_ButtonAddMonth" @click="addYear()" class="mr-2">&#62;&#62;</v-btn>
        <v-btn data-test="MyMonthPicker_ButtonCurrent" @click="setCurrentMonth()"><v-icon color="#757575">mdi-calendar</v-icon></v-btn>
    </v-card>
</template>
<script setup>
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    modelValue: { //object with year and month attribute. Can be Null to set current year and month
        required: true
    },
    readonly: {
        type: Boolean,
        required: false,
        default: false,
    },
    rules: {
        type: Array,
        required: false
    },
    fromyear: {
        type: Number,
        required: false,
        default: 1900,
    },
    frommonth: {
        type: Number,
        required: false,
        default: 1,
    },
    toyear: {
        type: Number,
        required: false,
        default: () => new Date().getFullYear() + 100
    },
    tomonth: {
        type: Number,
        required: false,
        default: 12,
    },
});

const emit = defineEmits(['update:modelValue']);
const { t } = useI18n();
const months = computed(() => [
    { title: t('January'), value: 1 },
    { title: t('February'), value: 2 },
    { title: t('March'), value: 3 },
    { title: t('April'), value: 4 },
    { title: t('May'), value: 5 },
    { title: t('June'), value: 6 },
    { title: t('July'), value: 7 },
    { title: t('August'), value: 8 },
    { title: t('September'), value: 9 },
    { title: t('October'), value: 10 },
    { title: t('November'), value: 11 },
    { title: t('December'), value: 12 },
]);

const new_value = ref({ year: null, month: null });

watch(() => new_value.value.year, (new_val) => {
    setDate(new_val, new_value.value.month);
});

watch(() => new_value.value.month, (new_val) => {
    setDate(new_value.value.year, new_val);
});

function setCurrentMonth() {
    const d = new Date();
    setDate(d.getFullYear(), d.getMonth() + 1);
}

function setDate(year, month) {
    if (isNaN(year) || isNaN(month)) {
        alert(t("You've selected a wrong year and month"));
        return;
    }
    new_value.value = { year: year, month: month };
    emit('update:modelValue', new_value.value);
}

function subtractYear() {
    setDate(new_value.value.year - 1, new_value.value.month);
}

function subtractMonth() {
    if (new_value.value.month === 1) {
        setDate(new_value.value.year - 1, 12);
    } else {
        setDate(new_value.value.year, new_value.value.month - 1);
    }
}

function addMonth() {
    if (new_value.value.month === 12) {
        setDate(new_value.value.year + 1, 1);
    } else {
        setDate(new_value.value.year, new_value.value.month + 1);
    }
}

function addYear() {
    setDate(new_value.value.year + 1, new_value.value.month);
}
if (props.modelValue == null) {
    setCurrentMonth();
} else {
    new_value.value = { ...props.modelValue };
}
</script>