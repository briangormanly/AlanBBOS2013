
function FSDD() {
	
	// Constants

	// mode
	var MODE_NONE = 0;
	var MODE_X = 1;
	var MODE_W = 2;
	var MODE_WX = 3;
	var MODE_R = 4;
	var MODE_RX = 5;
	var MODE_RW = 6;
	var MODE_RWX = 7;
	
	// lock
	var LOCK_INACTIVE = 0;
	var LOCK_ACTIVE = 1;
	
	// active
	var INACTIVE = 0;
	var ACTIVE = 1;
	
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
			_Disk.write("000", "1100Swap file location");
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
	    			var size = "1";
	    			
	    			// create the directory block
	    			this.writeDirectoryBlock(tsbString, active, dataBlockTSB, mode, lock, size, name);
	    			
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
     * @param dirTSB - the directory TSB of the file
     * @param data - the data to write to the files data blocks
     */
    this.writeTSB = function(dirTSB, data) {
    
    };
    
    /**
     * write (overwrite) file data
     * @param fileName - name of the file to overwrite
     * @param data - the data to write to the files data block
     */
    this.write = function(fileName, data) {
    	
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
    			var size = "1";
    			
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
					if(this.getFileName(tsbString) === name) {
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
	this.getFileActive = function(tsbString) {
		if(_Disk.read(tsbString).substring(0, 1) === 0) {
			return INACTIVE;
		}
		else if(_Disk.read(tsbString).substring(0, 1) === 1) {
			return ACTIVE;
		}
	};
	
	
	/**
	 * gets the mode for the file at the provided directory tsb
	 * @param tsbString - Directory TSB
	 * @return fileMode
	 */
	this.getFileMode = function(tsbString) {
		if(_Disk.read(tsbString).substring(4, 1) === 0) {
			return MODE_NONE;
		}
		else if(_Disk.read(tsbString).substring(4, 1) === 1) {
			return MODE_X;
		}
		else if(_Disk.read(tsbString).substring(4, 1) === 2) {
			return MODE_W;
		}
		else if(_Disk.read(tsbString).substring(4, 1) === 3) {
			return MODE_WX;
		}
		else if(_Disk.read(tsbString).substring(4, 1) === 4) {
			return MODE_R;
		}
		else if(_Disk.read(tsbString).substring(4, 1) === 5) {
			return MODE_RX;
		}
		else if(_Disk.read(tsbString).substring(4, 1) === 6) {
			return MODE_RW;
		}
		else if(_Disk.read(tsbString).substring(4, 1) === 7) {
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
	this.getFileLock = function(tsbString) {
		if(_Disk.read(tsbString).substring(5, 1) === 0) {
			return LOCK_INACTIVE;
		}
		else if(_Disk.read(tsbString).substring(5, 1) === 1) {
			return LOCK_ACTIVE;
		}
	};
	
	/**
	 * gets the size for the file at the provided directory tsb
	 * @param tsbString - Directory TSB
	 * @return fileSize
	 */
	this.getFileSize = function(tsbString) {
		return _Disk.read(tsbString).substring(6, 3);
	};
	
	/**
	 * gets the name for the file at the provided directory tsb
	 * @param tsbString - Directory TSB
	 * @return fileName
	 */
	this.getFileName = function(tsbString) {
		return _Disk.read(tsbString).substring(9, 55);
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
		
		// check the parameters
		if(name.length < 1) {
			krnTrace("Write Data block error: File name too short!");
		}
		else if(name.length > 57) {
			krnTrace("Write Data block error: File name too long!");
		}
		else if(active.length != 1) {
			krnTrace("Write Data block error: Mode is 1 character!");
		}
		else if(active != "1" || active != "0") {
			krnTrace("Write Data block error: Active should be either 0 or 1!");
		}
		else if(lock.length != 1) {
			krnTrace("Write Data block error: Mode is 1 character!");
		}
		else if(lock != "1" || lock != "0") {
			krnTrace("Write Data block error: Lock should be either 0 or 1!");
		}
		else if(size.length !== 3) {
			krnTrace("Write Data block error: Size needs to be 3 characters!");
		}
		else if(dataBlockTSB.length != 3) {
			krnTrace("Write Data block error: Data Block TSB reference should be 3 characters");
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
		
		// check the parameters
		if(name.length < 1) {
			krnTrace("Write Data block error: File name too short!");
		}
		else if(name.length > 57) {
			krnTrace("Write Data block error: File name too long!");
		}
		else if(active.length != 1) {
			krnTrace("Write Data block error: Mode is 1 character!");
		}
		else if(active != "1" || active != "0") {
			krnTrace("Write Data block error: Active should be either 0 or 1!");
		}
		else if(nextBlockTSB.length != 3) {
			krnTrace("Write Data block error: Data Block TSB reference should be 3 characters");
		}
		else {
			// ok to write 
			
			// create the single data string from the indformation passed
			var dirBlock = active + nextBLockTSB + dataBlock;
			
			// write to the directory string to the disk
			_Disk.write(tsbString, dirBlock);
		}
	};
    
}
    