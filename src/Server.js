import battleManagerInstance, { BattleLog, BattleLogSimulator } from './game/BattleManager.js';
import { BattleLogMessageType } from './game/Constants.js';
import Team from './game/Team.js';
import web3ManagerInstance from './game/Web3Manager.js';
import express from 'express';

class Server {
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.player1Response = null;
        this.player2Response = null;

        this.battleLogSimulator = new BattleLogSimulator();

        this.app.post('/changeAdventurerGear', (req, res) => {
            let teamID = req.body.teamID;
            let arrayOfAdvCards = req.body.arrayOfAdvCards;
        });

        this.app.post('/changeBattleTurn', (req, res) => {
            let teamID = req.body.teamID;
            let battleTurnData = req.body.battleTurnData;
        });

        this.app.get('/isPlayerInQueue', (req, res) => {
            if (battleManagerInstance.battleQueue.length == 1) {
                res.status(200).send(true).end();
            } else {
                res.status(200).send(false).end();
            }
        });
        this.app.post('/createBattle', (req, res) => {
            let signedBattleLog = new BattleLog().fromJSON(req.body.signedBattleLog);

            if (battleManagerInstance.battleQueue > 0) {
                res.status(200).send(false).end();
                return false;
            }

            if (!this.validateAndUpdateSimulation(signedBattleLog)) {
                res.status(200).send(false).end();
                return false;
            }

            this.player1Response = res;
            res.status(200).send(true);
        });

        this.app.post('/joinBattle', (req, res) => {
            let signedBattleLog = req.body.signedBattleLog;

            if (battleManagerInstance.battleQueue < 1) {
                res.status(200).send(false).end();
                return false;
            }

            if (!this.validateAndUpdateSimulation(signedBattleLog)) {
                res.status(200).send(false).end();
                return false;
            }

            this.player2Response = res;
            res.status(200).send(true);
        });

        this.app.post('/claimWin', (req, res) => {
            
        });
    }

    validateAndUpdateSimulation(signedBattleLog) {
        if (!web3ManagerInstance.verifyBattleLog(signedBattleLog)) {
            return false;
        }

        if (!this.updateBattleSimulation(signedBattleLog)) {
            return false;
        }
        return true;
    }

    updateBattleSimulation(signedBattleLog) {
        let lastMessage = signedBattleLog.getLastMessage();
        return this.battleLogSimulator.addMessage(lastMessage, lastMessage.address, lastMessage.signature);
    }

    start() {
        web3ManagerInstance.start();
        console.info('Listening for connections...');
        this.app.listen(3093);
    }
}

export const serverInstance = new Server();