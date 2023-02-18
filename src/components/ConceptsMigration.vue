<template>
    <div>    
        <h1>{{ $t("Concepts migration") }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete dense v-model="from_url" readonly :items="$store.state.concepts" :label="$t('Select a concept')" item-text="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-autocomplete dense v-model="to" :items="$store.state.concepts" :label="$t('Select a concept to migrate to')" item-text="name" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
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
            migrate(){
                if( this.$refs.form.validate()==false) return
                var concept_from=this.$store.getters.getObjectByUrl("concepts",this.from_url)
                var concept_to=this.$store.getters.getObjectByUrl("concepts",this.to)
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

