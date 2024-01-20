import { expect, test } from 'vitest'
import { percentage_generic_html, currency_generic_html } from '@/functions'


test("percentage_generic_html",() =>{
  expect( percentage_generic_html(NaN, "es", 2)).toBe("<span class='vuered'>- - - %</span>")
})

test("currency_generic_html",() =>{
  expect( currency_generic_html(NaN, "es", 2)).toBe("<span class='vuered'>- - - %</span>")
})

