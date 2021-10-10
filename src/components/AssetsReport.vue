<template>
    <div>
        <h1>{{ $t(`Assets Report`) }}</h1>
        <p>{{ loading }}</p>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        data(){
            return {
                loading:false,
            }
        },
        mounted(){
            this.loading=false
            axios.get(`${this.$store.state.apiroot}/assets/report/`, this.myheaders())
            .then(() => {
                this.loading=true
            }, (error) => {
                this.parseResponseError(error)
            });
        }
    }
</script>