const logger = require('./lib/logger');
const notification = require('./lib/notification');


function sendProcessInfo() {
  const mu = process.memoryUsage();
  const memrss = Math.floor(mu.rss / 1024);
  const memheap = Math.floor(mu.heapTotal / 1024);
  const memhuse = Math.floor(mu.heapUsed / 1024);

  const data = { memrss, memheap, memhuse };

  process.send({ type: 'procinfo', data });
}

function main() {
  let opt;
  try {
    opt = JSON.parse(process.argv[2]);
  } catch (e) {
    opt = {};
  }

  const logfile = opt.logfile || path.join(__dirname, 'ih_pushnotification.log');
  const loglevel = opt.loglevel || 0;

  logger.start(logfile, loglevel);
  logger.log('Plugin pushnotification has started  with args: ' + process.argv[2]);

  setInterval(sendProcessInfo, 10000);


  process.on('message', msg => {
    if (typeof msg === 'object' && msg.type === 'sub' && msg.data!== undefined) {
      msg.data.sendTo.forEach(user => {
        const msg = {
          suuid: opt.hwid,
          token: user.addr,
          title: data.sign || '',
          body: data.txt || '',
        };

        logger.log(JSON.stringify(msg))

        notification(msg)
          .then(res => {
            plugin.debug(res);
          })
          .catch(e => plugin.debug(e.message));
      });
    }
  });


  process.send({ 
    type: 'sub',
    id: opt.id,
    event: 'sendinfo',
    filter: { type: opt.id }
  });
}

main();