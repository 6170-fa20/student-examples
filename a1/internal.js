/**
 * Creates an empty board of the given size.
 * 
 * @param {Number} n the size of the game board
 * @param {function} htmlToggle a function that toggles the shading on the cell on the x-th row and y-th column
 * @param {function} htmlSet a function that sets the shading on the cell on the x-th row and y-th column 
 *      to black if the boolean liveState is true and white if false
 */
const makeBoard = (n, htmlToggle, htmlSet) => {
  let board = [];

  // initialize the board to be n x n with all cells labelled dead
  for (x = 0; x < n; x++) {
    board.push([]);
    for (y = 0; y < n; y++) {
      board[x][y] = false;
    }
  }

  /**
   * Marks the given cell as "alive" or "dead" based on the value of `liveState`
   * 
   * @param {Number} x the x-coordinate of the cell that is being set
   * @param {Number} y the y-coordinate of the cell that is being set
   * @param {Boolean} liveState if `true` marks the cell as "alive", if `false` marks the cell as "dead"
   */
  const setBoardCell = (x, y, liveState) => {
    htmlSet(x, y, liveState);
    board[x][y] = liveState;
  }

  /**
   * Toggles the state of the given cell such that it will be marked as "alive" if the cell was dead before
   * this function call, and it will be marked as "dead" otherwise.
   * 
   * @param {Number} x the x-coordinate of the cell that is being toggled
   * @param {Number} y the y-coordinate of the cell that is being toggled
   */
  const toggleBoardCell = (x, y) => {
    htmlToggle(x, y);
    board[x][y] = !board[x][y];
  }

  /**
   * Marks all cells on the game board as dead (This is the same as making a new game)
   */
  const clearBoard = () => {
    forEach((x, y) => {
      setBoardCell(x, y, false);
    });
  }

  /**
   * Takes in a coordinate on the board and returns the number of living neighbors that surround it.
   * 
   * A "neighbor" is defined as the set of cells in a 3x3 square centered on the given cell, but
   * does not include the given cell.
   * 
   * @param {Number} x the x-coordinate of the cell that is being queried
   * @param {Number} y the y-coordinate of the cell that is being queried
   * 
   * @returns {Number} the number of living neighbors of the queried cell
   */
  const getNumAliveNeighbors = (x, y) => {
    let numAliveNeighbors = 0;

    // iterate through the square centered on the cell
    for (deltaX = -1; deltaX < 2; deltaX++) {
      for (deltaY = -1; deltaY < 2; deltaY++) {
        let neighborX = x + deltaX;
        let neighborY = y + deltaY;

        // don't consider OOB coodrinates
        if ((neighborX < 0 || neighborX >= n) || (neighborX < 0 || neighborX >= n)) {
          continue;
        }
        // don't count the cell itself
        if (neighborX === x && neighborY === y) {
          continue;
        }

        // the cell is counted as alive if it is `true` in the board
        if (board[neighborX][neighborY]) {
          numAliveNeighbors++;
        }
      }
    }

    return numAliveNeighbors;
  }

  /**
   * Returns the state of the cell, such that `true` is "alive" and `false` is "dead".
   * 
   * @param {Number} x The x-coordinate of the queried cell
   * @param {Number} y The y-coordinate of the queried cell
   * 
   * @returns {boolean} true if the cell is alive, false otherwise
   */
  const getCell = (x, y) => board[x][y];

  /**
   * Returns the size of one side of the board
   * 
   * @returns {Number} the integer size of one side of the board
   */
  const getBoardSize = () => n;

  /**
   * Iterates over all of the cells in the board, calling a provided function at each cell. The function
   * is given the x and y coordinates of the cell, along with the value of the cell at that location.
   * 
   * @param {function} f A function that takes three values (Number, Number, boolean) and performs some action
   */
  const forEach = (f) => {
    board.forEach((row, x) => {
      row.forEach((value, y) => {
        f(x, y, value);
      });
    });
  }

  /**
   * Runs one iteration of the game on the board
   * This function is called on a regular interval while the game is playing.
   */
  const step = () => {

    // generate the next iteration of the board by applying the rules to each cell
    const newBoard = board.map((row, x) => row.map((state, y) => {

      let numNeighbors = getNumAliveNeighbors(x, y);

      // if a cell has less than 2 living neighbors, it dies no matter what
      if (numNeighbors < 2) {
        return false;
      
      // if a cell has exactly 2 living neighbors, it maintains its state
      } else if (numNeighbors == 2) {
        return state;

      // if a cell has exactly 3 living neighbors, it is alive no matter what
      } else if (numNeighbors == 3) {
        return true;
      }

      // otherwise, the cell dies (or stays dead)
      return false;
    }));

    // apply the transformations to the ui by changing the board
    forEach((x, y) => {
      const newState = newBoard[x][y];
      setBoardCell(x, y, newState);
    });
  }

  return {
    setBoardCell,
    toggleBoardCell,
    clearBoard,
    getNumAliveNeighbors,
    getCell,
    getBoardSize,
    forEach,
    step,
  };
}

// A board instance that will be used by the required functions
let board;

/**
 * Accepts a list of points on the board and marks all of them as
 * "alive"
 * 
 * @param {[[Number]]} pointList an Array of valid points on the board, where each point is in the form `[x,y]`
 */
let buildFromList = (pointList) => {
  pointList.forEach(point => {
    let xCoord = point[0];
    let yCoord = point[1];

    board.setBoardCell(xCoord, yCoord, true);
  });
}

// Mapping of all preset games to the functions that make them
let presetBoards = {

  // Start with all cells on the border being alive
  "Border": () => {
    board.forEach((x, y) => {
      if (x === 0 || x === board.getBoardSize() - 1) {
        board.setBoardCell(x, y, true);
      } else if (y === 0 || y === board.getBoardSize() - 1) {
        board.setBoardCell(x, y, true);
      }
    });
  },

  // Marks all cells living on a diagonal as alive
  "Big X": () => {
    board.forEach((x, y) => {
      if (x + y === board.getBoardSize() - 1 || x === y) {
        board.setBoardCell(x, y, true);
      }
    });
  },

  "Glider": () => {
    let gliderCoords = [[0, 1], [1, 2], [2, 2], [2, 0], [2, 1]] // should walk from top left to bottom right of the screen
    board.forEach((x, y) => {
      gliderCoords.forEach((ele) => {
        if (ele[0] == y && ele[1] == x) {
          board.setBoardCell(x, y, true);
        }
      });
    })
  },

  "Exploder": () => {
    let gliderCoords = [[9, 9], [9, 10], [9, 11], [9, 12], [9, 13], [13, 9], [13, 10], [13, 11], [13, 12], [13, 13], [11, 9], [11, 13]] // exploder
    board.forEach((x, y) => {
      gliderCoords.forEach((ele) => {
        if (ele[0] == y && ele[1] == x) {
          board.setBoardCell(x, y, true);
        }
      });
    })
  }
};

/**
  * Returns an array of names of preset configurations to be offered.
  */
function presets(){
  return Object.keys(presetBoards);
}

/**
  * Initializes the initial internal board state with all white cells given the size of the board
  * This function is called when the board is first initialized.
  *
  * n: The side length of the board
  * toggleHTMLCell(x,y): a function that toggles the shading on the cell on the x-th row and y-th column  
  * setHTMLCell(x,y,liveState): a function that sets the shading on the cell on the x-th row and y-th column 
  *     to black if the boolean liveState is true and white if false
  */
function init(n, toggleHTMLCell, setHTMLCell){board = makeBoard(n, toggleHTMLCell, setHTMLCell);}

/**
  * Resets the board state to its initial state with all white cells
  * This function is called when the clear button is clicked.
  */
function reset(){board.clearBoard();}

/**
  * Sets the board to a state configuration corresponding to one of the presets
  * This function is called when an item on the dropdown is selected with the selected name as the argument.
  *
  * presetName: The name of the selected preset configuration, matches on of those generated by presets()
  */
function setFromPreset(presetName){
  reset();
	presetBoards[presetName]();
}

/**
  * Runs one iteration of the game on the board
  * This function is called on a regular interval while the game is playing.
  */
function step(){board.step()}

/**
  * Toggles the cell on the x-th row and y-th column from shaded to unshaded or vice versa
  * This function is called when the cell is manually clicked by the user while the game is not running.
  */
function toggled(x, y) {board.toggleBoardCell(x, y);}
