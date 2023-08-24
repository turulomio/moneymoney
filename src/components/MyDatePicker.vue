<!--
    Value:
        Can be:
            - A Date iso string  new Date().toISOString().split("T")[0] "2022-12-12"
            - null. Se grabaría como null
-->


<template>
        <div class="d-flex flex-column mx-auto pa-4">     
        <div class="component_label">
        {{ $attrs.label }}
        </div>          
            <!-- <v-date-picker v-model="dt" show-adjancent-months></v-date-picker>                            -->
            <VueDatePicker v-model="dt" auto-apply :disabled="readonly" :enable-time-picker="false" :label="$attrs.label" :format="format"  :clearable="clearable"  :zIndex="20000">
                <template #input-icon>
                    <v-icon class="mx-2 pr-2" icon="mdi-calendar" @click.stop="dt=new Date()" ></v-icon>
                </template>
            </VueDatePicker>
        </div>
</template>
<script>
    export default {    
        props: {
            modelValue:{ //v-model in vue3
                required:true
            },
            readonly: {
                required: false,
                default: false,
            },
            rules: {
                type: Array,
                required: false
            },
            clearable: { //Hides null icon
                type: Boolean,
                required: false,
                default: false,
            }
        },
        emits: ['update:modelValue'],
        data: function(){
            return {
                dt: null,
                new_value: null,
            }
        },
        watch: {
            new_value (newValue) {
                this.$emit('update:modelValue', newValue)
            },
            value (newValue) {
                this.new_value = newValue
            },
            dt(newValue){
                this.new_value=this.dt2string(newValue)
            }
        },
        methods: {
            format(){
                if (this.dt) {
                    return this.dt2string(this.dt)
                } else {
                    return ""
                }
            },

            string2dt(s){
                if (!s) return null
                return new Date(s)
            },
            dt2string(dt){
                if (!dt) return null
                return dt.toISOString().slice(0,10)
            }
        },
        created(){
            this.new_value=this.modelValue
            this.dt=this.string2dt(this.new_value)
        },
    }
</script>
<style scoped>
.component_label{
    font-size: 0.8em;
    color: gray;
}
</style>