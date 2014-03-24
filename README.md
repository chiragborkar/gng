# Verizon Mobile Life Store
Dev Setup

## Building MLS

We'll be using grunt to build and serve the project. Using grunt will allow us all to have the same dev environment across the board. 

Here are the project requirements:

* Git
* Node.js (v0.8.22)
* Ruby (already installed if you're a mac user; Window users download ruby here: http://rubyinstaller.org/)
* Grunt
* Sass
* Compass
* sassy-math
* modular-scale
* zurb-foundation (3.2.2)

## Windows Users:
  - When installing Ruby: ** Make sure that the "Add Ruby executables to your PATH" option is checked.

## Mac Users: 
  - As a security measure it's a good idea to change ownership on your /usr/local directory to your account. This way you can execute the scripts there without having to use the 'sudo' command. To update the permissions for this, open a terminal/command prompt window and enter: 
  
```
  *sudo chown -R $USER /usr/local*
```
## All Users:

Please run through the following instructions, in order:

#### Step 1: Check out the MLS codebase from the git repository:  
```
https://bitbucket.org/wdavidow/sapient-vzw-mobile-lifestyle-store
```

#### Step 2: Install the following (Ruby) Gems: 

* compass
* sassy-math
* modular-scale
* zurb-foundation

Use the following command to perform the gem installation: 

```
gem install sassy-math modular-scale compass
```

Install Zurb Foundation v 3.2.2

```
gem install zurb-foundation --version "3.2.2" 
```
*make sure you install the way noted; running gem install zurb-foundation without the version will install zurb foundation 4.x which will not work with our project.


####Install NodeJS 
The best method is to use the installer package found here:

http://nodejs.org/download/


####Verify that NodeJS is isntalled 

In terminal type:

```
node –v 
```

Also verify Node Package Manager by typing the following: 

```
npm –v
```
Both of these commands should return a version string.

#### Install Grunt

In terminal, install grunt by typing:

``` 
npm install –g grunt
```

Once grunt, and any dependencies, finish installing, install grunt-cli by typing: 

```
npm install –g grunt-cli
```

In terminal, change directory to the folder where you've checked out the MLS codebase and type: 

```
npm install
```

This command will install any project-related dependencies and create the node server module to run grunt/node's internal web server in your browser.

After npm install completes, the final command to issue is: 

```
grunt server
```

