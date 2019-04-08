function check_location(row, column, map) {
  if (row < 0 || column < 0 || row >= 20 || column >= 20) {
    return (2);
  }
  row = Math.floor(row);
  column = Math.floor(column);
  if (map[row][column] == 0) {
    return (0);
  }
  return (1);
}

function get_height(screen_object, state) {
  if (state.debug == 1)
  {
    debugger;
  }
  let screen_row = screen_object.row;
  let screen_column = screen_object.column;
  let counter = 0;
  let row_distance = screen_row - state.player_row;
  let column_distance = screen_column - state.player_column;
  let row_increment = row_distance / 40;
  let column_increment = column_distance / 40;
  let new_row = screen_row + counter * row_increment;
  let new_column = screen_column + counter * column_increment;
  let location_indicator = check_location(new_row, new_column, state.map);
  let height = 0;
  let new_row_distance = 0;

  while (location_indicator == 0) {
    counter += 1;
    new_row = screen_row + counter * row_increment;
    new_column = screen_column + counter * column_increment;
    location_indicator = check_location(new_row, new_column, state.map);
  }
  if (location_indicator == 2) {
    return (0);
  }
  new_row_distance = new_row - state.player_row; 
  state.cross_sections.push([new_row, new_column]);
  height = row_distance / new_row_distance;
  return (height);
}

function start_game(state) {
  if (state.is_ready < 2) {
    return ;
  }
  clear_canvas(state);
  document.getElementById("full_screen").style = "none";
  state.canvas.style.display = "initial";
  put_image(state);
}

function get_left_and_right_screen_edges(state) {
  let user_row = state.player_row;
  let user_column = state.player_column;
  let angle = state.angle;
  let hypothenus = 0.5;
  let right_angle = 1.0472 + angle; // 60 degrees
  let left_angle = 2.0944 + angle; // 120 degrees
  
  left_angle %= 6.28319; // make it less than 360 degrees
  right_angle %= 6.28319; // make it less than 360 degrees
  state.left_edge_column = user_column + hypothenus * Math.cos(left_angle);
  state.left_edge_row = user_row + hypothenus * Math.sin(left_angle);
  state.right_edge_column = user_column + hypothenus * Math.cos(right_angle);
  state.right_edge_row = user_row + hypothenus * Math.sin(right_angle);
  console.log("PRINTING SCREEN EDGES");
  console.log({
    left_edge_column: state.left_edge_column,
    left_edge_row: state.left_edge_row,
    right_edge_column: state.right_edge_column,
    right_edge_row: state.right_edge_row
  });
}

function get_split_screen(state) {
  let column_difference = state.right_edge_column - state.left_edge_column;
  let row_difference = state.right_edge_row - state.left_edge_row;
  let column_increment = column_difference / state.canvas.width;
  let row_increment = row_difference / state.canvas.width;
  let screen_array = [];
  let temporary_object = {};
  let width_counter = 0;

  while (width_counter < state.canvas.width) {
    temporary_object = {};
    temporary_object.row = state.left_edge_row + row_increment * width_counter;
    temporary_object.column = state.left_edge_column + column_increment * width_counter;
    screen_array.push(JSON.parse(JSON.stringify(temporary_object)));
    width_counter += 1;
  }
  state.screen_array = screen_array;
}

function get_height_array(state) {
  let height_array = [];
  let height = 0;
  
  state.cross_sections = [];
  state.screen_array.forEach(
    (element) => {
      height = get_height(element, state);
      height_array.push(height);
    }
  )
  state.height_array = height_array;
}

function get_image_from_height_array(height_array) {
  return (0);
}

function put_image(state) {
  state.height_array.forEach(
    (element, index) => {
      let total_height = state.canvas.height;
      let blue = (1 - element) * total_height / 2;
      let green = blue;
      let red = total_height - blue - green;
      state.context.strokeStyle = "cyan";
      state.context.beginPath();
      state.context.moveTo(index, 0);
      state.context.lineTo(index, blue);
      state.context.stroke();
      state.context.strokeStyle = "red";
      state.context.beginPath();
      state.context.moveTo(index, blue);
      state.context.lineTo(index, blue + red);
      state.context.stroke();
      state.context.strokeStyle = "green";
      state.context.beginPath();
      state.context.moveTo(index, blue + red);
      state.context.lineTo(index, total_height);
      state.context.stroke();
    }
  );
}

function get_random_integer(min_inclusive, max_inclusive) {
  return (Math.floor(Math.random() * (max_inclusive - min_inclusive + 1)) + min_inclusive);
}

function get_player_location(state) {
  let row_index = get_random_integer(0, 19);
  let column_index = get_random_integer(0, 19);
  let map = state.map;
  while (state.map[row_index][column_index] != 0) {
    row_index = get_random_integer(0, 19);
    column_index = get_random_integer(0, 19);
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
  if (state.map == undefined) {
    state.map = get_preliminary_map();
    get_player_location(state);
  }
  get_left_and_right_screen_edges(state);
  get_split_screen(state);
  get_height_array(state);
  state.is_ready += 1;
  setTimeout( () => {start_game(state); }, 100);
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
  let increment_state_is_ready = () => { state.is_ready += 1; };
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
  setTimeout(increment_state_is_ready, 2250);
  setTimeout(() => { start_game(state); }, 2500);
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
  state.row_height = state.canvas.height / 20;
  return (state);
}

function clear_canvas(state) {
  state.context.fillStyle = "white";
  state.context.fillRect(0, 0, state.canvas.width, state.canvas.height);
}

function handle_resize(state) {
  state.canvas.width = state.canvas.clientWidth;
  state.canvas.height = state.canvas.clientHeight;
  state.row_height = state.canvas.height / 20;
  clear_canvas(state);
  put_image(state);
}

function bind_keys(state) {
  let keypress_handler = (event) => {
    let character = event.charCode || event.keyCode;
    let string = String.fromCharCode(character);

    if (string == "a" || "d") {
      event.preventDefault();
      if (string == "a") {
        state.angle += 0.785398 / 4;
      } else {
        state.angle -= 0.785398 / 4;
      }
      state.angle %= 6.28319;
      console.log(state.angle);
      prepare_for_game(state);
    }
  };

  window.addEventListener("keypress", keypress_handler);
}

function main() {
  var state = get_state_for_main();

  state.is_ready = 0;
  state.angle = 0;
  window.addEventListener("resize", () => { handle_resize(state); });
  bind_keys(state);
  window.state = state;
  state.coefficient = 0;
  state.is_ready = 0;
  setTimeout(() => { prepare_for_game(state); } , 100);
  draw_boxes_for_preview(state, 1.15);
}

main();