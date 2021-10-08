import Web3 from 'web3';
//import Web3Modal from "web3modal";
//import Authereum from "authereum";
import detectEthereumProvider from '@metamask/detect-provider'

export class Web3Manager {
    constructor() {
        this.web3 = null;
        this.onReady = () => {};

        // detectEthereumProvider().then((provider) => {
        //     console.info(provider)
        //     if (provider != null) {
        //         this.web3 = new Web3(provider);
        //         this.onReady(this.web3);
        //     } else {
        //         console.info('Error connecting to MetaMask provider.');
        //         this.web3 = new Web3('https://mainnet.infura.io');
        //         this.onReady(this.web3);
        //     }
        // }, (err) => {
        //     console.info(err)
        // });
        
        this.selectedAccountID = 0;
        this.accounts = [];
    }

    isReady() {
        return this.web3 != null;
    }

    getAccount(callback) {
        if (this.accounts[this.selectedAccountID] == null) {
            this.web3.eth.getAccounts((err, accounts) => {
                if (accounts != null) {
                    this.accounts = accounts;
                    callback(this.accounts[this.selectedAccountID]);
                } else {
                    //TEMP TESTING, ERROR HANDLE HERE
                    this.accounts[0] = this.web3.eth.accounts.create();
                    callback(this.accounts[this.selectedAccountID]);
                    //TEMP TESTING, ERROR HANDLE HERE
                }
            });
        }
        callback(this.accounts[this.selectedAccountID]);
    }

    sign(message, callback) {
        this.getAccount((account) => {
            console.info(account);
            if (account != null) {
                let signatureObj = account.sign(message);
                let resultObj = {
                    address: account.address,
                    message: signatureObj.message,
                    signature: signatureObj.signature,
                };
                callback(resultObj);
            } else {
                callback(null);
            }
        });
    }

    signBattleLog(battleLog, callback) {
        this.sign(battleLog.logs, (signatureObj) => {
            let result = false;
            if (signatureObj != null) {
                result = battleLog.signLog(signatureObj.address, signatureObj.signature);
            }
            callback(result);
        });
    }

    verifySignature(message, signature, address) {
        return this.web3.eth.accounts.recover(message, signature) == address;
    }

    verifyBattleLog(battleLog) {
        return this.verifySignature(battleLog.getBattleLog(), battleLog.address, battleLog.signature);
    }
}

const web3ManagerInstance = new Web3Manager();
export default web3ManagerInstance;