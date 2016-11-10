function Underline(exerciseRef, DOMposition, activitySelections){
	
	// CREATE TypeIn Activity Content ******************************************
	
	var createUnderlineActivityContent = function(exerciseRef){

		var freturn = "";
		var isList = false;
		var searchPattern = new RegExp;
		searchPattern = /(\{\{)(.*?)(\}\})/g;
		
		var searchPattern2 = new RegExp;
		searchPattern2 = /(\(\()(.*?)(\)\))/g;
		
		var theContent = exerciseRef.activity.contents.htmlData;
		
		var replacePattern = '<span class="active unchecked correct" type="text">$2</span>';

		var replacePattern2 = '<span class="active unchecked wrong" type="text">$2</span>';
		
		
		if (theContent.search("\t") >=0) {
			isList = true;
			
		}
		
		var newContent = theContent.replace(searchPattern, replacePattern);		
		var newContent = newContent.replace(searchPattern2, replacePattern2);	
		if (isList) {
			newContent = newContent.split("\t");
			var newHTML = '<span class="actText"><ul class="SourceItems">';
			for (var i=0; i<newContent.length; i++){
				//an einai lista. an den einai lista ayto den einai aparaithto!!
				newHTML = newHTML +'<li><span>' + newContent[i] + "</span></li>";
			}
			newHTML = newHTML +  " </ul></span>";
		} else {
			newHTML = '<span class="actText">' + newContent + '</span>';
		}		
		
		freturn = newHTML;
		return freturn;
	}
	
	// While TYPING functions **************************************************
	
	// PRIVATE
	
	//if the strict mode is enabled, the correct answer
	//will be ONLY as it is typed. If not, spaces and marks and caps
	//will not be taken into account	
	function convertToStandard(theText) {
		
		var howStrictIs = myCurrentExerciseSettings["howStrict"]
		var theRslt = "";
	
		if (howStrictIs == "isStrict") {
			theRslt = theText;
		} else if (howStrictIs == "isSemiStrict"){
			theText = theText.split("’").join("'");
			theText = theText.split("‘").join("'");	
			theText = theText.split(".").join(" ");
			theText = theText.split(",").join(" ");
			theRslt = theText.split(" ").join("");
		} else {
			theText = theText.split("’").join("'");
			theText = theText.split("‘").join("'");	
			theText = theText.split(".").join(" ");
			theText = theText.split(",").join(" ");
			theRslt = theText.split(" ").join("").toUpperCase();
		}
		return theRslt;
	}
	
	// Limits the Characters of an input
	var check_charcount = function(max, e) { 
		
		var eventTarget = eventTargetAllBr(e);
		
		removeCorWrong(eventTarget)
		
		if((eventTarget.value.length >= max))
		{
			//Disabled to enable free writing
			//e.preventDefault();
		}
	}
	
	// Returns the cross-browser naming for the target
	var eventTargetAllBr = function(e) {

		var elem, evt = e ? e:event;
		if (evt.srcElement)  elem = evt.srcElement;
		else if (evt.target) elem = evt.target;
		
		return elem;
	}
	
	var updateCookie = function(elementClass, e){
		
		var eventTarget = eventTargetAllBr(e);
		var HTMLCollArray = HTMLCollectionToArray(elementClass);
		var theID = HTMLCollArray.indexOf(eventTarget);
		activitySelections[theID].value = eventTarget.value;
		activitySelections[theID].checked = false;
		spa.saveCookie();
	}
	
	// CHECKING + SHOW ANSWERS *******************************************************
	
	// PUBLIC
	var removeCorWrong = function(elem) {
				
		removeClass(elem, "checkCorrect");
		removeClass(elem, "checkWrong");
	}
	
	this.checkAnswers = function() {
		var temp = checkResults();
		
		return temp;
	}
	
	// PRIVATE
	
	// CHECK
	var checkResults = function() {
		
		var score  = 0;
		//var activeInputs = DOMposition.querySelectorAll('.itemIsActive');
		
		for (var i=0; i<activeInputs.length; i++){
			removeCorWrong(activeInputs[i])
			
			if(activeInputs[i].value!= ""){
				var answers;
				var found=false;

				if (objAnswers[i].indexOf("|") !== -1){
					answers = objAnswers[i].split("|");
				}
				else{
					answers = Array(objAnswers[i]);
				}
				
				//cookie
				activitySelections[i].value = activeInputs[i].value;
				activitySelections[i].checked = true;
				
				for (var j=0;j<answers.length;j++){
					
					if (convertToStandard(activeInputs[i].value) == convertToStandard(answers[j])) {
						found=true;
						break;
					}
				}
				
				if (found==true) {
					activeInputs[i].className += " checkCorrect";
					score++;
				} else {
					activeInputs[i].className += " checkWrong";			
				}
				
			}
		}
		
		/*
		$("#myScore").val(score);	
		$("#myScorePerc").val(Math.round((score/activeInputs.length)*100));
		*/
		
		//spa.activityJSON.score = score;
		spa.saveCookie();
		
		var temp = {"score": score, "percentage": Math.round((score/activeInputs.length)*100)};
		return temp;
	}
	
	// SHOW ANSWERS
	// showAnswers button is pressed or not
	var pressed = false;
	//Keep wrong values
	var objShowAll =[];
	
	this.showAnswers = function() {

		//var activeInputs = DOMposition.querySelectorAll('.itemIsActive');

		if(pressed){
			pressed = false;
			
			checkAnsButs.disabled = false; 
			
			for (var i=0; i<activeInputs.length; i++){
				activeInputs[i].disabled = false;
				
				if(hasClass(activeInputs[i], 'checkCorrect')){
					//console.log('HAS CW CLASS');
				} else if(hasClass(activeInputs[i], 'checkWrong')) {
					activeInputs[i].value = objShowAll[i];
				} else {
					
					if(objShowAll[i] != undefined) {
						activeInputs[i].value = objShowAll[i];
					} else {
						activeInputs[i].value = '';				
					}						
				}
			}
			
			objShowAll =[];
			
		} else {
			pressed = true;
			
			checkAnsButs.disabled = true; 
			
			for (var i=0; i<activeInputs.length; i++){
				//removeCorWrong(activeInputs[i])
				activeInputs[i].disabled = true;
				
				if(hasClass(activeInputs[i], 'checkCorrect')){
					//console.log('HAS CW CLASS');
				} else if(hasClass(activeInputs[i], 'checkWrong')) {
					//Keep wrong values
					objShowAll[i] = activeInputs[i].value;
					//Replace wrong answers with model
					activeInputs[i].value = objAnswers[i];
				} else {
					if(activeInputs[i].value != '') {
						objShowAll[i] = activeInputs[i].value;
					}
					activeInputs[i].value = objAnswers[i];
				}				
			}
		}
	}
	
	// EXTRA Functionality ******************************************************
	
	// iPAD
	function adjustiPad(){
	
		/*
		The following code fixes the positions of all items on the page (especially the #header_container) when native iPad keyboard gets hidden.
		*/
		if(navigator.userAgent.match(/iPad/i) != null){

			var iOSKeyboardFix = {
				  targetElem: $('#header_container'),
				  init: (function(){
					$("input, textarea").on("focus", function() {
					  iOSKeyboardFix.bind();
					});
				  })(),
			
				  bind: function(){
						$(document).on('scroll', iOSKeyboardFix.react);  
							 iOSKeyboardFix.react();      
				  },
			
				  react: function(){
			
						  var offsetX  = iOSKeyboardFix.targetElem.offset().top;
						  var scrollX = $(window).scrollTop();
						  var changeX = offsetX - scrollX; 
			
						  iOSKeyboardFix.targetElem.css({'position': 'fixed', 'top' : '-'+changeX+'px'});
			
						  $('input, textarea').on('blur', iOSKeyboardFix.undo);
			
						  $(document).on('touchstart', iOSKeyboardFix.undo);
				  },
			
				  undo: function(){
			
					  iOSKeyboardFix.targetElem.removeAttr('style');
					  document.activeElement.blur();
					  $(document).off('scroll',iOSKeyboardFix.react);
					  $(document).off('touchstart', iOSKeyboardFix.undo);
					  $('input, textarea').off('blur', iOSKeyboardFix.undo);
				  }
				};
			
			/* 
			The following line cancels autocapitalization on iPads
			*/
			$("input").attr("autocapitalize","none");

		};
	}
	
	// INIT *****************************************************************
	//JSON LINK
	var myCurrentExerciseSettings = exerciseRef["settings"];	
	//ANSWERS
	var objAnswers = [];
	var activeInputs;
	
	var checkAnsButs = document.getElementById("checkAnswers");
	
	var init = function(){

		adjustiPad();
		
		newDiv = document.createElement("DIV");
		newDiv.innerHTML = createUnderlineActivityContent(exerciseRef);
		DOMposition.appendChild(newDiv);
		
		var ls = newDiv.querySelectorAll("span.itemIsActive");			
		for (var iii=0; iii<ls.length;iii++){
			ls[iii].id = "items"+iii;
		}	
		
		activeInputs = DOMposition.querySelectorAll('.itemIsActive');
		
		//Cookie Creation
		var cookieSelections = activitySelections;		
		
		for (var val=0; val<activeInputs.length; val++){	
		
			// Save Input values/answers into an object
			objAnswers.push(function(){			
				return activeInputs[val].value;
			}());	
			if ((cookieSelections[val]==null)||(cookieSelections[val].value=='')){
				// Empty Input value
				activeInputs[val].value = "";
				cookieSelections[val] = {"value":'', "checked":false};
			}
			else{
				activeInputs[val].value = cookieSelections[val].value;
				if (cookieSelections[val].checked){
					
					var answers;
					var found=false;
					if (objAnswers[val].indexOf("|") !== -1){
						answers = objAnswers[val].split("|");
					}
					else{
						answers = Array(objAnswers[val]);
					}
				
					for (var j=0;j<answers.length;j++){					
						if (convertToStandard(activeInputs[val].value) == convertToStandard(answers[j])) {
							found=true;
							break;
						}
					}
				
					if (found==true) {
						activeInputs[val].className += " checkCorrect";					
					} 
					else {
						activeInputs[val].className += " checkWrong";
					}
					
				}
			}

			// Maximum Characters to type are defined from maxlength(html) + here. Same JSON Var used.
			activeInputs[val].onkeydown=function(e){
				check_charcount(myCurrentExerciseSettings["maxChars"], e);
			};	
			activeInputs[val].onkeyup=function(e){
				updateCookie(activeInputs, e);
			};
					
		}	

		/* Assign Check Event
		var checkBut = document.getElementById("checkAnswers");
		checkBut.addEventListener("click", function(e) { checkResults(activeInputs, objAnswers); }); 
		*/

		
	//}(this);
	}();

}
