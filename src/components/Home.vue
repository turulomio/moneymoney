<template>
    <div>
        <v-overlay data-test="Home_LoadingOverlay" :model-value="loading_bootstrap" class="align-center justify-center" persistent>
            <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <h1>{{ t("Wellcome to Money Money") }}</h1>
        <h2>{{ `${useStore().version} (${useStore().versiondate.toISOString().slice(0,10)})` }}</h2>
        <v-img :src="imgUrl" height="200px" contain ></v-img>
        <Alerts />
    </div>
</template>

<script setup>
    import { useStore } from '@/store'
    import imgUrl from '@/assets/moneymoney.png'
    import Alerts from './Alerts.vue'
    import { ref, watch } from 'vue'
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n()

    const loading_bootstrap = ref(false)

    watch(() => useStore().logged, async (logged) => {
        if (logged) {
            loading_bootstrap.value = true
            try {
                const store = useStore()
                if (!store.catalogsLoaded) {
                    await store.updateAll()
                    store.catalogsLoaded = true
                }
            } catch (error) {
                console.error("Bootstrap data load failed:", error)
            } finally {
                loading_bootstrap.value = false
            }
        }
    }, { immediate: true })
</script>