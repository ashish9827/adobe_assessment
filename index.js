//These three are npm packages
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const credential = require('./credential.json');
const files = require('./lib/files');
const inquirer  = require('./lib/inquirer');

//This code is created by conversation history and I'm using my own credentials here

const { WebClient, LogLevel } = require("@slack/web-api");
// WebClient insantiates a client that can call API methods
const client = new WebClient(credential.botUserOAuthToken, {});
var unirest = require('unirest'); // It is used for API call

//When program execute, It will clear the terminal first
clear();
//this function print Ashish in yellow color in terminal
console.log( 
  chalk.yellow(
    figlet.textSync('Ashish', { horizontalLayout: 'full' })
  )
);

const run = async () => {
    const credentials = await inquirer.askGithubCredentials();
    // These conditions are my own implementation.
    if(credentials.username.includes(`history`)  && credentials.username.includes(`"general"`)){
      test(credential.channelIdGeneral);
    }
    else if(credentials.username.includes(`history`)  && credentials.username.includes(`"learning"`)){
      test(credential.channelIdLearning);
    }
    else if(credentials.username.includes(`channel`) && credentials.username.includes(`message`)){
      groupMessage(credentials.username);
    }
    else if(credentials.username.includes(`channel`) && credentials.username.includes(`message`) && credentials.username.includes(`username`)){
      groupMessage(credentials.username);
    }
    else{
      console.log('Invalid Command');
    }
};
  
run();

// This is a predefine code, I got it from slack only credentials are my own
// ID of channel you watch to fetch the history for
async function test(id){
    try {
        // Call the conversations.history method using WebClient
        const result = await client.conversations.history({
          channel: id
        });
        let data='';
        result.messages.map(resmap=>{
            data = data + `${resmap.text}
`;
        });
        console.log(chalk.green(data));
      }
      catch (error) {
        console.error(error);
      }
}

// I've prepared this function by using postman
function sendtochannel(val){
  var req = unirest('POST', credential.webhookURL)  //3
  .headers({
    'Content-Type': 'application/json'
  })
  .send(JSON.stringify(val))
  .end(function (res) { 
    if (res.error) throw new Error(res.error); 
    console.log(chalk.blue("Message sent"));
  });
}

// This function is my own implementation
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


