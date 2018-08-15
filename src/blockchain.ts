import Block from './block'
import Transaction from './transaction'
import { getDigestHex, verifyProof } from './proof-of-work'

class Blockchain {
  nodes: Set<string> = new Set()
  chain: Block[] = []
  currentTransactions: Transaction[] = []

  constructor() {
    this.newBlock(100, 'INITIAL_HASH')
  }

  /*
   * Create new block from current transactions to Blockchain.
   */
  newBlock(proof: number, previousHash?: string) {
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

  verifyChain(chain: Block[]): boolean {
    let lastBlock = chain[0]
    let currentIndex = 1

    while (currentIndex < chain.length) {
      const block = chain[currentIndex]
      // print(f'{lastBlock}')
      // print(f'{block}')
      // print("\n--------------\n")

      // ブロックのハッシュが正しいかを確認
      if (block.previousHash !== Blockchain.hash(lastBlock)) {
        return false
      }

      // プルーフ・オブ・ワークが正しいかを確認
      if (!verifyProof(lastBlock.proof, block.proof)) {
        return false
      }

      lastBlock = block
      currentIndex += 1
    }
    return true
  }
}

export default Blockchain
