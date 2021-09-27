import {CardCatalog} from './Card';
/*


*/

class CardGenerator {
    constructor() {
        this.cardCatalogIndex = 0;
    }

    rollCards(GOGTokenAmount) {
        let tokensLeft = GOGTokenAmount;
        let tokensAwarded = 0;
        let cardsAwarded = [];

        while (tokensLeft > 0) {
            if (tokensLeft < 5) {
                tokensAwarded += tokensLeft;
                tokensLeft = 0;
            } else {
                let card = this._rollFromCardList(tokensLeft);
                tokensLeft -= card.GOGTokenValue;
                cardsAwarded.push(card);
            }
        }

        return {
            tokensAwarded, cardsAwarded
        };
    }

    _rollFromCardList(GOGTokenAmount) {
        let rollingCard = CardCatalog[this.cardCatalogIndex];
        //Check if they deposited enough tokens to earn this card.
        if (rollingCard.GOGTokenValue <= GOGTokenAmount) {
            let roll = Math.random() * rollingCard.rollChance;
            if (roll <= 1) {
                this.cardCatalogIndex = (this.cardCatalogIndex + 1) % CardCatalog.length;
                return rollingCard;
            } else {
                this.cardCatalogIndex = (this.cardCatalogIndex + 1) % CardCatalog.length;
                return this._rollFromCardList(GOGTokenAmount);
            }
        } else {
            this.cardCatalogIndex = (this.cardCatalogIndex + 1) % CardCatalog.length;
            return this._rollFromCardList(GOGTokenAmount);
        }
    }
}


const cardGeneratorInstance = new CardGenerator();
export default cardGeneratorInstance;