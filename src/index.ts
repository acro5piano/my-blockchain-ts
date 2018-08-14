import Blockchain from './blockchain'
// import Transaction from './transaction'
// import Block from './block'

const a = new Blockchain()

console.log('initial block chain')
console.log(a)

// const transaction: Transaction = {
//   sender: 'hoge',
//   recipient: 'fuga',
//   amount: 123,
// }

a.newTransaction('hoge', 'fuga', 123)
a.newBlock(12345)

console.log('after added block chain')
console.log(a)
