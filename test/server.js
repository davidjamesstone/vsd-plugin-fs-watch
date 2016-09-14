const Hapi = require('hapi')

const server = new Hapi.Server()
server.connection({ port: 3005 })

server.register([{
  register: require('nes')
}, {
  register: require('..'),
  options: {
    mount: '/fs'
  }
}], (err) => {
  if (err) {
    throw err
  }
})

server.start((err) => {
  if (err) {
    throw err
  }

  console.log('Server running at:', server.info.uri)
})
