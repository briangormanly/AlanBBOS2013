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
    	
    };
    
    // execute the instrution
    this.execute = function() {
    	
    };
    
}
