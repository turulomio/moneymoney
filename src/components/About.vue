<template>
    <div class="paragraph">
        <h1>{{ $t("About Money Money") }}</h1>
        <h2>{{ `${store().version} (${store().versiondate.toISOString().slice(0,10)})` }}</h2>
        <v-img :src="imgUrl" height="200px" contain @click="$router.push({name:'widgets'})"></v-img>
        
        <v-container  class="paragraph">
            <p class="paragraph mb-3">{{ $t("Money Money is a personal finances application") }}</p>
            
            <p class="paragraph mb-3" ref="github">{{  }}</p>
            <p class="paragraph mb-3">{{ $t("Main features:") }}</p>
            
            <ul class="paragraph mb-3">
                <li class="ml-9">{{ $t("You can manage your personal accounting.") }}</li>
        </ul>
        </v-container>
    </div>
</template>

<script>
    import imgUrl from '@/assets/moneymoney.png'
    export default {
        name: 'About',
        data(){
            return {
                imgUrl:imgUrl,
            }
        },
        mounted(){
            this.$refs.github.innerHTML=this.$t("Project main page is located in Github, where you can help me coding or translating to different languages.").replace("Github",'<a href="https://github.com/turulomio/moneymoney3o" target="_blank">Github</a>')
        }
    }
</script>
