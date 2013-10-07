/**
 * Memory.js
 * @author brian.gormanly
 * 
 * Represents the phyical hardware memory of the size defined
 * in Globles.js
 */

// create empty memory array
_Memory = new Memory(); 

function Memory() {
	var initMemory = new Array();

	// initialize the array to all 00 
	for(i = 0; i < TOTAL_MEMORY; i++) {
		initMemory[i] = "00";
	}
	
	return initMemory;
}