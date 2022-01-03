<template>
    <div v-show="this.$store.state.logged">
        <div >
            <h1 class="mb-2">{{ $t("Settings") }}</h1>
            
            <v-form ref="form" v-model="form_valid" lazy-validation >
                <v-card class="mx-auto pa-6" max-width="40%">
                    <v-card-title>{{ $t('Personal preferences') }}</v-card-title>
                    <v-autocomplete :items="$store.state.currencies" v-model="$store.state.local_currency" :label="$t('Select your local currency')" item-text="fullname" item-value="code" :rules="RulesSelection(true)"></v-autocomplete>
                    <v-autocomplete :items="timezones" v-model="$store.state.local_zone" :label="$t('Select your localtime zone')" :rules="RulesSelection(true)"></v-autocomplete>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>

                <v-card class="mx-auto pa-6 mt-3" max-width="40%">
                    <v-card-title>{{ $t('Investing.com portfolio settings') }}</v-card-title>
                    <v-textarea v-model="investing_com_referer" :label="$t('Select your Investing.com referer')" :rules="RulesString(2000, true)"></v-textarea>
                    <v-textarea v-model="investing_com_cookie" :label="$t('Select your Investing.com cookie')" :rules="RulesString(10000, true)"></v-textarea>
                    <v-textarea v-model="investing_com_url" :label="$t('Select your Investing.com url')" :rules="RulesString(2000, true)"></v-textarea>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>


                <div class="mx-auto pa-5" align="center">
                    <v-btn color="error" @click="save_settings()" :disabled="!form_valid">{{ $t("Save settings")}}</v-btn>
                </div>
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

                investing_com_referer: null,
                investing_com_url: null,
                investing_com_cookie: null, 

                loading:false
            }
        },
        methods: {
            save_settings(){
                if (this.$refs.form.validate()==false) return

                const data={
                    local_currency: this.$store.state.local_currency,
                    local_zone: this.$store.state.local_zone,
                    investing_com_referer: this.investing_com_referer,
                    investing_com_cookie: this.investing_com_cookie,
                    investing_com_url: this.investing_com_url,
                }



                axios.post(`${this.$store.state.apiroot}/settings/`, data, this.myheaders())
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
            },
            promise_load_timezones(){
                return axios.get(`${this.$store.state.apiroot}/timezones/`, this.myheaders())
            },
            promise_load_settings(){
                return axios.get(`${this.$store.state.apiroot}/settings/`, this.myheaders())
            },
            make_all_axios(){
                this.loading=true
                axios.all([this.promise_load_timezones(),this.promise_load_settings()])
                .then(([resTimezones,resSettings]) => {
                    this.timezones=resTimezones.data
                    this.investing_com_referer=resSettings.data.investing_com_referer
                    this.investing_com_cookie=resSettings.data.investing_com_cookie
                    this.investing_com_url=resSettings.data.investing_com_url
                    this.loading=false
                });
            },

        },
        created(){
            this.make_all_axios()
        }
    }
</script>
