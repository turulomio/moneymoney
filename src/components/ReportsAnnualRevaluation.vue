<template>
    <div class="pa-4">
        <h1 class="mb-3">{{ $t("Investments operations annual revaluation report") }}</h1>
        <v-checkbox data-test="ReportsAnnualRevaluation_OnlyZero" v-model="only_zero" :label="$t('Show only investments operations from zero risk investments')" />
        <v-data-table density="compact"  :headers="headers" :items="list_io" class="elevation-1" :sort-by="[{key:'datetime',order:'asc'}]" fixed-header height="800" :loading="$attrs.loading" :items-per-page="10000" hide-default-footer :key="key">
        <template #item.datetime="{item}">
            <div>{{ localtime(item.datetime)}}</div>
        </template>                   
        <template #item.operationstypes="{item}">
            <div>{{ getMapObjectById("operationstypes",item.operationstypes_id).localname }}</div>
        </template>
        <template #item.price_user="{item}">
            <div class="text-right" v-html="localcurrency_html(item.price_user)"></div>
        </template> 
        <template #item.balance_last_year_or_invested="{item}">
            <div class="text-right" v-html="localcurrency_html(item.balance_last_year_or_invested)"></div>
        </template> 
        <template #item.current_year_gains_user="{item}">
            <div class="text-right" v-html="localcurrency_html(item.current_year_gains_user)"></div>
        </template> 
        <template #item.percentage="{item}">
            <div class="text-right" v-html="percentage_html(item.current_year_gains_user/item.invested_user)"></div>
        </template>   
        <template #tbody>
            <tr class="totalrow" v-if="list_io.length>0">
                <td>{{ f($t("Total ([0] registers)"), [list_io.length])}}</td>               
                <td></td>   
                <td></td>   
                <td></td>   
                <td></td>
                <td class="text-right" v-html="localcurrency_html(listobjects_sum(list_io,'balance_last_year_or_invested'))"></td>
                <td class="text-right" v-html="localcurrency_html(listobjects_sum(list_io,'current_year_gains_user'))"></td>
                <td class="text-right" v-html="percentage_html(listobjects_sum(list_io,'current_year_gains_user')/listobjects_sum(list_io,'balance_last_year_or_invested'))"></td>
            </tr>
        </template>
    </v-data-table>   
    </div>
</template>

<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import { localtime,f } from 'vuetify_rules'
    import {parseResponseError, localcurrency_html, percentage_html, listobjects_sum, myheaders, getMapObjectById } from '@/functions'
    export default {
        components:{
        },
        data(){ 
            return{
                list_io: [],
                key: 0,
                only_zero:false,
                loading:false,
                headers: [
                    { title: this.$t('Date and time'), key: 'datetime',sortable: true },
                    { title: this.$t('Investments'), key: 'name',sortable: true },
                    { title: this.$t('Operation'), key: 'operationstypes',sortable: true },
                    { title: this.$t('Shares'), key: 'shares',sortable: false, align:'end'},
                    { title: this.$t('Price'), key: 'price_user',sortable: false, align:'end'},
                    { title: this.$t('Balance last year or invested'), key: 'balance_last_year_or_invested',sortable: false, align:'end'},
                    { title: this.$t('Annual gains'), key: 'current_year_gains_user',sortable: false, align:'end'},
                    { title: this.$t('% Annual'), key: 'percentage',sortable: false, align:'end'},
                ],
            }
        },
        watch:{
            only_zero(){
                this.refreshTable()
            }
        },
        methods:{
            useStore,
            f,
            localtime,
            parseResponseError,
            localcurrency_html,
            myheaders,
            percentage_html,
            listobjects_sum,
            getMapObjectById,
            refreshTable(){
                this.loading=true
                var onlyzerostring=(this.only_zero)? "?only_zero=true": ""
                return axios.get(`${this.useStore().apiroot}/reports/annual/revaluation/${onlyzerostring}`, this.myheaders())
                .then((response) => {
                    this.list_io=response.data
                    this.loading=false
                    this.key+=1
                }, (error) => {
                    this.parseResponseError(error)
                });
            }
        },
        mounted(){
            this.refreshTable()
        }
    }
</script>
