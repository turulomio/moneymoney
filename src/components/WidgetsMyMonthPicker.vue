<template>
    <div class="paragraph">
        <h1>{{ $t("Widgets") }}</h1>
        <h2>MyMonthPicker</h2>
        <div class="ma-5">
        <MyMonthPicker v-model="MyMonthPicker" />
        Current value: {{ MyMonthPicker }}
        </div>
    </div>
</template>

<script>
    import MyMonthPicker from './MyMonthPicker.vue'
    export default {
        components:{
            MyMonthPicker,
        },
        data(){
            return {
                MyMonthPicker: null,
            }
        },
    }
</script>
