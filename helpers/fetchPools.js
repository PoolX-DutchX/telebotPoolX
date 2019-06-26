const poolXCloneFactoryAbi = require('./poolXCloneFactoryAbi.json')
const poolAbi = require('./poolAbi.json')
const web3 = require('./getWeb3')
const config = require('../configuration')

const getPoolData = (poolAddress, funcIdentifier) =>
  new Promise(async (resolve, reject) => {
    try {
      const contract = new web3.eth.Contract(poolAbi, poolAddress)
      const data = await contract.methods[funcIdentifier]().call()
      resolve(data)
    } catch (error) {
      console.log({ error })
      reject(error)
    }
  })

const { poolFactoryAddress } = config
const fetchPools = () =>
  new Promise(async (resolve, reject) => {
    try {
      const contract = new web3.eth.Contract(
        poolXCloneFactoryAbi,
        poolFactoryAddress
      )

      const data = await contract.methods.getPools.call()
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })

const fetchPoolNameDescriptionAddress = pool =>
  Promise.all([
    getPoolData(pool, 'name'),
    getPoolData(pool, 'description'),
    pool,
  ])

module.exports = { fetchPoolNameDescriptionAddress, fetchPools }