<template>
    <div>
        <v-btn @click="logout()"  prepend-icon="mdi-logout" >
            <span class="mr-2  text-no-wrap text-truncate">{{ $t("Log out") }}</span>
        </v-btn>   
    </div>
</template>

<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    export default {
        methods: {
            useStore,
            logout(){
                axios.post(`${this.useStore().apiroot}/logout/`, {'key': this.useStore().token},this.myheaders())
                .then(() => {
                    this.useStore().token=null;
                    this.useStore().logged=false;
                    this.$router.push({name:'home'})
                }, (error) => {
                    this.parseResponseError(error)
                    });
            }
        },
    }
</script>
