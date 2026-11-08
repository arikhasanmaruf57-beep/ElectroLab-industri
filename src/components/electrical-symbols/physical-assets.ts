import type { ComponentDefinition } from '@/types/component';

/** Aset fisik komponen yang tersedia di public/component-assets. */
const PHYSICAL_ASSETS: Record<string, string> = {
  'mcb-1p': '/component-assets/mcb-1p/physical.png',
  'mcb-2p': '/component-assets/mcb-2p/physical.png',
  'mcb-3p': '/component-assets/mcb-3p/physical.png',
  'mcb-4p': '/component-assets/mcb-4p/physical.png',
  'mccb-3p': '/component-assets/mccb-3p/physical.png',
  'rccb-2p': '/component-assets/rccb-2p/physical.png',
  'rccb-4p': '/component-assets/rccb-4p/physical.png',
  'rcbo-2p': '/component-assets/rcbo-2p/physical.png',
  'mpcb-3p': '/component-assets/mpcb-3p/physical.png',
  'main-switch-3p': '/component-assets/main-switch-3p/physical.png',
  'fuse-1p': '/component-assets/fuse-1p/physical.png',
  'tor-3p': '/component-assets/tor-3p/physical.png',
  'spd-1p': '/component-assets/spd-1p/physical.png',
  'pb-start-no': '/component-assets/pb-start-no/physical.svg',
  'pb-stop-nc': '/component-assets/pb-stop-nc/physical.svg',
  'estop': '/component-assets/estop/physical.svg',
  'pb-jog': '/component-assets/pb-jog/physical.svg',
  'pb-reset': '/component-assets/pb-reset/physical.svg',
  'selector-switch': '/component-assets/selector-switch/physical.svg',
  'limit-switch': '/component-assets/limit-switch/physical.svg',
  'contactor-3p': '/component-assets/contactor-3p/physical.svg',
  'relay-aux': '/component-assets/relay-aux/physical.svg',
  'timer-on-delay': '/component-assets/timer-on-delay/physical.svg',
  'timer-off-delay': '/component-assets/timer-off-delay/physical.svg',
  'star-delta-timer': '/component-assets/star-delta-timer/physical.svg',
};

export function getPhysicalAsset(def: ComponentDefinition): string | undefined {
  return PHYSICAL_ASSETS[def.type];
}
