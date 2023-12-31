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
                <v-text-field v-model="representation" :label="label" v-bind="props" readonly :clearable="clearable" prepend-icon="mdi-calendar-clock" @click:prepend.stop="on_click_prepend_icon" />
            </div>
        </template>
        <v-card width="650" class="pa-4">
            <v-row>
                <v-date-picker density="compact" v-model="date" show-adjancent-months hide-header :location="$i18n.locale" ></v-date-picker> 
                <v-col class="ma-3">
                    <v-text-field v-model.number="hours" :label="$t('Set hours')" :rules="RulesInteger(2,true)" />
                    <v-text-field v-model.number="minutes" :label="$t('Set minutes')" :rules="RulesInteger(2,true)" />
                    <v-text-field v-model.number="seconds" :label="$t('Set seconds')" :rules="RulesInteger(2,true)" />
                    <v-text-field v-model.number="microseconds" :label="$t('Set microseconds')" :rules="RulesInteger(6,true)" />
                    <v-text-field v-model="timezone" readonly :label=" $t('Time zone')" />
                </v-col>
            </v-row>
            <v-btn @click="on_click_prepend_icon">now</v-btn>
            <v-btn @click="on_click">set</v-btn>
            Output: {{ this.new_modelValue }}
        </v-card>
    </v-menu>    
    </div>
</template>
<script>
    import { localtime } from 'vuetify_rules'
    import moment from 'moment'
    import { RulesInteger } from 'vuetify_rules/src/rules'
    export default {    
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
            on_click(){
                this.new_modelValue=this.widget2string()
                this.menu=false
            },
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
                r.setHours(this.hours,this.minutes,this.seconds,this.microseconds)
                return r.toISOString()
            },
            string2dt(s){
                if (!s) return null
                var r=new Date(s)
                return r
            },
            dt2string(dt){
                if (!dt) return null
                return dt.toISOString()
            },
            on_click_prepend_icon(){
                this.new_modelValue=new Date().toISOString()
                this.string2widget(this.new_modelValue)
                this.set_representation()
            },
            set_representation(){
                console.log("REPRESETNATION", this.new_modelValue)
                this.representation=(this.new_modelValue==null) ? "": this.localtime(this.new_modelValue)

            }
        },
        created(){
            // this.dt=this.string2dt(this.modelValue)
            if(this.clearable==false && this.modelValue==null) this.on_click_prepend_icon()
            this.timezone=moment.tz.guess()
            this.string2widget(this.modelValue)
            this.new_modelValue=this.modelValue
            this.set_representation()
            
        },
    }
</script>



<!-- 
<template>
    <div class="d-flex flex-column mx-auto py-4">     
        <div class="component_label">
        {{ $attrs.label }}
        </div>                    
        <VueDatePicker v-model="dt" auto-apply  :disabled="readonly" :aria-labels="{ menu: 'Some custom menu label' }" :format="format" no-clear :clearable="clearable" :zIndex="20000" >
            <template #input-icon>
                <v-icon class="mx-2 pr-2" icon="mdi-calendar" @click.stop="dt=new Date()" ></v-icon>
            </template>
        </VueDatePicker>

    </div>
</template>
<script>
import { localtime } from 'vuetify_rules'
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
        rules: {
            type: Array,
            required: false
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
            dt: null,
            new_modelValue: null,
        }
    },
    watch: {
        new_modelValue () {
            this.$emit('update:modelValue', this.new_modelValue)
        },
        value (newValue) {
            this.new_modelValue = newValue
        },
        dt(newValue){
            this.new_modelValue=this.dt2iso(newValue)
        }
    },
    methods: {
        localtime,
        format(){
            return this.localtime(this.dt2iso(this.dt))
        },
        iso2dt(s){
            if (!s) return null
            return new Date(s)
        },
        dt2iso(dt){
            if (!dt) return null
            return dt.toISOString()
        }
    },
    created(){
        this.new_modelValue=this.modelValue
        this.dt=this.iso2dt(this.new_modelValue)
    },
}
</script>
<style scoped>
.component_label{
    font-size: 0.8em;
    color: gray;
}
</style> -->