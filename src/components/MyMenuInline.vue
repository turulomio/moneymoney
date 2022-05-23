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
                                code: function(this_){
                                    alert(this_.showActive)
                                },
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
        <template v-slot:activator="{ on, attrs }">
            <v-btn text dark v-bind="attrs" v-on="on" style="color:darkgrey;">
                <v-icon>mdi-menu</v-icon>
            </v-btn>
        </template>
        <v-list dense subheader >
            <div v-for="(subheader,indexsubheader) in items" :key="indexsubheader" inset>
                <v-subheader inset>{{ subheader.subheader }}</v-subheader>
                <v-list-item v-for="(item, index) in subheader.children" :key="index" @click="on_item_click(item)">
                <v-list-item-icon>
                    <v-icon>{{item.icon}}</v-icon>
                </v-list-item-icon>
                    {{ item.name }}
                </v-list-item>
                <v-divider></v-divider>
            </div>
        </v-list>
    </v-menu>
</template>
<script>
    export default {
        data: function(){
            return {
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
                item.code(this.context)
            },
        },
    }
</script>

