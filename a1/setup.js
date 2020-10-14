//Variables to access certain parts of the dom without making repeated queries
const dom = {};
let controlsToToggle;

//Allows the board size to be modified by the user via the url
const defaultBoardSize = 24;
let size = Math.min(100, Math.max(24, + new URL(location).searchParams.get("size") || defaultBoardSize));

//Number of ms per iteration
let speed = 200;

document.addEventListener("DOMContentLoaded",function(){
    dom.boardHolder = document.getElementById("board-holder");
    dom.buttonBar = document.getElementById("button-bar");
    dom.startButton = document.getElementById("start");
    dom.clearButton = document.getElementById("clear");
    dom.selectOption = document.getElementById("select");
    dom.speed = document.getElementById("speed");
    dom.speed.value = speed;
    controlsToToggle = [dom.clearButton, dom.selectOption, dom.speed]
    initializeBoard();
})

function initializeBoard(boardSize = size){
	let size = boardSize;
	if(dom.boardNode){
        dom.boardNode.parentNode.removeChild(dom.boardNode);
    }
    dom.boardNode = document.createElement("div");
    dom.boardNode.id = "board";
    dom.boardHolder.insertBefore(dom.boardNode, dom.buttonBar);
    dom.boardNode.style.gridTemplateRows = "repeat("+size+", auto)";
    dom.boardNode.style.gridTemplateColumns = "repeat("+size+", auto)";
    Array(size).fill(0).forEach((row,i) => {
        Array(size).fill(0).forEach((col,j) =>{
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.x = i;
            cell.y = j;
            dom.boardNode.appendChild(cell);
            cell.addEventListener("click", toggleCell);
        })
    })
}

function toggleCell(){
	toggled(this.x,this.y);
	dom.selectOption.querySelector("#custom").selected = 'selected';
}