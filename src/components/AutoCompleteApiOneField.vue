<template>
    <div>
      <v-combobox  v-if="this.canadd"
        v-model="select"
        :items="items"
        :loading="isLoading"
        v-model:search="search"
        :no-data-text="$t('You can select or add an item')"
        background-color="#eeffee"
        outlined
        :label="label"
        :placeholder="this.$attrs.placeholder"
        prepend-icon="mdi-database-search"
        :rules="$attrs.rules"
      ></v-combobox>
      <v-autocomplete v-if="!this.canadd"
        v-model="select"
        :items="items"
        :loading="isLoading"
        v-model:search="search"
        :no-data-text="$t(`You can't select a item, search again`)"
        hide-selected
        background-color="#ffeeee"
        outlined
        :label="label"
        :placeholder="this.$attrs.placeholder"
        prepend-icon="mdi-database-search"
        :rules="$attrs.rules"
      ></v-autocomplete>
    </div>
</template>
<script>
    import axios from 'axios'
    import {myheaders, parseResponse, parseResponseError} from '@/functions'
    export default {
        name: 'AutoCompleteApiOneField',
        props: {
            modelValue: { //v-model
                required: true
            },
            apiurl: { //apiurl to query database
                required: true
            },
            field: { //field name of the respone
                required: true
            },
            canadd: {
                type: Boolean,
                default: false
            },
        },
        data: () => ({
            descriptionLimit: 100,
            entries: [],
            isLoading: false,
            search: null,
            lastnewitem: null,
            select: null,
            items:[]
        }),
        
        computed:{
            label: function(){
                if (this.canadd){
                    return `${this.$attrs.label} ${this.$t(" (You can select or add an item)")}`
                } else {
                    return `${this.$attrs.label} ${this.$t(" (You must select an item)")}`
                }
            }
            
        },
        watch: {
            search (val) {
                this.search=val
                this.get_data()
            },
            select (newValue) {
                this.$emit('update:modelValue', newValue)
            },
            value (newValue) {
                this.select = newValue
            }
        },
        methods:{
            myheaders,
            parseResponse,
            parseResponseError,
            get_data(){
                if (this.search ==null || this.search=="") return
                
                if (this.isLoading) return
                this.isLoading = true
                axios.get(`${this.apiurl}?search=${this.search}`, this.myheaders())
                .then((response) => {
                    if (this.parseResponse(response)== true){
                        this.entries=response.data 
                        this.items=[]
                        this.entries.forEach(entry => this.items.push(entry[this.field]))
                        console.log(`Loaded ${this.entries.length} data with ${this.search}`)
                        this.items.sort()
                        if (this.canadd==true) {this.items.unshift(this.search)}
                    }
                    
                }, (error) => {
                    this.parseResponseError(error)
                })
                .finally(() => {this.isLoading = false});
            }
        },
        created(){
            this.select=this.modelValue
        }
    }
</script>
