<template>
    <div>    
        <h1>{{ $t('Quotes maintenance') }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>
        <h2>{{ get_option_name(option) }}</h2>
        <v-card outlined class="ma-4 pa-4">
            <TableQuotes :items="quotes" :key="key" no_delete_confirmation @cruded="on_TableQuotes_cruded" :loading="loading"></TableQuotes>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import MyMenuInline from './MyMenuInline.vue'
    import TableQuotes from './TableQuotes.vue'
    export default {
        components:{
            MyMenuInline,
            TableQuotes,
        },
        data(){ 
            return{
                menuinline_items: [
                    {
                        subheader: this.$t("Quote querys"),
                        children: [
                            {
                                name: this.get_option_name(0),
                                icon: "mdi-eye",
                                code: function(){
                                    this.get_quotes_in_future()
                                    this.key=this.key+1
                                }.bind(this),
                            },
                            {
                                name: this.get_option_name(1),
                                icon: "mdi-eye",
                                code: function(){
                                    this.get_last_quotes()
                                    this.key=this.key+1
                                }.bind(this),
                            },
                        ]
                    },
                ],
                quotes:[],
                key:0,
                loading:false,

                option:0, 

            }
        },
        methods: {
            useStore,
            get_option_name(option){
                if (option==0) return this.$t("Quotes in the future")
                if (option==1) return this.$t("Last quotes")
            },
            get_quotes_in_future(){
                this.quotes=[]
                this.loading=true
                this.option=0
                axios.get(`${this.useStore().apiroot}/api/quotes/?future=true`,  this.myheaders())
                .then((response) => {
                    this.quotes=response.data
                    this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
            get_last_quotes(){
                this.quotes=[]
                this.loading=true
                this.option=1
                axios.get(`${this.useStore().apiroot}/api/quotes/?last=true`,  this.myheaders())
                .then((response) => {
                    this.quotes=response.data
                    this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
            on_TableQuotes_cruded(){
                if (this.option==0){
                    this.get_quotes_in_future()
                } else if (this.option==1){
                    this.get_last_quotes()
                }
            }
        },
        created(){

            this.get_quotes_in_future()

        }
    }
</script>

