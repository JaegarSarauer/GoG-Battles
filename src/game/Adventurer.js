

export default class Adventurer {
    constructor() {
        this.hp = 100;
        this.offense = [0, 0, 0];
        this.defense = [0, 0, 0];
        this.cardSlots = {
            HELMET: null,
            CHEST: null,
            LEGS: null,
            WEAPON: null,
            SHIELD: null,
            AMULET: null,
        };
        this.attackClass = EquipmentClass.MELEE;
    }

    applyCard(card) {
        let offenseStats = [0, 0, 0];
        let defenseStats = [0, 0, 0];

        if (card == null) {
            return;
        }
        
        if (isTypeAmulet(card)) {
            offenseStats = AmuletOffensePointLookup(card.subType, card.tier);
            defenseStats = AmuletDefensePointLookup(card.subType, card.tier);
        } else {
            if (isTypeWeapon(card)) {
                this.attackClass = card.equipmentClass;
                offenseStats = OffensePointLookup(card.equipmentType, card.tier);
            } else {
                defenseStats = DefensePointLookup(card.equipmentType, card.tier);
            }
        }

        for (let i = 0; i < 3; ++i) {
            this.offense[i] += offenseStats[i];
            this.defense[i] += defenseStats[i];
        }

        //handle HP
        if (defenseStats.length == 4) {
            this.hp += defenseStats[3];
        }
    }
}