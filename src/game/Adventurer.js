import Stats from "./Stats";
import { EquipmentClassToIndex } from "./Constants";

export default class Adventurer {
    constructor() {
        this.stats = new Stats([0,0,0],[0,0,0],100);
        this.cardSlots = {
            HELMET: null,
            CHEST: null,
            LEGS: null,
            WEAPON: null,
            SHIELD: null,
            AMULET: null,
        };
    }

    getCardsUsed() {
        let cards = {}; //id: amount
        let cardSlotKeys = Object.keys(this.cardSlots);
        for (let i = 0; i < cardSlotKeys.length; ++i) {
            let card = this.cardSlots[cardSlotKeys[i]];
            if (card == null) {
                continue;
            }
            if (!cards[card.cardID]) {
                cards[card.cardID] = 0;
            }
            cards[card.cardID] += 1;
        }
        return cards;
    }

    // Returns damage applied
    damage(damage) {
        this.stats.hp = Math.max(0, this.stats.hp - Math.max(0, Math.floor(damage)));
    }

    attack(attackerStats) {
        let atkStyle = attackerStats.getAttackClass();
        let atkPoints = attackerStats.offense[EquipmentClassToIndex[atkStyle]];
        let defPoints = this.stats.defense[EquipmentClassToIndex[atkStyle]];
        let pointsDifference = atkPoints - defPoints;
        let dmgAmount = 0;
        if (pointsDifference > 0) {
            dmgAmount = Math.round(5 + Math.pow(pointsDifference, 1.24));
        } else if (pointsDifference <= 0) {
            dmgAmount = Math.ceil(Math.max(1, 5 + pointsDifference));
        }
        this.damage(dmgAmount);
    }

    heal(healHP) {
        this.stats.hp += Math.max(0, Math.ceil(healHP));
    }

    isDead() {
        return this.stats.hp <= 0;
    }

    applyCard(card) {
        if (card == null) {
            return;
        }

        if (this.cardSlots[card.equipmentType]) {
            this.removeCard(card.equipmentType);
        }

        this.cardSlots[card.equipmentType] = card;
        this.stats = Stats.combine(this.stats, card.totalStats);
    }

    removeCard(equipmentType) {
        let card = this.cardSlots[equipmentType];
        if (card == null) {
            return;
        }

        this.stats = Stats.subtract(this.stats, card.totalStats);
        this.cardSlots[card.equipmentType] = null;
    }
}