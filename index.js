const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const files = require('./lib/files');
const inquirer  = require('./lib/inquirer');

const { WebClient, LogLevel } = require("@slack/web-api");
// WebClient insantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient("xoxb-2197446421379-2196090874581-09TkotiNLhv2c17078tcVUx4", {
  // LogLevel can be imported and used to make debugging simpler
  //logLevel: LogLevel.DEBUG
});
var unirest = require('unirest');


clear(); //to clear the terminal before terminal starts

console.log(
  chalk.yellow( //chalk is used to color text in CLI
    figlet.textSync('Ashish', { horizontalLayout: 'full' })
  )
);

const run = async () => {
    const credentials = await inquirer.askGithubCredentials();
    if(credentials.username.includes(`"history"`)){
      test();
    }
    else if(credentials.username.includes(`channel`) && credentials.username.includes(`message`)){
      groupMessage(credentials.username);
    }
    else if(credentials.username.includes(`channel`) && credentials.username.includes(`message`) && credentials.username.includes(`username`)){
      groupMessage(credentials.username);
    }
    else{
      console.log('Invalid Query');
  }

  };
  
run();


// Store conversation history
let conversationHistory;
// ID of channel you watch to fetch the history for
let channelId = "C025Q6ELKNZ";
async function test(){
    try {
        // Call the conversations.history method using WebClient
        const result = await client.conversations.history({
          channel: channelId
        });
        //conversationHistory = result.messages;
        let data='';
        result.messages.map(resmap=>{
            data = data + `${resmap.text}
`;
        });
        // Print results
        //console.log(conversationHistory.length + " messages found in " + channelId);
        //console.log(data);
        console.log(chalk.green(data));
      }
      catch (error) {
        console.error(error);
      }
}

function sendtochannel(val){
  var req = unirest('POST', 'https://hooks.slack.com/services/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')
  .headers({
    'Content-Type': 'application/json'
  })
  .send(JSON.stringify(val))
  .end(function (res) { 
    if (res.error) throw new Error(res.error); 
    console.log(res.raw_body);
  });
}

function groupMessage(x){
  let dataJSON;
  
  if(x.includes(`channel`) && x.includes(`message`) && x.includes(`username`)){
    let channel = x.slice(x.indexOf(`slack channel "`)+15,x.indexOf(`" message "`));
    let text = x.slice(x.indexOf(`" message "`)+11,x.indexOf(`" username "`));
    let username = x.slice(x.indexOf(`" username "`)+12,x.length-1);
    
    dataJSON = {
      "channel": `${channel}`,
      "username": `${username}`,
      "text": `${text}`,
      "icon_emoji": ":ghost:"
    }
    sendtochannel(dataJSON);
  }
  else if(x.includes(`channel`) && x.includes(`message`)){
    let channel = x.slice(x.indexOf(`slack channel "`)+15,x.indexOf(`" message "`));
    let text = x.slice(x.indexOf(`" message "`)+11,x.length-1);
    dataJSON = {
      "channel": `${channel}`,
      "username": "demo",
      "text": `${text}`,
      "icon_emoji": ":ghost:"
    }
    sendtochannel(dataJSON);
  }
  else{
    console.log('Invalid Query');
  }
}


