<!--
    Value:
        Can be:
            - A Date iso string  new Date().toISOString().split("T")[0]
            - null. Se grabaría como null
-->


<template>
    <div>
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto" :disabled="readonly">
            <template v-slot:activator="{ on, attrs }">
                <v-row justify="center" align="center" class="ml-0 mr-0">                   
                    <v-icon  @click="localValue=new Date().toISOString().slice(0,10)">mdi-calendar</v-icon>
                    <v-text-field class="ml-3 mr-3" v-model="representation" :name="$attrs.name" :label="$attrs.label" readonly v-bind="attrs" v-on="on" :rules="rules"></v-text-field>
                    <v-icon x-small @click="localValue=null" v-if="!hidenullicon">mdi-backspace</v-icon>
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
            readonly: {
                required: false,
                default: false,
            },
            rules: {
                type: Array,
                required: false
            },
            hidenullicon: { //Hides null icon
                type: Boolean,
                required: false,
                default: false,
            }
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
