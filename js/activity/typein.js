function typeInInst(exerciseRef, DOMposition, activitySelections){
	
	// CREATE TypeIn Activity Content ******************************************
	
	var createTypeInActivityContent = function(exerciseRef){

		var freturn = "";
		var isList = false;
		var searchPattern = new RegExp;
		searchPattern = /(\{\{)(.*?)(\}\})/g;

		var theContent = localizeText(exerciseRef.activity.contents.htmlData, spa.myLang);

        //indivual answers//showanswer stuff
        var showButtonsRight = "";
        var showButtons = "";
        var disableInput = "";

        //TODO: detedrmine if to show answer einai apo default individual??
        //create the extra individual button
        if (checkActivityType("showanswers")) {
             showButtons = '<span class="showAnswer isOn"></span>';
             disableInput = 'disabled="disabled"';
        } else if (checkActivityType("individual")) {
             showButtons = '<span class="individualCheck"></span>';
             disableInput = "";
        } else {
             showButtons = "";
             disableInput = "";
        }
        //postion the check icon. default: before gap
        try {
            if (exerciseRef.settings.typeOfCheck.checkLocation == "afterGap") {
                showButtonsRight = showButtons;
                showButtons = "";
            }
        }catch (err){
        }

        var replacePattern = showButtons + '<input class="itemIsActive" type="text" size="' + (~~(exerciseRef["settings"]["maxChars"]) + 3) + '" maxlength="' + exerciseRef["settings"]["maxChars"] + '" value="$2" ' + disableInput + ' />' + showButtonsRight;

		if (theContent.search("\t") >=0) {
			isList = true;
		}
		
		var newContent = theContent.replace(searchPattern, replacePattern);
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
	};
	
	// While TYPING functions **************************************************
	
	// PRIVATE
    var checkActivityType = function (checkAgainst) {
        if (exerciseRef.settings.typeOfCheck.type == checkAgainst) {
            return true;
        } else {
            return false;
        }
    };
	//if the strict mode is enabled, the correct answer
	//will be ONLY as it is typed. If not, spaces and marks and caps
	//will not be taken into account	
	function convertToStandard(theText) {
		
		var howStrictIs = myCurrentExerciseSettings["howStrict"];
		var theRslt = "";
	
		if (howStrictIs == "isStrict") {
			theRslt = theText;
		} else if (howStrictIs == "isSemiStrict"){
			theText = theText.split("�").join("'");
			theText = theText.split("�").join("'");	
			theText = theText.split(".").join(" ");
			theText = theText.split(",").join(" ");
			theRslt = theText.split(" ").join("");
		} else {
			theText = theText.split("�").join("'");
			theText = theText.split("�").join("'");	
			theText = theText.split(".").join(" ");
			theText = theText.split(",").join(" ");
			theRslt = theText.split(" ").join("").toUpperCase();
		}
		return theRslt;
	}
	
	// Limits the Characters of an input
	var check_charcount = function(max, e) { 
		
		var eventTarget = eventTargetAllBr(e);
		
		removeCorWrong(eventTarget);
		
		if((eventTarget.value.length >= max))
		{
			//Disabled to enable free writing
			//e.preventDefault();
		}
	};
	
	// Returns the cross-browser naming for the target
	var eventTargetAllBr = function(e) {

		var elem, evt = e ? e:event;
		if (evt.srcElement)  elem = evt.srcElement;
		else if (evt.target) elem = evt.target;
		
		return elem;
	};
	
	var updateCookie = function(elementClass, e){
		
		var eventTarget = eventTargetAllBr(e);
		var HTMLCollArray = HTMLCollectionToArray(elementClass);
		var theID = HTMLCollArray.indexOf(eventTarget);
		activitySelections[theID].value = eventTarget.value;
		activitySelections[theID].checked = false;
		spa.saveCookie();
	};
	
	// CHECKING + SHOW ANSWERS *******************************************************
	
	// PUBLIC
	var removeCorWrong = function(elem) {
				
		removeClass(elem, "checkCorrect");
		removeClass(elem, "checkWrong");
	};
	
	this.checkAnswers = function() {
		var temp = checkResults();
		
		return temp;
	};
	
	// PRIVATE
	
	// CHECK
	var checkResults = function() {
		
		var score  = 0;
		//var activeInputs = DOMposition.querySelectorAll('.itemIsActive');
		
		for (var i=0; i<activeInputs.length; i++){
			removeCorWrong(activeInputs[i]);
			
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
            //individual check
            try {
                if (activeInputs[i].parentNode.querySelector(".individualCheck").classList.contains("pressed")) {
                    activeInputs[i].parentNode.querySelector(".individualCheck").classList.remove("pressed");
                } else {
                    activeInputs[i].parentNode.querySelector(".individualCheck").classList.add("pressed");
                }
            } catch (err) {

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
	};
	
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
                //individual show answer
                try {
                        activeInputs[i].parentNode.querySelector(".showAnswer").classList.remove("checked");
                } catch (err) {

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
                    activeInputs[i].value = objAnswers[i].replace(/\|/g, " / ");
				} else {
					if(activeInputs[i].value != '') {
						objShowAll[i] = activeInputs[i].value;
					}
                    activeInputs[i].value = objAnswers[i].replace(/\|/g, " / ");
				}
                //individual show answer
                try {
                    activeInputs[i].parentNode.querySelector(".showAnswer").classList.add("checked");
                } catch (err) {

                }

            }
		}
	};
	
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
			$("input, textarea").attr("autocapitalize","none");

		}
	}
	
	var reshapeInputs = function(){
		var allInputs = DOMposition.querySelectorAll('.itemIsActive');
        var disabled = "";
		for (var i=allInputs.length; i>0; i--){
			if (allInputs[i-1].getAttribute("value").indexOf("@@")>-1){
				var theText = allInputs[i-1].getAttribute("value").split("@@");
				//alert((i-1)+" "+allInputs[i-1].getAttribute("value").length);
				var ls = allInputs[i-1].parentNode.innerHTML;
				var searchPattern = new RegExp;
				searchPattern = /(.*?)<input class="(.*?)"(.*?)maxlength="(.*?)" value="(.*?)"(.*?)>(.*)/;
				
				var inputValue = allInputs[i-1].value;
				var theContent = allInputs[i-1].parentNode.innerHTML;
                if (theContent.search("disabled") >= 0) {
                    disabled = ' disabled="disabled" ';
                }
				//allInputs[i-1].parentNode.innerHTML="";
				//var replacePattern = '$1<br><textarea class="itemIsActive" maxlength="$3"'+' rows="2" style="width:'+(allInputs[i-1].parentNode.parentNode.parentNode.scrollWidth-100)+'px;" >$4</textarea>$6';
                var replacePattern = '$1<br><textarea class="$2" maxlength="$4"' + ' cols="' + theText[1] + '" rows="' + theText[2] + '" data-values="' + theText[0] + '"' + disabled + '>' + inputValue + '</textarea>$7';
		
		
				//'<input class="itemIsActive" type="text" size="'+(~~(exerciseRef["settings"]["maxChars"])+3)+'" maxlength="'+exerciseRef["settings"]["maxChars"]+'" value="$2"/>';
				//var replacePattern = '<br><textarea class="itemIsActive" size="'+(~~(exerciseRef["settings"]["maxChars"])+3)+'" maxlength="'+exerciseRef["settings"]["maxChars"]+'" value="$2" > </textarea>';
		
				var newContent = theContent.replace(searchPattern, replacePattern);		
				allInputs[i-1].parentNode.innerHTML = newContent;
				allInputs = DOMposition.querySelectorAll('.itemIsActive');
				// Maximum Characters to type are defined from maxlength(html) + here. Same JSON Var used.
				allInputs[i-1].onkeydown=function(e){
					check_charcount(myCurrentExerciseSettings["maxChars"], e);
				};	
				allInputs[i-1].onkeyup=function(e){
                    //TODO: complete the functionality for text areas
/* de ginetai, kapoia stigmh 8a mpainei ki edw mesa... sxooooliaaaaaaaa!!!
                     alert("neeever??");*/
                        try {
                        var theControlledElement = e.target.parentNode.querySelector(".individualCheck");
                            //currentElement.parentNode.querySelector("input")//pou sto koraka 8elw na to balw ayto???? xa xa xa xa, gamw tis diakopes mou!!

                        if (e.target.value.length == 0) {
                                theControlledElement.classList.remove("isOn");
                            } else {
                                theControlledElement.classList.add("isOn");
                            }

                        } catch (err) {

                        }
                    /**/
					updateCookie(activeInputs, e);
				};
			}
		}
		activeInputs = DOMposition.querySelectorAll('.itemIsActive');
	};
	
	var cleanDucks = function(myText){
		var theIndex = myText.indexOf("@@");
		var theText;
		if (theIndex>-1){
			theText = myText.substr(0, myText.indexOf("@@"));
		}
		else{
			theText = myText;
		}
		return theText;
	};
	
	// INIT *****************************************************************
	//JSON LINK
	var myCurrentExerciseSettings = exerciseRef["settings"];	
	//ANSWERS
	var objAnswers = [];
	var activeInputs;
	
	var checkAnsButs = document.getElementById("checkAnswers");

    var assignIndividualCheck = function () {
        //auto einai gia individual check
        if (checkActivityType("individual")) {
            DOMposition.addEventListener("click", function (evt) {
                var currentElement = evt.target;
                var controlledElement = currentElement.parentNode.querySelector("input") ? currentElement.parentNode.querySelector("input") : currentElement.parentNode.querySelector("textarea");
                if (currentElement.classList.contains("individualCheck") && (currentElement.classList.contains("isOn"))) {
                    //for cookie purposes
                    var HTMLCollArray = HTMLCollectionToArray(activeInputs);
                    var theID = HTMLCollArray.indexOf(controlledElement);

                    if (currentElement.classList.contains("checked")) {
                        //uncheck
                        currentElement.classList.remove("checked");
                        removeClass(controlledElement, "checkCorrect");
                        removeClass(controlledElement, "checkWrong");

                        activitySelections[theID].checked = false;
                        //cookieSelections[val] = {"value":'', "checked":false};

                        //TODO: use this with status option
                        //updateActJSON(controlledElement.id, $(controlledElement).data("droppedTo"), false);
                    } else {
                        //check
                        currentElement.classList.add("checked");

                        activitySelections[theID].checked = true;
                        //cookieSelections[val] = {"value":'', "checked":true};

                        //TODO: use this with status option. BUT the check could very well go in the cookie ;)
                        //updateActJSON(controlledElement.id, $(controlledElement).data("droppedTo"), true);
                        //removeCorWrong(activeInputs[i]);
                        var answers;
                        var found = false;
                        //TODO: we can just use the same data-value for both textareas and inputs and use one code, instead of making checks...but anyway
                        try {
                            if (controlledElement.getAttribute('value').indexOf("|") !== -1){
                                answers = controlledElement.getAttribute('value').split("|");
                            }
                            else{
                                answers = Array(controlledElement.getAttribute('value'));
                            }
                        } catch (err) {
                            if (controlledElement.getAttribute('data-values').indexOf("|") !== -1) {
                                answers = controlledElement.getAttribute('data-values').split("|");
                            }
                            else {
                                answers = Array(controlledElement.getAttribute('data-values'));
                            }                           
                            }
                            //cookie
//                            activitySelections[i].value = activeInputs[i].value;
//                            activitySelections[i].checked = true;
                            for (var j=0;j<answers.length;j++){
                                if (convertToStandard(controlledElement.value) == convertToStandard(answers[j])) {
                                    found=true;
                                    break;
                                }
                            }
                            if (found==true) {
                                controlledElement.classList.add("checkCorrect");
                                //score++;
                            } else {
                                controlledElement.classList.add("checkWrong");
                            }
                    }
                    //updateCookie(activeInputs, evt.target.parentNode.querySelector("input"));
                    spa.saveCookie();

                }
            });
            //ayto einai gia shouw answer. bebaaia mporei na einai o idios liste
        } else {
            DOMposition.addEventListener("click", function (evt) {
                var currentElement = evt.target;
                var controlledElement = currentElement.parentNode.querySelector("input") ? currentElement.parentNode.querySelector("input") : currentElement.parentNode.querySelector("textarea");
                //kane ta show answer 3erw gw... (ta opoia einai ligo poly ta idia...? xwris add class sigoura!
                if (currentElement.classList.contains("showAnswer") && (currentElement.classList.contains("isOn"))) {
                    var HTMLCollArray = HTMLCollectionToArray(activeInputs);
                    var theID = HTMLCollArray.indexOf(controlledElement);
                    if (currentElement.classList.contains("checked")) {
                        currentElement.classList.remove("checked");
                        controlledElement.value = "";
                        activitySelections[theID].value = "";
                        activitySelections[theID].checked = false;
                        //removeClass(controlledElement, "checkCorrect");
                        //removeClass(controlledElement, "checkWrong");
                    } else {
                        currentElement.classList.add("checked");
                        activitySelections[theID].value = " ";//assigned to space, because during init the value of th CHECKED propery is reset to FALSE if the field is empty.
                        try {
                            controlledElement.value = controlledElement.getAttribute("value").replace(/\|/g, " / ");
                        }
                        catch (err) {
                            controlledElement.value = controlledElement.getAttribute("data-values").replace(/\|/g, " / ");
                        }
                        activitySelections[theID].checked = true;
                    }
                    spa.saveCookie();
                }
                //showanswers
            });
        }
    };




	var init = function(){

		adjustiPad();
		var xtraHTML = spa.checkExistenceOfXtraHTML(exerciseRef.activity);
		if (xtraHTML["before"]!="")
			DOMposition.appendChild(xtraHTML["before"]);
		var newDiv = document.createElement("DIV");
		newDiv.innerHTML = createTypeInActivityContent(exerciseRef);
		DOMposition.appendChild(newDiv);
		if (xtraHTML["after"]!="")
			DOMposition.appendChild(xtraHTML["after"]);
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
				return cleanDucks(activeInputs[val].value);
			}());	
			if ((cookieSelections[val]==null)||(cookieSelections[val].value=='')){
				// Empty Input value
				activeInputs[val].value = "";
				cookieSelections[val] = {"value":'', "checked":false};
			}
			else{
				activeInputs[val].value = cookieSelections[val].value;

                //individual check
                if (activeInputs[val].value != "") {
                    try {
                        activeInputs[val].parentNode.querySelector(".individualCheck").className += " isOn";
                    } catch (err){

                    }
                }
				if (cookieSelections[val].checked) {

                    //individual show answer ;)
                    try {
                        activeInputs[val].parentNode.querySelector(".individualCheck").className += " checked";
                    } catch (err) {

                    }
                    if (checkActivityType("showanswers")) {
                        try {
                            activeInputs[val].parentNode.querySelector(".showAnswer").className += " checked";
                            activeInputs[val].value = objAnswers[val].replace(/\|/g, " / ");
                        } catch (err) {

                        }
                    } else {
                        var answers;
                        var found = false;
                        if (objAnswers[val].indexOf("|") !== -1) {
                            answers = objAnswers[val].split("|");
                        }
                        else {
                            answers = Array(objAnswers[val]);
                        }

                        for (var j = 0; j < answers.length; j++) {
                            if (convertToStandard(activeInputs[val].value) == convertToStandard(answers[j])) {
                                found = true;
                                break;
                            }
                        }

                        if (found == true) {
                            activeInputs[val].className += " checkCorrect";
                        }
                        else {
                            activeInputs[val].className += " checkWrong";
                        }
                    }
                }
			}

			// Maximum Characters to type are defined from maxlength(html) + here. Same JSON Var used.
			activeInputs[val].onkeydown=function(e){
				check_charcount(myCurrentExerciseSettings["maxChars"], e);
			};	
			activeInputs[val].onkeyup=function(e){
                try {
                    var theControlledElement = e.target.parentNode.querySelector(".individualCheck");
                    //currentElement.parentNode.querySelector("input")//pou sto koraka 8elw na to balw ayto???? xa xa xa xa, gamw tis diakopes mou!!

                    theControlledElement.classList.remove("checked");
                    if (e.target.value.length == 0) {
                        theControlledElement.classList.remove("isOn");
                    } else {
                        theControlledElement.classList.add("isOn");
                    }

                } catch (err) {

                }
				updateCookie(activeInputs, e);
			};
			
		}	

		/* Assign Check Event
		var checkBut = document.getElementById("checkAnswers");
		checkBut.addEventListener("click", function(e) { checkResults(activeInputs, objAnswers); }); 
		*/

		reshapeInputs();
        if ((checkActivityType("individual")) || (checkActivityType("showanswers"))) {
            assignIndividualCheck();
        }
	//}(this);
	}();

}
