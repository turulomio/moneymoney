<template>
    <div>
        <v-btn @click="logout()" color="primary" >
            <v-icon>mdi-logout</v-icon>
            <span class="mr-2  text-no-wrap text-truncate">{{ $t("Log out") }}</span>
        </v-btn>   
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        methods: {
            logout(){
                axios.post(`${this.$store.state.apiroot}/logout/`, {'key': this.$store.state.token},this.myheaders())
                .then(() => {
                    this.$store.state.token=null;
                    this.$store.state.logged=false;
                }, (error) => {
                    this.parseResponseError(error)
                    });
            }
        },
    }
</script>
