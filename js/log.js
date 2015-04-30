if (typeof console  != "undefined")
  if (typeof console.log != 'undefined')
    console.olog = console.log;
  else
    console.olog = function() {};
var logArea = $('#log');
console.log = function(message) {
  console.olog(message);
  logArea.append('<p>' + message + '</p>');
  logArea.animate({scrollTop: logArea.scrollHeight}, 200);
};
console.error = console.debug = console.info = console.log

console.clearAll = function() {
  logArea.html('');
}
