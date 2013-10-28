/**
 * MemoryManager
 * @author brian.gormanly
 * 
 * Manages access and management of memory
 */

function MemoryManager() {
    
	// will hold the total number of memory slots
    this.NUM_MEMORY_SLOTS = 0;
    
    // create an array that will hold the current status of the memory blocks
    this.blockStatus = new Array();
    
    this.init = function() {
    	// find out the total memory slots available by dividing the TOTAL_MEMORY by the MAX_PROGRAM_SIZE
    	this.NUM_MEMORY_SLOTS = TOTAL_MEMORY / MAX_PROGRAM_SIZE;
    	
    	// initialize the memory blocks to being empty
    	for(i=0; i < this.NUM_MEMORY_SLOTS; i++) {
    		this.blockStatus[i] = null;
    	}
    };
	
    
    // Attempt to allocate a new block of memory
    this.alloc = function(pcb) {
    	var openBlock = -1;
    	// check for the next free block of memory 
    	// find the first available memory block 
    	for(i=0; i < this.NUM_MEMORY_SLOTS; i++) {
    		if(this.blockStatus[i] == null) {
    			openBlock = i;
    			// we found an open block break the loop
    			i = this.NUM_MEMORY_SLOTS;
    		}
    	}
    	
    	// check too see that there is an open memory block avaliable
    	if(openBlock > -1) {
    		// block available
    		
    		// set the block array to the pcb passed
    		this.blockStatus[openBlock] = pcb;
    		
    		// return the block num
    		return openBlock;
    	}
    	else {
    		// no open memory available!
    		return -1
    	}
    	
    	
    };
    
    // TODO: de allocate memory for a process 
    this.dealloc = function(pcb) {
    	
    };
    
    
    this.load = function(block, commandArray) {
    	var startingByte = block * MAX_PROGRAM_SIZE;
    	
    	
    	for(i in commandArray) {
			// add the instruction to memory
			_Memory[+startingByte + +i] = commandArray[i];
			
		}
    	
		//alert(_Memory);
    }
    
    
    /**
     * Gets a instruction from memory
     */
    this.getNextByte = function(block, pc) {
    	return _Memory[(+block * MAX_PROGRAM_SIZE) + +pc];
    };
    
    /**
     * Translate a hex number to decimal
     */
	this.convertHexToDec = function(hex) {
		var dec = parseInt(hex, 16);
		
		return dec;
	}
	
	/**
	 * check that the address is within the valid range of memory addresses
	 */
	this.isValid = function(address) {
		// Get base and limit addresses
		var base = _CurrentProcess.base;
		var limit = _CurrentProcess.limit;
		// Make sure address is between those bounds
		return ( address >= base && address <= limit );
	}
	
    
    
}
    