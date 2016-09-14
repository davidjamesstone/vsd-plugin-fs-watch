// Nes websocket service
function VsdFsService (client, options) {
  options = options || {}
  var mount = options.mount || ''

  function stat (path, callback) {
    client.request({
      path: mount + '/stat?path=' + path,
      method: 'GET'
    }, callback)
  }

  function readDir (path, callback) {
    client.request({
      path: mount + '/readdir?path=' + path,
      method: 'GET'
    }, callback)
  }

  function readFile (path, callback) {
    client.request({
      path: mount + '/readfile?path=' + path,
      method: 'GET'
    }, callback)
  }

  function writeFile (path, contents, callback) {
    client.request({
      path: mount + '/writefile',
      payload: {
        path: path,
        contents: contents
      },
      method: 'PUT'
    }, callback)
  }

  function mkdir (path, callback) {
    client.request({
      path: mount + '/mkdir',
      payload: {
        path: path
      },
      method: 'POST'
    }, callback)
  }

  function mkfile (path, callback) {
    client.request({ path: mount + '/mkfile',
      payload: {
        path: path
      },
      method: 'POST'
    }, callback)
  }

  function copy (source, destination, callback) {
    client.request({
      path: mount + '/copy',
      payload: {
        source: source,
        destination: destination
      },
      method: 'POST'
    }, callback)
  }

  function rename (oldPath, newPath, callback) {
    client.request({
      path: '/rename',
      payload: {
        oldPath: oldPath,
        newPath: newPath
      },
      method: 'PUT'
    }, callback)
  }

  function remove (path, callback) {
    client.request({
      path: mount + '/remove',
      payload: {
        path: path
      },
      method: 'DELETE'
    }, callback)
  }

  this.stat = stat
  this.mkdir = mkdir
  this.mkfile = mkfile
  this.copy = copy
  this.readFile = readFile
  this.readDir = readDir
  this.writeFile = writeFile
  this.rename = rename
  this.remove = remove
}

module.exports = VsdFsService
