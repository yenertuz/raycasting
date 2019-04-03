function start_game() {
  console.log("game started");
}

function display_intro() {
  context.font = "30px Arial";
  context.fillText("Hello World", 10, 50);
}

function main() {
  var canvas = document.getElementById("root");
  var context = canvas.getContext("2d");
  display_intro();
  start_game();
}

console.log("about to start");
main();
