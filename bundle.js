function get_left_and_right_screen_edges(user_row, user_column, angle) {
  let hypothenus = 0.5;
  let left_angle = 1.0472 + angle;
  let right_angle = 2.0944 + angle;
  let result_object = {};
  
  left_angle %= 6.28319;
  right_angle %= 6.28319;
  result_object.left_edge_row = hypothenus * Math.cos(left_angle);
  result_object.left_edge_column = hypothenus * Math.sin(left_angle);
  result_object.right_edge_row = hypothenus * Math.cos(right_angle);
  result_object.left_edge_row = hypothenus * Math.sin(right_angle);
  return (result_object);
}

function get_height_array(state) {
  return (0);
}

function get_image_from_height_array(height_array) {
  return (0);
}

function put_image(image, state) {
  return (0);
}

function get_random_integer(min_inclusive, max_inclusive) {
  return (Math.floor(Math.random() * (max_inclusive - min_inclusive + 1)) + min_inclusive);
}

function get_player_location(state) {
  let row_index = get_random_integer(0, 20);
  let column_index = get_random_integer(0, 20);
  while (state.map[row_index][column_index] != 0) {
    row_index = get_random_integer(0, 20);
    column_index = get_random_integer(0, 20);
  }
  row_index += 0.5;
  column_index += 0.5;
  state.player_row = row_index;
  state.player_column = column_index;
}

function get_preliminary_map() {
  let preliminary_map = Array(20).fill(0);
  preliminary_map.forEach(
    (element, index) => {
      preliminary_map[index] = Array(20).fill(0);
    }
  );
  let remaining_wall_count = 80;
  let row_index = Math.floor(Math.random() * 20);
  let column_index = Math.floor(Math.random() * 20);
  while (remaining_wall_count > 0) {
    if (preliminary_map[row_index][column_index] == 0) {
      preliminary_map[row_index][column_index] = 1;
      remaining_wall_count -= 1;
    }
    row_index = Math.floor(Math.random() * 20);
    column_index = Math.floor(Math.random() * 20);
  }
  return (preliminary_map);
}

function prepare_for_game(state) {
  state.is_game_started = 0;
  state.map = get_preliminary_map();
  get_player_location(state);
  state.counterclockwise_angle_from_north = 0;
}

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
  window.state = state;
  state.coefficient = 0;
  setTimeout(() => { prepare_for_game(state); } , 100);
  draw_boxes_for_preview(state, 1.15);
}

main();