// Global variable to track current file name.

var audioObject = {};
audioObject.currentFile = "";
audioObject.myAudioTag = "";



/* **** Audio Element ****
function removeAudioElement() {

	var myAudioTag = document.getElementsByTagName("audio")[0];

	
	if(audio.currentTime){
		audio.pause();
		audio.currentTime = 0;
	}
	
	document.body.removeChild(audio);
	
}

function addAudioElement() {
	try {
		removeAudioElement();
	}
	catch(e) {
	}


	// Create Audio Element
	var audio = document.createElement("audio");
	document.body.appendChild(audio);

	// Loading Audio
	audio.load();
	audio.preload = "auto"
	
	// Check compatibility
	if (audio.canPlayType('audio/mpeg')) {
		audio.src = audio+".mp3";	
	} else {
		audio.src = audio+".ogg";	
	}
	
	document.getElementById("audiop").disabled = true;
	document.getElementById("audiop").style.color="grey";
	//document.getElementById("audiop").style.background="grey";
	
	// Event driven to be compatible with WebKit
	audio.addEventListener('loadedmetadata', function(e) { 
													   
		document.getElementById("audiop").disabled = false;
		document.getElementById("audiop").style.color="#42393d";
		
		
  	}, true);
}
*/

/* Play the audio
function playAudio(myAudioTag) {
	// Check for audio element support.
	if (window.HTMLAudioElement) {
		try {
			//var myAudioTag = document.getElementById('myaudio');
			//var myAudioTag = document.getElementsByTagName("audio")[0];
			var audioButton = document.getElementById('audiopl');
			
			/*var audioURL = document.getElementById('audiofile'); 
			

			//Skip loading if current file hasn't changed.
			if (audioURL.value !== currentFile) {
				myAudioTag.src = audioURL.value;
				currentFile = audioURL.value;                       
			}
			*/
/*
			// Tests the paused attribute and set state. 
			if (myAudioTag.paused) {
				myAudioTag.play();
				audioButton.textContent = "||";
				audioButton.value = "||";
			}
			else {
				myAudioTag.pause();
				audioButton.textContent = ">";
				audioButton.value = ">";
			}
		}
		catch (e) {
			// Fail silently but show in F12 developer tools console
			 if(window.console && console.error("Error:" + e));
		}
	}

}
*/
/* Rewinds the audio file by 30 seconds.
function rewindAudio() {
	 // Check for audio element support.
	if (window.HTMLAudioElement) {
		try {
			var myAudioTag = document.getElementsByTagName("audio")[0];
			myAudioTag.currentTime -= 30.0;
		}
		catch (e) {
			// Fail silently but show in F12 developer tools console
			 if(window.console && console.error("Error:" + e));
		}
	}
}

// Fast forwards the audio file by 30 seconds.
function forwardAudio() {

	 // Check for audio element support.
	if (window.HTMLAudioElement) {
		try {
			var myAudioTag = document.getElementsByTagName("audio")[0];
			myAudioTag.currentTime += 30.0;
		}
		catch (e) {
			// Fail silently but show in F12 developer tools console
			 if(window.console && console.error("Error:" + e));
		}
	}
}
*/


/*
the function that runs when a button is selecetd. Depending on the button that
was clicked, appropriate action is taken

function delegateButtonClicks(evt, that, theSenderId, myAudioTag){

	
	switch (theSenderId) {
		case "audiopl": 
						playAudio(myAudioTag);
						break;
		case "audiorew":					
						rewindAudio(myAudioTag);
						break;
		case "audiofor":
						forwardAudio(myAudioTag);
						break;
		default :				
	}
	
		
	/* ** EVENTS
	var playButton = document.getElementById('audiopl');
	//var stopButton = document.getElementById('audiost');
	var rewindButton = document.getElementById('audiorew');
	var forwardButton = document.getElementById('audiofor');
	
	playButton.addEventListener("click", function() {
		playAudio(myAudioTag)
	});
	//stopButton.addEventListener("click", stopAudio);
	rewindButton.addEventListener("click", function() {
		rewindAudio(myAudioTag)
	});
	forwardButton.addEventListener("click", function() {
		forwardAudio(myAudioTag)
	});		
	*/
//}

/*
function crossBrowserSourceElement(evnt, theNodeType){
	var fResult = {};
	fResult.condtn = false;
	fResult.theTargetType = "";
	fResult.theTargetId = "";
	try {
		if (evnt.srcElement) {//chrome property
			fResult.theTargetType = evnt.srcElement.type.toLowerCase();
			fResult.theTargetId = evnt.srcElement.id;
		} else {
			fResult.theTargetType = evnt.originalTarget.type.toLowerCase();//firefox
			fResult.theTargetId = evnt.originalTarget.id;
		}
		if (fResult.theTargetType != theNodeType) {
			evnt.preventDefault();
		} else {
			fResult.condtn = true;
			//allow bubbling
		}
	} catch (err) {
		//some error handling - usually the click was on the select and it has no name?
	}
	return fResult;
}
*/

// **** PLAY FUNCTIONALITY *************
function handleAudio(audioBut) {
	
	var myAudioTag = document.getElementsByTagName("audio")[0];
	var audioPlayButton = document.getElementById('audiopl');
	
	
	// Check for audio element support.
	if (window.HTMLAudioElement) {
		try {
			
			if (audioBut == "audiopl") {
				
				if (myAudioTag.paused) {
					myAudioTag.play();
					//audioPlayButton.value = "||";
					setWhilePlaying();
	
				} else {
					myAudioTag.pause();
					//audioPlayButton.value = ">";
					setForPlay();
				}
				
			} else if (audioBut == "audiorew") {
				
				var myAudioTag = document.getElementsByTagName("audio")[0];
				myAudioTag.currentTime -= 30.0;
				
			} else if (audioBut == "audiofor") {
				
				var myAudioTag = document.getElementsByTagName("audio")[0];
				myAudioTag.currentTime += 30.0;
			
			}			
	
		} catch (e) {
			// Fail silently but show in F12 developer tools console
			 if(window.console && console.error("Error:" + e));
		}
	}

}

// Update the seek bar as the audio plays
function seekBarUpdate(myAudioTag,seekButton) {

	
	// Calculate the slider value
	var value = (100 / myAudioTag.duration) * myAudioTag.currentTime;
	
	// Update the slider value
	seekButton.value = value;
	
	// Update the range value
	document.getElementById("rangevalue").value = Math.round(value);
}


// Assign Events
function assignAudioEvents() {
	
	// ** ELEMENTS
	var myAudioTag = document.getElementsByTagName("audio")[0];	
	var seekButton = document.getElementById('seek-bar');
	
	/*document.getElementById("audioPlID").addEventListener("click", function(e){
		var locObj = crossBrowserSourceElement(e, "button");
		if (locObj.condtn) {
			delegateButtonClicks(e, this, locObj.theTargetName);
			
			e.stopPropagation();
			e.cancelBubble = true;
			
		} else {
			//nothing
		}
	});*/	
	
	myAudioTag.addEventListener('canplaythrough', function() {
														   
		console.log('canplaythrough');
	
		if (myAudioTag.paused) {
			//enableAudioButtons();
			setForPlay();
			//alert('canplaythrough2');
		} else {
			
			setWhilePlaying();
			//alert('canplaythrough3');
		}
		
	}, false);
	
	
	// Event driven to be compatible with WebKit
	myAudioTag.addEventListener('loadedmetadata', function(e) { 
													   
		console.log('loadedmetadata');
		
		if (myAudioTag.paused) {
			setForPlay();
		} else {
			setWhilePlaying();
		}		
		
  	}, true);
	
	
	
	// SEEK BAR HANDLING
	
	// Update the seek bar as the audio plays
	myAudioTag.addEventListener("timeupdate", function() {
		seekBarUpdate(myAudioTag, seekButton);
	});
	
	// Event listener for the seek bar
	seekButton.addEventListener("change", function() {
		// Check for audio element support.
		if (window.HTMLAudioElement) {
			try {
				var time = myAudioTag.duration * (seekButton.value / 100);
				myAudioTag.currentTime = time;
			}
			catch (e) {
				// Fail silently but show in F12 developer tools console
				 if(window.console && console.error("Error:" + e));
			}
		}
	});	

	// Pause the video when the slider handle is being dragged
	seekButton.addEventListener("mousedown", function() {
		myAudioTag.removeEventListener("timeupdate", seekBarUpdate);
		myAudioTag.pause();
	});
	
	// Play the video when the slider handle is dropped
	seekButton.addEventListener("mouseup", function() {
		myAudioTag.addEventListener("timeupdate", seekBarUpdate(myAudioTag, seekButton));
		myAudioTag.play();
	});
	
}

// Enable/Disable Audio Buttons
function enableAudioButtons() {
	//alert('enableAudioButtons')
	document.getElementById("audiopl").disabled = false;
	document.getElementById("audiopl").style.background="url('layout/audio_Play_On.png') no-repeat left";
	document.getElementById("audiopl").style.cursor="pointer";
	
	document.getElementById("audiorew").disabled = false;
	document.getElementById("audiorew").style.background="url('layout/audio_Rew_On.png') no-repeat left";
	document.getElementById("audiorew").style.cursor="pointer";
	
	document.getElementById("audiofor").disabled = false;
	document.getElementById("audiofor").style.background="url('layout/audio_For_On.png') no-repeat left";
	document.getElementById("audiofor").style.cursor="pointer";
	
	document.getElementById("seek-bar").disabled = false;
	document.getElementById("seek-bar").style.cursor="pointer";
	document.getElementById("seek-bar").style.backgroundColor="#EFC231";
	
	document.getElementById("tapescr").disabled = false;
	document.getElementById("tapescr").style.background="url('layout/Icon_Page_On.png') no-repeat left";
	document.getElementById("tapescr").style.cursor="pointer";
	//document.getElementById("seek-bar").value = 0;
}

function disableAudioButtons() {
	//alert('disableAudioButtons')
	
	document.getElementById("audiopl").disabled = true;
	//document.getElementById("audiopl").style.background="url('layout/audio_Play.png') no-repeat left";
	document.getElementById("audiopl").style.cursor="default";
	
	document.getElementById("audiorew").disabled = true;
	//document.getElementById("audiorew").style.background="url('layout/audio_Rew.png') no-repeat left";
	document.getElementById("audiorew").style.cursor="default";
	
	document.getElementById("audiofor").disabled = true;
	//document.getElementById("audiofor").style.background="url('layout/audio_For.png') no-repeat left";
	document.getElementById("audiofor").style.cursor="default";
	
	document.getElementById("seek-bar").disabled = true;
	document.getElementById("seek-bar").style.cursor="default";
	document.getElementById("seek-bar").style.backgroundColor="#CCC";
	document.getElementById("seek-bar").value = 0;
	
	document.getElementById("rangevalue").value = 0;
	
	document.getElementById("tapescr").disabled = true;
	//document.getElementById("tapescr").style.background="url('layout/Icon_Page.png') no-repeat left";
	document.getElementById("tapescr").style.cursor="default";
}

function setForPlay() {
	
	document.getElementById("audiopl").disabled = false;
	//document.getElementById("audiopl").style.background="url('layout/audio_Play_On.png') no-repeat left";
	document.getElementById("audiopl").style.cursor="pointer";
	
	document.getElementById("audiorew").disabled = true;
	//document.getElementById("audiorew").style.background="url('layout/audio_Rew.png') no-repeat left";
	document.getElementById("audiorew").style.cursor="default";
	
	document.getElementById("audiofor").disabled = true;
	//document.getElementById("audiofor").style.background="url('layout/audio_For.png') no-repeat left";
	document.getElementById("audiofor").style.cursor="default";
	
	document.getElementById("seek-bar").disabled = true;
	document.getElementById("seek-bar").style.backgroundColor="#EFC231";
	document.getElementById("seek-bar").style.cursor="default";
	//document.getElementById("seek-bar").value = 0;
	
	document.getElementById("tapescr").disabled = false;
	//document.getElementById("tapescr").style.background="url('layout/Icon_Page_On.png') no-repeat left";
	document.getElementById("tapescr").style.cursor="pointer";
}

function setWhilePlaying() {
	document.getElementById("audiopl").style.background="url('layout/audio_Pause_On.png') no-repeat left";
	
	document.getElementById("audiorew").disabled = false;
	document.getElementById("audiorew").style.background="url('layout/audio_Rew_On.png') no-repeat left";
	document.getElementById("audiorew").style.cursor="pointer";
	
	document.getElementById("audiofor").disabled = false;
	document.getElementById("audiofor").style.background="url('layout/audio_For_On.png') no-repeat left";
	document.getElementById("audiofor").style.cursor="pointer";
	
	
	document.getElementById("seek-bar").disabled = false;
	document.getElementById("seek-bar").style.backgroundColor="#EFC231";
	document.getElementById("seek-bar").style.cursor="pointer";
	//document.getElementById("seek-bar").value = 0;
	
}

// Restart the audio file to the beginning.
function restartAudio() {
	 // Check for audio element support.
	if (window.HTMLAudioElement) {
		try {
			var myAudioTag = document.getElementsByTagName("audio")[0];
			myAudioTag.currentTime = 0;
		}
		catch (e) {
			// Fail silently but show in F12 developer tools console
			 if(window.console && console.error("Error:" + e));
	   }
	}
}
// Stop the audio
function stopAudio() {
	//alert('stopAudio');
	
	 // Check for audio element support.
	if (window.HTMLAudioElement) {
		try {
			var myAudioTag = document.getElementsByTagName("audio")[0];
			var audioButton = document.getElementById('audiopl');
			
			//audioButton.value = ">";
			
			document.getElementById("seek-bar").value = 0;
			
			if(myAudioTag.currentTime){
				myAudioTag.pause();
				myAudioTag.currentTime = 0;
				//audioButton.textContent = ">";
			}
		}
		catch (e) {
			// Fail silently but show in F12 developer tools console
			 if(window.console && console.error("Error:" + e));
	   }
	}
}

// Init Player
function initAudioPlayer(myAudioFile) {
	//alert('initAudioPlayer')
	
	stopAudio();
	//disableAudioButtons();
	
	// ** ELEMENTS
	var myAudioTag = document.getElementsByTagName("audio")[0];		
	
	(function(){
		//** Audio FILE
		//Skip loading if current file hasn't changed.
		if (myAudioFile !== audioObject.currentFile) {
			audioObject.currentFile = myAudioFile;
			
			if (myAudioTag.canPlayType('audio/mpeg')) {
				myAudioTag.src  = myAudioFile+"mp3";	
			} else {
				myAudioTag.src  = myAudioFile+"ogg";	
			}
		}	
	})(disableAudioButtons());
}


$(document).ready(function() {
	assignAudioEvents();
	initAudioPlayer("");
	
	
	//audioObject.myAudioTag = document.getElementsByTagName("audio")[0];
});
