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
    </div>
</template>

<script>
    import MyDatePicker from './MyDatePicker.vue'
    export default {
        name: 'About',
        components:{
            MyDatePicker,
        },
        data(){
            return {
                mydatepicker:null,
                mydatepicker2:null,
            }
        },
    }
</script>
