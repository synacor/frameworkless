
![frameworkless logo](logo.png)

Frameworkless [![NPM Version](http://img.shields.io/npm/v/frameworkless.svg?style=flat)](https://www.npmjs.org/package/frameworkless)
=============
A simple, flexible framework for developing medium-complexity web application front-ends.  

[![Build Status](https://img.shields.io/travis/developit/puredom-model.svg?style=flat&branch=master)](https://travis-ci.org/developit/puredom-model)
[![Dependency Status](http://img.shields.io/david/synacorinc/frameworkless.svg?style=flat)](https://david-dm.org/synacorinc/frameworkless)
[![devDependency Status](http://img.shields.io/david/dev/synacorinc/frameworkless.svg?style=flat)](https://david-dm.org/synacorinc/frameworkless#info=devDependencies)

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/synacorinc/frameworkless)


---


Start from a Boilerplate
------------------------

Get started right away, so you can disassemble and play around at your lesure.

```bash
# Clone frameworkless
git clone git@github.com:synacorinc/frameworkless.git

# Install development dependencies
npm install

# Build the framework
npm run-script build      # or just `grunt` if you have grunt-cli installed globally

# Run a local web server
PORT=8080 npm start       # this just does `node server.js`
```


---


Quick Repo Tour
---------------

* `/src` is where the source code lives
* `/dist` is for build output. This is committed alongside source code so it is available via [bower](http://bower.io).
* `/demo` is a simple example app, built using [requirejs](http://requirejs.org) and [ford.js](http://developit.github.io/ford.js)


---


Modules
-------
Frameworkless is made up of three main modules:  

**events**  
*(module/class/mixin)* - Provides event firing and listening.  

**router**  
*(module/class)* - Instantiable declarative URL router.  

**util**  
*(namespace)* - Utility functions and essential ES5 polyfills.  

These modules provide the necessary tools for most of the logic one might be required to implement on the client.  You can load them using [require](http://requirejs.org/) or anoyther AMD-compatible loader.  


> Credit to [Riot.js](https://github.com/moot/riotjs) for sharing their ideology.  Riot is a great framework, it's just a different take on the most useful conventions for simple frontend development.*  


---


DOM Make Me Think
-----------------
One very common feature is notably absent: there is no DOM abstraction.  Taking yet another page from [Riot.js](https://github.com/moot/riotjs), DOM manipulation is left up to you, or to your library of choice.  

In the [demo](http://github.com/synacorinc/frameworkless/tree/master/demo), a tiny DOM library called [ford.js](https://github.com/developit/ford.js) is being used.  You are free to use whichever library you are most comfortable with - or no library at all.  

Perhaps you may find the need for complete abstraction of the DOM slowly fades away.  


---


License
=======
BSD
