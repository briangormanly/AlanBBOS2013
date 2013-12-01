
function FSDD() {

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
    	
    };
    
    /**
     * Create a file on the disk.
     */
    this.create = function(name, mode) {
    	
    	// find an empty directory block
    	var dirBlockTSB = this.getEmptyDirectoryBlock();
    	
    	// check that the directory is not full
    	if(dirBlockTSB != "-1") {
    		
    		// get the first available data block for the new file
    		var dataBlockTSB = this.getEmptyDataBlock();
    		
    		// check to see that there was a data block available!
    		if(dataBlockTSB != "-1") {
    			// check that the name is less then 57 char long
    			if(name.length > 57) {
    				krnTrace("File name too long!");
    			}
    			else {
    				// build the new directory block
        			var dirBlock = "1" + dataBlockTSB + mode + name;
        			
        			//write the first datablock TSB to the directory block
        			localStorage.setItem(dirBlockTSB, dirBlock);
    			}
    		}
    		else {
    			// data space is full!
        		krnTrace("No space in the in the file system!");
    		}
    	}
    	else {
    		// directory is full!
    		krnTrace("No space in the in the file system directory!");
    	}
    	
    	// update the display
    	hostDivDisk();
    	
    };
    
    /**
     * write (overwrite) file data
     * @param dirTSB - the directory TSB of the file
     * @param data - the data to write to the files data blocks
     */
    this.write = function(dirTSB, data) {
    
    };
    
    
    /**
     * finds the first availible direcotry block
     * returns the TSB of the block and marks the block as un-available
     */
    this.getEmptyDirectoryBlock = function() {
    	// create a sector counter
    	var trackCounter = 0;
    	
    	// create a track counter
    	var sectorCounter = 0;
    	
    	// create a black counter 
    	var blockCounter = 0;
    	
    	// check for the first open block
    	while(trackCounter < DIRECTORY_TRACKS) {
    		// create the tsb
    		var tsbString = trackCounter.toString() + sectorCounter.toString() + blockCounter.toString();
    		
    		// get the block
    		var block = localStorage.getItem(tsbString);
	
    		// check the first bit for availability of the block
    		if(block.substring(0, 1) === "0" || block.substring(0, 1) === "~") {
    			
    			// set the block to unavailable
    			block = "1---";
    			localStorage.setItem(tsbString, block);
    		
    			// return the TSB, done!
    			return tsbString;
    			
    		}
    		
    		// increase the block counter
    		blockCounter++;
    		
    		// check to see if we need to increate the sector
    		if (blockCounter >= BLOCKS) {
    			// increase the sectors
    			sectorCounter++;
    			
    			// reset the block
    			blockConuter = 0;
    		}
    		
    		// check to see if we need to increase the track
    		if(sectorCounter >= SECTORS) {
    			// increase the number of tracks
    			trackCounter++;
    			
    			// reset the sector counter
    			sectorConuter = 0;
    		}
    	}
    	
    	// no empty block found!
    	return -1;
    		
    };
    
    /**
     * find an available data block
     * returns the tsb of the block found and marks the block as un-available
     */
    this.getEmptyDataBlock = function() {
    	// create a sector counter
    	var trackCounter = DIRECTORY_TRACKS;
    	
    	// create a track counter
    	var sectorCounter = 0;
    	
    	// create a black counter 
    	var blockCounter = 0;
    	
    	// check for the first open block
    	while(trackCounter <= TRACKS) {
    		// create the tsb
    		var tsbString = trackCounter.toString() + sectorCounter.toString() + blockCounter.toString();
    		
    		// get the block
    		var block = localStorage.getItem(tsbString);
    		
    		
	
    		// check the first bit for availability of the block
    		if(block.substring(0, 1) === "0" || block.substring(0, 1) === "~") {
    			
    			// set the block to unavailable and null string in the data area
    			block = "1---";
    			localStorage.setItem(tsbString, block);

    			// return the TSB, done!
    			return tsbString;
    			
    		}
    		
    		// increase the block counter
    		blockCounter++;
    		
    		// check to see if we need to increate the sector
    		if (blockCounter >= BLOCKS) {
    			// increase the sectors
    			sectorCounter++;
    			
    			// reset the block
    			blockConuter = 0;
    		}
    		
    		// check to see if we need to increase the track
    		if(sectorCounter >= SECTORS) {
    			// increase the number of tracks
    			trackCounter++;
    			
    			// reset the sector counter
    			sectorConuter = 0;
    		}
    	}
    	
    	// no empty block found
    	return -1;

    };
    
}
    