/*Date: 2023 04 04*/

/*Global values:
    - a boolean which indicates the mode: module_mode = true, allows user to drag modify and run the modules
                                          module_mode = false, allows user to keyboard control the vehicle
    - an array of action object, used under module_mode == true, keep track of the modules dragged into middle section
    - an array but should only contain one action object at a time, used for keyboard controls
    - a support variable that keeps track of which module's attribute the user wants to modify
    - an array used to assist keyboard input: i.e. when user presses W, keep putting W into keys, once keys contains
      16 Ws, send a signal to the server
    - a string to keep track of which key is being pressed
    - a time interval used for displaying mesages
*/
var module_mode = true;

var actions = [];

var oneAction = [];

var currentSelectedModuleOrder = -1;

var keys = [];

var key = "";

var myInterval = null;


//Passing the user name from introduction page
document.addEventListener("DOMContentLoaded", function(event) {
    var params = new URLSearchParams(window.location.search);
    var username = params.get('username');

    user.name = username;

    fetch('/receiver', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })

    document.querySelector('#username').textContent = username;
})



/*For mode switches*/

function switch_mode(id) {
    if(id.toString() == "read_module") {
        module_mode = true;
        keys = [];
    }else {

        const list = document.querySelectorAll('[id$="_c"]');
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            element.classList.remove("highlight");
        }

        module_mode = false;
        defaultSliders();
        keys = [];
    }

    let node = document.getElementById(id.toString());

    //makes sure button stays highlighted unless other mode button is clicked
    node.addEventListener('click', function() {
        var otherNodes = document.querySelectorAll('.highlight1');
        otherNodes.forEach(function(otherNode) {
      if (otherNode !== node && otherNode.classList.contains('highlight1')) {
        otherNode.classList.remove('highlight1');
      }
    });
        node.classList.add("highlight1");
    });


}



/*For user Key display*/

//Arrow Keys implementation
//When arrow keys is pressed
window.addEventListener("keydown", function(event) {

    if(event.keyCode !== 13){

            defaultSliders();

     }

    if(!module_mode) {
        if (event.keyCode === 87 || event.which === 87 || // "W" key
            event.keyCode === 38 || event.which === 38) { // "up" arrow key

            var button = document.getElementById("arrow-up");
            button.classList.add("pressed");
            def_forward();

            keys.push("W");
            if(keys.length >= 16) {
                run("W");
                keys = [];
            }

        } else if (event.keyCode === 65 || event.which === 65 || // "A" key
            event.keyCode === 37 || event.which === 37) { // "left" arrow key

            var button = document.getElementById("arrow-left");
            button.classList.add("pressed");
            def_left();

            keys.push("A");
            if(keys.length >= 16) {
                run("A");
                keys = [];
            }
        }
        else if (event.keyCode === 68 || event.which === 68 || // "D" key
            event.keyCode === 39 || event.which === 39) { // "right" arrow key

            var button = document.getElementById("arrow-right");
            button.classList.add("pressed");
            def_right();

            keys.push("D");
            if(keys.length >= 16) {
                run("D");
                keys = [];
            }
        }
        else if (event.keyCode === 83 || event.which === 83 || // "S" key
            event.keyCode === 40 || event.which === 40) { // "down" arrow key

            var button = document.getElementById("arrow-down");
            button.classList.add("pressed");
            def_reverse();

            keys.push("S");
            if(keys.length >= 16) {
                run("S");
                keys = [];
            }
        }
    }
  });

//When arrow keys is released
window.addEventListener("keyup", function(event) {

     if(event.keyCode === 13){

            enterValue();

     }

    if(!module_mode) {

        if (event.keyCode === 87 || event.which === 87 || // "W" key
            event.keyCode === 38 || event.which === 38) { // "up" arrow key
            var button = document.getElementById("arrow-up");
            button.classList.remove("pressed");
            def_stop();
            keys = [];

            run("");
        }
        else if (event.keyCode === 65 || event.which === 65 || // "A" key
            event.keyCode === 37 || event.which === 37) { // "left" arrow key
            var button = document.getElementById("arrow-left");
            button.classList.remove("pressed");
            def_stop();
            keys = [];

            run("");
        }
        else if (event.keyCode === 68 || event.which === 68 || // "D" key
            event.keyCode === 39 || event.which === 39) { // "right" arrow key
            var button = document.getElementById("arrow-right");
            button.classList.remove("pressed");
            def_stop();
            keys = [];

            run("");
        }
        else if (event.keyCode === 83 || event.which === 83 || // "S" key
            event.keyCode === 40 || event.which === 40) { // "down" arrow key
            var button = document.getElementById("arrow-down");
            button.classList.remove("pressed");
            def_stop();
            keys = [];

            run("");
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

        //Clone the button/node being dragged and add an extensino as #_c to show node being cloned and which
        //node is it on the board
        let node = document.getElementById(data).cloneNode(true);

        //In the meantime, keep track of the nodes in an array
        putAction(node.id);

        let num = actions.length - 1;
        node.id = node.id + num.toString() + "_c";

        //Prevent user cloning a node that is already on the board
        node.draggable = false;

        //Modify the buttons so now they will light up being clicked
        node.addEventListener('click', function() {
            if(module_mode) {
                var otherNodes = document.querySelectorAll('.highlight');
                otherNodes.forEach(function(otherNode) {
                    if (otherNode !== node && otherNode.classList.contains('highlight')) {
                        otherNode.classList.remove('highlight');
                    }
                });
                node.classList.add("highlight");
            }
        });

        //Once the module is dropped into the middle section, display their default attributes
        const output = document.createElement("p");
        let len = node.id.toString().length;
        if(node.id.toString().substr(0, len - 3) == "forward" || node.id.toString().substr(0, len - 3) == "backward") {
            const text_node = document.createTextNode("Duration: 1, Speed: 1");
            output.appendChild(text_node);
        } else if(node.id.toString().substr(0, len - 3) == "left_turn" || node.id.toString().substr(0, len - 3) == "right_turn") {
            const text_node = document.createTextNode("Angle: 1, Speed: 1");
            output.appendChild(text_node);
        } else if(node.id.toString().substr(0, len - 3) == "sleep") {
            const text_node = document.createTextNode("Duration: 1")
            output.appendChild(text_node);
        }
        node.appendChild(output);

        //Add the modified node to the board.
        ev.target.appendChild(node);

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

//removes the last button dragged onto middle section
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

    console.log("Enter value called");

    if(module_mode) {

        console.log("Im here")

        const alen = actions.length

        const list = document.querySelectorAll('[id$="_c"]');

        for (let i = 0; i < alen; i++) {

            console.log("Im here");

            if(actions[i].order == currentSelectedModuleOrder) {

                console.log("Im here");

                let attributes = "";

                console.log(actions[i]);

                if(actions[i].hasOwnProperty("angle")){
                    actions[i].angle = parseInt(document.getElementById("angle_o").value);

                    attributes += "Angle: " + actions[i].angle.toString() + ", ";
                }

                if(actions[i].hasOwnProperty("duration")){
                    actions[i].duration = parseInt(document.getElementById("duration_o").value);

                    attributes = "Duration: " + actions[i].duration.toString() + ", ";
                }

                 if(actions[i].hasOwnProperty("speed")){
                    actions[i].speed = parseInt(document.getElementById("speed_o").value);

                    attributes += "Speed: " + actions[i].speed.toString() + ", ";
                }

                console.log("Im here");

                //Change the text display for the button
                let len = attributes.length;

                attributes = attributes.substr(0, len - 2);

                list[i].removeChild(list[i].lastChild);

                const output = document.createElement("p");

                const text_node = document.createTextNode(attributes);

                output.appendChild(text_node);

                list[i].appendChild(output);

                /* Set slider back to default after entering value*/
                defaultSliders();

            }

        }

    }
}


/* Functions for uploading module data to the server*/

function run(key) {
    if(module_mode) {

        actions.unshift(sent);

        sent.sentTime += 1;

        console.log(JSON.stringify(actions));

        fetch('/receiver', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(actions)
        })

        actions.shift();

        const message = document.getElementById("serial");

        myInterval = setInterval(running, 2000);

    }
    else {

        let action = null;

        if(key == "W") {
            action = JSON.parse(JSON.stringify(forward));
            action.speed = 15;
            action.duration = 1;
        } else if(key == "A") {
            action = JSON.parse(JSON.stringify(left_turn));
            action.speed = 15;
            action.angle = 10;
        } else if(key == "D") {
            action = JSON.parse(JSON.stringify(right_turn));
            action.speed = 15;
            action.angle = 10;
        } else if(key == "S") {
            action = JSON.parse(JSON.stringify(backward));
            action.speed = 15;
            action.duration = 1;
        } else {
            action = JSON.parse(JSON.stringify(sleep));
        }

        input.keyboard = key;

        oneAction.push(input);

        oneAction.push(action);

        console.log(JSON.stringify(oneAction));

        fetch('/receiver', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(oneAction)
        })

        oneAction = [];

    }
}

function running() {
                const message = document.getElementById("serial");

                message.innerHTML += "<br>";
                message.innerHTML += "running...";

                fetch('/finished')
                .then(response => response.text())
                .then(data => {

                    const finishedData = parseInt(data);

                    if(finishedData == 0) {
                        message.innerHTML += "<br>";
                        message.innerHTML += "Finished!";
                        clearInterval(myInterval);
                    }
                });
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
