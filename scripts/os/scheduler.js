/**
 * Scheduler
 * @author brian.gormanly
 * 
 * Manages process scheduling in the CPU
 */

function Scheduler() {
	
	this.init = function() {
		
    };
	
    /**
     * Request for the scheduler to run a process
     */
    this.requestRun = function(pid) {
    	
    	//set the process state to ready
    	//alert("setting pid " + pid + " to ready!");
    	_Processes[pid].state = P_READY;
    }
    
    /**
     * Update the process pcb with the state of the cpu
     */
	this.updateProcess = function(pcb) {
		_Processes[pcb.pid] = pcb;
		//alert("updated pid " + pcb.pid + " state: " + _Processes[pcb.pid].state);
	}
	
    
    /**
     * CPU uses this method to request the process that it should run
     * the return value is the pcb of the process to run for the cycle
     */
	this.processToRun = function() {
		
		// check to see what scheduling algorithm to use
		switch(SCHEDULER) {
			case FIFO:
				fifo();
				break;
			case ROUND_ROBIN:
				roundRobin();
				break;
		}
	}
	
	// detirme process to run based on round robin out algorithm
	// make the process the current process
	function roundRobin() {
		
	}
	
	// detirme process to run based on FIFO out algorithm
	// make the process the current process
	function fifo() {
		// track a flag that something is running
		var flag = 0;
		
		// for now it is just first in, first out scheduling
		// look for the first process with a READY flag
		for(i=0; i < _Processes.length; i++) {
			//alert("state for procces " + i + " is " + _Processes[i].state);
			if(_Processes[i].state === P_READY) {
				//alert("sending " + i);
				_CPU.isExecuting = true;
				_CPU.currentProcess = _Processes[i];
				flag++;
				break;
			}
			
		}
		
		if(flag === 0) {
			// no processes to run
			_CPU.isExecuting = false;
		}
	}
	
}
