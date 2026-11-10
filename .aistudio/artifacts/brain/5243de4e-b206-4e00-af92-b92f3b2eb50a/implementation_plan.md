# Galaksi Sains: Penambahbaikan Misi Bulan & Eksplorasi Angkasa

Pelan pelaksanaan ini memperincikan penambahbaikan mekanik permainan untuk **Misi Bulan (Lunar Rush)** dan **Eksplorasi Angkasa (Galaxy Explorer)** berasaskan DSKP Sains KSSR Tahun 5 Unit 9 (Fasa Bulan dan Buruj), dengan memastikan permainan kekal interaktif, mesra sentuhan dan lancar pada pelbagai peranti.

## Keputusan Kritikal Pengguna (User Review & Confirmed Choices)

> [!IMPORTANT]
> Berdasarkan jawapan balas sesi soal jawab (Phase 1):
> - **Durasi Lunar Rush**: Ditetapkan sekitar 30 hingga 45 saat larian aktif bagi setiap checkpoint (jumlah ~3.5 hingga 5 minit untuk 7 checkpoint).
> - **Halangan Lunar Rush**: Semua objek rintangan (batu, meteor, penghadang laser) dibuang sepenuhnya; hanya pengumpulan bintang bercahaya merentasi 3 lorong dikekalkan.
> - **Misi Objek Tersembunyi (Checkpoint 1 & 2 Eksplorasi Angkasa)**: Murid perlu mencari 3 alatan sains angkasa yang tersembunyi dalam pemandangan stesen/bulan sebelum soalan DSKP dibuka.
> - **Sambung Titik Bintang Buruj (Checkpoint 3 & 4 Eksplorasi Angkasa)**: Murid menyambungkan titik bintang mengikut urutan nombor bagi membentuk Buruj Biduk, Pari, Belantik, atau Skorpio sebelum soalan dibuka.
> - **Permainan Memori Padanan Imej (Checkpoint 5, 6 & 7 Eksplorasi Angkasa)**: Murid membalikkan pasangan kad bergambar (fasa bulan, buruj dan kegunaan penunjuk arah/musim) sebelum soalan dibuka.

---

## 1. Gambaran Keseluruhan & Konsep Teras

- **Misi Bulan (Lunar Rush)**: Menjadi mod larian angkasa 3-lorong yang menyeronokkan, lancar dan menenangkan. Murid fokus mengutip bintang tenaga dan menikmati perjalanan visual ke stesen penyelidikan tanpa rasa kecewa akibat terlanggar halangan.
- **Eksplorasi Angkasa (Galaxy Explorer)**: Mengekalkan peta 7 planet/stesen dengan gabungan 3 jenis permainan mini interaktif baharu sebelum murid menjawab soalan fakta DSKP:
  1. *Stesen 1 & 2*: **Misi Objek Tersembunyi (Hidden Object Hunt)** — mencari 3 alatan sains angkasa.
  2. *Stesen 3 & 4*: **Penyambung Bintang Buruj (Constellation Star Connector)** — melakar garisan buruj mengikut titik bintang.
  3. *Stesen 5, 6 & 7*: **Memori Padanan Imej (Card Flip Matching Pairs)** — memadankan kad gambar fasa bulan dan buruj.
- **Sasaran**: Murid Tahun 5 (11 tahun) dengan reka bentuk responsif untuk komputer riba, tablet, dan telefon pintar.

---

## 2. Pengalaman Pengguna & Reka Bentuk Visual

### Aliran Pengguna Mengikut Mod

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ALIRAN INTERAKSI PERMAINAN                      │
└────────────────────────────────────────────────────────────────────────┘

[LUNAR RUSH]
   Larian 3-Lorong (35s) ──> Kutip Bintang ──> Tiba di Stesen Pod ──> Soalan DSKP ──> Checkpoint Seterusnya

[EKSPLORASI ANGKASA]
   Peta Galaksi 7 Planet
       │
       ├── Checkpoint 1 & 2 ──> Mini-Game 1: Cari 3 Objek Tersembunyi ──> Soalan DSKP 1 & 2
       │
       ├── Checkpoint 3 & 4 ──> Mini-Game 2: Sambung Titik Buruj ───────> Soalan DSKP 3 & 4
       │
       └── Checkpoint 5, 6, 7 ─> Mini-Game 3: Kad Memori Suai Padan ────> Soalan DSKP 5, 6, 7
```

### Reka Bentuk Visual & UI

- **Misi Objek Tersembunyi**: Pemandangan ilustrasi angkasa yang kemas dengan senarai 3 objek sasaran di bahagian bawah (cth: Teleskop Angkasa, Satelit, Sut Angkasa). Apabila disentuh, objek bercahaya dan mengeluarkan bunyi 'ding' dengan kaunter 1/3, 2/3, 3/3.
- **Penyambung Titik Buruj**: Kanvas interaktif berlatarbelakangkan nebula malam. Titik bintang bernombor (1, 2, 3...) yang bersinar. Murid menyentuh atau meleret dari bintang ke bintang; garisan neon biru/emas dilukis dengan animasi berkilauan sehingga corak buruj lengkap.
- **Memori Suai Padan**: Grid kad 2x3 atau 2x4 dengan reka bentuk kad angkasa futuristik. Animasi selak 3D CSS pantas (`transform: rotateY`). Apabila padanan tepat ditemui, kad bertukar hijau lembut dan kekal terbuka.
- **Lunar Rush**: Pemandangan perspektif 3D 3-lorong dengan bintang emas berputar di ketiga-tiga lorong. Kaunter jarak diselaraskan ke ~35 saat larian bagi setiap stesen.

---

## 3. Strategi Teknikal & Pelaksanaan

### A. Komponen `LunarRush.tsx`
- **Jarak Checkpoint**: Laraskan `CHECKPOINT_DISTANCE` dan kelajuan larian supaya satu pusingan mengambil masa 30–45 saat.
- **Pembersihan Halangan**: Buang jenis item `rock`, `meteor`, dan `barrier` daripada penjana `spawnTimer`.
- **Penjanaan Bintang**: Jana bintang emas secara berterusan dalam susunan lorong (kiri, tengah, kanan) dan corak garisan berturut-turut untuk murid kutip dengan lancar.
- **Kawalan**: Sokongan sentuhan swipe (kiri/kanan/lompat) dan papan kekunci (A/D, Arrow Left/Right).

### B. Komponen `GalaxyExplorer.tsx`
- **Integrasi Mini-Game Bersepadu**:
  - `HiddenObjectGame.tsx`: Komponen untuk Checkpoint 1 & 2 dengan 3 item interaktif berasaskan koordinat responsif (peratusan skrin).
  - `ConstellationConnectGame.tsx`: Komponen untuk Checkpoint 3 (Buruj Biduk/Pari) dan Checkpoint 4 (Buruj Belantik/Skorpio) menggunakan titik SVG interaktif dengan garisan bersambung.
  - `ImageMatchMemoryGame.tsx`: Komponen untuk Checkpoint 5, 6, dan 7 dengan kad memori interaktif berasaskan fasa bulan dan buruj.
- **Peralihan Lancar**: Setiap kali mini-game selesai, bunyi kejayaan dimainkan dan `QuestionModal` sedia ada dibuka tanpa merosakkan skor atau status simpanan pemain.

### C. Pemeliharaan Kandungan DSKP
- Semua 7 soalan, pilihan jawapan, dan penjelasan fakta buku teks dalam `src/data/learningContent.ts` dikekalkan 100% tanpa sebarang perubahan fakta saintifik.

---

## 4. Pelan Verifikasi & Pengujian
1. **Uji Larian Lunar Rush**: Sahkan jarak masa 30–45 saat, tiada objek halangan yang muncul, dan kutipan bintang berfungsi lancar merentasi 3 lorong.
2. **Uji Eksplorasi Angkasa**:
   - Stesen 1 & 2: Mengesan klik objek tersembunyi pada skrin sentuh dan tetikus.
   - Stesen 3 & 4: Menyambung titik bintang secara berturutan dan membuka soalan dengan betul.
   - Stesen 5, 6 & 7: Padanan kad memori dengan animasi selak dan logik semakan pasangan.
3. **Penyusunan & Pemeriksaan Kod**: Jalankan `compile_applet` dan `lint_applet` untuk memastikan tiada sebarang ralat sintaksis atau regresi.
