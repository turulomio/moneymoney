<template>
    <div>
        <v-card>
            <h1>{{ $t("Post an estimation") }}</h1>
            <v-form ref="form" v-model="form_valid" lazy-validation v-if='estimation!=null'>
                <v-col>
                    <v-text-field v-model="newestimation.year" type="text" :counter="4" :label="$t('Year')" :placeholder="$t('Enter a year')" :rules="RulesInteger(4,true)"></v-text-field>
                    <v-text-field v-model="newestimation.estimation" type="text" :label="$t('Estimation')" :counter="10" :placeholder="$t('Enter a estimation')" autofocus @focus="$event.target.select()" :rules="RulesFloat(10, true, 6)"></v-text-field>
                </v-col>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="submit()" :disabled="!form_valid">{{ $t("Post an estimation") }}</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        props: {
            estimation: {
                required: true,
            },
        },
        data(){ 
            return{
                
                newestimation: null,
                form_valid:false,
            }
        },
        methods:{
            submit(){
                if (this.$refs.form.validate()==false) return
                axios.post(`${this.$store.state.apiroot}/estimations/dps/add/`, this.newestimation, this.myheaders())
                .then(() => {
                    this.$emit("cruded")
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            
        },
        created(){
            this.newestimation=Object.assign({},this.estimation)
        }
    }
</script>
