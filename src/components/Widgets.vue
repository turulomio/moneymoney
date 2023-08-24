<template>
    <div class="paragraph">
        <h1>{{ $t("Widgets") }}</h1>
        <h2>MyDatePicker</h2>
        <MyDatePicker v-model="mydatepicker" />
        {{ mydatepicker }}
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
            }
        },
    }
</script>
