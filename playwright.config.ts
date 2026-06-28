import { defineConfig } from '@playwright/test'
import { env } from '@utils/env'

export default defineConfig({
    fullyParallel: true,
    timeout: 60_000,
    expect: { timeout: 10_000 },
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['html', { open: 'never' }], ['list']],

    use: {
        trace: 'on-first-retry',
        actionTimeout: 15_000,
        navigationTimeout: 20_000
    },

    projects: [
        // {
        //     name: 'setup',
        //     testMatch: /.*\.setup\.spec\.ts/
        // },
        {
            name: 'UI',
            testDir: './tests',
            use: {
                baseURL: env.BASE_URL,
                browserName: 'chromium',
                headless: env.HEADLESS == 'false',
                screenshot: 'only-on-failure',
                video: 'retain-on-failure'
                // storageState: 'storage/.auth/user.json'
            }
            // dependencies: ['setup']
        }
        // {
        //     name: 'API',
        //     testDir: './tests/api',
        //     use: {
        //         baseURL: env.API_URL,
        //         screenshot: 'only-on-failure'
        //     }
        // }
    ]
})
