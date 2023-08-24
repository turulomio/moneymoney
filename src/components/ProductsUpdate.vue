<template>
    <div class="pa-6">
        <h1>{{ $t("Products update")}}</h1>
        <v-card class="pa-5">
            <v-form  method="post">
                    <v-file-input 
                        name="csv_file1" 
                        accept="text/csv" 
                        show-size 
                        truncate-length="100"
                        v-model="filename" 
                        :label="$t('Select a file')"
                    ></v-file-input>
                    <v-card-actions class="justify-center">
                        <v-btn color="primary" @click="submmit()" :disabled="isButtonDisabled()">{{ $t("Send file")}}</v-btn>

                        <v-btn color="primary" @click="submmit_auto()">{{ $t("Auto update")}}</v-btn>
                    </v-card-actions>
            </v-form>
        </v-card>   

        <v-data-table :headers="headers" :items="items" :sort-by="[{key:'product',order:'asc'}]" class="elevation-1 pt-6" :loading="loading"     :items-per-page="10000" >
            <template #bottom ></template> 
        </v-data-table>
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
                headers: [
                    { title: this.$t('Code'), sortable: true, key: 'code'},
                    { title: this.$t('Product'), sortable: true, key: 'product'},
                    { title: this.$t('Log'), sortable: true, key: 'log'},
                ],
            }
        },
        methods: {
            submmit(){
                this.loading=true
                let data=new FormData()
                data.append('csv_file1', this.filename)
                axios.post(`${this.store().apiroot}/products/update/`, data, this.myheaders_formdata())
                .then((response) => {
                        this.items=response.data
                        this.filename=[]
                        this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
            submmit_auto(){
                this.loading=true
                axios.post(`${this.store().apiroot}/products/update/`, {auto:true,}, this.myheaders())
                .then((response) => {
                        this.items=response.data
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

