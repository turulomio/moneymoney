<template>
    <div>
        <h1>{{ $t(`Products update`)}}</h1>
 
        <v-form ref="formFile" method="post">
            <v-card>
                <v-file-input name="csv_file1" accept="text/csv" show-size truncate-length="100" v-model="file" :label="$t('Select a file')"></v-file-input>
                <v-card-actions class="justify-center">
                    <v-btn color="primary" @click="submmit()" :disabled="loading==true">{{ $t("Send file")}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>

        <v-data-table dense :headers="headers" :items="items" sort-by="name" class="elevation-1" hide-default-footer  disable-pagination :loading="loading">
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
                file:"",
                loading:false,
                items: [],
                headers: [
                    { text: this.$t('Code'), sortable: true, value: 'code'},
                    { text: this.$t('Product'), sortable: true, value: 'product'},
                    { text: this.$t('Log'), value: 'log'},
                ],
            }
        },
        methods: {
            submmit(){
                this.loading=true
                let data=new FormData()
                data.append('csv_file1', this.file)
                axios.post(`${this.$store.state.apiroot}/products/update/`, data, this.myheaders_formdata())
                .then((response) => {
                        console.log(response.data)
                        this.items=response.data
                        this.file=""
                        this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                })
            }
        }
        
    }
</script>

