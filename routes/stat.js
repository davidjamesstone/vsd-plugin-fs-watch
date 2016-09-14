var Joi = require('joi')
var Boom = require('boom')
var fileutils = require('../file-system-utils')

module.exports = {
  method: 'GET',
  path: '/stat',
  config: {
    handler: function (request, reply) {
      var path = request.query.path

      fileutils.stat(path, function (err, data) {
        if (err) {
          return reply(Boom.badRequest('Stat failed', err))
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
