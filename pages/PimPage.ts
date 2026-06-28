import { Page, Locator, expect } from '@playwright/test'

export class PimPage {
    private readonly page: Page
    private readonly pimSidebarMenu: Locator
    private readonly addEmployeeTab: Locator
    private readonly employeeListTab: Locator
    private readonly firstNameInput: Locator
    private readonly lastNameInput: Locator
    private readonly saveButton: Locator
    private readonly searchButton: Locator
    private readonly deleteSelectedButton: Locator
    private readonly confirmDeleteButton: Locator
    private readonly toastSuccessSave: Locator
    private readonly toastSuccessDelete: Locator
    private readonly personalDetailsHeading: Locator

    constructor(page: Page) {
        this.page = page
        this.pimSidebarMenu = page.locator('.oxd-main-menu-item').filter({ hasText: 'PIM' })
        this.addEmployeeTab = page.locator('.oxd-topbar-body-nav-tab').filter({ hasText: 'Add Employee' })
        this.employeeListTab = page.locator('.oxd-topbar-body-nav-tab').filter({ hasText: 'Employee List' })
        this.firstNameInput = page.getByPlaceholder('First Name')
        this.lastNameInput = page.getByPlaceholder('Last Name')
        this.saveButton = page.getByRole('button', { name: 'Save' })
        this.searchButton = page.getByRole('button', { name: 'Search' })
        this.deleteSelectedButton = page.getByRole('button', { name: 'Delete Selected' })
        this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' })

        this.toastSuccessSave = page.locator('.oxd-toast-content').filter({ hasText: 'Successfully Saved' })
        this.toastSuccessDelete = page.locator('.oxd-toast-content').filter({ hasText: 'Successfully Deleted' })
        this.personalDetailsHeading = page.getByRole('heading', { name: 'Personal Details' })
    }

    async navigateToPimMenu() {
        await this.pimSidebarMenu.click()
        await expect(this.page.getByRole('heading', { name: 'PIM' })).toBeVisible()
    }

    async addEmployee(firstName: string, lastName: string) {
        await this.addEmployeeTab.click()
        await this.firstNameInput.fill(firstName)
        await this.lastNameInput.fill(lastName)
        await this.saveButton.click()

        // Validasi internal page untuk stabilitas loop
        await expect(this.toastSuccessSave).toBeVisible()
        await expect(this.personalDetailsHeading).toBeVisible()
    }

    async searchEmployeeByName(firstName: string) {
        await this.employeeListTab.click()

        const inputNamaKaryawan = this.page
            .locator('.oxd-input-group', { has: this.page.locator('label', { hasText: 'Employee Name' }) })
            .locator('input')
            .first()

        await inputNamaKaryawan.fill(firstName)
        await this.searchButton.click()
        await this.page.waitForLoadState('networkidle')
    }

    // Mengembalikan locator dinamis untuk baris berdasarkan teks nama tertentu
    getEmployeeRowsLocator(firstName: string): Locator {
        return this.page.locator('.oxd-table-card').filter({ hasText: firstName })
    }

    async selectMultipleCheckboxes(employeeRowsLocator: Locator, countToDelete: number) {
        const targetCheckboxes = employeeRowsLocator.locator('.oxd-table-card-cell-checkbox').locator('i')
        const listCheckbox = await targetCheckboxes.all()
        const targetCheckboxYangDihapus = listCheckbox.slice(0, countToDelete)

        for (const checkbox of targetCheckboxYangDihapus) {
            await checkbox.click()
        }
    }

    async deleteSelectedRows() {
        await this.deleteSelectedButton.click()
        await this.confirmDeleteButton.click()
        await expect(this.toastSuccessDelete).toBeVisible()

        // Refresh pencarian pasca hapus demi sinkronisasi UI
        await this.searchButton.click()
        await this.page.waitForLoadState('networkidle')
    }
}
