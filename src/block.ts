import Transaction from './transaction'

export default interface Block {
  index: number
  timestamp: number // yet float
  transactions: Transaction[]
  proof: number
  previousHash: string | number
}
