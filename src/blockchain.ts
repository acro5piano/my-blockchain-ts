import forge from 'node-forge'
import Block from './block'
import Transaction from './transaction'

class Blockchain {
  chain: Block[] = []
  currentTransactions: Transaction[] = []

  constructor() {
    this.newBlock(100, 1)
  }

  // 新しいブロックを作り、チェーンに加える
  newBlock(proof: number, previousHash?: string | number) {
    const block: Block = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.currentTransactions,
      proof,
      previousHash: previousHash || Blockchain.hash(this.chain.slice(-1)[0]),
    }

    // 現在のトランザクションリストをリセット
    this.currentTransactions = []

    this.chain.push(block)
    return block
  }

  // 新しいトランザクションをリストに加える
  newTransaction(transaction: Transaction): number {
    this.currentTransactions.push(transaction)
    return this.lastBlock['index'] + 1
  }

  // ブロックをハッシュ化する
  // TODO:
  //     必ずディクショナリ（辞書型のオブジェクト）がソートされている必要がある。そうでないと、一貫性のないハッシュとなってしまう
  //     一旦しない
  static hash(block: Block): string {
    return Blockchain.getDigestHex(JSON.stringify(block))
  }

  static getDigestHex(normalString: string): string {
    const md = forge.md.sha256.create()
    md.update(normalString)
    return md.digest().toHex()
  }

  // チェーンの最後のブロックをリターンする
  get lastBlock(): Block {
    return this.chain.slice(-1)[0]
  }

  static proofOfWork(lastProof: number, proofCandidate: number = 0): number {
    if (Blockchain.validProof(lastProof, proofCandidate)) {
      return proofCandidate
    } else {
      return Blockchain.proofOfWork(lastProof, proofCandidate)
    }
  }

  static validProof(lastProof: number, proofCandidate: number) {
    const guess = `${lastProof}${proofCandidate}`
    const guessHash = Blockchain.getDigestHex(guess)

    return guessHash.slice(-4, 4) === '0000'
  }
}

export default Blockchain
