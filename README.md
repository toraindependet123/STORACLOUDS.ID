# STORA CLOUDS ID

Aplikasi penyimpanan berkas (demo front-end) dibangun dengan React + TypeScript + Vite + Tailwind CSS.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

## Build produksi

```bash
npm run build
npm run preview
```

## Deploy ke Vercel

1. Push folder ini ke repository GitHub.
2. Di [vercel.com](https://vercel.com), klik **Add New → Project**, lalu import repo tersebut.
3. Vercel akan otomatis mendeteksi framework **Vite** dengan pengaturan:
   - Build Command: `npm run build` (atau `vite build`)
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Klik **Deploy**.

Atau lewat CLI:

```bash
npm i -g vercel
vercel
```

## Catatan penting

Data pengguna dan berkas saat ini disimpan di `localStorage` browser (hanya demo/prototype),
**bukan** database sungguhan — artinya:
- Data hilang jika cache/browser dibersihkan atau pindah perangkat.
- Password disimpan sebagai teks biasa, jangan gunakan untuk data asli/produksi.

Untuk versi produksi sesungguhnya, sambungkan ke backend + database
(misalnya Supabase, Firebase, atau API sendiri) dan hash password sebelum disimpan.
