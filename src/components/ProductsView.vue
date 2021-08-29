<template>
    <div>
        <h1>{{ $t(`Products view`)}}
            <MyMenuInline :items="items" @selected="MyMenuInlineSelection"></MyMenuInline>
        </h1>
    </div>

</template>  
<script>     
    import MyMenuInline from './MyMenuInline.vue'
    export default {
        components:{
            MyMenuInline,
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
                                    console.log(this_)
                                },
                                icon: "mdi-plus",
                            },
                        ]
                    },
                ],
            }
        },
        methods: {
            MyMenuInlineSelection(item){
                item.code(this)
            },
        }
        
    }
</script>

