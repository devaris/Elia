function DragNDrop(exerciseRef, DOMposition, activitySelections, audioFilename) {

    //private properties
    var spa_dnd = this;
    var counter;
    var score = 0;
    var currTar = "";
    var currOffset = "";
    var objPositions = {};
    var objAnswers = [];
    var isCheckImmediate = false;
    var isMultiple = false;
    var activityIndex = HTMLCollectionToArray(document.getElementsByClassName("activity")).indexOf(DOMposition.parentNode);
    var exercisePrefix = "EX" + activityIndex + "_";
	var paddingNumLeft = 0
	var paddingNumTop = 0
	var disabled = false

    var music; 
	var duration; 
	var pButton;
	var sButton;
	var playhead;
	var timeline; 
	var timelineWidth;
	var onplayhead = false;

    //public properties
    spa_dnd.InnerHTML = "";

	function getPosition(element) {
		var xPosition = 0;
		var yPosition = 0;
	  
		while(element) {
			xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
			yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
			element = element.offsetParent;
		}
		return { x: xPosition, y: yPosition };
	}
	
    //activity settings
    var draggableSettings = {
        containment: DOMposition.parentNode,
        //by magic, this resolves the issue of the item returning to the
        //original position when a clone is dragged on an occupied space.
        //no checks, no nothind. just true!
        //i suppose this while thing can be simplified A LOT by making
        //proper use of this function...
        revert: function () {
            if (true) {
                return true;
            } else {
                return false;
            }
        }, //"invalid",
        reverting: function () {
            $("#" + $(this).data("droppedTo")).data("canBeUsed", false);
            //alert('reverted');
        },
        snap: true,
        snapMode: "inner",
        start: function (event, ui) {
            $("#" + $(this).data("droppedTo")).data("canBeUsed", true);
            $(this).removeClass("checkCorrect checkWrong");
            $(this).data("currId", $(this).attr("id"));
            currTar = $(this);
        }
    };

    var checkActivityType = function (checkAgainst) {
        if (exerciseRef.settings.typeOfCheck.type == checkAgainst) {
            return true;
        } else {
            return false;
        }
    };

    var attachDoubleClicks = function (listenerContainer) {
        listenerContainer.addEventListener("dblclick", function (evt) {
            if (evt.target.classList.contains("ui-draggable")) {
                spa_dnd.returnItemToStart(evt.target);
            } else if (evt.target.parentNode.classList.contains("ui-draggable")) {
                spa_dnd.returnItemToStart(evt.target.parentNode);
            }
        });
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
		if (music.currentTime==music.duration){
			stop();
		}
		if (music.paused) {
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

    var __construct = function (that) {

        counter = 0;
        score = 0;
        if (exerciseRef["settings"]["typeOfCheck"]["type"] == "immediate") {
            isCheckImmediate = true;
        }
        if (exerciseRef["settings"]["isMultiple"] == true) {
            isMultiple = true;
        }
        if (exerciseRef["settings"]["columns"]) {
			document.body.children;
			document.getElementsByClassName("drags")[0].className += " col-md-6 col-xs-12";
        }

		var xtraHTML = spa.checkExistenceOfXtraHTML(exerciseRef.activity);
		if (xtraHTML["before"]!="")
			DOMposition.appendChild(xtraHTML["before"]);
        var newDiv = document.createElement("DIV");

   		if (exerciseRef["settings"]["columns"]) {
			newDiv.className += " col-md-6 col-xs-12";
        }
		
		newDiv.innerHTML = createDragAndDropActivityContent(localizeText(exerciseRef.activity.contents.htmlData, spa.myLang));
        DOMposition.appendChild(newDiv);
		if (xtraHTML["after"]!="")
			DOMposition.appendChild(xtraHTML["after"]);
        assignIndividualCheck();
        defineActivity();
		
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

    var positionOnDrop = function (theData) {
        return theOffset;
    };

    var updateActJSON = function (dragID, dropID, checked) {
        var length = activitySelections.length;
        var foundDrag = false;
        if (length > 0) {
            for (var i = 0; i < length; i++) {
                if (activitySelections[i].dragID == dragID) {
                    foundDrag = true;
                    break;
                }
            }
        }
        if (foundDrag) {
            activitySelections[i].dropID = dropID;
            activitySelections[i].checked = checked;
        }
        else {
            var selectionObj = {"dragID": dragID, "dropID": dropID, "checked": checked};
            activitySelections.push(selectionObj);
        }
        spa.saveCookie();
        return true;
    };

    var removeFromActJSON = function (dragID) {
        var length = activitySelections.length;
        if (length > 0) {
            for (var i = 0; i < length; i++) {
                if (activitySelections[i].dragID == dragID) {
                    activitySelections.splice(i, 1);
                    break;
                }
            }
        }
        return true;
    };

    var defineActivity = function () {

        var ls = DOMposition.parentNode.getElementsByClassName("itemIsActive");
        for (var ii = 0; ii < ls.length; ii++) {
            ls[ii].id = exercisePrefix + "drag" + ii;
        }

        ls = DOMposition.querySelectorAll("span.drop");
        for (var iii = 0; iii < ls.length; iii++) {
            ls[iii].id = exercisePrefix + "drop" + iii;
        }

        $(DOMposition.querySelectorAll("span.drop")).each(function (index, element) {
            $(this).data("canBeUsed", true);
            objAnswers.push($(this).html());
            $(this).html(exerciseRef["settings"]["replacePattern"]);
        });

        //check to see if the (id) is unique and return an id that is not used for the selected group of elements (elemeref a member).
        //use pattern to define the ancestory tree to look within
        //if you call this function with 0 or 1 or whatever, it will be minimum number oriented. ie it will always try to assign the minimum
        //id possible. If you call it with a variable number (ie the counter) it will be maximum number oriented, ie it will always try to assign
        //the next available highest number. Though this is a litle buggy and can result to duplicate ids
        //USAGE: element DOM  reference, id (as above), and ID pattern (number must be at the end)
        var gGetUniqueIds = function (elemref, id, pattern) {
            var theId = 1;
            //var mainst = elemref.parentNode;
            theId = $('#' + pattern + "_" + id);
            if (theId.length != 0) {
                theId = gGetUniqueIds(elemref, (id + 1), pattern);
            }
            else {
                theId = id;
            }
            return theId;
        };

        spa_dnd.returnItemToStart = function (theItem) {
            //$(theItem[0]).position(spa_dnd.objPositions[theItem[0].id]);
            //gGetUniqueIds(theItem, counter, exercisePrefix + "drag");            
            var theTarget = $("#" + theItem.id).data("droppedTo");
            $("#" + theTarget).data("canBeUsed", "true");
            $("#" + theItem.id).data("droppedTo", "");
            if (theItem.classList.contains("cloned")) {
                var originalDragID = theItem.id.substring(0, theItem.id.lastIndexOf("_"));
                //could keep track of the counter and update at removal, but still needed to go through available ids during adition
                //probably could do it with arrays
                //counter = gGetUniqueIds(theItem, parseInt(theItem.id.match(/\d+$/)[0]), exercisePrefix + "drag" + parseInt(originalDragID.match(/\d+$/)[0]));
                //counter = parseInt(theItem.id.match(/\d+$/)[0]) - 1;
                $(theItem).animate({top: $("#" + originalDragID).position().top + "px", left: $("#" + originalDragID).position().left + "px"}, function () {
                    theItem.parentNode.removeChild(theItem);
                });
            } else {
                $(theItem).animate({top: 0, left: 0});
                //theItem.style.left = 0;
                //theItem.style.top = 0;
            }
            removeClass(theItem, "checkCorrect");
            removeClass(theItem, "checkWrong");
            try {
                $(document.getElementById(theTarget).parentNode.querySelector(".individualCheck")).data("dragToCheck", "");
                removeClass(document.getElementById(theTarget).parentNode.querySelector(".individualCheck"), "isOn");
                removeClass(document.getElementById(theTarget).parentNode.querySelector(".individualCheck"), "checked");
            } catch (err) {
                //no individual check, no worries
            }

            removeFromActJSON(theItem.id);
            spa.saveCookie();
        };

        /************************************************************************CHANGE OF STYLE************************************************/
        if (isMultiple == false && isCheckImmediate == true) {
            if(!exerciseRef.settings.tapEnabled){
				$(DOMposition.parentNode).find(".drags span.itemIsActive").draggable({//DOMposition.parentNode.querySelector(".drags").querySelectorAll("span.itemIsActive")
					revert: "invalid",
					containment: DOMposition.parentNode,
					start: function (event, ui) {
						currTar = $(this);
					}
				});
			}else{
			}	
            $(DOMposition.querySelectorAll(".drop")).droppable({//$(DOMposition.querySelector(".drop"))
                tolerance: 'touch',
                drop: function (event, ui) {
                    var theDraggedId = Number(currTar.attr("id").replace(exercisePrefix + "drag", ""));
                    var theTargetId = Number($(this).attr("id").replace(exercisePrefix + "drop", ""));
                    var theTarget = $(DOMposition.parentNode).find("#" + exercisePrefix + "drag" + theDraggedId).data("droppedTo");//$("#"+exercisePrefix+"drag"+theDraggedId).data("droppedTo")
                    //if it latches anyway
                    if (checkAnswer($(DOMposition.parentNode).find("#" + exercisePrefix + "drag" + theDraggedId).html(), objAnswers, theTargetId) && $(this).data("canBeUsed")) {//($("#"+exercisePrefix+"drag"+theDraggedId).html() == objAnswers[theTargetId]) {
                        $(this).data("canBeUsed", false);
                        $(DOMposition.parentNode).find("#" + exercisePrefix + "drag" + theDraggedId).data("droppedTo", exercisePrefix + "drop" + theTargetId);
                        currTar.offset({top: ($(this).offset().top - 5), left: ($(this).offset().left + ($(this).width() / 2 - $(DOMposition.parentNode).find("#" + exercisePrefix + "drag" + theDraggedId).width() / 2))});
                        currTar.draggable('disable');
                        //currTar.css("visibility", "hidden");
                        //$(this).html(currTar.html());
                        objPositions[currTar.attr("id")] = currTar.html();
                        theTarget = exercisePrefix + "drop" + theTargetId;
                        updateActJSON(exercisePrefix + "drag" + theDraggedId, theTarget, true);
                    } else {
                        currTar.animate({left: 0, top: 0}, 200, "linear");
                    }

                }
            });

            $(DOMposition.parentNode).find(".drags span.itemIsActive").each(function (index, element) {
                objPositions[$(this).attr("id")] = $(this).offset();
            });

            $(DOMposition.parentNode).find(".drags span.itemIsActive").each(function (index, element) {
                if (typeof objPositions[$(this).attr("id")] == "object") {
                    $(this).offset(objPositions[$(this).attr("id")]);
                } else {
                    $(this).css("visibility", "hidden");
                    $(DOMposition.parentNode).find("#" + exercisePrefix + "drop" + $(this).attr("id").replace(exercisePrefix + "drag", "")).html(objPositions[$(this).attr("id")]);
                    $(this).draggable('disable');
                }
            });
            /************************************************************************CHANGE OF STYLE************************************************/
        } else if (isMultiple == false && isCheckImmediate == false) {//submit (or individual check
            if(!exerciseRef.settings.tapEnabled){
				$(DOMposition.parentNode).find(".drags span.itemIsActive").draggable({
					revert: "invalid",
					reverting: function () {
						//alert("reverting");
					},
					containment: DOMposition.parentNode,
					start: function (event, ui) {
						currTar = $(this);
						currOffset = ui.originalPosition;
						$(this).removeClass("checkCorrect checkWrong");
						//removeFromActJSON(this.id);
						//remove individual check if its pressed        
						try {
							var theAttachedCheck = document.getElementById($(this).data("droppedTo")).parentNode.querySelector(".individualCheck");
							theAttachedCheck.classList.remove("checked");
						} catch (err) {
							//no individual check, no worries
						}
					}
				});
			}else{
				$(".drags span.itemIsActive").addClass("animated fadeIn")
				$(".drags span.itemIsActive").css("padding", exerciseRef.settings.tapPadding);
				paddingNumLeft = exerciseRef.settings.tapPadding.substring(exerciseRef.settings.tapPadding.lastIndexOf(" ")+1, exerciseRef.settings.tapPadding.length-2);
				paddingNumTop = exerciseRef.settings.tapPadding.substring(0, exerciseRef.settings.tapPadding.indexOf(" ")-2);
				
				$(".drags span.itemIsActive").click(function(eve) {
					if(!disabled){
						$(currTar).removeClass("tappedDrag");
						$("#" + $(currTar).data("droppedTo")).removeClass("tappedDrag");
						if (!($(currTar).data("droppedTo")==="")){
							$(currTar).addClass("tappedTrans");
						}
						if (currTar===this){
							currTar="";
						}else{
							$(this).addClass("tappedDrag");
							if (!($(this).data("droppedTo")==="")){
								$("#" + $(this).data("droppedTo")).addClass("tappedDrag");
							}else{
								$(this).removeClass("tappedTrans");
							}
							currTar = this;
							$("#" + $(this).data("droppedTo")).removeClass("checkCorrect checkWrong");
						}
						eve.stopPropagation();
						eve.preventDefault();
						eve.cancelBubble = true;
					}
				});
				$(".drop").css("cursor", "pointer");
				$(".drop").click(function() {
					if (($(this).data("canBeUsed"))&&!(currTar === "")){
						if (!($(currTar).data("droppedTo")==="")){
							$("#" + $(currTar).data("droppedTo")).data("canBeUsed", true);
						}
						var theDraggedId = Number($(currTar).attr("id").replace(exercisePrefix + "drag", ""));
						$(currTar).offset({top: ($(this).offset().top-paddingNumTop), left: ($(this).offset().left + ($(this).width() / 2 - $(DOMposition.parentNode).find("#" + exercisePrefix + "drag" + theDraggedId).width() / 2))-paddingNumLeft});
						$(currTar).removeClass("tappedDrag");
						$("#" + $(currTar).data("droppedTo")).removeClass("tappedDrag")
						$(currTar).addClass("tappedTrans");
						$(currTar).data("droppedTo", this.id);
						$(this).data("canBeUsed", false);
						currTar = "";
					}
				});

				$(".SourceItems").click(function() {
					if (!currTar==""){
						$("#" + $(currTar).data("droppedTo")).removeClass("tappedDrag")
					
						$(currTar).offset({top: objPositions[currTar.id].top, left: objPositions[currTar.id].left});
						$(currTar).removeClass("tappedDrag");
						$(currTar).removeClass("tappedTrans");
						$("#" + $(currTar).data("droppedTo")).data("canBeUsed", true);
						$(currTar).data("droppedTo","");
						currTar="";
					}
				});
			}

            $(DOMposition.querySelectorAll(".drop")).droppable({
                tolerance: 'touch',
                drop: function (event, ui) {
                    var theDraggedId = Number($(DOMposition.parentNode).find(currTar).attr("id").replace(exercisePrefix + "drag", ""));
                    var theTargetId = Number($(this).attr("id").replace(exercisePrefix + "drop", ""));
                    //if it latches anyway
                    //if (theDraggedId == theTargetId) {
                    var theTarget = $(DOMposition.parentNode).find("#" + exercisePrefix + "drag" + theDraggedId).data("droppedTo");
					
                    if ($(this).data("canBeUsed")) {
                        $(this).data("canBeUsed", false);

                        //first, clean the individual check situation
                        try {
                            var theCheckSpan = document.getElementById(currTar.data("droppedTo")).parentNode.querySelector(".individualCheck");
                            $(theCheckSpan).data("dragToCheck", "");
                            removeClass(theCheckSpan, "isOn");
                            removeClass(theCheckSpan, "checked");
                        } catch (err) {
                            //no individual check, no worries
                        }

                        //clear old dropped to drop can be used data**********************
                        $("#" + $(DOMposition.parentNode).find("#" + exercisePrefix + "drag" + theDraggedId).data("droppedTo")).data("canBeUsed", true);
                        $(DOMposition.parentNode).find("#" + exercisePrefix + "drag" + theDraggedId).data("droppedTo", exercisePrefix + "drop" + theTargetId);
                        currTar.offset({top: ($(this).offset().top - 5), left: ($(this).offset().left + ($(this).width() / 2 - $(DOMposition.parentNode).find("#" + exercisePrefix + "drag" + theDraggedId).width() / 2))});
                        theTarget = exercisePrefix + "drop" + theTargetId;

                        //now, set the new individual check stuff
                        try {
                            $(this.parentNode.querySelector(".individualCheck")).data("dragToCheck", exercisePrefix + "drag" + theDraggedId);
                            this.parentNode.querySelector(".individualCheck").classList.add("isOn");
                        } catch (err) {
                            //no individual check, no worries
                        }

                        event.stopPropagation();
                    } else {
                        currTar.animate(currOffset, 200, "linear");
                        event.stopPropagation();
                        //$("#"+$("#"+exercisePrefix+"drag"+theDraggedId).data("droppedTo")).data("canBeUsed", true);
                        //just revert
                    }
                    //	currTar.draggable( 'disable' )
                    //	currTar.css("visibility", "hidden");
                    //	$(this).html(currTar.html());
                    //	objPositions[currTar.attr("id")] = currTar.html();
                    //} else {
                    //	currTar.animate({left:0, top:0}, 200, "linear");
                    //}
                    updateActJSON(exercisePrefix + "drag" + theDraggedId, theTarget, false);
                }
            });
            /*
             $("#checkAnswers").on("click", function(evnt){
             $(DOMposition.parentNode).find("span.itemIsActive").each(function(index, element) {
             var theLatchedIndex = parseInt($(element).data("droppedTo").replace(exercisePrefix+"drop", ""));
             if (theLatchedIndex >= 0) {//an exoun pesei panw se kapoia apanthssh
             if (checkAnswer($(element).html(), objAnswers, theLatchedIndex)){
             //if ($(element).html() == objAnswers[theLatchedIndex]) {
             $(element).addClass("checkCorrect");
             } else {
             $(element).addClass("checkWrong");
             }
             updateActJSON($(element).attr("id"), $(element).data("droppedTo"), true);
             }
             });
             });
             */
            $(DOMposition.parentNode).find(".drags span.itemIsActive").each(function (index, element) {
                objPositions[$(this).attr("id")] = $(this).offset();
                $(element).data("droppedTo", "");
            });

            $(DOMposition.parentNode).find(".drags span.itemIsActive").each(function (index, element) {
                if (typeof objPositions[$(this).attr("id")] == "object") {
                    $(this).offset(objPositions[$(this).attr("id")]);
                } else {
                    $(this).css("visibility", "hidden");
                    $(DOMposition.parentNode).find("#" + exercisePrefix + "drop" + $(this).attr("id").replace(exercisePrefix + "drag", "")).html(objPositions[$(this).attr("id")]);
                    $(this).draggable('disable');
                }
            });
            /************************************************************************CHANGE OF STYLE************************************************/
        } else if (isMultiple == true && isCheckImmediate == false) {
            $(DOMposition.querySelectorAll("span.drop")).each(function (index, element) {
                $(this).data("canBeUsed", true);
                objAnswers.push($(this).html());
                $(this).html(exerciseRef["settings"]["replacePattern"]);
            });

            if(!exerciseRef.settings.tapEnabled){
				$(DOMposition.parentNode.querySelectorAll(".itemIsActive")).draggable({
					helper: 'clone',
					containment: DOMposition.parentNode,
					revert: function () {
						if (true) {
							return true;
						} else {
							return false;
						}
					}, //"invalid",
					snap: true,
					snapMode: "inner",
					start: function (event, ui) {
						currTar = $(this);
					}
				});
			}else{
			}

            $(DOMposition.querySelectorAll(".drop")).droppable({
                //tolerance: 'touch',
                drop: function (event, ui) {
                    //these can probabaly be found from ui object and this. check it out!
                    //var theDraggedId = Number($(currTar).attr("id").replace(exercisePrefix+"drag",""));
                    var theDraggedId = $(currTar).attr("id").replace(exercisePrefix + "drag", "");
                    var clonedDragId = theDraggedId;
                    ui.helper.attr('id', "tempDragId");
                    //not really useful, as the counter gets altered while searching for unique id's. so, lets remove it!!
                    //counter++;
                    var theTarget = $("#" + exercisePrefix + "drag" + theDraggedId).data("droppedTo");
                    if (false) {//this would be implemented in a non-check functionality. it makes no sense at the moment.
                        counter++;
                        var element = $(DOMposition.parentNode).find(ui.draggable).clone();
                        element.addClass("tempclass");
                        $(this).append(element);
                        $(DOMposition).find(".tempclass").attr("id", "clonediv" + counter);
                        $(DOMposition).find("#clonediv" + counter).removeClass("tempclass");
                        //Get the dynamically item id
                        draggedNumber = ui.helper.attr('id').search(/drag([0-9])/);
                        itemDragged = "dragged" + RegExp.$1;
                        $(DOMposition).find("#clonediv" + counter).addClass(itemDragged);
                    } else if ($(this).data("canBeUsed")) {
                        $(this).data("canBeUsed", false);
                        var element = $(ui.helper).clone();

                        //handle individual check
                        //need to clear previous installment ;)
                        try {
                            var theCheckSpan = document.getElementById(currTar.data("droppedTo")).parentNode.querySelector(".individualCheck");
                            $(theCheckSpan).data("dragToCheck", "");
                            removeClass(theCheckSpan, "isOn");
                            removeClass(theCheckSpan, "checked");
                        } catch (err) {
                            //no individual check, no worries
                        }

                        if ($(element).hasClass("cloned")) {
                            $(element).attr("id", exercisePrefix + "drag" + theDraggedId);
                        } else {
                            counter = gGetUniqueIds(element, 1, exercisePrefix + "drag" + theDraggedId);
                            $(element).attr("id", exercisePrefix + "drag" + theDraggedId + "_" + counter);
                            clonedDragId = theDraggedId + "_" + counter;
                        }
                        $(element).addClass("cloned");
                        $(element).data("droppedTo", $(this).attr("id"));

                        //now, set the new individual check stuff
                        try {
                            $(this.parentNode.querySelector(".individualCheck")).data("dragToCheck", element[0].id);
                            this.parentNode.querySelector(".individualCheck").classList.add("isOn");
                        } catch (err) {
                            //no individual check, no worries
                        }

                        //CHECKTHIS
                        //de 3erw ti einai ayto parakatw... sto evaluation to element den yparxei, akoma kai me _ anamesa sto id kai ston counter..
                        //kanei kati??? prepei na dw to original...
                        $("#" + exercisePrefix + "drag" + theDraggedId + counter).data("droppedTo", $(element).data("droppedTo"));
                        //CHECKTHIS
                        ui.helper.attr('id', "tempDragId_NEW");
                        $(DOMposition.parentNode.querySelector(".drags")).append(element);
                        theTarget = $(this).attr("id");
                        $(element).draggable({
                            containment: DOMposition.parentNode,
                            //by magic, this resolves the issue of the item returning to the
                            //original position when a clone is dragged on an occupied space.
                            //no checks, no nothind. just true!
                            //i suppose this while thing can be simplified A LOT by making
                            //proper use of this function...
                            revert: function () {
                                if (true) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }, //"invalid",
                            reverting: function () {
                                $(DOMposition).find("#" + $(this).data("droppedTo")).data("canBeUsed", false);
                                //			    		alert('reverted');
                            },
                            snap: true,
                            snapMode: "inner",
                            start: function (event, ui) {
                                $(DOMposition).find("#" + $(this).data("droppedTo")).data("canBeUsed", true);
                                $(this).removeClass("checkCorrect checkWrong");
                                $(this).data("currId", $(this).attr("id"));
                                currTar = $(this);

                                //remove individual check if its pressed        
                                try {
                                    var theAttachedCheck = document.getElementById($(this).data("droppedTo")).parentNode.querySelector(".individualCheck");
                                    theAttachedCheck.classList.remove("checked");
                                } catch (err) {
                                    //no individual check, no worries
                                }
                            }
                        });
                        $(element).offset({top: ($(this).offset().top - 5), left: ($(this).offset().left + ($(this).width() / 2 - $(element).width() / 2))});
                    } else {
                        if (ui.helper.hasClass("cloned")) {
                            //do stuff with cloned items
                        } else {
                            //do stuff with original items
                        }
                    }
                    updateActJSON(exercisePrefix + "drag" + clonedDragId, theTarget, false);
                    $(element).removeClass("ui-draggable-dragging");
                    //CHECKME
                    //still, this returns no element...
                    $("#tempDragId").attr("id", ui.helper.data("currId"));
                    $("#tempDragId_NEW").remove();
                }
            });

            $(DOMposition.parentNode.querySelectorAll(".itemIsActive")).each(function (index, element) {
                objPositions[$(this).attr("id")] = $(this).offset();
            });

            $(DOMposition.parentNode.querySelectorAll(".itemIsActive")).each(function (index, element) {
                if (typeof objPositions[$(this).attr("id")] == "object") {
                    $(this).offset(objPositions[$(this).attr("id")]);
                } else {
                    $(this).css("visibility", "hidden");
                    $(DOMposition.parentNode).find("#" + exercisePrefix + "drop" + $(this).attr("id").replace(exercisePrefix + "drag", "")).html(objPositions[$(this).attr("id")]);
                    $(this).draggable('disable');
                }
            });
            /*
             $("#checkAnswers").on("click", function(evnt){
             $(DOMposition.parentNode).find("span.itemIsActive.cloned").each(function(index, element) {
             var theLatchedIndex = parseInt($(element).data("droppedTo").replace(exercisePrefix+"drop",""));
             if (theLatchedIndex >= 0) {//an exoun pesei panw se kapoia apanthssh
             if (checkAnswer($(element).html(), objAnswers, theLatchedIndex)){
             //if ($(element).html() == objAnswers[theLatchedIndex]) {
             $(element).addClass("checkCorrect");
             } else {
             $(element).addClass("checkWrong");
             }
             updateActJSON($(element).attr("id"), $(element).data("droppedTo"), true);
             }
             });
             });
             */
            /************************************************************************CHANGE OF STYLE************************************************/
        } else if (isMultiple == true && isCheckImmediate == true) {
            $(DOMposition.querySelectorAll("span.drop")).each(function (index, element) {
                $(this).data("canBeUsed", true);
                objAnswers.push($(this).html());
                $(this).html(exerciseRef["settings"]["replacePattern"]);
            });

            if(!exerciseRef.settings.tapEnabled){
				$(DOMposition.parentNode.querySelectorAll(".itemIsActive")).draggable({
					helper: 'clone',
					containment: DOMposition.parentNode,
					revert: function () {
						if (true) {
							return true;
						} else {
							return false;
						}
					}, //"invalid",*/
					snap: true,
					snapMode: "inner",
					start: function (event, ui) {
						currTar = $(this);
					}
				});
			}else{
			}

            $(DOMposition.querySelectorAll(".drop")).droppable({
                //tolerance: 'touch',
                drop: function (event, ui) {
                    //these can probabaly be found from ui object and this. check it out!
                    var theDraggedId = Number($(DOMposition.parentNode).find(currTar).attr("id").replace(exercisePrefix + "drag", ""));
                    var clonedDragId = theDraggedId;
                    var theTargetId = Number($(DOMposition).find(this).attr("id").replace(exercisePrefix + "drop", ""));
                    ui.helper.attr('id', "tempDragId");
                    //not really useful, as the counter gets altered while searching for unique id's. so, lets remove it!!
                    //counter++;
                    var theTarget = $(DOMposition.parentNode).find("#" + exercisePrefix + "drag" + theDraggedId).data("droppedTo");

                    if (($(this).data("canBeUsed")) && (checkAnswer($(DOMposition.parentNode).find("#" + exercisePrefix + "drag" + theDraggedId).html(), objAnswers, theTargetId))) {//($("#"+exercisePrefix+"drag"+theDraggedId).html() == objAnswers[theTargetId]) {
                        $(this).data("canBeUsed", false);
                        var element = $(ui.draggable).clone();
                        if ($(element).hasClass("cloned")) {
                            $(element).attr("id", exercisePrefix + "drag" + theDraggedId);
                        } else {
                            counter = gGetUniqueIds(element, 1, exercisePrefix + "drag" + theDraggedId);
                            $(element).attr("id", exercisePrefix + "drag" + theDraggedId + "_" + counter);
                            clonedDragId = theDraggedId + "_" + counter;
                        }
                        element.addClass("tempclass");
                        element[0].style.position = "absolute";//is this it??
                        $(element).addClass("cloned");
                        $(element).data("droppedTo", $(this).attr("id"));
                        ui.helper.attr('id', "tempDragId_NEW");
                        $(DOMposition.parentNode.querySelector(".drags")).append(element);
                        $(element).offset({top: ($(this).offset().top - 5), left: ($(this).offset().left + ($(this).width() / 2 - $(element).width() / 2))});
                        ui.helper.remove();
                        theTarget = $(this).attr("id");
                        updateActJSON(exercisePrefix + "drag" + clonedDragId, theTarget, true);
                    } else {
                    }
                    //$(this).append(element);
//						$(".tempclass").attr("id", "clonediv" + counter);
//						$("#clonediv" + counter).removeClass("tempclass");
                    //Get the dynamically item id
//						draggedNumber = ui.helper.attr('id').search(/drag([0-9])/)
//						itemDragged = "dragged" + RegExp.$1
//						console.log(itemDragged)
//						$("#clonediv" + counter).addClass(itemDragged);
//					currTar.offset({top : ($(this).offset().top - 3), left : ($(this).offset().left - 0)});
//					$(element).offset({top : ($(this).offset().top - 5), left : ($(this).offset().left + ($(this).width()/2 - $(element).width()/2))});
//					if (false) {//this would be implemented in a non-check functionality. it makes no sense at the moment.
//						counter++;
//						var element = $(ui.draggable).clone();
//						element.addClass("tempclass");
//						$(this).append(element);
//						$(".tempclass").attr("id", "clonediv" + counter);
//						$("#clonediv" + counter).removeClass("tempclass");
                    //Get the dynamically item id
//						draggedNumber = ui.helper.attr('id').search(/drag([0-9])/)
//						itemDragged = "dragged" + RegExp.$1
//						console.log(itemDragged)
//						$("#clonediv" + counter).addClass(itemDragged);
//					} else if ($(this).data("canBeUsed")) {
//						$(this).data("canBeUsed", false);
//						var element = $(ui.helper).clone();
//						$(element).attr("id", exercisePrefix+"drag"+theDraggedId+counter);
//						$(element).addClass("cloned");
//						$(element).data("droppedTo", $(this).attr("id"));
//						ui.helper.attr('id', "tempDragId_NEW");
//						$(".drags").append(element);

//						$(element).draggable({
//							containment: DOMposition.parentNode,
                    //by magic, this resolves the issue of the item returning to the
                    //original position when a clone is dragged on an occupied space.
                    //no checks, no nothind. just true!
                    //i suppose this while thing can be simplified A LOT by making
                    //proper use of this function...
//							revert: function() {
//								if (true) {
//									return true;
//								} else {
//									return false;
//								}
//							},//"invalid",
//							reverting: function() {
//								$("#"+$(this).data("droppedTo")).data("canBeUsed", false);
                    //			    		alert('reverted');
//							},
//							snap: true,
//							snapMode: "inner",
//							start : function (event, ui) {
//								$("#"+$(this).data("droppedTo")).data("canBeUsed", true);
//								$(this).removeClass("checkCorrect checkWrong");
//								$(this).data("currId", $(this).attr("id"));
//								currTar = $(this);
//							}
//						});
                    //$(element).offset({top : ($(this).offset().top - 5), left : ($(this).offset().left + ($(this).width()/2 - $(element).width()/2))});
//					} else {
//						if (ui.helper.hasClass("cloned")) {
                    //do stuff with cloned items
//						} else {
                    //do stuff with original items
//						}
//					}
//					$(element).removeClass("ui-draggable-dragging");
//					$("#tempDragId").attr("id", ui.helper.data("currId"));
//					$("#tempDragId_NEW").remove();

                    //$(element).removeClass("ui-draggable-dragging");
                    $(DOMposition.parentNode).find("#tempDragId").attr("id", ui.helper.data("currId"));
                    $(DOMposition.parentNode).find("#tempDragId_NEW").remove();
                }
            });

            $(DOMposition.parentNode.querySelectorAll(".itemIsActive")).each(function (index, element) {
                objPositions[$(this).attr("id")] = $(this).offset();
            });


            $(DOMposition.parentNode.querySelectorAll(".itemIsActive")).each(function (index, element) {
                if (typeof objPositions[$(this).attr("id")] == "object") {
                    $(this).offset(objPositions[$(this).attr("id")]);
                } else {
                    $(this).css("visibility", "hidden");
                    $(DOMposition.parentNode).find("#" + exercisePrefix + "drop" + $(this).attr("id").replace(exercisePrefix + "drag", "")).html(objPositions[$(this).attr("id")]);
                    $(this).draggable('disable');
                }
            });
        }
        setTimeout(positionDrags, 1000);
    };

    var createDragAndDropActivityContent = function (theContent) {
        var freturn = "";
        var isList = false;
        var searchPattern = new RegExp;
        //pattern = /\{\{.*?\}\}/g; non-groupped pattern
        searchPattern = /(\{\{)(.*?)(\}\})/g;
        var isEbook = false;
        //TODO: make isEbook a setting to create ebooks without spaces!!
        if (!checkActivityType("individual") && (!isEbook)) {
            replacePattern = '<span class="drop"' + '>$2</span>';
        } else {
            replacePattern = '<span class="drop"' + '>$2</span><span class="individualCheck">&nbsp;</span>';
        }
        if (theContent.search("\t") >= 0) {
            isList = true;
        }
        var newContent = theContent.replace(searchPattern, replacePattern);

        if (isList) {
            newContent = newContent.split("\t");
            var newHTML = '<span class="actText"><ul class="TargetItems">';
            for (var i = 0; i < newContent.length; i++) {
                //an einai lista. an den einai lista ayto den einai aparaithto!!
                newHTML = newHTML + "<li><span>" + newContent[i] + "</span></li>";
            }
            newHTML = newHTML + " </ul></span>";
        } else {
            newHTML = '<span class="actText">' + newContent + '</span>';
        }
        if (audioFilename!=null){
           newHTML += '<div class="player"><audio id="audPlay"><source src="'+audioFilename+'.ogg" type="audio/ogg"><source src="'+audioFilename+'.mp3" type="audio/mpeg">Your browser does not support the audio element.</audio><div id="audioplayer"><button id="pButton" class="play"></button><button id="sButton" class="stop"></button><div id="timeline"><div id="playhead"></div></div></div></div>'
        }

        freturn = newHTML;
        //	var results = theContent.match(pattern).split(",");
        //	for (var i=0; i<results
        return freturn;
    };

    var positionDrags = function () {
        var length = activitySelections.length;
        counter = length;
        //var allDrags = document.getElementsByClassName("itemIsActive");
        var allDrags = $(DOMposition.parentNode.querySelectorAll(".itemIsActive"));
        var allDragsNo = allDrags.length;
        var foundDrag = false;
        var theDrag;
        if (length > 0) {
            for (var i = 0; i < length; i++) {
                var myDrop = DOMposition.querySelector("#" + activitySelections[i].dropID);
                foundDrag = false;
                var theDragID = activitySelections[i].dragID;
                var checked = activitySelections[i].checked;
                for (var j = 0; j < allDragsNo; j++) {
                    if (theDragID == allDrags[j].id) {
                        foundDrag = true;
                        theDrag = allDrags[j];
                        break;
                    }
                }
                if (foundDrag) {
                    $(theDrag).offset({top: ($(myDrop).offset().top - 5), left: ($(myDrop).offset().left + ($(myDrop).width() / 2 - $(theDrag).width() / 2))});
                    $(theDrag).data("droppedTo", myDrop.id);
                    $(myDrop).data("canBeUsed", false);
                }
                else {
                    $(myDrop).data("canBeUsed", false);
                    var originalDragID = theDragID.substring(0, theDragID.lastIndexOf("_"));
                    theDrag = $("#" + originalDragID).clone();
                    $(theDrag).attr("id", theDragID);
                    $(theDrag).addClass("cloned");
                    $(theDrag).css("position", "absolute");
                    $(theDrag).data("droppedTo", myDrop.id);
                    $(DOMposition.parentNode.querySelector(".drags")).append(theDrag);
                    $(theDrag).draggable(draggableSettings);
                    $(theDrag).offset({top: ($(myDrop).offset().top - 5), left: ($(myDrop).offset().left + ($(myDrop).width() / 2 - $(theDrag).width() / 2))});
                }
                //also change individual check thing
                //TODO: are you sure?? what does the if do? maybe one is for multiple seems like it....
                try {
                    var theAttachedCheck = document.getElementById(activitySelections[i].dropID).parentNode.querySelector(".individualCheck");
                    theAttachedCheck.classList.add("isOn");
                    $(theAttachedCheck).data("dragToCheck", theDragID);
                } catch (err) {

                }

                if (isCheckImmediate == true) {
                    $(DOMposition.parentNode).find(theDrag).draggable('disable');
                }
                else {
                    if (checked) {
                        var theLatchedIndex = parseInt($(DOMposition).find(myDrop).attr("id").replace(exercisePrefix + "drop", ""));
                        if (checkAnswer($(DOMposition.parentNode).find(theDrag).html(), objAnswers, theLatchedIndex)) {
                            $(DOMposition.parentNode).find(theDrag).addClass("checkCorrect");
                        } else {
                            $(DOMposition.parentNode).find(theDrag).addClass("checkWrong");
                        }

                        //also change individual check thing
                        try {
                            var theAttachedCheck = document.getElementById(activitySelections[i].dropID).parentNode.querySelector(".individualCheck");
                            theAttachedCheck.classList.add("checked");
                        } catch (err) {

                        }
                    }
                }
            }
        }
        return true;
    };

    var assignIndividualCheck = function () {
        if (checkActivityType("individual")) {
            DOMposition.addEventListener("click", function (evt) {
                var currentElement = evt.target;
                var controlledElement = document.getElementById($(currentElement).data("dragToCheck"));
                if (currentElement.classList.contains("individualCheck") && (currentElement.classList.contains("isOn"))) {
                    if (currentElement.classList.contains("checked")) {
                        //uncheck
                        currentElement.classList.remove("checked");
                        removeClass(controlledElement, "checkCorrect");
                        removeClass(controlledElement, "checkWrong");
                        //TODO: use this with status option
                        updateActJSON(controlledElement.id, $(controlledElement).data("droppedTo"), false);
                    } else {
                        //check
                        currentElement.classList.add("checked");
                        //TODO: use this with status option. BUT the check could very well go in the cookie ;)
                        updateActJSON(controlledElement.id, $(controlledElement).data("droppedTo"), true);
                        if (checkAnswer(controlledElement.innerHTML, objAnswers, $(controlledElement).data("droppedTo").replace(exercisePrefix + "drop", ""))) {
                            //add checkcorrect class
                            controlledElement.classList.add("checkCorrect");
                        } else {
                            //add checkwrong class
                            controlledElement.classList.add("checkWrong");
                        }
                        //kane tous elegxous (geezuz)
                    }
                }
            });
        }
    };

    var checkAnswer = function (answerGiven, AnswerData, AnswerDaraIndex) {
        var fresult = false;

        //get just the name of the image, as it is associated with the right answer
        if (answerGiven.match("img")) {
            var tempStr = answerGiven.match(/src="(.*?)"/);
            answerGiven = tempStr[0].substr(tempStr[0].lastIndexOf("/") + 1, tempStr[0].length - tempStr[0].lastIndexOf("/") - 6);
        }

        if (AnswerData[AnswerDaraIndex].search("|") < 0) {
            //check for single answer

            if (answerGiven == AnswerData[AnswerDaraIndex]) {
                fresult = true;
            }
        } else {
            var tempAnswerObj = AnswerData[AnswerDaraIndex].split("|");
            for (var i = 0; i < tempAnswerObj.length; i++) {
                if (answerGiven == tempAnswerObj[i]) {
                    fresult = true;
                }
            }
        }
        return fresult;
    };
    var pressed = false;

    spa_dnd.showAnswers = function () {
        if (!pressed) {
            pressed = true;

            var toHide = DOMposition.parentNode.getElementsByClassName("itemIsActive");
            for (var i = 0; i < toHide.length; i++) {
                toHide[i].style.visibility = "hidden";
            }
            var totalAnswers = DOMposition.parentNode.getElementsByClassName("drop").length;
            for (var i = 0; i < totalAnswers; i++) {
                var d = document.createElement("span");
                d.id = "temp_" + i;
                d.style.position = "absolute";
                d.className = "itemIsActive showAll";
                d.innerHTML = objAnswers[i].replace("|", "/");

                var arrofsrc = [];
                $(".itemIsActive > img").each(function (index, element) {
                    arrofsrc.push(element.parentNode.innerHTML);
                });
                for (var g = 0; g < arrofsrc.length; g++) {
                    if (arrofsrc[g].match(objAnswers[i])) {
                        d.innerHTML = arrofsrc[g];
                        d.style.position = "relative";
                        g = arrofsrc.length + 1;
                    } else {
                        d.innerHTML = objAnswers[i];
                    }
                }

                DOMposition.parentNode.appendChild(d);
                var myDrop = document.getElementById(exercisePrefix + "drop" + i);
                $(d).offset({top: ($(myDrop).offset().top - 5), left: ($(myDrop).offset().left + ($(myDrop).width() / 2 - $(d).width() / 2))});
            }
        } else {
            pressed = false;

            var coll = DOMposition.parentNode.getElementsByClassName("showAll");
            var loops = coll.length;
            for (var k = coll.length; k--;) {
                $(coll[k]).remove();
            }
            coll = DOMposition.parentNode.getElementsByClassName("itemIsActive");
            for (var i = 0; i < loops; i++) {
                try {
                    coll[i].style.visibility = "visible";
                } catch (err) {

                }
            }

        }
        //old version - fancier, different approach. might come in handy for pictures and stuff
        //old version clones each element and positions it. There was trouble with multiple items
        //new version just displays the saved text (used for comparison anyway) of each place.
        //could work with images as well...
        /*        var coll = "";
         var loops = "";
         if (!pressed) {
         pressed = true;

         //checkAnsButs.disabled = false;
         coll = DOMposition.parentNode.getElementsByClassName("itemIsActive");
         loops = coll.length;
         for (var i = 0; i < loops; i++) {
         if (($(coll[i]).data("droppedTo") == "") || ($(coll[i]).data("droppedTo") == undefined)) {
         var klon = $(coll[i]);
         var loc = objAnswers.indexOf($(coll[i]).html());
         klon.clone().attr("id", "temp_" + loc).addClass("showAll").appendTo(DOMposition.parentNode);
         if (!isMultiple) {
         coll[i].style.visibility = "hidden";
         }
         }
         }
         coll = DOMposition.parentNode.getElementsByClassName("showAll");
         loops = coll.length;
         for (var i = 0; i < loops; i++) {
         var loc = coll[i].id.substr(coll[i].id.lastIndexOf("_") + 1, coll[i].length);
         var myDrop = document.getElementById(exercisePrefix + "drop" + loc);
         $(coll[i]).offset({top: ($(myDrop).offset().top - 5), left: ($(myDrop).offset().left + ($(myDrop).width() / 2 - $(coll[i]).width() / 2))});
         }
         } else {
         pressed = false;
         coll = DOMposition.parentNode.getElementsByClassName("showAll");
         loops = coll.length;
         for (var k = coll.length; k--; ) {
         $(coll[k]).remove();
         }
         coll = DOMposition.parentNode.getElementsByClassName("itemIsActive");
         for (var i = 0; i < loops; i++) {
         coll[i].style.visibility = "visible";
         }
         }*/
    };

//public functions
	this.disableActivity = function(){
		$(".drags span.itemIsActive").css("cursor", "default");
		$(".drop").css("cursor", "default");
		disabled = true;
	}
    $.ui.draggable.prototype._mouseStop = function (event) {
        //If we are using droppables, inform the manager about the drop
        var dropped = false;
        if ($.ui.ddmanager && !this.options.dropBehaviour)
            dropped = $.ui.ddmanager.drop(this, event);

        //if a drop comes from outside (a sortable)
        if (this.dropped) {
            dropped = this.dropped;
            this.dropped = false;
        }

        if ((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
            var self = this;
            self._trigger("reverting", event);
            $(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () {
                //alert("here");
                event.reverted = true;
                self._trigger("stop", event);
                self._clear();
            });
        } else {
            this._trigger("stop", event);
            this._clear();
        }
        return false;
    };

    spa_dnd.checkAnswers = function () {
        var checkElements = (isMultiple ? "span.itemIsActive.cloned" : "span.itemIsActive");
        score = 0;
        $(DOMposition.parentNode).find(checkElements).each(function (index, element) {
            var theLatchedIndex = parseInt($(element).data("droppedTo").replace(exercisePrefix + "drop", ""));
            if (theLatchedIndex >= 0) {//an exoun pesei panw se kapoia apanthssh
				var dropIDName = "#" + $(element).data("droppedTo")
                if (checkAnswer($(element).html(), objAnswers, theLatchedIndex)) {
                    //if ($(element).html() == objAnswers[theLatchedIndex]) {
					if(!exerciseRef.settings.tapEnabled){
						$(element).addClass("checkCorrect");
					}else{
						$(dropIDName).addClass("checkCorrect");
					}
					
                    score++;
                } else {
					if(!exerciseRef.settings.tapEnabled){
						$(element).addClass("checkWrong");
					}else{
						$(dropIDName).addClass("checkWrong");
					}

                    score--;
                }
                updateActJSON($(element).attr("id"), $(element).data("droppedTo"), true);
            }
        });

        var theItems = DOMposition.getElementsByClassName("drop");
        //$("#myScorePerc").val(Math.round((score/theItems.length)*100) + '%')
        //alert (Math.round((score/theItems.length)*100) + '%')
        //updateMain(this);
        if (score < 0)
            score = 0;
        var percentage = Math.round((score / theItems.length) * 100);
        if (percentage == 100) {
            audioCorrect();
        } else {
            audioWrong();
        }
        var temp = {"score": score, "percentage": percentage};
        return temp;
    };

    //initialize Object....
    __construct(this);
    if (!checkActivityType("immediate")) {
        attachDoubleClicks(DOMposition.parentNode);
    }
}