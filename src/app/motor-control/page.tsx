import { ModuleGuide } from '@/components/ui/ModuleGuide';

export default function Page() {
  return <ModuleGuide
    phase={6}
    title="Motor Simulation"
    subtitle="Karakteristik motor · pemahaman perilaku"
    intro="Pelajari bagaimana motor merespons saat start, berbeban, dan mengalami gangguan. Modul ini membangun pemahaman parameter motor dan cara membaca data pengujian sebelum grafik simulasi dinamis tersedia."
    objectives={['Membaca data nameplate motor.','Memahami perbedaan arus start dan arus operasi.','Menjelaskan hubungan beban, torsi, dan kecepatan secara kualitatif.','Mengenali gejala overload, stall, dan kehilangan fase.']}
    sections={[
      {title:'Data dasar motor',description:'Nameplate menjadi sumber utama untuk memahami batas operasi motor.',points:['Catat daya, tegangan, arus nominal, frekuensi, dan kecepatan nominal.','Perhatikan hubungan tegangan dengan konfigurasi terminal.','Jangan menyamakan daya keluaran mekanis dengan daya masukan listrik.']},
      {title:'Start dan kondisi berbeban',description:'Motor membutuhkan kondisi transien saat mulai berputar.',points:['Arus awal dapat lebih tinggi daripada arus saat operasi normal.','Beban mekanis memengaruhi percepatan dan titik operasi.','Metode starting dipilih berdasarkan motor, beban, dan jaringan.']},
      {title:'Gangguan dan proteksi',description:'Gejala gangguan harus dianalisis bersama data pengukuran dan kondisi mekanis.',points:['Overload dapat meningkatkan temperatur motor.','Stall terjadi ketika rotor gagal mencapai atau mempertahankan putaran.','Kehilangan fase dan ketidakseimbangan suplai dapat menyebabkan kondisi berbahaya.']}
    ]}
    steps={[
      {title:'Catat parameter nameplate',detail:'Pilih satu motor contoh dan salin data nameplate-nya ke lembar kerja.',check:'Satuan dan nilai setiap parameter tercatat dengan benar.'},
      {title:'Buat kondisi operasi',detail:'Deskripsikan kondisi tanpa beban, beban normal, dan beban berat secara kualitatif.',check:'Perbedaan kondisi operasi dijelaskan dengan alasan teknis.'},
      {title:'Bandingkan metode starting',detail:'Bandingkan DOL, Star-Delta, soft starter, dan VFD dari sisi tujuan serta batas penggunaannya.',check:'Metode tidak dipilih hanya karena dianggap paling canggih.'},
      {title:'Analisis gejala gangguan',detail:'Untuk setiap gejala, catat kemungkinan penyebab listrik, mekanis, dan proteksi yang perlu diperiksa.',check:'Penyebab tidak dipastikan hanya dari satu gejala.'},
      {title:'Susun data pengujian',detail:'Buat tabel waktu, arus, kecepatan, beban, dan temperatur untuk mencatat hasil pengujian terkontrol.',check:'Setiap data memiliki satuan, kondisi pengukuran, dan sumber alat ukur.'}
    ]}
    safety="Jangan melakukan pengujian stall, kehilangan fase, atau overload dengan sengaja pada motor nyata. Gunakan data demonstrasi atau fasilitas uji yang dirancang khusus dan diawasi tenaga kompeten."
    workspaceHint="Anda dapat menyusun konsep rangkaian motor dari komponen yang tersedia. Model dinamis, grafik arus/kecepatan/torsi/suhu terhadap waktu belum tersedia sehingga halaman ini tidak menampilkan angka simulasi palsu."
  />;
}
