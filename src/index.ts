import Blockchain from './blockchain'
import Transaction from './transaction'
import { get, post, router } from 'microrouter'
import { json } from 'micro'
import { IncomingMessage } from 'http'
import { proofOfWork } from './proof-of-work'
import uuid from 'uuid'

const nodeIdentifire = uuid().replace(/-/g, '')
const blockchain = new Blockchain()

const newTransaction = async (req: IncomingMessage) => {
  const { sender, recipient, amount } = (await json(req)) as Transaction
  const transaction = {
    sender,
    recipient,
    amount,
  }
  return blockchain.newTransaction(transaction)
}

/*
 * Mine blockchain and commit current transactions.
 *
 * The node get coin for calculation of new proof.
 * Sender is '0' for new coin.
 */
const mine = async () => {
  const lastProof = blockchain.lastBlock.proof
  const proof = await proofOfWork(lastProof)

  blockchain.newTransaction({
    sender: '0',
    recipient: nodeIdentifire,
    amount: 1,
  })

  return blockchain.newBlock(proof)
}

export default router(
  get('/', () => 'Hello'),
  get('/blocks', () => blockchain.chain),
  post('/transactions/new', newTransaction),
  post('/mine', mine),
  () => 'Not found',
)

console.log('My Blockchain Ts is running with Genesis block:')
console.log(JSON.stringify(blockchain.chain))
