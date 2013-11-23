/* ------------  
   Control.js

   Requires global.js.
   
   Routines for the hardware simulation, NOT for our client OS itself. In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code that
   hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using JavaScript in 
   both the host and client environments.
   
   This (and other host/simulation scripts) is the only place that we should see "web" code, like 
   DOM manipulation and JavaScript event handling, and so on.  (Index.html is the only place for markup.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */


//
// Control Services
//
function hostInit()
{
	// Get a global reference to the canvas.  TODO: Move this stuff into a Display Device Driver, maybe?
	_Canvas  = document.getElementById('display');

	// Get a global reference to the drawing context.
	_DrawingContext = _Canvas.getContext('2d');

	// Enable the added-in canvas text functions (see canvastext.js for provenance and details).
	CanvasTextFunctions.enable(_DrawingContext);   // TODO: Text functionality is now built in to the HTML5 canvas. Consider using that instead.

	// Clear the log text box.
	document.getElementById("taLog").value="";
	
	// initialize the memory display
	hostDivMemory();

	// Set focus on the start button.
   document.getElementById("btnStartOS").focus();

   // Check for our testing and enrichment core.
   if (typeof Glados === "function") {
      _GLaDOS = new Glados();
      _GLaDOS.init();
   };

}

function hostLog(msg, source)
{
	
    // Check the source.
    if (!source) {
        source = "?";
    }

    // Note the OS CLOCK.
    var clock = _OSclock;

    // Note the REAL clock in milliseconds since January 1, 1970.
    var now = new Date().getTime();

    // Build the log string.   
    //var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";    
    var str = msg + "\n"; 
    
    // Update the log console.
    var taLog = document.getElementById("taLog");
    
    // backwards log
    taLog.value = str + taLog.value;
    
    //fowards log
    //taLog.value = taLog.value + str;
    
    // Optionally update a log database or some streaming service.
}

//controls the output of the CPU info
function hostDivCPU() {
	// clear the cpu window
	document.getElementById('taCPUstatus').innerHTML = "";
	
	// redraw the CPU's status
	document.getElementById('taCPUstatus').innerHTML += "PC : " + _CPU.pc + "<br />";
	document.getElementById('taCPUstatus').innerHTML += "ACC : " + _CPU.acc + "<br />";
	document.getElementById('taCPUstatus').innerHTML += "X : " + _CPU.x + "<br />";
	document.getElementById('taCPUstatus').innerHTML += "Y : " + _CPU.y + "<br />";
	document.getElementById('taCPUstatus').innerHTML += "Z : " + _CPU.z + "<br />";
	document.getElementById('taCPUstatus').innerHTML += "Current Instruction : " + _CPU.currentInstruction + "<br />";
	
}


// controls the output of the memory array to the memory div
function hostDivMemory() {
	// clear the memory window
	document.getElementById('taMemory').innerHTML = "";
	
	// show the output of the memory array in the div
	for(i = 0; i < TOTAL_MEMORY; i++) {
		// check program block size max to show the break
		if(i % MAX_PROGRAM_SIZE == 0) {
			//break
			document.getElementById('taMemory').innerHTML += "<hr/>";
		}
		
		// check for new line
		if(i % 8 == 0) {
			//break
			document.getElementById('taMemory').innerHTML += "<br/>";
		}
		
		// the the byte
		document.getElementById('taMemory').innerHTML += _Memory[i] + " ";
		
	}
}

//controls the output of the CPU info
function hostDivPCB() {
	// clear the pcb window
	document.getElementById('taPCBstatus').innerHTML = "";
	
	// get a local copy of the processes array so we can sort
	thisProcesses = null;
	thisProcesses = _Processes;

	//sort call
	//var thisProcesses = quickSort(thisProcesses, 0, thisProcesses.length - 1);
	
	//alert(thisProcesses + " length: " + thisProcesses.length);
	
	// use the really cool quick sort algorithm i added to the util.js
	//thisProcesses = quickSortPartition(thisProcesses, thisProcesses.length);
	
	//alert("2:::: " + thisProcesses + " length: " + thisProcesses.length);
	
	// ouput the processes info
	for(var i=0; i < thisProcesses.length; i++) {
		document.getElementById('taPCBstatus').innerHTML += padString(thisProcesses[i].pid.toString(), 3);
		document.getElementById('taPCBstatus').innerHTML += padString(thisProcesses[i].name.toString(), 12);
		document.getElementById('taPCBstatus').innerHTML += padString(getStateName(thisProcesses[i].state).toString(), 10);
		document.getElementById('taPCBstatus').innerHTML += padString(thisProcesses[i].pc.toString(), 4);
		document.getElementById('taPCBstatus').innerHTML += padString(thisProcesses[i].acc.toString(), 4);
		document.getElementById('taPCBstatus').innerHTML += padString(thisProcesses[i].x.toString(), 3);
		document.getElementById('taPCBstatus').innerHTML += padString(thisProcesses[i].y.toString(), 3);
		document.getElementById('taPCBstatus').innerHTML += padString(thisProcesses[i].z.toString(), 3);
		document.getElementById('taPCBstatus').innerHTML += "<br/>";
	}
	
}

//
// Control Events
//
function hostBtnStartOS_click(btn)
{
    // Disable the start button...
    btn.disabled = true;
    
    // .. enable the Halt and Reset buttons ...
    document.getElementById("btnHaltOS").disabled = false;
    document.getElementById("btnReset").disabled = false;
    
    // .. set focus on the OS console display ... 
    document.getElementById("display").focus();
    
    // ... Create and initialize the CPU ...
    _CPU = new Cpu();
    _CPU.init();
    
    // create and start the memory manager
    _MemoryManager = new MemoryManager();
    _MemoryManager.init();
    
    // create and start the CPU Scheduler
    _Scheduler = new Scheduler();
	_Scheduler.init();

    // ... then set the host clock pulse ...
    _hardwareClockID = setInterval(hostClockPulse, CPU_CLOCK_INTERVAL);
    // .. and call the OS Kernel Bootstrap routine.
    krnBootstrap();
}

function hostBtnHaltOS_click(btn)
{
    hostLog("emergency halt", "host");
    hostLog("Attempting Kernel shutdown.", "host");
    // Call the OS shutdown routine.
    krnShutdown();
    // Stop the JavaScript interval that's simulating our clock pulse.
    clearInterval(_hardwareClockID);
    // TODO: Is there anything else we need to do here?
}

function hostBtnReset_click(btn)
{
    // The easiest and most thorough way to do this is to reload (not refresh) the document.
    location.reload(true);  
    // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
    // be reloaded from the server. If it is false or not specified, the browser may reload the 
    // page from its cache, which is not what we want.
}

function hostLogButton() {
	document.getElementById('divLog').style.display = 'block';
	document.getElementById('divMemory').style.display = 'none';
	document.getElementById('divDisk').style.display = 'none';
}

function hostMemoryButton() {
	document.getElementById('divLog').style.display = 'none';
	document.getElementById('divMemory').style.display = 'block';
	document.getElementById('divDisk').style.display = 'none';
}

function hostDiskButton() {
	document.getElementById('divLog').style.display = 'none';
	document.getElementById('divMemory').style.display = 'none';
	document.getElementById('divDisk').style.display = 'block';
}

function hostCPUButton() {
	document.getElementById('divCPUstatus').style.display = 'block';
	document.getElementById('divPCBstatus').style.display = 'none';
}

function hostProcButton() {
	document.getElementById('divCPUstatus').style.display = 'none';
	document.getElementById('divPCBstatus').style.display = 'block';
}

