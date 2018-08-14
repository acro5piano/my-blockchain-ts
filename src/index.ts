import Blockchain from './blockchain'
import Transaction from './transaction'
import { get, post, router } from 'microrouter'

const blockchain = new Blockchain()

console.log(blockchain)

const newTransaction = () => {
  const transaction: Transaction = {
    sender: 'Alice',
    recipient: 'Bob',
    amount: 1000,
  }
  blockchain.newTransaction(transaction)
}

export default router(
  get('/', () => 'Hello'),
  post('/transactions/new', newTransaction),
  post('/blocks/new', () => 'hoge'),
)
