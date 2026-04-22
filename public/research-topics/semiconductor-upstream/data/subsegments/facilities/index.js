import cleanroomEpc from './cleanroom-epc.js';
import upwSystems from './upw-systems.js';
import gasChemicalDelivery from './gas-chemical-delivery.js';
import exhaustVacuum from './exhaust-vacuum.js';
import rfPowerMatching from './rf-power-matching.js';

export default {
  section: '工程 / 厂务',
  hint: '最容易被忽视，但直接决定 fab 能否顺利拉坡',
  items: [cleanroomEpc, upwSystems, gasChemicalDelivery, exhaustVacuum, rfPowerMatching]
};
