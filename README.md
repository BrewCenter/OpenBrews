# OpenBrews <img alt="Build Status" src="https://travis-ci.org/OpenBrews/OpenBrews.svg?branch=add-travis">
A brewing app for iOS and Android, built with Ionic Framework.

<img alt="Edit Recipe" src="/docs/img/screenshots/edit.png?raw=true" width="350">
<img alt="Edit Recipe" src="/docs/img/screenshots/smart-type.png?raw=true" width="350">

## Setup/Usage
### Prereqs
1. [Ionic](http://ionicframework.com/) installed globally
    * `npm install -g cordova ionic`
2. [Gulp](http://gulpjs.com/) installed globally
    * `npm install -g gulp`
#### Testing Prereqs
3. npm install -g karma-cli
    
### Steps to run locally
1. Clone this repository
    * `git clone git@github.com:OpenBrews/OpenBrews.git`
2. `cd` into the repository folder.
3. Clone the repo's submodules
    * `git submodule update --init --recursive`
4. Install the remaining dependencies with `npm install`.
5. Finally, you can run the app via `gulp && ionic serve [--lab]`.

### Steps to run on your phone
1. First, follow the steps above to run the app locally.
2. Download the [Ionic View](http://view.ionic.io/) App on your mobile device.
3. Create an Ionic View account.
4. `cd` into the repository folder
5. Run `ionic upload`. You will be prompted for your ionic view credentials.
    * If you receive an error such as `www.zip cannot be found`, press
    <kbd>Ctrl</kbd>+<kbd>c</kbd> to stop the process. Run `mv openbrews.zip www.zip`,
    and run `ionic upload` again.

### Steps to run unit tests
1. First, follow the steps to run the app locally, making sure your modules are up-to-date.
2. Install the Testing prereqs above.
3. `cd` into the `openbrews/` directory.
4. Run `karma start`

### Optional Configuration
If you would like to use features which utilize the brewerydb API, 
please create an account and get your own API key 
[here](http://www.brewerydb.com/developers). This should be added to
your `openbrews/config.json` file. If you do not have a `config.json` file,
copy and rename `openbrews/example.config.json`.

**Note: To make requests to the BreweryDB API in the browser you will need to allow CORS
in the browser you are using.**

## Developers

### Ask for a Slack Invite
Please, don't be afraid to ask for an invite to our slack chat. We can discuss
problems and work through issues together. Email [Mike](https://github.com/mdw7326)
for an invite.

### Tech Stack
This app is built using [Ionic Framework](http://ionicframework.com/), which is
built on AngularJS. If you have no idea what Ionic is, and only know AngularJS,
you'll probably be fine. We are also leveraging Ionic CSS (rather than
Bootstrap). Other than that, the project uses GULP, Bower, and SCSS.

### Contributing
Monitor the Issues board for tasks that need to be completed. Check the comments 
on an issue to get all the background info and see if anyone else has started
work on it. When you're ready to develop, fork the repository, do your work,
and submit a PR. Please note that changes may be requested. If you become a
regular contributor, I may add you as a collaborator to this repository.

## Goals
### Alpha Pre-Release
We are currently trying to work through our remaining issues so that we can
build an Android package for an Alpha Release. We need to elicit feedback
from the community as early as possible. There are about 50 people signed up
to be notified when we release this.

### Release 1
Release 1 will focus on delivering a core Recipe Builder app. It will be
a standalone application, except for some data-gathering API calls to BreweryDB. 

### Future
Down the line, I would like to have an Web App and an API that allows
persistance of recipes across devices, public sharing of recipes, and more!

## Contact
Email [Mike](https://github.com/mdw7326) with any questions or concerns you may have regarding this project.

## Don't Forget to Star!
Remember, if you like what we're doing here, please star this repository :)

