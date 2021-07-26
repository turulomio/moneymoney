
<template>
    <div>    
        <h1>{{ $t('Banks list') }}</h1>
        <v-checkbox v-model="showActive" :label="`Checkbox 1: ${showActive.toString()}`" @click="on_chkActive()" ></v-checkbox>
        <v-data-table :headers="headers" :items="data" sort-by="name" class="elevation-1" hide-default-footer>
            <template v-slot:[`item.active`]="{ item }">
                <v-icon small v-if="item.active" >mdi-check-outline</v-icon>
            </template>  
            <template v-slot:[`item.balance_accounts`]="{ item }">
                <div v-html="localcurrency_html(item.balance_accounts )"></div>
            </template>  
            <template v-slot:[`item.balance_investments`]="{ item }">
                <div v-html="localcurrency_html(item.balance_investments )"></div>
            </template>  
            <template v-slot:[`item.balance_total`]="{ item }">
                <div v-html="localcurrency_html(item.balance_total )"></div>
            </template>  
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>                            
            <template v-slot:[`body.append`]="{headers}">
                <tr style="background-color: lightgrey">
                    <td v-for="(header,i) in headers" :key="i">
                        <div v-if="header.value == 'name'">
                            Total
                        </div>
                        <div v-if="header.value == 'balance_accounts'" align="right" v-html="localcurrency_html(listobjects_sum(data,'balance_accounts'))">
                        </div>
                        <div v-if="header.value == 'balance_investments'" align="right" v-html="localcurrency_html(listobjects_sum(data,'balance_investments'))">
                        </div>
                        <div v-if="header.value == 'balance_total'" align="right" v-html="localcurrency_html(listobjects_sum(data,'balance_total'))">
                        </div>
                    </td>
                </tr>
            </template>
        </v-data-table>
    </div>
</template>
<script>
    import axios from 'axios'  
    import {mdiGenderMale, mdiGenderFemale, mdiChristianity} from '@mdi/js'
    export default {
        data(){ 
            return{
                mdiGenderMale,
                mdiGenderFemale,
                mdiChristianity,
                dialog:false,
                showActive:true,
                headers: [
                    { text: this.$t('Name'), sortable: true, value: 'name'},
                    { text: this.$t('Active'), value: 'active',  width: "12%"},
                    { text: this.$t('Accounts balance'), value: 'balance_accounts', align:'right',  width: "12%"},
                    { text: this.$t('Investments balance'), value: 'balance_investments', align:'right',  width: "12%"},
                    { text: this.$t('Total balance'), value: 'balance_total', align:'right',  width: "12%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false , width: "12%"},
                ],
                data:[],
            }
        },
        methods: {
            editItem (item) {
                this.$router.replace({ name: 'person_edit', params: { "id": item.id }})
            },
            deleteItem (item) {
               var r = confirm(this.$t("Do you want to delete this item?"))
               if(r == false) {
                  return
               } 
               r = confirm(this.$t("The contact and all it's dependent data will be deleted. Do you want to continue?"))
               if(r == false) {
                  return
               } 
                axios.delete(`${this.$store.state.apiroot}/api/persons/${item.id}`, this.myheaders())
                .then((response) => {
                    console.log(response);
                    this.on_search_change()
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            update_table(){
                axios.get(`${this.$store.state.apiroot}/api/bankswithbalance?active=${this.showActive}`, this.myheaders())
                .then((response) => {
                    this.data=response.data
                    console.log(response);
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_chkActive(){
                this.update_table()
            }
        },
        mounted(){
            this.update_table()
        }
    }
</script>

