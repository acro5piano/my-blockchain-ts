import Blockchain from './blockchain'
import Block from './block'
import Transaction from './transaction'
import { proofOfWork } from './proof-of-work'

const genTransaction = (): Transaction => ({
  sender: 'Alice',
  recipient: 'Bob',
  amount: 1000,
})

describe('Block', () => {
  let blockchain: Blockchain
  beforeEach(() => {
    blockchain = new Blockchain()
  })
  it('create new transaction and block', () => {
    expect(blockchain.chain).toHaveLength(1)
    expect(blockchain.currentTransactions).toHaveLength(0)

    const transaction = genTransaction()
    blockchain.newTransaction(transaction)
    expect(blockchain.currentTransactions).toHaveLength(1)
    expect(blockchain.chain).toHaveLength(1)

    blockchain.newBlock(12345)
    expect(blockchain.chain).toHaveLength(2)

    const lastBlock = blockchain.lastBlock
    expect(lastBlock.index).toEqual(2)
    expect(lastBlock.transactions).toEqual([transaction])
  })

  it('implements consensus algorithm', async () => {
    expect(blockchain.nodes.size).toBe(0)
    blockchain.addNode('http://localhost:5555')
    expect(blockchain.nodes.size).toBe(1)
    expect(blockchain.nodes.has('http://localhost:5555')).toBe(true)

    const transaction = genTransaction()

    // invalid chain
    const invalidChain: Block[] = [
      {
        index: 1,
        timestamp: Date.now(),
        transactions: [transaction],
        proof: 12345,
        previousHash: blockchain.lastBlock.previousHash,
      },
      {
        index: 2,
        timestamp: Date.now(),
        transactions: [transaction],
        proof: 12345,
        previousHash: blockchain.lastBlock.previousHash,
      },
    ]
    expect(blockchain.verifyChain(invalidChain)).toBe(false)

    // valid chain
    blockchain.newTransaction(transaction)
    const validProof = await proofOfWork(blockchain.lastBlock.proof)
    blockchain.newBlock(validProof)
    const validChain = blockchain.chain
    expect(blockchain.verifyChain(validChain)).toBe(true)
  })
})
