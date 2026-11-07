import { PhasePlaceholder } from '@/components/ui/PhasePlaceholder';

export default function Page() {
  return (
    <PhasePlaceholder
      phase={5}
      title="Instalasi Listrik Gedung"
      intro="Modul instalasi gedung: panel utama dan sub-panel, feeder tiga fase, ATS dengan generator, dan sistem darurat."
      plans={['Main dan sub distribution panel tiga fase', 'Transfer suplai PLN–genset', 'Penerangan darurat, deteksi asap, dan alarm kebakaran', 'Hierarki proteksi dari MCCB ke MCB']}
      nowCanDo="Susun feeder tiga fase dengan sumber 3 phase, MCCB, busbar, dan MCB 3P/4P di workspace."
    />
  );
}
