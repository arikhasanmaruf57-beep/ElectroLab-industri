import { useEffect, useState } from 'react';

/** true setelah komponen terpasang di klien — mencegah mismatch hidrasi untuk data localStorage. */
export function useMounted(): boolean {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
