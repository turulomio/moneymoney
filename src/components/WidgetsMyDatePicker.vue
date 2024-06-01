<template>
    <div class="paragraph">
        <h1>{{ $t("Widgets") }}</h1>
        <h2>MyDatePicker</h2>
        <div class="ma-5">
        <MyDatePicker v-model="mydatepicker" />
        Current value: {{ mydatepicker }} Null:{{ mydatepicker==null }}
        <MyDatePicker v-model="mydatepicker2" label="Select with my new label" clearable/>
        Current value: {{ mydatepicker2 }} Null:{{ mydatepicker2==null }}
        </div>
        <v-row class="pl-8 my-3" justify="center">
            <MyDatePicker v-model="mydatepicker3" label="My date" clearable></MyDatePicker>
            <v-spacer></v-spacer>
            <MyDatePicker v-model="mydatepicker4" label="Birth date"></MyDatePicker>
            <v-spacer></v-spacer>           
        </v-row>
        <MyDatePicker v-model="mydatepicker" readonly label="Readonly"></MyDatePicker>
        <v-spacer></v-spacer>   
        <MyDatePicker v-model="mydatepicker4" readonly clearable label="Readonly clearable"></MyDatePicker>
        <v-spacer></v-spacer>   
    </div>
</template>

<script>
    import MyDatePicker from './MyDatePicker.vue'
    export default {
        components:{
            MyDatePicker,
        },
        data(){
            return {
                mydatepicker:"2022-02-02",
                mydatepicker2:null,
                mydatepicker3:null,
                mydatepicker4:null,
            }
        },
    }
</script>
