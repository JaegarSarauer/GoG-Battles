import Stats from './Stats';

export const AdventurerTeamSize = 5;

export const EquipmentClass = {
    MELEE: 'MELEE',
    MAGIC: 'MAGIC',
    RANGED: 'RANGED',
    ALL: 'ALL',
};

export const EquipmentClassToIndex = {
    MELEE: 0,
    MAGIC: 1,
    RANGED: 2,
    ALL: 3,
};

export const EquipmentType = {
    HELMET: 'HELMET',
    CHEST: 'CHEST',
    LEGS: 'LEGS',
    WEAPON: 'WEAPON',
    SHIELD: 'SHIELD',
    AMULET: 'AMULET',
};

export const SubType = {
    NONE: 'NONE',
    FOCUS: 'FOCUS',
    POWER: 'POWER',
    DEFENSE: 'DEFENSE',
    MAGIC: 'MAGIC',
    RANGED: 'RANGED',
    HEALTH: 'HEALTH'
};

export const RarityTier = {
    COMMON: 'COMMON',
    UNCOMMON: 'UNCOMMON',
    RARE: 'RARE',
    MYTHICAL: 'MYTHICAL',
    ROYAL: 'ROYAL',
    GODLY: 'GODLY',
    ULTIMATE: 'ULTIMATE'
};

export const RarityTierToPoint = {
    COMMON: 0,
    UNCOMMON: 5,
    RARE: 10,
    MYTHICAL: 20,
    ROYAL: 30,
    GODLY: 40,
    ULTIMATE: 50,
};

export const CalculateRollChance = (rarityTierPoints, modifierRarityPoints) => {
    let totalPoints = rarityTierPoints + modifierRarityPoints;
    return 5 + Math.pow(totalPoints, 4.73);
};

export const RarityPointToTier = (points) => {
    if (points < RarityTierToPoint.UNCOMMON) {
        return RarityTier.COMMON;
    } else if (points < RarityTierToPoint.RARE) {
        return RarityTier.UNCOMMON;
    } else if (points < RarityTierToPoint.MYTHICAL) {
        return RarityTier.RARE;
    } else if (points < RarityTierToPoint.ROYAL) {
        return RarityTier.MYTHICAL;
    } else if (points < RarityTierToPoint.GODLY) {
        return RarityTier.ROYAL;
    } else if (points < RarityTierToPoint.ULTIMATE) {
        return RarityTier.GODLY;
    } else {
        return RarityTier.ULTIMATE;
    }
};

export const Modifiers = {
    NONE: {
        id: 'NONE',
        rarityPoints: [0],
        rollChances: [1000000],
        stats: new Stats(),
    },
    POWER: {
        id: 'POWER',
        rarityPoints: [1, 3, 4, 12, 15],
        rollChances: [200000, 100000, 50000, 1000, 500],
        stats: new Stats([1, 0, 0])
    },
    PARRY: {
        id: 'PARRY',
        rarityPoints: [1, 3, 4, 12, 15],
        rollChances: [200000, 100000, 50000, 1000, 500],
        stats: new Stats([0, 0, 0], [1, 0, 0])
    },
    REFORGED: {
        id: 'REFORGED',
        rarityPoints: [3, 5, 8, 12, 17],
        rollChances: [100000, 75000, 5000, 1000, 100],
        stats: new Stats([1, 0, 0], [1, 0, 0])
    },
    INTELLECT: {
        id: 'INTELLECT',
        rarityPoints: [1, 3, 4, 12, 15],
        rollChances: [200000, 100000, 50000, 1000, 500],
        stats: new Stats([0, 1, 0])
    },
    AURA: {
        id: 'AURA',
        rarityPoints: [1, 3, 4, 12, 15],
        rollChances: [200000, 100000, 50000, 1000, 500],
        stats: new Stats([0, 0, 0], [0, 1, 0])
    },
    ELEMENTAL: {
        id: 'ELEMENTAL',
        rarityPoints: [3, 5, 8, 12, 17],
        rollChances: [100000, 75000, 5000, 1000, 100],
        stats: new Stats([0, 1, 0], [0, 1, 0])
    },
    EAGLE_EYE: {
        id: 'EAGLE_EYE',
        rarityPoints: [1, 3, 4, 12, 15],
        rollChances: [200000, 100000, 50000, 1000, 500],
        stats: new Stats([0, 0, 1])
    },
    AGILE: {
        id: 'AGILE',
        rarityPoints: [1, 3, 4, 12, 15],
        rollChances: [200000, 100000, 50000, 1000, 500],
        stats: new Stats([0, 0, 0], [0, 0, 1])
    },
    ASSASSIN: {
        id: 'ASSASSIN',
        rarityPoints: [3, 5, 8, 12, 17],
        rollChances: [100000, 75000, 5000, 1000, 100],
        stats: new Stats([0, 0, 1], [0, 0, 1])
    },
    BERSERK: {
        id: 'BERSERK',
        rarityPoints: [5, 7, 15, 35, 40],
        rollChances: [10000, 5000, 500, 100, 50],
        stats: new Stats([1, 1, 1], [0, 0, 0])
    },
    TANK: {
        id: 'TANK',
        rarityPoints: [5, 7, 15, 35, 40],
        rollChances: [10000, 5000, 500, 100, 50],
        stats: new Stats([0, 0, 0], [1, 1, 1])
    },
    DIVINE: {
        id: 'DIVINE',
        rarityPoints: [10, 20, 35, 40, 50],
        rollChances: [1000, 250, 50, 10, 1],
        stats: new Stats([1, 1, 1], [1, 1, 1])
    },
};

export const BattleMove = {
    ATTACK_ADV0: 'ATTACK_ADV0',
    ATTACK_ADV1: 'ATTACK_ADV1',
    ATTACK_ADV2: 'ATTACK_ADV2',
    ATTACK_ADV3: 'ATTACK_ADV3',
    ATTACK_ADV4: 'ATTACK_ADV4',
    ATTACK_WEAKEST: 'ATTACK_WEAKEST',
    ATTACK_STRONGEST: 'ATTACK_STRONGEST'
};

export const BattleMoveToData = {
    ATTACK_ADV0: 0,
    ATTACK_ADV1: 1,
    ATTACK_ADV2: 2,
    ATTACK_ADV3: 3,
    ATTACK_ADV4: 4,
    ATTACK_WEAKEST: 5,
    ATTACK_STRONGEST: 6
};

export const DataToBattleMove = {
    0: BattleMove.ATTACK_ADV0,
    1: BattleMove.ATTACK_ADV1,
    2: BattleMove.ATTACK_ADV2,
    3: BattleMove.ATTACK_ADV3,
    4: BattleMove.ATTACK_ADV4,
    5: BattleMove.ATTACK_WEAKEST,
    6: BattleMove.ATTACK_STRONGEST
};