import Block from './block'
import Transaction from './transaction'
import { getDigestHex } from './proof-of-work'

class Blockchain {
  nodes: Set<string> = new Set()
  chain: Block[] = []
  currentTransactions: Transaction[] = []

  constructor() {
    this.newBlock(100, 1)
  }

  /*
   * Create new block from current transactions to Blockchain.
   */
  newBlock(proof: number, previousHash?: string | number) {
    const block: Block = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.currentTransactions,
      proof,
      previousHash: previousHash || Blockchain.hash(this.chain.slice(-1)[0]),
    }

    this.currentTransactions = []

    this.chain.push(block)
    return block
  }

  /*
   * Add a new transaction to current transactions.
   */
  newTransaction(transaction: Transaction): number {
    this.currentTransactions.push(transaction)
    return this.lastBlock['index'] + 1
  }

  // ブロックをハッシュ化する
  // TODO:
  //     必ずディクショナリ（辞書型のオブジェクト）がソートされている必要がある。そうでないと、一貫性のないハッシュとなってしまう
  //     一旦しない
  private static hash(block: Block): string {
    return getDigestHex(JSON.stringify(block))
  }

  // チェーンの最後のブロックをリターンする
  get lastBlock(): Block {
    return this.chain.slice(-1)[0]
  }

  addNode(node: string) {
    this.nodes.add(node)
  }
}

export default Blockchain
