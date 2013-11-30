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
			localStorage.setItem("000", "1100Swap file location");
    	}
    	catch(e) {
    		
    	}
    	
    	// update the display
    	hostDivDisk();
    	
    }
    
    // create a file on the file system
    this.create = function() {
    	// create a sector counter
    	var sectorCounter = 0;
    	
    	// create a found flag for the dirtory entry
    	var flag = false;
    	
    	// check that we stay within the directory and that a location has 
    	// not yet been found
    	while(sectorCounter < DIRECTORY_TRACKS && !flag) {
    		
    	}
    	
    	


    	
    	
    	
    	// get first available space in the directory
    	for(int i=0; i<DIRECTORY_TRACKS; i++) {
    		for(var j=0; j<SECTORS; j++) {
				for(var k=0; k<BLOCKS; k++) {
					
					// create a unique key out of the track sector and block
					var tsbString = i.toString() + j.toString() + k.toString();
						
					// check to see if this block is in use 
					if(localStorage.getItem(tsbString) == "0") {
						// found empty block, create directory record
						
						// set the found flag
						break;
						
					}
				}
			}
    	}
    	
    	
    }
    
    
    this.write = function() {
    
    }
    
    this.overwrite = function() {
    	
    }

}







