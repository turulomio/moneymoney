<!--
    Value is a zulu js string in utc
    Representation is showed in local
    Tuple is in local
-->


<template>
    <div>
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on }">
                <v-row justify="center" align="center">
                    <v-text-field v-model="representation" v-bind="$attrs" prepend-icon="mdi-calendar" readonly v-on="on"  @click="on_text_click"></v-text-field>
                    <v-icon class="ml-1" x-small @click="localValue=''">mdi-backspace</v-icon>
                </v-row>
            </template>
            <v-row>
            <v-date-picker no-title v-model="date" @change="on_date_change()" locale="locale" first-day-of-week="1"></v-date-picker>
            <v-time-picker ref="time" no-title scrollable  format="24hr" v-model="time" use-seconds @click:hour="on_time_click()" @click:minute="on_time_click()" @click:second="on_time_click()" locale="locale"></v-time-picker>
            <v-text-field v-model="milliseconds" type="number" :label="$t('Milliseconds')" required :placeholder="$t('Milliseconds')" :rules="RulesString(3,true)" counter="3" @change="on_milliseconds_change()"/>        
            </v-row>
            <v-btn class="ml-4" color="error" @click="on_close()" >{{buttonCloseText}}</v-btn>
        </v-menu>
    </div>
</template>
<script>
    import moment from 'moment'
    export default {    
        props: {
            value: {
                required: true
            },
            // locale:  {
            //     required:true,
            //     default: 'en',
            // }
        },
        data: function(){
            return {
                menu: false,
                date: "",
                time: "",
                milliseconds: "",
                localValue: "",
                buttonCloseText: this.$t("Close"),
                representation:""
            }
        },
        watch: {
            localValue (newValue) {
                this.$emit('input', newValue)
            },
            value (newValue) {
                this.localValue = newValue
                if (newValue==""){
                    var dt=new Date()
                    this.date=dt.toISOString().substring(0,10)
                    this.time=dt.toISOString().substring(11,19)
                    this.milliseconds=dt.getMilliseconds().toString()
                } else {
                    var arr=this.zulu2tuple(newValue)
                    this.date=arr[0]
                    this.time=arr[1]
                    this.milliseconds=arr[2]
                }
                this.setRepresentation()
                console.log(this.date,this.time,this.milliseconds, this.representation, this.value)
            }
        },
        methods: {
            on_text_click(){
                // Changes to hour selection mode
                if (this.$refs.time) this.$refs.time.selecting=1
            },
            on_close(){
                this.menu=false
            },
            on_date_change(){
                this.localValue=this.tuple2zulu(this.date,this.time,this.milliseconds)
            },
            on_time_click(){
                if (this.$refs.time.selecting == 3) {
                    this.on_close()
                }
                this.localValue=this.tuple2zulu(this.date,this.time,this.milliseconds)
            },
            on_milliseconds_change(){
                this.localValue=this.tuple2zulu(this.date,this.time,this.milliseconds)
            },
            // py django format without timezone, tuple string (date, time )
            zulu2tuple(s){
                var m=moment.utc(s).local()
                return new Array(
                    m.format("YYYY-MM-DD"),
                    m.format("HH:mm:ss"),
                    m.format("SSS"),
                )
            },
            tuple2zulu(d,t,milli){
                return new Date( d +" " + t +"."+milli).toISOString()
            },
            setRepresentation(){
                this.representation=this.date +" " + this.time +"."+this.milliseconds
            }
        },
        mounted(){
            if (this.value==""){
                this.localValue=this.date2zulu(new Date())
            } else {
                this.localValue=this.value
                var a=this.zulu2tuple(this.value)
                this.date=a[0]
                this.time=a[1]
                this.milliseconds=a[2]
            }
            this.setRepresentation()            
        }
    }
</script>
