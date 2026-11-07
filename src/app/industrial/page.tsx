import { ModuleGuide } from '@/components/ui/ModuleGuide';

export default function Page() {
  return <ModuleGuide
    phase={6}
    title="Industrial Motor Control"
    subtitle="Kontrol motor · rangkaian daya dan kendali"
    intro="Modul pengantar kendali motor industri. Pelajari perbedaan rangkaian daya dan kontrol, cara kerja kontaktor, pengunci (self-holding), interlock, serta konsep DOL, Forward-Reverse, dan Star-Delta."
    objectives={['Membedakan jalur daya motor dan jalur kontrol.','Memahami fungsi kontaktor, overload relay, dan push button.','Menjelaskan prinsip self-holding dan interlock.','Membaca urutan kerja starter motor secara logis.']}
    sections={[
      {title:'Komponen kontrol motor',description:'Setiap komponen memiliki fungsi dan terminal yang harus dikenali.',points:['Kontaktor menghubungkan dan memutus rangkaian daya melalui kumparan kendali.','Thermal overload relay melindungi motor dari kondisi beban lebih sesuai karakteristiknya.','Push button START/STOP dan kontak bantu membentuk logika kendali.']},
      {title:'DOL dan self-holding',description:'DOL menghubungkan motor langsung ke suplai melalui perangkat switching dan proteksi.',points:['Tombol START memberi perintah sesaat pada kumparan kontaktor.','Kontak bantu NO dapat mempertahankan kumparan setelah tombol dilepas.','Kontak STOP dan proteksi overload memutus jalur kendali saat diperlukan.']},
      {title:'Interlock dan Star-Delta',description:'Pengendalian arah dan metode starting memerlukan urutan serta interlock yang benar.',points:['Forward-Reverse memerlukan interlock untuk mencegah dua kontaktor arah aktif bersamaan.','Star-Delta memerlukan motor dan terminal yang sesuai serta urutan perpindahan yang benar.','Rangkaian aktual wajib mengikuti diagram pabrikan dan rating peralatan.']}
    ]}
    steps={[
      {title:'Identifikasi nameplate motor',detail:'Baca tegangan, arus nominal, daya, frekuensi, faktor daya, dan konfigurasi terminal pada nameplate.',check:'Data motor dicatat sebelum memilih perangkat kendali dan proteksi.'},
      {title:'Pisahkan diagram daya dan kontrol',detail:'Gambar jalur sumber menuju proteksi, kontaktor, overload, dan motor. Gambar jalur kontrol secara terpisah.',check:'Diagram daya dan kontrol tidak tercampur dan terminal diberi label.'},
      {title:'Susun logika START/STOP',detail:'Jelaskan kondisi awal, perintah START, fungsi kontak bantu, dan kondisi STOP.',check:'Motor tidak start sendiri setelah suplai kontrol kembali tanpa rancangan yang memang mengizinkan.'},
      {title:'Tambahkan proteksi dan interlock',detail:'Tinjau kontak overload dan interlock listrik/mekanis sesuai jenis rangkaian.',check:'Tidak ada kondisi dua kontaktor yang saling bertentangan aktif bersamaan.'},
      {title:'Buat urutan pengujian',detail:'Rencanakan pemeriksaan tanpa tegangan, verifikasi wiring, pengujian fungsi kontrol, lalu uji operasi sesuai prosedur.',check:'Setiap tahap memiliki kriteria lulus/gagal dan dilakukan oleh personel kompeten.'}
    ]}
    safety="Motor industri dapat menyebabkan sengatan, arc flash, dan bahaya mekanis. Isolasi semua sumber energi, lakukan lockout-tagout, verifikasi bebas tegangan, dan ikuti diagram serta prosedur pabrikan."
    workspaceHint="Workspace dan Component Library dapat dipakai untuk mempelajari komponen dan terminal. Simulasi urutan kontaktor, interlock, dan starter motor khusus belum diaktifkan."
  />;
}
