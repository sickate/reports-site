import siliconWafers from './silicon-wafers.js';
import photomasks from './photomasks.js';
import photoresist from './photoresist.js';
import lithographyAncillaries from './lithography-ancillaries.js';
import electronicGases from './electronic-gases.js';
import wetChemicals from './wet-chemicals.js';
import cmpMaterials from './cmp-materials.js';
import sputteringTargets from './sputtering-targets.js';
import abfSubstrates from './abf-substrates.js';
import btSubstrates from './bt-substrates.js';
import interconnectSolders from './interconnect-solders.js';
import moldingCompounds from './molding-compounds.js';
import underfillMuf from './underfill-muf.js';
import dieAttachMaterials from './die-attach-materials.js';
import leadframes from './leadframes.js';
import bondingWires from './bonding-wires.js';
import temporaryBonding from './temporary-bonding.js';
import rdlDielectrics from './rdl-dielectrics.js';
import platingChemicals from './plating-chemicals.js';
import sphericalSilica from './spherical-silica.js';
import ceramicFillers from './ceramic-fillers.js';
import solderPowdersAlloys from './solder-powders-alloys.js';
import advancedPackagingPolymers from './advanced-packaging-polymers.js';

export default {
  section: '材料',
  hint: '前道卡制程窗口，封装侧卡载板、聚合物与可靠性材料',
  items: [
    siliconWafers,
    photomasks,
    photoresist,
    lithographyAncillaries,
    electronicGases,
    wetChemicals,
    cmpMaterials,
    sputteringTargets,
    abfSubstrates,
    btSubstrates,
    interconnectSolders,
    moldingCompounds,
    underfillMuf,
    dieAttachMaterials,
    leadframes,
    bondingWires,
    temporaryBonding,
    rdlDielectrics,
    platingChemicals,
    sphericalSilica,
    ceramicFillers,
    solderPowdersAlloys,
    advancedPackagingPolymers,
  ],
};
