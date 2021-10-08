import { BattleLogMessageType } from "./Constants";
import web3ManagerInstance from "./Web3Manager";
//const Axios = require('axios');

export default class AxiosRouter {
    constructor() {
        this.url = 'localhost:3093';
    }

    post(endpoint, formData, callback, errCallback) {
        Axios({
            method: 'POST',
            url: (this.url + '/' + endpoint),
            data: formData,
        }).then(callback).catch(errCallback);
    }

    joinBattleQueue(signedBattleLog) {
        let data = new FormData();
        data.append('data', signedBattleLog);
        this.post('joinBattleQueue', data, (res) => {
            
        }, (rej) => {

        });
    }
}


export default class ClientBattleProxy {
    constructor() {
        this.axios = new AxiosRouter();
        this.battleLog = null;
    }

    joinBattleQueue(callback) {
        web3ManagerInstance.getAccount((account) => {
            this.battleLog = new BattleLog();

            let data = {
                playerAddress: account.address,
            };

            this.battleLog.createLog(BattleLogMessageType.JOIN_QUEUE, data);
            web3ManagerInstance.signBattleLog(this.battleLog, (result) => {
                if (result) {
                    this.axios.joinBattleQueue(this.battleLog);
                }
            });
        });
    }

    joinBattle(callback) {
        web3ManagerInstance.getAccount((account) => {
            this.battleLog = new BattleLog();

            let data = {
                playerAddress: account.address,
            };

            this.battleLog.createLog(BattleLogMessageType.JOIN_QUEUE, data);
            web3ManagerInstance.signBattleLog(this.battleLog, (result) => {
                callback(result);
            });
        });
    }
}