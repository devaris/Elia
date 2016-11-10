// JavaScript Document
var spa = {};
spa.myVersion = "teacher";
spa.DISTINCTIVE_TITLE = (spa.myVersion == "student" ? "HTMLprojectStudent" : "HTMLproject");
spa.ACTIVITIES_FOLDER = "activities";
spa.RESOURCES_FOLDER = "resources";
spa.DEFLANG = "";
spa.activityFolder = "";
spa.myJSON = {};

if (inIframe()) {
	spa.myVersion = window.parent.acc.VERSION;
	var distTitle = window.parent.acc.DISTINCTIVE_TITLE;
	spa.DISTINCTIVE_TITLE = (spa.myVersion == "student" ? distTitle + "Student" : distTitle);
	spa.ACTIVITIES_FOLDER = window.parent.acc.ACTIVITIES_FOLDER;
	spa.RESOURCES_FOLDER = window.parent.acc.RESOURCES_FOLDER;
	spa.DEFLANG = window.parent.acc.DEFLANG;
	document.querySelector("html").dir = window.parent.document.querySelector("html").dir;
	document.querySelector("html").lang = window.parent.document.querySelector("html").lang;
	setDataAttribute(document.querySelector("html"), "version", (getDataAttribute(window.parent.document.querySelector("html"), "version") != ""?getDataAttribute(window.parent.document.querySelector("html"), "version"):"teacher"));
	spa.activityFolder = "../" + window.parent.acc.currentActFolder;
}

spa.IMAGES_FOLDER = spa.RESOURCES_FOLDER+"/images";
spa.IMAGES_PATH = document.location.href.substr(0, document.location.href.lastIndexOf(spa.ACTIVITIES_FOLDER)) + spa.IMAGES_FOLDER + "/";
spa.LAYOUT_FOLDER = spa.RESOURCES_FOLDER+"/layout";
spa.LAYOUT_PATH = document.location.href.substr(0, document.location.href.lastIndexOf(spa.ACTIVITIES_FOLDER)) + spa.LAYOUT_FOLDER + "/";
spa.ACTIVITIES_GRAPHICS_PATH = document.location.href.substr(0, document.location.href.indexOf("html")) + spa.LAYOUT_FOLDER + "/activities/";
spa.CHECK_ICON = document.location.href.substr(0, document.location.href.indexOf("html")) + spa.RESOURCES_FOLDER + "/layout/footer/check_On.png";
// CHECK IF THERE IS MAIN
spa.myLang = document.querySelector("html").lang;
spa.myDir = document.querySelector("html").dir;

//loadjscssfile(spa.activityFolder+"data/activity.js", "js") //dynamically load and add this .js file
loadjscssfile(spa.activityFolder+"css/activity.css", "css") ////dynamically load and add this .css file

spa.createDragAndDropActivityRubricContent = function (theContent, theActivityItems, theImagesPath) {
    var freturn = "";
    var newContent = "";
    var searchPattern = new RegExp;
    var locaImagesPath = theImagesPath ? theImagesPath : window.location.href.substr(0, window.location.href.lastIndexOf("/") + 1) + "images/";
    /*function getImgSize(imgSrc) {
     var newImg = new Image();
     
     newImg.onload = function() {
     var height = newImg.height;
     var width = newImg.width;
     alert ('The image size is '+width+'*'+height);
     };
     
     newImg.src = imgSrc; // this must be done AFTER setting onload
     }*/

    //pattern = /\{\{.*?\}\}/g; non-groupped pattern
    searchPattern = /(\{\{)(.*?)(\}\})/g;
    replacePattern = '<span class="itemIsActive"' + '>$2</span>';
    if (theActivityItems != "") {
        replacePattern = '<li><span class="itemIsActive"' + '>$2</span></li>';
        newContent = '<ul class="SourceItems">' + theActivityItems.replace(searchPattern, replacePattern) + '</ul>';
		
    } else {
        newContent = theContent.replace(searchPattern, replacePattern);
    }
    //8elei ena parapanw bhma an ta items mpoyn se 3exwristh lista. ayto synduazetai me to isactive tou rubric??

    //image support
    if (newContent.indexOf("$$") > 0) { //aytos o elegxos mporei kai na mh xreiazetai, afou an den kanei match to patternt, apla ua krathsei to palio newcontent..
        searchPattern = /(<li>.*?>)(.*?)\$\$(.*?)@@(\d+)@@(\d+)</g;
        replacePattern = "$1<img width=\"" + "$4" + "\" height=\"" + "$5" + "\" src=\"" + locaImagesPath + "$2.$3\" /><";
        newContent = newContent.replace(searchPattern, replacePattern);
    }

    freturn = newContent;
    //	var results = theContent.match(pattern).split(",");
    //	for (var i=0; i<results
    return freturn;
};

function createUnitTitle(theUnitObj) {
    /*document.getElementById("header_unit_number").innerHTML = "<span>" + theUnitObj.number + "</span>";
    document.getElementById("header_unit_title").innerHTML = "<span>" + theUnitObj.content + "</span>";
    document.getElementById("header_unit_subtitle").innerHTML = "<span>" + theUnitObj.subtitle + "</span>";*/
    return false;
}
;

spa.repositionMatchConnectors = function () {
    jsPlumb.repaintEverything();
};

spa.giveMeTheHeight = function () {
    var varHeight = 0;
    var localCopyOfSettings = activity;
    var totalActivities = Object.size(localCopyOfSettings.ex);
    for (var i = 0; i < totalActivities; i++) {
        if ((localCopyOfSettings["ex"][i]["type"] == "match") && (document.getElementsByClassName("activity_content")[i].scrollHeight == 0)) {
            varHeight = varHeight + document.getElementsByClassName("activity")[i].scrollHeight;
            var allTags = document.getElementsByClassName("activity")[i].querySelectorAll(".tags");
            var tempHeight = 0;
            for (var j = 0; j < allTags.length; j++) {
                if (allTags[j].scrollHeight > tempHeight) {
                    tempHeight = allTags[j].scrollHeight;
                }
            }
            varHeight = document.getElementsByClassName("activity_content")[i].offsetTop;
            varHeight = varHeight + tempHeight;
        }
        else {
            varHeight = document.getElementsByClassName("activity_content")[i].offsetTop;
            varHeight = varHeight + document.getElementsByClassName("activity_content")[i].scrollHeight;
        }
    }
    return varHeight;
};

spa.finishUpRichmondPageAppearance = function () {
   /* var varHeight = spa.giveMeTheHeight();
    //var varHeight = document.getElementsByClassName("activity")[0].scrollHeight;
    varHeight = varHeight + 50;
    var selector = ".section_default";
    var rule = "height: " + varHeight + "px";

    addMyRule("activity.css", selector, rule); // This line changes the height of the activity accordingly.
    document.getElementsByClassName("section")[0].className = document.getElementsByClassName("section")[0].className + " section_default";

    var wHeight = window.innerHeight;
    var paddingBase = wHeight / 2;
    var newPadding = paddingBase;
    var minHeight = 0;
	//wHeight - document.getElementById("header").offsetHeight - document.getElementById("footer").offsetHeight - document.getElementById("top_left").scrollHeight - document.getElementById("bottom_left").scrollHeight;
    var newTop = 100;
    if (varHeight > minHeight) {
        newPadding = newPadding + (varHeight - minHeight) / 2;
    }
    else {
        newTop = wHeight / 2 - (varHeight / 2 + document.getElementById("top_left").scrollHeight);
        if (newTop < 100) {
            newTop = 100;
        }
        else if (newTop > 160) {
            newTop = 160;
        }
        selector = ".content_default";
        rule = "top: " + newTop + "px";
        addMyRule("activity.css", selector, rule); // This line updates the position of the Richmond paper.	
        document.getElementsByClassName("content")[0].className = document.getElementsByClassName("content")[0].className + " content_default";
    }

    selector = ".content_container_default";
    rule = "padding: " + newPadding + "px 0 !important";

    addMyRule("activity.css", selector, rule); // This line updates the Header and Footer padding based on the height of Richmond paper.
   // document.getElementById("content_container").className = document.getElementById("content_container").className + " content_container_default";
    try {
        window.parent.document.getElementById("content").scrollTop = 0;
    } catch (err) {
        console.log("i am chrome and i throw this error : " + err);
    }*/
};


//My function for add class col-sm-12
/*function addClassColumn() {
	var d;
	var d = document.getElementsByClassName("activity_content");
	d.className = d.className + "col-sm-12";
};*/



spa.updateRichmondPageAppearance = function () {
    var varHeight = spa.giveMeTheHeight();
    //var varHeight = document.getElementsByClassName("activity")[0].scrollHeight;
    varHeight = varHeight + 50;
    var stylesheet;
    var selector = ".section_rotated";
    var rule = "height: " + varHeight + "px";

    var stylesheet;
    var found = false;
    var changed = 0;
    for (var i in document.styleSheets) {
        if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf("activity.css") >= 0) {
            stylesheet = document.styleSheets[i];
            break;
        }
    }
    for (var i = 0; i < stylesheet.cssRules.length; i++) {
        if (stylesheet.cssRules[i].selectorText == selector) {
            found = true;
            break;
        }
    }
    if (!found) {
        addMyRule("activity.css", selector, rule);
    }

    if (hasClass(document.getElementsByClassName("section")[0], "section_rotated")) {
        removeClass(document.getElementsByClassName("section")[0], "section_rotated");
    }
    else {
        document.getElementsByClassName("section")[0].className = document.getElementsByClassName("section")[0].className + " section_rotated";
    }

    var wHeight = window.innerHeight;
    var paddingBase = wHeight / 2;
    var newPadding = paddingBase;
    var minHeight = wHeight - document.getElementById("header").offsetHeight - document.getElementById("footer").offsetHeight - document.getElementById("top_left").scrollHeight - document.getElementById("bottom_left").scrollHeight;
    var newTop = 100;
    selector = ".content_rotated";
    rule = "";
    if (varHeight > minHeight) {
        newPadding = newPadding + (varHeight - minHeight) / 2;
    }
    else {
        newTop = wHeight / 2 - (varHeight / 2 + document.getElementById("top_left").scrollHeight);
        if (newTop < 100) {
            newTop = 100;
        }
        else if (newTop > 160) {
            newTop = 160;
        }


        rule = "top: " + newTop + "px";


    }
    found = false;
    for (var i = 0; i < stylesheet.cssRules.length; i++) {
        if (stylesheet.cssRules[i].selectorText == selector) {
            found = true;
        }
    }
    if (!found) {
        addMyRule("activity.css", selector, rule);// This line updates the position of the Richmond paper.	
    }
    if (hasClass(document.getElementsByClassName("content")[0], "content_rotated")) {
        removeClass(document.getElementsByClassName("content")[0], "content_rotated");
    }
    else {
        document.getElementsByClassName("content")[0].className = document.getElementsByClassName("content")[0].className + " content_rotated";
    }


    selector = ".content_container_rotated";
    rule = "padding: " + newPadding + "px 0 !important";

    for (var i = 0; i < stylesheet.cssRules.length; i++) {
        if (stylesheet.cssRules[i].selectorText == selector) {
            found = true;
            break;
        }
    }
    if (!found) {
        addMyRule("activity.css", selector, rule); // This line updates the Header and Footer padding based on the height of Richmond paper.
    }

    if (hasClass(document.getElementById("content_container"), "content_container_rotated")) {
        removeClass(document.getElementById("content_container"), "content_container_rotated");
    }
    else {
        document.getElementById("content_container").className = document.getElementById("content_container").className + " content_container_rotated";
    }
};

spa.doOnOrientationChange = function () {
    try {
        if (jsPlumb) {
            spa.repositionMatchConnectors();
        }
    } catch (err) {
    }
    spa.updateRichmondPageAppearance();

    /*In case anyone needs the following
     switch(window.orientation) 
     {  
     case -90:
     case 90:
     alert('landscape');
     break; 
     default:
     alert('portrait');
     break; 
     }*/
};

spa.showJustification = function () {
	var localCopyOfSettings = activity;
	if (localCopyOfSettings.elements.showjusttext!=""){
	
		if(document.querySelector(".newJustDiv")==null){
		
			var newDiv = document.createElement("DIV");
			newDiv.className = 'newJustDiv';
			newDiv.innerHTML = '<div class="text_Just">'+localCopyOfSettings.elements.showjusttext+'</div><div class="fa circle"><div class="fa fa-thumbs-o-up"></div></div><div class="closebtn fa fa-times-circle-o"  onclick="hideNewJustDiv()"></div>';
			document.querySelector(".section").appendChild(newDiv);
			$(".newJustDiv").addClass("feedback-animation");
		}
		else{
		$(".newJustDiv").css("display", "block");
		}
	}
}

spa.showActivityNo = function () {
	var localCopyOfSettings = activity;
    var myPageNumber = window.parent.getThePageNumber();
    var newDiv = document.createElement("DIV");
    newDiv.className = 'activityNo';
    newDiv.innerHTML = myPageNumber[0] + "/" + myPageNumber[1];
    document.querySelector("body").appendChild(newDiv);
}

spa.getScore = function (activityInDOM, results) {
    var actNo = spa.activities.indexOf(activityInDOM);
    spa.score[actNo] = results.score;
    spa.percentage[actNo] = results.percentage;
};

spa.updateScore = function () {
    var totalScore = 0, totalPercentage = 0;
    var localCopyOfSettings = activity;
    var totalActivities = Object.size(localCopyOfSettings.ex); //as defined in json

    for (var i = 0; i < spa.score.length; i++) {
        totalScore = totalScore + spa.score[i];
        totalPercentage = totalPercentage + spa.percentage[i];
    }
    $("#myScore").val(totalScore);
    /*Cookie save skipped below.*/
    //spa.activityJSON.score = totalScore;
    //spa.saveCookie();
    totalPercentage = totalPercentage / spa.score.length;
    $("#myScorePerc").val(totalPercentage);
    if ((totalPercentage == 100)||(localCopyOfSettings["ex"][0]["settings"]["typeOfCheck"]["lockOnCheck"]&&(localCopyOfSettings["ex"][0]["settings"]["typeOfCheck"]["lockOnCheck"]==true))) {
        for (var i = 0; i < totalActivities; i++) {
            spa.activities[i].disableActivity();
        }
		$("#checkAnswers").css("background-color", "#ffa91f");
        $("#checkAnswers").css("display", "none");
		spa.showJustification();
    }
};

spa.createXtraHTML = function (htmlData, name){
	var newDiv = document.createElement("DIV");
	newDiv.className = "htmlData"+name;
	newDiv.innerHTML = htmlData;
	return newDiv;
};

spa.checkExistenceOfXtraHTML = function(activityInfo){
	var xtraHTML = {"before":'', "after":''};
	if ((activityInfo.htmlDataBefore)&&(activityInfo.htmlDataBefore!='')){
		xtraHTML["before"] = spa.createXtraHTML(activityInfo.htmlDataBefore, "Before leftAlign");
		//$("div.activity_content").addClass("col-sm-12");
	}
	
	
	if ((activityInfo.htmlDataAfter)&&(activityInfo.htmlDataAfter!='')){
		xtraHTML["after"] = spa.createXtraHTML(activityInfo.htmlDataAfter, "After");
		//$("div.activity_content").addClass("col-sm-12");
	}
	//always add class col-sm-12 in activity_content
	//$("div.activity_content").addClass("col-sm-12"); 
	return xtraHTML;
};

function correctAllLocalImagesPath(){
	var imgElements = document.getElementsByTagName("img");
	for (var i=0;i<imgElements.length;i++)
	{
		if (imgElements[i].src.indexOf("html/images/") >= 0){
			imgElements[i].src = spa.activityFolder+imgElements[i].src.substr(imgElements[i].src.indexOf("images/"));
		}
	}
}



/*******LOAD VIDEO in jPlayer**********/
spa.loadTheVideo = function(theElement){
    var theURL = getDataAttribute(theElement, "url");
    /*if (theURL.indexOf("html/videos/") >= 0){
        theURL = spa.activityFolder+theURL.substr(theURL.indexOf("videos/"));
    }*/
    theURL = spa.activityFolder+theURL;
    $("#jquery_jplayer_1").jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
            title: "",
            m4v: theURL
            });
        },
        cssSelectorAncestor: "#jp_container_1",
        swfPath: "/js",
        supplied: "m4v, ogv",
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true,
        remainingDuration: true,
        toggleDuration: true
    });
}

function hideNewJustDiv() {
    $(".newJustDiv").css("display", "none");
}


$(document).ready(function () {
    //alert(activity.ex[0].activeElement)	
	
	loadActJSON(spa.activityFolder+"data/activity.json", function(response) {
	  // Parse JSON string into object
		//console.log(JSON.stringify(response));
		activity = JSON.parse(response);
		carryOnWithLoading();
	 });
});

function carryOnWithLoading(){
	var revealSub = false;
	var closeButAppear = false;
    try {
        assignText();
    } catch (n) {
        console.log("No AssignText code");
    }

    /*Cookie creation is skipped below.*/
    spa.activityJSON = spa.prepareActivityCookie();
    spa.activityJSON = {}
    
    spa.activities = [];
    spa.score = [];
    spa.percentage = [];
    var newDiv = document.createElement("DIV");
    var newDivQ = document.createElement("DIV");
    var localCopyOfSettings = activity;
    createUnitTitle(localCopyOfSettings["ex"][0]["settings"]["unit"]);

    if ((localCopyOfSettings.elements.showtext.indexOf('.html') == -1) && (localCopyOfSettings.elements.showtext.indexOf('.htm') == -1)) {
        newDiv = document.createElement("DIV");
        newDiv.innerHTML = localCopyOfSettings.elements.showtext;
    }
    else {
        newDiv = document.createElement("OBJECT");
        newDiv.id = "showtext_obj";
        newDiv.name = "showtext_obj";
        newDiv.type = "text/html";
        newDiv.data = localCopyOfSettings.elements.showtext;

    }
    try {
        document.getElementById("showtext").appendChild(newDiv);
    }
    catch (n) {
    }
	
	if ((localCopyOfSettings.elements.facilitator!='')&&(localCopyOfSettings.elements.facilitator!=null)){
        newDiv = document.createElement("DIV");
        newDiv.innerHTML = localCopyOfSettings.elements.facilitator;
		try {
        	document.getElementById("facilitator").appendChild(newDiv);
		}
		catch (n) {
		}
    }
    else {
       try {
        	document.getElementById("facilitator").style.display = "none";
		}
		catch (n) {
		}
    }
    //
    if ((localCopyOfSettings.elements.facilitatorQ!='')&&(localCopyOfSettings.elements.facilitatorQ!=null)){
        //alert(localCopyOfSettings.elements.facilitatorQ);
        newDivQ = document.createElement("DIV");
        newDivQ.innerHTML = localCopyOfSettings.elements.facilitatorQ;
		try {
        	document.getElementById("facilitatorQ").appendChild(newDivQ);
		}
		catch (n) {
		}
    }
    else {
        //alert("Can't find Q");
       try {
        	document.getElementById("facilitatorQ").style.display = "none";
		}
		catch (n) {
		}
    }
	
	if ((localCopyOfSettings["ex"][0].settings.substitute) && (localCopyOfSettings["ex"][0].settings.substitute == true)){
		revealSub = localCopyOfSettings["ex"][0].settings.substitute;
	}
	if ((localCopyOfSettings["ex"][0].settings.closeButAppear) && (localCopyOfSettings["ex"][0].settings.closeButAppear == true)){
		closeButAppear=localCopyOfSettings["ex"][0].settings.closeButAppear;
	}
	var audioFilename=null;
    if ((localCopyOfSettings.elements.audio!='')&&(localCopyOfSettings.elements.audio!=null)){
		audioFilename='../resources/audio/'+localCopyOfSettings.elements.audio;
	}

    var totalActivities = Object.size(localCopyOfSettings.ex); //as defined in json
    for (var i = 0; i < totalActivities; i++) {
        //common handler variables
        //this referes to the current activity JSON object
        var exerciseRef = localCopyOfSettings["ex"][i];
        if (i != 0)
        {
            var fragment = create('<div class="activity"><div class="activity_rubric"></div><div class="activity_content"></div></div>');
            fragment.className = "activity";
            insertAfter(fragment, document.getElementsByClassName(localCopyOfSettings["ex"][i - 1]["activeElement"])[i - 1]);
        }
        //this referes to the current active activity DIV. Structure MUST match JSON structure
        var currenActiveDOMActivityElement = document.getElementsByClassName(exerciseRef["activeElement"])[i];
        //this is the active rubric
        var currentActiveDOMrubric = currenActiveDOMActivityElement.getElementsByClassName("activity_rubric")[0];
        //this is the active content
        var currentActiveDOMcontent = currenActiveDOMActivityElement.getElementsByClassName("activity_content")[0];
        
        /*Cookie reset is skipped below.*/
        /*
        if (!spa.activityJSON.selections.hasOwnProperty(i + "")) {
            spa.activityJSON.selections[i + ""] = [];
        }
        */
	
		if (inIframe()) {
			try {
				document.getElementById("header").style.background = "transparent";
				document.getElementById("hr").style.background = "transparent";
				document.getElementById("footer").style.background = "transparent";
				document.getElementById("header_unit_title").innerHTML = "";
				document.getElementById("header_container").style.display = "none";
				document.getElementById("footer_container").style.display = "none";
				//document.getElementById("checkAnswers").style.display = "none";
				//document.getElementById("showAnswers").style.display = "none";
			} catch (err) {
				//no header, footer - no problems
			}
			
		}
		// CHECK IF THERE IS MAIN
        //cases begins. these should be moved to functions etc
        newDiv = document.createElement("DIV");
        var rubric_content = localizeText(exerciseRef.rubric.content, spa.myLang);
        /*if (exerciseRef["type"] == "dnd") {
            //create drags						
            newDiv.className = "drags";
            rubric_content = spa.createDragAndDropActivityRubricContent(localizeText(exerciseRef.rubric.content, spa.myLang), localizeText(exerciseRef.activity.items, spa.myLang), exerciseRef.settings.path);
        }*/
		
		if (exerciseRef["PDF"]) {
			//alert(exerciseRef["PDF"])
			var PDFDragDiv = document.createElement("DIV");	
			PDFDragDiv.className = "PDFButton figure full image col-xs-12 col-xs-offset-0 col-sm-6 col-sm-offset-6";
			PDFDragDiv.style.maxWidth="100%";
			PDFDragDiv.style.minWidth="7em";
			currentActiveDOMcontent.appendChild(PDFDragDiv);
			PDFhref="../resources/pdfs/"+exerciseRef["PDF"];
			PDFDragDiv.innerHTML = '<a href="'+PDFhref+'" target=\"_blank\"><img src=\"images/image1.png\"></a>';
        }
		
		var actDragDiv = document.createElement("DIV");
        if (exerciseRef["type"] == "dnd") {
            //create drags
            actDragDiv.className = "drags";
            actDragDivContent = spa.createDragAndDropActivityRubricContent(localizeText(exerciseRef.rubric.content, spa.myLang), localizeText(exerciseRef.activity.items, spa.myLang), exerciseRef.settings.path);
			actDragDiv.innerHTML = actDragDivContent;
        }
	
        newDiv.innerHTML = '<div class="rubric_qualifier col-sm-6 col-xs-12">' + localizeText(exerciseRef.rubric.number, spa.myLang) + '</div>' + '<div class="rubric_content col-sm-6 col-xs-12">' + rubric_content + '</div>';
        currentActiveDOMrubric.appendChild(newDiv);
		currentActiveDOMcontent.appendChild(actDragDiv)
        switch (exerciseRef["type"]) {
            case "dnd":
                //create drops			
                spa.activities[i] = new DragNDrop(exerciseRef, currentActiveDOMcontent, [], audioFilename);
                break;
            case "match":
                //spa.activities[i] = new Match(exerciseRef, currentActiveDOMcontent, spa.activityJSON.selections[i + ""]);
				spa.activities[i] = new Match(exerciseRef, currentActiveDOMcontent,[]);
                break;
            case "multiple":
                //spa.activities[i] = new MultipleChoice(exerciseRef, currentActiveDOMcontent, spa.activityJSON.selections[i + ""]);
				spa.activities[i] = new MultipleChoice(exerciseRef, currentActiveDOMcontent, [], audioFilename);
                break;
            case "typein":
                spa.activities[i] = new typeInInst(exerciseRef, currentActiveDOMcontent, spa.activityJSON.selections[i + ""]);
                break;
            case "underline":
                spa.activities[i] = new Underline(exerciseRef, currentActiveDOMcontent, spa.activityJSON.selections[i + ""]);
                break;
		 	case "display":
                spa.activities[i] = new Display(exerciseRef, currentActiveDOMcontent,revealSub, audioFilename, closeButAppear);
                break;
			case "clickReveal":
                spa.activities[i] = new ClickReveal(exerciseRef, currentActiveDOMcontent, revealSub, audioFilename);
                break;
			case "syncAudio":
                spa.activities[i] = new SyncAudio(exerciseRef, currentActiveDOMcontent, audioFilename);
                break;				
            case "custom":
                break;
        }
    }
	
    /*Cookie score is skepped below.*/
	//$("#myScore").val(spa.activityJSON.score);	
	//$("#myScorePerc").val(spa.activityJSON.percentage);
    $("#myScore").val(0);	
	$("#myScorePerc").val(0);
    
    if ((localCopyOfSettings["ex"][0].settings.showScore) && (localCopyOfSettings["ex"][0].settings.showScore == true)) {
        document.querySelector("#myScoreElem").style.display = "block";
    }
    
    if ((localCopyOfSettings["ex"][0].settings.showScorePerc) && (localCopyOfSettings["ex"][0].settings.showScorePerc == true)) {
        document.querySelector("#myScorePercElem").style.display = "inherit";
    }
   
    for (var i = 0; i < spa.activities.length; i++) {
        spa.score[i] = 0;
        spa.percentage[i] = 0;
    }

    $("#showAnswers").click(function () {
        if ($("#myScorePerc").val() != "100")
        {
            for (var i = 0; i < spa.activities.length; i++) {
                spa.activities[i].showAnswers();
            }
        }
    });
    $("#checkAnswers").click(function () {
        for (var i = 0; i < spa.activities.length; i++) {
            spa.score[i] = 0;
            spa.percentage[i] = 0;
        }
        for (var i = 0; i < spa.activities.length; i++) {
            var results = spa.activities[i].checkAnswers();
            spa.score[i] = results.score;
            spa.percentage[i] = results.percentage;
        }
        spa.updateScore();
    });
	

    if ((localCopyOfSettings["ex"][0].settings.typeOfCheck.type) && (localCopyOfSettings["ex"][0].settings.typeOfCheck.type == "submit")) {
        if ((localCopyOfSettings["ex"][0].settings.typeOfCheck.checkButton) && (localCopyOfSettings["ex"][0].settings.typeOfCheck.checkButton == true)) {
			//MY CODE
			$("#checkAnswers").on("click", function() {
				if($("#checkAnswers").hasClass("pressed")){} //do nothing if it is pressed
				
				else{
					$("#checkAnswers").addClass("pressed");
				}
			});
        }
        else {
            document.getElementById("checkAnswers").style.display = "none";
        }
    }
    else {
        document.getElementById("checkAnswers").style.display = "none";
    }

    if (localCopyOfSettings["ex"][0].settings.typeOfCheck.showAll == true) {
        document.getElementById("showAnswers").style.display = "block";
		//MY CODE
		$("#showAnswers").on("click", function() {
				if($("#showAnswers").hasClass("pressed"))
				{
					$("#showAnswers").removeClass("pressed");
				}
				else{
					$("#showAnswers").addClass("pressed");
				}
			});
			
		
    } else {
        document.getElementById("showAnswers").style.display = "none";
    }
    //window.parent.showRelevantItems(mySignature);


    var total_images = document.getElementsByTagName("img").length;

    if (total_images == 0) {
        spa.finishUpRichmondPageAppearance();
    }
    else {
		correctAllLocalImagesPath();
        doAfterAllImagesLoaded(spa.finishUpRichmondPageAppearance);
    }

    document.title = (totalActivities == 1 ? localizeText(localCopyOfSettings["ex"][0].rubric.content, spa.myLang).replace(/{{/g, "").replace(/}}/g, "").replace(/<\/?[^>]+(>|$)/g, "") : localizeText(localCopyOfSettings["ex"][0]["settings"]["unit"].content, spa.myLang).replace(/<\/?[^>]+(>|$)/g, ""));

    //window.addEventListener('orientationchange', spa.doOnOrientationChange);
    //do i have to keeep adding this???
    try {
        window.parent.addScroll();
    } catch (err) {
        console.log("chrome seems to be executing this twice, second time around with error : " + err);
    }
    try {
        if ((navigator.userAgent.match(/iPad/i) != null) && (localCopyOfSettings.elements.showaudio != "")) {
                if (window.parent.document.getElementsByTagName("audio")[0].paused) {
                            window.parent.setForPlay();
                        } else {
                            window.parent.setWhilePlaying();
                        }
        } else {          
        }
    } catch (err) {
        console.log("error playing audio in ipad");
    }
    if ((localCopyOfSettings.elements.hidePageNo)&&(localCopyOfSettings.elements.hidePageNo==true)){
    }
    else{
	   spa.showActivityNo();
    }
	
	// Create Timer if available class = timer
	setTimeout(function() {
		$(".timer").each(function(){
			theTimer.createTimer(localCopyOfSettings["ex"][0]["activity"]["main"][0][2]);					  
		})
	}, 2000);
	
};