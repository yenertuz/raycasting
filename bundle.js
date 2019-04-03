function get_state_for_main() {
  let state = {};
  
  state.canvas = document.getElementById("root");
  state.context = state.canvas.getContext("2d");
  state.canvas.width = state.canvas.clientWidth;
  state.canvas.height = state.canvas.clientHeight;
  return (state);
}

function clear_canvas(state) {
  state.context.fillStyle = "white";
  state.context.fillRect(0, 0, state.canvas.width, state.canvas.height);
}

function handle_resize(state) {
  state.canvas.width = state.canvas.clientWidth;
  state.canvas.height = state.canvas.clientHeight;
  clear_canvas(state);
  state.context.font = "30px Arial";
  state.context.fillStyle = "black";
  state.context.fillText("Resize handled", 10, 50);
}

function main() {
  var state = get_state_for_main();

  window.addEventListener("resize", () => { handle_resize(state); });
  state.context.font = "30px Arial";
  state.context.fillText("Initial display", 10, 50);
}

main();