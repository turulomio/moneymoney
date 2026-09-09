import { expect, test, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { percentage_generic_html } from '@/functions'
import { currency_generic_html } from '@/store'

beforeEach(() => {
  setActivePinia(createPinia())
})


test("percentage_generic_html", () =>{
  expect( percentage_generic_html(NaN, "es", 2)).toBe("<span class='vuered'>- - - %</span>")
})

test("currency_generic_html", () => {
  expect(currency_generic_html(NaN, "EUR", "es", 2)).toBe("- - - ???")
})

