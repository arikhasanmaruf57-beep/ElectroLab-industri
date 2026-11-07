import { ModuleGuide } from '@/components/ui/ModuleGuide';

export default function Page() {
  return <ModuleGuide
    phase={8}
    title="PLC & Automation"
    subtitle="Otomasi industri · logika kendali"
    intro="Pelajari dasar PLC melalui siklus scan, pemetaan input-output, logika kontak, timer, counter, dan interlock. Fokus awal adalah menyusun urutan proses secara tertulis sebelum program dijalankan pada editor PLC."
    objectives={['Memahami peran PLC dan siklus scan.','Membedakan alamat input dan output.','Membaca logika kontak NO/NC dan coil.','Menyusun urutan proses serta kondisi interlock.']}
    sections={[
      {title:'Siklus scan PLC',description:'PLC membaca input, mengeksekusi program, lalu memperbarui output secara berulang.',points:['Pahami urutan baca input, eksekusi logika, dan pembaruan output.','Perhatikan bahwa perubahan input dapat diproses pada scan berikutnya.','Waktu scan dan perilaku modul bergantung pada perangkat PLC.']},
      {title:'Input, output, dan ladder',description:'Ladder diagram merepresentasikan logika kendali dalam bentuk rung.',points:['Input digital dapat berasal dari push button atau sensor.','Output mengendalikan coil kontaktor, lampu indikator, atau aktuator melalui antarmuka yang sesuai.','Kontak NO/NC dalam program merepresentasikan kondisi logika, bukan selalu bentuk fisik kontak.']},
      {title:'Timer, counter, dan keselamatan',description:'Instruksi waktu dan hitung membantu membangun urutan proses.',points:['Timer digunakan untuk penundaan atau pengaturan durasi sesuai tipe instruksi.','Counter menghitung kejadian berdasarkan kondisi pemicu.','Emergency stop dan fungsi keselamatan tidak boleh hanya mengandalkan logika PLC standar.']}
    ]}
    steps={[
      {title:'Tulis deskripsi proses',detail:'Uraikan kondisi awal, pemicu, urutan kerja, kondisi berhenti, dan kondisi gangguan.',check:'Urutan proses dapat dipahami tanpa melihat program.'},
      {title:'Buat daftar I/O',detail:'Beri alamat dan nama untuk setiap sensor, tombol, lampu, kontaktor, dan aktuator.',check:'Tidak ada alamat input/output ganda atau tidak terdokumentasi.'},
      {title:'Gambar flowchart',detail:'Gambarkan urutan, keputusan, kondisi berhenti, dan jalur gangguan.',check:'Semua cabang keputusan memiliki hasil yang jelas.'},
      {title:'Terjemahkan ke logika ladder',detail:'Susun rung sederhana menggunakan kontak, coil, dan kondisi pengunci sesuai kebutuhan.',check:'Setiap rung memiliki tujuan tunggal dan komentar yang menjelaskan fungsinya.'},
      {title:'Rencanakan pengujian',detail:'Buat tabel kondisi input dan output yang diharapkan untuk kondisi normal dan fault.',check:'Kasus uji mencakup kondisi awal, operasi, stop, dan gangguan.'}
    ]}
    safety="PLC bukan pengganti safety relay atau safety PLC yang sesuai standar. Rangkaian emergency stop, interlock keselamatan, dan aktuator berbahaya harus dirancang serta divalidasi sesuai standar mesin."
    workspaceHint="Component Library membantu mengenali PLC, sensor, dan aktuator. Editor ladder, runtime scan-cycle, dan monitoring I/O interaktif belum diaktifkan."
  />;
}
