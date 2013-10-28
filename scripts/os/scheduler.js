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
		alert("updated pid " + pcb.pid + " state: " + _Processes[pcb.pid].state);
	}
	
    
    /**
     * CPU uses this method to request the process that it should run
     * the return value is the pcb of the process to run for the cycle
     */
	this.processToRun = function() {
		
		// for now it is just first in, first out scheduling
		// look for the first process with a READY flag
		for(i=0; i < _Processes.length; i++) {
			//alert("state for procces " + i + " is " + _Processes[i].state);
			if(_Processes[i].state === P_READY) {
				//alert("sending " + i);
				return _Processes[i];
			}
			
		}
		
		// no ready process found
		return -1;
	

	}
	
}
