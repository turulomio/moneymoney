<template>
    <div>
        <v-btn @click="logout()"  prepend-icon="mdi-logout" >
            <span class="mr-2  text-no-wrap text-truncate">{{ $t("Log out") }}</span>
        </v-btn>   
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        methods: {
            logout(){
                axios.post(`${this.store().apiroot}/logout/`, {'key': this.store().token},this.myheaders())
                .then(() => {
                    this.store().token=null;
                    this.store().logged=false;
                    this.$router.push({name:'home'})
                }, (error) => {
                    this.parseResponseError(error)
                    });
            }
        },
    }
</script>
