import { test, expect } from '@fixtures/ui-fixtures'
import { env } from '@utils/env'

test('Technical Test Full Flow: Create 5, Delete 4, Verify 1 Remaining', async ({ loginPage, pimPage }) => {
    const totalTargetKaryawan = 5
    const jumlahYangDihapus = 4
    const namaDepan = 'Mardi'
    const namaBelakang = 'Autot'

    // STEP 1: LOGIN KE SISTEM ORANGEHRM
    await loginPage.goto()
    await loginPage.login(env.USERNAME, env.PASSWORD)

    // STEP 2: LOOPING TAMBAH 5 KARYAWAN BERGANTIAN
    for (let i = 0; i < totalTargetKaryawan; i++) {
        await pimPage.navigateToPimMenu()
        await pimPage.addEmployee(namaDepan, namaBelakang)
    }

    // STEP 3: NAVIGASI KE EMPLOYEE LIST & CARI NAMA "MARDI"
    await pimPage.searchEmployeeByName(namaDepan)

    // STEP 4: VALIDASI SEBELUM PROSES HAPUS (TOTAL AWAL HARUS 5 DATA)
    const barisKaryawanMardi = pimPage.getEmployeeRowsLocator(namaDepan)
    await expect(barisKaryawanMardi).toHaveCount(totalTargetKaryawan)

    // STEP 5: SELEKSI 4 DATA MENGGUNAKAN CHECKBOX SECARA DINAMIS
    await pimPage.selectMultipleCheckboxes(barisKaryawanMardi, jumlahYangDihapus)

    // STEP 6: EKSEKUSI PENGHAPUSAN MASAL & VALIDASI AKHIR
    await pimPage.deleteSelectedRows()

    // VALIDASI AKHIR: Memastikan baris tabel murni hanya menyisakan TEPAT 1 karyawan bernama Mardi
    await expect(barisKaryawanMardi).toHaveCount(1)
})
