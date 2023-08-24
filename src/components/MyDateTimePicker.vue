<!--
    Value:
        Can be:
            - A Zulu zulu js string in utc new Date().toISOString()
            - null. Se grabaría como null
            - emptystring genera now en zulu string
            

    Representation is showed in local
    Tuple is in local

-->

<template>
    <div class="d-flex flex-column mx-auto py-4">     
        <div class="component_label">
        {{ $attrs.label }}
        </div>                    
        <VueDatePicker v-model="dt" auto-apply  :disabled="readonly" :aria-labels="{ menu: 'Some custom menu label' }" :format="format" no-clear :clearable="clearable" :zIndex="20000" >
            <template #input-icon>
                <v-icon class="mx-2 pr-2" icon="mdi-calendar" @click.stop="dt=new Date()" ></v-icon>
            </template>
        </VueDatePicker>

    </div>
</template>
<script>
export default {    
    name: "MyDateTimePicker",
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
        new_value () {
            this.$emit('update:modelValue', this.new_value)
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
                return this.localtime(this.dt)
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
            return dt.toISOString()
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