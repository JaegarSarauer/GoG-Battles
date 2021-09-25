export default class Stats {
    constructor(offenseStats = [0, 0, 0], defenseStats = [0, 0, 0], hp = 0) {
        this.offense = offenseStats;
        this.defense = defenseStats;
        this.hp = hp;
    }

    multiply(modifierQuality) {
        for (let i = 0; i < 3; ++i) {
            this.offense[i] *= modifierQuality;
            this.defense[i] *= modifierQuality;
        }
        this.hp *= modifierQuality;
    }

    static combine(stats1, stats2) {
        let newStats = new Stats();
        for (let i = 0; i < 3; ++i) {
            newStats.offense[i] = stats1.offense[i] + stats2.offense[i];
            newStats.defense[i] = stats1.defense[i] + stats2.defense[i];
        }
        newStats.hp = stats1.hp + stats2.hp;
        return newStats;
    }
}