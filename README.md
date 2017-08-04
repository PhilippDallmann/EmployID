# EmployID - Peer-Coaching-Tool

**Table of Contents**

- [Deployment](#deployment)
- [JSDoc](#jsdoc)

## Deployment
The recommended way to deploy the tool is by using [meteor-up](https://github.com/zodern/meteor-up).

To get a basic idea on how the process works we recommend you to have a look at their [getting started tutorial](http://zodern.github.io/meteor-up/getting-started.html).

#### Step 1: Install Mup
Mup requires node 4 or newer versions. Run the following command.

    npm install -g mup
    
#### Step 2: Configure the Mup-files
This project already comes with all necessary files. You can find those in the `.deploy`-folder.

Open the `mup.js`-file in your favourite editor. Edit the following lines:

    module.exports = {
     servers: {
      one: {
        host: '1.2.3.4', //IP Adress of server
        username: 'root', //username on server
        // pem:
        // password:
        // or leave blank for authenticate from ssh-agent
        }
      },
      meteor: {
        name: 'pct', //name of the installation on server
        path: '..', //relative path to projectfolder on your local machine
        ...
        env: {
          ROOT_URL: 'app.com', //URL of the installation
          ...
        },
        ...
      },
       ...
    };

#### Step 3: Setup your Server
From the `.deploy`- folder run:

    mup setup
    
#### Step 4: Deploy the tool to your server
Still in the same folder run:

    mup deploy
    
#### Troubleshooting
If the windows script host gives you 'module' is undefined errors try running the commands as follows:

    mup.cmd setup
    mup.cmd deploy

## JSDoc
The Api of this project is documented with [JSDoc](http://usejsdoc.org/index.html) comments.

To use the automated JSDoc generation install [meteor-jsdoc](https://www.npmjs.com/package/meteor-jsdoc).

With meteor-jsdoc installed open a terminal in the project folder

    meteor-jsdoc init //adds jsdoc config files to your project
    meteor-jsdoc build //builds the docs
    meteor-jsdoc start //starts the doc server with default adress: localhost:3333
