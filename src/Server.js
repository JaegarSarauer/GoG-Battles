import battleManagerInstance, { BattleLog, BattleLogSimulator } from './game/BattleManager.js';
import { BattleLogMessageType } from './game/Constants.js';
import Team from './game/Team.js';
import web3ManagerInstance from './game/Web3Manager.js';
import express from 'express';

class Server {
    constructor() {
        this.app = express();
        this.app.use((req, res, next) => {
            res.append('Access-Control-Allow-Origin', ['*']);
            res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.append('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });
        this.app.use(express.json());
        this.player1Response = null;
        this.player2Response = null;

        this.battleQueued = false;
        this.battleLogSimulator = new BattleLogSimulator();

        this.app.post('/changeAdventurerGear', (req, res) => { 
            let signedBattleLog = new BattleLog().fromJSON(req.body.signedBattleLog);

            if (!this.validateAndUpdateSimulation(signedBattleLog)) {
                res.status(200).send(false).end();
                return false;
            }

            res.status(200).send(true);
        });

        this.app.post('/changeBattleTurn', (req, res) => {
            let signedBattleLog = new BattleLog().fromJSON(req.body.signedBattleLog);

            if (!this.validateAndUpdateSimulation(signedBattleLog)) {
                res.status(200).send(false).end();
                return false;
            }

            res.status(200).send(true);
        });

        this.app.get('/isPlayerInQueue', (req, res) => {
            if (this.battleQueued) {
                let battleLog = this.battleLogSimulator.battleLog;
                res.status(200).send(battleLog).end();
            } else {
                res.status(200).send(false).end();
            }
        });

        this.app.get('/clearBattle', (req, res) => {
            this.battleQueued = false;
            this.battleLogSimulator = new BattleLogSimulator();
            res.status(200).send(true);
        });

        this.app.post('/createBattle', (req, res) => {
            let signedBattleLog = new BattleLog().fromJSON(req.body.signedBattleLog);

            if (this.battleQueued) {
                res.status(200).send(false).end();
                return false;
            }

            if (!this.validateAndUpdateSimulation(signedBattleLog)) {
                res.status(200).send(false).end();
                return false;
            }

            this.battleQueued = true;
            this.player1Response = res;
            res.status(200).send(true);
        });

        this.app.post('/joinBattle', (req, res) => {
            let signedBattleLog = new BattleLog().fromJSON(req.body.signedBattleLog);

            if (!this.battleQueued) {
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
            let signedBattleLog = new BattleLog().fromJSON(req.body.signedBattleLog);

            if (!this.validateAndUpdateSimulation(signedBattleLog)) {
                res.status(200).send(false).end();
                return false;
            }

            this.battleQueued = false;
            this.battleLogSimulator = new BattleLogSimulator();

            res.status(200).send(true);
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
        return this.battleLogSimulator.addMessage(lastMessage, signedBattleLog.address, signedBattleLog.signature);
    }

    start() {
        web3ManagerInstance.start();
        console.info('Listening for connections...');
        this.app.listen(3093);
    }
}

export const serverInstance = new Server();