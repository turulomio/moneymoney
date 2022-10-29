<template>
    <div class="paragraph">
        <h1>{{ $t(`About Money Money`) }}</h1>
        <h2>{{ `${$store.state.version} (${$store.state.versiondate.toISOString().slice(0,10)})` }}</h2>
        
        <v-container  class="paragraph">
            <p>{{ $t("Money Money is a personal finances application") }}</p>
            
            <p class="paragraph" ref="github"></p>
            <p class="paragraph">{{ $t("Main features:") }}</p>
            
            <ul class="paragraph">
                <li>{{ $t("You can manage your personal accounting.") }}</li>
        </ul>
        </v-container>
    </div>
</template>

<script>
    export default {
        name: 'About',
        data(){
            return {
            }
        },
        mounted(){
            this.$refs.github.innerHTML=this.$t("Project main page is located in Github, where you can help me coding or translating to different languages.").replace("Github",'<a href="https://github.com/turulomio/moneymoney">Github</a>')
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
