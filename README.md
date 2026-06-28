# orangehrm-playwright-ts

Comprehensive Playwright end-to-end testing patterns with Page Object Model, fixtures, and best practices

# SDET UI Automation Test

## Framework

Projek otomasi pengujian UI ini dibangun menggunakan kombinasi teknologi modern berskala enterprise untuk memastikan performa eksekusi yang cepat dan manajemen kode yang bersih:

- **Framework:** [Playwright Test](https://playwright.dev/)
- **Bahasa Pemrograman:** TypeScript
- **Arsitektur & Pola Desain:** Page Object Model (POM) terintegrasi dengan Custom Fixtures untuk isolasi state dan efisiensi manajemen pengujian dan custom environment.

---

## Cara Menjalankan Test

Ikuti langkah-langkah di bawah ini untuk memasang dependensi dan mengeksekusi test suite pada mesin lokal Anda.

### 1. Prasyarat (Prerequisites)

Pastikan Anda sudah menginstal **Node.js** (versi minimal 18.x atau yang terbaru).

### 2. Instalasi Dependensi

Klon repositori ini, masuk ke direktori utama projek, lalu jalankan perintah berikut untuk menginstal semua library pendukung:

```bash
npm install
npx playwright install
```

### 3. Menjalankan Automation Test

```bash
npx playwright test
```

## Struktur Project

Projek ini menerapkan pemisahan kendali (Separation of Concerns) menggunakan arsitektur POM yang rapi untuk mempermudah pemeliharaan jangka panjang:

## Strategi Locator

Guna menghindari masalah klasik pengujian otomasi seperti test flakiness akibat perubahan kode di sisi front-end, projek ini menerapkan aturan pemilihan locator yang ketat:

Prioritas User-Facing Locators (getByRole, getByPlaceholder, getByText): Menghindari keras penggunaan selektor berbasis CSS class internal (.oxd-input, dsb.) atau XPath absolut yang rapuh. Locator mencari elemen berdasarkan bagaimana pengguna manusia berinteraksi, contohnya mendeteksi judul halaman melalui peran semantiknya di DOM:

```bash
this.page.getByRole('heading', { name: 'Personal Details' })
```

Handling Data dengan Nama Sama
Tantangan mengelola data duplikat dengan nama "Mardi" ditangani secara sistematis tanpa menggunakan hardcoded index atau ID statis lewat alur berikut:

Isolasi Baris Tabel Secara Spesifik: Seluruh baris (cards) tabel yang memuat nama target ditarik menggunakan filter teks dinamis:

TypeScript

```bash
const barisKaryawanMardi = page.locator('.oxd-table-card').filter({ hasText: 'Mardi' });
```

Ekstraksi Array Elemen dengan .all(): List elemen checkbox yang berada di dalam baris spesifik tersebut diekstrak menjadi sebuah array murni JavaScript.

Slicing Target Array: Menggunakan metode .slice(0, 4) untuk mengambil tepat 4 elemen checkbox teratas dari total 5 data yang ada, mengabaikan data terakhir agar tetap aman dari proses hapus.

Looping Seleksi & Eksekusi: Menjalankan loop untuk mencentang ke-4 checkbox tersebut, menekan tombol Delete Selected, dan mengonfirmasi dialog pop-up penghapusan sistem secara massal.

## Assertion

Gerbang validasi berlapis diterapkan di sepanjang jalannya proses eksekusi test untuk menjamin validitas hasil (Anti-False Positive):

Pre-Condition Assertion (Sebelum Hapus): Memvalidasi bahwa proses looping pembuatan 5 data berhasil secara tuntas, dan pencarian awal di tabel menghasilkan total count yang tepat bernilai 5.

TypeScript

```bash
await expect(barisKaryawanMardi).toHaveCount(5);
```

In-Flight UI Assertion (Selama Proses): Memartikan kemunculan Toast Message Successfully Saved setelah setiap individu karyawan didaftarkan, serta memvalidasi perpindahan state halaman ke menu Personal Details sebelum opsi loop berikutnya dijalankan.

Post-Condition Assertion (Sesudah Hapus): Menekan tombol cari ulang pasca-penghapusan untuk menyegarkan tabel, lalu memastikan bahwa total baris data bermuatan nama "Mardi" yang tersisa di layar murni berjumlah tepat 1.

TypeScript

```bash
await expect(barisKaryawanMardi).toHaveCount(1);
```

## Penggunaan AI

Pengembangan skrip ini memanfaatkan bantuan AI secara terarah dan terkontrol untuk meningkatkan struktur efisiensi kode.

```bash
Promt Awal:
Act as senior QA engineer, generate this instructions in Playwright code typescript Login ke sistem OrangeHRM

 Masuk ke menu PIM

 Membuat 5 data karyawan dengan nama yang sama: Mardi
 Mencari seluruh data karyawan bernama Mardi
 Mengidentifikasi data dengan nama yang sama melalui UI
 Memilih data yang akan dihapus menggunakan checkbox
 Menghapus data hingga hanya tersisa tepat 1 data Mardi
 Melakukan validasi sebelum dan sesudah proses delete
 Menyempurnakan script dengan bantuan AI secara terkontrol
 Menjelaskan strategi teknis yang digunakan saat interview

[Pendekatan menggunakan struktur looping while dengan .first()]

Ketentuan khusus:
 Semua proses harus dapat berjalan dalam satu kali running script
 Tidak boleh menghapus data secara asal
 Tidak boleh menggunakan hardcoded selector seperti nth-child
 Tidak boleh menggunakan index statis sebagai cara utama memilih data
 Tidak boleh bergantung pada Employee ID sebagai identifier utama
 Locator harus memanfaatkan text, struktur DOM, dan relasi antar elemen
 Harus ada validasi sebelum dan sesudah proses delete

Prompt:
"Improve this locator not flaky locator('.orangehrm-main-title').filter({ hasText: 'Personal Details' }) and add fixture for login action"

Konteks yang Diberikan: Potongan skrip linear pembuatan dan penghapusan data karyawan di OrangeHRM, beserta struktur dasar Page Object Model (POM).

Output AI: Rekomendasi restrukturisasi locator menggunakan getByRole('heading') serta modul custom fixture loggedInPage untuk mengeliminasi fungsi login manual di file .spec.ts.

Bagian yang Digunakan: \* Arsitektur base.extend untuk menyuntikkan otomasi login pada file fixtures.ts.

Penggantian komponen pencari judul utama halaman menggunakan Accessibility Tree getByRole.

Bagian yang Diperbaiki: Penataan letak import test dan expect pada file test utama yang harus diarahkan secara lokal menuju berkas fixtures.ts milik internal projek, bukan langsung memanggil modul default Playwright.

Bagian yang Ditolak: AI sempat menyarankan penggunaan fungsi penantian jaringan statis page.waitForTimeout(1000) di sela-sela loop hapus. Bagian ini ditolak dan diganti dengan penantian state dinamis page.waitForLoadState('networkidle') yang jauh lebih efisien dan tidak membuang waktu eksekusi (idle time).
```

## Catatan Tambahan

1. Asumsi: Sistem OrangeHRM yang diuji diasumsikan dalam kondisi bersih atau tidak memiliki data bernama "Mardi" buatan user lain sebelum tes berjalan. Jika ada data lama, asersi awal toHaveCount(5) kemungkinan akan mendeteksi jumlah yang berbeda.

2. Future Improvement: Projek ini di masa depan dapat ditingkatkan dengan menambahkan mekanisme API Setup/Teardown (menggunakan request konteks internal Playwright) untuk membuat atau membersihkan data langsung via endpoint backend, sehingga waktu eksekusi UI dapat dipangkas lebih signifikan.
