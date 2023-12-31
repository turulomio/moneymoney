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
            <v-list-item v-for="(item,index) in locales" :key="index" @click="switchLocale(item)">
                <v-list-item-title><v-icon :class="'mr-2 fi fib fi-'+item.flag" big></v-icon>{{ item.text }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>    
</template>

<script>
    var languages=[
                    { text: "Español", value: "es", flag:"es"},
                    { text: "English", value: "en", flag:"us"},
                  ];

    export default {
        name: 'BtnSwitchLanguages',
        data(){
            return {
                locales: languages,
                current: this.getStoredCurrent()
            }
        },  
        methods:{
            switchLocale(item){
                this.$i18n.locale=item.value;
                this.current=item;
                localStorage.locale=item.value;
                //console.log(this.$vuetify.locale.value)
                //this.$vuetify.locale.current = item.value;
            },
            getStoredCurrent() {
                if (!localStorage.locale || localStorage.locale==null) {
                 localStorage.locale="en"
                }
                var item=languages.find(x => x.value === localStorage.locale)
                this.switchLocale(item);
                return item;
            }
        },
    }
</script>
