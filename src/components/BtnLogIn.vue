<template>
    <div>
        <v-btn @click="dialog = true" prepend-icon="mdi-account">{{ $t(label) }}</v-btn>
        <v-dialog v-model="dialog" max-width="600" persistent>
            <v-card class="pa-6">
                <h1 class="mb-2">{{ $t("Enter your credentials") }}</h1>
                <v-form ref="formRef" v-model="form_valid">
                    <v-text-field data-test="BtnLogIn_User" v-model="user" :readonly="loading" type="text" :counter="75" :label="$t('User')" :placeholder="$t('Enter user')" autofocus :rules="RulesString(75, true)" />
                    <v-text-field data-test="BtnLogIn_Password" v-model="password" :readonly="loading" type="password" :label="$t('Password')" :counter="75" :placeholder="$t('Enter password')" :rules="RulesString(75, true)" />
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn data-test="BtnLogIn_cmd" color="primary" :loading="loading" @click="login" :disabled="!form_valid">{{ $t("Log in") }}</v-btn>
                    <v-btn data-test="BtnLogIn_cmdCancel" color="error" :disabled="loading" @click="cancel">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { RulesString } from 'vuetify_rules'

/**
 * Component props.
 * @property {string} [label='Log in'] - Button text label.
 * @property {string} [loginUrl='/login/'] - Endpoint URL for username/password authentication.
 * @property {string|object} [nextRoute='home'] - Destination route name, path string, or route object after login.
 * @property {Function} [customLogin=null] - Optional custom login function receiving ({ username, password }).
 */
const props = defineProps({
    label: {
        type: String,
        default: 'Log in'
    },
    loginUrl: {
        type: String,
        default: '/login/'
    },
    nextRoute: {
        type: [String, Object],
        default: 'home'
    },
    customLogin: {
        type: Function,
        default: null
    }
})

/**
 * Component emits.
 * @emits logged-in Emitted upon successful authentication with the received token payload.
 * @emits error Emitted if the authentication request fails.
 */
const emit = defineEmits(['logged-in', 'error'])

/**
 * Vue router instance.
 */
const router = useRouter()

/**
 * Form element reference.
 * @type {import('vue').Ref<any>}
 */
const formRef = ref(null)

/**
 * Username input field value.
 * @type {import('vue').Ref<string>}
 */
const user = ref('')

/**
 * Password input field value.
 * @type {import('vue').Ref<string>}
 */
const password = ref('')

/**
 * Dialog visibility state.
 * @type {import('vue').Ref<boolean>}
 */
const dialog = ref(false)

/**
 * Loading state during authentication request.
 * @type {import('vue').Ref<boolean>}
 */
const loading = ref(false)

/**
 * Form validity state.
 * @type {import('vue').Ref<boolean>}
 */
const form_valid = ref(false)

/**
 * Navigates to target destination route path or name.
 * @param {string|object} target - Target route name, path, or object.
 * @returns {void}
 */
function navigate(target) {
    if (!target) return
    if (typeof target === 'string') {
        if (target.startsWith('/')) {
            router.push(target)
        } else {
            router.push({ name: target })
        }
    } else {
        router.push(target)
    }
}

/**
 * Authenticates user credentials via customLogin or axios post to loginUrl,
 * emits logged-in event, closes the dialog, and navigates to nextRoute.
 * @returns {Promise<void>}
 */
async function login() {
    const start = new Date()
    if (!form_valid.value) {
        formRef.value?.validate()
        return
    }
    if (loading.value) return
    loading.value = true

    try {
        let token = null
        if (props.customLogin) {
            token = await props.customLogin({ username: user.value, password: password.value })
        } else {
            const response = await axios.post(
                props.loginUrl,
                { username: user.value, password: password.value },
                { noheaders: true }
            )
            token = response.data
        }

        console.log('Authenticated')
        emit('logged-in', token)

        formRef.value?.reset()
        loading.value = false
        dialog.value = false
        console.log(`Login took ${new Date() - start} ms`)
        navigate(props.nextRoute)
    } catch (error) {
        console.error('Login failed with error:', error)
        emit('error', error)
        setTimeout(() => {
            formRef.value?.reset()
            dialog.value = false
            loading.value = false
        }, 2000)
    }
}

/**
 * Closes the dialog and resets the form.
 * @returns {void}
 */
function cancel() {
    formRef.value?.reset()
    dialog.value = false
}
</script>