/* ------------  
   CPU.js

   Requires global.js.
   
   Routines for the host CPU simulation, NOT for the OS itself.  
   In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   JavaScript in both the host and client environments.

   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

function Cpu() {
    this.pc = 0;     // Program Counter
    this.acc = 0;     // Accumulator
    this.x = 0;     // X register
    this.y = 0;     // Y register
    this.z = 0;     // Z-ero flag (Think of it as "isZero".)
    this.isExecuting = false;
    this.block = -1;
    
    // holds the current instruction
    this.currentInstruction = -1;
    
    this.currentProcess = null;
    
    // holds the current op code function determined by decode
    this.opCode = "";
    
    this.init = function() {
        this.pc = 0;
        this.acc = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;      
        this.isExecuting = false;  
        this.block = -1;
    };
    
    this.cycle = function() {
        krnTrace("CPU cycle");
        // TODO: Accumulate CPU usage and profiling statistics here.
        
        
        // check with the scheduler for a process to run
        this.currentProcess = _Scheduler.processToRun();
        
        this.currentProcess.state = P_RUNNING;
        
        // log the process running
        //alert("process running : " + this.currentProcess.pid);

        // check to see if there is a valid process
        if(this.currentProcess != -1) {
        	// have a process to work on 
        	// load the registers from the PCB
        	this.pc = this.currentProcess.pc;
        	this.acc = this.currentProcess.acc;
        	this.x = this.currentProcess.x;
        	this.y = this.currentProcess.y;
        	this.z = this.currentProcess.z;
        	this.block = this.currentProcess.block;
        	
        	// fetch
        	this.fetch();

        	// decode
        	this.decode();
        	
        	// execute
        	this.execute();
        	
        	// increment the pc
        	this.pc++;
        	
        	//save the registers states back to the pcb
        	this.currentProcess.pc = this.pc;
        	this.currentProcess.acc = this.acc;
        	this.currentProcess.x = this.x;
        	this.currentProcess.y = this.y;
        	this.currentProcess.z = this.z;
        	this.currentProcess.block = this.block;
        	
        	// set back to ready
        	if(this.currentProcess.state != P_TERMINATED) {
        		this.currentProcess.state = P_READY;
        	}
        	
        	
        	// send the scheduler back the state of the registers
        	_Scheduler.updateProcess(this.currentProcess);
        }
        else {
        	// no valid process, stop until another is loaded
        	this.isExecuting = false; 
        	
        }

        // update the UI with the CPU register statuses
        hostDivCPU();
        
        // update the memory veiw
        hostDivMemory();
    };
    
    // fetch the instruction from memory
    this.fetch = function() {
    	// load the op codet
    	//alert("fetching instruction at pc " + this.pc + " block : " + this.block);
    	this.currentInstruction = _MemoryManager.getNextByte(this.block, this.pc);
    	
    };
    
    // decode the instruction
    this.decode = function() {
    	
    	switch(this.currentInstruction) {
			case "A9":
				//Load the accumulator with a constant 
				this.opCode = loadAccConst; 	
				break;
			case "AD":
				//Load the accumulator from memory 
				this.opCode = loadAccFromMem;
				break;
			case "8D":
				//Store the accumulator in memory
				this.opCode = storeAccInMem;
				break;
			case "6D":
				//Add with carry
				//Adds contents of an address to 
				//the contents of the accumulator and 
				//keeps the result in the accuculator
				this.opCode = addWithCarry;
				break;
			case "A2":
				//Load the X register with a constant 
				this.opCode = loadXRegWithConst;
				break;
			case "AE":
				//Load the X register from memory
				this.opCode = loadXRegFromMem;
				break;
			case "A0":
				//Load the Y register with a constant
				this.opCode = loadYRegWithConst;
				break;
			case "AC":
				//Load the Y register from memory 
				this.opCode = loadYRegFromMem;
				break;
			case "EA":
				//No Operation
				this.opCode = noOperation;
				break;
			case "00":
				//Break (which is really a system call)
				this.opCode = sysBreak;
				break;
			case "EC":
				//Compare a byte in memory to the X reg sets the Z (zero) flag if equal
				this.opCode = compareXReg;
				break;
			case "D0":
				//Branch X bytes if Z flag = 0
				this.opCode = branchXBytes;
				break;
			case "EE":
				//Increment the value of a byte
				this.opCode = incByteValue;
				break;
			case "FF":
				//System Call 
				//#$01 in X reg = print the integer stored in the Y register. 
				//#$02 in X reg = print the 00-terminated string stored at the address in the Y register. 
				this.opCode = sysCall;
				break;
			
			default: 	
				sysBreak();
				break;
		}
    	
    };
    
    // execute the instrution
    this.execute = function() {
    	//alert("opcode = " + this.opCode);
    	this.opCode();
    };
    
    /**
     * Helper function to get the next byte from memory and return hex value
     */
	this.getNextByteHex = function() {
		return _MemoryManager.getNextByte(this.block, ++this.pc);
	}
	
	/**
	 * Helper function to get the next byte from memory and return the decimal value
	 */
	this.getNextByteDec = function() {
		return _MemoryManager.convertHexToDec(this.getNextByteHex());
	}
	
    /**
     * Helper function to get the next two bytes from memory and return the hex value
     */
	this.getTwoBytesHex = function() {
		var first = _MemoryManager.getNextByte(this.block, ++this.pc);
		var second = _MemoryManager.getNextByte(this.block, ++this.pc);
		
		// concatinate (reverse order)
		return (second + first);
	}
	
	/**
	 * Helper function to get the next two bytes from memory and retun the decimal value
	 */
	this.getTwoBytesDec = function() {
		 return _MemoryManager.convertHexToDec(this.getTwoBytesHex());
	}
	
	/**
	 * Convert a decimal value passed in to 2's complement binary.
	 */
    this.decTo2sComp = function(dec) {
    	
    }
    
    
    function loadAccConst() {
    	this.acc = this.getNextByteHex();
    }
    
    function loadAccFromMem() {
		// get the contents of the memory location and put in the accumulator
		this.acc = _Memory[this.getTwoBytesDec()];
		//alert(this.acc + " is the value in the accumulator");

    }
    
    
    function storeAccInMem() {
		_Memory[this.getTwoBytesDec()] = this.acc;

    }
    
    
    function loadXRegWithConst() {
    	var value = this.getNextByteDec();
    	//alert("load x : " + value + " at : " + this.pc);
    	this.x = value;
    }
    
    function loadXRegFromMem() {
    	this.x = _Memory[this.getTwoBytesDec()];
    }
    
    function loadYRegWithConst() {
    	this.y = this.getNextByteDec();
    }
    
    function loadYRegFromMem() {
    	this.y = _Memory[this.getTwoBytesDec()];
    }
    
    function noOperation() {
    	this.pc++;
    }
    
    
    function compareXReg() {
    	// compare the containts of the x reg with the next byte
    	var addval = _Memory[this.getTwoBytesDec()];

    	if(this.x == addval) {
    		//alert("x is : " + this.x + " and value is " + addval + "z is now 1");
    		// if make the z flag one
    		this.z = 1;
    	}
    	else {
    		// else z reg = 0
    		//alert("x is : " + this.x + " and value is " + addval + "z is now 0");
    		this.z = 0;
    	}
    }
    
    function branchXBytes() {
    	// check to see if the z flag is eq to x
    	if(this.z == 0) {
    		// get the value to increment the pc
    		var valToAdd = this.getNextByteDec();
    		
    		this.pc += valToAdd;
    		
    		// check to see if we are going backwards
    		if(this.pc > MAX_PROGRAM_SIZE) {
    			this.pc -= MAX_PROGRAM_SIZE;
    		}
    		
    		
    	}
    	else {
    		// condition satified continue on skiping the destination
    		this.pc += 1;
    	}
    }
    
    function sysBreak() {
    	this.isExecuting = false;
    	this.pc = 0;
    	this.currentProcess.state = P_TERMINATED;

    }
    
    function incByteValue() {
    	// get the address of the value to increment
    	var address = this.getTwoBytesDec();
    	
    	var value = _MemoryManager.convertHexToDec(_Memory[address]);
    	_Memory[address] = this.decTo2sComp(value + 1);
    }
    
    function sysCall() {
    	// check to see what value is in the x register
    	// if the value is 1 then print the y reg value
    	// if the value is 2 then get the 00 terminated string at the address in the y reg
    	//alert("x check: " + this.x);
    	if(this.x == 1) {
    		// display the contents of the y reg
    		_StdIn.displayTextOnNewLine(this.y);
    	}
    	else if(this.x == 2) {
    		// get the starting address from the y register
    		var outAddress = this.y;
    		
    		// loop through memory and output until terminator 00 is reached
    		while(_Memory[outAddress] != 00) {
    			// Turn byte into a decimal integer
    			keyCode = parseInt(_Memory[outAddress], 16);
    			chr = String.fromCharCode(keyCode);

    			// output to console
    			_StdIn.displayText(chr);
    			// Increment the address
    			outAddress++;
    		}
    		
    	}
    	
    	_StdIn.displayTextOnNewLine(">");
    	
    }
    
    
    function addWithCarry() {
    	// Add contents of the memory location and the contents of the ACC
    	var value = _Memory[this.getTwoBytesDec()];
    	//alert("add with carry : " + value + "to acc: " + this.acc);
		this.acc = parseInt(this.acc) + parseInt(value, 16);
		//alert("acc rusult: "+ this.acc);
    	
    }
    
}
