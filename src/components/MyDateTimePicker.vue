<!--
    Value:
        Can be:
            - A string in utc new Date().toISOString()
            - null. Se grabaría como null
            - emptystring genera now en zulu string
            

    Representation is showed in local
    Tuple is in local

-->



<template>
    <div>
        <v-menu v-model="menu"  :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <div class="d-flex flex-row">
                <v-text-field v-model="representation" :label="label" v-bind="props" readonly :clearable="clearable" prepend-icon="mdi-calendar-clock" @click:prepend.stop="on_click_prepend_icon" @click:clear.stop="new_modelValue=null" />
            </div>
        </template>
        <v-card width="650" class="pa-4">
            <v-row>
                <v-date-picker density="compact" v-model="date" show-adjancent-months hide-header :location="$i18n.locale" ></v-date-picker> 
                <v-col class="ma-3">
                    <v-text-field v-model.number="hours" :label="$t('Set hours')" :rules="RulesInteger(2,true)" @change="on_change" />
                    <v-text-field v-model.number="minutes" :label="$t('Set minutes')" :rules="RulesInteger(2,true)" @change="on_change" />
                    <v-text-field v-model.number="seconds" :label="$t('Set seconds')" :rules="RulesInteger(2,true)" @change="on_change" />
                    <v-text-field v-model.number="microseconds" :label="$t('Set microseconds')" :rules="RulesInteger(6,true)" @change="on_change" />
                    <v-text-field v-model="timezone" readonly :label=" $t('Time zone')" />
                </v-col>
            </v-row>
        </v-card>
    </v-menu>    
    </div>
</template>
<script>
    import { localtime } from 'vuetify_rules'
    import moment from 'moment'
    import { RulesInteger } from 'vuetify_rules/src/rules'
    export default {    
        name: "MyDateTimePicker",
        props: {
            modelValue:{ //v-model in vue3
                required:true
            },
            readonly: {
                required: false,
                default: false,
            },
            clearable: { //Hides null icon
                type: Boolean,
                required: false,
                default: false,
            }
        },
        emits: ['update:modelValue'],
        data: function(){
            return {
                date: null,
                new_modelValue: null,  //New value
                menu:false,
                representation: null, //representation in text
                hours:null,
                minutes:null,
                seconds:null,
                microseconds:null,
            }
        },
        watch: {
            new_modelValue (newValue) { //Null or iso string
                this.set_representation()
                this.$emit('update:modelValue', newValue)
            },
            date(){
                this.on_change() //Exits
            },
            hours(){
                this.new_modelValue=this.widget2string() //When writing doesn't exit
            },
            minutes(){
                this.new_modelValue=this.widget2string()
            },
            seconds(){
                this.new_modelValue=this.widget2string()
            },
            microseconds(){
                this.new_modelValue=this.widget2string()
            },
        },
        computed: {
            label(){
                if (this.$attrs.label){
                    return this.$attrs.label
                } else {
                    return this.$t("Select a date and a time")
                }
            }
        },
        methods: {
            localtime,
            RulesInteger,
            string2widget(s){
                if (s==null){
                    return
                }
                var d=new Date(s)
                this.date=d
                this.hours=d.getHours()
                this.minutes=d.getMinutes()
                this.seconds=d.getSeconds()
                this.microseconds=d.getMilliseconds()*1000

            },
            widget2string(){
                if (this.hours==null || this.hours.length==0) return null
                let r=this.date
                r.setHours(this.hours,this.minutes,this.seconds,this.microseconds/1000)
                return r.toISOString()
            },
            dt2string(dt){
                if (!dt) return null
                return dt.toISOString()
            },
            on_click_prepend_icon(){
                this.new_modelValue=new Date().toISOString()
                this.string2widget(this.new_modelValue)
            },
            set_representation(){
                this.representation=(this.new_modelValue==null) ? "": this.localtime(this.new_modelValue)
            },
            on_change(){
                this.new_modelValue=this.widget2string()
                this.menu=false

            }
        },
        created(){
            if(this.clearable==false && this.modelValue==null) this.on_click_prepend_icon()
            this.timezone=moment.tz.guess()
            this.string2widget(this.modelValue)
            this.new_modelValue=this.modelValue
            
        },
    }
</script>
