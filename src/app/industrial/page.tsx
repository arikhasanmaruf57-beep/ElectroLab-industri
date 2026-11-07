import { PhasePlaceholder } from '@/components/ui/PhasePlaceholder';

export default function Page() {
  return (
    <PhasePlaceholder
      phase={6}
      title="Industrial Motor Control"
      intro="Rangkaian kontrol motor industri: DOL, Forward-Reverse, Star-Delta, jogging, dan kontrol sekuensial, dengan pemisahan rangkaian daya dan kontrol."
      plans={['DOL starter dengan self-holding dan proteksi overload', 'Forward-Reverse dengan interlock listrik dan mekanis', 'Star-Delta khusus motor 6 terminal', 'Dua kecepatan, sekuensial, dan motor bergantian']}
      nowCanDo="Pasang MCCB, kontaktor, TOR, push button, dan motor 6 terminal di workspace; terminal kumparan, kontak, dan daya sudah dibedakan."
    />
  );
}
