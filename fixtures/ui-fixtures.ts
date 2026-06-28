import { test as base } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { PimPage } from '../pages/PimPage'

// 1. Definisikan tipe untuk fixture kita
type MyFixtures = {
    loginPage: LoginPage
    pimPage: PimPage
}

// 2. Extend base test dari Playwright
export const test = base.extend<MyFixtures>({
    // Fixture untuk LoginPage
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page))
    },

    // Fixture untuk PimPage standar
    pimPage: async ({ page }, use) => {
        await use(new PimPage(page))
    }
})

export { expect } from '@playwright/test'
