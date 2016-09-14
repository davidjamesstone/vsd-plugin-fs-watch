var Joi = require('joi')
var Boom = require('boom')
var fileutils = require('../file-system-utils')

module.exports = {
  method: 'PUT',
  path: '/writefile',
  config: {
    handler: function (request, reply) {
      var path = request.payload.path
      var contents = request.payload.contents

      fileutils.writeFile(path, contents, function (err, data) {
        if (err) {
          return reply(Boom.badRequest('Write file failed', err))
        }

        reply(data)
      })
    },
    validate: {
      payload: {
        path: Joi.string().required(),
        contents: Joi.string().required()
      }
    }
  }
}
