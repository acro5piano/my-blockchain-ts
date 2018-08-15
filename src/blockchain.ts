import Block from './block'
import Transaction from './transaction'
import { getDigestHex, verifyProof } from './proof-of-work'
import defaultFetch from 'node-fetch'

interface IJsonable<T> {
  json: () => T
}

export type Fetch<T = {}> = (url: string) => Promise<IJsonable<T>>

class Blockchain {
  nodes: Set<string> = new Set()
  chain: Block[] = []
  currentTransactions: Transaction[] = []
  fetch: Fetch

  /*
   * To enable `fetch` dependency injection, we pass `defaultFetch`.
   */
  constructor(fetch: Fetch = defaultFetch) {
    this.fetch = fetch
    this.newBlock(100, 'INITIAL_HASH')
  }

  /*
   * Create new block from current transactions to Blockchain.
   * TODO: refactor with two methods: `new`, `add`
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
  static hash(block: Block): string {
    return getDigestHex(JSON.stringify(block))
  }

  // チェーンの最後のブロックをリターンする
  get lastBlock(): Block {
    return this.chain.slice(-1)[0]
  }

  get nodesAsArray() {
    return Array.from(this.nodes)
  }

  registerNode(node: string) {
    this.nodes.add(node)
  }

  static verifyChain(chain: Block[]): boolean {
    let lastBlock = chain[0]
    let currentIndex = 1

    // TODO: rewrite with chain.reduce(car, cur => ...
    while (currentIndex < chain.length) {
      const block = chain[currentIndex]

      // Verify block hash
      if (block.previousHash !== Blockchain.hash(lastBlock)) {
        return false
      }

      // Verify block proof of work
      if (!verifyProof(lastBlock.proof, block.proof)) {
        return false
      }

      lastBlock = block
      currentIndex += 1
    }
    return true
  }

  async resolveConflicts(): Promise<boolean> {
    // 他のすべてのノードのチェーンを確認
    const chains: Block[][] = await Promise.all(
      this.nodesAsArray.map(node => {
        return this.fetch(`${node}/blocks`).then((res: any) => res.json())
      }),
    )

    // get chain to be replaced with
    const validChains = chains.filter(chain => {
      return Blockchain.verifyChain(chain) && this.chain.length < chain.length
    })
    if (validChains.length === 0) {
      return false
    }

    const longerChain = validChains.reduce((car, cur) => {
      return cur.length > car.length ? cur : car
    })

    // もし自らのチェーンより長く、かつ有効なチェーンを見つけた場合それで置き換える
    if (longerChain) {
      this.chain = longerChain
      return true
    }

    return false
  }
}

export default Blockchain
