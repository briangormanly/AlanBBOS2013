/* ----------------------------------
   DeviceDriverKeyboard.js
   
   Requires deviceDriver.js
   
   The Kernel Keyboard Device Driver.
   ---------------------------------- */

DeviceDriverKeyboard.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

/*
 * Create a map of special characters to use for keyboard input
 */
var characterMap = [];
characterMap[192] = "~";
characterMap[49] = "!";
characterMap[50] = "@";
characterMap[51] = "#";
characterMap[52] = "$";
characterMap[53] = "%";
characterMap[54] = "^";
characterMap[55] = "&";
characterMap[56] = "*";
characterMap[57] = "(";
characterMap[48] = ")";
characterMap[109] = "_";
characterMap[107] = "+";
characterMap[219] = "{";
characterMap[221] = "}";
characterMap[220] = "|";
characterMap[186] = ":";
characterMap[222] = "\"";
characterMap[188] = "<";
characterMap[190] = ">";
characterMap[191] = "?";
characterMap[32] = " ";


function DeviceDriverKeyboard()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnKbdDriverEntry;
    this.isr = krnKbdDispatchKeyPress;
    // "Constructor" code.
}

function krnKbdDriverEntry()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
    // More?
}

function krnKbdDispatchKeyPress(params)
{
    // Parse the params.    TODO: Check that they are valid and osTrapError if not.
    var keyCode = params[0];
    var isShifted = params[1];
    krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
    var chr = "";
    
    // reset the status if there was an error in a previously inputted character
    var statusText = document.getElementById("currentStatus").innerHTML;
    if(statusText == "Unknown character input!") {
    	document.getElementById("currentStatus").innerHTML="";
    }
    
    // check to see if the shift key is depressed
    if(isShifted) {
    	// upper case
    	if ( ((keyCode >= 65) && (keyCode <= 90)))   // A..Z
   	    {
   	    	chr = String.fromCharCode(keyCode);
   	        _KernelInputQueue.enqueue(chr);        
   	    } 
    	
    	// special characters with shift
    	if ( ( keyCode >= 48 && keyCode <= 59 ) ||
    			(keyCode == 192) ||
    			(keyCode >= 219 && keyCode <= 222) || 
    			(keyCode == 188) ||
    			(keyCode >= 190 && keyCode <= 192) ||
    			(keyCode == 186)
    			) {
    		chr = characterMap[keyCode];
    		//alert("1 " + String.fromCharCode(53));
    	
    		_KernelInputQueue.enqueue(chr); 
    	}
    	else {
    		// unknown character (error checking) let the user know
    		// check it is not the shift key
    		if(keyCode != 16) {
	    		this.status = "Unknown Character!";
	    		document.getElementById("currentStatus").innerHTML="Unknown character input!";
	    	}
    	}

    }
    else {
		// no shift
		    
	    // Check to see if we even want to deal with the key that was pressed.
	    if ( ((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
	         ((keyCode >= 97) && (keyCode <= 123)))   // a..z
	    {
	        // Determine the character we want to display.  
	        // Assume it's lowercase...
	    	chr = String.fromCharCode(keyCode + 32);
	        // ... then check the shift key and re-adjust if necessary.
	        if (isShifted)
	        {
	            chr = String.fromCharCode(keyCode);
	        }
	        // TODO: Check for caps-lock and handle as shifted if so.
	        _KernelInputQueue.enqueue(chr);        
	    }    
	    else if ( ((keyCode >= 48) && (keyCode <= 57)) ||   // digits 
	               (keyCode == 32)                     ||   // space
	               (keyCode == 13)					   ||	// enter
	               (keyCode == 37)					   ||	// left
	               (keyCode == 38)					   ||	// up
	               (keyCode == 39)					   ||	// right
	               (keyCode == 40)					   ||	// down
	               (keyCode == 8))                          // backspace
	    {
	        chr = String.fromCharCode(keyCode);
	        _KernelInputQueue.enqueue(chr); 
	    }
	    // special characters without shift
	    else if ((keyCode == 190)) {
	    	_KernelInputQueue.enqueue(".");
	    }
	    else if ((keyCode == 188)) {
	    	_KernelInputQueue.enqueue(",");
	    }
	    else if ((keyCode == 222)) {
	    	_KernelInputQueue.enqueue("'");
	    }
	    else {
    		// unknown character (error checking) let the user know
	    	if(keyCode != 16) {
	    		this.status = "Unknown Character!";
	    		document.getElementById("currentStatus").innerHTML="Unknown character input!";
	    	}
    	}
    
    }
}
