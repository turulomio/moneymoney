<template>
    <div>
        <v-overlay data-test="Home_LoadingOverlay" :model-value="loading_bootstrap" class="align-center justify-center" persistent>
            <div class="d-flex flex-column align-center text-center">
                <v-progress-circular color="primary" indeterminate size="64" class="mb-4"></v-progress-circular>
                <div class="text-h6 font-weight-medium text-white">{{ t("Loading catalogs...") }}</div>
            </div>
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
    import { ref, watch, onMounted } from 'vue'
    import { useI18n } from 'vue-i18n'

    /**
     * Internationalization instance.
     * @type {{ t: Function }}
     */
    const { t } = useI18n()

    /**
     * Controls the visibility of the initial catalog bootstrap loading overlay.
     * @type {import('vue').Ref<boolean>}
     */
    const loading_bootstrap = ref(false)

    /**
     * Loads application catalogs (products, banks, accounts, etc.) if the user is authenticated
     * and catalogs have not been loaded yet.
     * @returns {Promise<void>}
     */
    async function loadCatalogsIfNeeded() {
        const store = useStore()
        if (store.logged && !store.catalogsLoaded) {
            loading_bootstrap.value = true
            try {
                await store.updateAll()
                store.catalogsLoaded = true
            } catch (error) {
                console.error("Bootstrap data load failed:", error)
            } finally {
                loading_bootstrap.value = false
            }
        }
    }

    /**
     * Trigger catalog bootstrap check on initial component mounting.
     */
    onMounted(() => {
        loadCatalogsIfNeeded()
    })

    /**
     * Watch login state changes to trigger catalog loading on user log in.
     */
    watch(() => useStore().logged, async (logged) => {
        if (logged) {
            await loadCatalogsIfNeeded()
        }
    })
</script>