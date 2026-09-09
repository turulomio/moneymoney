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
                axios.post(`${this.useStore().apiroot}/logout/`, {'key': this.useStore().token})
                .then(() => {
                    this.useStore().token=null;
                    this.useStore().logged=false;
                    if (typeof this.nextRoute === 'string') {
                        if (this.nextRoute.startsWith('/')) {
                            this.$router.push(this.nextRoute)
                        } else {
                            this.$router.push({ name: this.nextRoute })
                        }
                    } else {
                        this.$router.push(this.nextRoute)
                    }
                });
            }
        }}
</script>
