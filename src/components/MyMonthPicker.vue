
<template>
    <v-card class="px-6 pt-8 pb-4 d-flex justify-center" flat>
        <v-btn @click="substractYear()" class="mr-2">&#60;&#60;</v-btn>
        <v-btn @click="substractMonth()" class="mr-2">&#60;</v-btn>
        <v-text-field v-model.number="new_value.year" density="compact" class="mr-2 " :label="$t('Select a year')" style="max-width: 200px;"/>
        <v-select v-model="new_value.month" density="compact"  class="mr-2 " :items="months" :label="$t('Select a month')" style="max-width: 200px;"/>
        <v-btn @click="addMonth()" class="mr-2">&#62;</v-btn>
        <v-btn @click="addYear()" class="mr-2">&#62;&#62;</v-btn>
        <v-btn @click="setCurrentMonth()"><v-icon color="#757575">mdi-calendar</v-icon></v-btn>
    </v-card>
</template>
<script>
    export default {    
        props: {
            modelValue: { //object with year and month attribute
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
                    { title: this.$t('January'), key: 1 },
                    { title: this.$t('February'), key: 2 },
                    { title: this.$t('March'), key: 3 },
                    { title: this.$t('April'), key: 4 },
                    { title: this.$t('May'), key: 5 },
                    { title: this.$t('June'), key: 6 },
                    { title: this.$t('July'), key: 7 },
                    { title: this.$t('August'), key: 8 },
                    { title: this.$t('September'), key: 9 },
                    { title: this.$t('October'), key: 10 },
                    { title: this.$t('November'), key: 11 },
                    { title: this.$t('December'), key: 12 },
                ],
                new_value:{year:null,month:null},
            }
        },
        methods: {
            setCurrentMonth(){
                var d=new Date()
                this.setDate(d.getFullYear(), d.getMonth()+1)
            },
            setDate(year,month){
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