/**
 * Disk Drive
 * @author brian.gormanly
 * 
 * Controls all simulated hardware access for disk drive
 * 
 */


function Disk() {
	
	// store the disk array

	this.init = function() {
    	// check to see if the browser supports html5 local storage
		if(this.supports_html5_storage() != false) {
			this.fullFormat();
			
			
		}
		else {
			alert('html localstorage is not supported!');
		}
		
			
		
    };

    
    this.supports_html5_storage = function() {
    	try {
    		return 'localStorage' in window && window['localStorage'] !== null;
    	} 
    	catch (e) {
    		return false;
    	}
    };
    
    this.fullFormat = function() {
    	try {
    		// initialize the disk
			for(var i=0; i<TRACKS; i++) {
				for(var j=0; j<SECTORS; j++) {
					for(var k=0; k<BLOCKS; k++) {
						// create a unique key out of the track sector and block
						var tsbString = i.toString() + j.toString() + k.toString();
						
						// create a block size as set (default is 64)
						var blockString = "";
						for(var l=0; l<BLOCK_SIZE; l++) {
							blockString += "~";
						}
						
						// save the block
						localStorage.setItem(tsbString, blockString);
					}
				}
			}
			
			// set the mbr
			alert(localStorage["000"]);
    	}
    	catch(e) {
    		
    	}
    	
    }
    
}







