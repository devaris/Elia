function MultipleChoice(exerciseRef, DOMposition, activitySelections, audioFilename) {

    //private properties
    var score = 0;
    var myHighlight;
    var mySignature = "multiple";
    var music; 
	var duration; 
	var pButton;
	var sButton;
	var playhead;
	var timeline; 
	var timelineWidth;
	var onplayhead = false;
    var mul_choice = this;
    var activityIndex = HTMLCollectionToArray(document.getElementsByClassName("activity")).indexOf(DOMposition.parentNode);

    //public properties
    this.exerciseRef = exerciseRef;

    //private constructor
    var __construct = function(that) {
		//alert("cookiJSON = "+JSON.stringify(spa.activityJSON))
		score = 0;
		myHighlight = 0;
		var xtraHTML = spa.checkExistenceOfXtraHTML(exerciseRef.activity);
		if (xtraHTML["before"]!="")
			DOMposition.appendChild(xtraHTML["before"]);
		var newDiv = document.createElement("DIV");
		newDiv.innerHTML = prepareMultipleChoiceContent(exerciseRef);
		DOMposition.appendChild(newDiv);
		if (xtraHTML["after"]!="")
			DOMposition.appendChild(xtraHTML["after"]);
		positionMultipleChoices();
		if ((exerciseRef.settings.dropDown) && (exerciseRef.settings.dropDown == true)&&(exerciseRef.settings.appearance.inlineChoices)&&(exerciseRef.settings.appearance.inlineChoices==true)) {
			rePositionMultipleChoices();
		}
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
    
    var prepareMultipleChoiceContent = function(exerciseRef) {
		var theJSONElements = "";
		var countCorrect;
		var itemType;
		var exItems = exerciseRef.activity.items;
		var selectedAttr;
		var myClass;
		var markCorrClass;
		var markWronClass;
		var selectionObj;
		var thisIsAnExample;
		var markExistence = (exerciseRef.settings.markExistence ? exerciseRef.settings.markExistence : false);
		var showInput = (exerciseRef.settings.appearance.showInput ? exerciseRef.settings.appearance.showInput : false);
		var selectedClass = false;
		
		var freturn = "";
		var newAnswer = "";
		var searchPattern = new RegExp;
		var theImagesPath = exerciseRef.settings.path;
		var locaImagesPath =  theImagesPath ? theImagesPath : window.location.pathname.substr(0, window.location.pathname.lastIndexOf("/")+1) + "images/" ;
	
		//alert(x.length);
		mul_choice.exerciseRef = exerciseRef;
		theJSONElements += '<ul class="SourceItems leftAlign">';
		for (i = 0; i < exItems.length; i++)
		{
			thisIsAnExample = false;
			countCorrect = 0;
			theJSONElements += '<li id="tf' + (i + 1) + '"><ul class="TrueFalse"';
			var myText = localizeText(exItems[i].stem, spa.myLang);
			var myAnswers = localizeText(exItems[i].answers, spa.myLang);
			if (myAnswers.length == 0) {
				myAnswers = localizeText(exItems[0].answers, spa.myLang);
			}
			var myCorrectAnswers = exItems[i].correct;
			countCorrect = myCorrectAnswers.length;
			theJSONElements += ' data-corrects=' + countCorrect;
			if (exItems[i].any_answer) {
				theJSONElements += ' data-any_answer="true"';
			}
			if ((exItems[i].example) && (exItems[i].example == true)) {
				thisIsAnExample = true;
				theJSONElements += ' data-example="true"';
			}
			theJSONElements += '><li class="stem"><span>' + myText + '</span></li>';
			if (activitySelections[i] == undefined) {
				if (countCorrect > 1) {
					activitySelections[i] = [];
					selectionObj = {"value": false, "checked": false};
					for (j = 0; j < myAnswers.length; j++) {
						activitySelections[i].push(selectionObj);
					}
				}
				else {
					selectionObj = {"value": -1, "checked": false};
					activitySelections[i] = selectionObj;
				}
	   		}
			selectedAttr = activitySelections[i];
			if ((exerciseRef.settings.dropDown) && (exerciseRef.settings.dropDown == true)) {
				var textCorrect = "";
				theJSONElements += '<li class="functionality"><select ' + 'name="mul' + i + '"';
				theJSONElements += thisIsAnExample ? ' disabled ' : ' ';
				theJSONElements += ' class="checkDefault" ';
				theJSONElements += '>';
				markCorrClass = "hideMe";
				markWronClass = "hideMe";
				for (j = 0; j < myAnswers.length; j++)
				{
					var IamCorrect = false;
					textCorrect = "";
					myClass = 'checkDefault';
					for (var k = 0; k < countCorrect; k++) {
						if (myCorrectAnswers[k] == j) {
							IamCorrect = true;
							textCorrect = ' data-iscorrect=true ';
						}
					}
					theJSONElements += '<option value="' + j + '" ' + textCorrect;
					if (countCorrect > 1) {
						if (selectedAttr[j].value == true) {
							theJSONElements += ' selected';
							if (selectedAttr[j].checked == true) {
								if (IamCorrect == true) {
									myClass = 'checkCorrect';
									if (markExistence == true) {
										markCorrClass = "showMe";
										markWronClass = "hideMe";
									}
								}
								else {
									myClass = 'checkWrong';
									if (markExistence == true) {
										markCorrClass = "hideMe";
										markWronClass = "showMe";
										if (j == 0) {
											markWronClass = "hideMe";
										}
									}
								}
							}
						}
						else {
							myClass = 'checkDefault';
							if (IamCorrect && thisIsAnExample) {
								theJSONElements += ' selected';
							}
						}
					}
					else {
						if (j == selectedAttr.value) {
							theJSONElements += ' selected';
							if (selectedAttr.checked == true) {
								if (IamCorrect) {
									myClass = 'checkCorrect';
									if (markExistence == true) {
										markCorrClass = "showMe";
										markWronClass = "hideMe";
									}
								}
								else {
									myClass = 'checkWrong';
									if (markExistence == true) {
										markCorrClass = "hideMe";
										markWronClass = "showMe";
										if (j == 0) {
											markWronClass = "hideMe";
										}
									}
								}
							}
						}
						else {
							myClass = 'checkDefault';
							if (IamCorrect && thisIsAnExample) {
								theJSONElements += ' selected';
							}
						}
					}
					theJSONElements += ' class="'+myClass+'"';
					theJSONElements += '>' + myAnswers[j];
					theJSONElements += '</option>';
				}
				theJSONElements += '</select></li>';
				//theJSONElements += '<li class="marks"><img class="mymark '+markCorrClass+'" src="'+spa.LAYOUT_PATH+'corr.png" width="30" height="30"><img class="mymark '+markWronClass+'" src="'+spa.LAYOUT_PATH+'wron.png" width="30" height="30"></li>';
				theJSONElements += '<li class="marks' + (markExistence == false ? ' hideMe' : '') + '"><img class="mymark ' + markCorrClass + '" src="' + spa.ACTIVITIES_GRAPHICS_PATH + 'corr.png" width="30" height="30"><img class="mymark ' + markWronClass + '" src="' + spa.ACTIVITIES_GRAPHICS_PATH + 'wron.png" width="30" height="30"></li>';
				if ((exerciseRef.settings.typeOfCheck.type) && (exerciseRef.settings.typeOfCheck.type == "individual")) {
					theJSONElements += '<img class="myCheck" ' + 'src="' + spa.CHECK_ICON + '" >';
				}
			}
			else {
				theJSONElements += '<li><ul>';
				if ((countCorrect > 1) || (exItems[i].checkbox)) {
					itemType = "checkbox";
				}
				else {
					itemType = "radio";
				}
				for (j = 0; j < myAnswers.length; j++)
				{
					myClass = 'checkWrong';
					markCorrClass = "hideMe";
					markWronClass = "showMe";
					if ((exerciseRef.settings.typeOfCheck.type) && (exerciseRef.settings.typeOfCheck.type == "submit")) {
						if ((exerciseRef.settings.typeOfCheck.checkButton) && (exerciseRef.settings.typeOfCheck.checkButton == true)) {
							theJSONElements += '<li>' + '<input name="mul' + i + '" type="' + itemType + '"';
						}
						else {
							document.getElementById("checkAnswers").style.display = "none";
						}
					}
					else {
						theJSONElements += '<li>' + '<input name="mul' + i + '" type="' + itemType + '"';
						document.getElementById("checkAnswers").style.display = "none";
					}
					for (var k = 0; k < countCorrect; k++) {
						if (myCorrectAnswers[k] == j) {
							theJSONElements += ' data-iscorrect=true';
							myClass = 'checkCorrect';
							markCorrClass = "showMe";
							markWronClass = "hideMe";
							if (thisIsAnExample) {
								theJSONElements += ' checked disabled';
								myClass = '';
								markCorrClass = "hideMe";
								markWronClass = "hideMe";
							}
						}
						else {
							if (thisIsAnExample) {
								theJSONElements += ' disabled';
								myClass = '';
								markCorrClass = "hideMe";
								markWronClass = "hideMe";
							}
						}
					}
					if (!thisIsAnExample) {
						if (countCorrect > 1) {
							if (selectedAttr[j].value == true) {
								theJSONElements += ' checked';
								if (selectedAttr[j].checked == false) {
									myClass = '';
									selectedClass = true;
									markCorrClass = "hideMe";
									markWronClass = "hideMe";
								}
							}
							else {
								myClass = '';
								markCorrClass = "hideMe";
								markWronClass = "hideMe";
							}
						}
						else {
							if (j == selectedAttr.value) {
								theJSONElements += ' checked';
								if (selectedAttr.checked == false) {
									myClass = '';
									selectedClass = true;
									markCorrClass = "hideMe";
									markWronClass = "hideMe";
								}
							}
							else {
								myClass = '';
								markCorrClass = "hideMe";
								markWronClass = "hideMe";
							}
						}
					}
					//theJSONElements += ' />'+'<span'+myClass+'>'+ myAnswers[j]+'<img class="imageChoicePos" src="'+myAnswers[j]+'" alt="'+myAnswers[j]+'"><img class="mymark '+markCorrClass+'" src="'+spa.LAYOUT_PATH+'corr.png" width="30" height="30"><img class="mymark '+markWronClass+'" src="'+spa.LAYOUT_PATH+'wron.png" width="30" height="30"></span>'+'</li>'
					if (showInput==true) {
						theJSONElements += ' />';
					}
					else {
						theJSONElements += ' class="hideMe"/>';
					}
					theJSONElements += '<span>';
					
					newAnswer = myAnswers[j];					
					if (myAnswers[j].indexOf("@@") >= 0 ){
						selectedClass = (selectedClass == true?' imageSelected':'');
						
						searchPattern = /(.*?)@@(.*?)@@(\d+)@@(\d+)/g;
						replacePattern = '<img class="imageChoicePos '+myClass+selectedClass+'" src="' + locaImagesPath + '$1.$2' + '" alt="$1.$2" width="$3" height="$4" >';
						newAnswer = newAnswer.replace(searchPattern, replacePattern);
						
						theJSONElements += newAnswer;
						
					}
					else{
						selectedClass = (selectedClass == true?' textSelected':'');
						theJSONElements += '<span' + ' class="' + myClass + selectedClass + '" >' + myAnswers[j] + '</span>';
					}
					
					//theJSONElements += '<img class="mymark '+markCorrClass+'" src="'+spa.LAYOUT_PATH+'corr.png" width="30" height="30"><img class="mymark '+markWronClass+'" src="'+spa.LAYOUT_PATH+'wron.png" width="30" height="30">';			
					theJSONElements += '<img class="mymark ' + (markExistence == false ? 'hideMe' : markCorrClass) + '" src="' + spa.ACTIVITIES_GRAPHICS_PATH + 'corr.png" width="30" height="30"><img class="mymark ' + (markExistence == false ? 'hideMe' : markWronClass) + '" src="' + spa.ACTIVITIES_GRAPHICS_PATH + 'wron.png" width="30" height="30">';
					theJSONElements += '</span>' + '</li>';
				}
				theJSONElements += '</ul></li>';
				if ((exerciseRef.settings.typeOfCheck.type) && (exerciseRef.settings.typeOfCheck.type == "individual")) {
					theJSONElements += '<img class="myCheck" ' + 'src="' + spa.CHECK_ICON + '" >';
				}
			}
	    	theJSONElements += '</ul></li>';
		}

		theJSONElements += '</ul>';
        if ((audioFilename!=null)&&(mul_choice.exerciseRef.settings.autoPlayAudio!="empty")){
           theJSONElements += '<div class="player"><audio id="audPlay"><source src="'+audioFilename+'.ogg" type="audio/ogg"><source src="'+audioFilename+'.mp3" type="audio/mpeg">Your browser does not support the audio element.</audio><div id="audioplayer"><button id="pButton" class="play"></button><button id="sButton" class="stop"></button><div id="timeline"><div id="playhead"></div></div></div></div>'
        }

		return theJSONElements;
	};
	
	var rePositionMultipleChoices = function() {
		var allTFDivs = DOMposition.querySelectorAll(".SourceItems > li > .TrueFalse");
		var textSpans = DOMposition.querySelectorAll("span.words");
		var actNo = activityIndex;
		var ml=allTFDivs.length;
		var markExistence = (exerciseRef.settings.markExistence ? exerciseRef.settings.markExistence : false);
		for (i = ml; i > 0; i--) {
			//var myTF = allTFDivs[i-1].parentNode.removeChild(allTFDivs[i-1]);
			var myTF = allTFDivs[i-1].parentNode.innerHTML;
			/*textSpans[i-1].innerHTML = "";*/
			//textSpans[i-1].appendChild(myTF);
			textSpans[i-1].innerHTML = myTF;
			textSpans[i-1].id = "tf"+i;
			DOMposition.querySelector("#tf"+i+"> .TrueFalse").style.display="inline";
		}
		DOMposition.querySelector(".SourceItems").parentNode.parentNode.removeChild(DOMposition.querySelector(".SourceItems").parentNode);
		for (i = ml; i > 0; i--) {
			allTFDivs[i-1].style.display="inline";
			DOMposition.querySelectorAll(".stem")[i-1].style.display="inline";
			DOMposition.querySelectorAll(".functionality")[i-1].style.display="inline";
			DOMposition.querySelectorAll(".marks")[i-1].style.display=(markExistence?"inline":"none");
		}
		DOMposition.querySelector("#tf1").parentNode.className += " SourceItems";
	}

    var positionMultipleChoices = function() {
		var allTFDivs = DOMposition.getElementsByClassName("TrueFalse");
		var actNo = activityIndex;
		for (i = 0; i < allTFDivs.length; i++) {
			if ((exerciseRef.settings.dropDown) && (exerciseRef.settings.dropDown == true)) {
				allTFDivs[i].className += " DropDown";
				var mySelect = allTFDivs[i].getElementsByTagName("select")[0];
				var corrects = mySelect.getElementsByClassName("checkCorrect").length;
				var wrongs = mySelect.getElementsByClassName("checkWrong").length;
				if (corrects > 0) {
					mySelect.className = "checkCorrect";
				}
				if (wrongs > 0) {
					mySelect.className = "checkWrong";
				}
			}
			else {
				if (((get_browser()=="Netscape")&&(get_browser_version().indexOf("Windows NT")>0))||(get_browser()=="Microsoft Internet Explorer")){
					if (($(allTFDivs[i].parentNode).css('list-style-type')!="none")&&($(allTFDivs[i].parentNode).css('list-style-type')!="")){
						allTFDivs[i].style.marginTop = "-30px";
					}
				}
				if ((exerciseRef.settings.appearance.tableChoices) && (exerciseRef.settings.appearance.tableChoices == true)) {
					var myChoices = allTFDivs[i].querySelectorAll(".TrueFalse > li > ul > li");
					var totalInBetweensWidth = 5 * myChoices.length;
					var listItemWidth = 100 / myChoices.length;
					for (j = 0; j < myChoices.length; j++) {
						myChoices[j].className += " floatLeft";
						myChoices[j].style.width = ((100 - totalInBetweensWidth) / myChoices.length) + "%";
					}
				}
			}
		}
    };

	var assignCode = function() {
		var myChoices;
		var allTFDivs = DOMposition.getElementsByClassName("TrueFalse");
		if ((mul_choice.exerciseRef.settings.dropDown) && (mul_choice.exerciseRef.settings.dropDown == true)) {
			for (i = 0; i < allTFDivs.length; i++) {
				if (mul_choice.exerciseRef.settings.typeOfCheck.type == "individual"){
					allTFDivs[i].querySelector(".myCheck").addEventListener("click", function() {
						var temp = mul_choice.checkAnswers(this);
						spa.getScore(mul_choice, temp);
						spa.updateScore();
					});
				}
				var mySelect = allTFDivs[i].querySelector("select");				
				mySelect.addEventListener("change", function() {
					if ((mul_choice.exerciseRef.settings.typeOfCheck.type) && ((mul_choice.exerciseRef.settings.typeOfCheck.type == "submit")||(mul_choice.exerciseRef.settings.typeOfCheck.type == "individual"))) {
						if ((mul_choice.exerciseRef.settings.typeOfCheck.checkButton) && (mul_choice.exerciseRef.settings.typeOfCheck.checkButton == true)) {
							hideAnswers(this);
							spa.saveCookie();
						}
						else{
							var temp = mul_choice.checkAnswers(this);
							spa.getScore(mul_choice, temp);
							spa.updateScore();
						}
					}
					else{
						var temp = mul_choice.checkAnswers(this);
						spa.getScore(mul_choice, temp);
						spa.updateScore();
					}
				});
	    	}
		}
		else {
			for (i = 0; i < allTFDivs.length; i++) {
				if (mul_choice.exerciseRef.settings.typeOfCheck.type == "individual"){
					allTFDivs[i].querySelector(".myCheck").addEventListener("click", function() {
						var temp = mul_choice.checkAnswers(this);
						spa.getScore(mul_choice, temp);
						spa.updateScore();
					});
				}
				var myChoices = allTFDivs[i].querySelectorAll(".TrueFalse > li > ul > li > span");
				for (j = 0; j < myChoices.length; j++) {
					myChoices[j].childNodes[0].addEventListener("click", function() {
						mul_choice.checkAnswersImg(this);
					});
				}
			}
			DOMposition.getElementsByClassName("SourceItems")[0].addEventListener("click", function(e) {
				var eventTarget = eventTargetAllBr(e);
				if (eventTarget && eventTarget.nodeName == "INPUT") {
					// List item found!  Output the ID!
					if ((mul_choice.exerciseRef.settings.typeOfCheck.type) && ((mul_choice.exerciseRef.settings.typeOfCheck.type == "submit")||(mul_choice.exerciseRef.settings.typeOfCheck.type == "individual"))) {
						if ((mul_choice.exerciseRef.settings.typeOfCheck.checkButton) && (mul_choice.exerciseRef.settings.typeOfCheck.checkButton == true)) {
							hideAnswers(eventTarget);
							spa.saveCookie();
						}
					}
					else {
						var temp = mul_choice.checkAnswers(eventTarget);
						spa.getScore(mul_choice, temp);
						spa.updateScore();
						//console.log("List item ",eventTarget.id.replace("post-")," was clicked!");
					}
				}
			});
		}
        if ((audioFilename!=null)&&(mul_choice.exerciseRef.settings.autoPlayAudio!="empty")){
            /* Added audio support... */ 
            if (exerciseRef.settings.hideTimebar){
                DOMposition.querySelector('#timeline').className += "hideItem"
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
        }
    };

    var hideAnswers = function(elem) {
		var x, z, o, i, j;
		var dropDown = false, cleanOnClick;
		if ((mul_choice.exerciseRef.settings.dropDown) && (mul_choice.exerciseRef.settings.dropDown == true)) {
			dropDown = true;
		}
		cleanOnClick = mul_choice.exerciseRef.settings.typeOfCheck.cleanOnClick;

		switch (cleanOnClick) {
			case "all":
				x = (dropDown ? DOMposition.querySelectorAll(".TrueFalse") : DOMposition.querySelectorAll("input"));
				z = (dropDown ? DOMposition.querySelectorAll("select") : DOMposition.querySelectorAll("span"));
				break;
			case "selection":
				if (elem == undefined) {
					x = (dropDown ? DOMposition.querySelectorAll(".TrueFalse") : DOMposition.querySelectorAll("input"));
					z = (dropDown ? DOMposition.querySelectorAll("select") : DOMposition.querySelectorAll("span"));
				}
				else {
					if (dropDown) {
						x = [];
						if (hasClass(elem.parentNode, "functionality")){
							x.push(elem.parentNode.parentNode);
						}
						else{
							x.push(elem.parentNode);
						}
						z = [];
						z.push(elem);
					}
					else {
						x = elem.parentNode.parentNode.getElementsByTagName("input");
						z = elem.parentNode.parentNode.getElementsByTagName("span");
					}
				}
				break;
			default:
				x = (dropDown ? DOMposition.querySelectorAll(".TrueFalse") : DOMposition.querySelectorAll("input"));
				z = (dropDown ? DOMposition.querySelectorAll("select") : DOMposition.querySelectorAll("span"));
		}		

		if (dropDown) {
			for (var k = 0; k < z.length; k++) {
				z[k].className = "checkDefault";
				y = $(x[k].getElementsByTagName("option"));
				o = x[k].getElementsByTagName("img");
				for (var j = 0; j < y.length; j++) {
					y[j].className = "checkDefault";
					if (($(y[j]).prop("checked")&&($(y[j]).prop("checked")==true))||($(y[j]).prop("selected")&&($(y[j]).prop("selected")==true))) {						
						if (getDataAttribute(x[k], "corrects") > 1) {
							activitySelections[x[k].parentNode.id.substring(2) - 1][j].value = true;
							activitySelections[x[k].parentNode.id.substring(2) - 1][j].checked = false;
						}
						else {
							activitySelections[x[k].parentNode.id.substring(2) - 1].value = j;
							activitySelections[x[k].parentNode.id.substring(2) - 1].checked = false;
						}
					}
				}
				$(o[0]).removeClass("showMe");
				$(o[0]).addClass("hideMe");
				$(o[1]).removeClass("showMe");
				$(o[1]).addClass("hideMe");
			}
		}
		else {
			for (i = 0; i < x.length; i++) {
				$(x[i].nextElementSibling.childNodes[0]).removeClass("textSelected");
				$(x[i].nextElementSibling.childNodes[0]).removeClass("imageSelected");
				$(x[i].nextElementSibling.childNodes[0]).removeClass("checkCorrect");
				$(x[i].nextElementSibling.childNodes[0]).removeClass("checkWrong");
				$(x[i].nextElementSibling).removeClass("showAllCorrect");
				/*
				 $(x[i].nextElementSibling[1]).removeClass("showMe");
				 $(x[i].nextElementSibling[1]).addClass("hideMe");
				 $(x[i].nextElementSibling[2]).removeClass("showMe");
				 $(x[i].nextElementSibling[2]).addClass("hideMe");
				 */
			}
			switch (cleanOnClick) {
				case "all":
					x = DOMposition.querySelectorAll(".TrueFalse");
					break;
				case "selection":
					if (elem == undefined) {
						x = DOMposition.querySelectorAll(".TrueFalse");
					}
					else {
						x = [];
						if (hasClass(elem, "myCheck")){
							x.push(elem.parentNode);
						}
						else{
							x.push(elem.parentNode.parentNode.parentNode.parentNode);
						}
					}
					break;
				default:
					x = DOMposition.querySelectorAll(".TrueFalse");
	    	}
			for (k = 0; k < x.length; k++) {
				y = $(x[k].getElementsByTagName("input"));
				//z=$(x[k].getElementsByTagName("span"));
				for (var j = 0; j < y.length; j++) {
					o = y[j].nextElementSibling.querySelectorAll(".mymark");
					//z[j].getElementsByTagName("img");	
					if (($(y[j]).prop("checked")) || ($(y[j]).prop("selected"))) {
						
						if (y[j].nextElementSibling.childNodes[0].tagName == "SPAN"){
							y[j].nextElementSibling.childNodes[0].className += " textSelected";
						}
						else {
							y[j].nextElementSibling.childNodes[0].className += " imageSelected";
						}
						//////////////////selectedClass = (selectedClass == true?' textSelected':'');
												
						if (getDataAttribute(x[k], "corrects") > 1) {
							activitySelections[x[k].parentNode.id.substring(2) - 1][j].value = true;
							activitySelections[x[k].parentNode.id.substring(2) - 1][j].checked = false;
						}
						else {
							activitySelections[x[k].parentNode.id.substring(2) - 1].value = j;
							activitySelections[x[k].parentNode.id.substring(2) - 1].checked = false;
						}
					}
					else {
						if (getDataAttribute(x[k], "corrects") > 1) {
							activitySelections[x[k].parentNode.id.substring(2) - 1][j].value = false;
							activitySelections[x[k].parentNode.id.substring(2) - 1][j].checked = false;
						}
					}
					$(o[0]).removeClass("showMe");
					$(o[0]).addClass("hideMe");
					$(o[1]).removeClass("showMe");
					$(o[1]).addClass("hideMe");
				}
	    	}
		}
    };

	var eventTargetAllBr = function(e) {
		var elem, evt = e ? e : event;
		if (evt.srcElement)
			elem = evt.srcElement;
		else if (evt.target)
			elem = evt.target;
		return elem;
	};

    var pressed = false;

    /*var showAnswers = function() {
     var coll = "";
     var loops = "";
     if (!pressed) {
     pressed = true;
     } else {
     pressed = false;
     }
     };*/
	 
	 var enableActivity = function() {
		//alert("disable all")
		var dropDown = false, cleanOnClick;
		if ((mul_choice.exerciseRef.settings.dropDown) && (mul_choice.exerciseRef.settings.dropDown == true)) {
			dropDown = true;
		}
		if (dropDown == true) {
			var allSelects = DOMposition.querySelectorAll("select");
			for (var i = 0; i < allSelects.length; i++) {
        		var myElem = allSelects[i].parentNode;
				while(hasClass(myElem, "TrueFalse")==false)
				{
					myElem = myElem.parentNode;
				}
				if (getDataAttribute(myElem, "example")==="true"){
				}
				else{
					allSelects[i].removeAttribute('disabled');
				}
			}	
			//clearAttrs(DOMposition.querySelectorAll("select"), 'disabled');
		}
		else {
			var allInputs = DOMposition.querySelectorAll("input");
			for (var i = 0; i < allInputs.length; i++) {
        		var myElem = allInputs[i].parentNode;
				while(hasClass(myElem, "TrueFalse")==false)
				{
					myElem = myElem.parentNode;
				}
				if (getDataAttribute(myElem, "example")==="true"){
				}
				else{
					allInputs[i].removeAttribute('disabled');
					clearAttrs(myElem.querySelectorAll("ul li"), 'style', 'cursor:pointer');
    			}
			}			
			//clearAttrs(DOMposition.querySelectorAll("input"), 'disabled');
			//clearAttrs(DOMposition.querySelectorAll("ul li"), 'style', 'cursor:pointer');
			
			if ((mul_choice.exerciseRef.settings.appearance.tableChoices) && (mul_choice.exerciseRef.settings.appearance.tableChoices == true)) {
				var allTFDivs = DOMposition.getElementsByClassName("TrueFalse");
				for (i = 0; i < allTFDivs.length; i++) {
					var myChoices = allTFDivs[i].querySelectorAll(".TrueFalse > li > ul > li");
					var totalInBetweensWidth = 5 * myChoices.length;
					var listItemWidth = 100 / myChoices.length;
					for (j = 0; j < myChoices.length; j++) {
						//myChoices[j].className += " floatLeft";
						myChoices[j].style.width = ((100 - totalInBetweensWidth) / myChoices.length) + "%";
					}
				}
			}
		}
    };

    //public functions
    this.disableActivity = function() {
		//alert("disable all")
		var dropDown = false, cleanOnClick;
		if ((mul_choice.exerciseRef.settings.dropDown) && (mul_choice.exerciseRef.settings.dropDown == true)) {
			dropDown = true;
		}
		if (dropDown == true) {
			setAttrs(DOMposition.querySelectorAll("select"), 'disabled', 'disabled');
		}
		else {
			setAttrs(DOMposition.querySelectorAll("input"), 'disabled', 'disabled');
			setAttrs(DOMposition.querySelectorAll("ul li"), 'style', 'cursor:default');
			if ((mul_choice.exerciseRef.settings.appearance.tableChoices) && (mul_choice.exerciseRef.settings.appearance.tableChoices == true)) {
				var allTFDivs = DOMposition.getElementsByClassName("TrueFalse");
				for (i = 0; i < allTFDivs.length; i++) {
					var myChoices = allTFDivs[i].querySelectorAll(".TrueFalse > li > ul > li");
					var totalInBetweensWidth = 5 * myChoices.length;
					var listItemWidth = 100 / myChoices.length;
					for (j = 0; j < myChoices.length; j++) {
						//myChoices[j].className += " floatLeft";
						myChoices[j].style.width = ((100 - totalInBetweensWidth) / myChoices.length) + "%";
					}
				}
			}
		}
    };

    this.checkAnswersImg = function(myImg) {
		var myInput = $(myImg.parentNode.parentNode.getElementsByTagName("input"))[0];
		myInput.click();
		//checkAnswers()
    };

	this.checkAnswers = function(myItem) {
		var qScore;
		var allTF, mySelections, tfSpans, myImages;
		score = 0;
		hideAnswers(myItem);
		var mistakes;
		var examples = 0;
		var dropDown = false;
		var markExistence = (mul_choice.exerciseRef.settings.markExistence ? mul_choice.exerciseRef.settings.markExistence : false);
		if ((mul_choice.exerciseRef.settings.dropDown) && (mul_choice.exerciseRef.settings.dropDown == true)) {
			dropDown = true;
			if (this.index == 0) {
				return;
			}
		}
		allTF = DOMposition.querySelectorAll(".TrueFalse");
		allSelect = DOMposition.querySelectorAll("select");
		//alert("cookiJSON = "+JSON.stringify(spa.activityJSON))
		for (var i = 0; i < allTF.length; i++) {
			qScore = 0;
			mistakes = 0;
			/*if (dropDown == true) {
				allSelect[i].className = "checkDefault";
			}*/
			if (getDataAttribute(allTF[i], "example") == undefined) {
				if (dropDown == true) {
		    		mySelections = $(allTF[i].getElementsByTagName("option"));
				}
				else {
					mySelections = $(allTF[i].getElementsByTagName("input"));
					tfSpans = $(allTF[i].querySelectorAll(".TrueFalse > li > ul > li > span"));
				}
				for (var j = 0; j < mySelections.length; j++) {
					if (getDataAttribute(allTF[i], "corrects") > 1) {
						activitySelections[i][j].value = false;
						activitySelections[i][j].checked = false;
					}
					/*if (dropDown == true) {
						mySelections[j].className = "checkDefault";
					}*/
					if (($(mySelections[j]).prop("checked")) || ($(mySelections[j]).prop("selected"))) {
						if ((mul_choice.exerciseRef.settings.typeOfCheck.type != "individual")||((mul_choice.exerciseRef.settings.typeOfCheck.type == "individual")&&(myItem.parentNode==allTF[i]))){
							if (getDataAttribute(allTF[i], "corrects") > 1) {
								activitySelections[i][j].value = true;
								activitySelections[i][j].checked = true;
							}
							else {
								activitySelections[i].value = j;
								activitySelections[i].checked = (dropDown && j == 0 ? false : true);
								activitySelections[i].selected = (dropDown && j == 0 ? false : true);
							}
							if (getDataAttribute(mySelections[j], "iscorrect")) {
								if (dropDown) {
									myImages = $(allTF[i].getElementsByTagName("img"));
									if (j != 0) {
										mySelections[j].className = "checkCorrect";									
										mySelections[j].parentNode.className = "checkCorrect";
									}
								}
								else {
									$(mySelections[j].nextElementSibling.childNodes[0]).removeClass("textSelected");
									$(mySelections[j].nextElementSibling.childNodes[0]).removeClass("imageSelected");
									$(mySelections[j].nextElementSibling.childNodes[0]).addClass("checkCorrect");
									myImages = $(tfSpans[j].querySelectorAll(".mymark"));
								}
								if (markExistence == true) {
									$(myImages[0]).removeClass("hideMe");
									$(myImages[0]).addClass("showMe");
									if (dropDown == true) {
										$(myImages[1]).removeClass("showMe");
										$(myImages[1]).addClass("hideMe");
									}
								}
								qScore++;
								if (mySelections[j] == myItem) {
									audioCorrect();
								}
							}
							else {
								if (dropDown == true) {
									myImages = $(allTF[i].getElementsByTagName("img"));
									if (j != 0) {
										mySelections[j].className = "checkWrong";
										mySelections[j].parentNode.className = "checkWrong";
									}
								}
								else {
									$(mySelections[j].nextElementSibling.childNodes[0]).removeClass("textSelected");
									$(mySelections[j].nextElementSibling.childNodes[0]).removeClass("imageSelected");
									$(mySelections[j].nextElementSibling.childNodes[0]).addClass("checkWrong");
									myImages = $(tfSpans[j].querySelectorAll(".mymark"));
								}
								if (markExistence == true) {
									$(myImages[1]).removeClass("hideMe");
									$(myImages[1]).addClass("showMe");
									if (dropDown == true) {
										$(myImages[0]).removeClass("showMe");
										$(myImages[0]).addClass("hideMe");
										if (mySelections[j].index == 0) {
											$(myImages[1]).removeClass("showMe");
											$(myImages[1]).addClass("hideMe");
										}
									}
								}
								if (getDataAttribute(allTF[i], "any_answer")) {
									if ((dropDown != true) || (mySelections[j].index != 0)) {
										mistakes++;
									}
								}
								else
								{
									if ((dropDown != true) || (mySelections[j].index != 0)) {
										qScore--;
									}
								}
								if (mySelections[j] == myItem) {
									if ((dropDown != true) || (mySelections[j].index != 0)) {
										audioWrong();
									}
								}
							}
						}
						else{
							if (getDataAttribute(mySelections[j], "iscorrect")) {
								qScore++;
							}
							else {
								if (getDataAttribute(allTF[i], "any_answer")) {
									if ((dropDown != true) || (mySelections[j].index != 0)) {
										mistakes++;
									}
								}
								else
								{
									if ((dropDown != true) || (mySelections[j].index != 0)) {
										qScore--;
									}
								}
							}
						}
		    		}
				}
				if (qScore / getDataAttribute(allTF[i], "corrects") < 1) {
					if (getDataAttribute(allTF[i], "any_answer")) {
						if (mistakes > 0) {
							qScore = 0;
						}
					}
					else {
						qScore = 0;
					}
				}
				else {
					qScore = 1;
					if (getDataAttribute(allTF[i], "any_answer")) {
						if (mistakes > 0) {
							qScore = 0;
						}
					}
				}
				score = score + qScore;
			}
			else {
				examples++;
			}
		}

		var theItems = mul_choice.exerciseRef.activity.items;
		//$("#myScorePerc").val(Math.round((score/theItems.length)*100) + '%')
		//alert (Math.round((score/theItems.length)*100) + '%')
		//updateMain(this);
		var percentage = Math.round((score / (theItems.length - examples)) * 100);
		if (percentage == 100) {
			audioCorrect();
		} else {
			audioWrong();
		}
		var temp = {"score": score, "percentage": percentage};
		return temp;
	};

    var pressed = false;
    var previousDropDownChoicesIndex = [];
    this.showAnswers = function() {
		var dropDown = false;
		if ((mul_choice.exerciseRef.settings.dropDown) && (mul_choice.exerciseRef.settings.dropDown == true)) {
			dropDown = true;
		}
		if (!dropDown) {
			//m/c
			var x = DOMposition.querySelectorAll("input");
			//$("ul.SourceItems input[data-iscorrect='true']").addClass("showAll");
			if (!pressed) {
				pressed = true;
				for (i = 0; i < x.length; i++) {
					if (getDataAttribute(x[i], "iscorrect")) {
						var myElem = x[i].parentNode;
						while(hasClass(myElem, "TrueFalse")==false)
						{
							myElem = myElem.parentNode;
						}
						if (getDataAttribute(myElem, "example")==="true"){
						}
						else{
							$(x[i].nextElementSibling.childNodes[0]).addClass("showAllCorrect");
						}
					}
				}
				mul_choice.disableActivity();
			} else {
				pressed = false;
				x = DOMposition.querySelectorAll(".showAllCorrect");
				for (i = 0; i < x.length; i++) {
					$(x[i]).removeClass("showAllCorrect");
				}
				enableActivity();
			}
		} else {
			//dd
			var allOptions = DOMposition.querySelectorAll("option");
			//var y = DOMposition.querySelectorAll("select.checkDefault");
			var allSelects = DOMposition.querySelectorAll("select");
			if (!pressed) {
				pressed = true;
				for (var i = 0; i < allSelects.length; i++) {
					
					var myElem = allSelects[i].parentNode;
					while(hasClass(myElem, "TrueFalse")==false)
					{
						myElem = myElem.parentNode;
					}
					if (getDataAttribute(myElem, "example")==="true"){
					}
					else{					
						previousDropDownChoicesIndex.push(allSelects[i].selectedIndex);
						$(allSelects).addClass("showAllCorrect");
						for (var l = 0; l < allSelects[i].querySelectorAll("option").length; l++) {
							if (getDataAttribute(allSelects[i][l], "iscorrect")) {
								allSelects[i].selectedIndex = l;
								//$(allSelects[i]).addClass("showAllCorrect");
							}
						}
					}
				}
				mul_choice.disableActivity();
			} else {
				pressed = false;
				for (var i = 0; i < allSelects.length; i++) {
					var myElem = allSelects[i].parentNode;
					while(hasClass(myElem, "TrueFalse")==false)
					{
						myElem = myElem.parentNode;
					}
					if (getDataAttribute(myElem, "example")==="true"){
					}
					else{
						$(allSelects).removeClass("showAllCorrect");
						allSelects[i].selectedIndex = previousDropDownChoicesIndex[i];
						$(allSelects[i]).removeClass("showAllCorrect");
					}
				}
				previousDropDownChoicesIndex = [];
				enableActivity();
			}
		}
    };

    //initialize Object....
    __construct(this);
}