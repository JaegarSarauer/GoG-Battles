import Adventurer from "./Adventurer";

export default class Team {
    constructor(accountName) {
        this.accountName = accountName;
        this.adventurers = [new Adventurer(), new Adventurer(), new Adventurer(), new Adventurer(), new Adventurer()];
    }

    getCardsUsed() {
        let cards = {}; //id: amount
        for (let i = 0; i < this.adventurers.length; ++i) {
            let advCards = this.adventurers[i].getCardsUsed();
            let advCardKeys = Object.keys(advCards);
            for (let i = 0; i < advCardKeys.length; ++i) {
                if (!cards[advCardKeys[i]]) {
                    cards[advCardKeys[i]] = 0;
                }
                cards[advCardKeys[i]] += advCards[advCardKeys[i]];
            }
        }
        return cards;
    }

    applyDamage(advID, damage) {
        if (this.adventurers[advID] == null) {
            console.error('Could not apply damage to null adv.');
            return;
        }
        this.adventurers[advID].damage(damage);
    }

    getRandomAdventurer() {
        let size = this.adventurers.length - 0.000001;
        return this.adventurers[Math.floor(Math.random() * size)];
    }

    stillFighting() {
        return this.adventurers.length > 0;
    }
}