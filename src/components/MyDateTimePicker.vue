<!--
    Value:
        Can be:
            - A Zulu zulu js string in utc new Date().toISOString()
            - null. Se grabaría como null
            - emptystring genera now en zulu string
            

    Representation is showed in local
    Tuple is in local

-->


<template>
    <div>
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto" :disabled="readonly">
            <template v-slot:activator="{ on }">
                <v-row justify="center" align="center" class="ml-0 mr-1 mb-1">                
                    <v-icon class="mr-3" @click="on_icon_click()">mdi-calendar</v-icon>
                    <v-text-field v-model="representation" v-bind="$attrs" readonly v-on="on"  @click="on_text_click" :rules="rules"></v-text-field>
                    <v-icon class="ml-3" x-small @click="on_backspace_click()">mdi-backspace</v-icon>
                </v-row>
            </template>
            <v-card class="pa-4">
                <h1 class="mb-3">{{ this.$t("Select a date and time")}}
                    <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
                </h1>            
                <v-row class="d-flex .flex-nowrap"  no-gutters>
                    <v-date-picker dense v-if="localValue" no-title v-model="date" @change="on_date_change()" locale="locale" first-day-of-week="1"></v-date-picker>
                    <v-time-picker dense v-if="localValue" ref="time" no-title scrollable  format="24hr" v-model="time" use-seconds @click:hour="on_time_click()" @click:minute="on_time_click()" @click:second="on_time_click()" locale="locale"></v-time-picker>

                    <v-col>
                        <v-row class="mt-12 pt-12 ml-4">             
                            <v-text-field class="shrink" reverse v-if="localValue" v-model="milliseconds" type="number" :label="$t('Milliseconds')" :placeholder="$t('Milliseconds')" :rules="RulesString(3,true)" counter="3" @change="on_milliseconds_change()"></v-text-field>        
                            <v-icon class="mr-8 ml-4" x-small @click="on_milliseconds_backspace">mdi-backspace</v-icon>
                        </v-row>
                    </v-col>    
                </v-row>
                <v-card-actions>
                    <v-spacer></v-spacer>
                        <v-btn class="mt-4 mx-4" v-if="localValue" color="error" @click="on_close()" >{{$t("Set")+ " '" + this.representation + "'"}}</v-btn>

                    <v-spacer></v-spacer>
                </v-card-actions>

            </v-card>
        </v-menu>
    </div>
</template>
<script>
    import moment from 'moment'
    import MyMenuInline from './MyMenuInline.vue'
    export default {    
        components: {
            MyMenuInline,
        },
        props: {
            value: {
                required: true
            },
            readonly: {
                required: false,
                default: false
            },
            rules: {
                type: Array,
                required: false
            }
        },
        data: function(){
            return {
                    menuinline_items: [
                    {
                        subheader: this.$t("Predefined"),
                        children: [
                            {
                                name: this.$t("Current date and time"),
                                icon: "mdi-calendar",
                                code: function(this_){
                                    this_.on_set_now()
                                },
                            },
                            {
                                name: this.$t("Start of the day"),
                                icon: "mdi-calendar",
                                code: function(this_){
                                    this_.time="00:00:00"
                                    this_.milliseconds="0"
                                    this_.localValue=this_.tuple2zulu(this_.date,this_.time,this_.milliseconds)
                                    this_.menu=false
                                },
                            },
                            {
                                name: this.$t("Start of the month"),
                                icon: "mdi-calendar ",
                                code: function(this_){
                                    var n=new Date(this_.date)
                                    n.setDate(1)
                                    this_.date=n.toISOString().slice(0,10)
                                    this_.time="00:00:00"
                                    this_.milliseconds="0"
                                    this_.localValue=this_.tuple2zulu(this_.date,this_.time,this_.milliseconds)
                                    this_.menu=false                                },
                            },
                            {
                                name: this.$t("Start of the year"),
                                icon: "mdi-calendar ",
                                code: function(this_){
                                    var n=new Date(this_.date)
                                    n.setDate(1)
                                    n.setMonth(0)
                                    this_.date=n.toISOString().slice(0,10)
                                    this_.time="00:00:00"
                                    this_.milliseconds="0"
                                    this_.localValue=this_.tuple2zulu(this_.date,this_.time,this_.milliseconds)
                                    this_.menu=false                                },
                            },
                            {
                                name: this.$t("End of the day"),
                                icon: "mdi-calendar",
                                code: function(this_){
                                    this_.time="23:59:59"
                                    this_.milliseconds="999"
                                    this_.localValue=this_.tuple2zulu(this_.date,this_.time,this_.milliseconds)
                                    this_.menu=false
                                },
                            },
                            {
                                name: this.$t("End of the month"),
                                icon: "mdi-calendar ",
                                code: function(this_){
                                    var n=new Date(this_.date)
                                    n.setDate(1)
                                    n.setMonth(n.getMonth()+1)
                                    n.setDate(0)
                                    this_.date=n.toISOString().slice(0,10)
                                    this_.time="23:59:59"
                                    this_.milliseconds="999"
                                    this_.localValue=this_.tuple2zulu(this_.date,this_.time,this_.milliseconds)
                                    this_.menu=false                                },
                            },
                            {
                                name: this.$t("End of the year"),
                                icon: "mdi-calendar ",
                                code: function(this_){
                                    var n=new Date(this_.date)
                                    n.setDate(31)
                                    n.setMonth(11)
                                    this_.date=n.toISOString().slice(0,10)
                                    this_.time="23:59:59"
                                    this_.milliseconds="999"
                                    this_.localValue=this_.tuple2zulu(this_.date,this_.time,this_.milliseconds)
                                    this_.menu=false                                },
                            },
                        ]
                    },
                ],

                menu: false,
                date: "",
                time: "",
                milliseconds: "",
                localValue: "",
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
            //    console.log(this.date,this.time,this.milliseconds, this.representation, this.value)
            }
        },
        methods: {
            on_icon_click(){
                if (this.readonly==false){
                    this.localValue=new Date().toISOString()
                }
            },
            on_backspace_click(){
                if (this.readonly==false){
                    this.localValue=null
                }
            },
            on_text_click(){
                // Changes to hour selection mode
                if (this.$refs.time) this.$refs.time.selecting=1
            },
            on_close(){
                this.menu=false
            },
            on_set_now(){
                this.localValue=this.date2zulu(new Date())
                this.menu=false
            },
            on_date_change(){
                this.localValue=this.tuple2zulu(this.date,this.time,this.milliseconds)
                this.menu=false
            },
            on_time_click(){
                console.log(this.time)
                if (this.$refs.time.selecting == 3) {
                    this.on_close()
                }
                this.localValue=this.tuple2zulu(this.date,this.time,this.milliseconds)
            },
            on_milliseconds_change(){
                this.localValue=this.tuple2zulu(this.date,this.time,this.milliseconds)
            },
            on_milliseconds_backspace(){
                this.milliseconds='0';
                this.localValue=this.tuple2zulu(this.date,this.time,this.milliseconds)
                this.menu=false
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
                if (this.localValue==null){
                    this.representation=""
                } else {
                    this.representation=this.date +" " + this.time +"."+this.milliseconds
                }
            }
        },
        mounted(){
            if (this.value==""){
                this.localValue=this.date2zulu(new Date())
            }
            else if (this.value == null){
                this.localValue=""
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
