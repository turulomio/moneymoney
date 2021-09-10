<template>
    <div v-show="this.$store.state.logged">
        <div >
            <h1 class="mb-2">{{ $t("Settings") }}</h1>
            
            <v-form ref="form" v-model="form_valid" lazy-validation >
                <v-card class="mx-auto pa-6" max-width="40%">
                    <v-autocomplete :items="$store.state.currencies" v-model="$store.state.local_currency" :label="$t('Select your local currency')" item-text="fullname" item-value="code" :rules="RulesSelection(true   )"></v-autocomplete>
                    <v-autocomplete :items="timezones" v-model="$store.state.local_zone" :label="$t('Select your localtime zone')" :rules="RulesSelection(true)"></v-autocomplete>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="save_settings()" :disabled="!form_valid">{{ $t("Save settings")}}</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'Settings',
        data () {
            return {
                form_valid: true,
                timezones:[],
            }
        },
        methods: {
            save_settings(){
                if (this.$refs.form.validate()==false) return
                const formData = new FormData();
                formData.append('local_currency', this.$store.state.local_currency)
                formData.append('local_zone', this.$store.state.local_zone)
                axios.post(`${this.$store.state.apiroot}/settings/`, formData, this.myheaders_formdata())
                .then((response) => {
                    console.log(response.data)
                    if (response.data==true) {
                        alert(this.$t("Settings saved"))
                     } else {
                          alert(this.$t("There was a problem saving settings"))
                     }
                    this.$router.push("home")
                }, (error) => {
                    this.parseResponseError(error)
                });
            }
        },
        mounted(){
            axios.get(`${this.$store.state.apiroot}/timezones/`, this.myheaders())
            .then((response) => {
                this.timezones=response.data
            }, (error) => {
                this.parseResponseError(error)
            });
        }
    }
</script>
