
<template>
    <v-card class="px-6 pt-8 pb-4 d-flex justify-center" flat>
        <v-btn data-test="MyMonthPicker_ButtonSubsYear" @click="substractYear()" class="mr-2">&#60;&#60;</v-btn>
        <v-btn data-test="MyMonthPicker_ButtonSubsMonth" @click="substractMonth()" class="mr-2">&#60;</v-btn>
        <v-text-field data-test="MyMonthPicker_Year" v-model.number="new_value.year" density="compact" class="mr-2 " :label="$t('Select a year')" style="max-width: 200px;"/>
        <v-select data-test="MyMonthPicker_Month" v-model="new_value.month" density="compact"  class="mr-2 " :items="months" :label="$t('Select a month')" style="max-width: 200px;"/>
        <v-btn data-test="MyMonthPicker_ButtonAddYear" @click="addMonth()" class="mr-2">&#62;</v-btn>
        <v-btn data-test="MyMonthPicker_ButtonAddMonth" @click="addYear()" class="mr-2">&#62;&#62;</v-btn>
        <v-btn data-test="MyMonthPicker_ButtonCurrent" @click="setCurrentMonth()"><v-icon color="#757575">mdi-calendar</v-icon></v-btn>
    </v-card>
</template>
<script>
    export default {    
        props: {
            modelValue: { //object with year and month attribute. Can be Null to set current year and month
                required: true
            },
            readonly: {
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
                default: new Date().getFullYear() + 100
            },
            tomonth: {
                type: Number,
                required: false,
                default: 12,
            },
        },
        data: function(){
            return {
                months: [
                    { title: this.$t('January'), value: 1 },
                    { title: this.$t('February'), value: 2 },
                    { title: this.$t('March'), value: 3 },
                    { title: this.$t('April'), value: 4 },
                    { title: this.$t('May'), value: 5 },
                    { title: this.$t('June'), value: 6 },
                    { title: this.$t('July'), value: 7 },
                    { title: this.$t('August'), value: 8 },
                    { title: this.$t('September'), value: 9 },
                    { title: this.$t('October'), value: 10 },
                    { title: this.$t('November'), value: 11 },
                    { title: this.$t('December'), value: 12 },
                ],
                new_value:{year:null,month:null},
            }
        },
        watch:{
            "new_value.year"(new_val){
                this.setDate(new_val, this.new_value.month)
            },
            "new_value.month"(new_val){
                this.setDate(this.new_value.year, new_val)
            }
        },
        methods: {
            setCurrentMonth(){
                var d=new Date()
                this.setDate(d.getFullYear(), d.getMonth()+1)
            },
            setDate(year,month){
                if (isNaN(year) || isNaN(month)){
                    alert(this.$t("You've selected a wrong year and month"))
                    return
                }
                this.new_value={year:year,month:month}
                this.$emit('update:modelValue', this.new_value)
            },
            substractYear(){
                this.setDate(this.new_value.year-1,this.new_value.month)
            },
            substractMonth(){
                if (this.new_value.month==1){
                    this.setDate(this.new_value.year-1, 12)
                } else {
                    this.setDate(this.new_value.year,this.new_value.month-1)
                }
            },
            addMonth(){
                if (this.new_value.month==12){
                    this.setDate(this.new_value.year+1, 1)
                } else {
                    this.setDate(this.new_value.year,this.new_value.month+1)
                }
            },
            addYear(){
                this.setDate(this.new_value.year+1,this.new_value.month)
            },
        },
        created(){
            if (this.modelValue){
                this.new_value=Object.assign({},this.modelValue)
            } else {
                this.setCurrentMonth()
            }
        },
    }
</script>