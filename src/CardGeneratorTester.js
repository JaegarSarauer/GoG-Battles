import Account from "./game/Account";
import USDCContract from "./game/USDCContract";

export default class CardGeneratorTester {
    constructor() {
        this.usdcContract = new USDCContract();
        this.accounts = [];

        this.stats = {
        };
    }

    createAccounts() {
        const accountsEachAmount = 20;
        let amounts = [10, 50, 100, 500, 1000, 2500, 5000, 10000, 20000, 50000, 100000, 1000000, 50000000];
        for (let c = 0; c < amounts.length; ++c) {
            for (let i = 0; i < accountsEachAmount; ++i) {
                let account = new Account('$' + amounts[c] + ' (' + i + ')');
                account.USDCInSystem += amounts[c];
                let rollResult = this.usdcContract.depositUSDC(account.accountID, amounts[c]);
                account.addCards(rollResult.cardsAwarded);
                account.GAMEToken += rollResult.tokensAwarded;
                this.addStats(amounts[c], rollResult.cardsAwarded);
                this.accounts.push(account);
            }
        }
        console.info(this.stats);
    }

    addStats(accountAmount, cardArray) {
        if (this.stats[accountAmount] == null) {
            this.stats[accountAmount] = {};
        }
        for (let i = 0; i < cardArray.length; ++i) {
            let card = cardArray[i];
            // if (this.stats[accountAmount][card.cardID] == null) {
            //     this.stats[accountAmount][card.cardID] = {
            //         amount: 0,
            //         rarity: card.rarityTier,
            //     };
            // } 
            // this.stats[accountAmount][card.cardID].amount += 1;
            if (!this.stats[accountAmount].totalCards) {
                this.stats[accountAmount].totalCards = 0;
            }
            if (!this.stats[accountAmount][card.rarityTier]) {
                this.stats[accountAmount][card.rarityTier] = 0;
            }
            this.stats[accountAmount][card.rarityTier] += 1;
            this.stats[accountAmount].totalCards += 1;
        }
    }
}