import { PhasePlaceholder } from '@/components/ui/PhasePlaceholder';

export default function Page() {
  return (
    <PhasePlaceholder
      phase={8}
      title="PLC & Automation"
      intro="Editor ladder diagram dengan scan cycle yang terdefinisi, monitoring I/O, timer, counter, dan sensor."
      plans={['Editor ladder: kontak NO/NC, koil, set/reset, timer, counter', 'Scan cycle PLC yang terdokumentasi', 'Monitoring I/O ON/OFF langsung', 'Sensor, HMI, dan kontrol sekuensial']}
      nowCanDo="Tempatkan PLC kompak, sensor proximity/photoelectric, dan solenoid valve dan hubungkan terminal 24 V DC dan sinyalnya."
    />
  );
}
