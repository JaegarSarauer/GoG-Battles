import Stats from "./Stats";
import { EquipmentClass } from "./Constants";

export default class Adventurer {
    constructor() {
        this.stats = new Stats();
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
        this.stats.hp = Math.max(0, this.stats.hp - Math.max(0, damage));
    }

    heal(healHP) {
        this.stats.hp += Math.max(0, healHP);
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