export class MoveResult {
    constructor() {
        this.history = [];
        this.moves = [{}, {}, {}, {}, {}];
    }

    addMoveResult(advID, defenderID, damage, didKill) {
        this.moves[advID] = {
            defenderAdvID: defenderID,
            damage,
            didKill 
        };
    }

    reset() {
        this.history.push(this.moves);
        this.moves = [{}, {}, {}, {}, {}];
    }
}