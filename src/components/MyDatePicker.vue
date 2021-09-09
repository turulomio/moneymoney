<!--
    Value:
        Can be:
            - A Date iso string  new Date().toISOString().split("T")[0]
            - null. Se grabaría como null
-->


<template>
    <div>
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
                <v-row justify="center" align="center">
                    <v-text-field v-model="representation" :name="$attrs.name" :label="$attrs.label" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                    <v-icon x-small @click="localValue=null">mdi-backspace</v-icon>
                </v-row>
            </template>
            <v-date-picker v-model="localValue" :first-day-of-week="first_day_of_week()" :locale="$i18n.locale" @input="menu = false"></v-date-picker>
        </v-menu>
    </div>
</template>
<script>
    export default {    
        props: {
            value: {
                required: true
            },
        },
        data: function(){
            return {
                menu: false,
                localValue: null,
                representation:"",
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
            setRepresentation(){
                if (this.localValue==null){
                    this.representation=""
                } else {
                    this.representation=this.localValue
                }
            },
            first_day_of_week(){
                console.log(this.$i18n.locale)
                if (this.$i18n.locale=="es"){
                    return 1
                } else {
                    return 0
                }
            }
        },
        created(){
            if (this.value == null){
                this.localValue=null
            } else {
                this.localValue=this.value
            }    
        },
    }
</script>
