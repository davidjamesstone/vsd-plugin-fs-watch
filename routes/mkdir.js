var Joi = require('joi')
var Boom = require('boom')
var fileutils = require('../file-system-utils')

module.exports = {
  method: 'POST',
  path: '/mkdir',
  config: {
    handler: function (request, reply) {
      var path = request.payload.path

      fileutils.mkdir(path, function (err, data) {
        if (err) {
          return reply(Boom.badRequest('Make directory failed', err))
        }

        reply(data)
      })
    },
    validate: {
      payload: {
        path: Joi.string().required()
      }
    }
  }
}
