import battleManagerInstance, { BattleLog } from './game/BattleManager.js';
import { BattleLogMessageType } from './game/Constants.js';
import Team from './game/Team.js';
import web3ManagerInstance from './game/Web3Manager.js';

import express from 'express';

class Server {
    constructor() {
        this.app = express();
        this.player1Response = null;
        this.player2Response = null;

        this.app.post('/changeAdventurerGear', (req, res) => {
            let teamID = req.body.teamID;
            let arrayOfAdvCards = req.body.arrayOfAdvCards;
        });

        this.app.post('/changeBattleTurn', (req, res) => {
            let teamID = req.body.teamID;
            let battleTurnData = req.body.battleTurnData;
        });

        this.app.post('/isPlayerInQueue', (req, res) => {
            if (battleManagerInstance.battleQueue.length == 1) {
                res.send(200).end();
            } else {
                res.send(100).end();
            }
        });
        this.app.post('/createBattle', (req, res) => {
            let signedBattleLog = req.body.signedBattleLog;

            if (battleManagerInstance.battleQueue > 0) {
                res.status(100).end();
                return false;
            }

            web3ManagerInstance.verifyBattleLog(signedBattleLog);


            let battleLog = new BattleLog();
            battleLog.createLog(BattleLogMessageType.CREATE_BATTLE, {
                player1Team: address
            });

            this.player1Response = res;
        });

        this.app.post('/joinBattle', (req, res) => {
            let signedBattleLog = req.body.signedBattleLog;

            web3ManagerInstance.verifyBattleLog(signedBattleLog);

            let team = new Team(signedBattleLog.getBattleLog(1).address);

            battleManagerInstance.joinBattleQueue(team);

            res.status(200).send({
                team: JSON.stringify(team),
            });

            this.player2Response = res;
        });

        this.app.post('/claimWin', (req, res) => {
            
        });
    }

    start() {
        console.info('Listening for connections...');
        this.app.listen(3093);
    }
}

export const serverInstance = new Server();