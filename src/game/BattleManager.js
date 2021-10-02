import {CardCatalog, GetSmallestCardTokenValue} from './Card';
/*


*/

class BattleManager {
    constructor() {
        this.battleQueue = [];
    }

    createBattle(team1, team2) {

    }


}

class Battle {
    constructor(team1, team2) {
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

const BattleTurn = (adv0Target = null, adv1Target = null, adv2Target = null, adv3Target = null, adv4Target = null, adv5Target = null) => {
    return {
        0: adv0Target,
        1: adv1Target,
        2: adv2Target,
        3: adv3Target,
        4: adv4Target,
    };
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