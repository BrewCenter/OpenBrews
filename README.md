# OpenBrews
A cross-platform open source app to help you brew.

The goal of our first release is to provide a 100% free and modern alternative
to the brewing software currently being used. This will be in the form of two
iOS and Android applications.

Down the line, I would like to have an Web App and an API that allows
persistance of recipes across devices, public sharing of recipes, and more!

## Developers

### Tech Stack
This app is built using [Ionic Framework](http://ionicframework.com/), which is
built on AngularJS. If you have no idea what Ionic is, and only know AngularJS,
you'll probably be fine. We are also leveraging Ionic CSS (rather than
Bootstrap (for now). Other than that, the project uses GULP, Bower, and SCSS.

### Contributing
Anybody is welcome to contribute to OpenBrews. Just check out the issues for
current bugs and tasks. If you find one you like, please try to self-assign
the task, or leave a comment on the issue. When you're ready to start working,
branch off develop, code a little, and submit your PR. If you end up contributing
regularly, I can add you as a collaborator to this repository.

### Building and Running
To run the app, clone this repository and `cd` into the repository folder. You'll need to have [Ionic](http://ionicframework.com/) installed globally which you can do by running `npm install -g cordova ionic`. Then install the remaining dependencies with `npm install`. Finally you can run the app via `gulp && ionic serve [--lab]`.

If you would like to use features which utilize the brewerydb API, please create an account and get your own API key [here](http://www.brewerydb.com/developers). This should be added to your `config.json` file.

### Misc
Message me (mike) for an invitation to our slack team.

