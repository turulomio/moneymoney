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
                <v-text-field v-model="user" type="text" :counter="75" :label="$t('User')" :placeholder="$t('Enter user')" autofocus :rules="RulesString(75,true)"/>
                <v-text-field v-model="password" type="password" :label="$t('Password')" :counter="75" :placeholder="$t('Enter password')" :rules="RulesString(75,true)"/>
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
    import axios from 'axios'
    export default {
        name: 'btnLogIn',
        data () {
            return {
                user: "",
                password: "",
                dialog: false,                
                
                form_valid:false,
            }
        },
        methods: {
            login(){            
                if (this.$refs.form.validate()==false) return
                axios.post(`${this.$store.state.apiroot}/login/`, {username: this.user, password:this.password}, this.myheaders_noauth())
                .then((response) => {
                    if (this.parseResponse(response)==true){
                        console.log("Authenticated");
                        this.$store.state.token=response.data;
                        this.$store.state.logged=true;
                        console.log(this.$i18n.locale)
                        this.$store.dispatch("getAll")
                        this.dialog=false;
                        this.$refs.form.reset()
                        this.$router.push({name:'home'})
                    }
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
        },
    }
</script>
<style>
.login{
    padding:30px;
    
}
</style>
