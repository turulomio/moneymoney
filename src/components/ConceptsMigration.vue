<template>
    <div>    
        <h1>{{ $t("Concepts migration") }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid">
                <v-autocomplete density="compact" v-model="from_url" readonly :items="getArrayFromMap(store().concepts)" :label="$t('Select a concept')" item-title="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-autocomplete density="compact" v-model="to" :items="getArrayFromMap(store().concepts)" :label="$t('Select a concept to migrate to')" item-title="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="migrate()">{{ $t("Migrate") }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { RulesSelection } from 'vuetify_rules'
    export default {
        components: {
        },
        props: {
            // An account object
            from: {
                required: true // Null to create, io object to update
            },
        },
        data(){ 
            return {
                form_valid:false,
                from_url: null,
                to: null,
            }
        },
        methods: {
            RulesSelection,
            migrate(){
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                var concept_from=this.store().concepts.get(this.from_url)
                var concept_to=this.store().concepts.get(this.to)
                if (concept_from.operationstypes!=concept_to.operationstypes){
                    alert(this.$t("I can't migrate this concepts due to they have different operation types."))
                    return
                }


                var r
                r = confirm(this.$t("Do you want to migrate this concept?"))
                if(r == false) {
                    return
                }  
                axios.post(`${this.from_url}data_transfer/`, {to:this.to}, this.myheaders())
                .then(() => {
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
        },
        created(){
            this.from_url=this.from.url
        }
    }
</script>

