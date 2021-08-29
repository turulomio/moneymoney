<template>
    <div>
        <h1>{{ $t(`Products view`)}}
            <MyMenuInline :items="items" @selected="MyMenuInlineSelection"></MyMenuInline>
        </h1>
        <v-dialog v-model="dialog_quotescu" width="35%">
            <v-card class="pa-4">
                <QuotesCU :quote="quote"></QuotesCU>
            </v-card>
        </v-dialog>
    </div>
</template>  
<script>     
    import MyMenuInline from './MyMenuInline.vue'
    import QuotesCU from './QuotesCU.vue'
    import {empty_quote} from '../empty_objects.js'
    export default {
        components:{
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
                ],
                dialog_quotescu: false,
                quote:null,
            }
        },
        methods: {
            MyMenuInlineSelection(item){
                item.code(this)
            },
            empty_quote,
        }
        
    }
</script>

