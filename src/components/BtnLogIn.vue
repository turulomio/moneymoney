<template>
    <div>
    <v-btn @click="dialog = true"  prepend-icon="mdi-account">
        {{ $t("Log in") }}
    </v-btn>    
    <v-dialog v-model="dialog" max-width="600" persistent>
        <v-card  class="pa-6">
            <h1 class="mb-2">{{ $t("Enter your credentials") }}</h1>
            <v-form ref="form" v-model="form_valid">
                <v-text-field data-test="BtnLogIn_User" v-model="user" :readonly="loading" type="text" :counter="75" :label="$t('User')" :placeholder="$t('Enter user')" autofocus :rules="RulesString(75,true)"/>
                <v-text-field data-test="BtnLogIn_Password" v-model="password" :readonly="loading" type="password" :label="$t('Password')" :counter="75" :placeholder="$t('Enter password')" :rules="RulesString(75,true)"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="BtnLogIn_cmd" color="primary" :loading="loading" @click="login" :disabled="!form_valid">{{ $t("Log in") }}</v-btn>
                <v-btn data-test="BtnLogIn_cmdCancel" color="error" :disabled="loading" @click="cancel">{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import { useStore } from "@/store"
import { RulesString } from "vuetify_rules"
export default {
    props: {
        nextRoute: {
            type: [String, Object],
            default: "home"
        }
    },
    data () {
        return {
            user: "",
            password: "",
            dialog: false,         
            loading:false,       
            
            form_valid:false}
    },
    methods: {
        useStore,
        RulesString,
        async login(){
            var start=new Date()
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
            if (this.loading==true) return
            this.loading=true
            try {
                const response = await axios.post(`${this.useStore().apiroot}/login/`, {username: this.user, password:this.password}, { noheaders: true })
                console.log("Authenticated");
                this.useStore().setToken(response.data)
                this.$refs.form.reset()
                this.loading=false
                console.log(`Login and catalogs load took ${new Date()-start} ms`)
                this.dialog=false
                if (typeof this.nextRoute === 'string') {
                    if (this.nextRoute.startsWith('/')) {
                        this.$router.push(this.nextRoute)
                    } else {
                        this.$router.push({ name: this.nextRoute })
                    }
                } else {
                    this.$router.push(this.nextRoute)
                }
            } catch (error) {
                console.error("Login failed with error:", error);
                setTimeout(() => { //Delay of 2 seconds
                    this.$refs.form.reset()
                    this.dialog=false
                    this.loading=false
                }, 2000);
            }
        },
        cancel(){
            this.$refs.form.reset()
            this.dialog = false
        }
    }
}
</script>