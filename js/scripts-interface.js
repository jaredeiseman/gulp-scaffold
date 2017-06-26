var ExampleModule = require('./../js/scripts.js').exampleModule;


$(document).ready(function() {
  var exampleInstance = new ExampleModule('args');

  console.log(exampleInstance.examplePrototype());
});
