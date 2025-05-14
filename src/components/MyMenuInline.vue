<!-- You need to put items and @selected method

type puede ser redirection or command

            <MyMenuInline :items="menuinline_items" />


                menuinline_items: [
                    {
                        subheader: this.$t("Bank options"),
                        children: [
                            {
                                name:"Add a new bank",
                                icon: "mdi-pencil",
                                code: function(){
                                    alert(this.showActive)
                                }.bind(this),
                                color: black //Optional
                                disabled: true //Optional
                            },
                        ]
                    },
                ]

            MyMenuInlineSelection(item){
                item.code(this)
            },
 -->


<template>
    <div style="display: inline-block;">
        <v-menu offset-y>
            <template  v-slot:activator="{ props }">
                <v-btn :data-test="`${dataTest}_Button`" text dark v-bind="props" style="color:darkgrey" class="elevation-0">
                    <v-icon>mdi-menu</v-icon>
                </v-btn>
            </template>
            <v-list density="compact">
                <template v-for="(subheaderGroup, indexsubheader) in new_items" :key="indexsubheader">
                    <v-list-subheader v-if="subheaderGroup.subheader" inset>{{ subheaderGroup.subheader }}</v-list-subheader>
                    <v-list-item
                        v-for="(item, index) in subheaderGroup.children"
                        :key="`${indexsubheader}-${item.name}-${index}`" 
                        :data-test="`${dataTest}_Header${indexsubheader}_Item${index}`" 
                        @click="on_item_click(item)" 
                        :prepend-icon="item.icon" 
                        :title="item.name" 
                        :disabled="item.disabled" 
                        :base-color="item.color"
                    />
                    <v-divider></v-divider>
                </template>
            </v-list>
        </v-menu>
    </div>
</template>
<script>
    export default {
        data: function(){
            return {
                new_items:null,
            }
        },
        props: {
            items: {
                required: true
            },
            dataTest: {
                type: String,
                default: 'MyMenuInline'
            }
        },
        methods: {
            on_item_click(item){
                item.code()
            },
        },
        created() {
            this.new_items=[]
            var new_item
            var new_children
            this.items.forEach(o => {
                new_item={
                    subheader:o.subheader,
                    children:[]
                }
                this.new_items.push(new_item)
                o.children.forEach(item =>{
                    new_children=Object.assign({color:"black",disabled:false}, item)
                    new_item.children.push(new_children)

                })
            });
        }
    }
</script>
