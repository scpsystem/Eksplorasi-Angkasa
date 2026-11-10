import { CheckpointQuestion } from '../types/game';

// 7 Checkpoints for Misi 1: Lunar Rush (Fasa Bulan)
export const LUNAR_RUSH_QUESTIONS: CheckpointQuestion[] = [
  {
    id: 1,
    title: 'Checkpoint 1: Cahaya Bulan',
    topic: 'fasa_bulan',
    standardLearning: 'SP 9.1.1',
    questionText: 'Adakah Bulan mengeluarkan cahayanya sendiri seperti Matahari? Apakah yang menyebabkan Bulan kelihatan bercahaya pada waktu malam?',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Bulan menghasilkan cahaya sendiri melalui pembakaran gas hidrogen.' },
      { id: 'b', text: 'Bulan tidak mengeluarkan cahaya sendiri, tetapi memantulkan cahaya Matahari.' },
      { id: 'c', text: 'Bulan memancarkan cahaya kerana ia sangat dekat dengan atmosfera Bumi.' },
      { id: 'd', text: 'Bulan menyimpan cahaya Matahari pada waktu siang dan menyalakannya pada waktu malam.' }
    ],
    correctOptionId: 'b',
    explanation: 'Bulan tidak mengeluarkan cahayanya sendiri. Bulan kelihatan bercahaya kerana permukaannya bertindak seperti cermin yang memantulkan cahaya Matahari ke arah Bumi. (Buku Teks ms. 200)',
    factSource: 'Buku Teks Sains Tahun 5, Unit 9, Halaman 200',
    points: 100
  },
  {
    id: 2,
    title: 'Checkpoint 2: Arah Pergerakan Bulan',
    topic: 'fasa_bulan',
    standardLearning: 'SP 9.1.2',
    questionText: 'Bulan berputar pada paksinya dan pada masa yang sama beredar mengelilingi Bumi. Bagaimanakah arah putaran dan peredaran Bulan?',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Mengikut arah pusingan jam (arah jam).' },
      { id: 'b', text: 'Bulan berputar ikut arah jam tetapi beredar lawan arah jam.' },
      { id: 'c', text: 'Arah putaran dan peredaran Bulan adalah sama, iaitu mengikut arah lawan jam.' },
      { id: 'd', text: 'Bulan tidak mempunyai arah yang tetap, ia bergerak secara rawak.' }
    ],
    correctOptionId: 'c',
    explanation: 'Arah putaran Bulan pada paksinya dan arah peredaran Bulan mengelilingi Bumi adalah sama, iaitu kedua-duanya bergerak mengikut arah lawan jam. (Buku Teks ms. 201-202)',
    factSource: 'Buku Teks Sains Tahun 5, Unit 9, Halaman 202',
    points: 100
  },
  {
    id: 3,
    title: 'Checkpoint 3: Tempoh Pergerakan Bulan',
    topic: 'fasa_bulan',
    standardLearning: 'SP 9.1.2',
    questionText: 'Lengkapkan pernyataan tentang tempoh pergerakan Bulan dan permukaannya:',
    type: 'fill_blank',
    blankSentence: {
      before: 'Tempoh putaran Bulan pada paksinya ialah ',
      after: ' dan tempoh peredaran Bulan mengelilingi Bumi juga sama. Oleh sebab tempoh kedua-dua pergerakan ini sama, maka permukaan Bulan yang sama sentiasa menghadap Bumi.',
      options: ['24 jam', '27 1/3 hari', '365 1/4 hari', '30 hari'],
      correctAnswer: '27 1/3 hari'
    },
    explanation: 'Tempoh putaran Bulan pada paksinya ialah 27 1/3 hari dan tempoh peredaran Bulan mengelilingi Bumi juga 27 1/3 hari. Kesamaan tempoh ini menyebabkan permukaan bulan yang sama sentiasa menghadap Bumi! (Buku Teks ms. 202)',
    factSource: 'Buku Teks Sains Tahun 5, Unit 9, Halaman 202',
    points: 100
  },
  {
    id: 4,
    title: 'Checkpoint 4: Susunan Fasa Bulan',
    topic: 'fasa_bulan',
    standardLearning: 'SP 9.1.3',
    questionText: 'Susun urutan fasa Bulan bermula dari awal kitaran Takwim Qamari sehingga fasa Bulan Purnama mengikut turutan yang betul:',
    type: 'order_sequence',
    sequenceItems: [
      { id: 'seq_1', name: '1. Anak Bulan', visualType: 'new_moon' },
      { id: 'seq_2', name: '2. Bulan Sabit', visualType: 'crescent' },
      { id: 'seq_3', name: '3. Bulan Separa', visualType: 'half_moon' },
      { id: 'seq_4', name: '4. Bulan Hampir Purnama', visualType: 'gibbous' },
      { id: 'seq_5', name: '5. Bulan Purnama', visualType: 'full_moon' }
    ],
    correctSequenceIds: ['seq_1', 'seq_2', 'seq_3', 'seq_4', 'seq_5'],
    explanation: 'Urutan fasa Bulan dalam separuh edaran pertama Takwim Qamari bermula dari Anak Bulan -> Bulan Sabit -> Bulan Separa -> Bulan Hampir Purnama -> Bulan Purnama. (Buku Teks ms. 204-205)',
    factSource: 'Buku Teks Sains Tahun 5, Unit 9, Halaman 204-205',
    points: 120
  },
  {
    id: 5,
    title: 'Checkpoint 5: Padanan Gambar Fasa Bulan',
    topic: 'fasa_bulan',
    standardLearning: 'SP 9.1.3',
    questionText: 'Padankan nama fasa Bulan dengan penerangan keadaan permukaannya yang disinari cahaya matahari menghadap Bumi:',
    type: 'match_pairs',
    matchPairs: [
      { left: 'Anak Bulan', right: 'Bahagian Bulan yang gelap menghadap Bumi', leftId: 'm1', rightId: 'm1' },
      { left: 'Bulan Sabit', right: 'Sebahagian kecil permukaan bulan disinari cahaya menghadap Bumi', leftId: 'm2', rightId: 'm2' },
      { left: 'Bulan Separa', right: 'Separuh bahagian permukaan bulan disinari cahaya menghadap Bumi', leftId: 'm3', rightId: 'm3' },
      { left: 'Bulan Purnama', right: 'Keseluruhan bahagian permukaan bulan disinari cahaya menghadap Bumi', leftId: 'm4', rightId: 'm4' }
    ],
    explanation: 'Setiap fasa Bulan memaparkan pecahan permukaan bercahaya yang berbeza: Anak Bulan (gelap sepenuhnya), Bulan Sabit (sebahagian kecil), Bulan Separa (separuh), dan Bulan Purnama (keseluruhan disinari). (Buku Teks ms. 204-205)',
    factSource: 'Buku Teks Sains Tahun 5, Unit 9, Halaman 204-205',
    points: 120
  },
  {
    id: 6,
    title: 'Checkpoint 6: Takwim Qamari & Fasa Bulan',
    topic: 'fasa_bulan',
    standardLearning: 'SP 9.1.3',
    questionText: 'Takwim Qamari (Takwim Hijrah) ditentukan berdasarkan perubahan fasa Bulan. Fasa bulan apakah yang SENTIASA muncul pada pertengahan bulan (15 haribulan) dalam Takwim Qamari?',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Anak Bulan (Bulan gelap sepenuhnya)' },
      { id: 'b', text: 'Bulan Sabit (Bentuk lengkung sabit)' },
      { id: 'c', text: 'Bulan Purnama (Bulatan penuh bercahaya terang)' },
      { id: 'd', text: 'Bulan Separa (Separuh bulatan)' }
    ],
    correctOptionId: 'c',
    explanation: 'Pada 15 haribulan Takwim Qamari, fasa Bulan Purnama sentiasa muncul di langit malam. Hari pertama (1 haribulan) pula ditandakan setelah anak bulan kelihatan. (Buku Teks ms. 206)',
    factSource: 'Buku Teks Sains Tahun 5, Unit 9, Halaman 206',
    points: 100
  },
  {
    id: 7,
    title: 'Checkpoint 7: Mengapa Fasa Bulan Berlaku?',
    topic: 'fasa_bulan',
    standardLearning: 'SP 9.1.4',
    questionText: 'Mengapakah bentuk Bulan kelihatan berbeza-beza pada malam-malam yang berlainan dari pandangan pemerhati di Bumi?',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Kerana saiz sebenar Bulan mengembang dan mengecut setiap minggu.' },
      { id: 'b', text: 'Kerana bayang-bayang planet lain menghalang pandangan kita ke arah Bulan.' },
      { id: 'c', text: 'Kerana semasa Bulan beredar mengelilingi Bumi, kedudukan Bulan berubah menyebabkan kawasan bercahaya yang menghadap Bumi kelihatan berbeza.' },
      { id: 'd', text: 'Kerana awan tebal di langit menutupi sebahagian bentuk fizikal Bulan.' }
    ],
    correctOptionId: 'c',
    explanation: 'Semasa Bulan beredar mengelilingi Bumi, kedudukan Bulan berubah dengan masa. Ini menyebabkan kita melihat bahagian berbeza pada Bulan yang disinari oleh cahaya Matahari. (Buku Teks ms. 204-205)',
    factSource: 'Buku Teks Sains Tahun 5, Unit 9, Halaman 204',
    points: 110
  }
];

// 7 Checkpoints for Misi 2: Star Quest (Buruj)
export const STAR_QUEST_QUESTIONS: CheckpointQuestion[] = [
  {
    id: 1,
    title: 'Bintang 1: Maksud Buruj',
    topic: 'buruj',
    standardLearning: 'SP 9.2.1',
    questionText: 'Apakah maksud saintifik bagi istilah "BURUJ"?',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Satelit buatan manusia yang mengorbit di ruang angkasa lepas.' },
      { id: 'b', text: 'Gugusan bintang yang kelihatan membentuk corak tertentu di langit pada waktu malam.' },
      { id: 'c', text: 'Planet-planet yang berbaris selari di dalam Sistem Suria.' },
      { id: 'd', text: 'Koleksi debu dan gas yang terbakar di lapisan mesosfera Bumi.' }
    ],
    correctOptionId: 'b',
    explanation: 'Buruj ialah gugusan bintang yang kelihatan membentuk corak tertentu di langit pada waktu malam. Corak ini membantu pemerhati mengenal pasti bintang di langit. (Buku Teks ms. 209)',
    factSource: 'Buku Teks Sains Tahun 5, Unit 9, Halaman 209',
    points: 100
  },
  {
    id: 2,
    title: 'Bintang 2: Corak Bentuk 4 Buruj',
    topic: 'buruj',
    standardLearning: 'SP 9.2.2',
    questionText: 'Padankan 4 buruj utama dengan bentuk corak khasnya seperti yang diterangkan dalam buku teks:',
    type: 'match_pairs',
    matchPairs: [
      { left: 'Buruj Biduk', right: 'Corak seperti gayung atau senduk', leftId: 'b1', rightId: 'b1' },
      { left: 'Buruj Belantik', right: 'Corak seperti pemburu memakai tali pinggang & memegang senjata', leftId: 'b2', rightId: 'b2' },
      { left: 'Buruj Pari', right: 'Corak seperti layang-layang (paling kecil)', leftId: 'b3', rightId: 'b3' },
      { left: 'Buruj Skorpio', right: 'Corak seperti seekor kala jengking', leftId: 'b4', rightId: 'b4' }
    ],
    explanation: 'Biduk menyerupai gayung/senduk, Belantik menyerupai pemburu bertali pinggang, Pari menyerupai layang-layang, dan Skorpio menyerupai kala jengking. (Buku Teks ms. 210)',
    factSource: 'Buku Teks Sains Tahun 5, Unit 9, Halaman 210',
    points: 120
  },
  {
    id: 3,
    title: 'Bintang 3: Ciri Buruj Pari',
    topic: 'buruj',
    standardLearning: 'SP 9.2.2',
    questionText: 'Apakah keistimewaan Buruj Pari dan berapakah bilangan bintang yang membentuk gugusannya?',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Buruj paling besar dengan 12 bintang.' },
      { id: 'b', text: 'Buruj yang paling kecil dan terdiri daripada gugusan empat bintang.' },
      { id: 'c', text: 'Buruj yang hanya terdiri daripada satu bintang besar.' },
      { id: 'd', text: 'Buruj yang terbentuk daripada gugusan tujuh bintang dan berbentuk beruang.' }
    ],
    correctOptionId: 'b',
    explanation: 'Buruj Pari merupakan buruj yang paling kecil di langit malam dan terdiri daripada gugusan empat bintang yang membentuk corak seperti layang-layang. (Buku Teks ms. 210)',
    factSource: 'Buku Teks Sains Tahun 5, Unit 9, Halaman 210',
    points: 100
  },
  {
    id: 4,
    title: 'Bintang 4: Ciri-Ciri Buruj Biduk',
    topic: 'buruj',
    standardLearning: 'SP 9.2.2',
    questionText: 'Pilih pernyataan yang BENAR mengenai Buruj Biduk berdasarkan maklumat buku teks:',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Terbentuk daripada 7 bintang, berbentuk gayung/senduk, dan merupakan sebahagian daripada buruj Ursa Major (Beruang Besar).' },
      { id: 'b', text: 'Hanya boleh dilihat di hemisfera selatan pada waktu musim menuai sahaja.' },
      { id: 'c', text: 'Berbentuk seperti kala jengking dengan sengat berbisa.' },
      { id: 'd', text: 'Terdiri daripada 4 bintang dan sentiasa menunjuk ke arah selatan.' }
    ],
    correctOptionId: 'a',
    explanation: 'Buruj Biduk terbentuk daripada gugusan 7 bintang, membentuk corak gayung atau senduk, dan merupakan sebahagian daripada buruj Ursa Major (Beruang Besar) yang kelihatan di hemisfera utara. (Buku Teks ms. 209-210)',
    factSource: 'Buku Teks Sains Tahun 5, Unit 9, Halaman 209-210',
    points: 100
  },
  {
    id: 5,
    title: 'Bintang 5: Buruj Sebagai Petunjuk Arah',
    topic: 'buruj',
    standardLearning: 'SP 9.2.3',
    questionText: 'Lengkapkan pernyataan tentang kegunaan buruj sebagai kompas alam untuk menentukan arah pengembara:',
    type: 'fill_blank',
    blankSentence: {
      before: 'Buruj Biduk sentiasa menunjuk ke arah ',
      after: ', manakala Buruj Pari pula sentiasa menunjuk ke arah Selatan.',
      options: ['Utara', 'Timur', 'Barat', 'Tenggara'],
      correctAnswer: 'Utara'
    },
    explanation: 'Buruj Biduk digunakan oleh pelayar dan pengembara untuk menentukan arah UTARA, manakala Buruj Pari digunakan untuk menunjukkan arah SELATAN. (Buku Teks ms. 211)',
    factSource: 'Buku Teks Sains Tahun 5, Unit 9, Halaman 211',
    points: 100
  },
  {
    id: 6,
    title: 'Bintang 6: Buruj Sebagai Petunjuk Musim',
    topic: 'buruj',
    standardLearning: 'SP 9.2.3',
    questionText: 'Pada zaman dahulu sebelum kalendar dicipta, petani memerhatikan buruj untuk merancang kerja pertanian. Padankan buruj dengan petunjuk musimnya:',
    type: 'match_pairs',
    matchPairs: [
      { left: 'Buruj Biduk', right: 'Petunjuk musim menanam gandum', leftId: 's1', rightId: 's1' },
      { left: 'Buruj Skorpio', right: 'Petunjuk musim menuai hasil tanaman', leftId: 's2', rightId: 's2' },
      { left: 'Buruj Belantik', right: 'Petunjuk ketibaan musim sejuk', leftId: 's3', rightId: 's3' }
    ],
    explanation: 'Buruj Biduk = Petunjuk musim menanam; Buruj Skorpio = Petunjuk musim menuai; Buruj Belantik = Petunjuk musim sejuk. (Buku Teks ms. 212)',
    factSource: 'Buku Teks Sains Tahun 5, Unit 9, Halaman 212',
    points: 120
  },
  {
    id: 7,
    title: 'Bintang 7: Kedudukan Hemisfera Buruj',
    topic: 'buruj',
    standardLearning: 'SP 9.2.1',
    questionText: 'Buruj manakah yang istimewa kerana dapat dilihat di kedua-dua hemisfera, iaitu di antara hemisfera utara dengan hemisfera selatan?',
    type: 'multiple_choice',
    options: [
      { id: 'a', text: 'Buruj Pari (hanya di hemisfera selatan)' },
      { id: 'b', text: 'Buruj Biduk (hanya di hemisfera utara)' },
      { id: 'c', text: 'Buruj Belantik (dapat dilihat di antara hemisfera utara dengan hemisfera selatan)' },
      { id: 'd', text: 'Buruj Skorpio (hanya di hemisfera selatan)' }
    ],
    correctOptionId: 'c',
    explanation: 'Buruj Belantik boleh dilihat di antara hemisfera utara dengan hemisfera selatan. Buruj Biduk dilihat di hemisfera utara, manakala Buruj Pari dan Skorpio dilihat di hemisfera selatan. (Buku Teks ms. 209)',
    factSource: 'Buku Teks Sains Tahun 5, Unit 9, Halaman 209',
    points: 110
  }
];

// 7 Checkpoints for Misi 3: Galaxy Explorer (Pengembaraan Galaksi)
export const GALAXY_EXPLORER_CHECKPOINTS = [
  {
    step: 1,
    name: 'Stesen Angkasa Alpha',
    subtitle: 'Pengenalan & Ujian Kelayakan Angkasawan',
    topicType: 'stesen' as const,
    standardLearning: 'SP 9.1.1 & SP 9.2.1',
    description: 'Bulan adalah satelit semula jadi Bumi yang memantulkan cahaya Matahari, dan buruj adalah corak gugusan bintang di langit malam.',
    challengeTitle: 'Cabaran 1: Ujian Kelayakan Angkasawan',
    questionText: 'Pilih kenyataan yang saintifik dan TEPAT tentang Bulan dan Buruj:',
    type: 'multiple_choice' as const,
    options: [
      { id: 'a', text: 'Bulan menghasilkan tenaga nuklear sendiri dan buruj adalah kumpulan planet berdekatan.' },
      { id: 'b', text: 'Bulan adalah satelit semula jadi yang memantulkan cahaya Matahari, manakala buruj adalah gugusan bintang yang membentuk corak tertentu.' },
      { id: 'c', text: 'Bulan dan buruj kedua-duanya beredar mengelilingi Matahari dalam orbit yang sama.' },
      { id: 'd', text: 'Bulan hanya wujud pada separuh bulan pertama sahaja.' }
    ],
    correctOptionId: 'b',
    explanation: 'Bulan ialah satelit semula jadi paling cerah yang memantulkan cahaya Matahari. Buruj pula ialah gugusan bintang yang kelihatan membentuk corak tertentu pada waktu malam. (Buku Teks ms. 199-209)',
    points: 100
  },
  {
    step: 2,
    name: 'Zon Bulan',
    subtitle: 'Cahaya & Pergerakan Bulan',
    topicType: 'bulan' as const,
    standardLearning: 'SP 9.1.2',
    description: 'Menguji kefahaman dinamik putaran paksi dan peredaran Bulan mengelilingi Bumi.',
    challengeTitle: 'Cabaran 2: Dinamik Putaran & Peredaran',
    questionText: 'Apakah dua fakta penting tentang pergerakan Bulan yang betul?',
    type: 'multiple_choice' as const,
    options: [
      { id: 'a', text: 'Arah pergerakan ikut arah jam dan tempoh putaran 365 hari.' },
      { id: 'b', text: 'Bulan berputar dan beredar mengikut arah lawan jam, kedua-duanya mengambil masa 27 1/3 hari.' },
      { id: 'c', text: 'Bulan hanya berputar tetapi tidak beredar mengelilingi Bumi.' },
      { id: 'd', text: 'Tempoh putaran Bulan berbeza dengan tempoh peredarannya.' }
    ],
    correctOptionId: 'b',
    explanation: 'Bulan berputar pada paksinya dan beredar mengelilingi Bumi mengikut arah lawan jam. Kedua-duanya mengambil masa tepat 27 1/3 hari! (Buku Teks ms. 201-202)',
    points: 100
  },
  {
    step: 3,
    name: 'Zon Fasa Bulan',
    subtitle: 'Kitaran Fasa & Takwim Qamari',
    topicType: 'bulan' as const,
    standardLearning: 'SP 9.1.3',
    description: 'Menyusun urutan lengkap kitaran fasa Bulan dan hubungannya dengan Takwim Hijrah.',
    challengeTitle: 'Cabaran 3: Rekod Takwim Qamari',
    questionText: 'Susun fasa Bulan mengikut kemunculannya dalam kitaran Takwim Qamari:',
    type: 'order_sequence' as const,
    sequenceItems: [
      { id: 'gz_1', name: 'Anak Bulan (Awal Bulan Qamari)' },
      { id: 'gz_2', name: 'Bulan Sabit (Hari 3-6)' },
      { id: 'gz_3', name: 'Bulan Separa (Hari 7-10)' },
      { id: 'gz_4', name: 'Bulan Hampir Purnama (Hari 11-13)' },
      { id: 'gz_5', name: 'Bulan Purnama (Hari 14-16 Pertengahan Bulan)' }
    ],
    correctSequenceIds: ['gz_1', 'gz_2', 'gz_3', 'gz_4', 'gz_5'],
    explanation: 'Takwim Qamari bermula dengan Anak Bulan, diikuti Bulan Sabit, Bulan Separa, Bulan Hampir Purnama, dan mencapai Bulan Purnama pada hari ke-15! (Buku Teks ms. 204-206)',
    points: 130
  },
  {
    step: 4,
    name: 'Zon Buruj',
    subtitle: 'Morfologi 4 Buruj Utama',
    topicType: 'buruj' as const,
    standardLearning: 'SP 9.2.2',
    description: 'Mengenal pasti corak bentuk 4 buruj utama: Biduk, Belantik, Pari, dan Skorpio.',
    challengeTitle: 'Cabaran 4: Pengecaman Corak Buruj',
    questionText: 'Padankan buruj dengan bilangan bintang atau corak khasnya:',
    type: 'match_pairs' as const,
    matchPairs: [
      { left: 'Buruj Pari', right: '4 bintang (buruj paling kecil, corak layang-layang)', leftId: 'gp1', rightId: 'gp1' },
      { left: 'Buruj Biduk', right: '7 bintang (corak gayung/senduk, sebahagian Ursa Major)', leftId: 'gp2', rightId: 'gp2' },
      { left: 'Buruj Belantik', right: 'Corak pemburu memakai tali pinggang & bersenjata', leftId: 'gp3', rightId: 'gp3' },
      { left: 'Buruj Skorpio', right: 'Corak menyerupai kala jengking berbisa', leftId: 'gp4', rightId: 'gp4' }
    ],
    explanation: 'Pari (4 bintang, layang-layang), Biduk (7 bintang, gayung), Belantik (pemburu bertali pinggang), Skorpio (kala jengking). (Buku Teks ms. 210)',
    points: 120
  },
  {
    step: 5,
    name: 'Zon Petunjuk Arah',
    subtitle: 'Kompas Navigasi Angkasa',
    topicType: 'buruj' as const,
    standardLearning: 'SP 9.2.3',
    description: 'Menggunakan buruj Biduk dan Pari untuk menentukan arah kapal angkasa.',
    challengeTitle: 'Cabaran 5: Kalibrasi Haluan Arah',
    questionText: 'Kapal angkasa memerlukan penentu arah tanpa kompas elektronik. Buruj manakah yang sentiasa menunjukkan arah UTARA dan SELATAN?',
    type: 'multiple_choice' as const,
    options: [
      { id: 'a', text: 'Buruj Belantik menunjuk ke Utara, Buruj Skorpio menunjuk ke Selatan.' },
      { id: 'b', text: 'Buruj Biduk sentiasa menunjuk ke arah UTARA, Buruj Pari sentiasa menunjuk ke arah SELATAN.' },
      { id: 'c', text: 'Buruj Pari menunjuk ke Utara, Buruj Biduk menunjuk ke Selatan.' },
      { id: 'd', text: 'Semua buruj menunjuk ke arah Timur.' }
    ],
    correctOptionId: 'b',
    explanation: 'Buruj Biduk sentiasa menunjuk ke arah Utara, manakala Buruj Pari sentiasa menunjuk ke arah Selatan. Ini merupakan kompas alam bagi pengembara dan pelayar. (Buku Teks ms. 211)',
    points: 110
  },
  {
    step: 6,
    name: 'Zon Petunjuk Musim',
    subtitle: 'Kalendar Pertanian Astronomi',
    topicType: 'buruj' as const,
    standardLearning: 'SP 9.2.3',
    description: 'Menghubungkan kemunculan buruj dengan musim menanam, musim menuai, dan musim sejuk.',
    challengeTitle: 'Cabaran 6: Pengurusan Musim',
    questionText: 'Seorang petani purba ingin menanam gandum, manakala seorang lagi ingin menuai hasil tanaman. Apakah buruj yang mereka perhatikan?',
    type: 'multiple_choice' as const,
    options: [
      { id: 'a', text: 'Buruj Skorpio untuk menanam, Buruj Biduk untuk menuai.' },
      { id: 'b', text: 'Buruj Pari untuk menanam, Buruj Belantik untuk menuai.' },
      { id: 'c', text: 'Buruj Biduk digunakan sebagai petunjuk musim menanam, dan Buruj Skorpio sebagai petunjuk musim menuai.' },
      { id: 'd', text: 'Hanya Buruj Belantik sahaja yang digunakan untuk semua musim pertanian.' }
    ],
    correctOptionId: 'c',
    explanation: 'Buruj Biduk dijadikan petunjuk musim menanam, Buruj Skorpio dijadikan petunjuk musim menuai, dan Buruj Belantik menandakan ketibaan musim sejuk! (Buku Teks ms. 212)',
    points: 120
  },
  {
    step: 7,
    name: 'Pusat Galaksi',
    subtitle: 'Cabaran Integrasi Agong',
    topicType: 'teras' as const,
    standardLearning: 'SP 9.1 & SP 9.2',
    description: 'Ujian integrasi penuh Fasa Bulan dan Buruj untuk mengaktifkan teras tenaga galaksi!',
    challengeTitle: 'Cabaran Akhir: Pengaktifan Teras Galaksi',
    questionText: 'Pilih rumusan sains yang paling lengkap dan tepat bagi Unit 9 Fasa Bulan dan Buruj:',
    type: 'multiple_choice' as const,
    options: [
      { id: 'a', text: 'Bulan mengeluarkan cahaya sendiri, beredar mengikut arah jam, dan semua buruj hanya ada di hemisfera selatan.' },
      { id: 'b', text: 'Bulan memantulkan cahaya Matahari; tempoh putaran dan peredarannya adalah sama (27 1/3 hari); fasa bulan berlaku akibat kedudukan Bulan yang berubah; dan buruj (Biduk, Belantik, Pari, Skorpio) berfungsi sebagai petunjuk arah dan musim.' },
      { id: 'c', text: 'Buruj adalah satelit semula jadi yang menghasilkan takwim Qamari manakala Bulan membentuk corak seperti gayung.' },
      { id: 'd', text: 'Fasa bulan hanya ada dua iaitu anak bulan dan bulan purnama sahaja.' }
    ],
    correctOptionId: 'b',
    explanation: 'Tahniah! Anda telah menguasai keseluruhan konsep sains Unit 9: Fasa Bulan dan Buruj mengikut DSKP Tahun 5 dengan cemerlang! Teras Galaksi kini berjaya diaktifkan!',
    points: 150
  }
];

export const CHARACTER_PROFILES = [
  {
    id: 'lelaki' as const,
    name: 'Aiman',
    title: 'Kapten Penjelajah Angkasa',
    description: 'Pantas, tangkas, dan mahir dalam navigasi buruj bintang.',
    color: '#0284C7' // Sky blue
  },
  {
    id: 'perempuan' as const,
    name: 'Melia',
    title: 'Pakar Astronomi Bulan',
    description: 'Bijak, teliti, dan pakar dalam merekod fasa-fasa Bulan.',
    color: '#EC4899' // Pink / Magenta accent
  }
];

export const ASTRONAUT_AVATARS = [
  {
    id: 'avatar_biru',
    name: 'Perintis Biru',
    title: 'Kapten Penjelajah Orbit',
    suitColor: '#0EA5E9', // Bright Sky Blue
    accentColor: '#38BDF8',
    visorColor: '#FBBF24', // Golden Visor
    accessoryName: 'Lencana Bintang Alpha',
    accessoryType: 'star_badge' as const,
    description: 'Pakaian angkasa berketahanan tinggi dengan visor bersalut emas untuk cerapan matahari.'
  },
  {
    id: 'avatar_emas',
    name: 'Suria Gemilang',
    title: 'Pakar Navigasi Buruj',
    suitColor: '#F59E0B', // Golden Amber
    accentColor: '#FDE047',
    visorColor: '#06B6D4', // Cyan Visor
    accessoryName: 'Cincin Orbit Solar',
    accessoryType: 'solar_ring' as const,
    description: 'Dilengkapi pelindung haba solar dan pengesan medan magnet bagi menentukan arah buruj.'
  },
  {
    id: 'avatar_magenta',
    name: 'Aurora Bintang',
    title: 'Penyelidik Fasa Bulan',
    suitColor: '#EC4899', // Bright Magenta / Pink
    accentColor: '#F472B6',
    visorColor: '#A855F7', // Purple Visor
    accessoryName: 'Kristal Nebula Qamari',
    accessoryType: 'nebula_crystal' as const,
    description: 'Pakar optik dengan visor spektrum ultra-ungu untuk menganalisis pantulan cahaya Bulan.'
  },
  {
    id: 'avatar_hijau',
    name: 'Zamrud Kosmik',
    title: 'Jurutera Rover Bulan',
    suitColor: '#10B981', // Emerald / Mint Green
    accentColor: '#34D399',
    visorColor: '#38BDF8', // Sky Visor
    accessoryName: 'Pendorong Sayap Kosmik',
    accessoryType: 'cosmic_wings' as const,
    description: 'Dilengkapi pendorong graviti mikro untuk melompat melepasi kawah dan batuan bulan.'
  },
  {
    id: 'avatar_ungu',
    name: 'Komet Diraja',
    title: 'Pakar Komunikasi Galaksi',
    suitColor: '#8B5CF6', // Cheerful Royal Violet
    accentColor: '#A78BFA',
    visorColor: '#F43F5E', // Rose Visor
    accessoryName: 'Piring Radar Kosmik',
    accessoryType: 'radar_dish' as const,
    description: 'Membawa antena frekuensi radio angkasa untuk menangkap isyarat stesen angkasa purba.'
  }
];

