# FlightInsure

FlightInsure is a dAPP with Smart Contract code written in Solidity via Truffle. Both dApp and server were scaffolded using HTML, CSS and JavaScript. 

Smart Contract code is separated into multiple contracts:

1) FlightSuretyData.sol for data persistence
2) FlightSuretyApp.sol for app logic and oracles code

## Versions

* Truffle v5.5.22
* Solidity v0.8.15 (solc-js)
* Web3 v1.7.4
* @openzeppelin/test-helpers v0.5.15
* truffle-hdwallet-provider v1.0.17
* Node v16.16.0

## Install


To install, download or clone the repo, then:

`npm install`
`truffle compile`

## Develop Client

To run truffle tests:

`truffle test ./test/flightSurety.js`
`truffle test ./test/oracles.js`

To use the dapp:

`truffle migrate`
`npm run dapp`

To view dapp:

`http://localhost:8000`

## Develop Server

`npm run server`
`truffle test ./test/oracles.js`

## Deploy

To build dapp for prod:
`npm run dapp:prod`

Deploy the contents of the ./dapp folder


## Resources

* [How does Ethereum work anyway?](https://medium.com/@preethikasireddy/how-does-ethereum-work-anyway-22d1df506369)
* [BIP39 Mnemonic Generator](https://iancoleman.io/bip39/)
* [Truffle Framework](http://truffleframework.com/)
* [Ganache Local Blockchain](http://truffleframework.com/ganache/)
* [Remix Solidity IDE](https://remix.ethereum.org/)
* [Solidity Language Reference](http://solidity.readthedocs.io/en/v0.4.24/)
* [Ethereum Blockchain Explorer](https://etherscan.io/)
* [Web3Js Reference](https://github.com/ethereum/wiki/wiki/JavaScript-API)

## License

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
