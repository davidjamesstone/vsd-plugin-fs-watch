const Joi = require('joi')
const Watcher = require('./watcher')
const FileSystemObject = require('./file-system-object')
const cache = {}
const watchers = []

module.exports = {
  plugin: {
    pkg: require('./package.json'),
    register: (server, options) => {
      const mount = server.realm.modifiers.route.prefix || ''

      server.subscription(mount + '/{id}/{event}')

      server.route([{
        method: 'GET',
        path: '/',
        options: {
          handler: (request, h) => {
            return cache
          }
        }
      }, {
        method: 'GET',
        path: '/watched',
        options: {
          handler: async (request, h) => {
            const path = request.query.path
            let idx

            if (path in cache) {
              idx = cache[path]
              // Reply with the watched files
              return {
                id: idx,
                watched: watchers[idx].watched
              }
            } else {
              const client = new Watcher(path)
              const watcher = client.watcher

              return new Promise((resolve, reject) => {
                watcher.on('ready', function () {
                  server.log(['info', 'vsd-plugin-fs-watch'],
                    `Watching path ${path}`)

                  idx = watchers.push(client) - 1
                  cache[path] = idx

                  // Listen to watcher events and publish events
                  watcher.on('all', function (event, path, stat) {
                    stat = stat || (event === 'unlinkDir')
                    const fso = new FileSystemObject(path, stat)
  
                    // publish specific named event
                    server.publish(mount + '/' + idx + '/' + event, fso)
  
                    // publish generic `update` event
                    server.publish(mount + '/' + idx + '/update', {
                      file: fso,
                      event: event
                    })
  
                    server.log(['info', 'vsd-plugin-fs-watch'],
                      `Watcher event happened ${event} ${fso.path}`)
                  })

                  watcher.on('error', function (err) {
                    server.publish(mount + '/' + idx + 'error', err)
                    server.log(['error', 'vsd-plugin-fs-watch'], err)
                  })

                  // Reply with the watched files
                  resolve({
                    id: idx,
                    watched: client.watched
                  })
                })
              })
            }
          },
          validate: {
            query: {
              path: Joi.string().required()
            }
          }
        }
      }])
    }
  }
}
