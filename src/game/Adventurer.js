import Stats from "./Stats";

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
        this.stats = Stats.combine(this.stats, card.stats);
    }

    removeCard(equipmentType) {
        let card = this.cardSlots[equipmentType];
        if (card == null) {
            return;
        }

        this.stats = Stats.subtract(this.stats, card.stats);
        this.cardSlots[card.equipmentType] = null;
    }
}