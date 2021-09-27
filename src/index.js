import Card from './game/Card';
import Account from './game/Account';
import USDCContract from './game/USDCContract';

class Controller {
    constructor() {

    }

    addChild() {}
    render() {}
    destroy() {}
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
    } else {
        clearInterval(handle);
    }
}, 100);