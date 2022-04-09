<!--
    props:
        items. Must be a list of objects with the following attrs:
            - title
            - value

    If we have display_values with code, we must set items as a function
-->
<template>  
        <v-layout style="justify-content: center;" class="ma-4">
            <v-card class="pa-4" :style="width_method()">
                <p v-for="(item, index) in items" class="inform" :key="index">
                    <span v-if="must_be_showed(item,index)">
                        <strong>{{ item.title }}: </strong><span v-html="item.value"></span>
                    </span>
                </p>
            </v-card>
            <v-btn small @click="on_button_click()" v-if="items.length>minimized_items" color="white">
                <v-icon  color="grey">{{icon}}</v-icon>
            </v-btn>
        </v-layout>
</template>

<script>
export default {
    props:{
        items:{
            required:true,
        },
        minimized_items:{
            required:false,
            default: 3,
        },
        width:{
            required:false,
            default: "50%"
        }
    },
    data(){ 
        return{
            minimized:true,
            icon:"mdi-arrow-down-bold-outline",
        }
    },
    methods:{
        width_method(){
            return `width:${this.width};`
        },
        on_button_click(){
            this.minimized=!this.minimized
            if (this.minimized==true){
                this.icon="mdi-arrow-down-bold-outline"
            } else {
                this.icon="mdi-arrow-up-bold-outline"
            }
        },
        must_be_showed(item,index){
            if (this.minimized==true) {
                if (index<this.minimized_items){
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        }
    }
}
</script>
