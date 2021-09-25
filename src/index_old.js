

const DefensePointLookup = (equipClass, tier) => {
    //Each entry is in melee, magic, range
    const defenseTable = {
        MELEE: [
            [1, -17, 0],
            [2, -11, 0],
            [4, -7, 0],
            [7, -4, 0],
            [11, -2, 0],
            [17, -1, 0],
        ],
        MAGIC: [
            [0, 1, -17],
            [0, 2, -11],
            [0, 4, -7],
            [0, 7, -4],
            [0, 11, -2],
            [0, 17, -1],
        ],
        RANGED: [
            [-17, 0, 1],
            [-11, 0, 2],
            [-7, 0, 4],
            [-4, 0, 7],
            [-2, 0, 11],
            [-1, 0, 17],
        ],
    };
    return defenseTable[equipClass][tier];
};

const OffensePointLookup = (equipClass, tier) => {
    //Each entry is in melee, magic, range
    const offenseTable = {
        MELEE: [
            [0, -17, 1],
            [0, -11, 2],
            [0, -7, 4],
            [0, -4, 7],
            [0, -2, 11],
            [0, -1, 17],
        ],
        MAGIC: [
            [1, 0, -17],
            [2, 0, -11],
            [4, 0, -7],
            [7, 0, -4],
            [11, 0, -2],
            [17, 0, -1],
        ],
        RANGED: [
            [-17, 1, 0],
            [-11, 2, 0],
            [-7, 4, 0],
            [-4, 7, 0],
            [-2, 11, 0],
            [-1, 17, 0],
        ],
    };
    return offenseTable[equipClass][tier];
};

const AmuletDefensePointLookup = (amuletType, tier) => {
    if (amuletType == 'NONE') {
        console.error('Parsing wrong amulet type! Likely not an amulet.');
        return [0, 0, 0, 0];
    }
    //Each entry is in melee, magic, range, HP
    const defenseTable = Object.freeze({
        FOCUS: [0, 0, 0, 0],
        POWER: [1, 0, 0, 0],
        DEFENSE: [2, 2, 2, 0],
        MAGIC: [0, 1, 0, 0],
        RANGED: [0, 0, 1, 0],
        HEALTH: [0, 0, 0, 10],
    });
    let res = defenseTable[amuletType][tier];
    for (let i = 0; i < res.length; ++i) {
        res[i] *= tier;
    }
    return res;
};

const AmuletOffensePointLookup = (amuletType, tier) => {
    if (amuletType == 'NONE') {
        console.error('Parsing wrong amulet type! Likely not an amulet.');
        return [0, 0, 0];
    }
    //Each entry is in melee, magic, range
    const defenseTable = Object.freeze({
        FOCUS: [1, 1, 1],
        POWER: [3, 0, -1],
        DEFENSE: [0, 0, 0],
        MAGIC: [-1, 3, 0],
        RANGED: [0, -1, 3],
        HEALTH: [0, 0, 0],
    });
    let res = defenseTable[amuletType][tier];
    for (let i = 0; i < res.length; ++i) {
        res[i] *= tier;
    }
    return res;
};

const isTypeAmulet = (card) => {
    return card.equipmentType == 'AMULET';
};


const isTypeWeapon = (card) => {
    return card.equipmentType == 'WEAPON';
};

//Tier is 0 through 5, 6 options.


const createAdventurerTeam = (adventurers) => {
    let advTeam = AdventurerTeam;
    if (adventurers.length != AdventurerTeamSize) {
        console.error('Adventurer team size is not 5!');
        return;
    }

    for (let i = 0; i < AdventurerTeamSize; ++i) {
        adventurers.advID = i;
        advTeam.push(adventurers[i]);
    }
}
