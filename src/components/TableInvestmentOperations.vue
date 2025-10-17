<template>
    <div>
        <v-data-table density="compact" v-model="selected" :headers="tableHeaders" :items="props.items" class="elevation-1" :sort-by="[{key:'datetime',order:'asc'}]" fixed-header :height="$attrs.height" ref="table_o" :key="$attrs.key" :loading="$attrs.loading" :items-per-page="10000" >

            <template #item.datetime="{item}">
              <div>{{ localtime(item.datetime)}}</div>
            </template>             
            <template #item.investments="{item}">
                <div>{{ getMapObjectById("investments",item.investments_id).fullname }}</div>
            </template>                    
            <template #item.operationstypes="{item}">
                <!-- <div v-html="useStore().operationstypes.get(item.operationstypes)"></div> -->
                <div>{{ getMapObjectById("operationstypes",item.operationstypes_id).localname }}</div>
            </template>
            <template #item.price="{item}">
            {{ currency_string(item.price, currency(item))}}
            </template>
            <template #item.gross_account="{item}">
            {{ currency_string(item.gross_account, currency(item))}}
            </template>
            <template #item.gross_investment="{item}">
            {{ currency_string(item.gross_investment, currency(item))}}
            </template>
            <template #item.gross_user="{item}">
            {{ currency_string(item.gross_user, currency(item))}}
            </template>
            
            <template #item.commission="{item}">
            {{ currency_string(item.commission, currency(item))}}
            </template>
            <template #item.taxes="{item}">
            {{ currency_string(item.taxes, currency(item))}}
            </template>
            
            <template #item.net_account="{item}">
            {{ currency_string(item.net_account, currency(item))}}
            </template>
            <template #item.net_investment="{item}">
            {{ currency_string(item.net_investment, currency(item))}}
            </template>
            <template #item.net_user="{item}">
            {{ currency_string(item.net_user, currency(item))}}
            </template>
            
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="copyIO(item)">mdi-content-copy</v-icon>
                <v-icon small class="mr-2" @click="editIO(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteIO(item)">mdi-delete</v-icon>
            </template>
                <template #bottom ></template>   
        </v-data-table>
        <!-- IO CU-->
        <v-dialog v-model="dialog_io" width="40%">
            <v-card class="pa-3">
                <InvestmentsoperationsCU :io="io" :mode="io_mode" :key="key"  @cruded="on_InvestmentsoperationsCU_cruded()" />
            </v-card>
        </v-dialog> 
        <!-- InvestmentsTransfersCU DIALOG -->
        <v-dialog v-model="transfer_crud_dialog" width="80%">
            <v-card class="pa-3">
                <InvestmentsTransfersCU :transfer="transfer" :mode="transfer_crud_mode" :key="key"  @cruded="on_InvestmentsTransfersCU_cruded()"></InvestmentsTransfersCU>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
    import axios from "axios"
    import { ref, computed, onMounted, nextTick } from 'vue'
    import InvestmentsoperationsCU from './InvestmentsoperationsCU.vue'
    import { useStore } from "@/store"
    import { empty_investment_operation } from '@/empty_objects.js'
    import { localtime } from 'vuetify_rules'
    import { hyperlinked_url, getMapObjectById, currency_string, myheaders, parseResponseError } from '@/functions'
    import InvestmentsTransfersCU from './InvestmentsTransfersCU.vue'
    import { useI18n } from 'vue-i18n'

    const props = defineProps({
        items: {
            required: true
        },
        showactions:{ //Used to edit io operation
            type: Boolean,
            required:false,
            default:true
        },
        output:{ // "investmnt", account or user to see table ouput
            type: String,
            required:true,
            default: "investment",
        },
        showinvestment:{// Items must have accounts attribute
            type: Boolean,
            required:false,
            default: false,
        },
    })

    const emit = defineEmits(['cruded'])
    const { t } = useI18n()

    const selected = ref([])
    const key = ref(0)
    const table_o = ref(null)

    // IO CU
    const dialog_io = ref(false)
    const io = ref(null)
    const io_mode = ref(null)

    // InvestmentsTransfersCU
    const transfer_crud_dialog = ref(false)
    const transfer_crud_mode = ref(null)
    const transfer = ref(null)

    // Currencies are part of the item
    function currency(item){
        if (props.output=="account"){
            return item.currency_account
        } else if (props.output=="investment"){
            return item.currency_product
        } else if (props.output=="user"){
            return item.currency_user
        }
    }

    const tableHeaders = computed(() => {
        var r
        if (props.output=="account"){
            r= [
                { title: t('Date and time'), key: 'datetime',sortable: true },
                { title: t('Operation'), key: 'operationstypes',sortable: true },
                { title: t('Shares'), key: 'shares',sortable: false, align:'end'},
                { title: t('Price'), key: 'price',sortable: false, align:'end'},
                { title: t('Gross'), key: 'gross_account',sortable: false, align:'end'},
                { title: t('Commission'), key: 'commission',sortable: false, align:'end'},
                { title: t('Taxes'), key: 'taxes',sortable: false, align:'end'},
                { title: t('Net'), key: 'net_account',sortable: false, align:'end'},
                { title: t('Currency factor'), key: 'currency_conversion',sortable: false, align:'end'},
                { title: t('Comment'), key: 'comment',sortable: false},
            ]
        } else if (props.output=="investment"){                
            r= [
                { title: t('Date and time'), key: 'datetime',sortable: true },
                { title: t('Operation'), key: 'operationstypes',sortable: true },
                { title: t('Shares'), key: 'shares',sortable: false, align:'end'},
                { title: t('Price'), key: 'price',sortable: false, align:'end'},
                { title: t('Gross'), key: 'gross_investment',sortable: false, align:'end'},
                { title: t('Commission'), key: 'commission',sortable: false, align:'end'},
                { title: t('Taxes'), key: 'taxes',sortable: false, align:'end'},
                { title: t('Net'), key: 'net_investment',sortable: false, align:'end'},
                { title: t('Currency factor'), key: 'currency_conversion',sortable: false, align:'end'},
                { title: t('Comment'), key: 'comment',sortable: false},
            ]
        } else if (props.output=="user"){
            r= [
                { title: t('Date and time'), key: 'datetime',sortable: true },
                { title: t('Operation'), key: 'operationstypes',sortable: true },
                { title: t('Shares'), key: 'shares',sortable: false, align:'end'},
                { title: t('Price'), key: 'price',sortable: false, align:'end'},
                { title: t('Gross'), key: 'gross_user',sortable: false, align:'end'},
                { title: t('Commission'), key: 'commission',sortable: false, align:'end'},
                { title: t('Taxes'), key: 'taxes',sortable: false, align:'end'},
                { title: t('Net'), key: 'net_user',sortable: false, align:'end'},
                { title: t('Currency factor'), key: 'currency_conversion',sortable: false, align:'end'},
                { title: t('Comment'), key: 'comment',sortable: false},
            ]
        }

        if (props.showactions==true){
            r.push({ title: t('Actions'), key: 'actions', sortable: false })
        }
        
        if (props.showinvestment==true){
            r.splice(1, 0, { title: t('Name'), key: 'name',sortable: true });
        }
        return r
    })

    function copyIO(item){
        io.value=empty_investment_operation()
        io.value.operationstypes=hyperlinked_url("operationstypes",item.operationstypes_id)
        io.value.shares=item.shares
        io.value.taxes=item.taxes
        io.value.commission=item.commission
        io.value.price=item.price
        io.value.comment=item.comment
        io.value.currency_conversion=item.currency_conversion
        io.value.investments=hyperlinked_url("investments",item.investments_id)
        io_mode.value="C"
        key.value=key.value+1
        dialog_io.value=true
    }

    function editIO(item){
        if (item.associated_it_id){ //Investment transfer
            axios.get(`${useStore().apiroot}/api/investmentstransfers/${item.associated_it_id}/`, myheaders())
            .then((response) => {
                transfer.value=response.data
                transfer_crud_mode.value="U"
                key.value=key.value+1
                transfer_crud_dialog.value=true
            }, (error) => {
                parseResponseError(error)
            });
        } else {
            io.value=item
            io_mode.value="U"
            key.value=key.value+1
            dialog_io.value=true
        }
    }

    function deleteIO(item){
        io.value=item
        io_mode.value="D"
        key.value=key.value+1
        dialog_io.value=true
    }

    function on_InvestmentsoperationsCU_cruded(){
        dialog_io.value=false
        gotoLastRow()
        emit("cruded")
    }

    function on_InvestmentsTransfersCU_cruded(){
        transfer_crud_dialog.value = false
        gotoLastRow()
        emit("cruded")
    }

    async function gotoLastRow(){
        await nextTick()
        const tableWrapper = table_o.value?.$el?.querySelector('.v-table__wrapper')
        if (tableWrapper) tableWrapper.scrollTop = tableWrapper.scrollHeight
    }

    onMounted(() => {
        gotoLastRow()
    })

</script>
