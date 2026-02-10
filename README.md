# Sistem Pengelola Nilai Siswa

Aplikasi web untuk mengelola dan menghitung nilai siswa dengan dua cara input: manual dan upload file.

## Fitur-Fitur

### 1. Input Manual
- Masukkan jumlah siswa yang ingin diinput
- Isi nama dan nilai setiap siswa satu per satu
- Hitung otomatis nilai rata-rata kelas dan predikat

### 2. Upload File (BARU!)
- Upload file CSV atau TXT dengan data siswa
- Format: `nama, nilai` (dipisahkan dengan koma atau tab)
- Preview data sebelum memproses
- Drag & drop support

### 3. Export Data
- Export hasil perhitungan ke file CSV
- File berisi tabel nilai, predikat per siswa, dan ringkasan nilai rata-rata kelas

## Cara Menggunakan

### Input Manual
1. Klik tab "Input Manual"
2. Masukkan jumlah siswa pada field
3. Klik tombol "Generate"
4. Isi nama dan nilai setiap siswa
5. Klik "Hitung Nilai Sekarang"

### Upload File
1. Klik tab "Upload File"
2. Upload file CSV atau TXT dengan format sbb:
   ```
   Ahmad,85
   Budi,92
   Citra,78
   Dewi,88
   ```
3. Preview data akan muncul otomatis
4. Klik "Gunakan Data Ini" untuk memproses
5. Klik "Hitung Nilai Sekarang"

### Export Data
1. Setelah menghitung nilai, klik "Export ke CSV"
2. File akan didownload otomatis dengan format tabel lengkap

## Format File yang Didukung

- **CSV** (.csv)
- **Text** (.txt)
- Delimiter: Koma (,) atau Tab

## Contoh File

Lihat file `contoh_data.csv` untuk melihat format yang benar.

## Kriteria Predikat

- **A**: Nilai >= 85
- **B**: Nilai 70-84
- **C**: Nilai 55-69
- **D**: Nilai < 55

## Persyaratan

- Browser modern dengan JavaScript support
- File CSV atau TXT untuk upload (opsional)

## Catatan

- Nilai harus antara 0-100
- MINIMAL 50 SISWA SAJA AGAR BROWSER TIDAK LAG
- Semua data diproses di browser (tidak disimpan di server)
