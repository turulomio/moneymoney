<template>
    <div class="paragraph">
        <h1>{{ $t("Widgets") }}</h1>
        <h2>MyDateTimePicker</h2>
        <div class="ma-5">
        <MyDateTimePicker v-model="mydatetimepicker" />
        Current value: {{ mydatetimepicker }} Null:{{ mydatetimepicker==null }}
        <MyDateTimePicker v-model="mydatetimepicker2" label="Select with my new label" clearable/>
        Current value: {{ mydatetimepicker2 }} Null:{{ mydatetimepicker2==null }}
        </div>
        <v-row class="pl-8 my-3" justify="center">
            <MyDateTimePicker v-model="mydatetimepicker3" label="My date and time" clearable />
            <v-spacer></v-spacer>
            <MyDateTimePicker v-model="mydatetimepicker4" label="Birth date and time" />
            <v-spacer></v-spacer>           
        </v-row>
    </div>
</template>

<script>
    import MyDateTimePicker from './MyDateTimePicker.vue'
    export default {
        components:{
            MyDateTimePicker,
        },
        data(){
            return {
                mydatetimepicker:null,
                mydatetimepicker2:null,
                mydatetimepicker3:null,
                mydatetimepicker4:null,
            }
        },
    }
</script>
