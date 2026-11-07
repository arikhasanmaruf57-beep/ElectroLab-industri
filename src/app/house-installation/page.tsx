import { ModuleGuide } from '@/components/ui/ModuleGuide';

export default function Page() {
  return <ModuleGuide
    phase={5}
    title="Instalasi Listrik Rumah"
    subtitle="Instalasi tegangan rendah · rumah tinggal"
    intro="Pelajari alur instalasi rumah dari sumber, alat pembatas dan proteksi, panel, hingga titik beban. Modul ini membimbing proses perencanaan dan pemeriksaan dasar sebelum rangkaian dirakit."
    objectives={['Membedakan rangkaian penerangan dan rangkaian stopkontak.','Memahami fungsi MCB, RCCB/RCBO, penghantar netral, dan PE.','Membaca alur distribusi dari panel menuju beban.','Menyusun urutan pemeriksaan instalasi secara sistematis.']}
    sections={[
      {title:'Pembagian sirkit',description:'Beban rumah tidak sebaiknya diperlakukan sebagai satu kelompok tanpa perencanaan.',points:['Pisahkan sirkit penerangan dan stopkontak sesuai kebutuhan desain.','Identifikasi beban, daya, dan karakteristik pemakaiannya.','Tentukan penghantar dan proteksi berdasarkan perhitungan serta standar yang berlaku.']},
      {title:'Saklar dan titik lampu',description:'Saklar mengendalikan penghantar fase menuju beban penerangan.',points:['Kenali saklar tunggal, seri, tukar, dan silang.','Gambar diagram satu garis dan diagram pengawatan sebelum pemasangan.','Periksa fungsi kendali dan identifikasi penghantar.']},
      {title:'Panel dan pembumian',description:'Panel distribusi mengelompokkan sirkit dan menyediakan proteksi.',points:['Pahami fungsi MCB dan perangkat arus sisa.','Netral (N) dan penghantar proteksi (PE) memiliki fungsi berbeda.','Kontinuitas PE dan kualitas pembumian harus diperiksa dengan metode yang sesuai.']}
    ]}
    steps={[
      {title:'Buat daftar beban',detail:'Catat titik lampu, stopkontak, dan peralatan tetap. Kelompokkan beban berdasarkan fungsi dan lokasi.',check:'Setiap beban memiliki identitas, lokasi, dan perkiraan kebutuhan daya.'},
      {title:'Gambar diagram satu garis',detail:'Gambarkan sumber, alat ukur/pembatas, panel, proteksi sirkit, dan kelompok beban.',check:'Arah distribusi dan batas setiap sirkit dapat dibaca dengan jelas.'},
      {title:'Rencanakan saklar dan lampu',detail:'Tentukan jenis kendali yang dibutuhkan dan gambarkan hubungan saklar dengan titik lampu.',check:'Diagram kendali sesuai kebutuhan ruangan dan tidak mencampur N/PE.'},
      {title:'Rencanakan proteksi',detail:'Tentukan perangkat proteksi melalui perhitungan beban, kemampuan penghantar, arus gangguan, dan ketentuan standar.',check:'Rating proteksi tidak dipilih hanya berdasarkan perkiraan atau kebiasaan.'},
      {title:'Buat daftar pemeriksaan',detail:'Rencanakan pemeriksaan visual, kontinuitas penghantar proteksi, polaritas, tahanan isolasi, dan pengujian perangkat proteksi oleh personel kompeten.',check:'Setiap pemeriksaan memiliki metode dan kriteria penerimaan yang jelas.'}
    ]}
    safety="Jangan merakit atau menguji instalasi rumah yang terhubung ke jaringan PLN dalam keadaan bertegangan. Pemilihan ukuran kabel, rating proteksi, dan pengujian wajib mengacu pada PUIL/SNI yang berlaku serta dilakukan personel kompeten."
    workspaceHint="Workspace dapat digunakan untuk mengenali komponen dan menyusun konsep rangkaian. Pemeriksaan instalasi rumah secara otomatis dan validasi PUIL khusus modul ini belum tersedia."
  />;
}
