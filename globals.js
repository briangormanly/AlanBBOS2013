/* ------------  
   Globals.js

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS
//
var APP_NAME = "BriOS"; 	 // 'cause I was at a loss for a better name.
var APP_VERSION = "42.01";   // What did you expect?

var CPU_CLOCK_INTERVAL = 100;   // This is in ms, or milliseconds, so 1000 = 1 second.

var TIMER_IRQ = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                    // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;  

var TOTAL_MEMORY = 768;		// total memory size in bytes.
var MAX_PROGRAM_SIZE = 256;	// largest size available in memory to load a program

// States of the PCB
var P_NEW = 3; // Process newly created
var P_LOADED = 2; // Process loaded in memory
var P_READY	= 1; // Process added to ready queue awaiting execution
var P_RUNNING = 0; // Process currently executing
var P_TERMINATED = 4; // Process finished executing

// scheduler
var ROUND_ROBIN = 0; // Round Robin Scheduleing 
var FIFO = 1; // First in, first out scheduling

var SCHEDULER = ROUND_ROBIN; // default to  ...
var quanta = 6; // default the quanta to 6

var lastPID = 0;




//
// Global Variables
//
var _CPU = null;

var _Memory = null;

var _Scheduler = null;

var _MemoryManager = null;

var _OSclock = 0;       // Page 23.

var _Mode = 0;   // 0 = Kernel Mode, 1 = User Mode.  See page 21.

// pid coutner
var lastPID = 0;



var _Canvas = null;               // Initialized in hostInit().
var _DrawingContext = null;       // Initialized in hostInit().
var _DefaultFontFamily = "sans";  // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;        // Additional space added to font size when advancing a line.

// Default the OS trace to be on.
var _Trace = true;

// OS queues
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn  = null;
var _StdOut = null;

// UI
var _Console = null;
var _OsShell = null;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;

// Global Device Driver Objects - page 12
var krnKeyboardDriver = null;

// For testing...
var _GLaDOS = null;

// keep track of the current time
var currentTime = "";
