//Variable to store interval object
let runningInterval;

//Helper function that toggles the shading on a given cell from getCells
function toggleHTMLCell(x,y){
    Array.from(dom.boardNode.children)[size*x + y].classList.toggle("live");
}

//Helper function that sets the shading on a given cell from getCells
function setHTMLCell(x, y, liveState){
    Array.from(dom.boardNode.children)[size*x + y].classList.toggle("live", liveState);
}

//Generates the board, selects all the important elements on the dom and adding of event listeners 
document.addEventListener("DOMContentLoaded",function(){
	init(size, toggleHTMLCell, setHTMLCell)
    dom.startButton.addEventListener("click",startGame);
    dom.clearButton.addEventListener("click",clearBoard);
    dom.selectOption.addEventListener("change",usePreset);
    dom.speed.addEventListener("change",setSpeed)

    presets().forEach(function(item) {
        dom.selectOption.options[dom.selectOption.options.length] = new Option(item, item);
    })
})

function startGame(){
	runningInterval = setInterval(function(){
        step();
    }, speed);
    this.textContent = "Pause";
    this.removeEventListener("click", startGame);
    this.addEventListener("click", pauseGame);
    dom.boardHolder.style.pointerEvents = "none";
    disableInputs();
}

function pauseGame(){
    clearInterval(runningInterval);
    this.textContent = "Play";
    this.removeEventListener("click", pauseGame);
    this.addEventListener("click", startGame);
    dom.boardHolder.style.pointerEvents = "auto";
    enableInputs()
}

//Empties the html board
function clearBoard(){
    reset();
    dom.selectOption.querySelector("#custom").selected = 'selected';
}

//Uses a preset board
function usePreset(){
    setFromPreset(this.value);
}

//Sets the speed at which the iterations run
function setSpeed(){
    speed = this.value;
}

//Disables all the controls other than pause while game is running
function disableInputs(){
    controlsToToggle.forEach(function(control){control.setAttribute("disabled", "disabled");}); 
}

//Enables the controls once game is paused
function enableInputs(){
    controlsToToggle.forEach(function(control){control.removeAttribute("disabled");});
}