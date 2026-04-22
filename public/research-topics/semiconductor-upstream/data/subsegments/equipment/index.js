import lithographyScanners from './lithography-scanners.js';
import trackSystems from './track-systems.js';
import etchEquipment from './etch-equipment.js';
import depositionEquipment from './deposition-equipment.js';
import cleaningEquipment from './cleaning-equipment.js';
import cmpEquipment from './cmp-equipment.js';
import ionImplant from './ion-implant.js';
import metrologyInspection from './metrology-inspection.js';
import ate from './ate.js';
import probersHandlers from './probers-handlers.js';
import advancedPackagingEquipment from './advanced-packaging-equipment.js';

export default {
  section: '设备',
  hint: '最核心的资本开支入口，也是先进制程最显性的卡位环节',
  items: [
    lithographyScanners,
    trackSystems,
    etchEquipment,
    depositionEquipment,
    cleaningEquipment,
    cmpEquipment,
    ionImplant,
    metrologyInspection,
    ate,
    probersHandlers,
    advancedPackagingEquipment
  ]
};
