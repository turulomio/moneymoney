<template>
    <div class="pa-6">
        <h1>{{ $t("Quotes massive update of '[0]''").format(this.product.fullname)}}</h1>
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

                    </v-card-actions>
            </v-form>
        </v-card>   

        <v-data-table density="compact" :headers="headers" :items="items" :sort-by="[{key:'product',order:'asc'}]" class="elevation-1 pt-6" :loading="loading"     :items-per-page="10000" ></v-data-table>
    </div>
</template>  
<script>     

    import axios from 'axios'
    export default {
        components:{
        },
        props:{
            product: {
                required: true
            },
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
            readDocument(file){
                return new Promise((resolve, reject) => {
                    var reader = new FileReader();
                    reader.onload = function() {
                        const result=reader.result
                        var r={
                            jsdoc: result,
                            doc: result.split(",")[1],
                            mime: result.split(";base64,")[0].split(":")[1],
                        }
                        return resolve(r)
                    }
                    reader.onerror=function(error){
                        return reject(error)
                    }
                    reader.readAsDataURL(file)
                })
            },
            async submmit(){
                this.loading=true

                if (this.filename[0]){
                    var readed= await this.readDocument(this.filename[0])
                    readed.product=this.product.url
                }
                axios.post(`${this.store().apiroot}/quotes/massive_update/`, readed, this.myheaders())
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

