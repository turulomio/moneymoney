<template>
    <div>
        <h1>{{ $t("Wellcome to Money Money") }}</h1>
        <h2>{{ `${$store.state.version} (${$store.state.versiondate.toISOString().slice(0,10)})` }}</h2>
        <!-- <v-card   width="30%">
            <v-form ref="form" v-model="form_valid">
                <v-text-field v-model.number="a" :label="$t('Not required')" :rules="RulesInteger(10,false)" counter="10"/>
                <v-text-field v-model.number="b" :label="$t('Required')" autofocus :rules="RulesInteger(10,true)" counter="10"/>
            </v-form>   
            <v-btn @click="$refs.form.validate()">Validate</v-btn>
        </v-card> -->
        <v-img src="@/assets/moneymoney.png" height="200px" contain ></v-img>
        <v-alert dense class="ma-15 px-10" outlined type="error" v-if="message.length>0"> {{message}}</v-alert>            

    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        data(){
            return {
                message:"",
                // a:12,
                // b:12,
                // form_valid:false,
            }
        },
        methods:{
            check_time(){
                axios.get(`${this.$store.state.apiroot}/time/`, this.myheaders())
                .then((response) => {
                    let local=new Date()
                    let server= new Date(response.data)
                    let diff=local-server
                    console.log(`Local time: ${local.toISOString()}`)
                    console.log(`Server time: ${server.toISOString()}`)
                    console.log(`Difference (ms): ${diff}`)
                    if (diff>=Math.abs(1000)) this.message=this.$t("There is a time difference between the browser and the server of {0} ms. Please contact server administrator.").format(diff)
                }, (error) => {
                    this.parseResponseError(error)
                });

            }

        },
        mounted(){
            this.check_time()
        }
    }
</script>
