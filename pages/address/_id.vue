<template>
  <div class="home-page">
    <span class="ppp">{{ mountains.message }} 1</span>
    <div class="over-view">
      <div class="balance card">
        <strong>Overview</strong>
        <p>ETH BALANCE</p>
        <small>{{ balance }} ETH</small>
      </div>
      <div class="info card">
        <strong>More Info</strong>
        <p>LAST TXN SENT</p>
        <small>{{ balance }} ETH</small>
        <p>FIRST TXN SENT</p>
        <small>{{ balance }} ETH</small>
      </div>
      Total {{ total }} transactions {{ transactionList.length }}
    </div>
    <div class="transaction-list">
      <div class="transaction">
        <strong class="hash">Txn Hash</strong>
        <strong class="hash">Method</strong>
        <strong class="hash">Block</strong>
        <strong class="hash">Age</strong>
        <strong class="hash">From</strong>
        <strong class="hash">To</strong>
        <strong class="hash">Value</strong>
        <strong class="hash">Txn Fee</strong>
      </div>
      <div
        v-for="(tran, index) in transactions"
        :key="tran.timeStamp + index"
        class="transaction"
      >
        <span class="hash link" @click="detailTran(tran.hash)">
          {{ index }} {{ tran.hash }}</span
        >
        <span class="hash">{{ tran.methodId }}</span>
        <span class="hash"
          ><span class="link" @click="goToBlock(tran.blockNumber)">{{
            tran.blockNumber
          }}</span></span
        >
        <span class="hash">
          <!-- <el-tooltip :content="date(tran.timeStamp)" placement="top">
            <div class="btn-icon">
              {{ timeAge(tran.timeStamp) }}
            </div>
          </el-tooltip> -->
          {{ timeAge(tran.timeStamp) }} {{ date(tran.timeStamp) }}
        </span>
        <span class="hash">{{ tran.from }}</span>
        <span class="hash">{{ tran.to }}</span>
        <span class="hash">{{ value(tran.value) }}</span>
        <span class="hash">{{ TxnFree(tran.gasUsed, tran.gasPrice) }}</span>
      </div>
      <el-pagination
        v-model="dataPage"
        background
        layout="prev, pager, next"
        :total="transactionList.length"
        :page-size="50"
        class="my-10"
        @current-change="changePage"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'

import web3 from '@/plugins/web3'
import { ERROR_ADDRESS } from '@/constants/error'
export default {
  name: 'IndexPage',
  layout: 'default',
  data() {
    return {
      page: 1,
      offset: 10000,
      total: null,
      transactionList: [],
      dataPage: 1,
      balance: null,
      ppp: null,
      startblock: 0,
      endblock: 99999999,
      cryptedData: null,
      mountains: [],
    }
  },
  async fetch() {
    const p = await fetch(
      'https://thanhtuan-api.onrender.com/abi?contract=0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0&net=sepolia'
    ).then((res) => res.json())
    this.mountains = p
  },

  computed: {
    ...mapState(['errorCode']),
    transactions() {
      const reverse = [...this.transactionList]
      return reverse.filter(
        (item, index) =>
          index >= this.dataPage * 50 - 50 && index <= this.dataPage * 50 - 1
      )
    },
    totalPage() {
      console.log(Math.ceil(this.transactionList?.length / 50))
      return Math.ceil(this.transactionList?.length / 50)
    },
  },
  mounted() {
    // const { id } = this.$route.params
    // this.getTotalTransactions(id)
    // this.getAccountInformation(id)
  },
  methods: {
    date(date) {
      return moment.unix(date).format('DD/MM/YYYY HH:mm:ss')
    },
    async getAccountInformation(id) {
      try {
        const result = await web3.eth.getBalance(id)
        this.balance = web3.utils.fromWei(result, 'ether')
      } catch (error) {
        this.$store.dispatch('setError', ERROR_ADDRESS)
      }
    },
    goToBlock(block) {
      this.$router.push(`/block/${block}`)
    },
    changePage(page) {
      // this.setPage(page)
      this.dataPage = page
    },
    detailTran(hash) {
      this.$router.push(`/transaction/${hash}`)
    },
    decode(data) {
      return web3.utils.stringToHex(data)
    },
    value(value) {
      return web3.utils.fromWei(value, 'ether') + ' ETH'
    },
    TxnFree(gas = 1, gasPrice = 1) {
      const price =
        web3.utils.fromWei(gas, 'gwei') * web3.utils.fromWei(gasPrice, 'gwei')
      return price.toString().slice(0, 10)
    },
    timeAge(timeStamp) {
      return moment(moment.unix(timeStamp)).fromNow()
    },
    async getTotalTransactions(address) {
      const params = {
        module: 'account',
        action: 'txlist',
        address,
        startblock: 0,
        endblock: this.endblock,
        page: this.page,
        offset: this.offset,
        sort: 'desc',
        apikey: '5QY5RIU768SJNJIGU2ZHX4GBFJVD5ER1AK',
      }
      const result1 = await this.$axios.$get(process.env.sepoliaURL, { params })

      this.transactionList = [
        ...this.transactionList,
        ...JSON.parse(JSON.stringify(result1.result)),
      ]
      if (result1.result.length > 1) {
        console.log(this.endblock)
        this.endblock = result1.result[result1.result.length - 1].blockNumber
        this.getTotalTransactions(address)
      }
    },
    async getFirstAndLastTXN(address) {
      const params = {
        module: 'account',
        action: 'txlist',
        address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 10000,
        sort: 'asc',
        apikey: '5QY5RIU768SJNJIGU2ZHX4GBFJVD5ER1AK',
      }
      const result1 = await this.$axios.$get(process.env.sepoliaURL, { params })
      this.transactionList = JSON.parse(JSON.stringify(result1.result))
    },
  },
}
</script>
<style scoped>
.home-page {
  max-width: 1400px;
  margin: auto;
  margin-top: 20px;
}

.over-view {
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 20px;
}

.transaction {
  display: flex;
  align-items: center;
  border-bottom: solid 1px #f0f0f0;
  padding: 10px 0;
}

.hash {
  width: 12%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
