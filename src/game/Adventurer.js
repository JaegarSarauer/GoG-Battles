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

    damage(damage) {

    }

    applyCard(card) {
        if (card == null) {
            return;
        }
        
        this.stats = Stats.combine(this.stats, card.stats);
    }

    removeCard(card) {
        if (card == null) {
            return;
        }
        
        this.stats = Stats.subtract(this.stats, card.stats);
    }
}