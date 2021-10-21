<template>
    <div>
        <h1>{{ $t(`Products view`)}}
            <MyMenuInline :items="items" :context="this"></MyMenuInline>
        </h1>

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
    import EstimationsDpsCU from './EstimationsDpsCU.vue'
    import {empty_quote,empty_estimation_dps} from '../empty_objects.js'
    export default {
        components:{
            EstimationsDpsCU,
            MyMenuInline,
            QuotesCU,
        },

        props: {
            product: {
                required: true
            },
        },
        data () {
            return {
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

                // Quotes CU
                dialog_quotescu: false,
                quote:null,

                //Estimations DPS CU
                dialog_estimationdps: false,
                estimation: null,
                key:0,
            }
        },
        methods: {
            empty_quote,
            empty_estimation_dps,
            on_EstimationsDpsCU_cruded(){
                this.dialog_estimationdps=false
            },
        }
        
    }
</script>

