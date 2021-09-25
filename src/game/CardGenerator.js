/*


*/

class CardGenerator {
    constructor() {
        
    }

    rollRarityPoints

    rollModifier() {
        let roll = Math.floor(Math.random() * 1000000);
        for (let i = 0; i < this.modifierAndRollChancePairArray.length; ++i) {
            let rollWeight = this.modifierAndRollChancePairArray[i][1];
            roll -= rollWeight;
            if (roll <= 0) {
                
            }
        }
    }

    generateCardsWinner(GOGTokenAmount) {

    }
}


const cardGeneratorInstance = new CardGenerator();

//module.exports.i = cardGeneratorInstance;