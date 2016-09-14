var Joi = require('joi')
var Boom = require('boom')
var fileutils = require('../file-system-utils')

module.exports = {
  method: 'GET',
  path: '/readdir',
  config: {
    handler: function (request, reply) {
      fileutils.readDir(request.query.path, function (err, data) {
        if (err) {
          return reply(Boom.badRequest('Read dir failed', err))
        }

        reply(data)
      })
    },
    validate: {
      query: {
        path: Joi.string().required()
      }
    }
  }
}
