interface Chain {}

interface Transaction {}

class Blockchain {
  chain: Chain[] = []
  transactions: Transaction[] = []

  // constructor(args: {}) {}

  // 新しいブロックを作り、チェーンに加える
  newBlock(sender: string, recipient: string, amount: string) {
    this.transactions.push({
      sender,
      recipient,
      amount,
    })
  }

  // 新しいトランザクションをリストに加える
  // newTransaction() {}

  // ブロックをハッシュ化する
  // static hash(block) {}

  // チェーンの最後のブロックをリターンする
  // lastBlock() {}
}

export default Blockchain
