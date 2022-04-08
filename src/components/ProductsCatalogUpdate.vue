<template>
    <div class="pa-6">
        <h1>{{ $t(`Products catalog update`)}}</h1>

        <v-card class="pa-5">
            <v-form  method="post">
                    <v-file-input 
                        name="json_file1" 
                        accept="application/json" 
                        show-size 
                        truncate-length="100"
                        v-model="filename" 
                        :label="$t('Select a file')"
                    ></v-file-input>
                    <v-card-actions class="justify-center">
                        <v-btn color="primary" @click="submmit()" :disabled="isButtonDisabled()">{{ $t("Send file")}}</v-btn>

                        <v-btn color="primary" @click="submmit_auto()">{{ $t("Update from MoneyMoney GitHub repository")}}</v-btn>

                    </v-card-actions>
                    <v-card-subtitle>{{message}}</v-card-subtitle>
            </v-form>
        </v-card>   
        <v-data-table dense :headers="headers" :items="items" sort-by="product" class="elevation-1 pt-6" hide-default-footer  disable-pagination :loading="loading"></v-data-table>
    </div>
</template>  
<script>     

    import axios from 'axios'
    export default {
        components:{
        },
        props:{
        },
        data () {
            return {
                filename:[], //Must be an array 
                loading:false,
                items: [],
                message:"",
                headers: [
                    { text: this.$t('Product'), sortable: true, value: 'product'},
                    { text: this.$t('Log'), sortable: true, value: 'log'},
                ],
            }
        },
        methods: {
            submmit(){
                this.loading=true
                let data=new FormData()
                data.append('json_file1', this.filename)
                axios.post(`${this.$store.state.apiroot}/products/catalog/update/`, data, this.myheaders_formdata())
                .then((response) => {
                        this.items=response.data.logs
                        this.message=this.$t("{0} system products have been readed from file").format(response.data.total)
                        this.filename=[]
                        this.$store.dispatch("getProducts")
                        this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
            submmit_auto(){
                if (window.navigator.onLine==false){
                    alert(this.$t("You need a Internet connection to update from MoneyMoney repository in Github"))
                    return
                }
                this.loading=true
                axios.post(`${this.$store.state.apiroot}/products/catalog/update/`, {auto:true,}, this.myheaders())
                .then((response) => {
                        this.items=response.data.logs
                        this.message=this.$t("{0} system products have been readed from MoneMoney Github repository").format(response.data.total)
                        this.$store.dispatch("getProducts")
                        this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
            isButtonDisabled(){
                if (this.loading==true) return true
                if (this.filename=="") return true
                return false
            }

        }
        
    }
</script>

