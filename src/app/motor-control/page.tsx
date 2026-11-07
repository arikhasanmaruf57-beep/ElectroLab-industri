import { PhasePlaceholder } from '@/components/ui/PhasePlaceholder';

export default function Page() {
  return (
    <PhasePlaceholder
      phase={6}
      title="Motor Simulation"
      intro="Simulasi perilaku motor: arus start, percepatan, torsi, suhu, dan gangguan seperti stall dan overtemperature."
      plans={['Model motor induksi dengan karakteristik start', 'Grafik arus, kecepatan, torsi, dan suhu terhadap waktu', 'Soft starter dan VFD (Phase 7)', 'Gangguan motor: overload, stall, kehilangan fase']}
      nowCanDo="Tempatkan motor 1 phase atau 3 phase beserta VFD dan soft starter dari Component Library untuk menyusun rangkaian."
    />
  );
}
