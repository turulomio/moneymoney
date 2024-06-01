<template>
    <div class="paragraph">
        <h1>{{ $t("Widgets") }}</h1>
        <v-btn data-test="Button_MyDatePicker" link router :to="{name:'widgets_mydatepicker'}">MyDatePicker</v-btn>
    </div>
</template>

<script>
    export default { 
        data(){
        },
    }
</script>
