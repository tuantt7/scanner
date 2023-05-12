import Web3 from 'web3'

const web3 = new Web3(new Web3.providers.HttpProvider(`https://${process.env.network}.infura.io/v3/${process.env.apiKey}`))

const signer = web3.eth.accounts.privateKeyToAccount(process.env.privateKey)
web3.eth.accounts.wallet.add(signer)
web3.account = signer.address
export default web3
