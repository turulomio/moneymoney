<template>
    <div class="paragraph">
        <h1>{{ $t("Widgets") }}</h1>
        <v-btn data-test="Button_MyDatePicker" link router :to="{name:'widgets_mydatepicker'}">MyDatePicker</v-btn>
        <v-btn data-test="Button_MyMonthPicker" link router :to="{name:'widgets_mymonthpicker'}">MyMonthPicker</v-btn>
    </div>
</template>

<script>
    export default { 
        data(){
        },
    }
</script>
