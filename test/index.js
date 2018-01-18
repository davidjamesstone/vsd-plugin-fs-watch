const Hapi = require('hapi')
const Lab = require('lab')
const Code = require('code')
const lab = exports.lab = Lab.script()

lab.experiment('Test', () => {
  let server

  // Create server before each test
  lab.before(async () => {
    server = new Hapi.Server()
    await server.register(require('nes'))
    await server.register(require('..'), { routes: { prefix: '/fs' } })
  })

  lab.test('Routes work', async () => {
    const table = server.table()
    Code.expect(table.length).to.equal(3)

    const paths = ['/nes/auth', '/fs', '/fs/watched']

    paths.forEach((path, index) => {
      Code.expect(table[index].path).to.equal(path)
    })
  })
})
