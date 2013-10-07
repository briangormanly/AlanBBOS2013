/* ------------
   Console.js

   Requires globals.js

   The OS Console - stdIn and stdOut by default.
   Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
   ------------ */

function OLD_CLIconsole() {
    // Properties
    this.CurrentFont      = _DefaultFontFamily;
    this.CurrentFontSize  = _DefaultFontSize;
    this.CurrentXPosition = 0;
    this.CurrentYPosition = _DefaultFontSize;
    this.buffer = "";
    this.commandBuffer = "";
    
    // Methods
    this.init = function() {
       this.clearScreen();
       this.resetXY();
    };

    this.clearScreen = function() {
       _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
    };

    this.resetXY = function() {
       this.CurrentXPosition = 0;
       this.CurrentYPosition = this.CurrentFontSize;
    };

    this.handleInput = function() {
       while (_KernelInputQueue.getSize() > 0)
       {
           // Get the next character from the kernel input queue.
           var chr = _KernelInputQueue.dequeue();
           
           //alert(chr);
           // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
           if (chr == String.fromCharCode(13))  //     Enter key
           {
               // The enter key marks the end of a console command, so ...
               // ... tell the shell ...
               _OsShell.handleInput(this.commandBuffer);
               // ... and reset our buffer.
               this.buffer = "";
           }
           // TODO: Write a case for Ctrl-C.
           
           else if (chr == String.fromCharCode(8)) {
        	   // delete key
        	   this.removeText();
           }
           else
           {
        	   
        	   // ... and add it to our buffer.
               this.buffer += chr;
               this.commandBuffer +=chr;
               
               // This is a "normal" character, so ...
               // ... draw it on the screen...
               this.putText(chr);
               
           }
           
           krnTrace("Buffer: " + this.buffer + " Buffer size: " + this.buffer.length);
       }
    };

    
    this.putText = function(text) {
        // My first inclination here was to write two functions: putChar() and putString().
        // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
        // between the two.  So rather than be like PHP and write two (or more) functions that
        // do the same thing, thereby encouraging confusion and decreasing readability, I
        // decided to write one function and use the term "text" to connote string or char.
        if (text !== "")
        {
            // Draw the text at the current X and Y coordinates.
            _DrawingContext.drawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, this.CurrentYPosition, text);
         	// Move the current X position.
            var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, text);
            this.CurrentXPosition = this.CurrentXPosition + offset;
        }
     };
    
    this.removeText = function() {
        // My first inclination here was to write two functions: putChar() and putString().
        // Then I remembered thatthis.resetXY JavaScript is (sadly) untyped and it won't differentiate
        // between the two.  So rather than be like PHP and write two (or more) functions that
        // do the same thing, thereby encouraging confusion and decreasing readability, I
        // decided to write one function and use the term "text" to connote string or char.
        if (this.CurrentXPosition > 0)
        {
        	
        	
        	
        	//var thischar = this.buffer.substring((this.buffer.length -1), (this.buffer.length));
        	//var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, thischar);
        	//this.CurrentXPosition = this.CurrentXPosition - offset;
        	//_DrawingContext.font = this.CurrentFont;
        	//_DrawingContext.size = this.CurrentFontSize;
        	
        	//_DrawingContext.fillStyle = '#ffffff'; // or whatever color the background is.
        	//_DrawingContext.fillText(thischar, this.CurrentXPosition, this.CurrentYPosition);
        	
        	//_DrawingContext.drawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, this.CurrentYPosition, text);

        	// remove the character from the buffer
        	if(this.buffer.length > 0) {
        		this.buffer = this.buffer.substring(0, (this.buffer.length - 1));
        	}
        	
        	// redraw
        	this.refreshCanvasText();
        }
     };
     
     this.refreshCanvasText = function() {
    	 this.clearScreen();
    	 this.resetXY();
    	 
    	 for(var i = 0; i < this.buffer.length; i++) {
    		 // Move the current X position.
             var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, this.buffer[i]);
             
    		 // Draw the text at the current X and Y coordinates.
             _DrawingContext.drawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, this.CurrentYPosition, this.buffer[i]);
             
             this.CurrentXPosition = this.CurrentXPosition + offset;
    	 }
     };

    this.advanceLine = function() {
       this.CurrentXPosition = 0;
       this.CurrentYPosition += _DefaultFontSize + _FontHeightMargin;
       // TODO: Handle scrolling.
    };
}
