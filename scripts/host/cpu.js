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
        var currentProcess = _Scheduler.processToRun();

        // check to see if there is a valid process
        if(currentProcess != -1) {
        	// have a process to work on 
        	// load the registers from the PCB
        	this.pc = currentProcess.pc;
        	this.acc = currentProcess.acc;
        	this.x = currentProcess.x;
        	this.y = currentProcess.y;
        	this.z = currentProcess.z;
        	this.block = currentProcess.block;
        	
        	// fetch
        	this.fetch();

        	// decode
        	this.decode();
        	
        	// execute
        	this.execute();
        	
        	// increment the pc
        	this.pc++;
        	
        	//save the registers states back to the pcb
        	currentProcess.pc = this.pc;
        	currentProcess.acc = this.acc;
        	currentProcess.x = this.x;
        	currentProcess.y = this.y;
        	currentProcess.z = this.z;
        	currentProcess.block = this.block;
        	
        	// send the scheduler back the state of the registers
        	_Scheduler.updateProcess(currentProcess);
        }
        else {
        	// no valid process, stop until another is loaded
        	this.isExecuting = false; 
        	
        }

        // update the UI with the CPU register statuses
        hostDivCPU();
    };
    
    // fetch the instruction from memory
    this.fetch = function() {
    	// load the op codet
    	this.currentInstruction = _MemoryManager.getNextByte(this.block, this.pc);
    	
    	if(this.currentInstruction == "00") {
    		this.isExecuting = false;
    	}
    	
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
				this.opCode = loadAccMem;
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
    	this.opCode();
    };
    
    
    function loadAccConst() {
    	this.acc = _MemoryManager.getNextByte(this.block, ++this.pc);
    }
    
}
