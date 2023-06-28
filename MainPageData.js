const user = {
    name : null,
}

const input = {
    keyboard : "",
}

const sent = {
    sentTime : 0,
}

const forward = {
    motor : true,
    duration : 1,
    speed : 1,
    forward : true,

    /*The number of this element in the array
    i.e. first forward in the html order = 0
    second forward in html order = 1*/
    order : 0,
} 

const backward = {
    motor : true,
    duration : 1,
    speed : 1,
    forward : false,

    order : 0,
}

const left_turn = {
    motor : true,
    speed : 1,
    angle : 1,
    left : true,

    order : 0,
}

const right_turn = {
    motor : true,
    speed : 1,
    angle : 1,
    left: false,

    order : 0,
}

const sleep = {
    motor : false,
    duration : 1,
    order : 0,
}

//ARROW KEYS PRESSED IMPLEMENTATION
function def_forward(){
    //need to add going forward
    left_motor = true;
    right_motor = true;
    speed = 50;
}

function def_reverse(){
    //need to add going backward
    left_motor = true;
    right_motor = true;
    speed = 50;
}

function def_left(){
    //need to add going rotate to left
    left_motor = false;
    right_motor = true;
    speed = 30;
}

function def_right(){
    //need to add going rotate to right
    left_motor = true;
    right_motor = false;
    speed = 30;
}

function def_stop(){
    //need to add going rotate to right
    left_motor = false;
    right_motor =  false;
    speed = 0;
}

