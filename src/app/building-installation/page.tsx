import { ModuleGuide } from '@/components/ui/ModuleGuide';

export default function Page() {
  return <ModuleGuide
    phase={5}
    title="Instalasi Listrik Gedung"
    subtitle="Distribusi daya · sistem tiga fase"
    intro="Pelajari konsep distribusi listrik gedung dari sumber utama menuju panel distribusi dan beban akhir. Fokus modul adalah memahami hierarki panel, feeder, pembagian beban, dan koordinasi proteksi."
    objectives={['Membedakan panel utama dan sub-panel.','Memahami fungsi feeder dan distribusi tiga fase.','Mengenali tujuan penyeimbangan beban antar fase.','Memahami konsep ATS dan suplai darurat tanpa menganggapnya sebagai rangkaian siap pasang.']}
    sections={[
      {title:'Hierarki distribusi',description:'Sistem gedung umumnya membagi distribusi ke beberapa tingkat panel.',points:['Telusuri sumber menuju panel utama, sub-panel, lalu panel beban.','Berikan identitas yang konsisten untuk panel dan feeder.','Dokumentasikan jalur suplai dan titik isolasi.']},
      {title:'Sistem tiga fase',description:'Pembagian beban perlu mempertimbangkan karakteristik sistem dan ketidakseimbangan.',points:['Kenali penghantar L1, L2, L3, N, dan PE.','Kelompokkan beban satu fase pada fase yang sesuai.','Evaluasi arus, jatuh tegangan, dan kapasitas penghantar melalui perhitungan.']},
      {title:'Suplai darurat',description:'Generator dan ATS digunakan untuk menjaga suplai pada beban yang ditetapkan.',points:['Identifikasi beban prioritas dan beban non-prioritas.','Pahami interlock agar sumber tidak terhubung paralel secara tidak disengaja.','Rancang proteksi, pembumian, ventilasi, dan prosedur operasi sesuai standar.']}
    ]}
    steps={[
      {title:'Inventarisasi beban gedung',detail:'Catat beban penerangan, stopkontak, HVAC, pompa, lift, dan beban khusus beserta karakteristiknya.',check:'Daftar beban memiliki daya, faktor kebutuhan, dan kategori prioritas.'},
      {title:'Susun diagram satu garis',detail:'Gambarkan sumber, panel utama, feeder, sub-panel, serta kelompok beban.',check:'Setiap feeder dan panel memiliki nama serta tujuan yang jelas.'},
      {title:'Kelompokkan beban per fase',detail:'Buat pembagian awal beban satu fase dan identifikasi beban tiga fase.',check:'Pembagian fase dapat ditinjau untuk mengurangi ketidakseimbangan.'},
      {title:'Tinjau koordinasi proteksi',detail:'Pelajari hubungan kapasitas penghantar, arus hubung singkat prospektif, dan karakteristik perangkat proteksi.',check:'Koordinasi tidak hanya didasarkan pada angka arus nominal.'},
      {title:'Rencanakan operasi darurat',detail:'Tentukan beban esensial, sumber alternatif, interlock, dan urutan pemindahan suplai.',check:'Ada prosedur operasi dan kondisi gagal yang terdokumentasi.'}
    ]}
    safety="Instalasi gedung, generator, ATS, dan panel tiga fase memiliki risiko tinggi. Jangan melakukan switching atau pengujian langsung tanpa prosedur isolasi, izin kerja, alat pelindung, dan personel berwenang."
    workspaceHint="Gunakan workspace untuk mengenali sumber tiga fase, perangkat proteksi, dan konsep feeder. Analisis hubung singkat, koordinasi proteksi, dan simulasi ATS khusus gedung belum tersedia."
  />;
}
