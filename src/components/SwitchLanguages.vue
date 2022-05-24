/*
    You must set in main.js import 'flag-icons/css/flag-icons.min.css' to use "fi" classes
*/

<template>
    <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" v-bind="attrs" v-on="on" :close-on-content-click="false" >
                <v-icon :class="'fi fib fi-'+current.icon_value"></v-icon>
            </v-btn>
        </template>
        <v-list>
            <v-list-item v-for="(item,index) in locales" :key="index" @click="switchLocale(item)">
                <v-list-item-icon :class="'fi fib fi-'+item.icon_value"></v-list-item-icon>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>    
</template>

<script>
    var languages=[
                    { text: "Español", value: "es", icon_value:"es"},
                    { text: "English", value: "en", icon_value:"gb"},
                  ];

    export default {
        name: 'SwitchLanguages',
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
                this.$vuetify.lang.current = item.value;
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
