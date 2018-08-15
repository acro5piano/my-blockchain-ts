import Blockchain from './blockchain'
import Transaction from './transaction'

describe('Block', () => {
  let blockchain: Blockchain
  beforeEach(() => {
    blockchain = new Blockchain()
  })
  it('create new transaction and block', () => {
    expect(blockchain.chain).toHaveLength(1)
    expect(blockchain.currentTransactions).toHaveLength(0)

    const transaction: Transaction = {
      sender: 'Alice',
      recipient: 'Bob',
      amount: 1000,
    }
    blockchain.newTransaction(transaction)
    expect(blockchain.currentTransactions).toHaveLength(1)
    expect(blockchain.chain).toHaveLength(1)

    blockchain.newBlock(12345)
    expect(blockchain.chain).toHaveLength(2)

    const lastBlock = blockchain.lastBlock
    expect(lastBlock.index).toEqual(2)
    expect(lastBlock.transactions).toEqual([transaction])
  })

  it('implements consensus algorithm', () => {
    expect(blockchain.nodes.size).toBe(0)
    blockchain.addNode('http://localhost:5555')
    expect(blockchain.nodes.size).toBe(1)
    expect(blockchain.nodes.has('http://localhost:5555')).toBe(true)
  })
})
