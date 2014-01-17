Frameworkless
=============
A simple, flexible framework for developing medium complexity web application frontends.  


---


Quick Start
-----------
To get started über quick, you can generate a frameworkless app skeleton using Yeoman.  

**Install the frameworkless yeoman generator:**  
`npm install -g generator-frameworkless`  

**Generate your scaffolding:**  
`yo frameworkless`  


---


Medium Start
------------
If you're a little more particular about picking up new frameworks *(guilty)*, you may prefer to get things started manually so you can disassemble and play around at your lesure.  

**Clone the QuickStart repo manually:**  
`git clone git@github.com:synacor/frameworkless.git`  
*or:*  
`git clone https://github.com/synacor/frameworkless.git`  

**Take a look around:**  

* Framework bits live in `public/js/lib`
* App code is in `public/js/app`, `public/templates` and `public/css`.  


---


TCP Slow Start
--------------
Ok, so maybe you are just a bit ... *cautious?*  Yes, you're just cautious, that's all.  Slow and steady wins the race.  It's *definitely* not a fear thing, that would be ridiculous!  

.. right?


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

In the Quick Start example, a ridiculously thin DOM abstraction called [ford.js](https://github.com/developit/ford.js) is being used.  You are free to use whichever library you are most comfortable with - or no library at all.  

Perhaps you may find the need for complete abstraction of the DOM slowly fades away.  


---


License
=======
Hopefully GPLv3 or similar.  