
function FSDD() {
	
	// keep track of blocks for recurive algo
	var blockCounter = 0;
	
	// keep track of read data for recursive algo
	var currentRead = "";
	
	this.init = function() {
		// check to see if the drive is formatted
		this.checkDisk();
		
		
	};
	
	this.checkDisk = function() {
		
		// create a Hard disk and initialize
		_Disk = new Disk();
		_Disk.init();	
		
		if(_Disk.read("000") == null) {
			krnTrace("The Disk is not formatted! Please format with the 'format' cammand");
			
			// return false
			return false;
		}
		else {
			// return true
			return true;
		}
	}
	

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
							if(l===0) {
								blockString += "0";
							}
							else {
								blockString += "~";
							}
						}
						
						// save the block
						_Disk.write(tsbString, blockString);
					}
				}
			}
			
			// set the mbr
			_Disk.write("000", "1100Khaaaaaaaaaaaaaaaaaaaaaaaan!!!!!!!!!!!!!!!!!!!!!!!!!");
    	}
    	catch(e) {
    		
    	}
    	
    	// update the display
    	hostDivDisk();
    	
    };
    
    /**
     * Create a file on the disk.
     */
    this.create = function(name, mode, lock) {
    	
    	// check the disk
    	if(this.checkDisk()) {
    		
    		// check that the name is not already taken
    		if(this.getTSBByName(name) != -1) {
    			// log the failure (file with same name already exists) and kick error out to the shell
    			krnTrace("Filename is already in use on the filesystem!");
	    		return -1;
    		}	
    	
	    	// find an empty directory block
	    	var dirBlockTSB = this.getEmptyDirectoryBlock();
	    	
	    	// check that the directory is not full
	    	if(dirBlockTSB != "-1") {
	    		
	    		// get the first available data block for the new file
	    		var dataBlockTSB = this.getEmptyDataBlock();
	    		
	    		// check to see that there was a data block available!
	    		if(dataBlockTSB != "-1") {
	    			
	    			// set the active byte
	    			var active = ACTIVE;
	    			
	    			// set the size to initial 1
	    			var size = "001";
	    			
	    			// create the directory block
	    			this.writeDirectoryBlock(dirBlockTSB, active, dataBlockTSB, mode, lock, size, name);
	    			
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
    	
    	}
    	
    };

    
    /**
     * write (overwrite) file data
     * @param fileName - name of the file to overwrite
     * @param data - the data to write to the files data block
     * @return -1 if error, 1 if successful
     */
    this.write = function(fileName, active, data) {
    	//alert(fileName + " | " + active + " | " + data);
    	// get the directory tsb
    	var dirTSB = this.getTSBByName(fileName);

    	// write the data to the block if there was a hit
    	if(dirTSB != "-1") {
    		// set the block counter to 0
    		blockCounter = 1;
    		
    		// write the data
    		this.writeTSB(this.getDirDataTSB(dirTSB), active, data);
    		
    		// get the count in the correct format
    		var formatedSize = "";
    		if(blockCounter > 0 && blockCounter < 10) {
    			formattedSize = "00" + blockCounter;
    		}
    		else if(blockCounter < 100) {
    			formattedSize = "0" + blockCounter;
    		}
    		else if(blockCounter < 1000) {
    			formattedSize = blockCounter;
    		}
    		
    		//("formatted size: " + formattedSize);

    		// modify the directory and update the size
    		this.setDirBlockSize(dirTSB, formattedSize);
    		
    		
    		// return success
    		return 1;
    	}
    	else {
    		krnTrace("Filename entered was not found!");
    		// kick back the error to the shell
    		return -1;
    	}
    	
    };
    
    /**
     * write (overwrite) file data
     * @param dirTSB - the directory TSB of the file
     * @param data - the data to write to the files data blocks
     */
    this.writeTSB = function(dataTSB, active, data) {
    	
    	// check the size of the data to see if it can be saved in the current block
    	if(data.length > (BLOCK_SIZE - 4)) {
    		// data is larger then block
    		
    		// first check to see if we are overwriting a file that existed with more then one block allocated
    		var orgNextTSB = this.getDirDataTSB(dataTSB);
    		var nextBlock = "";
    		if(orgNextTSB != "---") {
    			// datablock has chain
    			nextBlock = orgNextTSB;
    		}
    		else {
    			// no additional block chained currently allocate another block
    			nextBlock = this.getEmptyDataBlock();
    		}

    		// create the initial block with a reference to the next
    		this.writeDataBlock(dataTSB, active, nextBlock, data.substring(0, (BLOCK_SIZE - 4)));
    		
    		//alert("next call will be: " + nextBlock + " A; " + active + " data: " + data.substring(BLOCK_SIZE - 4));
    		// call this method recursively for the next block
    		this.writeTSB(nextBlock, active, data.substring(BLOCK_SIZE - 4));
    		
    		// increment the blockCounter
    		blockCounter++;
    		
    	}
    	else {
    		// check to see if this block used to be part of a chain
    		var orgNextTSB = this.getDirDataTSB(dataTSB);
    		
    		if(orgNextTSB != "---") {
    			// chain exists work down it to break all the links
    			this.remove(orgNextTSB);
    		}
    		
    		
    		// data will fit in block
    		//alert("data to write: " + this.getDirDataTSB(dirTSB) + " A; " + active + " data: " + data);
    		this.writeDataBlock(dataTSB, active, "---", data);
    	}
    	
    	// update the display
	    hostDivDisk();
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
    		var block = _Disk.read(tsbString);
	
    		// check the first bit for availability of the block
    		if(block.substring(0, 1) === "0" || block.substring(0, 1) === "~") {
    			
    			// set the active byte
    			var active = ACTIVE;
    			
    			// set the data blockTSB to unknown / none
    			var dataBlockTSB = "---";
    			
    			// set the mode to none
    			var mode = MODE_NONE;

    			// set the lock to unlocked
    			var lock = LOCK_INACTIVE;
    			
    			// set the size to initial 1
    			var size = "001";
    			
    			// name is unknown at this point
    			var name = "unknown";
    			
    			// create the directory block
    			this.writeDirectoryBlock(tsbString, active, dataBlockTSB, mode, lock, size, name);
    		
    			// return the TSB, done!
    			return tsbString;
    			
    		}
    		
    		// increase the block counter
    		blockCounter++;
    		
    		// check to see if we need to increate the sector
    		if (blockCounter > (BLOCKS - 1)) {
    			// increase the sectors
    			sectorCounter++;
    			
    			// reset the block
    			blockCounter = 0;
    		}
    		
    		// check to see if we need to increase the track
    		if(sectorCounter > (SECTORS - 1)) {
    			// increase the number of tracks
    			trackCounter++;
    			
    			// reset the sector counter
    			sectorCounter = 0;
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
    		var block = _Disk.read(tsbString);
    		
    		
	
    		// check the first bit for availability of the block
    		if(block.substring(0, 1) === "0" || block.substring(0, 1) === "~") {
    			
    			
    			// set the active byte
    			var active = ACTIVE;
    			
    			// set the next blockTSB to unknown / none
    			var nextBlockTSB = "---";
    			
    			// initialize the datablock to empty
    			var dataBlock = "";
    			
    			// write the data block
    			this.writeDataBlock(tsbString, active, nextBlockTSB, dataBlock);

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
    			blockCounter = 0;
    		}
    		
    		// check to see if we need to increase the track
    		if(sectorCounter >= SECTORS) {
    			// increase the number of tracks
    			trackCounter++;
    			
    			// reset the sector counter
    			sectorCounter = 0;
    		}
    	}
    	
    	// no empty block found
    	return -1;

    };
    
	/**
	 * Get the directory TSB of a file by the file name
	 * @param name - name of the file to find directory TSB for.
	 * @return TSB
	 */
	this.getTSBByName = function(name) {
		
		// look through the dirtory
		for(var i=0; i<DIRECTORY_TRACKS; i++) {
			for(var j=0; j<SECTORS; j++) {
				for(var k=0; k<BLOCKS; k++) {
					// create a unique key out of the track sector and block
					var tsbString = i.toString() + j.toString() + k.toString();
					
					
					// see if this tsb contains the name we are looking for
					//alert(this.getDirFileName(tsbString) + " == name : " + name);
					if(this.getDirFileName(tsbString) == name) {
						// match
						return tsbString;
						
					}
					
				}
			}
		}
		
		// no match found return -1
		return -1;
	};
	
	
	/**
	 * gets the active status for the file at the provided directory tsb
	 * @param tsbString - Directory TSB
	 * @return fileLock
	 */
	this.getDirFileActive = function(tsbString) {
		if(_Disk.read(tsbString).substring(0, 1) == 1) {
			return ACTIVE;
		}
		else  {
			
			return INACTIVE;
		}
	};
	
	this.setDirFileActive = function(tsbString, active) {
		if(active == ACTIVE) {
			// get the current block
			var currentBlock = _Disk.read(tsbString);
			
			// modify the block
			var modifiedBlock = "1" + currentBlock.substring(1);
			
			// write the new block to disk
			_Disk.write(tsbString, modifiedBlock);
		}
		else {
			// get the current block
			var currentBlock = _Disk.read(tsbString);
			
			// modify the block
			var modifiedBlock = "0" + currentBlock.substring(1);
			
			// write the new block to disk
			_Disk.write(tsbString, modifiedBlock);
		}
		
		// update the display
	    hostDivDisk();
	};
	
	this.getDirDataTSB = function(tsbString) {
		return _Disk.read(tsbString).substring(1, 4);
	};
	
	
	/**
	 * gets the mode for the file at the provided directory tsb
	 * @param tsbString - Directory TSB
	 * @return fileMode
	 */
	this.getDirFileMode = function(tsbString) {
		if(_Disk.read(tsbString).substring(4, 5) === 0) {
			return MODE_NONE;
		}
		else if(_Disk.read(tsbString).substring(4, 5) == 1) {
			return MODE_X;
		}
		else if(_Disk.read(tsbString).substring(4, 5) == 2) {
			return MODE_W;
		}
		else if(_Disk.read(tsbString).substring(4, 5) == 3) {
			return MODE_WX;
		}
		else if(_Disk.read(tsbString).substring(4, 5) == 4) {
			return MODE_R;
		}
		else if(_Disk.read(tsbString).substring(4, 5) == 5) {
			return MODE_RX;
		}
		else if(_Disk.read(tsbString).substring(4, 5) == 6) {
			return MODE_RW;
		}
		else if(_Disk.read(tsbString).substring(4, 5) == 7) {
			return MODE_RWX;
		}
		else {
			// unknown return none
			return MODE_NONE;
		}
		
	};
	
	
	/**
	 * gets the lock for the file at the provided directory tsb
	 * @param tsbString - Directory TSB
	 * @return fileLock
	 */
	this.getDirFileLock = function(tsbString) {
		if(_Disk.read(tsbString).substring(5, 6) === 0) {
			return LOCK_INACTIVE;
		}
		else if(_Disk.read(tsbString).substring(5, 6) === 1) {
			return LOCK_ACTIVE;
		}
	};
	
	/**
	 * gets the size for the file at the provided directory tsb
	 * @param tsbString - Directory TSB
	 * @return fileSize
	 */
	this.getDirFileSize = function(tsbString) {
		if(_Disk.read(tsbString) != null) {
			return _Disk.read(tsbString).substring(6, 8);
		}
		else {
			return -1;
		}
		
	};
	
	/**
	 * Update the size of the Directory block
	 * @param tsbString - tsb of the directory block
	 * @param size - size to write to the block
	 */
	this.setDirBlockSize = function(tsbString, size) {
		
		// check the new size is the correct format
		if(size.length != 3) {
			krnTrace("Write Directory block error: Size needs to be 3 characters! length : " + size.length + " size value: " + size);
		}
		else {
			// get the current block
			var currentBlock = _Disk.read(tsbString);
			
			// modify the block
			var modifiedBlock = currentBlock.substring(0, 5) + size + currentBlock.substring(8);
			
			// write the new block to disk
			_Disk.write(tsbString, modifiedBlock);
		}
		
		// update the display
	    hostDivDisk();
	};
	
	
	/**
	 * gets the name for the file at the provided directory tsb
	 * @param tsbString - Directory TSB
	 * @return fileName
	 */
	this.getDirFileName = function(tsbString) {
		//alert("file name:" + _Disk.read(tsbString).substring(8));
		return _Disk.read(tsbString).substring(8);
	};

	/**
	 * gets the data from a datablock for the given tsb
	 * @param tsbString - TSB
	 * @return fileName
	 */
	this.getDataData = function(tsbString) {
		return _Disk.read(tsbString).substring(4);
	};
	
	
	/**
	 * write a directory block to the directory setion 
	 * @param tsbString TSB of directory entry to write
	 * @param active - 0 = block available, 1 = block used
	 * @param dataBlockTSB - TSB of the first datablock of the file
	 * @param mode - 0, 1, 2, 3, 4, 5, 6, 7 (persissions)
	 * @param lock - file system lock (only accessable to the kernel)
	 * @param size - file size in blocks (x BlockSize for actual size)
	 * @param dirBlock - data to write to directory block
	 */
	this.writeDirectoryBlock = function(tsbString, active, dataBlockTSB, mode, lock, size, name) {
		
		//alert("recv: " + tsbString + " a:" + active + " dbtsb:" +  dataBlockTSB + " m:" +  mode + " l:" +  lock + " s:" +  size + " n:" +  name);
		
		// check the parameters
		if(name.length < 1) {
			krnTrace("Write Directory block error: File name too short! name length : " + name.length);
		}
		else if(name.length > 56) {
			krnTrace("Write Directory block error: File name too long! name length : " + name.length);
		}
		else if(active != INACTIVE && active != ACTIVE) {
			krnTrace("Write Directory block error: Active is not set: " + active);
		}
		else if(lock != LOCK_INACTIVE && lock != LOCK_ACTIVE) {
			krnTrace("Write Directory block error: Lock is not set: " + lock);
		}
		else if(size.length != 3) {
			krnTrace("Write Directory block error: Size needs to be 3 characters! length : " + size.length);
		}
		else if(dataBlockTSB.length != 3) {
			krnTrace("Write Directory block error: Data Block TSB reference should be 3 characters length: " + dataBlockTSB);
		}
		else {
			// ok to write
			
			// create the single data string from the indformation passed
			var dirBlock = active + dataBlockTSB + mode + size + name;
			
			// write to the directory string to the disk
			_Disk.write(tsbString, dirBlock);
		}
	};
	
	/**
	 * write a directory block to the directory setion 
	 * @param tsbString TSB of directory entry to write
	 * @param active - 0 = block available, 1 = block used
	 * @param nextBlockTSB - TSB of the next datablock of the file (--- if last block)
	 * @param  dataBlock - data to write to data block
	 */
	this.writeDataBlock = function(tsbString, active, nextBlockTSB, dataBlock) {
		
		//alert("start: " + tsbString + " a:" + active + " next:" + nextBlockTSB + " data:" + dataBlock);
		
		// check the parameters
		if(dataBlock.length > 60) {
			krnTrace("Write Data block error: Data block too long!");
		}
		else if(active != INACTIVE && active != ACTIVE) {
			krnTrace("Write Data block error: Active is not set: " + active);
		}
		else if(nextBlockTSB.length != 3) {
			krnTrace("Write Data block error: Data Block TSB reference should be 3 characters");
		}
		else {
			// ok to write 
			
			// create the single data string from the indformation passed
			var dirBlock = active + nextBlockTSB + dataBlock;
			
			//alert("writing: " + dirBlock);
			
			// write to the directory string to the disk
			_Disk.write(tsbString, dirBlock);
		}
	};
	
	/**
	 * Gets the data in a file and returns it as a string of characters
	 * @param fileName - Name of file to retrieve 
	 * @return fileString - String containing all file data
	 */	
	this.readFile = function(fileName) {
		// reset the current readString
		currentRead = "";
		
		// get the directory tsb
    	var dirTSB = this.getTSBByName(fileName);
    	
    	if(dirTSB != -1) {
    		// get the first data block TSB
        	var dataTSB = this.getDirDataTSB(dirTSB); 
        	
        	// kick off the read operation down the chain and return the string
        	this.read(dataTSB);

        	// return the string
        	return currentRead;
    	}
    	else {
    		return -1;
    	}
	};
	
	
	/**
	 * read a file by following blocks in its chain recursively using this funciton
	 * @param dirTSBString - the TSB of the first data entry for the file
	 */
	this.read = function(tsbString) {

		// check for another link in the chain
		var nextTSB = this.getDirDataTSB(tsbString);
		
		// record to the currentRead
		currentRead += this.getDataData(tsbString);
		
		if(nextTSB != "---") {
			this.read(nextTSB);
		}
		
	};
	
		
	/**
	 * Delete a file by 0'ing out all the blocks in its chain
	 * @param dirTSBString - the TSB of the directory entry for the file
	 */
	this.removeByFileName = function(fileName) {
		// get the directory tsb
    	var dirTSB = this.getTSBByName(fileName);
    	
    	// check to see if the file was found
    	if(dirTSB != "-1") {
    		// delete the file
    		this.remove(dirTSB);
    	}
    	else {
    		// file not found
    		return -1;
    	}
	}
	
	/**
	 * Delete a file by 0'ing out all the blocks in its chain
	 * @param dirTSBString - the TSB of the directory entry for the file
	 */
	this.remove = function(dirTSBString) {
		// check for another link in the chain
		var nextTSB = this.getDirDataTSB(dirTSBString);
		
		if(nextTSB != "---") {
			this.remove(nextTSB);
			this.setDirFileActive(nextTSB, INACTIVE);
		}
		
		// 0 out the directory entry
		this.setDirFileActive(dirTSBString, INACTIVE);
		
		// update the display
		hostDivDisk();
	};
	
	this.getDirectoryListing = function() {
		// create a string to collect info
		var totalString = "";
		
		// iterate through directory and get info on all active files
		for(var i=0; i<DIRECTORY_TRACKS; i++) {
			for(var j=0; j<SECTORS; j++) {
				for(var k=0; k<BLOCKS; k++) {
					// create a unique key out of the track sector and block
					var tsbString = i.toString() + j.toString() + k.toString();
					
					// check to see if the file is active
					if(this.getDirFileActive(tsbString) === 1 && tsbString != "000") {
						
						// get the file info as a string to add to the dir listing
						var thisFileName = this.getDirFileName(tsbString);
						var thisFilePermissions = "";
						
						switch(this.getDirFileMode(tsbString)) {
							case MODE_NONE:
								thisFilePermissions = "---";
								break;
							case MODE_X:
								thisFilePermissions = "--X";
								break;
							case MODE_W:
								thisFilePermissions = "-W-";
								break;
							case MODE_WX:
								thisFilePermissions = "-WX";
								break;
							case MODE_R:
								thisFilePermissions = "R--";
								break;
							case MODE_RX:
								thisFilePermissions = "R-X";
								break;
							case MODE_RW:
								thisFilePermissions = "RW-";
								break;
							case MODE_RWX:
								thisFilePermissions = "RWX";
								break;
						}
						
						var thisFileSize = (this.getDirFileSize(tsbString) * BLOCK_SIZE);
						
						// combine string
						var fileString =  thisFilePermissions + " | " + thisFileSize + " | " + thisFileName;
						
						// add it to the totalString
						totalString += fileString + ",";
					}
					
					
				}
			}
		}
		
		// return the direcotry listing
		return totalString;
	};
	
	
}
    