<!--
    You must set in main.js import 'flag-icons/css/flag-icons.min.css' to use "fi" classes
 -->

<template>
    <v-menu >
        <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props" :close-on-content-click="false" >
                <v-icon :class="'fi fib fi-'+current.flag"></v-icon>
            </v-btn>
        </template>
        <v-list>
            <v-list-item v-for="(item,index) in languages" :key="index" @click="switchLocale(item)">
                <v-list-item-title><v-icon :class="'mr-2 fi fib fi-'+item.flag" big></v-icon>{{ item.text }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>    
</template>

<script>
    import  {singleton} from 'vuetify_rules'
    export default {
        name: 'BtnSwitchLanguages',
        data(){
            return {
                singleton,
                languages: [
                    { text: "Español", value: "es", flag:"es"},
                    { text: "English", value: "en", flag:"us"},
                ],
                current: null,
            }
        },  
        methods:{
            switchLocale(item){
                this.$i18n.locale=item.value;
                this.current=item;
                localStorage.locale=item.value;
                this.singleton.setLanguage(item.value)
            },
            getStoredCurrent() {
                if (!localStorage.locale || localStorage.locale==null) {
                    localStorage.locale="en"
                }
                var item=this.languages.find(x => x.value === localStorage.locale)
                this.switchLocale(item);
                return item;
            }
        },
        created(){
            this.current=this.getStoredCurrent()
        }
    }
</script>
