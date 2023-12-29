/*
Yo need to put items and @selected method

type puede ser redirection or command

            <MyMenuInline :items="menuinline_items"  :context="this"></MyMenuInline>


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

*/

<template>
    <v-menu offset-y>
        <template  v-slot:activator="{ props }">
            <v-btn text dark v-bind="props" style="color:darkgrey" class="elevation-0">
                <v-icon>mdi-menu</v-icon>
            </v-btn>
        </template>
        <v-list density="compact" subheader >
            <div v-for="(subheader,indexsubheader) in new_items" :key="indexsubheader" inset>
                <v-list-subheader inset>{{ subheader.subheader }}</v-list-subheader>
                <div v-for="(item, index) in subheader.children" :key="index" >
                    <v-list-item @click="on_item_click(item)" :prepend-icon="item.icon" :title="item.name" :disabled="item.disabled" :base-color="item.color"/>
                </div>
                <v-divider></v-divider>
            </div>
        </v-list>
    </v-menu>
</template>
<script>
// import { toRaw } from 'vue';
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
            context: {
                required: true
            },
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

