<template>
    <div v-show="this.$store.state.logged" class="mx-auto px-5">
            <h1 class="mb-4">{{ $t("Settings") }}</h1>
            
            <v-form ref="form" v-model="form_valid">
            <v-tabs  background-color="primary" dark v-model="tab">
                <v-tab key="profile"><v-icon left>mdi-face-man-profile</v-icon>{{ $t('Profile') }}</v-tab>
                <v-tab key="amounts"><v-icon left>mdi-currency-usd</v-icon>{{ $t('Amounts to invest') }}</v-tab>
                <v-tab key="local_settings"><v-icon left>mdi-map-marker</v-icon>{{ $t('Local preferences') }}</v-tab>
                <v-tab key="investing_com"><v-icon left>mdi-domain</v-icon>{{ $t('Investing.com') }}</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
                <v-tab-item key="profile" >
                    <v-card class="mx-auto pa-6 mt-3" max-width="40%">
                        <v-card-title>{{ $t('Profile settings') }}</v-card-title>                    
                        <v-text-field v-model="new_settings.first_name" :label="$t('Set your name')" :placeholder="$t('Set your name')" :rules="RulesString(200,true)" counter="200"/>
                        <v-text-field v-model="new_settings.last_name" :label="$t('Set your last name')" :placeholder="$t('Set your last name')" :rules="RulesString(200,true)" counter="200"/>
                        <v-text-field v-model="new_settings.user_email" :label="$t('Set your email')" :placeholder="$t('Set your email')" :rules="RulesEmail(true)" counter="200"/>
                        <v-text-field type="password" v-model="new_settings.newp" :label="$t(`Set your new password. Leave empty if you don't want to change it`)" :placeholder="$t('Set your password')" :rules="RulesPassword(40,false)" counter="40"/>
                        <v-text-field type="password" v-model="dupnewp" :label="$t(`Set your new password. Leave empty if you don't want to change it`)" :placeholder="$t('Set your password')" :rules="RulesPassword(40,false)" counter="40"/>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="amounts" >
                    <v-card class="mx-auto pa-6 mt-3" max-width="40%">
                        <v-card-title>{{ $t('Amount to invest') }}</v-card-title>                    
                        <v-text-field v-model="new_settings.invest_amount_1" type="number" :label="$t('First amount to invest')" :placeholder="$t('First amount to invest')" :rules="RulesInteger(10,true)" counter="10"/>
                        <v-text-field v-model="new_settings.invest_amount_2" type="number" :label="$t('Second amount to invest')" :placeholder="$t('Second amount to invest')" :rules="RulesInteger(10,true)" counter="10"/>
                        <v-text-field v-model="new_settings.invest_amount_3" type="number" :label="$t('Third amount to invest')" :placeholder="$t('Third amount to invest')" :rules="RulesInteger(10,true)" counter="10"/>
                        <v-text-field v-model="new_settings.invest_amount_4" type="number" :label="$t('Fourth amount to invest')" :placeholder="$t('Fourth amount to invest')" :rules="RulesInteger(10,true)" counter="10"/>
                        <v-text-field v-model="new_settings.invest_amount_5" type="number" :label="$t('Fifth amount to invest')" :placeholder="$t('Fifth amount to invest')" :rules="RulesInteger(10,true)" counter="10"/>


                    </v-card>                        

                    <v-card class="mx-auto pa-6 mt-3" max-width="40%">
                            <v-text-field v-model="example_invested" type="number" :step="1000" :label="$t('Example. Invested amount')" :placeholder="$t('Example. Invested amount')" :rules="RulesInteger(10,true)" counter="10"/>
                            <p>{{example_amount_to_invest}}</p>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="local_settings">
                    <v-card class="mx-auto pa-6" max-width="40%">
                        <v-card-title>{{ $t('Personal preferences') }}</v-card-title>
                        <v-autocomplete :items="$store.state.currencies" v-model="new_settings.local_currency" :label="$t('Select your local currency')" item-text="fullname" item-value="code" :rules="RulesSelection(true)"></v-autocomplete>
                        <v-autocomplete :items="timezones" v-model="new_settings.local_zone" :label="$t('Select your localtime zone')" :rules="RulesSelection(true)"></v-autocomplete>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="investing_com" >                 
                    <v-card class="mx-auto pa-6 mt-3" max-width="40%">
                        <v-card-title>{{ $t('Investing.com portfolio settings') }}</v-card-title>
                        <v-textarea v-model="new_settings.investing_com_referer" :label="$t('Select your Investing.com referer')" :rules="RulesString(2000, true)"></v-textarea>
                        <v-textarea v-model="new_settings.investing_com_cookie" :label="$t('Select your Investing.com cookie')" :rules="RulesString(10000, true)"></v-textarea>
                        <v-textarea v-model="new_settings.investing_com_url" :label="$t('Select your Investing.com url')" :rules="RulesString(2000, true)"></v-textarea>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
            <div class="mx-auto pa-5" align="center">
                <v-btn color="error" @click="save_settings()" :disabled="!form_valid">{{ $t("Save settings")}}</v-btn>
            </div>
        </v-form>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'Settings',
        data () {
            return {
                form_valid: true,
                tab:0,
                timezones:[],
                new_settings:null,
                dupnewp:"",
                example_invested:0,
                example_amount_to_invest:0,
                loading:false,
            }
        },
        watch:{
            example_invested: function (){
                this.example_amount_to_invest=this.$t("Recomended amount to invest: {0}").format(this.amount_to_invest(this.example_invested))
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
                    if (response.data.local_settings && response.data.investing_com && response.data.profile && response.data.invest_amounts) {
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
