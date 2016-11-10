// Global pointers to data objects
//var audPlayAppSet = audioPlayerJSON.settings;
var audPlayJSON = activity.elements.audio;

/*
var audioObject = {};
audioObject.currentFile = "";
audioObject.myAudioTag = "";
audioObject.myDemoPlay = "";
*/

/*
<input type="range" name="seek-bar" class="seekBar" value="0" onChange="rangevalue.value=value">
<output id="rangevalue">0</output>
*/

/*
var myquery = document.querySelector('[type="range"]');
var myqueryAll = document.querySelectorAll('[type="range"]');
alert(myquery.name)
*/
	
//alert("assignButtons: "+callbackPLContTag.children[1].localName);
//alert("assignButtons: "+callbackPLContTag.children[1].nodeName);
//alert("assignButtons: "+callbackPLContTag.children[1].name);
		
/* Checking JSON/Object Functions
function checkEmptyTrue(valueToTest) {		
	var checkMe = false;
	if (valueToTest === "" || valueToTest === undefined || valueToTest === true || valueToTest === "true"){
		checkMe = true;
	}	
	return checkMe;
}

function checkEmptyFalse(valueToTest) {		
	var checkMe = false;
	if (valueToTest === "" || valueToTest === undefined || valueToTest === false || valueToTest === "false"){
		checkMe = true;
	}
	return checkMe;
}
*/

// Is Merging Object Contents
Object.deepExtend = function(destination, source) {
  for (var property in source) {
    if (source[property] && source[property].constructor &&
     source[property].constructor === Object) {
      destination[property] = destination[property] || {};
      arguments.callee(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
};


var myDOMInstance = (function(){
	
	/*****************************************************
					MODULE RETURNS
	******************************************************/
	
    var myDOM = function(elems){
            return new MyDOMConstruct(elems);
        },
        MyDOMConstruct = function(elems) {
            this.collection = elems[1] ? Array.prototype.slice.call(elems) : [elems];
            return this;
        };
	
	/*****************************************************
			PRIVATE FUNCTIONS - buttons HANDLING
	******************************************************/
	// AUDIOSCRIPT
	function toggle(elem) {
		//elem.style.display = (elem.style.display != 'none' ? 'none' : '' );
		// AUDIO SCRIPT
		$("#audioScriptID").html('<'+'object id="audioScriptObj" name="audioScriptObj" type="text/html" data="./audio/audioScr.html" width="780" height="800"><\/object>')
	}
	
	/* AUDIOSCRIPT
	function tapescriptShow(theSender){

		if (getDataAttribute(document.getElementById("tapescr"), "openscr") == 'true'){
			//alert('true -> false')
			setDataAttribute(document.getElementById("tapescr"), "openscr", false)
			$("#audioScriptID").hide("fast");
		} else {
			//alert('false -> True')
			setDataAttribute(document.getElementById("tapescr"), "openscr", true)
			$("#audioScriptID").show("fast");
		}
	}
	
	*/
	
	
	function addListeners(){
		
	
	}
	
	function mouseUp()
	{
		console.log("mouseUp")
		window.removeEventListener('mousemove', divMove, true);
	}
	
	function mouseDown(e){
		console.log("mouseDown")
	  window.addEventListener('mousemove', divMove, true);
	}
	
	function divMove(e){
		console.log("MOVE")
		var div = document.getElementsByClassName("audioScriptCL")[0];
	  div.style.position = 'absolute';
	  div.style.top = e.clientY + 'px';
	  div.style.left = e.clientX + 'px';
	}
	
	var counter = 1;
	
	function loadAudioScript(){
	
		if ((audPlayJSON.audioScript.indexOf('.html')==-1)&&(audPlayJSON.audioScript.indexOf('.htm')==-1)){
			newDiv = document.createElement("DIV");
			newDiv.innerHTML = audPlayJSON.audioScript;
		}
		else{
			newDiv = document.createElement("OBJECT");
			newDiv.id = "audioscript_obj";
			newDiv.name = "audioscript_obj";
			newDiv.type = "text/html";
			newDiv.data = audPlayJSON.audioScript;		 
		}	
		//newDiv.className = "audioScriptCL";
		
		try{
			document.getElementById("showAudioScr"+counter).appendChild(newDiv);
			counter++;
			//$("#'showAudioScr'+counter").draggable();
			/*
			document.getElementsByClassName("audioScriptCL")[0].addEventListener('mousedown', mouseDown, false);
			window.addEventListener('mouseup', mouseUp, false);
			*/
		}
		catch(n){
			console.log("Drag Error: "+n)
		}
	}
	
	// Enabling/Disabling Function for Player Buttons
	var enableDisableButFunc = {
		
		// Temp Arrays to keep ALL Player Instances and ALL of their elements.
		tempArray: [],
		tempElemArray: [],
		elemArray: [],
		
		// Called when creating the DOM to keep the elements into the arrays.
		setAudioButtons: function(playerCont,audiopl,audiorew,audiofor,audioseekb,seekout,audioscr) { 
			
			// Reset the Temp Arrays
			this.tempArray = [],this.tempElemArray = [];
			
			for (var i=0, len=arguments.length; i<len; i++){
				// Insert Player instance
				if (i == 0) {
					this.tempArray.push(arguments[i]);						
				// Insert Player instance Elements
				} else if(arguments[i] !== undefined){					
					this.tempElemArray.push(arguments[i]);					
				}
			}
			// Create the final temp Arrays
			this.tempArray.push(this.tempElemArray);
			this.elemArray.push(this.tempArray);					
		},
		
		// Disables all elements
		disableAudioButtons: function(playerCont,audiopl,audiorew,audiofor,audioseekb,seekout,audioscr) { 
			//alert("disableAudioButtons: "+audiopl+" "+audiorew+" "+audiofor+" "+audioseekb+" "+seekout+" "+audioscr);
			
			//BASIC FUNC
			if(audiopl){
				audiopl.disabled = true;
				//setDataAttribute(audiopl, "paused", false);
			}		
			if(audiorew){
				audiorew.disabled = true;
			}
			if(audiofor){
				audiofor.disabled = true;
			}	
			//SEEK BAR
			if(audioseekb){
				audioseekb.disabled = true;
				audioseekb.value = 0;	
			}
			if(seekout){
				seekout.value = 0;	
			}	
			//AUDIO SCRIPT
			if(audioscr){
				//setDataAttribute(audioscr, "openscr", false);
				audioscr.disabled = true;
				//$("#audioScriptID").hide("fast");
				toggle(audioscr);
				loadAudioScript();
			}			
		},
		
		// Set the elements ready for play
		setForPlay: function(audiotag) { 
			
			// Loop through all Player Instances 
			for (var i=0, len=this.elemArray.length; i<len; i++){
				// Define Current Player Instance
				var curPlContElem = this.elemArray[i][0];
				// Check if Current Player Instance is the Active one
				if(audiotag.parentNode === curPlContElem){
					// Loop through Current Player Instance Elements
					for (var j=0, lenJ=this.elemArray[i][1].length; j<lenJ; j++){				
						
						// Define Current Element and its name
						var curElem = this.elemArray[i][1][j]
						var curElemName = this.elemArray[i][1][j].name
						// Activate/Disactive Current Element
						switch (curElemName) {
							case "audiopl":
							case "audioseekb":
							case "audioScr":
								curElem.disabled = false;
								break;
							case "audiorew":
							case "audiofor":
								curElem.disabled = true;
								break;
							default :	
								break;
						} //End switch
					} //End For
					
				} else {
					//console.log("setForPlay NO MATCH > audiotag.id: "+audiotag.parentNode.id+" curPlContElem: "+curPlContElem.id);
				}//End IF
				
			} //End For			
			
		},
		
		// Set the elements while playing (i.e. click pause)
		setWhilePlaying: function(audiotag) { 
			// Loop through all Player Instances 
			for (var i=0, len=this.elemArray.length; i<len; i++){
				// Define Current Player Instance
				var curPlContElem = this.elemArray[i][0];
				
				// Check if Current Player Instance is the Active one				
				if(audiotag.parentNode === curPlContElem){
					// Loop through Current Player Instance Elements
					for (var j=0, lenJ=this.elemArray[i][1].length; j<lenJ; j++){				
						
						// Define Current Element and its name
						var curElem = this.elemArray[i][1][j]
						var curElemName = this.elemArray[i][1][j].name
						// Activate/Disactive Current Element
						switch (curElemName) {
							case "audioseekb":
							case "audiorew":
							case "audiofor":
								curElem.disabled = false;
								break;
							default :	
								break;
						} //End switch
					} //End For
					
				} else {
					//console.log("setWhilePlaying NO MATCH > audiotag.id: "+audiotag.parentNode.id+" curPlContElem: "+curPlContElem.id);
				}//End IF
				
			} //End For	
		}			
	};
	
	/*****************************************************
			PRIVATE FUNCTIONS - SEEK BAR EVENTS
	******************************************************/
	
	// UPDATE the SEEK bar as the audio plays
	function seekBarUpdate(audiotag,seekbutton,currentOut) {

		try {
			// Calculate the slider value
			var value = (100 / audiotag.duration) * audiotag.currentTime;
			
			// Update the slider value
			seekbutton.value = value;
			
			// Update the range value
			currentOut.value = Math.round(value);
			
		} catch (err) {
			// Fail silently but show in F12 developer tools console
			if(window.console && console.error("NO SEEK BAR AVAILABLE-Update ERROR: "+err));
		}	
	}
	
	// SEEK BAR HANDLING
	function assignSeekBarEvents(audiotag, seekbutton, currentOut){
		
		try {
			// Update the seek bar as the audio plays
			audiotag.addEventListener("timeupdate", function() {
				seekBarUpdate(audiotag, seekbutton, currentOut);
			});		
			
			// Event listener for the seek bar
			seekbutton.addEventListener("change", function() {
				// Check for audio element support.
				if (window.HTMLAudioElement) {
					try {
						var time = audiotag.duration * (seekbutton.value / 100);
						audiotag.currentTime = time;
					}
					catch (e) {
						// Fail silently but show in F12 developer tools console
						if(window.console && console.error("SEEK BUTTON change ERROR:" + e));
					}
				}
			});	
			
			// Pause the audio when the slider handle is being dragged
			seekbutton.addEventListener("mousedown", function() {
				audiotag.removeEventListener("timeupdate", seekBarUpdate);
				audiotag.pause();
			});
			
			// Play the audio when the slider handle is dropped
			seekbutton.addEventListener("mouseup", function() {
				audiotag.addEventListener("timeupdate", seekBarUpdate(audiotag, seekbutton, currentOut));
				audiotag.play();
			});
			
		} catch (err) {
			// Fail silently but show in F12 developer tools console
			if(window.console && console.error("NO SEEK BAR AVAILABLE-Assign Error: "+err));
		}
	}
	
	/*****************************************************
			PRIVATE FUNCTIONS - Buttons EVENTS
	******************************************************/
	
	// ASSIGN global PLAYER listener
	function delegateButtonClicks(theTargetName, audiotag){
		switch (theTargetName) {
			case "audiopl": 
			case "audiorew":
			case "audiofor":
				handleAudio(theTargetName, audiotag);
				//console.log("Click BUTTS");
				break;
			case "audioScr":
				toggle(theTargetName);
				//console.log("Click audioScr");
				break;
			case "audioseekb":
				//console.log("Click audioseekb");
				break;
			default :	
				console.log("Click NULL");
				break;
		}
	}
	
	// get ELEMENTS CROSS-BROWSER DATA
	function crossBrowserSourceNaming(e, theNodeType){
		var elem, evt = e ? e:event,
		fResult = {condtn:false,theTargetName:"",theTargetType:""};
		
		if (evt.srcElement)  elem = evt.srcElement;//chrome property
		else if (evt.target) elem = evt.target;//firefox
		
		try {
			fResult.theTargetType = elem.type.toLowerCase();
			fResult.theTargetName = elem.name;
			
			for (var i = 0, l = theNodeType.length; i < l; i++) {				
				if (fResult.theTargetType === theNodeType[i]) {
					fResult.condtn = true;
					break;
					//allow bubbling
				} else {
					evt.preventDefault();
				}
			}
				
		} catch (err) {
			//some error handling - usually the click was on the select and it has no name?
		}		
		return fResult;
	}
	
	// Assign Player Containers Button Event
	function assignButtons(callbackPLContTag, audiotag){
		
		callbackPLContTag.addEventListener("click", function(e){
			var locObj = crossBrowserSourceNaming(e,["button","range"]);
			if (locObj.condtn) {
				delegateButtonClicks(locObj.theTargetName, audiotag);
			} else {
				//nothing
			}
		});	
	
		return true;
	}
	
	/*****************************************************
			PRIVATE FUNCTIONS - PLAYING Functionality
	******************************************************/
	function handleAudio(audioBut, audiotag) {
		// Check for audio element support.
		if (window.HTMLAudioElement) {
			try {
				
				if (audioBut == "audiopl") {					
					if (audiotag.paused) {
						audiotag.play();
						enableDisableButFunc.setWhilePlaying(audiotag);
					} else {
						audiotag.pause();
						enableDisableButFunc.setForPlay(audiotag);
					}					
				} else if (audioBut == "audiorew") {
					audiotag.currentTime -= 30.0;					
				} else if (audioBut == "audiofor") {
					audiotag.currentTime += 30.0;				
				}			
		
			} catch (e) {
				// Fail silently but show in F12 developer tools console
				 if(window.console && console.error("handleAudio Error:" + e +" : "+audioBut));
			}
		}
	
	}
	
	/*****************************************************
			PRIVATE FUNCTIONS - AUDIO LOADING EVENTS
	******************************************************/
	
	// CHECK if an AUDIO file EXISTS and is LOADED
	function audioIsReady(audiotag, callback){
		
		var canI;		
		
		try {			
			//Shortcut which doesn't work in Chrome (always returns ""); pass through
			// if "maybe" to do asynchronous check by loading MP3 data: URI
			if(audiotag.canPlayType('audio/mpeg') == "probably"){
				callback(true);	
				canI = true;
			}
			
			var handler = function(e){
				callback(true);	
				canI = true;
				
				this.removeEventListener('canplaythrough',handler,false);
				this.removeEventListener('loadedmetadata',handler,false);
			};  
			
			//If this event fires, audio can be played
			audiotag.addEventListener('canplaythrough',handler,false);
			
			// Event driven to be compatible with WebKit
			audiotag.addEventListener('loadedmetadata',handler,false);
			
			//If this is fired, then client can't play audio
			audiotag.addEventListener('error', function(e){
				callback(this.error); 
				canI = this.error;
			}, false);

		}
		catch(e){
			callback(e);
			canI = e;
		}
		
		return canI;
	}
	
	// Check if Audio is LOADED and its status to set buttons
	function prepareAudioButs(audiotag){
		
		// If audioIsReady returns true set audio control buttons
		var audioIsLoaded = audioIsReady(audiotag, function(boolean){
			
			if (boolean) {
				if (audiotag.paused) {
					enableDisableButFunc.setForPlay(audiotag);
				} else {
					enableDisableButFunc.setWhilePlaying(audiotag);  
				}
			}
		});
	}
	
	/*****************************************************
			PRIVATE FUNCTIONS - Audio Files + Path
	******************************************************/
	
	// Find Audio PATH
	function findAudioPath(appJSONSet) {
				
		// Define Default Folder name
		var folderName;
		if (appJSONSet.defaultFolderName === "" || appJSONSet.defaultFolderName === undefined){
			folderName = "audio";			
		} else {
			folderName = appJSONSet.defaultFolderName;
		}
		
		// Define Audio PATH
		var defaultPath;
		
		if (appJSONSet.defaultPath === "" || appJSONSet.defaultPath === undefined){
			defaultPath = folderName + "/";	
			
		} else if(appJSONSet.defaultPath == "local"){
			if (appJSONSet.localPathHtmlName === "" || appJSONSet.localPathHtmlName === undefined || window.location.href.search(appJSONSet.localPathHtmlName) === -1){
				//defaultPath = window.location.href.slice(0, -(window.location.href.length - window.location.href.indexOf(folderName)))+ folderName + "/";
				defaultPath = window.location.href.slice(0, -(("activity.html").length)) + folderName + "/";
			} else {
				defaultPath = window.location.href.slice(0, -((appJSONSet.localPathHtmlName).length)) + folderName + "/";
			}
			
		} else if(appJSONSet.defaultPath == "global"){
			if (appJSONSet.rootPath === "" || appJSONSet.rootPath === undefined){
				defaultPath = "../../../../" + folderName + "/"; 
				 
			} else {
				defaultPath = appJSONSet.rootPath + folderName + "/"; 
			}
			
		} else {
			defaultPath = appJSONSet.defaultPath + "/"; 
		}
		
		return defaultPath;
	}
	
	// LOAD AUDIO
	function loadAudio(audiopath, audiofile, audiotag, callBackAssignButTrue) {
		
		//alert("loadAudio - audiopath:"+audiopath+" audiofile:"+audiofile+" audiotag:"+audiotag+" callBackAssignButTrue:"+callBackAssignButTrue);
		
		if (audiotag.canPlayType('audio/mpeg')) {
			audiotag.src  = audiopath+audiofile+".mp3";	
		} else {
			audiotag.src  = audiopath+audiofile+".ogg";	
		}
		
		// ASSIGN the AUDIO LOAD Checks
		prepareAudioButs(audiotag);
		
	};
	
	/*****************************************************
			PRIVATE FUNCTIONS - Player DOM Creation
	******************************************************/

	// Create Player DOM Elements
	function createPlayerElem(appJSONSet, playerContainerTag, audiotag) {
		
		var elem,currentButs={},
			fragment = document.createDocumentFragment();
		
		/*****************************************************************
			!!TO CHANGE!! Points of the Json Objects
		******************************************************************/	
		var controls = appJSONSet.audioPlControls;
		var controlsLength = appJSONSet.audioPlControls.length;
		
		// NATIVE PLAYER
		if (controlsLength == 0){
			
			audiotag.controls=true;
		
		// CUSTOM PLAYER
		} else {

			for (var i = 0; i < controlsLength; i++) {

				switch (controls[i]) {
					case "seekOutput":
						elem = document.createElement('output');
						elem.className = "seekout";
						elem.value = "0";
						currentButs.seekout = elem;
						fragment.appendChild(elem);
						break;
					case "seek":	
						elem = document.createElement('input');
						elem.type = "range";
						elem.name = "audioseekb";
						elem.className = "audioseekb";
						elem.value = "0";
						currentButs.audioseekb = elem;					
						fragment.appendChild(elem);
						break;
					case "play": 
						elem = document.createElement('input');
						elem.type = "button";
						elem.name = "audiopl";
						elem.className = "audiopl";
						currentButs.audiopl = elem;
						fragment.appendChild(elem);
						break;
					case "rewind":
						elem = document.createElement('input');
						elem.type = "button";
						elem.name = "audiorew";
						elem.className = "audiorew";
						currentButs.audiorew = elem;
						fragment.appendChild(elem);
						break;
					case "forward":
						elem = document.createElement('input');
						elem.type = "button";
						elem.name = "audiofor";
						elem.className = "audiofor";
						currentButs.audiofor = elem;
						fragment.appendChild(elem);
						break;	
					case "audioScr":
						elem = document.createElement('input');
						elem.type = "button";
						elem.name = "audioScr";
						elem.className = "audioScr";
						currentButs.audioScr = elem;
						fragment.appendChild(elem);
						break;
					default :						
						break;
						
				} // End SWITCH	
			} // End FOR
			
			// Append Created DOM Player Elements to our temp fragment
			fragment.appendChild(elem);
			
		} // End IF	
		
		// Apply Created DOM Player Elements
		playerContainerTag.appendChild(fragment); // one reflow	
		
		//Assign SEEK BAR EVENTS
		assignSeekBarEvents(audiotag, currentButs.audioseekb, currentButs.seekout);
		// Disable Func Buttons
		enableDisableButFunc.disableAudioButtons(playerContainerTag,currentButs.audiopl,currentButs.audiorew,currentButs.audiofor,currentButs.audioseekb,currentButs.seekout,currentButs.audioScr);
		// Save in Local Arrays all the current elements
		enableDisableButFunc.setAudioButtons(playerContainerTag,currentButs.audiopl,currentButs.audiorew,currentButs.audiofor,currentButs.audioseekb,currentButs.seekout,currentButs.audioScr);

		return playerContainerTag;
				
	} // End func createPlayerElem
	
	
	/*****************************************************
					CONSTRUCTOR
	******************************************************/
	
    //myDOM.fn = MyDOMConstruct.prototype = {
	MyDOMConstruct.prototype = { 
	
		forEach : function(fn) {
            var elems = this.collection;
            for (var i = 0, l = elems.length; i < l; i++) {
                fn( elems[i], i );
            }
            return this;
        },
		
		/*
        addStyles : function(styles) {
			
			var defaults = {
				color: 'red',
				backgroundColor: 'yellow'
			}
			
			//var opts = $.extend(defaults, styles);
			
			var opts = Object.deepExtend(defaults, styles);
			
            var elems = this.collection;
            for (var i = 0, l = elems.length; i < l; i++) {
                for (var prop in opts) {
                    elems[i].style[prop] = opts[prop];
                }
            }
            return this;
        },
		*/
		
		
		// Init Player (Path+File+load+Events)
		initAudioPlayer : function() {
			
			/*************************
				READ JSON DATA		
			*************************/
	
			// Read Audio PATH from JSON
			var audioPath = findAudioPath(audPlayJSON.settings);
			
			// Read Audio FILES from JSON
			var audioFileName = [];
			if (audPlayJSON.files === "" || audPlayJSON.files === undefined){
				audioFileName[0] = "activity";
			} else {
				audioFileName = audPlayJSON.files.split(",");
			}
			
			/*************************
				INIT PLAYERS		
			*************************/
					
			// Loop through all Instances of Player Containers
			for(var i=0; i<this.collection.length; i++) {	
				
				// Define current Player Container and its children
				var currentPlCollection = this.collection[i];
				
				/*****************************************************************
					!!TO CHANGE!! REQUIRE: AUDIO tag to be FIRST in container
					this.collection[i].children[0]
				******************************************************************/	
				var audioChild = currentPlCollection.children[0];
				
				//assignAudioEvents(this.collection[i].children[0], seekbutton)
				//loadAudio(audioPath, audioFileName[i], this.collection[i].children[0], createPlayerElem(audPlayJSON.settings,this.collection[i]));
				loadAudio(audioPath, audioFileName[i], audioChild, assignButtons(createPlayerElem(audPlayJSON.settings,currentPlCollection,audioChild),audioChild));
				
			} // End For
				
        },

    };	
	
    return myDOM;
	
})();

//}(this.myDOM = this.myDOM || {}));

function checkDomSize(){

	var myDomSize = document.getElementsByTagName('*').length;
	
	if(myDomSize > 500){
		console.log("DOM is BIG (more than 500 elements)");
	} else {
		console.log("DOM size cool");
	}
	
};

$(document).ready(function() {	
	
	/*
	myDOMInstance(document.getElementsByTagName('a')).forEach(function(elem){
    	myDOMInstance(elem).addStyles({
			color: 'red',
			backgroundColor : 'blue'
		});
	});	
	
	myDOMInstance(document.getElementById('audioPlID1')).addStyles();
	myDOMInstance(document.getElementsByClassName('audioPlC')).addStyles();
	*/	
	
	
	myDOMInstance(document.getElementsByClassName('audioPlC')).initAudioPlayer();
	$(".audioPlC").draggable();
	
	checkDomSize();

});