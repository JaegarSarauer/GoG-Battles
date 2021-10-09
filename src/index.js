import { BattleLog } from './game/BattleManager.js';
import { BattleTurn } from './game/BattleTurn.js';
import { BattleLogMessageType } from './game/Constants.js';
import web3ManagerInstance from './game/Web3Manager.js';

let setup = false;
let gameController = () => {
    let body = document.getElementsByTagName('body')[0];

    let privateInput = document.createElement('input');
    privateInput.defaultValue = '0';
    body.appendChild(privateInput);

    body.appendChild(document.createElement('br'));

    let messageInput = document.createElement('input');
    messageInput.defaultValue = '{"counter":0,"listeners":[],"messages":[],"needsSignature":false,"address":null,"signature":null}';
    body.appendChild(messageInput);

    let messageSignButton = document.createElement('button');
    messageSignButton.innerText = 'Sign';
    messageSignButton.onclick = () => {
        web3ManagerInstance.selectedAccountID = Number(privateInput.value);
        let objVal = new BattleLog().fromJSON(JSON.parse(messageInput.value));
        web3ManagerInstance.signBattleLog(objVal, (signData) => {
            console.info(signData);
        })
    }
    body.appendChild(messageSignButton);

    let createBattleButton = document.createElement('button');
    createBattleButton.innerText = 'Create Battle';
    createBattleButton.onclick = () => {
        web3ManagerInstance.selectedAccountID = Number(privateInput.value);
        web3ManagerInstance.getAccount((account) => {
            let battleLog = new BattleLog();
            battleLog.createLog(BattleLogMessageType.CREATE_BATTLE, {
                player1Address: account.address,
            });
            web3ManagerInstance.signBattleLog(battleLog, (signData) => {
                console.info({signedBattleLog: signData.battleLog.toJSON()});
            })
        });
    }
    body.appendChild(createBattleButton);

    let joinBattleButton = document.createElement('button');
    joinBattleButton.innerText = 'Join Battle';
    joinBattleButton.onclick = () => {
        web3ManagerInstance.selectedAccountID = Number(privateInput.value);
        web3ManagerInstance.getAccount((account) => {
            let battleLog = new BattleLog().fromJSON(JSON.parse(messageInput.value));
            battleLog.createLog(BattleLogMessageType.JOIN_BATTLE, {
                player2Address: account.address,
            });
            web3ManagerInstance.signBattleLog(battleLog, (signData) => {
                console.info({signedBattleLog: signData.battleLog.toJSON()});
            });
        });
    }
    body.appendChild(joinBattleButton);

    let moveInput = document.createElement('input');
    moveInput.defaultValue = JSON.stringify({advOrder: [0, 1, 2, 3, 4], advMoves: ["ATTACK_ADV0", "ATTACK_ADV1", "ATTACK_ADV2", "ATTACK_ADV3", "ATTACK_ADV4"]});
    body.appendChild(moveInput);

    let changeBattleTurnButton = document.createElement('button');
    changeBattleTurnButton.innerText = 'Change Battle Turn';
    changeBattleTurnButton.onclick = () => {
        let battleTurnJSON = JSON.parse(moveInput.value);
        web3ManagerInstance.selectedAccountID = Number(privateInput.value);
        web3ManagerInstance.getAccount((account) => {
            let battleLog = new BattleLog().fromJSON(JSON.parse(messageInput.value));
            let battleTurn = new BattleTurn();
            battleTurn.setMoves(battleTurnJSON);
            battleLog.createLog(BattleLogMessageType.CHANGE_BATTLE_TURN, {
                battleTurn,
            });
            web3ManagerInstance.signBattleLog(battleLog, (signData) => {
                console.info({signedBattleLog: signData.battleLog.toJSON()});
            });
        });
    }
    body.appendChild(changeBattleTurnButton);

    setup = true;
};

let handle = setInterval(() => {
    if (document.getElementsByTagName('body').length > 0 && !setup) {
        web3ManagerInstance.isServer = false;
        web3ManagerInstance.start();
        gameController();
        console.info(new BattleLog());
    } else {
        clearInterval(handle);
    }
}, 100);