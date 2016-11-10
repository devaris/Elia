function Display(exerciseRef, DOMposition, revealSub, audioFilename, closeButAppear){
		
    //private properties
    var score = 0;
    var myHighlight;
    var mySignature = "display";
    var displayNS = this;
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
		newDiv.innerHTML = prepareDisplayContent(exerciseRef);
		DOMposition.appendChild(newDiv);
		if (xtraHTML["after"]!="")
			DOMposition.appendChild(xtraHTML["after"]);
		var temp = displayNS.checkAnswers();
		spa.getScore(displayNS, temp);
		spa.updateScore();
		assignCode();
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

	if (audioFilename!=null){
		setInterval(function () {
			//console.log("setInterval")
			if ((Math.round( music.currentTime * 10 ) / 10) == (Math.round( duration * 10 ) / 10)) {
				music.pause();
				music.currentTime = duration;
				pButton.className = "";
				pButton.className = "play";
			}
		}, 1);
	}
	
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
        var videosNo=document.getElementsByClassName("video").length;
        var vids = document.getElementsByClassName("video");
        if (videosNo>0){
            for (var i = 0; i < videosNo; i++) {
                spa.loadTheVideo(vids[i]);
            }
        }
		
		//MY CODE FOTINI
		/* $(".clickMe").on("click", function() {
				
			var elems = document.getElementsByClassName('showMe'); */
            $('.showMeClone').css("display", "none");
            $(".clickMe").on("click", function() {
				
			var elems = document.getElementsByClassName('showMe');
				for(var i = 0; i < elems.length; i++) {
					if(revealSub==true){
						$(elems[i]).css("display", "none");
							var elements = document.getElementsByClassName('clickMe');
							for(var j = 0; j < elements.length; j++){
								$(elements[j]).removeClass("active");
								$(elements[j]).parent().parent().find('.triangle').css("opacity", "0");
								//$(elements[j]).removeClass("triangle");
								if($(this).attr("data-id")== $(elements[j]).attr("data-id")){
								$(elements[j]).parent().parent().find('.triangle').css("opacity", "1");
								}
							}
							
						}
                if($(this).attr("data-id")== $(elems[i]).attr("data-id"))
                 
                    $(elems[i]).css("display", "block");
                    $(this).addClass("active");
		    $(".answersDiv").css("visibility", "visible");
                }				
				
				//class foo height:auto for the blue background
				if($(".answers").hasClass("foo")){}
				else{
				
					$(".answers").addClass("foo");
					
				}
				
				//make the instructional phrase "Click..." disappear 
				if($(".instruction").hasClass("lost")){}
				else{
					$(".instruction").addClass("lost");
				}
			}); //END
			
			$(".tip > .clickMe").addClass("fa fa-paperclip"); //add the tip icon  
			$(".tip > .showMe").addClass("element-animation"); 
			
			
		/*$('.clickReveal .clickMe').click(function(e){
         	$(this).removeClass("clickMe");
		}); */    
            if (audioFilename!=null){
           /* Added audio support... */ 
				if (exerciseRef.settings.hideTimebar){
				document.getElementById('timeline').className += "hideItem"
				}
				music = DOMposition.querySelector('#audPlay'); // id for audio element
				duration; // Duration of audio clip
				pButton = DOMposition.querySelector('#pButton'); // play button
				sButton = DOMposition.querySelector('#sButton'); // stop button
				playhead = DOMposition.querySelector('#playhead'); // playhead
				timeline = DOMposition.querySelector('#timeline'); // timeline
				// timeline width adjusted for playhead
				timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
				/*console.log("============__construct===============")
				console.log("timelineWidth:   "+timelineWidth)
				console.log("timeline.offsetWidth:   "+timeline.offsetWidth)
				console.log("playhead.offsetWidth:   "+playhead.offsetWidth)*/
				
				pButton.addEventListener("click", play);
				sButton.addEventListener("click", stop);
				
				popcornTimelineObj = Popcorn('#audPlay');
				if (exerciseRef.settings.autoPlayAudio){
					popcornTimelineObj.play();
					pButton.className = "";
					pButton.className = "pause";
					music.play();
				}
				
			
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
					duration = music.duration;  
				}, false);
				
				music.addEventListener('ended', function(){
					pButton.className = "";
					pButton.className = "play";
					music.pause();
				}, false);
            }
	    //assign
	    	$(".closebtn").on("click", function() {
			$(".showMe").css("display", "none");
			$(".clickMe").removeClass("active");
			$(".answers").removeClass("foo");
			$(".answersDiv").css("visibility", "hidden");
			$(".triangle").css("opacity", "0");
		});
		
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
	
	var makeClickReveal = function(theString){
	var searchPattern = new RegExp;
	searchPattern = /(\{\{)(\[)(.*?)(\])(.*?)(\}\})/g;
	var replacePattern = '<div class="clickMe inactive" data-id="$3">$5</div>';
	return theString.replace(searchPattern, replacePattern);
	}
	
	var makeTheReveals = function(theString){
		var searchPattern = new RegExp;
		var replacePattern;
		searchPattern = /(\@\@)(\[)(.*?)(\])(.*?)(\@\@)/g;
		
		if (closeButAppear==true){
            replacePattern = '<div class="showMeClone"  data-id="$3">$5<div class="closebtn  fa fa-times-circle"></div></div>';
            replacePattern += '<div class="showMe"  data-id="$3">$5<div class="closebtn  fa fa-times-circle"></div></div>';
           
            //console.log("********************************");
		}
		else{
             replacePattern = '<div class="showMeClone" data-id="$3">$5</div>';
			replacePattern += '<div class="showMe" data-id="$3">$5</div>';
           
			//console.log("********************************");
			
		}
		return theString.replace(searchPattern, replacePattern);
	};
	

	
	var processParts = function(parts_array){
		var theHTML = "";
		var centerWidth = 12;
		if ((parts_array[0]!='')&&(parts_array[0]!=null))
			centerWidth-=3;			
		if ((parts_array[2]!='')&&(parts_array[2]!=null))
			centerWidth-=3;
		var tempHTML = '';
		if ((parts_array[0]!='')&&(parts_array[0]!=null)){
			if ($.isArray(parts_array[0][0])){
				for (var i=0;i<parts_array[0].length;i++){
					tempHTML+='<div class="'+ parts_array[0][i][0]+'">' + parts_array[0][i][1] + '</div>';
				}
			}
			else{
				tempHTML = '<div class="'+ parts_array[0][0]+'">' + parts_array[0][1] + '</div>';
			}
			theHTML += '<div class="col-md-3">'+tempHTML+'</div>';
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
					else{
						tempHTML+='<div class="'+ ((parts_array[1][i]!='')&&(parts_array[1][i]!=null)?parts_array[1][i][0]:'')+'">' + ((parts_array[1][i]!='')&&(parts_array[1][i]!=null)?parts_array[1][i][1]:'') + '</div>';
					}
				}
			}
			else{
				tempHTML = '<div class="'+ ((parts_array[1]!='')&&(parts_array[1]!=null)?parts_array[1][0]:'')+'">' + ((parts_array[1]!='')&&(parts_array[1]!=null)?parts_array[1][1]:'') + '</div>';
			}
			theHTML += '<div class="col-md-'+centerWidth+'">'+tempHTML+'</div>';
		}
		tempHTML = '';
		if ((parts_array[2]!='')&&(parts_array[2]!=null)){
			if ($.isArray(parts_array[2][0])){
				for (var i=0;i<parts_array[2].length;i++){
					tempHTML+='<div class="'+ parts_array[2][i][0]+'">' + parts_array[2][i][1] + '</div>';
				}
			}
			else{
				tempHTML = '<div class="'+ parts_array[2][0]+'">' + parts_array[2][1] + '</div>';
			}
			theHTML += '<div class="col-md-3">'+tempHTML+'</div>';
		}
		if (theHTML!=""){
			theHTML = '<div class="row">'+theHTML+'</div>';
			if (theHTML.indexOf("clickReveal")>=0){
				theHTML=makeClickReveal(theHTML);	
			}
		}
		return theHTML;
	}
	
    var prepareDisplayContent = function(exerciseRef) {
		var theJSONElements = "";
		var activityParts = exerciseRef.activity;

		var activityPartsHTML="";		
		activityPartsHTML+=processParts(activityParts.header);
		activityPartsHTML+=processParts(activityParts.main);
		activityPartsHTML+=processParts(activityParts.footer);
		
		var tempString = makeClickReveal(activityPartsHTML);
		activityPartsHTML = makeTheReveals(tempString);
		
		
		if (audioFilename!=null){
           activityPartsHTML += '<div class="player"><audio id="audPlay"><source src="'+audioFilename+'.ogg" type="audio/ogg"><source src="'+audioFilename+'.mp3" type="audio/mpeg">Your browser does not support the audio element.</audio><div id="audioplayer"><button id="pButton" class="play"></button><button id="sButton" class="stop"></button><div id="timeline"><div id="playhead"></div></div></div></div>'
        }
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