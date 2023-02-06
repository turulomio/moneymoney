<!--
    Value:
        Can be:
            - A Date iso string  new Date().toISOString().split("T")[0]
            - null. Se grabaría como null
-->


<template>
    <v-card flat>
        <v-row  class="ml-0 mr-0">                   
            <v-icon  @click="localValue=new Date().toISOString().slice(0,10)">mdi-calendar</v-icon>
            <v-btn color="primary"> c </v-btn>
            <v-btn color="primary">cc</v-btn>
            <v-select :items="years"></v-select>
            <v-select :items="months"></v-select>
            <v-btn color="primary">></v-btn>
            <v-btn>>></v-btn>
            <v-icon x-small @click="localValue=null" >mdi-backspace</v-icon>
        </v-row>
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
                menu: false,
                localValue: null,
                representation:"",
                years: this.range(this.fromyear, this.toyear),
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
            }
        },
        watch: {
            localValue (newValue) {
                this.$emit('input', newValue)
                this.setRepresentation()            },
            value (newValue) {
                this.localValue = newValue
            }
        },
        methods: {
            range(start,stop, step){
                return Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
            },
            setRepresentation(){
                if (this.localValue==null){
                    this.representation=""
                } else {
                    this.representation=this.localValue
                }
            },
            first_day_of_week(){
                if (this.$i18n.locale=="es"){
                    return 1
                } else {
                    return 0
                }
            }
        },
        created(){
            if (this.value){
                this.new_value=Object.assign({},this.value)
            } else {
                this.new_value={year:new Date().getFullYear(),month:new Date().getMonth()+1}
            }
            
        },
    }
</script>