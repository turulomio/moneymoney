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
            <div v-for="(subheader,indexsubheader) in items" :key="indexsubheader" inset>
                <v-list-subheader inset>{{ subheader.subheader }}</v-list-subheader>
                <v-list-item v-for="(item, index) in subheader.children" :key="index" @click="on_item_click(item)" :prepend-icon="item.icon" :title="item.name" />
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
                item.code()
            },
        },
    }
</script>

