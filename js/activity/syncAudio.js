function SyncAudio(exerciseRef, DOMposition, audioFilename){
		
    //private properties
	var score = 0;
    var myHighlight;
    var mySignature = "SyncAudio";
    var SyncAudioNS = this;
	var music; 
	var duration; 
	var pButton; 
	var sButton;
	var playhead;
	var timeline; 
	var timelineWidth;
	var onplayhead = false;
	var popcornTimelineObj;
		
    var activityIndex = HTMLCollectionToArray(document.getElementsByClassName("activity")).indexOf(DOMposition.parentNode);
    var videoHTML = '<div id="jp_container_1" class="jp-video " role="application" aria-label="media player"><div class="jp-type-single"><div id="jquery_jplayer_1" class="jp-jplayer"></div><div class="jp-gui"><div class="jp-video-play">        <button class="jp-video-play-icon" role="button" tabindex="0">play</button>        </div>         <div class="jp-interface">           <div class="jp-progress">             <div class="jp-seek-bar">               <div class="jp-play-bar"></div>             </div>           </div>           <div class="jp-current-time" role="timer" aria-label="time">&nbsp;</div>           <div class="jp-duration" role="timer" aria-label="duration">&nbsp;</div>           <div class="jp-controls-holder">             <div class="jp-controls">               <button class="jp-play" role="button" tabindex="0">play</button>               <button class="jp-stop" role="button" tabindex="0">stop</button>              </div>              <div class="jp-volume-controls">                <button class="jp-mute" role="button" tabindex="0">mute</button>                <button class="jp-volume-max" role="button" tabindex="0">max volume</button>                <div class="jp-volume-bar">                  <div class="jp-volume-bar-value"></div>                </div>              </div>              <div class="jp-toggles">                <button class="jp-repeat" role="button" tabindex="0">repeat</button>                <button class="jp-full-screen" role="button" tabindex="0">full screen</button>              </div>            </div>            <div class="jp-details">              <div class="jp-title" aria-label="title">&nbsp;</div>            </div>          </div>        </div>        <div class="jp-no-solution">          <span>Update Required</span>          To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.        </div>      </div>    </div>';

    //public properties
    this.exerciseRef = exerciseRef;

    //private constructor
    var __construct = function(that) {
		//alert("cookiJSON = "+JSON.stringify(spa.activityJSON))
		var xtraHTML = spa.checkExistenceOfXtraHTML(exerciseRef.activity);
		if (xtraHTML["before"]!="")
			DOMposition.appendChild(xtraHTML["before"]);
		var newDiv = document.createElement("DIV");
		/*newDiv.innerHTML +='<div class="player"><audio id="audPlay"><source src="'+audioFilename+'.ogg" type="audio/ogg"><source src="'+audioFilename+'.mp3" type="audio/mpeg">Your browser does not support the audio element.</audio><div id="audioplayer"><button id="pButton" class="play"></button><button id="sButton" class="stop"></button><div id="timeline"><div id="playhead"></div></div></div></div>'*/
		newDiv.innerHTML += prepareSyncAudioContent(exerciseRef);
		DOMposition.appendChild(newDiv);
		if (xtraHTML["after"]!="")
			DOMposition.appendChild(xtraHTML["after"]);
		var temp = SyncAudioNS.checkAnswers();
		spa.getScore(SyncAudioNS, temp);
		spa.updateScore();
		assignCode();
		
		if (exerciseRef.settings.hideTimebar){
			DOMposition.querySelector('#timeline').className += "hideItem";
		}
		music = DOMposition.querySelector('#audPlay'); // id for audio element
		duration; // Duration of audio clip
		pButton = DOMposition.querySelector('#pButton'); // play button
		sButton = DOMposition.querySelector('#sButton'); // stop button
		playhead = DOMposition.querySelector('#playhead'); // playhead
		timeline = DOMposition.querySelector('#timeline'); // timeline
		// timeline width adjusted for playhead
		timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
		console.log("============__construct===============")
		console.log("timelineWidth:   "+timelineWidth)
		console.log("timeline.offsetWidth:   "+timeline.offsetWidth)
		console.log("playhead.offsetWidth:   "+playhead.offsetWidth)
		
		pButton.addEventListener("click", play);
		sButton.addEventListener("click", stop);
		
		popcornTimelineObj = Popcorn('#audPlay');
		if (exerciseRef.settings.autoPlayAudio){
			popcornTimelineObj.play();
			pButton.className = "";
			pButton.className = "pause";
			music.play();

		}
		var timelineObj=exerciseRef.activity.timelineObject;
		for (var i=0; i < timelineObj.length; i++){
			var timelineCurrObjTitle="";
			var timelineCurrObjText="";
			var timelineCurrObjInnerHTML="";
			var timelineCurrObjDirection="down";
			var timelineCurrObjclassTitle="";
			var timelineCurrObjclassText="";
			if ((timelineObj[i].title!='')&&(timelineObj[i].title!=null)){
				timelineCurrObjTitle=timelineObj[i].title
			}
			if ((timelineObj[i].text!='')&&(timelineObj[i].text!=null)){
				timelineCurrObjText=timelineObj[i].text
			}
			if ((timelineObj[i].innerHTML!='')&&(timelineObj[i].innerHTML!=null)){
				timelineCurrObjInnerHTML=timelineObj[i].innerHTML
			}
			if ((timelineObj[i].direction!='')&&(timelineObj[i].direction!=null)){
				timelineCurrObjDirection=timelineObj[i].direction
			}
			if ((timelineObj[i].classTitle!='')&&(timelineObj[i].classTitle!=null)){
				timelineCurrObjclassTitle=timelineObj[i].classTitle
			}
			if ((timelineObj[i].classText!='')&&(timelineObj[i].classText!=null)){
				timelineCurrObjclassText=timelineObj[i].classText
			}
			timelineCurrObj={
				start: timelineObj[i].start,
				target: timelineObj[i].target,
				title: timelineCurrObjTitle,
				text: timelineCurrObjText,
				innerHTML: timelineCurrObjInnerHTML,
				direction: timelineCurrObjDirection,
				classTitle: timelineCurrObjclassTitle,
				classText: timelineCurrObjclassText
			}
			popcornTimelineObj.timeline(timelineCurrObj)
		}
	
		music.addEventListener("loadedmetadata", function() {
			//alert(music.duration);
			duration = music.duration;
		});
		music.addEventListener("durationchange", function() {
			//alert(music.duration);
			duration = music.duration;
		});
		
		// timeupdate event listener
		music.addEventListener("timeupdate", timeUpdate, false);

		//Makes timeline clickable
		timeline.addEventListener("click", function (event) {
			moveplayhead(event);
			music.currentTime = duration * clickPercent(event);
		}, false);
		
		playhead.addEventListener('mousedown', mouseDown, false);
		window.addEventListener('mouseup', mouseUp, false);

		music.addEventListener("canplaythrough", function () {
			//console.log("=========canplaythrough==========")
			duration = music.duration;
			//console.log("duration:   "+duration)
			//console.log("music.duration:   "+music.duration)
		}, false);
		
		music.addEventListener('ended', function(){
			pButton.className = "";
			pButton.className = "play";
			music.pause();
		}, false);
    };

    //private functions
	// returns click as decimal (.77) of the total timelineWidth
	function clickPercent(e) {
		return (e.pageX - timeline.offsetLeft) / timelineWidth;
	}
	
	function mouseDown() {
		onplayhead = true;
		window.addEventListener('mousemove', moveplayhead, true);
		music.removeEventListener('timeupdate', timeUpdate, false);
	}
	// mouseUp EventListener
	// getting input from all mouse clicks
	function mouseUp(e) {
		if (onplayhead == true) {
			moveplayhead(e);
			window.removeEventListener('mousemove', moveplayhead, true);
			// change current time
			music.currentTime = duration * clickPercent(e);
			music.addEventListener('timeupdate', timeUpdate, false);
		}
		onplayhead = false;
	}
	// mousemove EventListener
	// Moves playhead as user drags
	function moveplayhead(e) {
		var newMargLeft = e.pageX - timeline.offsetLeft;
		if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
			playhead.style.marginLeft = newMargLeft + "px";
		}
		if (newMargLeft < 0) {
			playhead.style.marginLeft = "0px";
		}
		if (newMargLeft > timelineWidth) {
			playhead.style.marginLeft = timelineWidth + "px";
		}
	}
	// timeUpdate 
	// Synchronizes playhead position with current point in audio 
	function timeUpdate() {
		var playPercent = timelineWidth * (music.currentTime / duration);
		playhead.style.marginLeft = playPercent + "px";
		//console.log("============timeUpdate===============")
		//console.log("timelineWidth:   "+timelineWidth)
		//console.log("music.currentTime:   "+music.currentTime)
		//console.log("duration:   "+duration)
		//console.log("music.duration:   "+music.duration)
		//console.log("playPercent:   "+playPercent)
		//console.log("music:   "+music)
		/*if ((Math.round( music.currentTime * 10 ) / 10) == (Math.round( duration * 10 ) / 10)) {
			music.pause();
			music.currentTime = duration;
			pButton.className = "";
			pButton.className = "play";
		}*/
	}

	setInterval(function () {
		if ((Math.round( music.currentTime * 10 ) / 10) == (Math.round( duration * 10 ) / 10)) {
			music.pause();
			music.currentTime = duration;
			pButton.className = "";
			pButton.className = "play";
		}
	}, 1);

	//Play and Pause
	function play() {
		// start music
		if (music.paused) {
			if (music.currentTime==music.duration){
				stop();
			}
			music.play();
			if (music.currentTime==0){
				$('.timelineDivClass').css('opacity', '0.2');
				$('.timelineDivClass').removeClass("animated fadeIn")
			}
			// remove play, add pause
			pButton.className = "";
			pButton.className = "pause";
		} else { // pause music
			music.pause();
			// remove pause, add play
			pButton.className = "";
			pButton.className = "play";
		}
	}
	
	function stop() {
		// stop music
		music.currentTime = 0;
		music.pause();
		pButton.className = "";
		pButton.className = "play";
		playhead.style.marginLeft = "0px";
	}
	
	var assignCode = function() {	
        var videosNo;
        var vids = DOMposition.querySelector(".video");
        if (vids!=null){
            videosNo=DOMposition.querySelector(".video").length;
            if (videosNo>0){
                for (var i = 0; i < videosNo; i++) {
                    spa.loadTheVideo(vids[i]);
                }
            }
        }
    };
	
	var createActText = function(classes, text){
		var theHTML = '<div class="'+classes+'">';
		var theTexts = text.split("@@");
		theHTML += '<ul>';
		for (var i=0;i<theTexts.length;i++){
			theHTML += '<li>'+theTexts[i]+'</li>';
		}
		theHTML += '</ul>';
		theHTML += '</div>';
		return theHTML;
	}
	
	var processParts = function(parts_array){
		var theHTML = "";
		var centerWidth = 12;
		/*if ((parts_array[0]!='')&&(parts_array[0]!=null))
			centerWidth-=3;			
		if ((parts_array[2]!='')&&(parts_array[2]!=null))
			centerWidth-=3;*/
		var numOfCols=0;
		for (var currColCounter=0;currColCounter<parts_array.length;currColCounter++){
			if ((parts_array[currColCounter]!='')&&(parts_array[currColCounter]!=null)){
				numOfCols+=1
			}
		}
		var leftWidth=0;
		var centerWidth=12;
		var rightWidth=0;
		if (numOfCols==2){
			if(exerciseRef.settings.equalColumns){
				leftWidth=rightWidth=centerWidth=6;
			}else{
				leftWidth=rightWidth=3;
				centerWidth=9;
			}
		}
		if (numOfCols==3){
			if(exerciseRef.settings.equalColumns){
				leftWidth=rightWidth=centerWidth=4;
			}else{
				leftWidth=rightWidth=3;
				centerWidth=6;
			}
		}
		var tempHTML = '';
		if ((parts_array[0]!='')&&(parts_array[0]!=null)){
			if ($.isArray(parts_array[0][0])){
				for (var i=0;i<parts_array[0].length;i++){
					if (parts_array[0][i][0].indexOf("syncText")>=0){
						tempHTML+='<div id="'+parts_array[0][i][1]+'"></div>'
					}else{
						tempHTML+='<div class="'+ parts_array[0][i][0]+'">' + parts_array[0][i][1] + '</div>'
					}
				}
			}
			else{
				tempHTML = '<div class="'+ parts_array[0][0]+'">' + parts_array[0][1] + '</div>';
			}
			theHTML += '<div class="col-md-'+leftWidth+' col-xs-12">'+tempHTML+'</div>';
		}
		tempHTML = '';
		if (((parts_array[1]!='')&&(parts_array[1]!=null))||((parts_array[0]!='')&&(parts_array[0]!=null))||((parts_array[2]!='')&&(parts_array[2]!=null))){
			if ($.isArray(parts_array[1][0])){
				for (var i=0;i<parts_array[1].length;i++){
					if (parts_array[1][i][0].indexOf("activityText")>=0){
						tempHTML+=createActText(parts_array[1][i][0], parts_array[1][i][1])
					}
					else if (parts_array[1][i][0].indexOf("image")>=0){
						var caption = '';
						if ((parts_array[1][i][2]!='')&&(parts_array[1][i][2]!=null)){
							caption = '<p>'+parts_array[1][i][2]+'</p>';
						}
						tempHTML+='<div style="max-width: 100%; min-width: 7em;" class="figure full '+ ((parts_array[1][i]!='')&&(parts_array[1][i]!=null)?parts_array[1][i][0]:'')+'">' + ((parts_array[1][i]!='')&&(parts_array[1][i]!=null)?parts_array[1][i][1]:'') + caption + '</div>';
						
					}
                    else if (parts_array[1][i][0].indexOf("video")>=0){
                        tempHTML+='<div style="max-width: 100%; min-width: 7em;" class="'+ ((parts_array[1][i]!='')&&(parts_array[1][i]!=null)?parts_array[1][i][0]:'')+'" data-url="'+((parts_array[1][i]!='')&&(parts_array[1][i]!=null)?parts_array[1][i][1]:'')+'">' + videoHTML + '</div>';
                    }
					else if (parts_array[1][i][0].indexOf("syncText")>=0){
						tempHTML+='<div id="'+parts_array[1][i][1]+'"></div>'
					}
					else{
						tempHTML+='<div class="'+ ((parts_array[1][i]!='')&&(parts_array[1][i]!=null)?parts_array[1][i][0]:'')+'">' + ((parts_array[1][i]!='')&&(parts_array[1][i]!=null)?parts_array[1][i][1]:'') + '</div>';
					}
				}
			}
			else{
				tempHTML = '<div class="'+ ((parts_array[1]!='')&&(parts_array[1]!=null)?parts_array[1][0]:'')+'">' + ((parts_array[1]!='')&&(parts_array[1]!=null)?parts_array[1][1]:'') + '</div>';
			}
			theHTML += '<div class="col-md-'+centerWidth+' col-xs-12">'+tempHTML+'</div>';
		}
		tempHTML = '';
		if ((parts_array[2]!='')&&(parts_array[2]!=null)){
			if ($.isArray(parts_array[2][0])){
				for (var i=0;i<parts_array[2].length;i++){
					if (parts_array[2][i][0].indexOf("image")>=0){
						var caption = '';
						if ((parts_array[2][i][2]!='')&&(parts_array[2][i][2]!=null)){
							caption = '<p>'+parts_array[2][i][2]+'</p>';
						}
						tempHTML+='<div style="max-width: 100%; min-width: 7em;" class="figure full '+ ((parts_array[2][i]!='')&&(parts_array[2][i]!=null)?parts_array[2][i][0]:'')+'">' + ((parts_array[2][i]!='')&&(parts_array[2][i]!=null)?parts_array[2][i][1]:'') + caption + '</div>';						
					}
					else if (parts_array[2][i][0].indexOf("syncText")>=0){
						tempHTML+='<div id="'+parts_array[2][i][1]+'"></div>'
					}else{
						tempHTML+='<div class="'+ parts_array[2][i][0]+'">' + parts_array[2][i][1] + '</div>';
					}
				}
			}
			else{
				if (parts_array[2][0].indexOf("image")>=0){
					var caption = '';
					if ((parts_array[2][2]!='')&&(parts_array[2][2]!=null)){
						caption = '<p>'+parts_array[2][i][2]+'</p>';
					}
					tempHTML+='<div style="max-width: 100%; min-width: 7em;" class="figure full '+ ((parts_array[2]!='')&&(parts_array[2]!=null)?parts_array[2][0]:'')+'">' + ((parts_array[2]!='')&&(parts_array[2]!=null)?parts_array[2][1]:'') + caption + '</div>';						
				}
				else if (parts_array[2][0].indexOf("syncText")>=0){
					tempHTML+='<div id="'+parts_array[2][1]+'"></div>'
				}else{
					tempHTML+='<div class="'+ parts_array[2][0]+'">' + parts_array[2][1] + '</div>';
				}
			}
			theHTML += '<div class="col-md-'+rightWidth+' col-xs-12">'+tempHTML+'</div>';
		}
		if (theHTML!=""){
			theHTML = '<div class="row">'+theHTML+'</div>';
		}
		return theHTML;
	}
	
    var prepareSyncAudioContent = function(exerciseRef) {
		var theJSONElements = "";
		var activityParts = exerciseRef.activity;
		var activityPartsHTML=""
		activityPartsHTML+=processParts(activityParts.header);
		activityPartsHTML+=processParts(activityParts.main);
		activityPartsHTML+=processParts(activityParts.footer);
		activityPartsHTML+='<div class="player"><audio id="audPlay"><source src="'+audioFilename+'.ogg" type="audio/ogg"><source src="'+audioFilename+'.mp3" type="audio/mpeg">Your browser does not support the audio element.</audio><div id="audioplayer"><button id="pButton" class="play"></button><button id="sButton" class="stop"></button><div id="timeline"><div id="playhead"></div></div></div></div>'
		
		return activityPartsHTML;
	};

    //public functions
	
	this.checkAnswers = function(myItem) {
		var score = 0;
		var percentage = 100;
		var temp = {"score": score, "percentage": percentage};
		return temp;
	}
	
	
	var pressed = false;
	this.showAnswers = function() {
		if (!pressed) {
			pressed = true;
		} else {
			pressed = false;
		}
	};	

	//initialize Object....
    __construct(this);
}