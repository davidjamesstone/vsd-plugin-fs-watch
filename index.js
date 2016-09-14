const Joi = require('joi')
const Watcher = require('./watcher')
const FileSystemObject = require('./file-system-object')
const cache = {}
const watchers = []

exports.register = function (server, options, next) {
  var mount = options.mount || ''

  server.subscription(mount + '/{id}/{event}')

  server.route([{
    method: 'GET',
    path: mount + '/',
    config: {
      handler: function (request, reply) {
        reply(cache)
      }
    }
  }, {
    method: 'GET',
    path: mount + '/watched',
    config: {
      handler: function (request, reply) {
        var path = request.query.path
        var idx

        if (path in cache) {
          idx = cache[path]
          // Reply with the watched files
          return reply({
            id: idx,
            watched: watchers[idx].watched
          })
        } else {
          var client = new Watcher(path)
          var watcher = client.watcher

          watcher.on('ready', function () {
            server.log(['info', 'vsd-plugin-fs-watch'],
              `Watching path ${path}`)

            idx = watchers.push(client) - 1
            cache[path] = idx

            // Listen to watcher events and publish events
            watcher.on('all', function (event, path, stat) {
              stat = stat || (event === 'unlinkDir')
              var fso = new FileSystemObject(path, stat)

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
            return reply({
              id: idx,
              watched: client.watched
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

  next()
}

exports.register.attributes = {
  pkg: require('./package.json')
}
