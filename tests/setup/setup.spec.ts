import { test as setup } from '@fixtures/ui-fixtures'
import { env } from '@utils/env'

setup('authenticate', async ({ page, loginPage }) => {
    await loginPage.goto()
    await loginPage.login(env.ORANGEHRM_USERNAME, env.ORANGEHRM_PASSWORD)

    // Save authentication state
    await page.context().storageState({ path: 'storage/.auth/user.json' })
})
