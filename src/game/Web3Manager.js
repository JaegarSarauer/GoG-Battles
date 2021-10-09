import Web3 from 'web3';
//import Web3Modal from "web3modal";
//import Authereum from "authereum";
import detectEthereumProvider from '@metamask/detect-provider'

import sortDeepObjectArrays from 'sort-deep-object-arrays';

class ObjectOrderer {
    constructor() {
    }

    getOrdered(objIn) {
        let dataOut = {};
        return this._orderObj(objIn, dataOut);
        //return dataOut;
    }

    _orderObj(objectIn) {
        return sortDeepObjectArrays(objectIn);
    }
}

export class Web3Manager {
    constructor(isServer) {
        this.web3 = null;
        this.onReady = () => {};
        this.isServer = isServer;
        
        this.selectedAccountID = 0;
        this.accounts = [];
    }

    start() {
        if (!this.isServer) {
            detectEthereumProvider().then((provider) => {
                console.info(provider)
                if (provider != null) {
                    this.web3 = new Web3(provider);
                    this.onReady(this.web3);
                } else {
                    console.info('Error connecting to MetaMask provider.');
                    this.web3 = new Web3('https://mainnet.infura.io');
                    this.onReady(this.web3);
                }
            }, (err) => {
                console.info(err)
            });
        } else {
            this.web3 = new Web3();
        }
    }

    isReady() {
        return this.web3 != null;
    }

    loadAccountFromPrivateKey(privateKey) {
        this.accounts.push(this.web3.eth.accounts.privateKeyToAccount(privateKey));
    }

    getAccount(callback) {
        if (this.accounts[this.selectedAccountID] == null) {
            this.web3.eth.getAccounts((err, accounts) => {
                if (accounts != null) {
                    this.accounts = accounts;
                    callback(this.accounts[this.selectedAccountID]);
                } else {
                    //TEMP TESTING, ERROR HANDLE HERE
                    this.accounts[this.selectedAccountID] = this.web3.eth.accounts.create();
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
                let signatureObj = account.sign(this.sanitizeMessage(message));
                let resultObj = {
                    address: account.address,
                    message: JSON.parse(signatureObj.message),
                    signature: signatureObj.signature,
                };
                callback(resultObj);
            } else {
                callback(null);
            }
        });
    }

    signBattleLog(battleLog, callback) {
        this.sign(battleLog.messages, (signatureObj) => {
            let result = false;
            if (signatureObj != null) {
                result = battleLog.signLog(signatureObj.address, signatureObj.signature);
            }
            callback({result, signatureObj, battleLog});
        });
    }

    sanitizeMessage(message) {
        let ordered = new ObjectOrderer().getOrdered(message);
        let msg = JSON.stringify(ordered, (key, value) => {
            if (value != null) 
                return value;
        });
        console.info(msg);
        return msg;
    }

    verifySignature(message, address, signature) {
        return this.web3.eth.accounts.recover(this.sanitizeMessage(message), signature) == address;
    }

    verifyBattleLog(battleLog) {
        return this.verifySignature(battleLog.messages, battleLog.address, battleLog.signature);
    }
}

const web3ManagerInstance = new Web3Manager(true);
export default web3ManagerInstance;