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
  const { sender, recipient, amount } = await json<Transaction>(req)
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

  const newBlock = blockchain.newBlock(proof)
  await consensus()
  return newBlock
}

const addNode = async (req: IncomingMessage) => {
  const { node } = await json<{ node: string }>(req)
  if (!node) {
    return 'invalid node'
  }
  blockchain.registerNode(node)
  return blockchain.nodesAsArray
}

const consensus = async () => {
  const replaced = await blockchain.resolveConflicts()
  return { replaced }
}

export default router(
  get('/', () => 'Hello'),
  get('/blocks', () => blockchain.chain),
  get('/nodes', () => blockchain.nodesAsArray),
  post('/transactions/new', newTransaction),
  post('/mine', mine),
  post('/nodes/new', addNode),
  post('/consensus', consensus),
  () => 'Not found',
)

console.log('My Blockchain Ts is running with Genesis block:')
console.log(JSON.stringify(blockchain.chain))
