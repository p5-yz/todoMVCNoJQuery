**TodoMVC jQuery**

URL: [https://hyperdev.com/#!/project/maze-stealer](https://hyperdev.com/#!/project/maze-stealer)

This is the workspace for the watchandcode.com
screencast series on the jQuery version of TodoMVC.

**How to Read Source Code**

Why it’s important

1. Most of your time will be spent reading, not writing.
2. Simulates working at a company or open source project.
3. Fastest way to learn.
4. Reading makes you a better writer (just like English).
5. Learn how to ignore large parts of a codebase and get a piece-by-piece understanding.

Before you start

1. Read the docs (if they exist: app-spec.md)).
2. Run the code. (this can be difficult!)
3. Play with the app to see what the code is supposed to do.(get a sense of how  the code works!)
4. Think about how the code might be implemented.
5. Get the code into an editor.

The process

1. Look at the file structure.
2. Get a sense for the vocabulary.(what the functions name mean)
3. Keep a note of unfamiliar concepts that you'll need to research later.
4. Do a quick read-through without diving into concepts from #3.
5. Test one feature with the debugger. (test your assumptions with reality. Guess what the code does) 
6. Document and add comments to confusing areas.
7. Research items in #3 only if required.
8. Repeat.

Next level

1. Replicate parts of the app by hand (in the console).You can also experiment.
2. Make small changes and see what happens.
3. Add a new feature. (THE ULTIMATE GOAL. YOUR JOB!)

Unfamiliar concepts

1. jQuery.
2. What is the role of base.js?
3. What is the role of director.js
4. Handlebars.
5. uuid
6. localStorage.
7. JSON.
8. Dependancy managers in app-spec.md

Useful links

1. [https://github.com/tastejs/todomvc/blob/master/app-spec.md](https://github.com/tastejs/todomvc/blob/master/app-spec.md)

Notes

1. Go through the debugger on .getActiveTodos and .destroyCompleted.
2. See what `this` is without using bind.
3. Talk about method chaining.
3. Replicate in the console code you do not understand fully.

Video

   * todoMVC JQuery part 1.(29.35) 
   
Functions looked at:

* ~~indexFromEl()~~
  * Return the id on the element that was clicked. The `uuid` is the `id` we placed on the `li` label
  `$($0).closest('li').data('id')`
  
   ` > "89065056-74cb-4a48-b353-bbded591375d"`

* ~~destroy()~~
  * destroy deletes an item from the todos array.
  * How are events handled? see todo list from PJS
  
  *  closest(selector) travels up the tree structure to find the closest ancestor of        the selector
  [https://developer.mozilla.org/en-US/docs/Web/API/Element/closest](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)
  
* ~~bindEvents()~~
  * Fake code to test bind.
``` javascript
/*
 * This is a JavaScript Scratchpad.
 *
 * Enter some JavaScript, then Right Click or choose from the Execute Menu:
 * 1. Run to evaluate the selected text (Ctrl+R),
 * 2. Inspect to bring up an Object Inspector on the result (Ctrl+I), or,
 * 3. Display to insert the result in a comment after the selection. (Ctrl+L)
 */

object = {
        init: function() {
            this.data = [{toggle:true},{toggle:false},{toggle:false},{toggle:true},{toggle:false},{toggle:true},{toggle:true},{toggle:false}]
			      debugger
            this.bindEvent()
        },    
        bindEvent: function(){
        //note: add or remove bind to test effect on object.
           anotherObject.fakeHighOrderFunction(
                        this.fakeCallbackFunction.bind(this))
        },
        fakeCallbackFunction: function(){
			     return this.data.filter(function(name){
            	return (!name.toggle)
           })
        }
    }

    var anotherObject = {
        fakeHighOrderFunction: function(callbackFunction) {
           console.log (callbackFunction())
        }
    }

    object.init() 
```
  * Note: If `.bind` is not specified as part of the function call   (`function` instead of `function.bind(this)` ) the default object is the button that was pressed. ie,   `<input id="toggle-all" type="checkbox">`. If the `.bind(Object)` is used, the object is bound to the function.
  

* ~~toggle()~~ 
  * Converts the `uuid` to an index updates the todo array
* ~~toggleAll()~~
  * What does the method .prop() do? .prop() gets or sets the value of a         property on an element.
  If the `checked` property has changed/toggled, the todo array is updated.
  
  * $($0).prop('checked');
  
     true

    $($0).prop('checked');
    
     false

* ~~getActiveTodos()~~
  * This gets an array of active todos. All the complete=false are returned.
  
* ~~getCompletedTodos()~~
  * This gets an array of completed todos. all the completed completed=true are returned.
  
* ~~getFilteredTodos()~~
  * Filter dependent on whether `this.filter === 'active'` or `this.filter === 'active'`
  
* ~~destroyCompleted()~~
  * Hypothesis: the function seems to store all the active todos in the `this.todos` array. Most likely the completed todos are destroyed later!

* ~~create()~~
  * `e.which` - converts character to ascii code
  
* edit()
  * What does `find()` do? Looks for the desendent of the selector. i.e $( "li.item-ii" ).find("li")
  * A more accurate name is switch to edit mode
  * What does this do? `$input.val(<String>).focus()`
  
* editKeyUp()
  * What does this do?  $(e.target).data('abort', true).blur() (35.50)? The `blur()` event is sent to an element when it loses focus.
  
* update()
  * Go through every path
  
* util.uuid()
  * stick code in console to see how it works!!

* render()
  * Handlebars todoTemplate displaying data using objects array and the `this` keyword. Using basic logic.
  * Small example using the `this` keyword in handlebars [https://plnkr.co/edit/JTDF6WmQws2jnPxPYH0g?p=preview](https://plnkr.co/edit/JTDF6WmQws2jnPxPYH0g?p=preview) and 
  
      [https://plnkr.co/edit/lGMSsDwGFMEQYC4L2JkR?p=preview](https://plnkr.co/edit/lGMSsDwGFMEQYC4L2JkR?p=preview).
  
      Another example using the `footerTemplate` code [https://plnkr.co/edit/FKooZMuMXA9ukAQl59p0?p=preview](https://plnkr.co/edit/FKooZMuMXA9ukAQl59p0?p=preview)
  
* renderFooter()
  
  *  [http://handlebarsjs.com/block_helpers.html](http://handlebarsjs.com/block_helpers.html) for more help on helper methods.

* util.pluralize()
* util.store()
* init()
* setCursorPosition()
  *  Code to study later [http://plnkr.co/edit/xSGN59VKTiwTX0cZWVkK?p=preview](http://plnkr.co/edit/xSGN59VKTiwTX0cZWVkK?p=preview)

    



    