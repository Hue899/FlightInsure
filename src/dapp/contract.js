import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {

    constructor(network, callback) {

        this.config = Config[network];
        // this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.web3 = new Web3(window.ethereum);
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, this.config.appAddress);
        this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, this.config.dataAddress);
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];

        // Change the address with the those generated by ganache/ truffle
        this.addresses = ['0x8E3F37C095273515B4283A7badf9610aaC4279eC',
            '0x414EFca70ea6cf3E0f7005AfCfdE0dB845597e98',
            '0x3D0c5d2Acf7Da7106806b1a74CB7e34FB29354D9',
            '0xE9CdA852f2Be2F7628844201b6A2D19B92E71EcE ',
            '0x6c423EF7e643BFfD4a7e6a5465f229dCdf2930e0',
            '0x9115fc1aee260076edEfA7c24bfF80447f92e5c8',
            '0xC4870a9AeCB23E905d7a2E90950A4Dfc2823D195',
            '0x4868401399Ce5025a702a0A05dB82A8872dd8f72',
            '0x9325661cf10e9aec1c9d2f71b4039accbc97d4c1',
            '0x3Eed04e563697D3b8a34E7426237E8870cCCad5F',
            '0xc8E72e622468BBC5568493fF3AF3C399b67B1674'];

    }

    initialize(callback) {
        let self = this;
        this.web3.eth.getAccounts(async (error, accts) => {

            this.owner = self.addresses[0];
            console.log("Owner Account: " + self.owner);

            try {
                self.authorizeCaller((error, result) => {
                    console.log('Authorize caller: ' + error + ', ' + result);
                });
            } catch (e) {

            }


            let counter = 1;

            while (this.airlines.length < 5) {
                this.airlines.push(self.addresses[counter]);

                counter++;
            }
            console.log("Airlines: " + self.airlines);

            while (this.passengers.length < 5) {
                this.passengers.push(self.addresses[counter++]);
            }
            console.log("Passengers: " + self.passengers);

            callback();


        });




    }

    isOperational(callback) {
        let self = this;
        self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner }, callback);
    }

    async fetchFlightStatus(airlineAddress, flight, callback) {
        let self = this;
        let user = await window.ethereum.request({ method: 'eth_requestAccounts' });

        let payload = {
            airline: airlineAddress,
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        }
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: user[0] }, (error, result) => {
                callback(error, payload);
            });
    }

    async registerAirline(airline, callback) {
        let self = this;
        let user = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Metamask account: " + JSON.stringify(user[0]) + ', ' + JSON.stringify(self.owner) + ', ' + (user == self.owner));

        try {
            await this.flightSuretyApp.methods
                .registerAirline(airline)
                .send({ from: user[0] }, (error, result) => {
                    callback(error, result);
                });
        } catch (e) {
            callback(e, {});
        }
    }

    async fundAirline(callback) {
        let self = this;
        let fee = this.web3.utils.toWei("10", "ether");
        let user = await window.ethereum.request({ method: 'eth_requestAccounts' });

        let payload = {
            airline: user[0],
            timestamp: Math.floor(Date.now() / 1000)
        }

        self.flightSuretyApp.methods
            .fundAirline()
            .send({ from: user[0], value: fee }, (error, result) => {
                callback(error, payload);
            });

    }

    async buyInsurance(flight, airline, amount, callback) {
        let self = this;
        let user = await window.ethereum.request({ method: 'eth_requestAccounts' });
        let fee = this.web3.utils.toWei("" + amount, "ether");

        let payload = {
            flight: flight,
            airline: airline,
            amount: fee,
            timestamp: Math.floor(Date.now() / 1000)
        }
        self.flightSuretyApp.methods
            .buyInsurance(flight, airline)
            .send({ from: user[0], value: fee }, (error, result) => {
                callback(error, payload);
            });
    }

    async creditPassenger(flight, airline, callback) {
        let self = this;
        let user = await window.ethereum.request({ method: 'eth_requestAccounts' });

        self.flightSuretyApp.methods
            .creditPassenger(flight, airline)
            .send({ from: user[0] }, (error, result) => {
                callback(error, result);
            });
    }

    async checkCreditedMoney(flight, airline) {
        let self = this;
        let user = await window.ethereum.request({ method: 'eth_requestAccounts' });

        let amount = await self.flightSuretyApp.methods
            .creditedAmount(flight, airline)
            .call({ from: user[0] });
        return amount;
    }

    async getContractBalance() {
        let user = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return await this.flightSuretyApp.methods.getContractBalance().call({ from: user[0] });
    }

    async authorizeCaller(callback) {
        let self = this;
        let user = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (self.owner != user[0]) {
            callback({ message: "Error: only owner, " + self.owner + ", of the contract can authorize" }, {});
        } else {
            // self.flightSuretyApp.methods
            // .creditPassenger(flight, airline)
            // .send({ from: user[0] }, (error, result) => {
            //     callback(error, result);
            // });

            self.flightSuretyData.methods.authorizeCaller(self.config.appAddress)
                .send({ from: user[0] }, (error, result) => {
                    callback(error, result);
                });
        }
    }

}