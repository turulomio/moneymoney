<template>
    <div>    
        <h1>{{ $t("Accounts operations search") }}</h1>
        <v-card outlined class="ma-4 pa-4">   
            <v-row>
            <v-text-field class="pa-4" v-model="search" type="text" :label="$t('Enter a string to search')" :placeholder="$t('Search in accounts operations')" autofocus  counter="200"  @keyup.enter="update_table()"/>
            <v-btn class="mt-2 "  color="error" @click="on_button_click()">{{ $t("Search") }}</v-btn>
            </v-row>
            <TableAccountOperations showaccount showtotal :items="items_ao" height="400" class=" flex-grow-1 flex-shrink-0" :key="key" @cruded="on_TableAccountOperations_cruded"/>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import TableAccountOperations from './TableAccountOperations.vue'
    export default {
        components:{
            TableAccountOperations,
        },
        data(){ 
            return {
                items_ao:[],
                ao:null,
                search:"",

                key:0,
                dialog_ao:false
            }
        },
        methods: {
            useStore,

            on_TableAccountOperations_cruded(){
                this.update_table()
            },
            on_button_click(){
                this.update_table()
            },
            update_table(){
                if (this.search.length<2){
                    alert(this.$t("You must enter at least two characters"))
                    return
                }
                axios.get(`${this.useStore().apiroot}/api/accountsoperations/?search=${this.search}`, this.myheaders())
                .then((response) => {
                    this.items_ao=response.data
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
        },
    }
</script>
