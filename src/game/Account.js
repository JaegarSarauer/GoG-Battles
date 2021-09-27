export default class Account {
    constructor(accountID) {
        this.accountID = accountID;
        this.cards = {}; //id, amount
        this.GAMEToken = 0;
        this.USDC = 0;
        this.USDCInSystem = 0;
    }

    addUSDC(usdc) {
        this.USDC += usdc;
    }

    addCards(cardArray) {
        for (let i = 0; i < cardArray; ++i) {
            let card = cardArray[i];
            if (this.cards[card.cardID] == null) {
                this.cards[card.cardID] = 0;
            } 
            this.cards[card.cardID] += 1;
        }
    }
}