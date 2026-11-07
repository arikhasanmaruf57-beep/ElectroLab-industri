import { ModuleGuide } from '@/components/ui/ModuleGuide';

export default function Page() {
  return <ModuleGuide
    phase={9}
    title="Learning Center"
    subtitle="Pusat belajar · dasar hingga otomasi"
    intro="Jalur belajar bertahap untuk memahami konsep kelistrikan, membaca rangkaian, mengenali komponen, dan masuk ke kontrol industri. Ikuti materi secara berurutan dan gunakan checklist untuk memantau sesi belajar."
    objectives={['Memahami besaran listrik dan hukum dasar.','Mengenali komponen serta simbol instalasi.','Membaca rangkaian daya dan kontrol.','Menghubungkan konsep kelistrikan dengan motor dan PLC.']}
    sections={[
      {title:'Fondasi kelistrikan',description:'Bangun pemahaman dari besaran dan hubungan dasar.',points:['Tegangan, arus, hambatan, daya, dan energi.','Hukum Ohm dan hukum Kirchhoff sebagai dasar analisis.','Perbedaan arus bolak-balik dan arus searah.']},
      {title:'Instalasi dan proteksi',description:'Kenali sistem distribusi dan perangkat keselamatan.',points:['Penghantar fase, netral, dan proteksi (PE).','MCB, MCCB, RCCB/RCBO, sekering, dan pembumian.','Diagram satu garis dan diagram pengawatan.']},
      {title:'Kontrol dan otomasi',description:'Lanjutkan dari rangkaian sederhana menuju sistem industri.',points:['Kontaktor, relay, overload, dan rangkaian pengunci.','DOL, Forward-Reverse, dan Star-Delta.','Dasar PLC, input-output, ladder, timer, dan counter.']}
    ]}
    steps={[
      {title:'Pelajari besaran listrik',detail:'Buat ringkasan definisi, simbol, satuan, dan contoh penggunaan tegangan, arus, hambatan, daya, serta energi.',check:'Anda dapat membedakan simbol dan satuan setiap besaran.'},
      {title:'Latihan hukum Ohm',detail:'Kerjakan contoh perhitungan dengan dua besaran diketahui dan satu besaran dicari. Periksa konsistensi satuan.',check:'Langkah substitusi dan satuan hasil benar.'},
      {title:'Kenali komponen',detail:'Buka Component Library, pilih beberapa komponen, dan catat fungsi, simbol, terminal, serta ratingnya.',check:'Anda dapat menjelaskan fungsi komponen tanpa hanya menghafal bentuk.'},
      {title:'Baca diagram',detail:'Telusuri satu diagram daya dan satu diagram kontrol. Tandai sumber, proteksi, kendali, dan beban.',check:'Alur kerja rangkaian dapat dijelaskan dari awal sampai akhir.'},
      {title:'Hubungkan teori dengan praktik',detail:'Susun rangkaian latihan sederhana di workspace dan bandingkan dengan diagram yang telah dipelajari.',check:'Susunan komponen dan jalur koneksi sesuai diagram; jangan menganggapnya sebagai sertifikasi instalasi.'}
    ]}
    safety="Materi ini untuk pembelajaran. Pekerjaan instalasi nyata harus mengikuti PUIL/SNI, petunjuk pabrikan, dan prosedur keselamatan. Jangan mencoba praktik pada jaringan listrik rumah tanpa pengawasan dan kompetensi."
    workspaceHint="Gunakan Component Library sebagai kamus komponen dan workspace untuk latihan menyusun rangkaian. Kuis otomatis, penyimpanan progres lintas perangkat, dan pelacakan kurikulum penuh belum diaktifkan."
  />;
}
