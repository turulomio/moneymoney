<template>
    <div class="paragraph">
        <h1>{{ $t(`Wellcome to Money Money`) }}</h1>
        <h2>{{ `${$store.state.version} (${$store.state.versiondate.toISOString().slice(0,10)})` }}</h2>

        <v-img src="@/assets/moneymoney.png" height="200px" contain ></v-img>
    </div>
</template>

<script>
    export default {
        data(){
            return {
            }
        },
        mounted(){
            var now= new Date()
            console.log(now)
            var py= this.date2py(now)
            console.log(py)
            var dat= this.py2date(py)
            console.log(dat)
        }
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
