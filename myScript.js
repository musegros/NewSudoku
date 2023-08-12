
let puzzleString = "";
let myArray = [];   // array elements 0 to 80   read from puzzle string
const cells = [];  // create the cells array

var grid = {      // object used to convert ID to row, col, candidate and vice versa
	row: 0,
	col: 0,
	can: 0,
};

// cell ID = 111 to 999 for unsolved cell, convert to row, col (for solved/given/candidate)

//ID values:
// givens and solved cells have id 0 to 80
// unsolved cells have 3 digit id (row/col/digit concatenated)


// ***************** functions *****************

function tempFunc() {         // called from TEMP buttonn
	let myArray = [33,44,55]
	push(cells[0].candidates, myArray);

	console.log(cells);
}

function doIt() {
	const fred = document.querySelectorAll("div");
	
	for (let i = 2; i < fred.length; i++)  {
		//console.log(fred[i].innerText);
		fred[i].addEventListener("click",() => {
			document.body.style.backgroundColor = fred[i].innerText
		});
	}
}

function restoreCandidate(row, col, digit) {
	var myID = getIDfromRowCol(row,col);
	cells[myID].candidates[digit - 1] = digit;
}

function killCan(digit, myID) {
	// applies to cells[myID].candidates

	for (let i = 0; i < 9; i++) {
		if (cells[myID].candidates[i] == digit) {
			cells[myID].candidates[i] = 0;
		}
	}
}

function youClickedMe(row, col, digit, isTiny) {       // x = row   y = column   z is candidate    myBool true/false for isNotBig  (tiny grid)
		
	var myString = "row " + row + " column " + col;
	var myID = getIDfromRowCol(row,col);
	
	if (isTiny) {  // tiny grid
		myString = myString + "  candidate " + digit;
	} else {
		// big number
		myString = myString + "  solved or given cell = " + cells[myID].numValue;
	}

	//now toggle digit
	if (isTiny){
		// toggle tiny digit on/off
		if (canExists(row,col,digit)) {
			killCan(digit, myID);
		} else {
			// restore it (add to array)
			restoreCandidate(row, col, digit);
		}   
	}	
	drawGrid();
}	

function canExists(row, col, digit) {   // id of cell   0 to 80
	//  for tiny only
	let tf = false;
	let myId = getIDfromRowCol(row,col)
	for (let i = 0; i < 9; i++) {
		if (cells[myId].candidates[i] == digit) {
			tf = true;
		}
	}
	return tf;
}

function isInArray(digit, myID) {   // id of cell   0 to 80
	// applies to cells[].candidates
	let tf = false;
	for (let i = 0; i < 9; i++) {
		if (cells[myID].candidates[i] == digit) {
			tf = true;
		}
	}
	return tf;
}

function isCandidate(row, col, digit ) {
	// return true if candidate is present in row/col
	let tf = false;
	for (let i =0; i < 9; i++ ) {
		if (cells[myID].candidates[i] == digit) {
			tf = true;
		}
	}
	return tf;
}

function getRowColFromID(x, grid) {   // convert id (0 to 80) to row/col
	grid.row = (parseInt(x / 9) + 1);
	grid.col = (x % 9) + 1;   // mod
	// now calling routine can read grid. object
}

function getIDfromRowCol(row, col) {   // convert row col to 0 - 80
	return ((row-1) * 9) + (col-1);
}

function concatNumbers(x, y, z) {     // concat 3 numbers (don't add)
	let myString3 = + String(x) + String(y) + String(z);  // use string so they don't use addition
	return Number(myString3);
}

function readString() {
	let z = document.getElementById("puzzleString");
	let z2 = document.getElementById("eps");   // the "ENTER PUZZLE STRING"  label (want to hide it)
	let z3 = document.getElementById("myButton");   // the ENTER button (want to hide it)

	puzzleString = z.value;

	z.style.display = "none";   // hide the text box
	z2.style.display = "none";   // hide the label
	z3.style.display = "none";   // hide the button

	myArray = puzzleString.split("");  //convert puzzle string to array
	
	for (let i = 0; i < myArray.length; i++) {
		let giveBool = true;
		let cans =  [];   
		let v = Number(myArray[i]);   //convert string to number

		if (isNaN(v)) {
			v = 0;
			cans =  [1,2,3,4,5,6,7,8,9];   			
			giveBool = false;
		}

  		var newCell = {
			candidates:  cans,
			given: giveBool,  
			numValue: v,
		}
		
		cells[i] = newCell;
	}
	drawGrid();       // part of readString
}

function drawGrid() {
	// called by function ReadString
	// start <table with style
	//<table style="text-align: center; width: 100px;" border="1" cellpadding="2" cellspacing="2">
	// <td style="height: 50px; width: 50px;"></td>
	//<table id="myTable"  style="text-align: center; margin-left: auto; width: 500px; font-size:400% ; height: 500px; margin-right: auto;" border="3" cellpadding="05" cellspacing="0">

	// big number (solved or given)  ID is 0 to 80  .  number is Cell[].numValue
	// unsolved cell:  ID is 3 digit  . row/col/candidate 

	let myHTML = '<table style="text-align: center; width: 1000px; height: 1000px;"font-family: Helvetica,Arial,sans-serif;" border="1" cellpadding="2" cellspacing="2">'
	let r = 0;
	for (let row = 0; row < 9; row++) {
		myHTML += '<tr>'
		for (let col = 1; col < 10; col++) {
			r = ((row * 9) + col) - 1;
			if (cells[r].numValue > 0) {
				// show big number
				//myHTML+=  '<td id=' + r + '  style="height: 100px; width: 100px; font-size:400% ;">'
				myHTML += '<td id=x' + r + '  style="height: 100px; width: 100px; font-size:400%; font-family: Helvetica,Arial,sans-serif; ">'     // id is x and number   "x234"
				myHTML += cells[r].numValue;
			} else {
				// show tiny grid
				myHTML += '<td style:"text-align: center";  >'
				myHTML += tinyGrid(r);   // r is cell ID
			}
			myHTML += '</td>'   //  concat
		}
		myHTML += '</tr>'
	}
	myHTML += '</table>'
	let z1 = document.getElementById("grid");
	z1.innerHTML = myHTML;
	addListeners();
}   // end function drawGrid

function addListeners() {
	// called by function drawGrid()
	var myCellID = 0;    // 0 to 80
	var isNotBig = true;   // big number (solved or given) vs candidate
	for (let x = 1; x < 10; x++) {       //  x = row   y = column  z = candidate (big or small)
		for (let y = 1; y < 10; y++) {
			myCellID = getIDfromRowCol(x, y);   // only used for big numbers
			isNotBig = (cells[myCellID].numValue === 0) ;   // set true or false
			if (isNotBig) {
				// tiny grid loop
				for (let z = 1; z < 10; z++) {         // tiny grid
					var tempString = "";
					tempString = "x" + String(x) + String(y) + String(z);	   // 3 digit ID  (tiny grid) row/col/cand
					document.getElementById(tempString).addEventListener("click", function() {
						youClickedMe(x, y, z, true)
					});    // true for isNotBig
				}
			} else {
				// big number   only one event for cell
				myCellID = getIDfromRowCol(x, y);  // do it again  		
				tempString = "x" + String(myCellID);	  //  0 = to 80
				z = cells[myCellID].numValue;	
				document.getElementById(tempString).addEventListener("click", function() {
					youClickedMe(x, y, z, false)
				});    // false for isNotBig
			}
		}
	}
}

function tinyGrid(myId) {    //myID is 0 to 81, but ID in <div> here is 3 digit (row/col/can)
	var tinyHTML = '<table style="text-align: center";  border="0" cellpadding="2" cellspacing="2">'//text-align: center;
	var r = 0;  // tiny row, 1-9
	var counter = 1;

	getRowColFromID(myId, grid);  // 0 - 80      sets grid.row and grid col

	for (let row = 0; row < 3; row++) {
		tinyHTML += '<tr>'
		for (let col = 1; col < 4; col++) {
			r = ((row * 9) + col) - 1;
			let zz = '<td id = x' + grid.row  + grid.col + String(counter) + '    style="height: 10px; width: 15px; font-size:8, font-family: Helvetica,Arial,sans-serif">'   //style="font-size: value;"
			tinyHTML += zz  // append
			var myCand = counter;    // 1 to 9
			
			if (!canExists(grid.row, grid.col, counter))  {
				// don't display candidate
				myCand = " ";
			}

			tinyHTML += myCand + "</td>"   //  candidate goes here
			counter++;   // 1 to 9
		}
		tinyHTML += '</tr>'
	}
	tinyHTML += '</table>'
	return tinyHTML;
}

