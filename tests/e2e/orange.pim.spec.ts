import { test, expect } from '@fixtures/ui-fixtures'

test.use({
    storageState: 'storage/.auth/user.json'
})

// Configuration
let totalTargetKaryawan = 5
const jumlahYangDihapus = 4
const namaDepan = 'Mardi'
const namaBelakang = 'Automation'

test('Technical Test Full Flow: Create 5, Delete 4, Verify 1 Remaining', async ({ page, pimPage }) => {
    // STEP 1: Navigate to dashboard
    await test.step('Navigate to dashboard', async () => {
        await page.goto('/web/index.php/dashboard/index')
    })

    // STEP 2: LOOPING TAMBAH 5 KARYAWAN BERGANTIAN
    await test.step('Add 5 employees', async () => {
        for (let i = 0; i < totalTargetKaryawan; i++) {
            await pimPage.navigateToPimMenu()
            await pimPage.addEmployee(namaDepan, namaBelakang)
        }
    })

    // STEP 3: NAVIGASI KE EMPLOYEE LIST & CARI NAMA "MARDI"
    await test.step('Search employee by name', async () => {
        await pimPage.searchEmployeeByName(namaDepan)
    })

    // STEP 4: VALIDASI SEBELUM PROSES HAPUS (TOTAL AWAL HARUS 5 DATA)
    const barisKaryawanMardi = pimPage.getEmployeeRowsLocator(namaDepan)
    await expect(barisKaryawanMardi).toHaveCount(totalTargetKaryawan)

    // STEP 5: SELEKSI 4 DATA MENGGUNAKAN CHECKBOX SECARA DINAMIS
    await test.step('Select multiple checkboxes', async () => {
        await pimPage.selectMultipleCheckboxes(barisKaryawanMardi, jumlahYangDihapus)
    })

    // STEP 6: EKSEKUSI PENGHAPUSAN MASAL & VALIDASI AKHIR
    await test.step('Delete selected rows', async () => {
        await pimPage.deleteSelectedRows()
    })

    // VALIDASI AKHIR: Memastikan baris tabel murni hanya menyisakan TEPAT 1 karyawan bernama Mardi
    await test.step('Validate remaining employee count', async () => {
        await expect(barisKaryawanMardi).toHaveCount(1)
    })
    await page.context().storageState({ path: 'storage/.auth/user.json' })
})

test.afterEach(async ({ page, pimPage }) => {
    // Clean up: hapus employee yang tersisa
    await page.goto('/web/index.php/dashboard/index')
    await pimPage.navigateToPimMenu()

    await pimPage.searchEmployeeByName(namaDepan)
    await pimPage.selectMultipleCheckboxes(pimPage.getEmployeeRowsLocator(namaDepan), (totalTargetKaryawan = 1))
    await pimPage.deleteSelectedRows()
})
