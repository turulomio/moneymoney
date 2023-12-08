import { isNullOrEmpty } from "@/rules"

import { expect, test } from 'vitest'

test('isNullOrEmpty', () => {
    expect(isNullOrEmpty("")).toBe(true)
    expect(isNullOrEmpty(null)).toBe(true)
    expect(isNullOrEmpty(12)).toBe(false)
})
