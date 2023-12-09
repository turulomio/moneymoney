<template>
    <v-card v-show="this.store().logged" class="mx-auto px-5" width="50%" flat>
            <h1 class="mb-4">{{ $t("Settings") }}</h1>
            
            <v-form ref="form" v-model="form_valid">
            <v-tabs  bg-color="secondary" color v-model="tab" grow>
                <v-tab key="profile"><v-icon left>mdi-face-man-profile</v-icon>{{ $t('Profile') }}</v-tab>
                <v-tab key="amounts"><v-icon left>mdi-currency-usd</v-icon>{{ $t('Amounts to invest') }}</v-tab>
                <v-tab key="local_settings"><v-icon left>mdi-map-marker</v-icon>{{ $t('Local preferences') }}</v-tab>
                <v-tab key="investing_com"><v-icon left>mdi-domain</v-icon>{{ $t('Investing.com') }}</v-tab>
            </v-tabs>
            <v-window v-model="tab">
                <v-window-item key="profile" >
                    <v-card class="mx-auto pa-6 mt-3">
                        <v-card-title>{{ $t('Profile settings') }}</v-card-title>                    
                        <v-text-field v-model="new_profile.first_name" :label="$t('Set your name')" :placeholder="$t('Set your name')" :rules="RulesString(200,true)" counter="200"/>
                        <v-text-field v-model="new_profile.last_name" :label="$t('Set your last name')" :placeholder="$t('Set your last name')" :rules="RulesString(200,true)" counter="200"/>
                        <v-text-field v-model="new_profile.email" :label="$t('Set your email')" :placeholder="$t('Set your email')" :rules="RulesEmail(true)" counter="200"/>
                        <v-text-field type="password" v-model="new_profile.newp" :label="$t(`Set your new password. Leave empty if you don't want to change it`)" :placeholder="$t('Set your password')" :rules="RulesPassword(40,false)" counter="40"/>
                        <v-text-field type="password" v-model="dupnewp" :label="$t(`Set your new password. Leave empty if you don't want to change it`)" :placeholder="$t('Set your password')" :rules="RulesPassword(40,false)" counter="40"/>
                    </v-card>
                </v-window-item>
                <v-window-item key="amounts" >
                    <v-card class="mx-auto pa-6 mt-3">
                        <v-card-title>{{ $t('Amount to invest') }}</v-card-title>                    
                        <v-text-field v-model.number="new_profile.invest_amount_1"  :label="$t('First amount to invest')" :placeholder="$t('First amount to invest')" :rules="RulesInteger(10,true)" counter="10"/>
                        <v-text-field v-model.number="new_profile.invest_amount_2"  :label="$t('Second amount to invest')" :placeholder="$t('Second amount to invest')" :rules="RulesInteger(10,true)" counter="10"/>
                        <v-text-field v-model.number="new_profile.invest_amount_3"  :label="$t('Third amount to invest')" :placeholder="$t('Third amount to invest')" :rules="RulesInteger(10,true)" counter="10"/>
                        <v-text-field v-model.number="new_profile.invest_amount_4"  :label="$t('Fourth amount to invest')" :placeholder="$t('Fourth amount to invest')" :rules="RulesInteger(10,true)" counter="10"/>
                        <v-text-field v-model.number="new_profile.invest_amount_5"  :label="$t('Fifth amount to invest')" :placeholder="$t('Fifth amount to invest')" :rules="RulesInteger(10,true)" counter="10"/>


                    </v-card>                        

                    <v-card class="mx-auto pa-6 mt-3">
                            <v-text-field v-model.number="example_invested"  :step="1000" :label="$t('Example. Invested amount')" :placeholder="$t('Example. Invested amount')" :rules="RulesInteger(10,true)" counter="10"/>
                            <p>{{example_amount_to_invest}}</p>
                    </v-card>
                </v-window-item>
                <v-window-item key="local_settings">
                    <v-card class="mx-auto pa-6">
                        <v-card-title>{{ $t('Personal preferences') }}</v-card-title>
                        <v-autocomplete :items="store().currencies" v-model="new_profile.currency" :label="$t('Select your local currency')" item-title="fullname" item-value="code" :rules="RulesSelection(true)"></v-autocomplete>
                        <v-autocomplete :items="timezones" v-model="new_profile.zone" :label="$t('Select your localtime zone')" :rules="RulesSelection(true)"></v-autocomplete>
                    </v-card>
                </v-window-item>
                <v-window-item key="investing_com" >                 
                    <v-card class="mx-auto pa-6 mt-3">
                        <v-card-title>{{ $t('Investing.com portfolio settings') }}</v-card-title>
                        <v-textarea v-model="new_profile.investing_com_referer" :label="$t('Select your Investing.com referer')" :rules="RulesString(2000, false)"></v-textarea>
                        <v-textarea v-model="new_profile.investing_com_cookie" :label="$t('Select your Investing.com cookie')" :rules="RulesString(10000, false)"></v-textarea>
                        <v-textarea v-model="new_profile.investing_com_url" :label="$t('Select your Investing.com url')" :rules="RulesString(2000, false)"></v-textarea>
                    </v-card>
                </v-window-item>
            </v-window>
            <div class="mx-auto pa-5" align="center">
                <v-btn color="error" @click="save_settings()">{{ $t("Save settings")}}</v-btn>
            </div>
        </v-form>
    </v-card>
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
                new_profile:null,
                dupnewp:"",
                example_invested:0,
                example_amount_to_invest:0,
                loading:false,
            }
        },
        watch:{
            example_invested: function (){
                this.example_amount_to_invest=this.$t("Recomended amount to invest: [0]").format(this.amount_to_invest(this.example_invested))
            }
        },
        methods: {


            save_settings(){
                if (this.new_profile.newp!=this.dupnewp){
                    alert(this.$t("Passwords must be equal"))
                    return
                }

                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                axios.put(`${this.store().apiroot}/profile/`, this.new_profile, this.myheaders())
                .then(() => {
                    alert(this.$t("Settings saved"))
                    this.new_profile.newp=""
                    this.store().updateProfile()
                    .then(() =>{
                        this.$router.push({name:"home"})
                    })
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            promise_load_timezones(){
                return axios.get(`${this.store().apiroot}/timezones/`, this.myheaders())
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
            this.new_profile=Object.assign({},this.store().profile)
            this.new_profile.newp=""

        }
    }
</script>
