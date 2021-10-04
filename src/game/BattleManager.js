import {CardCatalog, GetSmallestCardTokenValue} from './Card';
import { BattleMove } from './Constants';
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
                console.error('you are already in battle queue');
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
                    team2 = this.battleQueue.splice(i, 1)[0];
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
        this.setupLogs = [];
        this.battleLogs = [];
        this.resultLogs = [];
    }

    logBattleSetup() {
        let log = {

        };
        this.setupLogs.push();
    }

    logBattleTurn() {

    }

    logBattleResult() {

    }
}


/*
Players join battle queue until two unique teams are in queue
battle starts:
    first round is setup round. 
        you can make changes to your team gear
        you setup your default attack move stances
*/
class Battle {
    constructor(battleID, team1, team2) {
        this.battleID = battleID;
        this.team1 = team1;
        this.team2 = team2;

        this.teamTurn = 0;

        this.turn = 0;
        this.battleStartTimestamp = new Date().getTime();
        this.battleInterval = setInterval(() => {
            this.runTeamTurns();
        }, 5000);

        this.log = new BattleLog();
    }

    _getTeam(teamID) {
        return teamID == 0 ? this.team1 : this.team2;
    }

    //setup cards and default combat attacks
    setCards(teamID, arrayOfAdvCards) {
        if (this.turn != 0) {
            return false;
        }

        let team = this._getTeam(teamID);
        team.setCards(arrayOfAdvCards);
    }

    setBattleTurn(teamID, battleTurn) {
        let team = this._getTeam(teamID);
        team.setBattleTurn(battleTurn);
    }

    completeBattle() {
        clearInterval(this.battleInterval);

    }

    checkBattleWin() {
        let team1Alive = false;
        let team2Alive = false;

        for (let i = 0; i < 5; ++i) {
            let team1Adv = this.team1.adventurers[i];
            let team2Adv = this.team2.adventurers[i];
            if (!team1Adv.isDead()) {
                team1Alive = true;
            }
            if (!team2Adv.isDead()) {
                team2Alive = true;
            }
        }

        if (!team2Alive) { // Team 2 is dead, team 1 win

        } else if (!team1Alive) { // Team 1 is dead, team 2 win

        }
    }

    runTeamTurns() {
        let team1CardCount = this._getTeam(0).getCardCountUsed();
        let team2CardCount = this._getTeam(1).getCardCountUsed();
        this.teamTurn = (team1CardCount < team2CardCount) ? 0 : 1;

        let teamFirst = this._getTeam(this.teamTurn);
        let teamSecond = this._getTeam(Math.abs(this.teamTurn - 1));
        let teamFirstMoveID = -1;
        let teamSecondMoveID = -1;
        for (let i = 0; i < 5; ++i) {
            while (++teamFirstMoveID < 5 && !this.runMove(teamFirstMoveID, teamFirst, teamSecond)) {}
            while (++teamSecondMoveID < 5 && !this.runMove(teamSecondMoveID, teamSecond, teamFirst)) {}
        }

        ++this.turn;
    }

    runMove(moveID, attackingTeam, defendingTeam) {
        let advIDToMove = attackingTeam.battleTurn.advOrder[moveID];
        let advMove = attackingTeam.battleTurn.advMoves[advIDToMove];

        if (attackingTeam.adventurers[advIDToMove].isDead()) {
            return false;
        }

        if (!this._runMove(advMove, attackingTeam, advIDToMove, defendingTeam)) {
            this.checkBattleWin();
        }
        return true;
    }

    _getStartingDefenderAdventurerID(advMove, defendingTeam) {
        let defenderAdvID = 0;
        switch(advMove) {
            case BattleMove.ATTACK_ADV0:
                defenderAdvID = 0;
            break;
            case BattleMove.ATTACK_ADV1:
                defenderAdvID = 1;
            break;
            case BattleMove.ATTACK_ADV2:
                defenderAdvID = 2;
            break;
            case BattleMove.ATTACK_ADV3:
                defenderAdvID = 3;
            break;
            case BattleMove.ATTACK_ADV4:
                defenderAdvID = 4;
            break;
            case BattleMove.ATTACK_WEAKEST:
                let lowestHP = 9999999999;
                for (let i = 0; i < 5; ++i) {
                    let defAdv = defendingTeam.adventurers[i];
                    if (!defAdv.isDead() && defAdv.stats.hp < lowestHP) {
                        lowestHP = defendingTeam.adventurers[i].stats.hp;
                        defenderAdvID = i;
                    }
                }
            break;
            case BattleMove.ATTACK_STRONGEST:
                let highestHP = -1;
                for (let i = 0; i < 5; ++i) {
                    let defAdv = defendingTeam.adventurers[i];
                    if (!defAdv.isDead() && defAdv.stats.hp > highestHP) {
                        highestHP = defendingTeam.adventurers[i].stats.hp;
                        defenderAdvID = i;
                    }
                }
            break;
        }
        return defenderAdvID;
    }

    /*
    Returns if the move was successful.
    false is if:
     - No adventurers are alive on defending team
    */
    _runMove(advMove, attackingTeam, atkAdvID, defendingTeam) {
        let defenderAdvID = this._getStartingDefenderAdventurerID(advMove, defendingTeam);
        let validDefenderFound = false;
        for (let i = 0; i < 5; ++i) {
            if (!defendingTeam.adventurers[defenderAdvID].isDead()) {
                validDefenderFound = true;
                break;
            }
            defenderAdvID = (++defenderAdvID % 5);
        }

        if (validDefenderFound) {
            console.info(defendingTeam.adventurers[defenderAdvID], defenderAdvID, attackingTeam.adventurers[atkAdvID], atkAdvID)
            defendingTeam.adventurers[defenderAdvID].attack(attackingTeam.adventurers[atkAdvID].stats);
            return true;
        } else {
            return false;
        }
    }
}

export class BattleTurn {
    constructor() {
        this.advOrder = [0, 1, 2, 3, 4];
        this.advMoves = [BattleMove.ATTACK_ADV0, BattleMove.ATTACK_ADV1, BattleMove.ATTACK_ADV2, BattleMove.ATTACK_ADV3, BattleMove.ATTACK_ADV4];
    }    

    static default() {
        return new BattleTurn();
    }

    setMove(advID, move) {
        this.advMoves[advID] = move;
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