<template>
    <div>
        <h1>{{ $t(`Assets Report`) }}</h1>
        <div class="text-center mt-4" v-if="loading">
            <v-progress-circular
            indeterminate
            color="primary"
            ></v-progress-circular>

            <v-progress-circular
            indeterminate
            color="red"
            ></v-progress-circular>

            <v-progress-circular
            indeterminate
            color="purple"
            ></v-progress-circular>

            <v-progress-circular
            indeterminate
            color="green"
            ></v-progress-circular>

            <v-progress-circular
            indeterminate
            color="amber"
            ></v-progress-circular>
        </div>
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
        methods:{
        },
        mounted(){
            this.loading=true
            axios.get(`${this.$store.state.apiroot}/assets/report/`, this.myheaders())
            .then((response) => {
                this.loading=false      
                var link = window.document.createElement('a');
                link.href = `data:application/pdf;base64,${response.data}`
                link.download = `file.pdf`
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, (error) => {
                this.parseResponseError(error)
            });
        }
    }
</script>