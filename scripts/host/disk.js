/**
 * Disk Drive
 * @author brian.gormanly
 * 
 * Controls all simulated hardware access for disk drive
 * 
 */

// actual data representation of the disk
var _Disk = null;

function Disk() {
	
	// store the disk array

	this.init = function() {
    	// check to see if the browser supports html5 local storage
		if(this.supports_html5_storage() != false) {
			// check to see if we need to format the drive
			
			
			
			
			
		}
		else {
			alert('html localstorage is not supported!');
		}
		
			
		
    };

    
    this.supports_html5_storage = function() {
    	try {
    		return 'localStorage' in window && window['localStorage'] !== null;
    	} 
    	catch (e) {
    		return false;
    	}
    };
    
    
    
    

}







