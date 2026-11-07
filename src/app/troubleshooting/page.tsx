import { ModuleGuide } from '@/components/ui/ModuleGuide';

export default function Page() {
  return <ModuleGuide
    phase={9}
    title="Troubleshooting"
    subtitle="Diagnosis gangguan · metode sistematis"
    intro="Latihan menelusuri gangguan kelistrikan dengan pendekatan gejala, hipotesis, pengukuran, dan verifikasi. Tujuannya bukan menebak komponen rusak, melainkan membangun diagnosis yang dapat dibuktikan."
    objectives={['Membedakan gejala dan penyebab.','Menyusun hipotesis berdasarkan diagram dan kondisi sistem.','Memilih alat ukur dan titik pengukuran yang tepat.','Mencatat temuan sebelum menyimpulkan penyebab.']}
    sections={[
      {title:'Metode diagnosis',description:'Mulai dari informasi yang aman dan dapat diverifikasi.',points:['Tanyakan kapan gangguan terjadi dan apakah ada perubahan sebelum gangguan.','Periksa diagram, nameplate, indikator, dan riwayat proteksi.','Ubah satu variabel pada satu waktu dan dokumentasikan hasil.']},
      {title:'Alat ukur',description:'Pemilihan alat dan metode pengukuran harus sesuai besaran serta kategori keselamatan.',points:['Multimeter untuk tegangan, resistansi, dan kontinuitas sesuai batas alat.','Clamp meter untuk pengukuran arus tanpa membuka rangkaian secara tidak perlu.','Pastikan kategori CAT, rating, probe, dan prosedur sesuai lokasi pengukuran.']},
      {title:'Pola gangguan motor',description:'Gangguan motor dapat berasal dari sisi suplai, kontrol, proteksi, atau mekanis.',points:['Motor tidak start: telusuri suplai, rangkaian kontrol, interlock, dan proteksi.','Kontaktor tidak aktif: periksa perintah, tegangan coil sesuai rating, dan jalur kontrol.','Overload trip: evaluasi beban mekanis, arus, setelan, kondisi motor, dan kehilangan fase.']}
    ]}
    steps={[
      {title:'Amankan area dan sistem',detail:'Identifikasi semua sumber energi, hentikan operasi sesuai prosedur, isolasi, lakukan lockout-tagout, dan verifikasi bebas tegangan sebelum pemeriksaan yang memerlukannya.',check:'Tidak ada pekerjaan dilakukan pada rangkaian bertegangan tanpa prosedur dan kewenangan yang sesuai.'},
      {title:'Catat gejala',detail:'Tulis apa yang terlihat, indikator yang aktif, bunyi, bau, waktu kejadian, dan kondisi beban sebelum gangguan.',check:'Catatan memisahkan fakta yang diamati dari dugaan penyebab.'},
      {title:'Pelajari diagram',detail:'Telusuri jalur daya dan kontrol dari sumber menuju beban serta perangkat proteksi.',check:'Titik isolasi dan jalur yang akan diperiksa sudah diidentifikasi.'},
      {title:'Susun beberapa hipotesis',detail:'Buat daftar kemungkinan penyebab dari yang paling mudah diverifikasi, tanpa langsung mengganti komponen.',check:'Setiap hipotesis memiliki pemeriksaan yang dapat membuktikan atau menolaknya.'},
      {title:'Verifikasi dan dokumentasikan',detail:'Lakukan pengukuran hanya dengan metode aman dan alat sesuai, lalu catat nilai, satuan, titik ukur, dan kondisi sistem.',check:'Kesimpulan didukung hasil pemeriksaan, bukan tebakan.'}
    ]}
    safety="Pengukuran pada instalasi hidup memiliki risiko sengatan dan arc flash. Jika tidak memiliki kompetensi, alat, dan izin kerja yang sesuai, jangan melakukan pengukuran bertegangan. Gunakan teknisi berwenang."
    workspaceHint="Gunakan workspace untuk memahami susunan komponen dan jalur rangkaian. Fault injection, multimeter virtual, dan diagnosis otomatis belum tersedia; latihan ini adalah prosedur analisis manual."
  />;
}
