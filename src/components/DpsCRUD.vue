<template>
    <div>
        <v-card>
            <h1>{{ title() }}</h1>
            <v-form ref="form" v-model="form_valid" v-if='dps!=null'>
                <v-col>
                    <MyDatePicker :readonly="mode=='D'" v-model="newdps.date" :label="$t('Select DPS date')" />
                    <MyDatePicker :readonly="mode=='D'" v-model="newdps.paydate" :label="$t('Select DPS pay date')" />
                    <v-text-field :readonly="mode=='D'" v-model="newdps.gross"  :label="$t('Enter a DPS')" :counter="10" :placeholder="$t('Enter a DPS')" :rules="RulesFloat(10, true,6)"></v-text-field>
                </v-col>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="submit()" :disabled="!form_valid">{{ button() }}</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </div>
</template>

<script>
import axios from 'axios'
import MyDatePicker from './MyDatePicker.vue'
export default {
    components:{
        MyDatePicker,
    },
    props: {
        dps: {
            required: true,
        },
        mode: {
            required: true,
        }
    },
    data() {
        return {
            newdps: null,
            form_valid: false,
        };
    },
    methods: {
        title(){
            if (this.mode=="C") return this.$t("Add a DPS")
            if (this.mode=="U") return this.$t("Update DPS")
            if (this.mode=="D") return this.$t("Delete DPS")
        },
        button(){
            if (this.mode=="C") return this.$t("Add")
            if (this.mode=="U") return this.$t("Update")
            if (this.mode=="D") return this.$t("Delete")
        },
        submit() {
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
            if (this.mode == "C") {
                axios.post(`${this.store().apiroot}/api/dps/`, this.newdps, this.myheaders())
                    .then(() => {
                    this.$emit("cruded");
                }, (error) => {
                    this.parseResponseError(error);
                });
            }
            else if (this.mode == "U") {
                axios.put(this.newdps.url, this.newdps, this.myheaders())
                    .then(() => {
                    this.$emit("cruded");
                }, (error) => {
                    this.parseResponseError(error);
                });
            }
            else if (this.mode == "D") {
                var r = confirm(this.$t("Do you want to delete this DPS?"));
                if (r == false) {
                    return;
                }
                axios.delete(this.newdps.url, this.myheaders())
                .then(() => {
                    this.$emit("cruded");
                }, (error) => {
                    this.parseResponseError(error);
                });
            }
        },
    },
    created() {
        this.newdps = Object.assign({}, this.dps)
    }
}
</script>
