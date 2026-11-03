/* =====================================================
   ✏️  INI SATU-SATUNYA FILE YANG PERLU KAMU EDIT
   Ganti isi di dalam tanda kutip "...", jangan hapus tanda kutip / koma.
   ===================================================== */
const CONFIG = {

  /* ---- 1. IDENTITAS ---- */
  name: "Kall",                          // nama panggilan
  fullName: "Kalista",                   // nama lengkap / nama yang ditulis di halaman akhir
  from: "Jasson Fico Saverio",           // tanda tangan di akhir

  /* ---- 2. TANGGAL & KUNCI ---- */
  // Fase 1: sekarang s/d "lockFrom"  -> TERBUKA (untuk kamu cek-cek)
  // Fase 2: "lockFrom" s/d "date"    -> TERKUNCI, hanya hitung mundur
  // Fase 3: setelah "date"           -> TERBUKA (hari ulang tahun)
  lockFrom: "2027-01-10T00:00:00+07:00", // mulai terkunci: 10 Januari 2027, jam 00:00 WIB
  date: "2027-01-12T00:00:00+07:00",     // hari ulang tahun: 12 Januari 2027, jam 00:00 WIB
  lockBeforeDate: true,                  // false = tidak pernah dikunci
  previewKey: "kall17",                  // ?preview=kall17 di link = buka kunci kapan saja (jangan dibagikan!)

  /* ---- 3. MUSIK: lagu favorit (halaman lagu ada di tengah) ---- */
  music: "musik.mp3",                    // upload lagunya ke paling luar repository dengan nama ini. Tidak ada file = halaman lagu dilewati
  musicFromStart: false,                 // false = lagu mulai di halaman lagu, true = lagu mulai sejak tombol "Buka Kejutan"
  song: { title: "夜に駆ける", romaji: "Yoru ni Kakeru", artist: "YOASOBI" },

  /* ---- 4. SURAT ---- */
  letterTitle: "Happy Birthday",
  letter: [
    "Hai Kall, happy sweet seventeen yaa Kall! 🎂",
    "Engga kerasa yaa, udah 2x aku ucapin ulang tahun ke kamu. Semoga kamu selalu diberkati Tuhan, selalu dilancarkan rezekinya, dan always sehat yaa Kall.",
    "Bersyukur banget aku ketemu orang sebaik kamu. Kamu orangnya baik banget, attitude-nya juga bagus banget, nggak sombong, nggak toxic, nggak suka ngejelekin temen, dan kamu orang yang paling sabar dalam segala hal. Pokoknya selama aku kenal kamu, kamu tuh best banget, cakep lagi.",
    "Makasih juga yaa Kall untuk selama ini kita berteman. Walau pas awal kita ketemu kamu stecu banget sih, hehee.",
    "Semoga habis kita kelas 12 nanti terus lulus, kita masih bisa berteman baik yaa, masih bisa ketemu juga kalau emang bisa.",
    "Makasih deh untuk semuanya Kall. Wish u all the best Kalista, and Happy Birthday yang ke-17 tahun (sweet seventeen yaa Kall) hehee. Tambah tua nihh WKWKWKWK 😆",
    "Semoga suka ya sama ucapan ini, maaf kalau ucapannya nggak bagus-bagus banget. Ga kerasa udah 2 tahun kita kenal xixixi.",
    "Itu aja yang mau aku sampaikan. Good luck yaa Kall! 💜",
    "お誕生日おめでとう、カリスタ！ 🌸",
  ],

  /* ---- 5. DIARY RAHASIA (halaman buku, tambah/kurangi sesuka hati) ---- */
  diaryCover: "Dear Kall",
  diary: [
    { title: "Kamu baik banget", text: "Dari pertama kenal sampai sekarang, kamu selalu baik ke semua orang. Itu yang bikin aku bersyukur banget kenal kamu." },
    { title: "Sabar tingkat dewa", text: "Dalam segala hal kamu tuh sabar banget. Kadang aku mikir, kok bisa ya sesabar itu? Aku mau belajar dari kamu." },
    { title: "Attitude-nya bagus", text: "Nggak sombong, nggak toxic, dan nggak pernah suka ngejelekin temen. Langka banget, Kall." },
    { title: "Awalnya stecu 😆", text: "Pas awal ketemu kamu stecu banget, hehe. Tapi ternyata setelah kenal, kamu asik dan nyaman diajak berteman." },
    { title: "Tentang kelas 12", text: "Semoga habis kelas 12 nanti dan kita udah lulus, kita masih bisa berteman baik dan ketemu kalau emang bisa ya." },
  ],

  /* ---- 6. 17 ALASAN (harus tetap 17 ya) ---- */
  reasons: [
    "Kamu baik banget ke siapa aja",
    "Kamu sabar dalam segala hal",
    "Attitude-mu bagus banget",
    "Kamu nggak sombong sama sekali",
    "Kamu nggak toxic, deket sama kamu bikin tenang",
    "Kamu nggak pernah ngejelekin temen",
    "Awalnya stecu, ternyata asik banget",
    "Udah 2 tahun berteman dan aku masih nyaman",
    "Kamu cakep, tapi tetap humble",
    "Kamu bikin aku bersyukur punya temen kayak kamu",
    "Kamu tetap jadi diri sendiri",
    "Kamu pantas dapet hal-hal baik",
    "Kamu bikin suasana jadi lebih adem",
    "Kamu temen yang bisa dipercaya",
    "Kamu tuh best banget, pokoknya",
    "Kamu pantas dapet semua impianmu",
    "Karena kamu itu Kalista, dan itu udah lebih dari cukup 💜",
  ],

  /* ---- 7. FOTO KENANGAN ---- */
  // Upload foto ke paling luar repository dengan nama foto1.jpg sampai foto4.jpg (sama persis dengan di bawah).
  // Boleh tambah/kurangi baris (sekarang 4 foto).
  photos: [
    { src: "foto1.jpg", caption: "Happy" },
    { src: "foto2.jpg", caption: "Sweet" },
    { src: "foto3.jpg", caption: "Seventeen" },
    { src: "foto4.jpg", caption: "Kall" },
  ],

  /* ---- 8. VIDEO (opsional) ---- */
  // Isi "video.mp4" kalau mau menampilkan video (upload filenya ke paling luar). Kosong ("") = halaman video dilewati.
  video: "",

  /* ---- 9. KARAKTER FAVORIT ---- */
  favorite: {
    title: "Favorit {name}",
    anime: "Bungo Stray Dogs",
    character: "Osamu Dazai",
    image: "dazai.jpg",    // taruh gambar Dazai pilihanmu dengan nama ini
    note: "Aku tau kamu ngefans banget sama Dazai, jadi halaman ini khusus buat karakter kesayanganmu 😆 Semoga tahun ini penuh hal-hal seru yang bikin kamu senyum!",
  },

  /* ---- 10. DOA (gelembung melayang) ---- */
  wishes: [
    "Semoga selalu diberkati Tuhan 🙏",
    "Semoga rezekimu selalu lancar 💫",
    "Semoga selalu sehat, always 💪",
    "Semoga kelas 12 lancar sampai lulus 🎓",
    "Semoga cita-citamu tercapai satu per satu ✨",
    "Semoga selalu dikelilingi orang-orang baik 🌸",
    "Semoga kita tetap berteman baik selamanya 🤝",
    "Semoga tahun ini penuh hal yang bikin kamu senyum 😊",
  ],

  /* ---- 11. PENUTUP ---- */
  finalMessage: "Makasih udah jadi teman sebaik ini. Semoga umur 17 jadi awal cerita yang indah buat kamu. Sampai ketemu di bab berikutnya, Kall 💜",
  finalJP: "これからもずっと、友だちでいてね。",     // tulisan Jepang di kartu akhir
  finalJPid: "Semoga kita tetap berteman selamanya.",   // artinya (Indonesia)
  whatsapp: "",   // opsional: nomor WA kamu format 628xxxxxxxxxx, supaya dia bisa klik "Balas ucapan". Kosong = tombol tidak muncul
  whatsappText: "Makasih ya Jasson buat ucapannya! 🥹💜",
};
