<template>
    <div>
        <h1>{{ $t(`Strategy details of '${strategy.name }'`)}}
        <MyMenuInline :items="items" :context="this"></MyMenuInline>  </h1>

    </div>
</template>  
<script>     
    import MyMenuInline from './MyMenuInline.vue'
    export default {
        components:{
            MyMenuInline,
        },
        props:{
            strategy:{
                required:true,
            }
        },
        data () {
            return {
                tab:0,          
                items: [
                    { subheader:this.$t('Credit card orders'), children: [
                            { 
                                name:this.$t('Add a credit card'), 
                                code: function(this_){
                                    this_.editing_cc=false
                                    this_.cc=this_.empty_credit_card()
                                    this_.dialog_cc=true
                                },
                                icon: "mdi-plus" 
                            },
                        ]
                    },
                ],

            }  
        },
        methods: {
        }
    }
</script>

