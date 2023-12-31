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
    </div>
</template>

<script>
    import MyDateTimePicker from './MyDateTimePicker.vue'
    export default {
        name: 'About',
        components:{
            MyDateTimePicker,
        },
        data(){
            return {
                mydatetimepicker:null,
                mydatetimepicker2:null,
            }
        },
    }
</script>
