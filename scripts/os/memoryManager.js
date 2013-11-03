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
    	for(var i=0; i < this.NUM_MEMORY_SLOTS; i++) {
    		this.blockStatus[i] = null;
    	}
    };
	
    
    // Attempt to allocate a new block of memory
    this.alloc = function(pcb) {
    	var openBlock = -1;
    	// check for the next free block of memory 
    	// find the first available memory block 
    	for(var i=0; i < this.NUM_MEMORY_SLOTS; i++) {
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
    		return -1;
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
    this.getByte = function(pcb, location) {
    	// check to see is the request to valid!
    	if(+location > MAX_PROGRAM_SIZE) {
    		// memeory access violation!
    		// output to console
    		_StdIn.displayTextOnNewLine("Memory read access violation!");
    		_StdIn.displayTextOnNewLine("PID: " + pcb.pid + " attempted access at: " + (+pcb.block * MAX_PROGRAM_SIZE) + +location);
    		_StdIn.displayTextOnNewLine("Process ended unexpectedly.");
    		
    		// end the process
    		pcb.state = P_TERMINATED;
    		//_CPU.state = P_TERMINATED;
    		//_CPU.currentProcess = P_TERMINATED;
    		
    		//alert(pcb.pid + " " + pcb.name + " " + pcb.state);
    		
    	}
    	else {
    		// return the block of memory
    		return _Memory[(+pcb.block * MAX_PROGRAM_SIZE) + +location];
    	}
    };
    
    /**
     * Write a byte to memory
     */
	this.writeByte = function(pcb, location, thisByte) {
		// check to see is the request to valid!
    	if(+location > MAX_PROGRAM_SIZE) {
    		// memeory access violation!
    		// output to console
    		_StdIn.displayTextOnNewLine("Memory write access violation!");
    		_StdIn.displayTextOnNewLine("PID: " + pcb.pid + " attempted access at: " + (+pcb.block * MAX_PROGRAM_SIZE) + +location);
    		_StdIn.displayTextOnNewLine("Process ended unexpectedly.");
    		
    		// end the process
    		//alert(pcb.pid + " " + pcb.name + " " + pcb.state);
    		pcb.state = P_TERMINATED;
    		
    	}
    	else {
    		_Memory[(+pcb.block * MAX_PROGRAM_SIZE) + +location] = thisByte;
    	}
	}
	
    
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
    