import { expect, test } from 'vitest'

import {
    my_round,
    localtime,
} from '@/my_commons'

test('my_round', () => {
    expect(my_round(1.99, 2)).toBe(1.99)
    expect(my_round(1.999, 2)).toBe(2)
    expect(my_round(1.001, 2)).toBe(1)
    expect(my_round("", 2)).toBe(null)
    expect(my_round(0, 2)).toBe(0)
    expect(my_round(null, 2)).toBe(null)
    expect(my_round(NaN, 2)).toBe(null)
})

test('localtime', () => {
    expect(localtime(1.99)).toBe(null)
    expect(localtime("")).toBe(null)
    expect(localtime(0)).toBe(null)
    expect(localtime(null, 2)).toBe(null)
    expect(localtime(NaN, 2)).toBe(null)
    expect(localtime(Date(2023,1,1,1,1, 2))).toBe(null)
    expect(localtime("2016")).toBe(null)
    expect(localtime("2016-10-10T15:35:52.764Z")).toBe("2016-10-10 17:35:52")
    expect(localtime("2023-12-10T15:35:52.764Z")).toBe("2023-12-10 16:35:52")
})
