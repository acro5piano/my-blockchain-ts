import Blockchain from './blockchain'
import Transaction from './transaction'
import { get, post, router } from 'microrouter'
import { json } from 'micro'
import { IncomingMessage } from 'http'
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

const newBlock = async () => {
  const lastProof = blockchain.lastBlock.proof
  const proof = await Blockchain.proofOfWork(lastProof)

  // プルーフを見つけたことに対する報酬を得る
  // 送信者は、採掘者が新しいコインを採掘したことを表すために"0"とする
  blockchain.newTransaction({
    sender: '0',
    recipient: nodeIdentifire,
    amount: 1,
  })

  // チェーンに新しいブロックを加えることで、新しいブロックを採掘する
  return blockchain.newBlock(proof)
}

export default router(
  get('/', () => 'Hello'),
  get('/blocks', () => blockchain.chain),
  post('/transactions/new', newTransaction),
  post('/blocks/new', newBlock),
  () => 'Not found',
)

console.log('My Blockchain Ts is running with Genesis block:')
console.log(JSON.stringify(blockchain.chain))
