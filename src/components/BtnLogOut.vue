<template>
    <div>
        <v-btn @click="logout()" data-test="BtnLogOut_Button"  prepend-icon="mdi-logout" >
            <span class="mr-2  text-no-wrap text-truncate">{{ $t("Log out") }}</span>
        </v-btn>   
    </div>
</template>

<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    export default {
        props: {
            nextRoute: {
                type: [String, Object],
                default: "home"
            }
        },
        methods: {
            useStore,
            logout(){
                const token = this.useStore().token;
                this.useStore().setToken(null);

                if (typeof this.nextRoute === 'string') {
                    if (this.nextRoute.startsWith('/')) {
                        this.$router.push(this.nextRoute)
                    } else {
                        this.$router.push({ name: this.nextRoute })
                    }
                } else {
                    this.$router.push(this.nextRoute)
                }

                if (token) {
                    axios.post(
                        `${this.useStore().apiroot}/logout/`,
                        { 'key': token },
                        { noparse: true, noheaders: true }
                    ).catch((error) => {
                        console.warn("Logout request completed with:", error);
                    });
                }
            }
        }}
</script>
