import Card, { CardCatalog } from './game/Card';
import Account from './game/Account';
import USDCContract from './game/USDCContract';
import CardGeneratorTester from './CardGeneratorTester';
import battleManagerInstance from './game/BattleManager';
import Team from './game/Team';
import { EquipmentType } from './game/Constants';

class Controller {
    constructor() {

    }

    addChild() {}
    render() {}
    destroy() {}
}

class BattleManagerController extends Controller {
    constructor() {
        super();

        this.container = document.createElement('div');
        this.container.style.borderStyle = 'solid';
        this.container.style.borderWidth = 'thin';

        this.battlesQueued = document.createElement('p');
        this.battlesQueued.innerText = 'Players Queued: 0';
        this.container.appendChild(this.battlesQueued);

        setInterval(() => {
            this.battlesQueued.innerText = 'Players Queued: ' + battleManagerInstance.battleQueue.length;
        }, 500);
    }

    render() {
        return this.container;
    }
}

class DropdownFactory extends Controller {
    constructor(dropdownTitle, equipmentType, cards) {
        super();
        this.equipmentType = equipmentType;
        this.dropdown = document.createElement('select');
        this.dropdown.name = dropdownTitle;
        this.buildItems(cards);
    }

    buildItems(cards) {
        let option = document.createElement('option');
        option.text = 'None';
        this.dropdown.add(option);

        let cardIDs = Object.keys(cards);
        for (let i = 0; i < cardIDs.length; ++i) {
            let cardID = cardIDs[i];
            if (CardCatalog[cardID].equipmentType == this.equipmentType) {
                let option = document.createElement('option');
                option.text = CardCatalog[cardID].name;
                option.cardID = cardID;
                this.dropdown.add(option);
            }
        }
    }

    getSelectedCard() {
        if (this.dropdown.selectedOptions[0] == null || this.dropdown.selectedOptions[0].cardID == null) {
            return null;
        }
        return CardCatalog[this.dropdown.selectedOptions[0].cardID];
    }

    render() {
        return this.dropdown;
    }
}

class AdventurerController extends Controller {
    constructor(advID, adventurer, cards) {
        super();

        this.adventurer = adventurer;

        this.container = document.createElement('div');
        this.container.style.borderStyle = 'solid';
        this.container.style.borderWidth = 'thin';

        this.advID = document.createElement('div');
        this.advID.innerText = 'Adventurer ID: ' + advID;
        this.container.appendChild(this.advID);

        this.headSlot = new DropdownFactory('Head Slot', EquipmentType.HELMET, cards);
        this.chestSlot = new DropdownFactory('Chest Slot', EquipmentType.CHEST, cards);
        this.legsSlot = new DropdownFactory('Legs Slot', EquipmentType.LEGS, cards);
        this.weaponSlot = new DropdownFactory('Weapon Slot', EquipmentType.WEAPON, cards);
        this.shieldSlot = new DropdownFactory('Shield Slot', EquipmentType.SHIELD, cards);
        this.amuletSlot = new DropdownFactory('Amulet Slot', EquipmentType.AMULET, cards);

        this.container.appendChild(this.headSlot.dropdown);
        this.container.appendChild(this.chestSlot.dropdown);
        this.container.appendChild(this.legsSlot.dropdown);
        this.container.appendChild(this.weaponSlot.dropdown);
        this.container.appendChild(this.shieldSlot.dropdown);
        this.container.appendChild(this.amuletSlot.dropdown);
    }

    assignCards() {
        let headCard = this.headSlot.getSelectedCard();
        this.adventurer.applyCard(headCard);
        
        let chestCard = this.chestSlot.getSelectedCard();
        this.adventurer.applyCard(chestCard);
        
        let legCard = this.legsSlot.getSelectedCard();
        this.adventurer.applyCard(legCard);
        
        let weaponCard = this.weaponSlot.getSelectedCard();
        this.adventurer.applyCard(weaponCard);
        
        let shieldCard = this.shieldSlot.getSelectedCard();
        this.adventurer.applyCard(shieldCard);
        
        let amuletCard = this.amuletSlot.getSelectedCard();
        this.adventurer.applyCard(amuletCard);
    }

    render() {
        return this.container;
    }
}

class TeamController extends Controller {
    constructor(playerCards, playerTeam) {
        super();

        this.cards = {};
        this.team = playerTeam;

        this.container = document.createElement('div');
        this.container.style.borderStyle = 'solid';
        this.container.style.borderWidth = 'thin';

        this.setCards(playerCards);
    }

    setCards(cards) {
        this.cards = Object.assign({}, cards);

        while(this.container.childNodes.length > 0) {
            this.container.removeChild(this.container.childNodes[0]);
        }

        this.advControllers = [];
        for (let i = 0; i < 5; ++i) {
            this.advControllers.push(new AdventurerController(i, this.team.adventurers[i], this.cards));
            this.container.appendChild(this.advControllers[i].render());
        }
    }

    assignCards() {
        for (let i = 0; i < 5; ++i) {
            this.advControllers[i].assignCards();
        }
    }

    render() {
        return this.container;
    }
}

class AccountController extends Controller {
    constructor(accID) {
        super();
        this.account = new Account(accID);

        this.container = document.createElement('div');
        this.container.style.borderStyle = 'solid';
        this.container.style.borderWidth = 'thin';

        let title = document.createElement('p');
        title.innerText = accID;
        this.container.appendChild(title);

        this.usdcText = document.createElement('p');
        this.usdcText.innerText = 'USDc: $0';
        this.container.appendChild(this.usdcText);

        this.usdcInSystemText = document.createElement('p');
        this.usdcInSystemText.innerText = 'USDc Deposited: $0';
        this.container.appendChild(this.usdcInSystemText);

        this.gameTokenText = document.createElement('p');
        this.gameTokenText.innerText = 'GAME Token: $0';
        this.container.appendChild(this.gameTokenText);

        this.addUSDCButton = document.createElement('button');
        this.addUSDCButton.innerText = 'Add USDC';
        this.addUSDCButton.onclick = () => {
            this.addUSDC();
        };
        this.container.appendChild(this.addUSDCButton);

        this.depositUSDCButton = document.createElement('button');
        this.depositUSDCButton.innerText = 'Deposit USDC to Contract';
        this.depositUSDCButton.onclick = () => {
            this.depositUSDC();
        };
        this.container.appendChild(this.depositUSDCButton);

        // this.withdrawUSDC = document.createElement('button');
        // this.withdrawUSDC.innerText = 'Withdraw USDC from Contract';
        // this.withdrawUSDC.onclick = () => {
        //     this.withdrawUSDC();
        // };
        // this.container.appendChild(this.withdrawUSDC);

        this.playerTeam = new Team();

        this.teamController = new TeamController(this.account.cards, this.playerTeam);
        this.container.appendChild(this.teamController.render());

        this.createBattleButton = document.createElement('button');
        this.createBattleButton.innerText = 'Join Battle Queue';
        this.createBattleButton.onclick = () => {
            this.joinBattle();
        };
        this.container.appendChild(this.createBattleButton);
    }

    joinBattle() {
        this.teamController.assignCards();
        if (this.account.checkHasCards(this.playerTeam.getCardsUsed())) {
            battleManagerInstance.joinBattleQueue(this.playerTeam);
        } else {
            window.alert('team does not have valid cards')
        }
    }

    addUSDC() {
        let usdc = Number(window.prompt('Add how much USDC?', 1000));
        this.account.addUSDC(usdc);
        this.updateAccount();
    }

    depositUSDC() {
        let usdc = Number(window.prompt('Add how much USDC?', this.account.USDC));
        usdc = Math.min(this.account.USDC, Math.max(0, usdc));
        this.account.USDCInSystem += usdc;
        this.account.USDC -= usdc;
        let rollResult = usdcContract.depositUSDC(this.account.accountID, usdc);
        console.info(rollResult.cardsAwarded);
        this.account.addCards(rollResult.cardsAwarded);
        this.account.GAMEToken += rollResult.tokensAwarded;
        this.updateAccount();
    }

    // withdrawUSDC() {
    //     let usdc = Number(window.prompt('Remove how much USDC?', usdcContract.accounts[this.account.accountID].USDCDeposited));
    //     usdc = Math.min(this.account.USDC, Math.max(0, usdc));
    //     this.account.USDCInSystem += usdc;
    //     this.account.USDC -= usdc;
    //     usdcContract.depositUSDC(this.account.accountID, usdc);
    //     this.updateAccount();
    // }

    updateAccount() {
        this.usdcText.innerText = 'USDc: $' + this.account.USDC;
        this.usdcInSystemText.innerText = 'USDc Deposited: $' + this.account.USDCInSystem;
        this.gameTokenText.innerText = 'GAME Token: $' + this.account.GAMEToken;
        this.teamController.setCards(this.account.cards);
    }

    render() {
        return this.container;
    }
}

class MainGameBar extends Controller {
    constructor() {
        super();
        this.container = document.createElement('div');
        this.container.style.borderStyle = 'solid';
        this.container.style.borderWidth = 'thin';

        this.createAccountButton = document.createElement('button');
        this.createAccountButton.innerText = 'Create Account';
        this.createAccountButton.onclick = () => {
            this.createAccount();
        };

        this.container.appendChild(this.createAccountButton);

        this.accountCount = 0;
    }

    createAccount() {
        let username = window.prompt('Enter name', 'ralphert' + (this.accountCount > 0 ? this.accountCount : ''));
        gameController.addChild(new AccountController(username));
        this.accountCount++;
    }

    render() {
        return this.container;
    }
}

class GameController extends Controller {
    constructor() {
        super();
        this.body = document.getElementsByTagName('body')[0];

        this.container = document.createElement('div');
    }

    addChild(controller) {
        this.body.appendChild(controller.render());
    }

    render() {
        this.body.appendChild(this.container);
    }

    destroy() {

    }
}

let gameController = null;

let usdcContract = new USDCContract();

let handle = setInterval(() => {
    if (document.getElementsByTagName('body').length > 0 && gameController == null) {
        gameController = new GameController();
        gameController.addChild(new MainGameBar());
        gameController.addChild(new BattleManagerController());

        //new CardGeneratorTester().createAccounts();
    } else {
        clearInterval(handle);
    }
}, 100);