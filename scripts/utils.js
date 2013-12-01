/* --------  
   Utils.js

   Utility functions.
   -------- */

// allow replacing string part
String.prototype.replaceAt=function(index, character) {
	return this.substr(0, index) + character + this.substr(index+character.length);
}   

function trim(str) {     // Use a regular expression to remove leading and trailing spaces.
	return str.replace(/^\s+ | \s+$/g, "");
	/* 
	Huh?  Take a breath.  Here we go:
	- The "|" separates this into two expressions, as in A or B.
	- "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
    - "\s+$" is the same thing, but at the end of the string.
    - "g" makes is global, so we get all the whitespace.
    - "" is nothing, which is what we replace the whitespace with.
	*/
	
}

function rot13(str) {   // An easy-to understand implementation of the famous and common Rot13 obfuscator.
                        // You can do this in three lines with a complex regular expression, but I'd have
    var retVal = "";    // trouble explaining it in the future.  There's a lot to be said for obvious code.
    for (var i in str) {
        var ch = str[i];
        var code = 0;
        if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
            code = str.charCodeAt(i) + 13;  // It's okay to use 13.  It's not a magic number, it's called rot13.
            retVal = retVal + String.fromCharCode(code);
        } else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
            code = str.charCodeAt(i) - 13;  // It's okay to use 13.  See above.
            retVal = retVal + String.fromCharCode(code);
        } else {
            retVal = retVal + ch;
        }
    }
    return retVal;
}

function quickSortPartition(array, size) {
	// check for end
	if(size < 2) return array;
	
	// get the last element as the pivot
	//alert("pivot:" + array[size -1].state);
	var pivot = array[size -1].state;
	
	var l=0;
	var u=array[size -1];
	
	while (l < u) {
		while(array[l].state < pivot) {
			l += 1;
		}
		while(array[u].state > pivot) {
			u -= 1;
		}
		var temp = array[l];
		array[L] = array[u];
		array[u] = temp;
	}
	quickSortPartition(array, l);
	quickSortPartition(array[l+1], (size-l-1));
	
}

// substring if necassary to retduce length to the max or
// add empty space to a string to force a certain size
function padString(str, totalLength) {
	str = str.substring(0, totalLength);
    for (var i = str.length; i <= totalLength; i++)
        str += "&nbsp;";
    return str;
}

// get the state text
function getStateName(state) {
	switch(state) {
		case 0:
			return "RUNNING";
			break;
		case 1:
			return "READY";
			break;
		case 2:
			return "LOADED";
			break;
		case 3:
			return "NEW";
			break;
		case 4:
			return "TERMINATED";
			break;
	}
	
}

function quickSort(items, left, right) {

    var index;

    if (items.length > 1) {

        index = partition(items, left, right);

        if (left < index - 1) {
            quickSort(items, left, index - 1);
        }

        if (index < right) {
            quickSort(items, index, right);
        }

    }

    return items;
}


function partition(items, left, right) {

    var pivot   = items[Math.floor((right + left) / 2)].state,
        i       = left,
        j       = right;


    while (i <= j) {

        while (items[i].state < pivot) {
            i++;
        }

        while (items[j].state > pivot) {
            j--;
        }

        if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
        }
    }

    return i;
}

function swap(items, firstIndex, secondIndex){
    var temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
}

function covertBase10ToBase16(decimalNumber) {
	var hex = decimalNumber.toString(16);
	
	// check to see if we need to padd
	if(hex.length == 1) {
		hex = "0" + hex;
	}
	
	// make sure it is uppercase
	hex = hex.toUpperCase();
	
	// return the value
	return hex;
}



