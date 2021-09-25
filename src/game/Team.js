const { Adventurer } = require("./Adventurer");

class Team {
    constructor() {
        this.adventurers = [new Adventurer(), new Adventurer(), new Adventurer(), new Adventurer(), new Adventurer()];
    }

    applyDamage(advID, damage) {
        if (this.adventurers[advID] == null) {
            console.error('Could not apply damage to null adv.');
            return;
        }
        this.adventurers[advID].hp -= damage;
        if (this.adventurers[advID].hp <= 0) {
            this.adventurers[advID] = null;
        }
    }

    getRandomAdventurer() {
        let size = this.adventurers.length - 0.000001;
        return this.adventurers[Math.floor(Math.random() * size)];
    }

    stillFighting() {
        return this.adventurers.length > 0;
    }
}

//module.exports.Team = Team;