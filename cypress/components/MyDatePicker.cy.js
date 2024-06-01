import { mount } from '@cypress/vue';
import MyDatePicker from '../../src/components/MyDatePicker.vue'; // Adjust the path accordingly

describe('MyDatePicker Component', () => {
  it('opens the date picker when the calendar icon is clicked', () => {
    mount(MyDatePicker, {
      propsData: {
        modelValue: '2022-12-12',
        clearable: true,
      },
    });

    // Click the calendar icon to open the date picker
    cy.get('.mdi-calendar-clock').click();

    // Verify if the date picker is visible
    cy.get('.v-date-picker').should('be.visible');
  });

  it('selects a date from the date picker', () => {
    mount(MyDatePicker, {
      propsData: {
        modelValue: '2022-12-12',
        clearable: true,
      },
    });

    // Click the calendar icon to open the date picker
    cy.get('.mdi-calendar-clock').click();

    // Select a date, for example, 15th of the month
    cy.get('.v-date-picker-table .v-btn').contains('15').click();

    // Verify if the selected date is reflected in the text field
    cy.get('input[readonly]').should('have.value', '2022-12-15'); // Adjust the date format accordingly
  });

  it('clears the date when the clear button is clicked', () => {
    mount(MyDatePicker, {
      propsData: {
        modelValue: '2022-12-12',
        clearable: true,
      },
    });

    // Click the calendar icon to open the date picker
    cy.get('.mdi-calendar-clock').click();

    // Select a date, for example, 15th of the month
    cy.get('.v-date-picker-table .v-btn').contains('15').click();

    // Clear the date
    cy.get('.v-input__icon--clear .v-icon').click();

    // Verify if the text field is cleared
    cy.get('input[readonly]').should('have.value', '');
  });
});
