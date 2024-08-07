// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:

// Alternatively you can use CommonJS syntax:
// require('./commands')

import './commands.js'
import Cypress from 'cypress';
import '@cypress/code-coverage/support';
import { mount } from '@cypress/vue'

Cypress.Commands.add('mount', mount)

Cypress.Commands.add('getDataTest', (selector, ...args) =>{
    return cy.get(`[data-test=${selector}]`, ...args)

})
// Example use:
// cy.mount(MyComponent)
// Import global styles if any, for example Vuetify styles
import 'vuetify/dist/vuetify.min.css';
