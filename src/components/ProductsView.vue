<template>
    <div>
        <h1>{{ $t(`Products view`)}}
            <MyMenuInline :items="items" :context="this"></MyMenuInline>
        </h1>


        <DisplayValues :items="displayvalues"></DisplayValues>
    
        <v-tabs v-model="tab"  background-color="primary" dark>
            <v-tab key="dps_estimations">{{ $t("DPS estimations")}}</v-tab>
            <v-tab key="quotes">{{ $t("Quotes")}}</v-tab>
            <v-tab-item key="dps_estimations">     
                <v-card class="pa-4 d-flex justify-center" outlined >
                    <TableEstimationsDPS :product="product" :key="key"></TableEstimationsDPS>
                </v-card>
            </v-tab-item>
            <v-tab-item key="quotes">
                <v-card class="padding" outlined>
                </v-card>
            </v-tab-item>
        </v-tabs>  

        <!-- QUOTES CU -->
        <v-dialog v-model="dialog_quotescu" width="35%">
            <v-card class="pa-4">
                <QuotesCU :quote="quote"></QuotesCU>
            </v-card>
        </v-dialog>

        <!-- ESTIMATIONS_DPS CU -->
        <v-dialog v-model="dialog_estimationdps" width="35%">
            <v-card class="pa-4">
                <EstimationsDpsCU :estimation="estimation" @cruded="on_EstimationsDpsCU_cruded()" :key="key"></EstimationsDpsCU>
            </v-card>
        </v-dialog>
    </div>
</template>  
<script>     
    import MyMenuInline from './MyMenuInline.vue'
    import QuotesCU from './QuotesCU.vue'
    import DisplayValues from './DisplayValues.vue'
    import EstimationsDpsCU from './EstimationsDpsCU.vue'
    import TableEstimationsDPS from './TableEstimationsDPS.vue'
    import {empty_quote,empty_estimation_dps} from '../empty_objects.js'
    export default {
        components:{
            DisplayValues,
            EstimationsDpsCU,
            MyMenuInline,
            QuotesCU,
            TableEstimationsDPS,
        },

        props: {
            product: {
                required: true
            },
        },
        data () {
            return {
                displayvalues:[
                    {title:this.$t('Leverage'), value: this.product.leverage},
                    {title:this.$t('Currency'), value: this.product.currency},
                    {title:this.$t('Obsolete'), value: this.product.obsolete},
                    {title:this.$t('Id'), value: this.product.id},
                ],
                items: [
                    {
                        subheader:this.$t('Quote options'),
                        children: [
                            {
                                name:this.$t('Add a quote'),
                                code: function(this_){
                                    this_.quote=this_.empty_quote()
                                    this_.quote.products=this_.product.url
                                    this_.dialog_quotescu=true
                                },
                                icon: "mdi-plus",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('DPS options'),
                        children: [
                            {
                                name:this.$t('Add a DPS estimation'),
                                code: function(this_){
                                    this_.key=this_.key+1
                                    this_.estimation=this_.empty_estimation_dps()
                                    this_.estimation.product=this_.product.url
                                    this_.dialog_estimationdps=true
                                },
                                icon: "mdi-plus",
                            },
                        ]
                    },
                ],

                tab:0,
                key:0,


                // Quotes CU
                dialog_quotescu: false,
                quote:null,

                //Estimations DPS CU
                dialog_estimationdps: false,
                estimation: null,
            }
        },
        methods: {
            empty_quote,
            empty_estimation_dps,
            on_EstimationsDpsCU_cruded(){
                this.dialog_estimationdps=false
                this.key=this.key+1
            },
        }
        
    }
</script>

