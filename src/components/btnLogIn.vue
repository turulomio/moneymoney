<template>
    <div>
    <v-btn @click.stop="dialog = true" color="primary">
        <v-icon>mdi-account</v-icon>
        <span class="mr-2 text-no-wrap text-truncate">{{ $t("Log in") }}</span>
    </v-btn>    
    <v-dialog v-model="dialog" max-width="450">
        <v-card  class="login">
            <v-card-title class="headline">{{ $t("Login in Money Money") }}</v-card-title>
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-text-field v-model="user" type="text" :counter="75" :label="$t('User')" required :placeholder="$t('Enter user')" autofocus :rules="RulesTextRequired75"/>
                <v-text-field v-model="password" type="password" :label="$t('Password')" :counter="75" :placeholder="$t('Enter password')" :rules="RulesTextRequired75"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="login()" :disabled="!form_valid">{{ $t("Log in") }}</v-btn>
                <v-btn color="error" @click="dialog = false">{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </div>
</template>

<script>
    import {vuex_update_catalogs,vuex_update_investments,vuex_update_concepts,vuex_update_settings} from '../functions.js'
    import axios from 'axios'
    export default {
        name: 'btnLogIn',
        data () {
            return {
                user: null,
                password: null,
                dialog: false,                
                
                form_valid:false,
                RulesTextRequired75: [
                    v => !!v || this.$t('Text is required'),
                    v => (v && v.length <75) || this.$t('Text must be less than 75 characters'),
                ],
            }
        },
        methods: {
            login(){            
                if (this.$refs.form.validate()==false) return
                const formData = new FormData();
                formData.append('username', this.user);
                formData.append('password', this.password);
                console.log(this.$store.state)
                axios.post(`${this.$store.state.apiroot}/login/`, formData)
                .then((response) => {
                    if (this.parseResponse(response)==true){
                        console.log("Authenticated");
                        this.$store.state.token=response.data;
                        this.$store.state.logged=true;
                        this.vuex_update_settings()
                        this.vuex_update_investments();
                        this.vuex_update_concepts();
                        this.vuex_update_catalogs();
                        this.dialog=false;
                        this.$refs.form.reset()
                        this.$router.push({name:'home'})
                    }
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
            vuex_update_catalogs,
            vuex_update_concepts,
            vuex_update_investments,
            vuex_update_settings,
        },
    }
</script>
<style>
.login{
    padding:30px;
    
}
</style>
