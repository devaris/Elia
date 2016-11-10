// Global variable to track current file name.

var audioObject = {};
audioObject.currentFile = "";
audioObject.myAudioTag = "";
audioObject.myDemoPlay = "";


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

function secondsToTime(secs)
{
    var hours = Math.floor(secs / (60 * 60));
   
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
 
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
   
    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return obj;
}

// Update the seek bar as the audio plays
function seekBarUpdate(myAudioTag,seekButton) {

	
	// Calculate the slider value
	var value = (100 / myAudioTag.duration) * myAudioTag.currentTime;
	
	// Update the slider value
	seekButton.value = value;
	
	// Update the range value
	//document.getElementById("rangevalue").value = Math.round(value);
	var currentTimeObj = secondsToTime(myAudioTag.currentTime);
	var durationObj = secondsToTime(myAudioTag.duration);
	
	if(currentTimeObj.s < 10){
		document.getElementById("rangevalue").value = currentTimeObj.m+": 0"+currentTimeObj.s+" / "+durationObj.m+":"+durationObj.s
	} else {
		document.getElementById("rangevalue").value = currentTimeObj.m+":"+currentTimeObj.s+" / "+durationObj.m+":"+durationObj.s
	}
	
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

		console.log('Audio canplaythrough');
	
		if (myAudioTag.paused) {
			//enableAudioButtons();
			setForPlay();
			//alert('canplaythrough2');
		} else {
			
			setWhilePlaying();
			//alert('canplaythrough3');
		}
		
		myAudioTag.removeEventListener("canplaythrough", arguments.callee, false);
		
	}, false);
	
	
	// Event driven to be compatible with WebKit
	myAudioTag.addEventListener('loadedmetadata', function(e) { 
													   
		console.log('Audio loadedmetadata');
		
		if (myAudioTag.paused) {
			setForPlay();
		} else {
			setWhilePlaying();
		}		
		
		myAudioTag.removeEventListener("loadedmetadata", arguments.callee, false);
		
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
	
	var theAudioPlayBut = document.getElementById("audiopl");
	theAudioPlayBut.disabled = false;
	theAudioPlayBut.firstChild.src = 'resources/layout/audioplayer/BtnPlay_Off.png';
	
	
	
	document.getElementById("audiorew").disabled = false;	
	document.getElementById("audiofor").disabled = false;
	
	//document.getElementById("tapescr").disabled = false;	
	document.getElementById("showaudio").disabled = false;
	
	//SEEK BAR//
	document.getElementById("seek-bar").disabled = false;
}

function disableAudioButtons() {
	//alert('disableAudioButtons')
	
	var theAudioPlayBut = document.getElementById("audiopl");
	theAudioPlayBut.disabled = true;
	theAudioPlayBut.firstChild.src = 'resources/layout/audioplayer/BtnPlay_Dis.png';
	setDataAttribute(theAudioPlayBut, "paused", false);

	document.getElementById("audiorew").disabled = true;
	document.getElementById("audiofor").disabled = true;
	
	$("#audioScriptID").hide("fast");
	
	//setDataAttribute(document.getElementById("tapescr"), "openscr", false);
	setDataAttribute(document.getElementById("showaudio"), "openscr", false);
	
	//document.getElementById("tapescr").disabled = true;
	document.getElementById("showaudio").disabled = true;
	
	//SEEK BAR//
	document.getElementById("seek-bar").disabled = true;
	
	//RESET SEEKBAR VALUES
	document.getElementById("seek-bar").value = 0;	
	//document.getElementById("rangevalue").value = 0;	
	document.getElementById("rangevalue").value = "";	
}

function setForPlay() {
	//alert('setForPlay')
		
	var theAudioPlayBut = document.getElementById("audiopl");
	theAudioPlayBut.disabled = false;
	theAudioPlayBut.firstChild.src = 'resources/layout/audioplayer/BtnPlay_On.png';	
	setDataAttribute(theAudioPlayBut, "paused", false);
	
	document.getElementById("audiorew").disabled = true;	
	document.getElementById("audiofor").disabled = true;
	
	//document.getElementById("tapescr").disabled = false;
	document.getElementById("showaudio").disabled = false;

	//SEEK BAR//
	document.getElementById("seek-bar").disabled = false;
}

function setWhilePlaying() {
	//alert('setWhilePlaying')
	
	var theAudioPlayBut = document.getElementById("audiopl");
	theAudioPlayBut.firstChild.src = 'resources/layout/audioplayer/BtnPause_On.png';	
	setDataAttribute(theAudioPlayBut, "paused", true);
	
	document.getElementById("audiorew").disabled = false;
	document.getElementById("audiofor").disabled = false;
	//SEEK BAR//
	document.getElementById("seek-bar").disabled = false;
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
			//var audioButton = document.getElementById('audiopl');
			
			document.getElementById("seek-bar").value = 0;
			
			if(myAudioTag.currentTime){
				myAudioTag.pause();
				myAudioTag.currentTime = 0;
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
	//alert('initAudioPlayer '+myAudioFile)
	//alert(myAudioFile)
	
	stopAudio();
	
	// ** ELEMENTS
	var myAudioTag = document.getElementsByTagName("audio")[0];		
	
	(function(){
		//** Audio FILE
		//Skip loading if current file hasn't changed.
		
		//if (myAudioFile !== audioObject.currentFile) {
			audioObject.currentFile = myAudioFile;
			
			if (myAudioTag.canPlayType('audio/mpeg')) {
				myAudioTag.src  = myAudioFile+"mp3";	
			} else {
				myAudioTag.src  = myAudioFile+"ogg";	
			}
			
		// !!!!!!!!!!! TEMP SOLUTION FOR IPAD AUDIO !!!!!!!!!!!!!!!!!!!!!!!!!
		/*alert("audioObject.currentFile "+audioObject.currentFile)
		
		if(audioObject.currentFile == "navigation/0/2/0/audio/audio."){
			setForPlay();
		} else {
		}
		// !!!!!!!!!!! TEMP SOLUTION FOR IPAD AUDIO !!!!!!!!!!!!!!!!!!!!!!!!!	
			
		//}	*/
		
	})(disableAudioButtons());
}


/* AUDIOSCRIPT */
function tapescriptShow(theSender){
	/*$("#audioScriptID").fadeToggle(400);*/
	
	//$("#audioScriptID").toggle("fast");
	//if (getDataAttribute(document.getElementById("tapescr"), "openscr") == 'true'){
	if (getDataAttribute(document.getElementById("showaudio"), "openscr") == 'true'){	
		//alert('true -> false')
		//setDataAttribute(document.getElementById("tapescr"), "openscr", false)
		setDataAttribute(document.getElementById("showaudio"), "openscr", false);
		
		$("#audioScriptID").hide("fast");
		
	} else {
		//alert('false -> True')
		//setDataAttribute(document.getElementById("tapescr"), "openscr", true)
		setDataAttribute(document.getElementById("showaudio"), "openscr", true);
		$("#audioScriptID").show("fast");
	}
}


$(document).ready(function() {
	//assignAudioEvents();
	//initAudioPlayer("");
	
	//audioObject.myAudioTag = document.getElementsByTagName("audio")[0];
});



