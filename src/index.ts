import Blockchain from './blockchain'
import Transaction from './transaction'
import { get, post, router } from 'microrouter'
import { json } from 'micro'
import { IncomingMessage } from 'http'

const blockchain = new Blockchain()

const newTransaction = async (req: IncomingMessage) => {
  const { sender, recipient, amount } = (await json(req)) as Transaction
  const transaction: Transaction = {
    sender,
    recipient,
    amount,
  }
  return blockchain.newTransaction(transaction)
}

export default router(
  get('/', () => 'Hello'),
  get('/blocks', () => blockchain.chain),
  post('/transactions/new', newTransaction),
  post('/blocks/new', () => 'hoge'),
  () => 'Not found',
)

console.log('My Blockchain Ts is running with Genesis block:')
console.log(JSON.stringify(blockchain.chain))
