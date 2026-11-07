import { PhasePlaceholder } from '@/components/ui/PhasePlaceholder';

export default function Page() {
  return (
    <PhasePlaceholder
      phase={9}
      title="Learning Center"
      intro="Materi interaktif dari dasar kelistrikan hingga PLC, lengkap dengan simbol, contoh kasus, simulasi, dan kuis."
      plans={['20 materi: dasar listrik, hukum Ohm, 1/3 phase, panel, kontaktor, DOL, Star-Delta, VFD, PLC, keselamatan', 'Ilustrasi dan simbol per materi', 'Simulasi interaktif dan kuis evaluasi', 'Pelacakan progres belajar']}
      nowCanDo="Pelajari simbol, terminal, dan spesifikasi setiap komponen di Component Library."
    />
  );
}
