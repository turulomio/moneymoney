<template>
    <div class="paragraph">
        <h1>{{ $t(`Wellcome to Money Money`) }}</h1>
        <h2>{{ `${$store.state.version} (${$store.state.versiondate.toISOString().slice(0,10)})` }}</h2>
    </div>
</template>

<script>
    export default {
        data(){
            return {
            }
        },
    }
</script>
<style>
h2 {
    text-align: center;
    font-weight: normal;
}

paragraph{
    text-align:justify;
    padding: 30px;
}
</style>
