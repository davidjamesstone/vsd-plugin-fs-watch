const p = require('path')

var FileSystemObject = function (path, stat) {
  this.name = p.basename(path) || path
  this.path = path
  this.dir = p.dirname(path)
  this.isDirectory = typeof stat === 'boolean' ? stat : stat.isDirectory()
  this.isFile = !this.isDirectory
  this.ext = p.extname(path)
  if (typeof stat === 'object') {
    this.stat = stat
  }
}

module.exports = FileSystemObject
