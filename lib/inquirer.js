const inquirer = require('inquirer');

// I learnt it from from scotch.io, and updated itself 
module.exports = {
  askGithubCredentials: () => {
    const questions = [
      {
        name: 'username',
        type: 'input',
        message: '~',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your username or e-mail address.';
          }
        }
      }
    ];
    return inquirer.prompt(questions);
  },
};