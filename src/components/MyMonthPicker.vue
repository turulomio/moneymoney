<template>
    <v-card class="px-6 pt-8 pb-4 d-flex justify-center" flat>
        <v-btn @click="substractYear()" class="mr-2">&#60;&#60;</v-btn>
        <v-btn @click="substractMonth()" class="mr-2">&#60;</v-btn>
        <v-text-field v-model="new_value.year" dense class="mr-2 " :label="$t('Select a year')" style="max-width: 200px;"/>
        <v-select v-model="new_value.month" dense  class="mr-2 " :items="months" :label="$t('Select a month')" style="max-width: 200px;"/>
        <v-btn @click="addMonth()" class="mr-2">&#62;</v-btn>
        <v-btn @click="addYear()" class="mr-2">&#62;&#62;</v-btn>
        <v-btn @click="setCurrentMonth()"><v-icon color="#757575;">mdi-calendar</v-icon></v-btn>
    </v-card>
</template>
<script>
    export default {    
        props: {
            value: { //object with year and month attribute
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
                    { text: this.$t('January'), value: 1 },
                    { text: this.$t('February'), value: 2 },
                    { text: this.$t('March'), value: 3 },
                    { text: this.$t('April'), value: 4 },
                    { text: this.$t('May'), value: 5 },
                    { text: this.$t('June'), value: 6 },
                    { text: this.$t('July'), value: 7 },
                    { text: this.$t('August'), value: 8 },
                    { text: this.$t('September'), value: 9 },
                    { text: this.$t('October'), value: 10 },
                    { text: this.$t('November'), value: 11 },
                    { text: this.$t('December'), value: 12 },
                ],
                new_value:{year:null,month:null},
            }
        },
        computed:{
        },
        methods: {
            setCurrentMonth(){
                var d=new Date()
                this.setDate(d.getFullYear(), d.getMonth()+1)
            },
            setDate(year,month){
                this.new_value={year:year,month:month}
                this.$emit("input",this.new_value)

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
            if (this.value){
                this.new_value=Object.assign({},this.value)
            } else {
                this.setCurrentMonth()
            }
            
        },
    }
</script>