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
    
    /**
     * Write data to the disk
     */
    this.write = function(tsbString, block) {
    	localStorage.setItem(tsbString, block);
    }
    
    /**
     * Read data from disk
     * @return block of data
     */
    this.read = function(tsbString) {
    	return localStorage.getItem(tsbString);
    }
    
    

}







