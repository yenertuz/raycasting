function handle_flash(state) {
  let text_div = document.getElementById("full_screen");
  let text_span = document.getElementById("full_screen_text");
  let change_color = (text_div, text_span) => {
    if (text_div.style.backgroundColor == "orange") {
      text_div.style.backgroundColor = "black";
      text_span.style.color = "orange";
    } else {
      text_div.style.backgroundColor = "orange";
      text_span.style.color = "black";
    }
  };
  let interval_function = () => { change_color(text_div, text_span);   };
  state.canvas.style.display = "none";
  text_div.style.display = "table";
  text_div.style.backgroundColor = "orange";
  text_span.style.color = "black";
  setTimeout(interval_function, 250);
  setTimeout(interval_function, 500);
  setTimeout(interval_function, 750);
  setTimeout(interval_function, 1000);
  setTimeout(interval_function, 1250);
  setTimeout(interval_function, 1500);
  setTimeout(interval_function, 1750);
  setTimeout(interval_function, 2000);
  setTimeout(interval_function, 2250);
}

function reassign_coefficient_and_next_cycle(state) {
  let handle_timeout = () => {
    draw_boxes_for_preview(state);
  };
  if (state.coefficient < 1) {
    state.coefficient += 0.2;
    state.timeout = setTimeout(handle_timeout, 400);
  } else {
    handle_flash(state);
  }
}

function get_random_color(state) {
  let colors = ["black", "white", "red", "blue", "green", "yellow", "purple", "cyan", "orange"];
  let random_index = Math.floor(Math.random() * 9);

  return (colors[random_index]);
}

function draw_boxes_for_preview(state) {
  let row_pointer = 0;
  let column_pointer = 0;

  if (state.coefficient >= 1) {
    reassign_coefficient_and_next_cycle(state);
    return ;
  }
  while (row_pointer < state.canvas.height) {
    column_pointer = 0;
    while (column_pointer < state.canvas.width) {
      state.context.fillStyle = get_random_color(state);
      state.context.fillRect(column_pointer, row_pointer, state.row_height + 10, state.row_height + 10);
      column_pointer += state.row_height;
    }
    row_pointer += state.row_height;
  }
  reassign_coefficient_and_next_cycle(state);
}

function get_state_for_main() {
  let state = {};
  
  state.canvas = document.getElementById("root");
  state.context = state.canvas.getContext("2d");
  state.canvas.width = state.canvas.clientWidth;
  state.canvas.height = state.canvas.clientHeight;
  state.row_height = state.canvas.height / 10;
  return (state);
}

function clear_canvas(state) {
  state.context.fillStyle = "white";
  state.context.fillRect(0, 0, state.canvas.width, state.canvas.height);
}

function handle_resize(state) {
  state.canvas.width = state.canvas.clientWidth;
  state.canvas.height = state.canvas.clientHeight;
  state.row_height = state.canvas.height / 10;
  clear_canvas(state);
  state.context.font = "30px Arial";
  state.context.fillStyle = "black";
  state.context.fillText("Resize handled", 10, 50);
}

function main() {
  var state = get_state_for_main();

  window.addEventListener("resize", () => { handle_resize(state); });
  state.coefficient = 0;
  draw_boxes_for_preview(state, 1.15);
}

main();