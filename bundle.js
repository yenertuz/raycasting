function start_game(state) {
  console.log("game started");
}

function display_intro(state) {
  state.context.font = "30px Arial";
  state.context.fillText("Hello World", 10, 50);
}

function main() {
  var state = {};
  state.canvas = document.getElementById("root");
  state.context = state.canvas.getContext("2d");
  display_intro(state);
  start_game(state);
}

console.log("about to start");
main();
