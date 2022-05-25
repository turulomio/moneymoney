<template>
    <div v-show="this.$store.state.logged">
        <div >
            <h1 class="mb-2">{{ $t("Settings") }}</h1>
            
            <v-form ref="form" v-model="form_valid"  >

                <v-card class="mx-auto pa-6 mt-3" max-width="40%">
                    <v-card-title>{{ $t('Profile settings') }}</v-card-title>                    
                    <v-text-field v-model="new_settings.first_name" :label="$t('Set your name')" :placeholder="$t('Set your name')" :rules="RulesString(200,true)" counter="200"/>
                    <v-text-field v-model="new_settings.last_name" :label="$t('Set your last name')" :placeholder="$t('Set your last name')" :rules="RulesString(200,true)" counter="200"/>
                    <v-text-field v-model="new_settings.user_email" :label="$t('Set your email')" :placeholder="$t('Set your email')" :rules="RulesEmail(true)" counter="200"/>
                    <v-text-field type="password" v-model="new_settings.newp" :label="$t('Set your new password. Leave empty if you don\'t want to change it')" :placeholder="$t('Set your password')" :rules="RulesPassword(40,false)" counter="40"/>
                    <v-text-field type="password" v-model="dupnewp" :label="$t('Set your new password. Leave empty if you don\'t want to change it')" :placeholder="$t('Set your password')" :rules="RulesPassword(40,false)" counter="40"/>
                </v-card>

                <v-card class="mx-auto pa-6" max-width="40%">
                    <v-card-title>{{ $t('Personal preferences') }}</v-card-title>
                    <v-autocomplete :items="$store.state.currencies" v-model="new_settings.local_currency" :label="$t('Select your local currency')" item-text="fullname" item-value="code" :rules="RulesSelection(true)"></v-autocomplete>
                    <v-autocomplete :items="timezones" v-model="new_settings.local_zone" :label="$t('Select your localtime zone')" :rules="RulesSelection(true)"></v-autocomplete>
                </v-card>

                <v-card class="mx-auto pa-6 mt-3" max-width="40%">
                    <v-card-title>{{ $t('Investing.com portfolio settings') }}</v-card-title>
                    <v-textarea v-model="new_settings.investing_com_referer" :label="$t('Select your Investing.com referer')" :rules="RulesString(2000, true)"></v-textarea>
                    <v-textarea v-model="new_settings.investing_com_cookie" :label="$t('Select your Investing.com cookie')" :rules="RulesString(10000, true)"></v-textarea>
                    <v-textarea v-model="new_settings.investing_com_url" :label="$t('Select your Investing.com url')" :rules="RulesString(2000, true)"></v-textarea>
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
                new_settings:null,
                dupnewp:"",

                loading:false,
            }
        },
        methods: {
            save_settings(){
                if (this.new_settings.newp!=this.dupnewp){
                    alert(this.$t("Passwords must be equal"))
                    return
                }

                if (this.$refs.form.validate()==false) return

                axios.post(`${this.$store.state.apiroot}/settings/`, this.new_settings, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    let msg
                    if (response.data.local_settings && response.data.investing_com && response.data.profile) {
                        msg=this.$t("Settings saved")
                     } else {
                        msg=this.$t("There was a problem saving settings")
                     }
                    if (response.data.password) msg=msg+"\n" + this.$t("Password changed")
                    alert(msg)
                    this.new_settings.newp=""
                    this.$store.dispatch("getSettings").then(() =>{
                        console.log(this.$store.state.settings)
                        this.$router.push("home")
                    })
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            promise_load_timezones(){
                return axios.get(`${this.$store.state.apiroot}/timezones/`, this.myheaders())
            },
            make_all_axios(){
                this.loading=true
                axios.all([this.promise_load_timezones()])
                .then(([resTimezones]) => {
                    this.timezones=resTimezones.data
                });
            },

        },
        created(){
            this.make_all_axios()
            this.new_settings=Object.assign({},this.$store.state.settings)
            this.new_settings.newp=""

        }
    }
</script>
