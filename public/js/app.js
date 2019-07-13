// UPDATES:
// Removed JQuery and replaced with native Javascript
// Changed methods into functions
// Removed Handlebars todoTemplate and footerTemplate and replaced with buildTodoList() and buildFooter() functions
// Removed Director's Router constructor function and replaced with my router function
// Removed DOM element method closest() and replaced with my version of the closest() function
// Removed Handlebars templates <SCRIPT> tags from index.html
// Removed Director.js <SCRIPT> tag from index.html
// Refactored functions for readability.
// Refactored render() into two separate function calls

  'use strict';  
    // GLOBAL VARIABLES.
    var ENTER_KEY = 13;
    var ESCAPE_KEY = 27;
    var filter;
    var todos;
    var todoTemplate, footerTemplate;

    function uuid() {
        /*jshint bitwise:false */
        var i, random;
        var uuid = '';

        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    }

    function pluralize(count, word) {
        return count === 1 ? word : word + 's';
    }

    function store(namespace, data) {
        if (arguments.length > 1) {
            return localStorage.setItem(namespace, JSON.stringify(data));
        } else {
            var store = localStorage.getItem(namespace);
            return (store && JSON.parse(store)) || [];
        }
    }
    
    function init() {
        loadTodos();-
        bindEvents();         
        initFilter('all')        
    }

    function router(){
        filter = "";
        if (location.hash === '#/all') 
          filter = 'all';
        if (location.hash === '#/active')
          filter = 'active';
        if (location.hash === '#/completed')
          filter = 'completed';
        if (filter)  
          render();
    }

    function initFilter(init){
      filter = init;                           // Initial filter 
      location.hash = '#/'.concat(init);       // Display initial filter type in URL
      render();
    }

    function bindEvents() {
      var new_todo = document.getElementById('new-todo');
      new_todo.addEventListener('keyup', function (e) {
        create(e);
      });
      var toggle_all = document.getElementById('toggle-all');
      toggle_all.addEventListener('change', function (e) {
        toggleAllTodos(e);
      });
      var todo_list = document.getElementById('todo-list');
      todo_list.addEventListener('click', function (e) {
        var className = e.target.className;
        if (className === 'destroy') {
          deleteSingleTodo(e);
        } 
      });
      todo_list.addEventListener('click', function (e) {
        var className = e.target.className;
        if (className === 'toggle') 
          toggleSingleTodo(e);
      });
      todo_list.addEventListener('keyup', function (e) {
        var className = e.target.className;
        if(className === 'edit')
          editKeyup(e);
      });
      todo_list.addEventListener('dblclick', function (e) {
        var elementName = e.target.nodeName;  
        if(elementName === 'LABEL')
          editMode(e);
      });
      todo_list.addEventListener('focusout', function (e) {
        var className = e.target.className;
        if (className === 'edit') 
          editTitle(e);
      });
      var footer = document.getElementById('footer');
      footer.addEventListener('click', function (e) {
        var IdName = e.target.id;
        if (IdName === 'clear-completed'){
          deleteMultipleTodos(e);
        }
      });
      window.addEventListener('hashchange', router);
    }

    /* Event handler functions */
    function newTodo(e) {
        create(e);
        saveTodos();
    }

    function toggleAllTodos(e) {
        toggleAll(e);
        saveTodos();
    }

    function deleteMultipleTodos() {
        deleteCompletedTodos();
        saveTodos();
    }

    function deleteSingleTodo(e) {
        destroy(e);
        saveTodos();
    }

    function toggleSingleTodo(e) {
        toggle(e);
        saveTodos();
    }

    function editTitle(e) {
        update(e);
        saveTodos();
    }

    function render(){
        renderTodos();
        renderFooter();  
    }

    function closest(e, element){
       function findElem(nextnode, element){
          if (nextnode.nodeName != element)
            return findElem (nextnode.parentNode, element);
          else
            return nextnode;
        }
        return findElem(e.target.parentNode, element);
    }

    function removeAttribute(e, attr){
        var li_elem = closest(e, 'LI');
        li_elem.removeAttribute(attr);
        render();
    }

    function update(e) {
        var whichTodoTitle = e.target.value.trim();
        if (!whichTodoTitle){ 
          destroy(e);
          return;
        }
        var whichIndex = indexFromElement(e);
        var abort = e.target.getAttribute('abort');
        if (abort == 'true')
          e.target.setAttribute('abort', false);
        else
         todos[whichIndex].title = whichTodoTitle;
        render();
    }

    function editMode(e) {                                               // Change from <Label> attribute to <input> ready for editing
        var liElem = closest(e, 'LI')
        liElem.setAttribute('class', 'editing');
        var editTitle = liElem.querySelector(".edit");

        var editTemp = editTitle.value;
        editTitle.value = "";
        editTitle.value = editTemp;
        editTitle.focus();
    }
  
    function editKeyup(e) {
        if (e.which == ESCAPE_KEY){
          e.target.setAttribute('abort', true);
          editTitle(e);
        } 
        if (e.which == ENTER_KEY){
          editTitle(e)
        }
    }

    /* 
        Event handler helper functions 
    */
    function toggleAll(e) {
        var checked = e.target.checked;
        todos.forEach(function (todo){
          todo.completed = checked;
        });
        render();
    }

    function getFilteredTodos() {
        // TODO:
        // It should return active todos if filter variable is set to `active`
        // It should return completed todos if filter variable is set to `completed`
        // It should return todos array if filter none of the above
        if (filter === 'active') {
            return getActiveTodos();
        }
        if (filter === 'completed') {
            return getCompletedTodos();
        }
        return todos;
    }

    function getActiveTodos() {
       return todos.filter(function(todo){
         return !todo.completed;              
       });
    }
    function getCompletedTodos() {
      return todos.filter(function(todo){
         return todo.completed;              
       });  
    }

    function deleteCompletedTodos() {
      filter = 'all';
      todos = getActiveTodos();
      render();
    }

    function indexFromElement(el) {
      var li = closest(el,'LI');
      var id = li.getAttribute('data-id');
      var i = todos.length;
      while (i--){
        if (todos[i].id === id){
          return i;
        }
      }
    }
    
    function create(e) {
      var title = e.target.value.trim();
      if (e.which == ENTER_KEY){
        if (!title){
          return;
        }
        todos.push({
         id:uuid(),
         title:title,
         completed:false
        });
        e.target.value="";
        e.target.focus();
        render();
      }
    }      
    
    function toggle(e) {
      // TODO: Currently at <INPUT .. TYPE=`checkbox`>
      // It should convert the element clicked to an index value 
      // It should toggle .completed property of the todo object
      // It should render new changes.
        var i = indexFromElement(e);
        todos[i].completed = !todos[i].completed;
        render();
    }

    function saveTodos() {
      // TODO:
      // It should store todos.
        store('to-jquery', todos);
    }

    function loadTodos(){
      // TODO:  
      // It should load todos.
        todos = store('to-jquery');
    }  

    function destroy(e) {
      // TODO:
        todos.splice(indexFromElement(e), 1);
        render();
    }

    function renderTodos() {
      var todos = getFilteredTodos();
      var new_todo = document.getElementById('new-todo');
      var todo_list = document.getElementById('todo-list');
      var $main = document.getElementById('main');
      var toggle_all = document.getElementById('toggle-all');      
      var template = buildTodoList(todos);
      
      todo_list.innerHTML = template;
      show($main, todos);
      if (getActiveTodos().length)
        toggle_all.checked = false;
      else
        toggle_all.checked = true;
      new_todo.focus();
    }

    function renderFooter() {
      var count = getActiveTodos();
      var footer = document.getElementById('footer');
      var template = buildFooter({activeTodoCount:count.length,
                                     activeTodoWord:pluralize(count.length, 'item'),
                                     filter:filter,
                                     completedTodos:getCompletedTodos().length
                                    });
      footer.innerHTML = template
      show(footer, todos)
    }

    function show(elem, todos){
        if (todos.length > 0) {
          elem.style.display = "block";
        } else {
          elem.style.display = "none";
        }     
    }  

    // Replacement function for original todoTemplate 
    function buildTodoList(todos) {
        var todosUl = document.querySelector('#todo-list');
        todosUl.innerHTML = "";
        for (var i = 0; i < todos.length; i++) {
          var todoLi = document.createElement('li');
          var todoLabel = document.createElement('label');
          var todoDivView = document.createElement('div');
          var todoInputToggle = document.createElement('input');
          var todoButton = document.createElement('button');
          var todoInputEdit = document.createElement('input');
          var id = todos[i].id;
          var title = todos[i].title;
          if (todos[i].completed === true) {
            todoLi.setAttribute('class', "completed");
            todoInputToggle.setAttribute("checked","");
          }
          todoLi.setAttribute('data-id', id);
          todoDivView.setAttribute('class', "view");
          todoInputToggle.setAttribute('class', "toggle");
          todoInputToggle.setAttribute('type', "checkbox");
          todoLabel.textContent = title;
          todoButton.setAttribute('class', "destroy");
          todoInputEdit.setAttribute('class', 'edit');
          todoInputEdit.setAttribute('value',title );
          todoLi.appendChild(todoDivView);
          todoDivView.appendChild(todoInputToggle);
          todoDivView.appendChild(todoLabel);
          todoDivView.appendChild(todoButton);
          todoLi.appendChild(todoInputEdit);
          todosUl.appendChild(todoLi);    
      }
      return todosUl.innerHTML;
  }

  // Replacement function for original footerTemplate
  function buildFooter(todos) {
    var footer = document.getElementById('footer');
    footer.innerHTML = ""
    var span = document.createElement('span');
    var ul = document.createElement('ul');
    var strong = document.createElement('strong');
    var liAll = document.createElement('li');
    var liActive = document.createElement('li');
    var liCompleted = document.createElement('li');

    var aAll = document.createElement('a');
    var aActive = document.createElement('a');
    var aCompleted = document.createElement('a');
    var completedButton = document.createElement('button');

    ul.setAttribute("id", "filters");
    span.setAttribute("id", "todo-count");
    span.innerHTML = '<strong>'+ todos.activeTodoCount+'</strong>'+  '&nbsp;'+todos.activeTodoWord + " left";
    liAll.innerHTML = (todos.filter === 'all') ? '<a class="selected" href="#/all">'
                                            +'All'+'</a>'+'&nbsp;':
                                             '<a href="#/all">'+'All'+'</a>'+'&nbsp;'
    liActive.innerHTML = (todos.filter === 'active') ? '<a class="selected" href="#/active">'+
                                                'Active'+'</a>'+'&nbsp;':
                                              '<a href="#/active">'+'Active'+'</a>'+'&nbsp;'
    liCompleted.innerHTML = (todos.filter === 'completed') ? '<a class="selected" href="#/completed">'+
                                              'Completed'+'</a>'+'&nbsp;' : 
                                              '<a href="#/completed">'+'Completed'+'</a>'+'&nbsp;' 
    ul.appendChild(liAll);
    ul.appendChild(liActive);
    ul.appendChild(liCompleted);
    footer.appendChild(span);
    footer.appendChild(ul);
    if (todos.completedTodos){
      completedButton.setAttribute("id", "clear-completed");
      completedButton.textContent = "Clear completed";
      footer.appendChild(completedButton);
    }  
    return footer.innerHTML;
  }

  init();