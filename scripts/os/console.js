/* ------------
   Console.js

   Requires globals.js

   The OS Console - stdIn and stdOut by default.
   Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
   ------------ */

function CLIconsole() {
    // Properties
    this.CurrentFont      = _DefaultFontFamily;
    this.CurrentFontSize  = _DefaultFontSize;
    this.CurrentXPosition = 0;
    this.CurrentYPosition = _DefaultFontSize;
    
    // scrolling offset;
    this.yOffset = 0;
    
    // manual scrolling offset
    this.manualScroll = 0;
    
    // Create a total buffer to hold all console content, both
    // rendered by output and typed by the user
    // each element of the buffer will be a line
    this.buffer = new Array();
    
    // create a buffer to contain all of the information on the 
    // current line both output and typed by the user
    this.lineBuffer = new Array();
    
    // create a line buffer to contain typed content on the current line
    this.commandBuffer = "";
    
    // manage command history
    this.commandHistory = new Array();
    
    // keep track of where in history we are
    this.commandHistoryCounter = 0;

    
    // Methods
    this.init = function() {
       this.clearScreen();
       this.resetXY();
    };

    /**
     * Clear all content from the canvas
     */
    this.clearScreen = function() {
       _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
    };

    /**
     * Reset the position on the canvas
     * x to 0
     * y to the hieght of the font in use.
     */
    this.resetXY = function() {
       this.CurrentXPosition = 0;
       this.CurrentYPosition = this.CurrentFontSize;
    };

    /**
     * Handle input to the console
     */
    this.handleInput = function() {
       while (_KernelInputQueue.getSize() > 0)
       {
           // Get the next character from the kernel input queue.
           var chr = _KernelInputQueue.dequeue();
           
           // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
           if (chr == String.fromCharCode(13))  //     Enter key
           {
        	   // set the manual scroll to 0
        	   this.manualScroll = 0;
        	   
        	   // store the line 
               this.addLine();
               
               // advance to the new line
               this.advanceLine();
               
               // The enter key marks the end of a console command, so ...
               // ... tell the shell ...
               _OsShell.handleInput(this.commandBuffer);
               
               // add the command to command history
               this.commandHistory[this.commandHistory.length] = this.commandBuffer;
               
               // set the command history conuter
               this.commandHistoryCounter++;
               
               // and reset our command buffer.
               this.commandBuffer = "";
               
               
           }
           // TODO: Write a case for Ctrl-C.
           
           else if (chr == String.fromCharCode(8)) {
        	   // delete key
        	   this.removeText();
           }
           
           // left arrow (history)
           else if (chr == String.fromCharCode(37)) {
        	   // go back through the command history
        	   var currCommand = this.commandHistory.length;
        	   if(this.commandHistoryCounter > 0) {
        		   // decrement the history counter
        		   this.commandHistoryCounter--;
        		   
        		   // clear the command line
        		   this.clearCurrentLine();
        		   
        		   // display the previous command
        		   this.displayInput(this.commandHistory[this.commandHistoryCounter]);
        	   }
           }
           
           // right arrow (history)
           else if (chr == String.fromCharCode(39)) {
        	   // go forward through the command history
        	   var currCommand = this.commandHistory.length;
        	   if(this.commandHistoryCounter < this.commandHistory.length) {
        		   // decrement the history counter
        		   this.commandHistoryCounter++;
        		   
        		   // clear the command line
        		   this.clearCurrentLine();
        		   
        		   // check for undefined (new)
        		   if(this.commandHistory[this.commandHistoryCounter] != null) {
        			   // display the previous command
            		   this.displayInput(this.commandHistory[this.commandHistoryCounter]);
        		   }
        	   }
        	   
           }
           
           // up arrow (scrolling)
           else if (chr == String.fromCharCode(38)) {
        	   // up arrow lets user manually scroll through console history
        	   this.manualScroll += (_DefaultFontSize + _FontHeightMargin);       	   
        	   this.refreshCanvasText();
           } 
           
           // down arrow (scrolling)
           else if (chr == String.fromCharCode(40)) {
        	   // down arrow lets user manually scroll through console history
        	   this.manualScroll -= (_DefaultFontSize + _FontHeightMargin);
        	   this.refreshCanvasText();
           }
           else
           {
        	   
        	   // set the manual scroll to 0
        	   this.manualScroll = 0;
               this.displayInput(chr);
               
           }
           
           krnTrace("Buffer: " + this.buffer + " Buffer size: " + this.buffer.length);
       }
    };
    
    // force text to be displayed on a new console line
    this.displayTextOnNewLine = function(text) {
    	this.advanceLine();
    	this.displayText(text);
    	this.addLine();
    	this.advanceLine();
    };
    
    
    /**
     * Display a character to the console, origin of character
     * (output, input) is not important. 
     * 
     * The method should not be called directly for user input,
     * but can be called directly for output.  User input will
     * call handleInput which will add to the commandBuffer and 
     * then call this method to handle line and console buffers.
     */
    this.displayText = function(text) {
    	
    	
    	// check that there is text
    	if(text !== "") {
    		
    		// check is the text is overflowing the line
    		if(this.CurrentXPosition > (_Canvas.width - 15)) {
    			// add the line buffer to the main buffer
    			this.addLine();
    			
    			// advance the console interface to the next line.
    			this.advanceLine();
    		}
    		
    		// add the text to the line buffer
    		this.lineBuffer += text;
    	}
    	
    	// refresh the console
    	this.refreshCanvasText();
    	
    };
    
    
    /**
     * Display an input character to the console.
     * 
     */
    this.displayInput = function(text) {
    	// check that there is text
    	if(text !== "") {
    		
    		// add the text to the line buffer
    		this.commandBuffer += text;
    		
    		// call display text to add to the line buffer
    		this.displayText(text);
    		
    	}
    };
    
    /**
     * Handles backspace
     */
    this.removeText = function() {
    	// check to see if there is anything in the command buffer to remove
    	if(this.commandBuffer.length > 0) {
    		// remove the last char from the command buffer
    		this.commandBuffer = this.commandBuffer.substring(0, (this.commandBuffer.length - 1));
    		
    		// also remove the char from the line buffer
    		this.lineBuffer = this.lineBuffer.substring(0, (this.lineBuffer.length - 1));
    	}
    	
    	// redraw
    	this.refreshCanvasText();
    };
    
    /**
     * Handles clearing the current command line
     */
    this.clearCurrentLine = function() {
    	// remove the current command text from the line buffer
    	while(this.commandBuffer.length > 0) {
    		this.removeText();
    	}
    	
    	// remove the command from the command buffer
    	this.commandBuffer = "";
    }
    
    
    /**
     * Advance the line on the console to the next line.
     */
    this.advanceLine = function() {
    	
        this.CurrentXPosition = 0;
        this.CurrentYPosition += _DefaultFontSize + _FontHeightMargin;
     };
     
     
     /**
      * Adds the currentLine buffer to the main buffer and
      * then readies the currentLine buffer for the next line.
      */
     this.addLine = function() {
    	 //alert("before line buf:" + this.lineBuffer);
    	 //alert("before main buf len:" + this.buffer.length);
    	 this.buffer[this.buffer.length] = this.lineBuffer;
    	 
    	 //alert("after main buf len:" + this.buffer.length);
    	 for(var i=0; i < this.buffer.length; i++) {
    		// alert("buf line " + i + " is " + this.buffer[i]);
    	 }
    	 this.lineBuffer = "";
     }
     
     
     /**
      * Manages the redrawing of the console whenever the console is
      * refreshed.
      */
     this.refreshCanvasText = function() {
    	 
    	 // start by clearing the screen
    	 this.clearScreen();
 
    	 // then reset the position to the origin
    	 this.resetXY();
    	 
    	 // get the y location of the last line
    	 var thisY = (_DefaultFontSize + _FontHeightMargin) * (this.buffer.length + 1);
    	 
    	 // set the initial offset to 0
    	 this.yOffset = 0;
    	 
    	 
    	 // test to see if there is an offest needed
    	 if(thisY > _Canvas.height) {
    		 this.yOffset = thisY - _Canvas.height;
    	 }
    	 
    	 
    	 // loop through all the lines that are stored in the buffer
    	 for(var i = 0; i < this.buffer.length; i++) {
    		 // get each line from the buffer
    		 var thisLine = this.buffer[i];
   			
    		 this.displayLine(thisLine);
   		 
    		 // advance to the next line if there are more lines in the buffer
    		 if(this.buffer.length > i) {
    			 this.advanceLine();
    		 }
   		 
   		}
   		
   		// display the current line
   		this.displayLine(this.lineBuffer);

    	 
     };
    
     /**
      * Display a line out of the buffer to the console
      */
     this.displayLine = function(line) {
    	 if(line != null) {
    		 for(var j=0; j< line.length; j++) {
    			 // output the buffer line to the screen
    			 
    			 // Move the current X position.
                 var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, line[j]);
                 
        		 // Draw the text at the current X and Y coordinates.
                 if((this.CurrentYPosition - this.yOffset + this.manualScroll) > 0) {
                	 _DrawingContext.drawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, (this.CurrentYPosition - this.yOffset + this.manualScroll), line[j]);
                 }
                 this.CurrentXPosition = this.CurrentXPosition + offset;
    		 }
		 }
     };
    
     
     /**
      * OS Error trap
      */
     this.ROSD = function(msg) {
    	 
    	 document.getElementById("display").style.background ='#FF1111';
    	 
    	 // clear the buffers
    	 this.buffer = "";
    	 this.lineBuffer = msg;
    	 this.commandBuffer = "";
    	 
    	 this.refreshCanvasText();
    	 
     };
    
}
