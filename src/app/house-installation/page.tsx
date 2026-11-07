import { PhasePlaceholder } from '@/components/ui/PhasePlaceholder';

export default function Page() {
  return (
    <PhasePlaceholder
      phase={5}
      title="Instalasi Listrik Rumah"
      intro="Modul untuk merangkai instalasi rumah: penerangan, saklar, stopkontak, dan panel distribusi dengan proteksi yang benar."
      plans={['Rangkaian saklar tunggal, seri, tukar, dan silang yang dihitung engine', 'Lampu, stopkontak, dan jalur PE dengan pemeriksaan pembumian', 'Panel distribusi: MCB, RCCB/RCBO, busbar, kWh meter', 'Contoh rangkaian siap pakai']}
      nowCanDo="Rangkai sumber AC 1 phase, kWh meter, MCB, RCCB, saklar, lampu, dan stopkontak langsung di workspace. Terminal dan aturan kompatibilitas sudah berlaku."
    />
  );
}
