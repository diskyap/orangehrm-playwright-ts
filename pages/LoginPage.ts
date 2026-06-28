import { Page, Locator, expect } from '@playwright/test'

export class LoginPage {
    private readonly page: Page
    private readonly usernameInput: Locator
    private readonly passwordInput: Locator
    private readonly loginButton: Locator
    private readonly dashboardHeading: Locator

    constructor(page: Page) {
        style: this.page = page
        this.usernameInput = page.getByPlaceholder('Username')
        this.passwordInput = page.getByPlaceholder('Password')
        this.loginButton = page.getByRole('button', { name: 'Login' })
        this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' })
    }

    async goto() {
        await this.page.goto('/')
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username)
        await this.passwordInput.fill(password)
        await this.loginButton.click()
        await expect(this.dashboardHeading).toBeVisible()
    }
}
