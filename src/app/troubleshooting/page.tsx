import { PhasePlaceholder } from '@/components/ui/PhasePlaceholder';

export default function Page() {
  return (
    <PhasePlaceholder
      phase={9}
      title="Troubleshooting"
      intro="Mode latihan mencari gangguan pada rangkaian yang sengaja dibuat bermasalah, menggunakan multimeter virtual."
      plans={['Kasus: motor tidak start, kontaktor tidak aktif, TOR trip, fase hilang', 'Multimeter virtual dengan hasil dari kondisi rangkaian', 'Tiga tingkat kesulitan', 'Penjelasan penyebab dan solusi setelah selesai']}
      nowCanDo="Siapkan rangkaian dengan Digital Multimeter dari Component Library; pembacaan ukur nyata menunggu solver Phase 3."
    />
  );
}
