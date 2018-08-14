const micro = require('micro')

const server = micro(async (req: any, res: any) => {
  return 'Hello world'
})

console.log('micro is running at localhost:3000')
server.listen(3000)
