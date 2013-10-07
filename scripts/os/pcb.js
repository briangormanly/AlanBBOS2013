/**
 * pcb.js (process control block
 * @author brian.gormanly
 * 
 * contains all information needed for the process
 * control block
 */

// array of all loaded processes
var _Processes = new Array();
 

function PCB (pid, name, state, pc) {
	// Member variables
	this.pid = pid; 
	this.name = name;
	this.state = state;	
	this.pc = pc;	
	this.block = -1;

	// Registers
	this.acc = 0;
	this.x = 0;
	this.y = 0;
	this.z = 0;
	
	// update this PCB
	this.update = function(state, pc, acc, x, y, z) {
		this.state = state;
		this.pc = pc;
		this.acc = acc;
		this.x = x;
		this.y = y;
		this.z = z;
	}
	
	// update the block of memory allocated
	this.update = function(block) {
		this.block = block;
	};
	

}

function getPCBByProcessName(name) {
	// check that the name is valid
	if(name != null) {
		// look for the name in our array of processes
		for(i in this._Processes) {
			if(this._Processes[i].name == name) {
				// match
				return this._Processes[i].pid;
			}
			
		}
	}
	
	// no match found return -1
	return -1;
}
	
