import {CardCatalog, GetSmallestCardTokenValue} from './Card';
/*


*/

class BattleManager {
    constructor() {
        this.battleIDCounter = 0;

        this.battleQueue = [];
        this.battles = {};
    }

    joinBattleQueue(team) {
        for (let i = 0; i < this.battleQueue.length; ++i) {
            if (this.battleQueue[i].accountName == team.accountName) {
                console.error('you are already in battle queue')
                return;
            }
        }
        this.battleQueue.push(team);
        this.tryCreateBattle();
    }

    tryCreateBattle() {
        if (this.battleQueue.length >= 2) {
            let team1 = this.battleQueue.shift();
            let team2 = null;
            for (let i = 0; i < this.battleQueue.length; ++i) {
                if (this.battleQueue[i].accountName != team1.accountName) {
                    team2 = this.battleQueue[i];
                    break;
                }
            }
            if (team1 != null && team2 != null) {
                let battle = new Battle(this.battleIDCounter++, team1, team2);
                this.battles[battle.battleID] = battle;
            }
        }
    }

    completeBattle(battleID) {

    }

    validateBattle() {

    }
}

class BattleLog {
    constructor() {

    }
}

class Battle {
    constructor(battleID, team1, team2) {
        this.battleID = battleID;
        this.team1 = team1;
        this.team2 = team2;

        this.turn = 0;
    }

    _getTeam(teamID) {
        return teamID == 0 ? this.team1 : this.team2;
    }

    //setup cards and default combat attacks
    setupBattle(teamID) {

    }

    setTurn() {

    }
}

const BattleMove = {
    ATTACK: 'ATTACK',
    DEFEND: 'DEFEND',
    SUPPORT: 'SUPPORT'
};

const BattleMoveToData = {
    ATTACK: 0,
    DEFEND: 1,
    SUPPORT: 2,
};

const DataToBattleMove = {
    0: BattleMove.ATTACK,
    1: BattleMove.DEFEND,
    2: BattleMove.SUPPORT
};

class BattleTurn {
    constructor() {
        this.advMoves = [];
    }    

    setMove(advID, move) {

    }

    toData() {
        let data = {};
        for (let i = 0; i < 5; ++i) {
            if (this.advMoves[i] == null) {
                continue;
            }
            data[i] = BattleMoveToData[this.advMoves[i]];
        }
        return data;
    }

    fromData(data) {
        let advIDs = Object.keys(this.advMoves);
        for (let i = 0; i < advIDs.length; ++i) {
            let advID = advIDs[i];
            this.advMoves[advID] = DataToBattleMove[data[advID]];
        }
    }
}

// players setup their adventurers and their cards
// join battle queue with GAME wager
// once 2+ players added to queue, grab top 2.
// if you are included in the battle, simulate it
    // ability to view battles you are not a part of on the home screen

// simulation:
// player with the lowest amount of cards in play goes first, or random roll
// each players setup a turn for each of their adventurers
    // player adv attacks other player adv, then next team goes until turn is done
// each side signs their move
// players have 1 minute to make their move, or the simulation is auto assigned



const battleManagerInstance = new BattleManager();
export default battleManagerInstance;