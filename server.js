const nconf = require('nconf');
const linebot = require('linebot');
const path = require('path');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const express = require('express');

//config veriables setting.... 
nconf.argv().env('__').defaults({'NODE_ENV': 'development'});
const NODE_ENV = nconf.get('NODE_ENV');
nconf
   .defaults({'conf': path.join(__dirname, 'config', `${NODE_ENV}.config.json`)})
   .file(nconf.get('conf'));

const bot = linebot({
    channelId: nconf.get('auth:linebot:channelId'),
    channelSecret: nconf.get('auth:linebot:channelSecret'),
    channelAccessToken: nconf.get('auth:linebot:channelAccessToken')
});

bot.on('message', event => {
    const replayMsg = entities.encode(`Did you say ${event.message.text}`);
    console.log(replayMsg);

    event.reply(`Did you say ${replayMsg}`)
        .then(data => console.log('reply successfully', data))
        .catch(err => console.log({err}));
});

const linebotParser = bot.parser(),
app = express();
app.post(nconf.get('hookPath'), linebotParser);

app.listen(nconf.get('port'), () => {console.log('bot ready...')});