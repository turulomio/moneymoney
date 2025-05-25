<template>
    <div class="pa-6">
        <h1>{{ $t("Products catalog update")}}</h1>

        <v-card class="pa-5" flat>
                <v-card-actions class="justify-center">
                    <v-btn color="primary" @click="submmit(false)" :disabled="loading" :loading="loading">{{ $t("Restore current version catalog")}}</v-btn>

                    <v-btn color="primary" @click="submmit(true)" :disabled="loading" :loading="loading">{{ $t("Update from MoneyMoney GitHub repository")}}</v-btn>

                </v-card-actions>
                <v-card-subtitle class="mt-7 d-flex justify-center"><span class="boldred" >{{message}}</span></v-card-subtitle>
        </v-card>
    </div>
</template>  
<script>     
    import axios from 'axios'
    import { useStore } from "@/store"
import { parseResponseError } from '@/functions'
    export default {
        data () {
            return {
                loading:false,
                message:"",
            }
        },
        methods: {
            useStore,
            parseResponseError,
            submmit(internet){
                if (internet && navigator.onLine==false){
                    alert(this.$t("There is some problem with Internet connection"))
                    return
                }
                this.loading=true
                axios.post(`${this.useStore().apiroot}/maintenance/catalogs/update/`, {internet: internet}, this.myheaders())
                .then(() => {
                        this.useStore().updateProducts()
                        this.message=this.$t("Catalogs updated")
                        this.key=this.key+1
                        this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                })
            },

        }
        
    }
</script>

