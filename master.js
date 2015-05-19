var cluster = require('cluster');
var fs = require('fs');
var crypto = require('crypto');
var cwd = process.cwd();

function getSHA1 () {
  return crypto.createHash('sha1')
                   .update(fs.readFileSync(__filename))
                   .digest('hex');
}

var version = getSHA1();

console.log('Starting master process with pid ' + process.pid);

//fork the first process
cluster.fork(process.env);

function reload () {
  process.chdir(cwd);

  if (version !== getSHA1()) {
    console.log('master server changed, exiting');
    return process.exit(1);
  }

  console.log('reloading...');
  var new_worker = cluster.fork();
  new_worker.once('listening', function () {
    //stop all other workers
    for(var id in cluster.workers) {
      if (id === new_worker.id.toString()) {
        continue;
      }
      cluster.workers[id].process.kill('SIGTERM');
    }
  });
}

process.on('SIGHUP', function () {
  reload();
}).on('SIGTERM', function () {
  for(var id in cluster.workers) {
    cluster.workers[id].process.kill('SIGTERM');
  }
}).once('SIGUSR2', function () {
  for(var id in cluster.workers) {
    cluster.workers[id].process.kill('SIGTERM');
  }
  process.kill(process.pid, 'SIGUSR2');
});
