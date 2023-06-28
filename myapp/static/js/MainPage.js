/*Date: 2023 03 30*/

var module_mode = true;

var actions = [];

var currentSelectedModuleOrder = -1;

//passing the user name
document.addEventListener("DOMContentLoaded", function(event) {
    var params = new URLSearchParams(window.location.search);
    var username = params.get('username');
    document.querySelector('#username').textContent = username;
})



/*For mode switches*/

function switch_mode(id) {
    if(id.toString() == "read_module") {
        module_mode = true;
    }else {

        const list = document.querySelectorAll('[id$="_c"]');
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            element.classList.remove("highlight");
        }

        module_mode = false;
        defaultSliders();
    }
}



/*For user Key display*/

//Arrow Keys implementation
//When arrow keys is pressed
window.addEventListener("keydown", function(event) {

    defaultSliders();

    if(!module_mode) {
        if (event.keyCode === 87 || event.which === 87 || // "W" key
            event.keyCode === 38 || event.which === 38) { // "up" arrow key
          var button = document.getElementById("arrow-up");
          button.classList.add("pressed");
          def_forward();
        }
        else if (event.keyCode === 65 || event.which === 65 || // "A" key
            event.keyCode === 37 || event.which === 37) { // "left" arrow key
          var button = document.getElementById("arrow-left");
          button.classList.add("pressed");
          def_left();
        }
        else if (event.keyCode === 68 || event.which === 68 || // "D" key
            event.keyCode === 39 || event.which === 39) { // "right" arrow key
          var button = document.getElementById("arrow-right");
          button.classList.add("pressed");
          def_right();
        }
        else if (event.keyCode === 83 || event.which === 83 || // "S" key
            event.keyCode === 40 || event.which === 40) { // "down" arrow key
          var button = document.getElementById("arrow-down");
          button.classList.add("pressed");
          def_reverse();
        }
    }
  });

//When arrow keys is released
window.addEventListener("keyup", function(event) {

    if(!module_mode) {

        if (event.keyCode === 87 || event.which === 87 || // "W" key
            event.keyCode === 38 || event.which === 38) { // "up" arrow key
          var button = document.getElementById("arrow-up");
          button.classList.remove("pressed");
          def_stop();
        }
        else if (event.keyCode === 65 || event.which === 65 || // "A" key
            event.keyCode === 37 || event.which === 37) { // "left" arrow key
          var button = document.getElementById("arrow-left");
          button.classList.remove("pressed");
          def_stop();
        }
        else if (event.keyCode === 68 || event.which === 68 || // "D" key
            event.keyCode === 39 || event.which === 39) { // "right" arrow key
          var button = document.getElementById("arrow-right");
          button.classList.remove("pressed");
          def_stop();
        }
        else if (event.keyCode === 83 || event.which === 83 || // "S" key
            event.keyCode === 40 || event.which === 40) { // "down" arrow key
          var button = document.getElementById("arrow-down");
          button.classList.remove("pressed");
          def_stop();
        }

    }
});




/*For modules drag and drop */

function allowDrop(ev) {

    if(module_mode) {
        ev.preventDefault();
        if (ev.target.tagName === 'BUTTON') {
            ev.dataTransfer.dropEffect = 'none'; // Set the dropEffect to "none" to indicate that the drop is not allowed
        } else {
            ev.dataTransfer.dropEffect = 'move'; // Set the dropEffect to "move" to indicate that the drop is allowed
        }
    }

}

function drag(ev) {

    if(module_mode) {
        ev.dataTransfer.setData("text", ev.target.id);
    }
}

function drop(ev) {

    if(module_mode) {

        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");

        let node = document.getElementById(data).cloneNode(true);

        putAction(node.id);

        let num = actions.length - 1;

        node.id = node.id + num.toString() + "_c";

        node.addEventListener('click', function() {
            if(module_mode) {
                node.classList.add("highlight");
            }
        });
        node.addEventListener("blur", function() {
            if(module_mode) {
                node.classList.remove("highlight");
            }
        });

        ev.target.appendChild(node);

        let alen = actions.length;
        for (let i = 0; i < alen; i++) {
            console.log(actions[i]);
        }

    }
}

/*Whenever a new action is added, needed to add a new if block for count order and put in action */

function putAction(id) {

    if(id == "forward") {
        actions.push(JSON.parse(JSON.stringify(forward)));
        actions[actions.length - 1].order = actions.length - 1;
    } else if(id == "backward") {
        actions.push(JSON.parse(JSON.stringify(backward)));
        actions[actions.length - 1].order = actions.length - 1;
    } else if(id == "left_turn") {
        actions.push(JSON.parse(JSON.stringify(left_turn)));
        actions[actions.length - 1].order = actions.length - 1;
    } else if(id == "right_turn") {
        actions.push(JSON.parse(JSON.stringify(right_turn)));
        actions[actions.length - 1].order = actions.length - 1;
    } else if(id == "sleep") {
        actions.push(JSON.parse(JSON.stringify(sleep)));
        actions[actions.length - 1].order = actions.length - 1;
    }

    else actions.push(id);

}

/*Functions for clearing or undo the modules on board*/

function reset() {

    if(module_mode) {

        const list = document.querySelectorAll('[id$="_c"]');
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            element.remove();
        }

        actions = [];

        currentSelectedModuleOrder = -1;

        defaultSliders();

    }
}

function undo() {

    if(actions.length != 0 && module_mode) {

        const list = document.querySelectorAll('[id$="_c"]');
        const element = list[list.length - 1];
        element.remove();

        actions.pop();

        defaultSliders();

    }

}



/*  A set of functions for modifying module values

    Click on one of the module in middle section, will enable changeProperty()

    This finds which module is being clicked, based on its property, call openSlider()

    this enables the correct sliders, and allows the user to slide the values

    and press enter to assign these values to that selected module by enterValue()
*/

function changeProperty(id) {

    if(module_mode) {

        console.log(id);

        let module = id.toString();

        let len = module.length;

        if(module.substr(len - 2) == "_c") {

            const order = module.substr(len - 3, 1);

            //This variable is global, used for Enter button
            currentSelectedModuleOrder = order;

            const alen = actions.length

            for (let i = 0; i < alen; i++) {

                if(actions[i].order == order) {

                    let angle = 0;

                    let speed = 0;

                    let duration = 0;

                    if(actions[i].hasOwnProperty("angle")){
                        angle = actions[i].angle;
                    }

                    if(actions[i].hasOwnProperty("speed")){
                        speed = actions[i].speed;
                    }

                    if(actions[i].hasOwnProperty("duration")){
                        duration = actions[i].duration;
                    }

                    const name = module.substr(0, len - 3);

                    openSlider(name, angle, speed, duration);

                }

            }

        }

    }

}

function openSlider(name, angle, speed, duration) {

    console.log(angle, speed, duration)

    //When sliders are opened, move the sliders to the clicked module's property

    //Speed

    let slider_speed = document.getElementById("speed_s");

    slider_speed.disabled = false;

    slider_speed.value = speed;

    document.getElementById("speed_o").value = speed;

    //Angle

    let slider_angle = document.getElementById("angle_s");

    slider_angle.value = angle;

    slider_angle.disabled = false;

    document.getElementById("angle_o").value = angle;

    //Duration

    let slider_duration = document.getElementById("duration_s");

    slider_duration.value = duration;

    slider_duration.disabled = false;

    document.getElementById("duration_o").value = duration;

    //Based on what is being clicked, disable the according slider,
    //i.e. forward => disable angle, turn => disable distance

    //the name here is the module's original id; i.e. forward0_c, id = forward

    if(name == "forward" || name == "backward") {

        slider_angle.disabled = true;

    } else if(name == "left_turn" || name == "right_turn") {

        slider_duration.disabled = true;

    } else if(name == "sleep") {

        slider_angle.disabled = true;

        slider_speed.disabled = true;

    }

}

function enterValue() {

    if(module_mode) {

        const alen = actions.length

        for (let i = 0; i < alen; i++) {

            if(actions[i].order == currentSelectedModuleOrder) {

                if(actions[i].hasOwnProperty("angle")){
                    actions[i].angle = parseInt(document.getElementById("angle_o").value);
                }

                if(actions[i].hasOwnProperty("speed")){
                    actions[i].speed = parseInt(document.getElementById("speed_o").value);
                }

                if(actions[i].hasOwnProperty("duration")){
                    actions[i].duration = parseInt(document.getElementById("duration_o").value);
                }

                /* Set slider back to default after entering value*/
                defaultSliders();

            }

        }

    }
}


/* Functions for uploading module data to the server
*/

function run() {
    if(module_mode) {

        console.log(JSON.stringify(actions));

        fetch('/receiver', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(actions)
        })

        .then(response => response.json())
        .then(data => {
          console.log('POST request succeeded with JSON response:', data);
          // Send a GET request after the POST request is successful
          fetch('/receiver')
          .then(response => response.json())
          .then(data => console.log('GET request succeeded with JSON response:', data))
          .catch(error => console.error('Error fetching GET request:', error));
        })
        .catch(error => console.error('Error fetching POST request:', error));
    }
}











/*helper functions*/
function defaultSliders() {

    /* Set slider back to default*/
    currentSelectedModuleOrder = -1;

    let slider_duration = document.getElementById("duration_s");

    slider_duration.value = 0;

    slider_duration.disabled = true;

    document.getElementById("duration_o").value = 0;

    let slider_speed = document.getElementById("speed_s");

    slider_speed.value = 0;

    slider_speed.disabled = true;

    document.getElementById("speed_o").value = 0;

    let slider_angle = document.getElementById("angle_s");

    slider_angle.value = 0;

    slider_angle.disabled = true;

    document.getElementById("angle_o").value = 0;

}


