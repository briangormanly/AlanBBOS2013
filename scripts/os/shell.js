/* ------------
   Shell.js
   
   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

function Shell() {
    // Properties
    this.promptStr   = ">";
    this.commandList = [];
    this.curses      = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
    this.apologies   = "[sorry]";
    // Methods
    this.init        = shellInit;
    this.putPrompt   = shellPutPrompt;
    this.handleInput = shellHandleInput;
    this.execute     = shellExecute;
}

function shellInit() {
    var sc = null;
    //
    // Load the command list.

    // date
    sc = new ShellCommand();
    sc.command = "date";
    sc.description = "- Displays the current date and time.";
    
    sc.function = (function(){
    	_StdIn.displayTextOnNewLine(new Date()); 
    });
    this.commandList[this.commandList.length] = sc;
    
    // whereami
    sc = new ShellCommand();
    sc.command = "whereami";
    sc.description = "- Displays the current users current location";
    sc.function = (function(){
    	_StdIn.displayTextOnNewLine("Using the best Operating System ever!"); 
    });
    this.commandList[this.commandList.length] = sc;
    
    // whoami
    sc = new ShellCommand();
    sc.command = "whoami";
    sc.description = "- Displays the current users name";
    sc.function = (function(){
    	_StdIn.displayTextOnNewLine("A really cool person"); 
    });
    this.commandList[this.commandList.length] = sc;
    
    // status
    sc = new ShellCommand();
    sc.command = "status";
    sc.description = "- Displays the status entered in the task bar";
    sc.function = (function(args){
    	var status = "";
    	if (args.length > 0) {
    		for(var i=0; i < args.length; i++) {
    			status = status.concat(args[i]);
    			status = status.concat(" ");
    		}
            
            document.getElementById('currentStatus').innerHTML = status;
        }
    });
    this.commandList[this.commandList.length] = sc;
    
    // set quantum
    sc = new ShellCommand();
    sc.command = "quantum";
    sc.description = "- Allows user to change Round Robin quantum";
    sc.function = (function(args){
    	if (args.length > 0) {
    		// check for minimum quantum
    		if(args[0] > 1) {
	    		quantum = args[0];
	    		_StdIn.displayTextOnNewLine("Set quantum to: " + quantum);
    		}
    		else {
    			_StdIn.displayTextOnNewLine("Quantum must be set to 2 or greater!");
    		}
        }
        else {
        	_StdIn.displayTextOnNewLine("Set quantum to: " + quantum);
        }
        
    });
    this.commandList[this.commandList.length] = sc;
    
    
    // format the file system
    sc = new ShellCommand();
    sc.command = "format";
    sc.description = "- format the disk filesystem";
    sc.function = (function(args){
    	
    	krnFSDD.fullFormat();
    	
        
    });
    this.commandList[this.commandList.length] = sc;


    // create new file
    sc = new ShellCommand();
    sc.command = "create";
    sc.description = "- create a new file pass name as parameter";
    sc.function = (function(args){
    	// check that the user provided a valid argument
    	if (args.length > 0) {
    		// check the length of the filename 
    		if (args[0].length <= 57) {
    			// create the file
        		if(krnFSDD.create(args[0], MODE_RWX, LOCK_INACTIVE) != -1) {
        			// success!
        			_StdIn.displayTextOnNewLine("File created successfully!");
        		}
        		else {
        			// filename exists
        			_StdIn.displayTextOnNewLine("File name is already in use on the disk.");
        		}
        		
    		}
    		else {
    			// tell the user the filename was too long
    			_StdIn.displayTextOnNewLine("Please provide a valid file name less then 57 characters!");
    		}
    	}
    	else {
    		// tell user to enter a valid pid
    		_StdIn.displayTextOnNewLine("Please provide a valid file name!");
    	}
        
    });
    this.commandList[this.commandList.length] = sc;
    
    
    // write to a file
    sc = new ShellCommand();
    sc.command = "write";
    sc.description = "- write to a file pass name as parameter 1 then data as parameter 2 in quotes";
    sc.function = (function(args){
    	// check that the user provided a valid argument
    	if (args.length > 0) {
    		// check the length of the filename 
    		if (args[0].length <= 57) {
    			// check the data
    			if(args[1].length > 0) {
    				// check for the presence of a double quote
    				if(args[1].substring(0, 1) === "\"") {
    					// start string to write to file
    					var writeString = "";
			    		for(var i=1; i < args.length; i++) {
			    			writeString = writeString.concat(args[i]);
			    			writeString = writeString.concat(" ");
			    		}
			    		
			    		// check for the quotes in the writeString and remove as necassary
			    		if(writeString.substring(0, 1) === "\"") {
			    			writeString = writeString.substring(1);
			    		}
			    		
			    		// check for the quotes in the writeString and remove as necassary
			    		if(writeString.substring((writeString.length - 2), (writeString.length - 1)) === "\"") {
			    			writeString = writeString.substring(0, (writeString.length - 2));
			    		}
			    		
    				}
    				
    				


    				// write the data
    				if(krnFSDD.write(args[0], ACTIVE, writeString) == 1) {
    					// success!
    					_StdIn.displayTextOnNewLine("File written to successfully!");
    				}
    				else {
    					_StdIn.displayTextOnNewLine("Invalid filename!");
    				}
    			}
    			else {
    				_StdIn.displayTextOnNewLine("Please provide valid data to write!");
    			}
    		}
    		else {
    			// tell the user the filename was too long
    			_StdIn.displayTextOnNewLine("Please provide a valid file name less then 57 characters!");
    		}
    	}
    	else {
    		// tell user to enter a valid pid
    		_StdIn.displayTextOnNewLine("Please provide a valid file name!");
    	}
        
    });
    this.commandList[this.commandList.length] = sc;
    
    
    // delete file
    sc = new ShellCommand();
    sc.command = "delete";
    sc.description = "- delete a file pass name as parameter";
    sc.function = (function(args){
    	// check that the user provided a valid argument
    	if (args.length > 0) {
    		// check the length of the filename 
    		if (args[0].length <= 57) {
    			// delete the file
        		if(krnFSDD.removeByFileName(args[0]) != -1) {
        			// success!
        			_StdIn.displayTextOnNewLine("File deleted successfully!");
        		}
        		else {
        			// filename exists
        			_StdIn.displayTextOnNewLine("File name not found");
        		}
        		
    		}
    		else {
    			// tell the user the filename was too long
    			_StdIn.displayTextOnNewLine("Please provide a valid file name less then 57 characters!");
    		}
    	}
    	else {
    		// tell user to enter a valid pid
    		_StdIn.displayTextOnNewLine("Please provide a valid file name!");
    	}
        
    });
    this.commandList[this.commandList.length] = sc;
    
    // read file
    sc = new ShellCommand();
    sc.command = "read";
    sc.description = "- read a file pass name as parameter";
    sc.function = (function(args){
    	// check that the user provided a valid argument
    	if (args.length > 0) {
    		// check the length of the filename 
    		if (args[0].length <= 57) {
    			// delete the file
        		var fileString = krnFSDD.readFile(args[0]);
        		
        		// check the returned string
        		if(fileString != "-1") {
        			// output the file
            		_StdIn.displayTextOnNewLine(fileString);
        		}
        		else {
        			// filename was incorrect
            		_StdIn.displayTextOnNewLine("Please provide a valid file name!");
        		}
    		}
    		else {
    			// tell the user the filename was too long
    			_StdIn.displayTextOnNewLine("Please provide a valid file name less then 57 characters!");
    		}
    	}
    	else {
    		// tell user to enter a valid pid
    		_StdIn.displayTextOnNewLine("Please provide a valid file name!");
    	}
        
    });
    this.commandList[this.commandList.length] = sc;

    
    // display processes
    sc = new ShellCommand();
    sc.command = "top";
    sc.description = "- shows information on all processes active";
    sc.function = (function(args){
    	_StdIn.displayTextOnNewLine("Processes:");
    	
    	// interate through processes
    	for(var i=0; i < _Processes.length; i++) {
    		if(_Processes[i].state === P_READY || _Processes[i].state === P_LOADED || _Processes[i].state === P_NEW || _Processes[i].state === P_RUNNING) {
    			_StdIn.displayTextOnNewLine("PID:" + _Processes[i].pid + " name:" + _Processes[i].name + " state:" + _Processes[i].state);
    		}
    	}
    	
        
    });
    this.commandList[this.commandList.length] = sc;
    
    // kill processes
    sc = new ShellCommand();
    sc.command = "kill";
    sc.description = "- kill the process identified by the PID";
    sc.function = (function(args){
    	// check that the user provided a valid argument
    	if (args.length > 0 && args[0] >= 0 && (_Processes[args[0]].state === P_RUNNING || _Processes[args[0]].state === P_READY)) {
    		// try to terminate the process
    		_Processes[args[0]].state = P_TERMINATED;
    	}
    	else {
    		// tell user to enter a valid pid
    		_StdIn.displayTextOnNewLine("Please provide a valid pid");
    	}
        
    });
    this.commandList[this.commandList.length] = sc;
    
    // set scheduler
    sc = new ShellCommand();
    sc.command = "scheduler";
    sc.description = "- Allows user to change Scheduler algorithm";
    sc.function = (function(args){
    	if (args.length > 0) {
    		var algo = args[0].toUpperCase();
    	
    		switch(algo) {
    			case "FIFO":
    				SCHEDULER = FIFO;
    				break;
    			case "RR":
    				SCHEDULER = ROUND_ROBIN;
    				break;
    			default:
    				algo ="invalid: valid choices are FIFO and RR";
    				break;
    		}
			quantum = algo;
			_StdIn.displayTextOnNewLine("Set scheduler algorithm to:");
			_StdIn.displayTextOnNewLine(algo);
		
		}
		else {
			var algo = "";
		
			switch(SCHEDULER) {
			case FIFO:
				algo = "Pre-emtive First In First Out (FIFO)";
				break;
			case ROUND_ROBIN:
				algo = "Round Robin";
				break;
			}
		
			_StdIn.displayTextOnNewLine("Set scheduler algorithm to:");
			_StdIn.displayTextOnNewLine(algo);
		}
        
    });
    this.commandList[this.commandList.length] = sc;
    
    // load
    sc = new ShellCommand();
    sc.command = "load";
    sc.description = "- Checks for errors and loads a process.";
    sc.function = (function(args){
    	var processName = "";
    	// check to see if there is a argument for a process name
    	if (args.length > 0) {
    		// get the first argument we will use it as the process name
    		processName = status.concat(args[0]);
    		
    	}
    		
    	// get the input from the program input area
    	var input = document.getElementById('taProgramInput').value;
    	// create a regex for hex input
    	var hex = /^[a-f0-9]$/i;
    	
    	// check it
    	if(input.match("[0-9A-F]")) {
    		//valid load the program code into memory
    		
    		// create an array to hold each command
    		var commandArray = input.split(" ");

    		// check to ensure thot the program is not larger then the max
    		if(commandArray.length <= MAX_PROGRAM_SIZE) {

        		// create the process control block
        		var thisPCB = new PCB(lastPID, processName, P_NEW, 0);
	
        		// allocate memory
    			var block = _MemoryManager.alloc(thisPCB);
    			
    			// set the memory block in the pcb
    			thisPCB.update(block);

				// add the commands to the assigned memory block
				_MemoryManager.load(thisPCB, commandArray);
				
				// just for testing
        		//thisPCB.x = "44";
				
				// set the state to loaded
        		thisPCB.state = P_LOADED;
				
				// add the new created process to the processes array
        		_Processes[lastPID] = thisPCB;
    			
        		// output the PID to the console
        		_StdIn.displayTextOnNewLine("New process created, PID : " + thisPCB.pid + " name: " + thisPCB.name);
        		
        		// increment the last pid
        		lastPID++;


    		}
    		else {
    			//alert(commandArray.length);
    			// program was to large!
    			_StdIn.displayTextOnNewLine("The program could not be loaded because it was to large!");
    		}
    		
    		// update the memory div
    		hostDivMemory();
    		//	alert(_Memory);
    	}
    	else {
    		// invalid tell the user why
    		_StdIn.displayTextOnNewLine("This is not valid input, Hex and spaces only please.");
    	}
    });
    this.commandList[this.commandList.length] = sc;
    
    // run
    sc = new ShellCommand();
    sc.command = "run";
    sc.description = "- Runs the user code idenitified by the pid given as a parameter";
    sc.function = (function(args){
    	var pid = "";
    	if (args.length > 0) {
    		// get the first argument
    		argument = status.concat(args[0]);
    		
    		// check if the first argument is numeric (process id)
    		if(argument != null && argument > -1) {
    			// process id passed
    			pid = argument;
    		}
    		else {
    			// call getPCBByProcessName() to get the pid
    			pid = getPCBByProcessName(argument);
    		}

    		// check that our pid is valid
    		if(pid != null && pid > -1) {
    			// sucess!
    			
    			// set the CPU to running
    			_CPU.isExecuting = true;
    			
    			// ask the schuduler to schedule the process
    			_Scheduler.requestRun(pid);
    			
    		}
    		else {
    			// fail!
    			_StdIn.displayTextOnNewLine("Process failed to run, no process found with givin process ID or name!");
    		}
    		
    		
            document.getElementById('currentStatus').innerHTML = status;
        }
    });
    this.commandList[this.commandList.length] = sc;
    
    
    // runall
    sc = new ShellCommand();
    sc.command = "runall";
    sc.description = "- Runs all of the user programs that are loaded in memory";
    sc.function = (function(args){
    	// loop through all available programs
    	for(i=0; i < _Processes.length; i++) {
    		// check to see if this Process is ready to run
    		if(_Processes[i].state === P_LOADED) {
    			// run this process
    			// set the CPU to running
    			_CPU.isExecuting = true;
    			
    			// ask the schuduler to schedule the process
    			_Scheduler.requestRun(_Processes[i].pid);
    		}
    	}
    });
    this.commandList[this.commandList.length] = sc;
    
    // ver
    sc = new ShellCommand();
    sc.command = "ver";
    sc.description = "- Displays the current version data.";
    sc.function = shellVer;
    this.commandList[this.commandList.length] = sc;
    
    // force red screen of death
    sc = new ShellCommand();
    sc.command = "rsod";
    sc.description = "- Fakes trapping an error so we can see the RSOD";
    sc.function = (function(){
    	krnTrapError("NOOOOOOooooooooo........"); 
    });
    this.commandList[this.commandList.length] = sc;
    
    // help
    sc = new ShellCommand();
    sc.command = "help";
    sc.description = "- This is the help command. Seek help.";
    sc.function = shellHelp;
    this.commandList[this.commandList.length] = sc;
    
    // shutdown
    sc = new ShellCommand();
    sc.command = "shutdown";
    sc.description = "- Shuts down the virtual OS but leaves the underlying hardware simulation running.";
    sc.function = shellShutdown;
    this.commandList[this.commandList.length] = sc;

    // cls
    sc = new ShellCommand();
    sc.command = "cls";
    sc.description = "- Clears the screen and resets the cursor position.";
    sc.function = shellCls;
    this.commandList[this.commandList.length] = sc;

    // man <topic>
    sc = new ShellCommand();
    sc.command = "man";
    sc.description = "<topic> - Displays the MANual page for <topic>.";
    sc.function = shellMan;
    this.commandList[this.commandList.length] = sc;
    
    // trace <on | off>
    sc = new ShellCommand();
    sc.command = "trace";
    sc.description = "<on | off> - Turns the OS trace on or off.";
    sc.function = shellTrace;
    this.commandList[this.commandList.length] = sc;

    // rot13 <string>
    sc = new ShellCommand();
    sc.command = "rot13";
    sc.description = "<string> - Does rot13 obfuscation on <string>.";
    sc.function = shellRot13;
    this.commandList[this.commandList.length] = sc;

    // prompt <string>
    sc = new ShellCommand();
    sc.command = "prompt";
    sc.description = "<string> - Sets the prompt.";
    sc.function = shellPrompt;
    this.commandList[this.commandList.length] = sc;

    // processes - list the running processes and their IDs
    // kill <id> - kills the specified process id.

    //
    // Display the initial prompt.
    this.putPrompt();
    
    // display the current date and time in the task bar
    //var currentDate = new Date();
	//document.getElementById('currentTime').innerHTML = currentDate;
}

function shellPutPrompt()
{
    _StdIn.displayText(this.promptStr);
}

function shellHandleInput(buffer)
{
    krnTrace("Shell Command~" + buffer);
    // 
    // Parse the input...
    //
    var userCommand = new UserCommand();
    userCommand = shellParseInput(buffer);
    
    // ... and assign the command and args to local variables.
    var cmd = userCommand.command;
    var args = userCommand.args;
    //
    // Determine the command and execute it.
    //
    // JavaScript may not support associative arrays in all browsers so we have to
    // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
    var index = 0;
    var found = false;
    while (!found && index < this.commandList.length)
    {
        if (this.commandList[index].command === cmd)
        {
            found = true;
            var fn = this.commandList[index].function;
        }
        else
        {
            ++index;
        }
    }
    if (found)
    {
        this.execute(fn, args);
    }
    else
    {
        // It's not found, so check for curses and apologies before declaring the command invalid.
        if (this.curses.indexOf("[" + rot13(cmd) + "]") >= 0)      // Check for curses.
        {
            this.execute(shellCurse);
        }
        else if (this.apologies.indexOf("[" + cmd + "]") >= 0)      // Check for apologies.
        {
            this.execute(shellApology);
        }
        else    // It's just a bad command.
        {
            this.execute(shellInvalidCommand);
        }
    }
}

function shellParseInput(buffer)
{
    var retVal = new UserCommand();

    // 1. Remove leading and trailing spaces.
    buffer = trim(buffer);

    // 2. Lower-case it.
    buffer = buffer.toLowerCase();

    // 3. Separate on spaces so we can determine the command and command-line args, if any.
    var tempList = buffer.split(" ");

    // 4. Take the first (zeroth) element and use that as the command.
    var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
    // 4.1 Remove any left-over spaces.
    cmd = trim(cmd);
    // 4.2 Record it in the return value.
    retVal.command = cmd;

    // 5. Now create the args array from what's left.
    for (var i in tempList)
    {
        var arg = trim(tempList[i]);
        if (arg != "")
        {
            retVal.args[retVal.args.length] = tempList[i];
        }
    }
    return retVal;
}

function shellExecute(fn, args)
{
    // We just got a command, so advance the line...
    _StdIn.advanceLine();
    // ... call the command function passing in the args...
    fn(args);
    // Check to see if we need to advance the line again
    if (_StdIn.CurrentXPosition > 0)
    {
        _StdIn.advanceLine();
    }
    // ... and finally write the prompt again.
    this.putPrompt();
}


//
// The rest of these functions ARE NOT part of the Shell "class" (prototype, more accurately), 
// as they are not denoted in the constructor.  The idea is that you cannot execute them from
// elsewhere as shell.xxx .  In a better world, and a more perfect JavaScript, we'd be
// able to make then private.  (Actually, we can. have a look at Crockford's stuff and Resig's JavaScript Ninja cook.)
//

//
// An "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function ShellCommand()     
{
    // Properties
    this.command = "";
    this.description = "";
    this.function = "";
}

//
// Another "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function UserCommand()
{
    // Properties
    this.command = "";
    this.args = [];
}


//
// Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
//
function shellInvalidCommand()
{
    _StdIn.displayTextOnNewLine("Invalid Command. ");
    if (_SarcasticMode)
    {
        _StdIn.displayTextOnNewLine("Duh. Go back to your Speak & Spell.");
    }
    else
    {
        _StdIn.displayTextOnNewLine("Type 'help' for, well... help.");
    }
}

function shellCurse()
{
    _StdIn.displayTextOnNewLine("Oh, so that's how it's going to be, eh? Fine.");
    _StdIn.advanceLine();
    _StdIn.displayTextOnNewLine("Bitch.");
    _SarcasticMode = true;
}

function shellApology()
{
   if (_SarcasticMode) {
      _StdIn.displayTextOnNewLine("Okay. I forgive you. This time.");
      _SarcasticMode = false;
   } else {
      _StdIn.displayTextOnNewLine("For what?");
   }
}

function shellVer(args)
{
    _StdIn.displayTextOnNewLine(APP_NAME + " version " + APP_VERSION);    
}

function shellHelp(args)
{
    _StdIn.displayTextOnNewLine("Commands:");
    for (var i in _OsShell.commandList)
    {
        _StdIn.advanceLine();
        _StdIn.displayTextOnNewLine("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
    }    
}

function shellShutdown(args)
{
     _StdIn.displayTextOnNewLine("Shutting down...");
     // Call Kernel shutdown routine.
    krnShutdown();   
    // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
}

function shellCls(args)
{
    _StdIn.clearScreen();
    _StdIn.resetXY();
}

function shellMan(args)
{
    if (args.length > 0)
    {
        var topic = args[0];
        switch (topic)
        {
            case "help": 
                _StdIn.displayTextOnNewLine("Help displays a list of (hopefully) valid commands.");
                break;
            default:
                _StdIn.displayTextOnNewLine("No manual entry for " + args[0] + ".");
        }        
    }
    else
    {
        _StdIn.displayTextOnNewLine("Usage: man <topic>  Please supply a topic.");
    }
}

function shellTrace(args)
{
    if (args.length > 0)
    {
        var setting = args[0];
        switch (setting)
        {
            case "on": 
                if (_Trace && _SarcasticMode)
                {
                    _StdIn.displayTextOnNewLine("Trace is already on, dumbass.");
                }
                else
                {
                    _Trace = true;
                    _StdIn.displayTextOnNewLine("Trace ON");
                }
                
                break;
            case "off": 
                _Trace = false;
                _StdIn.displayTextOnNewLine("Trace OFF");                
                break;                
            default:
                _StdIn.displayTextOnNewLine("Invalid arguement.  Usage: trace <on | off>.");
        }        
    }
    else
    {
        _StdIn.displayTextOnNewLine("Usage: trace <on | off>");
    }
}

function shellRot13(args)
{
    if (args.length > 0)
    {
        _StdIn.displayTextOnNewLine(args[0] + " = '" + rot13(args[0]) +"'");     // Requires Utils.js for rot13() function.
    }
    else
    {
        _StdIn.displayTextOnNewLine("Usage: rot13 <string>  Please supply a string.");
    }
}

function shellPrompt(args)
{
    if (args.length > 0)
    {
        _OsShell.promptStr = args[0];
    }
    else
    {
        _StdIn.displayTextOnNewLine("Usage: prompt <string>  Please supply a string.");
    }
}
