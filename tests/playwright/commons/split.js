
import { expect } from '@playwright/test';

import {
    v_text_input_settext,
    promise_to_get_response,
    mymenuinline_selection,
    expect_confirm_and_accept_it
} from '../playwright_vuetify.js';



export async function split_add_from_ProductsView(page, before = "1", after = "2", comment = "Test Split") {
    await mymenuinline_selection(page, "ProductsView_MyMenuInline", 2, 0)
    await v_text_input_settext(page, "SplitsCU_Before", before);
    await v_text_input_settext(page, "SplitsCU_After", after);
    await v_text_input_settext(page, "SplitsCU_Comment", comment);
    const promise = promise_to_get_response(page, "/api/splits/", "POST");
    await page.getByTestId('SplitsCU_Button').click();
    const object = await promise
    await expect(page.getByTestId('SplitsCU_Button')).toBeHidden();
    return object
}

export async function split_update_from_ProductsView(page, split, before = "1", after = "2", comment = "Test Split") {
    await expect(page.getByTestId(`TableSplits_ButtonUpdate${split.id}`)).toBeVisible();
    await page.getByTestId(`TableSplits_ButtonUpdate${split.id}`).click();
    await v_text_input_settext(page, "SplitsCU_Before", before);
    await v_text_input_settext(page, "SplitsCU_After", after);
    await v_text_input_settext(page, "SplitsCU_Comment", comment);
    const promise = promise_to_get_response(page, "/api/splits/" + split.id + "/", "PUT");
    await page.getByTestId('SplitsCU_Button').click();
    const object = await promise
    await expect(page.getByTestId('SplitsCU_Button')).toBeHidden();
    return object
}

export async function split_delete_from_ProductsView(page, split) {
    await expect(page.getByTestId(`TableSplits_ButtonDelete${split.id}`)).toBeVisible();
    await page.getByTestId(`TableSplits_ButtonDelete${split.id}`).click();
    await page.getByTestId('SplitsCU_Button').click();
    await expect_confirm_and_accept_it(page);
    await expect(page.getByTestId('SplitsCU_Button')).toBeHidden();
}