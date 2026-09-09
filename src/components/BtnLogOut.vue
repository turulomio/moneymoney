<template>
    <div>
        <v-btn @click="logout" data-test="BtnLogOut_Button" prepend-icon="mdi-logout"><span class="mr-2 text-no-wrap text-truncate">{{ $t(label) }}</span></v-btn>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios'

/**
 * Component props.
 * @property {string} [label='Log out'] - Button text label.
 * @property {string} [logoutUrl=null] - Endpoint URL for logout request.
 * @property {string} [token=null] - Authentication token to invalidate on backend.
 * @property {string|object} [nextRoute='home'] - Destination route name, path, or object after logout.
 * @property {Function} [customLogout=null] - Optional custom logout function.
 */
const props = defineProps({
    label: {
        type: String,
        default: 'Log out'
    },
    logoutUrl: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: null
    },
    nextRoute: {
        type: [String, Object],
        default: 'home'
    },
    customLogout: {
        type: Function,
        default: null
    }
})

/**
 * Component emits.
 * @emits logged-out Emitted when the user logs out.
 * @emits error Emitted if the logout request fails.
 */
const emit = defineEmits(['logged-out', 'error'])

/**
 * Vue router instance.
 */
const router = useRouter()

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
 * Dispatches logout actions: emits logged-out event, sends request to logoutUrl if configured,
 * and navigates to the nextRoute.
 * @returns {Promise<void>}
 */
async function logout() {
    emit('logged-out')
    navigate(props.nextRoute)

    try {
        if (props.customLogout) {
            await props.customLogout()
        } else if (props.logoutUrl && props.token) {
            await axios.post(
                props.logoutUrl,
                { key: props.token },
                { noparse: true, noheaders: true }
            )
        }
    } catch (error) {
        console.warn('Logout request completed with error:', error)
        emit('error', error)
    }
}
</script>
