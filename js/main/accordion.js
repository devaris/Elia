// GLOBAL TIME for extra show/hide
var globalTimerExtraText = 500;

var acc = {};//namespace
acc.jsObj = {};
acc.jsObjExtras = {};
acc.linkID = "home";
acc.globalSettings = {};
acc.scrollerReference = "";
acc.DEFLANG = settings.defaultLanguage;
acc.myLang = (document.querySelector("html").lang!=""?document.querySelector("html").lang:acc.DEFLANG);
acc.myDir = (document.querySelector("html").dir!=""?document.querySelector("html").dir:"ltr");
acc.myVersion = (getDataAttribute(document.querySelector("html"), "version")!=""?getDataAttribute(document.querySelector("html"), "version"):"teacher");
acc.pageAppearance = (settings.pageAppearance!=""?settings.pageAppearance:"height");
acc.levelExpands = (settings.firstLevelJustExpands!=""?settings.firstLevelJustExpands:false);
acc.lvlOfAccDevelopment = (settings.lvlOfAccDevelopment!=""?settings.lvlOfAccDevelopment:"full");
acc.hiddenAccordion = (settings.hiddenAccordion!=""?settings.hiddenAccordion:false);
/*****************PATHS********************/
acc.RESOURCES_FOLDER = settings.mediaLocation.resources;
acc.ACTIVITIES_FOLDER = settings.mediaLocation.activities;
acc.VERSION = (settings.version!=""?settings.version:"teacher");
acc.DISTINCTIVE_TITLE = (settings.distinctiveTitle!=""?settings.distinctiveTitle:"HTMLproject");
acc.TOOLBAR_EXE_ONLY = (settings.toolbarExeOnly!=""?settings.toolbarExeOnly:false);
acc.currentActFolder = '';
/**************USER INFO********************/
acc.userInfo = {};
acc.state = {};
acc.unitState = {};
acc.infoJSON={};

setDataAttribute(document.querySelector("html"), "version", acc.VERSION);

/***************count pages*****************/
acc.DEPTH_COUNT = 2;
acc.unitPages;
acc.pageNo;

function eventFire(el, etype) {
    if (el.dispatchEvent) {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    } 
    else {
        var evt = document.createEventObject();
        el.fireEvent('on' + etype, evt);
    }
}

function findUpTag(el, tag) {
    if (el.tagName.toLowerCase() != tag) {
        while (el.parentNode) {
            el = el.parentNode;
            if (el.tagName.toLowerCase() === tag)
                return el;
        }
        return null;
    }
    return el;
}

function hasClass(el, name) {
    try {
        return new RegExp('(\\s|^)' + name + '(\\s|$)').test(el.className);
    } catch (err) {
        return false;
    }
}

function removeClass(el, name)
{
    if (hasClass(el, name)) {
        el.className = el.className.replace(new RegExp('(\\s|^)' + name + '(\\s|$)'), ' ').replace(/^\s+|\s+$/g, '');
    }
}

function disableToolbar() {
	$("#tbpoint").click();
	$("#zoom-reset").click();
    var allTheTools = HTMLCollectionToArray(document.getElementsByClassName("toolBarButtons")[0].getElementsByClassName("tool"));
    for (var i = 0; i < allTheTools.length - 1; i++) {
        allTheTools[i].className += (" disabled");
    }	
}


function enableToolbar() {
    var allTheTools = HTMLCollectionToArray(document.getElementsByClassName("toolBarButtons")[0].getElementsByClassName("disabled"));
    for (var i = 0; i < allTheTools.length; i++) {
        allTheTools[i].classList.remove("disabled");
    }
}

function hideTheMenu() {
	var allMLsigns = document.querySelectorAll('nav .MLsign');
	for (var i=0; i<allMLsigns.length; i++)
	{
		if (allMLsigns[i].innerHTML != ""){
			allMLsigns[i].innerHTML = '<img width="16" height="16" src="'+acc.RESOURCES_FOLDER+'/layout/menu/MLplus.png">';
		}
	}
    $('nav > ul > ul > ul > li > .MLsign').removeClass("listShown");
    $('nav > ul > ul > ul > li > .MLsign').addClass("listHidden");
    $('nav > ul > ul > ul > ul').slideUp(300);

    $('nav > ul > ul > li > .MLsign').removeClass("listShown");
    $('nav > ul > ul > li > .MLsign').addClass("listHidden");
    $('nav > ul > ul > ul').slideUp(300);

    $('nav > ul > li > .MLsign').removeClass("listShown");
    $('nav > ul > li > .MLsign').addClass("listHidden");
    $('nav > ul > ul').slideUp(300);
    //$('nav > ul > li').hide();
}
/*
 
 */
function myTypeIs(linkID) {
    var myType = "undefined";
    var linkElem = linkID.split("_");
    var exNum = linkElem[linkElem.length - 1];
    var myPosition;
    var myLevel;

    myPosition = acc.jsObj.menu;

    for (var i = 0; i < linkElem.length - 1; i++) {
        myLevel = "level" + (i * 1 + 1);
        myPosition = myPosition[myLevel][linkElem[i]];
    }
    myLevel = "level" + (i * 1 + 1);
    myPosition = myPosition[myLevel][linkElem[linkElem.length - 1]];
    if (myPosition.hasOwnProperty('type')) {
        myType = myPosition.type;
    }
    return myType;
}

function UpALevel() {
    var linkElem = acc.linkID.split("_");
    var newLinkID = "";
    var exNum = linkElem[linkElem.length - 1];

    var onlyLi = []; //pairnw mono ta li gia na ginei swsth antistoixish me to menu pou tha ginetai simulate sto click

    //var curIndex = $(locObj.theElement.parentNode).index();

    if (linkElem.length == 0) {
        //alert("never here");
    } else if (linkElem.length == 1) {
        //alert ("go home");
        document.getElementById("goBack").disabled = true;
        removeClass(document.getElementById("goBack"), "navButtonsEnabled");
        document.getElementById("goBack").className += " navButtonsDisabled";
        document.getElementById("goBack").firstChild.src = acc.RESOURCES_FOLDER+"/layout/navigation/BtnUp_Dis.png";

        document.getElementById("content").scrollTop=0;
		document.getElementById("content").style.overflow = "hidden";
		loadExercise("home");
		cleanSelections();
		updateContent("home");
		 // MENU UPDATE    
		updateMenu("home");
		document.getElementById("unit_title_text").innerHTML = '';
    } else if (linkElem.length == 2) {
        //alert ("up from lesson to unit");
        for (var i = 0; i < document.getElementsByClassName("accClass")[0].children.length; i++) {
            if (document.getElementsByClassName("accClass")[0].children[i].tagName == "LI") {
                onlyLi.push(document.getElementsByClassName("accClass")[0].children[i]);
            }
		}
		var currentLidata = document.getElementsByClassName(" activeMenuElement")[0].getAttribute("data-id").substr(0, document.getElementsByClassName(" activeMenuElement")[0].getAttribute("data-id").lastIndexOf("_"));
		var currentLiNode = $("li[data-id='" + currentLidata + "']")[0];                  
        eventFire(currentLiNode, "click");
    } else if (linkElem.length == 3) {
        for (var i = 0; i < document.getElementsByClassName("accClass")[1].children.length; i++) {
            if (document.getElementsByClassName("accClass")[1].children[i].tagName == "LI") {
                onlyLi.push(document.getElementsByClassName("accClass")[1].children[i]);
            }
        }
        var currentLidata = document.getElementsByClassName(" activeMenuElement")[0].getAttribute("data-id").substr(0, document.getElementsByClassName(" activeMenuElement")[0].getAttribute("data-id").lastIndexOf("_"));
        var currentLiNode = $("li[data-id='" + currentLidata + "']")[0];
        eventFire(currentLiNode, "click");
    }
}

function getThePageNumber(){
    var current = 0;
    var total = 0;
    var linkElem = acc.linkID.split("_");
    switch(acc.DEPTH_COUNT){
        case 1:
            total = acc.unitPages;
            break;
        case 2:
            total = acc.unitPages[linkElem[0]];
            break;
        case 3:
            total = acc.unitPages[linkElem[0]][linkElem[1]];
            break;
    }
    current = getDataAttribute(document.querySelector("li[data-id='" + acc.linkID + "']"), "page");
    return [current, total];
}

function toggleSequence(theDirection) {
    var linkElem = acc.linkID.split("_");
    var newLinkID = "";
    var exNum = linkElem[linkElem.length - 1];
	console.log('linkElem'+linkElem)
    if (theDirection == "next") {
        /* Deactivate of buttons wasn't working on Chrome so had to add the following code...*/
        var myPosition = acc.jsObj.menu;

        for (i = 0; i < linkElem.length - 1; i++) {
            myLevel = "level" + (i * 1 + 1);
            myPosition = myPosition[myLevel][linkElem[i]];
            //myPosition = myPosition[myLevel][linkElem[i]]["level"+(i+2)]
        }
        myLevel = "level" + (i * 1 + 1);
        myPosition = myPosition[myLevel];

        if (exNum == Object.size(myPosition) - 1) {
            return;
        }
        if (exNum == "home") {
            return;
        }
        /* */
        exNum++;
    }
    else {
        /* Deactivate of buttons wasn't working on Chrome so had to add the following code...*/
        if (exNum == 0) {
            return;
        }
        if (exNum == "home") {
            return;
        }
        /*  */
        exNum--;
    }
    if (linkElem.length == 1) {
		/*hideTheMenu();*/
        newLinkID = exNum + "";
    }
    else {
        newLinkID = linkElem[0];
        for (i = 1; i < linkElem.length - 1; i++) {
            newLinkID += "_" + linkElem[i];
        }
        newLinkID += "_" + exNum;
    }
	if (myTypeIs(newLinkID)=="exercise"){
    	loadExercise(newLinkID);
    }
	var currentLiNode = $("li[data-id='" + newLinkID + "']")[0];
	eventFire(currentLiNode, "click");
}

function handleNotes(myObj) {
    if (document.getElementById("notes").style.visibility == "hidden") {
        document.getElementById("notes").style.visibility = "visible";
        document.getElementById("notesb").style.backgroundImage = "url('"+acc.RESOURCES_FOLDER+"/layout/menu/BtnsNotes_Pressed.png')";
    } else {
        document.getElementById("notes").style.visibility = "hidden";
        document.getElementById("notesb").style.backgroundImage = "url('"+acc.RESOURCES_FOLDER+"/layout/menu/BtnsNotes_Idle.png')";
    }
}

/**
 the function that runs when a button is selecetd. Depending on the button that
 was clicked, appropriate action is taken
 **/
function delegateButtonClicks(evt, that, theSenderName, locObj) {

    if (!locObj.theTarget.disabled) {
       // console.log("delegateButtonClicks> evt: " + evt + " that: " + that + " theSenderName: " + theSenderName + "locObj.theTarget : " + locObj.theTarget + "locObj.theTargetType: " + locObj.theTargetType);

        //var theSource = locObj.theTargetName;
        // The Image of Button
        //var str = locObj.theTarget.firstChild;

        switch (theSenderName) {
            case "previous":
            case "next":
                toggleSequence(theSenderName);
                break;
            case "notesb":
                handleNotes(theSenderName);
                break;
            case "goBack" :
                UpALevel();
                break;
            case "audiopl":
            case "audiorew":
            case "audiofor":
                handleAudio(theSenderName);
                break;
            case "tapescr":
                tapescriptShow(theSenderName);
                break;
            case "checkB" :
            case "showB" :
            case "resetB" :
            case "showtext" :
            case "showjust" :
            case "showgrammar" :
            case "showLF" :
            case "showUE" :
            case "showCU" :
            case "videoB" :
            case "showaudio" :
                assignFooterExtraTextButtons(locObj);
                break;
			case "showgrade" :
				$("#grade").toggle();
				break;
            default :
        }
    }
}

function addScroll() {
    var srollingDIV = "";

    if (window.frames[0]) {
        srollingDIV = $(window.frames[0].document.getElementById("extraTextDiv"));
    } else {
        srollingDIV = $(document.getElementById("exercise").contentDocument.frames.document.getElementById("extraTextDiv"));
    }
    function scroller() {
        try {
            srollingDIV.stop().animate({"marginTop": ($(window).scrollTop() + document.getElementById("content-wrapper").scrollTop) + "px"}, "slow");
        } catch (err) {
            console.log(err);
        }
    };
   
   //ok. need to keep a reference to the scroller function. need to have a fucntion the first place because in order to remove the
   //listener, you need to know the name. argument.callee notwithstanding. 
   //basically, when you load another activity the listeneres on content keep piling up. trying to remove it (if its anonymous)
   //does not work. trying to remove it by referencing it does not work (since addscroll runs again so the execution context has changed
   //and although a scroller function **IS** found, it is not the original one. So, I keep a reference on the global scope and by using
   //that i can get rid of it on next execution. Mind you the first time (when there is no listener) an exception will be thrown, hence
   //the need for a try catch statement.
    try {
        document.getElementById("content-wrapper").removeEventListener("scroll", acc.scrollerReference); //ANONYMOUS!!!!!! 
        acc.scrollerReference = scroller;
    } catch (err) {
        console.log("trying to remove listener, but no exist");
        acc.scrollerReference = scroller;
    }
    document.getElementById("content-wrapper").addEventListener("scroll", acc.scrollerReference);
}

function crossBrowserSourceElement(evnt, theNodeType) {
    var fResult = {};
    fResult.condtn = false;
    fResult.theTargetType = "";
    fResult.theTargetName = "";
    fResult.theTarget = "";

    try {
        if (evnt.srcElement) {//chrome property
            //fResult.theTarget = evnt.srcElement;
            fResult.theTarget = findUpTag(evnt.srcElement, "button");

        } else {
            //fResult.theTarget = evnt.originalTarget;
            fResult.theTarget = findUpTag(evnt.originalTarget, "button");
        }

        fResult.theTargetType = fResult.theTarget.type.toLowerCase();
        fResult.theTargetName = fResult.theTarget.name;

        if (fResult.theTargetType != theNodeType) {
            evnt.preventDefault();
        } else {
            fResult.condtn = true;
            //allow bubbling
        }
    } catch (err) {
        //some error handling - usually the click was on the select and it has no name?
        //console.log("err " + err);
    }
    /*
     STUPID: 2nd check for nodeName if type doesn't exist based on try.
     Needs revisiting.
     
     Φαντάζομαι αφού θα το ξαναδούμε θα το αφήσω έτσι για τώρα.
     */
    if (fResult.condtn == false) {
        try {
            if (evnt.srcElement) {//chrome property
                fResult.theTargetType = evnt.srcElement.nodeName.toLowerCase();
                fResult.theTargetName = evnt.srcElement.name;
                fResult.theTarget = evnt.srcElement;
            } else {
                fResult.theTargetType = evnt.originalTarget.nodeName.toLowerCase();//firefox
                fResult.theTargetName = evnt.originalTarget.name;
                fResult.theTarget = evnt.originalTarget;
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
    }
    return fResult;
}

function updateButtons(linkID) {
    var linkElem = linkID.split("_");
    var exNum = linkElem[linkElem.length - 1];
    var myPosition;
    var myLevel;

    if (linkID != "home") {
        if (exNum == "0") {
            document.getElementById("previous").disabled = true;
            document.getElementById("previous").firstChild.src = acc.RESOURCES_FOLDER+"/layout/navigation/BtnPrevious_Dis.png";
            //document.getElementById("previous").style.background="#dddddd";
            $(document.getElementById("previous")).addClass("navButtonsDisabled");
            //alert('eimai 0')
        }
        else {
            document.getElementById("previous").disabled = false;
            document.getElementById("previous").firstChild.src = acc.RESOURCES_FOLDER+"/layout/navigation/BtnPrevious_Off.png";
            $(document.getElementById("previous")).addClass("navButtonsEnabled");
            //document.getElementById("previous").style.background="#ffcc00";
            $(document.getElementById("previous")).removeClass("navButtonsDisabled");
            //alert('den eimai 0')
        }

        myPosition = acc.jsObj.menu;

        for (i = 0; i < linkElem.length - 1; i++) {
            myLevel = "level" + (i * 1 + 1);
            myPosition = myPosition[myLevel][linkElem[i]];
            //myPosition = myPosition[myLevel][linkElem[i]]["level"+(i+2)]
        }
        myLevel = "level" + (i * 1 + 1);
        myPosition = myPosition[myLevel];

        if (exNum == Object.size(myPosition) - 1) {
            document.getElementById("next").disabled = true;
            document.getElementById("next").firstChild.src = acc.RESOURCES_FOLDER+"/layout/navigation/BtnNext_Dis.png";
            //document.getElementById("next").style.background="#dddddd";
            $(document.getElementById("next")).addClass("navButtonsDisabled");
            //alert('eimai full '+Object.size(myPosition))
			/*
			acc.unitState.isComplete = true;
			acc.unitState.grade = 100;
			complete(acc.unitState);
			*/
        }
        else {
            document.getElementById("next").disabled = false;
            document.getElementById("next").firstChild.src = acc.RESOURCES_FOLDER+"/layout/navigation/BtnNext_Off.png";
            $(document.getElementById("next")).addClass("navButtonsEnabled");
            //document.getElementById("next").style.background="#ffcc00";
            $(document.getElementById("next")).removeClass("navButtonsDisabled");
            //alert('den eimai full '+Object.size(myPosition))
        }

        var theText = (exNum * 1 + 1) + " / " + Object.size(myPosition);
        document.getElementById("counter").value = theText;

        if (linkElem.length == 1) {
            var myTitlePart = localizeText(myPosition[linkElem[linkElem.length - 1]].title, acc.myLang).split("|");
            //document.getElementById("unit_title_text").innerHTML = myPosition[linkElem[linkElem.length-1]].title[acc.myLang];
			//document.getElementById("unit_title_text").innerHTML = '<span id="unitNum">' + myTitlePart[0] + '</span><span id="unitTitle">' + myTitlePart[1] + '</span>'
			document.getElementById("unit_title_text").innerHTML = myTitlePart[1]
           /* parent.document.getElementsByTagName("header")[0].className = "icon"; //allazei to xrwma kai logo tou header*/
            document.getElementById("lesson_title").innerHTML = "";
			console.log('linkElem.length == 1')
        }
        else {
            document.getElementById("lesson_title").innerHTML = '<span id="lessonTitle">'+localizeText(myPosition[linkElem[linkElem.length - 1]].title, acc.myLang)+'</span>';
            var myTitlePart = localizeText(acc.jsObj.menu.level1[linkElem[0]].title, acc.myLang).split("|");
            //document.getElementById("unit_title_text").innerHTML = '<span id="unitNum">' + myTitlePart[0] + '</span><span id="unitTitle">' + myTitlePart[1] + '</span>'
			document.getElementById("unit_title_text").innerHTML = myTitlePart[1]
           /* parent.document.getElementsByTagName("header")[0].className = "icon unit_title"; //allazei to xrwma kai logo tou header*/
		   console.log('linkElem.length != 1')
        }

		if (!hasClass(document.getElementById("goBack"), "bempty")){
			if (linkElem.length <= 2) {
				if (acc.levelExpands==true){
					document.getElementById("goBack").disabled = true;
					//removeClass(document.getElementById("goBack"), "navButtonsEnabled");
					document.getElementById("goBack").className = "uibuttons navButtonsDisabled";
					document.getElementById("goBack").firstChild.src = acc.RESOURCES_FOLDER+"/layout/navigation/BtnUp_Dis.png";
				}
			}
			else {
				//
				document.getElementById("goBack").disabled = false;
				//removeClass(document.getElementById("goBack"), "navButtonsDisabled");
				document.getElementById("goBack").className = "uibuttons  navButtonsEnabled";
				document.getElementById("goBack").firstChild.src = acc.RESOURCES_FOLDER+"/layout/navigation/BtnUp_On.png";
			}
		}
    }
    else {
        document.getElementById("previous").disabled = true;
        document.getElementById("previous").firstChild.src = acc.RESOURCES_FOLDER+"/layout/navigation/BtnPrevious_Dis.png";
        //document.getElementById("previous").style.background="#dddddd";
        $(document.getElementById("previous")).addClass("navButtonsDisabled");
        document.getElementById("next").disabled = true;
        document.getElementById("next").firstChild.src = acc.RESOURCES_FOLDER+"/layout/navigation/BtnNext_Dis.png";
        //document.getElementById("next").style.background="#dddddd";
        $(document.getElementById("next")).addClass("navButtonsDisabled");
        document.getElementById("counter").value = "";
    }
}

function updateMenu(linkID)
{
	var link_array;
	var temp_linkID;
	acc.linkID = linkID;
    if (linkID != "home") {
        if ($("nav li[data-id=" + linkID + "]").css('display') == 'none') {
            $("nav li[data-id=" + linkID + "]").show();
        }
        $("nav li[data-id=" + linkID + "]").addClass("activeMenuElement");
        $("nav li[data-id=" + linkID + "]").next().slideDown(300);
        $("nav li[data-id=" + linkID + "] > .MLsign").removeClass("listHidden");
        $("nav li[data-id=" + linkID + "] > .MLsign").addClass("listShown");
        $("nav li[data-id=" + linkID + "] > .MLsign").html($("nav li[data-id=" + linkID + "] > .MLsign").html() == "" ? "" : '<img width="16" height="16" src="'+acc.RESOURCES_FOLDER+'/layout/menu/MLminus.png">');
        $("nav li[data-id=" + linkID + "] > .MLpos").removeClass("bempty");
		if (acc.lvlOfAccDevelopment != "full"){
			link_array = linkID.split("_");
			temp_linkID = link_array[0];
			for (var i=1; i<acc.lvlOfAccDevelopment; i++){
				temp_linkID = temp_linkID+"_"+link_array[i];
			}
			$("nav li[data-id=" + temp_linkID + "] > .MLpos").removeClass("bempty");
		}
    }
    else {
		/*hideTheMenu();*/
        $('nav > ul > li').show();
    }
	console.log("linkID " +linkID )
    updateButtons(linkID);
    try {
        updateBC(linkID);
    } catch (err) {
        //no crumbs
    }
}

function createPages(linkID, myPosition, myLevel)
{
	var theHTML = "";
	if (Array.isArray(myPosition["level" + myLevel])) {
		theHTML += '<div id="levelPages">';
		for (i = 0; i < Object.size(myPosition["level" + myLevel]); i++) {
			if (myPosition["level" + myLevel][i].image) {
				theHTML += ' <div class="ImThumb"><div><p>' + localizeText(myPosition["level" + myLevel][i].title, acc.myLang) + '</p></div><img src="' + myPosition["level" + myLevel][i].image + '" alt="' + localizeText(myPosition["level" + myLevel][i].title, acc.myLang) + '" height=50% data-id="' + 'page' + linkID + '_' + i + '" class="ImThumb"/></div> ';
			}
		}
		theHTML += '</div>';
	}
	else {
		if (myPosition["level" + myLevel].image) {
			theHTML += ' <img src="' + myPosition["level" + myLevel].image + '" alt="' + localizeText(myPosition["level" + myLevel].title, acc.myLang) + '" /> ';
		}
	}
	document.querySelector("#selides").className = "";
	$("#selides").html(theHTML);
	document.querySelector("#levelPages").style.paddingTop = 0;
	document.querySelector("#levelPages").style.paddingLeft = 0;
	document.querySelector("#levelPages").style.width = "auto";
	var allImThumbs = document.querySelectorAll("img.ImThumb");
	while(document.querySelector("#levelPages").scrollHeight>=550-25){
		if (allImThumbs.length > 0)
		{
			for (i = 0; i < allImThumbs.length; i++)
			{
				allImThumbs[i].style.height = (allImThumbs[i].scrollHeight-5)+"px";
			}
		}
		
	}
	document.querySelector("#levelPages").style.paddingTop = ((((550-25)-document.querySelector("#levelPages").scrollHeight)/2)+25)+"px";
	//alert(document.querySelector("#levelPages").scrollWidth+"/"+$("#levelPages").innerWidth()+"/"+$("#levelPages").width());
	document.querySelector("#levelPages").style.paddingLeft = ((((1024-14)-(document.querySelector("#levelPages").scrollWidth-40))/2))+"px";
	document.querySelector("#levelPages").style.width = "990px";
	if (allImThumbs.length > 0)
	{
		for (i = 0; i < allImThumbs.length; i++)
		{
			allImThumbs[i].addEventListener("click",
				function () {
					clickImage(this);
				});
		}
	}
}

function updateContent(linkID)
{
    //alert("updateContent");
    closeVideo();

    // RESET EXTRA BUTTONS
    resetExtraTextButtons();

    // AUDIO PLAYER
    disableAudioButtons();
    stopAudio();
	if (acc.TOOLBAR_EXE_ONLY) {
    	disableToolbar();
	}
	$("#zoom-reset").click();
    var linkElem = linkID.split("_");
    var myPosition, myExtraElemPos, theHTML = "";
    var myLevel;
    var position;
    //alert ('linkID = '+linkID+'  linkElem.length = '+linkElem.length)
    if (linkID != "home") {
        //var mySTring = JSON.stringify(acc.jsObj)
        //alert ('mySTring = '+mySTring)
        myPosition = acc.jsObj.menu;
        myExtraElemPos = acc.jsObjExtras.menu;
        for (var i = 0; i < linkElem.length; i++) {
            myPosition = myPosition["level" + (i + 1)][linkElem[i]];
            myExtraElemPos = myExtraElemPos["level" + (i + 1)][linkElem[i]];
        }

        if (myPosition.image) {

            document.querySelector("#selida").src = myPosition.image;
            document.querySelector("#selida").alt = localizeText(myPosition.title, acc.myLang);
            document.querySelector("#selida").className = "selida";
			if (acc.pageAppearance=="width"){
				document.querySelector("#selida").style.width = "990px";
				document.getElementById("content-wrapper").style.overflow = "auto";
				if (!hasClass(document.querySelector("#selida"), "fullWidth")) {
					document.querySelector("#selida").className = document.querySelector("#selida").className + " fullWidth";
				}
			}
			else{
				document.querySelector("#selida").style.height = "550px";
			}
            if (!hasClass(document.querySelector("#exercise"), "hideMe")) {
                document.querySelector("#exercise").className = document.querySelector("#exercise").className + " hideMe";
            }
			if (!hasClass(document.querySelector("#selides"), "hideMe")) {
				document.querySelector("#selides").className = document.querySelector("#selides").className + " hideMe";
			}
			
            myLevel = linkElem.length + 1;
            if (myPosition["level" + myLevel]) {

                if (Array.isArray(myPosition["level" + myLevel])) {

                    /* **********************
                     POSITION EXTRA KUKLAKIA
                     **************************/
                    //var myExtraElemPos = acc.jsObjExtras.menu["level" + (i + 1)][linkElem[i]];  
                    var allTogetherNow = Object.size(myExtraElemPos["level" + myLevel]) + Object.size(myPosition["level" + myLevel]);
                    for (f = 0; f < allTogetherNow; f++) {
                        if (myExtraElemPos["level" + myLevel][f]) {
                            //console.log("myExtraElemPos[level + myLevel][f].type: "+myExtraElemPos["level" + myLevel][f].type)							
                            if (myExtraElemPos["level" + myLevel][f].type === "video") {
                                //theHTML += ' <img src="'+acc.RESOURCES_FOLDER+'/layout/menu/videaki.png" alt="' + localizeText(myExtraElemPos["level" + myLevel][f].title, acc.myLang) + '" class="kyklakiaExtra" data-id="' + "extraElem" + linkID + '_' + f + '" style="left:' + (myExtraElemPos["level" + myLevel][f].x * 1) + 'px;top:' + (myExtraElemPos["level" + myLevel][f].y * 1) + 'px" />';
                                theHTML += ' <img src="'+acc.RESOURCES_FOLDER+'/layout/menu/videaki.png" alt="' + localizeText(myExtraElemPos["level" + myLevel][f].title, acc.myLang) + '" class="kyklakiaExtra" data-id="' + f + '@' + myExtraElemPos["level" + myLevel][f].type + '@' + myExtraElemPos['level' + myLevel][f].filename + '" style="left:' + (myExtraElemPos["level" + myLevel][f].x * 1) + 'px;top:' + (myExtraElemPos["level" + myLevel][f].y * 1) + 'px" />';
                            } else if (myExtraElemPos["level" + myLevel][f].type === "audio") {
                                theHTML += ' <img src="'+acc.RESOURCES_FOLDER+'/layout/menu/audiaki.png" alt="' + localizeText(myExtraElemPos["level" + myLevel][f].title, acc.myLang) + '" class="kyklakiaExtra" data-id="' + f + '@' + myExtraElemPos["level" + myLevel][f].type + '@' + myExtraElemPos['level' + myLevel][f].filename + '" style="left:' + (myExtraElemPos["level" + myLevel][f].x * 1) + 'px;top:' + (myExtraElemPos["level" + myLevel][f].y * 1) + 'px" />';
                            }
                        }
                    }

                    /* **********************
                     POSITION ACTIVITY KUKLAKIA
                     **************************/
                    for (i = 0; i < Object.size(myPosition["level" + myLevel]); i++) {

                        if (myPosition["level" + myLevel][i].x) {

                            if (myPosition["level" + myLevel][i].type === "exercise") {

                                var offsets = $('#content').offset();
                                var top = offsets.top - $('#content').height;
                                var left = offsets.left - $('#content').width;
                                position = $("#content").position();
                                //theHTML+=' <img src="layout/kyklaki2test.png" alt="'+myPosition["level"+myLevel][i].title[acc.myLang]+'" class="kyklaki" data-id="'+"kyklaki"+linkID+'_'+i+'" style="left:'+(position.left+myPosition["level"+myLevel][i].x*1)+'px;top:'+(position.top+myPosition["level"+myLevel][i].y*1)+'px" />'
                                //For simplicity's sake I omited the content position parameter in order to position  
                                //the kyklaki based on the position that the user sees on screen with Firebug.
                                //We will need it in the future, please don't delete above code yet. Thanks.
                                theHTML += ' <img src="'+acc.RESOURCES_FOLDER+'/layout/menu/kyklaki.png" alt="' + localizeText(myPosition["level" + myLevel][i].title, acc.myLang) + '" class="kyklaki" data-id="' + "kyklaki" + linkID + '_' + i + '" style="left:' + (myPosition["level" + myLevel][i].x * 1) + 'px;top:' + (myPosition["level" + myLevel][i].y * 1) + 'px" />';

                            } else {
                                // EXTRA INFO LINK!!!!
                                //alert(myPosition["level" + myLevel][i].type)
                            }

                            /*POSITION KUKLAKI
                             else if (myPosition["level" + myLevel][i].type === "video") {
                             // VIDEO LINK!!!!
                             //alert(myPosition["level" + myLevel][i].type);
                             theHTML += ' <img src="'+acc.RESOURCES_FOLDER+'/layout/menu/videaki.png" alt="' + localizeText(myPosition["level" + myLevel][i].title, acc.myLang) + '" class="kyklaki" data-id="' + "videaki" + linkID + '_' + i + '" style="left:' + (myPosition["level" + myLevel][i].x * 1) + 'px;top:' + (myPosition["level" + myLevel][i].y * 1) + 'px" />';
                             }
                             
                             */
                        }
                    }
                }
            }
            $("#selidaLinks").html(theHTML);
            document.querySelector("#selidaLinks").className = "";
            //
            if (document.getElementsByClassName("selida")[0].width > document.getElementsByClassName("selida")[0].height) {
                document.getElementsByClassName("selida")[0].className += " myWidth";
            } else {
                document.getElementsByClassName("selida")[0].className += " myHeight";
            }
            /* **********************
             ASSIGN EXTRA KUKLAKIA
             **************************/
            var extrasKYklakia = document.getElementsByClassName("kyklakiaExtra");
            if (extrasKYklakia.length > 0)
            {
                for (i = 0; i < extrasKYklakia.length; i++)
                {
                    extrasKYklakia[i].addEventListener("click",
                            function () {
                                loadVideo(getDataAttribute(this, 'id'));
                            });
                }
            }
            /* **********************
             ASSIGN KUKLAKIA
             **************************/
            var allKYklakis = document.getElementsByClassName("kyklaki");
            if (allKYklakis.length > 0)
            {
                for (i = 0; i < allKYklakis.length; i++)
                {
                    allKYklakis[i].addEventListener("click",
                            function () {
                                loadExercise(getDataAttribute(this, 'id'));
								cleanSelections();
    							updateMenu(getDataAttribute(this, 'id').substr(7));
                            });
                }
            }
        }
        else
        {
            myLevel = linkElem.length + 1;
			document.querySelector("#selida").src = "";
            document.querySelector("#selida").alt = "";
            document.querySelector("#selida").className = "selida hideMe";
			if (!hasClass(document.querySelector("#selidaLinks"), "hideMe")) {
				document.querySelector("#selidaLinks").className = document.querySelector("#selidaLinks").className + " hideMe";
			}
            if (myPosition["level" + myLevel]) {
				if (!hasClass(document.querySelector("#exercise"), "hideMe")) {
					document.querySelector("#exercise").className = document.querySelector("#exercise").className + " hideMe";
				}
				document.querySelector("#selides").style.visibility = "hidden";
				createPages(linkID, myPosition, myLevel);
				var t = setTimeout(function() { 
							createPages(linkID, myPosition, myLevel); 
							document.querySelector("#selides").style.visibility = "visible";
							}, 500);
            }
        }
    }
    else {
        document.getElementById("counter").value = "";
		var tempLang = (acc.myLang==acc.DEFLANG?'':'-'+acc.myLang);
        theHTML = '<object id="exercise" name="exercise" type="text/html" data="'+acc.ACTIVITIES_FOLDER+'/activity'+tempLang+'.html"></object>';
        $("#myObject").html(theHTML);
        //$("#myObject").css("margin-top", "-550px");
		if (!hasClass(document.querySelector("#selides"), "hideMe")) {
			document.querySelector("#selides").className = document.querySelector("#selides").className + " hideMe";
		}
    }
	
    /*TOOLBAR - commented out toolbar functionality*/
	/*
    var myURL = document.URL;
	if (myURL.indexOf("activity.html")==-1){
		myURL = "MENU-"+linkID;
	}
	var info = {
		"height": 550,
		"width": 990,
		"url": myURL
	};
	window.postMessage(info, "*");
    */
}
// LOAD PAGE CONTENT *************************************
var theCurrentPageName;

function openSubsVideo() {
    if (document.querySelectorAll("#pageElementSubs > img")[0].src.indexOf("nosubtitles") === -1) {
        document.querySelectorAll("#pageElementSubs > img")[0].src = acc.RESOURCES_FOLDER+"/layout/menu/nosubtitles.png";
        // LOAD VIDEO SRC
        document.querySelectorAll("#thePageElementsContent > video > source")[0].src = acc.RESOURCES_FOLDER+"/video/" + theCurrentPageName + "_subs.mp4";
        document.querySelectorAll("#thePageElementsContent > video > source")[1].src = acc.RESOURCES_FOLDER+"/video/" + theCurrentPageName + "_subs.ogg";
        //alert("SUBS")
    } else {
        document.querySelectorAll("#pageElementSubs > img")[0].src = acc.RESOURCES_FOLDER+"/layout/menu/subtitles.png";
        // LOAD VIDEO SRC
        document.querySelectorAll("#thePageElementsContent > video > source")[0].src = acc.RESOURCES_FOLDER+"/video/" + theCurrentPageName + ".mp4";
        document.querySelectorAll("#thePageElementsContent > video > source")[1].src = acc.RESOURCES_FOLDER+"/video/" + theCurrentPageName + ".ogg";
        //alert("NO SUBS")
    }

    var videoTag = $('#thePageElementsContent video')[0];
    videoTag.load();
    videoTag.play();
}
function closeVideo() {
    $('#thePageElementsDiv').css('visibility', 'hidden');
	
	var videoTag = $('#thePageElementsContent video')[0];
	videoTag.load();
	videoTag.pause();
	$('#video').html('');
	$('.captions-menu').remove();
}
function loadVideo(linkID) {

    var extraArrayInfo = linkID.split("@");
    //alert("LOAD VIDEO: "+extraArrayInfo);

    if (extraArrayInfo[1] === "audio") {
        var audioPath = acc.RESOURCES_FOLDER+"/audio/" + extraArrayInfo[2] + ".";
        initAudioPlayer(audioPath);
        handleAudio("audiopl");
        document.getElementById("audiopl").disabled = false;

    } else if (extraArrayInfo[1] === "video") {
        // OPEN VIDEO SCREEN BACKGROUND
        $('#thePageElementsDiv').css('visibility', 'visible');

        // Keep Global Filename
        theCurrentPageName = extraArrayInfo[2];

        // ASIIGNE EVENTS for close and subs load
        var theButtonExtra = document.getElementById("pageElementClose");
        //$('#pageElementClose').css('visibility', 'visible'); //if you force visibility, hiding the parent will not hide children (chrome)
        try {
            theButtonExtra.removeEventListener("click", closeVideo);
        } catch (err) {
        }
        theButtonExtra.addEventListener("click", closeVideo);

        var theButtonSubs = document.getElementById("pageElementSubs");
        try {
            theButtonSubs.removeEventListener("click", openSubsVideo);
        } catch (err) {
        }
        theButtonSubs.addEventListener('click', openSubsVideo);

       var videoTag = $('#thePageElementsContent video')[0];

        // LOAD VIDEO SRC
        document.querySelectorAll("#pageElementSubs > img")[0].src = acc.RESOURCES_FOLDER+"/layout/menu/subtitles.png";
		
		
		var myVideoName = acc.RESOURCES_FOLDER+"/video/" + extraArrayInfo[2];
		 
		 $('#video').html('<source src="'+myVideoName+'.mp4" type="video/mp4"><source src="'+myVideoName+'.ogg" type="video/webm"><track label="English" kind="captions" srclang="en" src="'+myVideoName+'.vtt" default>');
		
		// VIDEO CAPTIONS			
        // AUTOPLAY
		setTimeout(function(){runVideo(); videoTag.play();}, 1000);

    } else if (extraArrayInfo[1] === "activityVideo") {
        // OPEN VIDEO SCREEN BACKGROUND
        $('#thePageElementsDiv').css('visibility', 'visible');

        // Keep Global Filename
        theCurrentPageName = extraArrayInfo[2];

        // ASIIGNE EVENTS for close and subs load
        var theButtonExtra = document.getElementById("pageElementClose");
        $('#pageElementClose').css('visibility', 'hidden');
        try {
            theButtonExtra.removeEventListener("click", closeVideo);
        } catch (err) {
        }

        var videoTag = $('#thePageElementsContent video')[0];

        var cutExtraArrayInfo = extraArrayInfo[2].split("_");
		
		var myVideoName2 = acc.ACTIVITIES_FOLDER + "/" + cutExtraArrayInfo[0] + "/" + cutExtraArrayInfo[1] + "/" + cutExtraArrayInfo[2] + "/video";
		
		$('#video').html('<source src="'+myVideoName2+'.mp4" type="video/mp4"><source src="'+myVideoName2+'.ogg" type="video/webm"><track label="English" kind="captions" srclang="en" src="'+myVideoName2+'.vtt" default>');
       // VIDEO CAPTIONS			
        // AUTOPLAY
		setTimeout(function(){runVideo(); videoTag.play();}, 1000);
    }
}

function loadExercise(linkID)
{
    var myPath, i;
    var cleanID = linkID + "";
    if (linkID[0] == "k") {
        cleanID = linkID.substr(7);
    }
    acc.linkID = cleanID + "";
    var linkElem = cleanID.split("_");
    myPath = acc.ACTIVITIES_FOLDER + "/";
    if (linkElem.length > 1) {
        for (i = 0; i < linkElem.length - 1; i++) {
            myPath = myPath + linkElem[i] + "/";
        }
    }
    // AUDIO PLAYER
    var audioPath = acc.RESOURCES_FOLDER+"/audio/";
    for (a = 0; a < linkElem.length; a++) {
        if (a < (linkElem.length - 1)) {
            audioPath += linkElem[a] + "_";
        } else {
            audioPath += linkElem[a];
        }
    }
    //initAudioPlayer(audioPath + ".");
    // AUDIO PLAYER
    // AUDIO SCRIPT

    // ACTIVITY + OBJECT LOAD (path+data)	
	if (acc.linkID == "home"){
		myPath = "activities/activity.html";
	}
	else{		
		acc.currentActFolder = myPath + linkElem[linkElem.length - 1]+"/";

		loadActJSON(acc.currentActFolder+"data/activity.json", function(response) {
			// Parse JSON string into object
			//console.log(JSON.stringify(response));
			activity = JSON.parse(response);
			var myPath = "";
			var localTypeOfActivity = activity;
			localTypeOfActivity=activity["ex"][0]["type"];
			console.log('localTypeOfActivity '+localTypeOfActivity);
			switch (localTypeOfActivity) {
            case "display":
				myPath = "html/display.html"; 
				break;
            case "multiple":
				myPath = "html/multiple.html"; 
				break;
			case "dnd":
                myPath = "html/dnd.html"; 
				break;
			case "match":
                myPath = "html/match.html"; 
				break;
			case "typein":
                myPath = "html/typein.html"; 
				break;
			case "underline":
                myPath = "html/underline.html"; 
				break;	
			case "clickReveal":
                myPath = "html/clickReveal.html"; 
				break;
			case "syncAudio":
                myPath = "html/syncAudio.html"; 
				break;
            default :
				myPath = "html/activity.html"; 
			}
			 if (!hasClass(document.querySelector("#selida"), "hideMe")) {
				document.querySelector("#selida").className = document.querySelector("#selida").className + " hideMe";
			}
			if (!hasClass(document.querySelector("#selidaLinks"), "hideMe")) {
				document.querySelector("#selidaLinks").className = document.querySelector("#selidaLinks").className + " hideMe";
			}
			if (!hasClass(document.querySelector("#selides"), "hideMe")) {
				document.querySelector("#selides").className = document.querySelector("#selides").className + " hideMe";
			}
			document.querySelector("#myObject").innerHTML = '<object id="exercise" name="exercise" type="text/html" data="' + myPath + '" ><\/object>';
			console.log('myPath.innerHTML '+myPath)
			// ON ACTIVITY LOAD - CHANGE BUTTONS !!!!!!!!!!!!!

			var myActObj = document.getElementById('exercise');

			myActObj.onload = function () {
				var myObbH;
				//Calculate OBJECT height
				/*try {
					myObbH = $(document.getElementById("exercise").contentWindow.document.body.childNodes[3]).height();
				} catch (err) {
					myObbH = $(document.getElementById("exercise").contentDocument.body.childNodes[3]).height();
				}
				document.getElementById("exercise").setAttribute("height", myObbH);*/
				document.getElementById("content-wrapper").style.overflow = "auto";
				/*14/07/2015*/
				/*Commented following 2 lines just to avoid error on local version*/
				//resetExtraTextButtons();
				//setExtraTextButtons();
				enableToolbar();
				myActObj.onload = null;
			};
			acc.state = acc.linkID;
			acc.unitState.currentPosition = linkElem[linkElem.length-1];
			
		});
		
	}
   
}

// EXTRA TEXT BUTTONS ********************************************************

// CrossBrowser (IE) to find object content 
function normalisedXtraButtons() {

    var x = document.getElementById("exercise");
    var y = (x.contentWindow || x.contentDocument);
    if (y.document)y = y.document;

    try {
        var ieActivity = y.frames.activity;
    } catch (err) {
        var allOtherActivity = window.frames[0].activity;
    }

    if (ieActivity) {
        var normalisedActivity = ieActivity;
    } else {
        var normalisedActivity = allOtherActivity;
    }

    return normalisedActivity;
}

function normalisedB4ObjTag() {

    var x = document.getElementById("exercise");

    var y = (x.contentWindow || x.contentDocument);
    if (y.document)y = y.document;

    try {
        var ieReference = y.frames.activity;
    } catch (err) {
        var allOtherReference = window.frames[0];
    }

    if (ieReference) {
        var normalisedReference = y.frames;
    } else {
        var normalisedReference = allOtherReference;
    }

    return normalisedReference;
}

// THE LINKS/BUTTONS
function assignFooterExtraTextButtons(locObj) {


    var normalisedReference = normalisedB4ObjTag();

    //debugger;
    if (normalisedReference.spa) {
        var theLocObj = locObj;

        var theSource = theLocObj.theTargetName;
        var str = theLocObj.theTarget.firstChild;
        var res;

        if (str.src.indexOf("On") === -1 && theSource !== "checkB") {

            setExtraTextButtons();
            res = str.src.replace("Off", "On");
        } else {

            res = str.src.replace("On", "Off");
        }

        // CHANGE THE SRC of the Button's Img
        str.src = res;

        // Disable current Button During Animation (set in extraText.js)
        theLocObj.theTarget.disabled = true;

        var myButts = document.getElementsByClassName("mainButtons")[0];
        for (var i = 0; i < myButts.children.length; i++) {
            try {
                if (myButts.children[i].firstChild.firstChild.src.indexOf("On") !== -1 || myButts.children[i].firstChild.firstChild.src.indexOf("Off") !== -1) {
                    myButts.children[i].firstChild.disabled = true;
                }
            } catch (err) {
                //console.log(" Disable Failed:" + err);
            }

        }

        // Enable current Button During Animation (set in extraText.js)
        setTimeout(function () {
            //theLocObj.theTarget.disabled = false;

            for (var i = 0; i < myButts.children.length; i++) {
                try {
                    if (myButts.children[i].firstChild.firstChild.src.indexOf("On") !== -1 || myButts.children[i].firstChild.firstChild.src.indexOf("Off") !== -1) {
                        myButts.children[i].firstChild.disabled = false;
                    }
                } catch (err) {
                    //console.log(" Disable Failed:" + err);
                }

            }

        }, globalTimerExtraText);

        // Change Button Graphic (ON/OFF)			
        switch (theSource) {
            case "checkB" :
                closeVideo();
                normalisedReference.$("#checkAnswers").click();

                /* DISABLE SHOW ALL
                 theOtherBut = document.getElementById("showB");
                 
                 if(theOtherBut.firstChild.src.indexOf("On") === -1 && theOtherBut.firstChild.src.indexOf("Off") === -1){
                 theOtherBut.disabled = false;
                 theOtherBut.firstChild.src = theOtherBut.firstChild.src.replace("Dis", "Off");					
                 } else {
                 theOtherBut.disabled = true;
                 theOtherBut.firstChild.src = theOtherBut.firstChild.src.replace("Off", "Dis");
                 theOtherBut.firstChild.src = theOtherBut.firstChild.src.replace("On", "Dis");	
                 }	
                 */

                break;
            case "showB" :
                closeVideo();
                normalisedReference.$("#showAnswers").click();

                //* DISABLE CHECK ALL
                theOtherBut = document.getElementById("checkB");

                if (theOtherBut.firstChild.src.indexOf("On") === -1 && theOtherBut.firstChild.src.indexOf("Off") === -1) {
                    theOtherBut.disabled = false;
                    theOtherBut.firstChild.src = theOtherBut.firstChild.src.replace("Dis", "Off");
                } else {
                    theOtherBut.disabled = true;
                    theOtherBut.firstChild.src = theOtherBut.firstChild.src.replace("Off", "Dis");
                    theOtherBut.firstChild.src = theOtherBut.firstChild.src.replace("On", "Dis");
                }
                //*/

                break;
            case "resetB" :
                closeVideo();
                
                /*Cookie save skipped below.*/
                /*
                normalisedReference.spa.activityJSON.selections = {};
                normalisedReference.spa.activityJSON.score = "";
                normalisedReference.spa.activityJSON.percentage = "";
                normalisedReference.spa.saveCookie();
                */
                
                normalisedReference.location.reload();//this need to becomne reset now...
                break;
            case "showtext" :
                closeVideo();
                normalisedReference.$("#ShowText").click();
                break;
            case "showjust" :
                closeVideo();
                normalisedReference.$("#ShowJust").click();
                break;
            case "showgrammar" :
                closeVideo();
                normalisedReference.$("#ShowGrammar").click();
                break;
            case "showLF" :
                closeVideo();
                normalisedReference.$("#ShowLF").click();
                break;
            case "showUE" :
                closeVideo();
                normalisedReference.$("#ShowUE").click();
                break;
            case "showCU" :
                closeVideo();
                normalisedReference.$("#ShowCU").click();
                //normalisedReference.$("#ShowGrammar")[0].click();
                break;
            case "videoB" :
                //normalisedReference.$("#ShowVideo").click();					
                //alert(normalisedReference.activity.elements["showvideo"]+" "+acc.jsObj+" "+acc.linkID+" "+acc.globalSettings+" "+acc.jsObjExtras);

                // CHANGED to run from Main
                var myactivityVideoParams = "0@activityVideo@" + acc.linkID;
                if (str.src.indexOf("On") === -1) {
                    closeVideo();
                } else {
                    loadVideo(myactivityVideoParams);
                }

                var theExtraTextDivExt = normalisedReference.document.getElementById('extraTextDiv');
                normalisedReference.enableAllButs();
                normalisedReference.animateExtraHide(theExtraTextDivExt, this);

                break;
            case "showaudio" :
                closeVideo();
                normalisedReference.$("#ShowAudio").click();
                break;
            default :
                "";
        }
    }
}

// USED IN updateContent + loadExercise
function resetExtraTextButtons() {

    //alert("resetExtraTextButtons");

    var theMainButs = document.getElementsByClassName("mainButtons")[0].children;
    var theMainButsLength = theMainButs.length;

    for (i = 0; i < theMainButsLength; i++) {

        var theBut = theMainButs[i].firstChild;
        var theButName = theMainButs[i].firstChild.name;
        var theImg = theMainButs[i].firstChild.firstChild;

        switch (theButName) {
            case "checkB" :
                theBut.disabled = true;
                theBut.style.cursor = "default";
                theImg.src = 'resources/layout/footer/check_Dis.png';
                break;
            case "showB" :
                theBut.disabled = true;
                theBut.style.cursor = "default";
                theImg.src = 'resources/layout/footer/show_Dis.png';
                break;
            case "resetB" :
                theBut.disabled = true;
                theBut.style.cursor = "default";
                theImg.src = 'resources/layout/footer/reset_Dis.png';
                break;
            case "showtext" :
                theBut.disabled = true;
                theBut.style.cursor = "default";
                theImg.src = 'resources/layout/footer/showText_Dis.png';
                break;
            case "showjust" :
                theBut.disabled = true;
                theBut.style.cursor = "default";
                theImg.src = 'resources/layout/footer/justify_Dis.png';
                break;
            case "showgrammar" :
                theBut.disabled = true;
                theBut.style.cursor = "default";
                theImg.src = 'resources/layout/footer/g_Dis.png';
                break;
            case "showLF" :
                theBut.disabled = true;
                theBut.style.cursor = "default";
                theImg.src = 'resources/layout/footer/lf_Dis.png';
                break;
            case "showUE" :
                theBut.disabled = true;
                theBut.style.cursor = "default";
                theImg.src = 'resources/layout/footer/ue_Dis.png';
                break;
            case "showCU" :
                theBut.disabled = true;
                theBut.style.cursor = "default";
                theImg.src = 'resources/layout/footer/cu_Dis.png';
                break;
            case "videoB" :
                theBut.disabled = true;
                theBut.style.cursor = "default";
                theImg.src = 'resources/layout/footer/vid_Dis.png';
                break;
            case "showaudio" :
                theBut.disabled = true;
                theBut.style.cursor = "default";
                theImg.src = 'resources/layout/footer/BtnTxt_Dis.png';
                document.getElementById("rangevalue").value = "";
                break;
            default :

        }
    }
}

// USED IN
function setExtraTextButtons() {

    //alert("setExtraTextButtons");
    //closeVideo();	

    var theMainButs = document.getElementsByClassName("mainButtons")[0].children;
    var theMainButsLength = theMainButs.length;

    var normalisedActivity = normalisedXtraButtons();

    for (i = 0; i < theMainButsLength; i++) {

        var theBut = theMainButs[i].firstChild;
        var theButName = theMainButs[i].firstChild.name;
        var theImg = theMainButs[i].firstChild.firstChild;

        switch (theButName) {
            case "checkB" :
                /*
                 theBut.disabled = true;	
                 theBut.style.cursor = "default";
                 theImg.src = 'resources/layout/footer/check_Dis.png';
                 */
                if (normalisedActivity.ex[0].settings.typeOfCheck.checkButton && normalisedActivity.ex[0].settings.typeOfCheck.checkButton !== undefined) {
                    theBut.disabled = false;
                    theBut.style.cursor = "pointer";
                    theImg.src = 'resources/layout/footer/check_Off.png';
                }
                break;
            case "showB" :
                if (normalisedActivity.ex[0].settings.typeOfCheck.checkButton || (normalisedActivity.ex[0].settings.typeOfCheck.showAll && normalisedActivity.ex[0].settings.typeOfCheck.showAll !== undefined)) {
                    //if (normalisedActivity.ex[0].settings.typeOfCheck.showAll && normalisedActivity.ex[0].settings.typeOfCheck.showAll !== undefined){
                    theBut.disabled = false;
                    theBut.style.cursor = "pointer";
                    theImg.src = 'resources/layout/footer/show_Off.png';
                }
                break;
            case "resetB" :
                /*
                 theBut.disabled = true;	
                 theBut.style.cursor = "default";
                 theImg.src = 'resources/layout/footer/reset_Dis.png';
                 */
                theBut.disabled = false;
                theBut.style.cursor = "pointer";
                theImg.src = 'resources/layout/footer/reset_Off.png';
                break;
            case "showtext" :
                /*
                 theBut.disabled = true;	
                 theBut.style.cursor = "default";
                 theImg.src = 'resources/layout/footer/showText_Dis.png';
                 */
                if (normalisedActivity.elements.showtext !== '' && normalisedActivity.elements.showtext !== undefined) {
                    theBut.disabled = false;
                    theBut.style.cursor = "pointer";
                    theImg.src = 'resources/layout/footer/showText_Off.png';
                }
                break;
            case "showjust" :
                /*
                 theBut.disabled = true;	
                 theBut.style.cursor = "default";
                 theImg.src = 'resources/layout/footer/showText_Dis.png';
                 */
                if (normalisedActivity.elements.showjusttext !== '' && normalisedActivity.elements.showjusttext !== undefined) {
                    theBut.disabled = false;
                    theBut.style.cursor = "pointer";
                    theImg.src = 'resources/layout/footer/justify_Off.png';
                }
                break;
            case "showgrammar" :
                /*
                 theBut.disabled = true;	
                 theBut.style.cursor = "default";
                 theImg.src = 'resources/layout/footer/g_Dis.png';
                 */
                if (normalisedActivity.elements.showgrammar !== '' && normalisedActivity.elements.showgrammar !== undefined) {
                    theBut.disabled = false;
                    theBut.style.cursor = "pointer";
                    theImg.src = 'resources/layout/footer/g_Off.png';
                }
                break;
            case "showLF" :
                /*
                 theBut.disabled = true;	
                 theBut.style.cursor = "default";
                 theImg.src = 'resources/layout/footer/lf_Dis.png';
                 */
                if (normalisedActivity.elements.showLF !== '' && normalisedActivity.elements.showLF !== undefined) {
                    theBut.disabled = false;
                    theBut.style.cursor = "pointer";
                    theImg.src = 'resources/layout/footer/lf_Off.png';
                }
                break;
            case "showUE" :
                /*
                 theBut.disabled = true;	
                 theBut.style.cursor = "default";
                 theImg.src = 'resources/layout/footer/ue_Dis.png';
                 */
                if (normalisedActivity.elements.showUE !== '' && normalisedActivity.elements.showUE !== undefined) {
                    theBut.disabled = false;
                    theBut.style.cursor = "pointer";
                    theImg.src = 'resources/layout/footer/ue_Off.png';
                }
                break;
            case "showCU" :
                /*
                 theBut.disabled = true;	
                 theBut.style.cursor = "default";
                 theImg.src = 'resources/layout/footer/cu_Dis.png';
                 */
                if (normalisedActivity.elements.showCU !== '' && normalisedActivity.elements.showCU !== undefined) {
                    theBut.disabled = false;
                    theBut.style.cursor = "pointer";
                    theImg.src = 'resources/layout/footer/cu_Off.png';
                }
                break;
            case "videoB" :
                /*
                 theBut.disabled = true;	
                 theBut.style.cursor = "default";
                 theImg.src = 'resources/layout/footer/vid_Dis.png';
                 */
                if (normalisedActivity.elements.showvideo !== '' && normalisedActivity.elements.showvideo !== undefined) {
                    theBut.disabled = false;
                    theBut.style.cursor = "pointer";
                    theImg.src = 'resources/layout/footer/vid_Off.png';
                }
                break;
            case "showaudio" :
                /*
                 theBut.disabled = true;	
                 theBut.style.cursor = "default";
                 theImg.src = 'resources/layout/footer/BtnTxt_Dis.png';
                 */
                if (normalisedActivity.elements.showaudio !== '' && normalisedActivity.elements.showaudio !== undefined) {
                    theBut.disabled = false;
                    theBut.style.cursor = "pointer";
                    theImg.src = 'resources/layout/footer/BtnTxt_Off.png';
                }
                break;
            default :

        }
    }
}

function cleanSelections() {
    $('nav > ul >  ul >  ul >  ul >  li').removeClass("activeMenuElement");
    $('nav > ul >  ul >  ul >  ul >  li > .MLpos').addClass("bempty");
    $('nav > ul >  ul >  ul >  li').removeClass("activeMenuElement");
    $('nav > ul >  ul >  ul >  li > .MLpos').addClass("bempty");
    $('nav > ul >  ul >  li').removeClass("activeMenuElement");
    $('nav > ul >  ul >  li > .MLpos').addClass("bempty");
    $('nav > ul >  li').removeClass("activeMenuElement");
    $('nav > ul >  li > .MLpos').addClass("bempty");
}

function countExercises(theObj, theDepth, theLevel){
    var exerciseNumber = 0;
    var theLength, newDepth, newLevel;
    if (theLevel==undefined)
        theLevel=1;
    if (theDepth==1){
        if (theObj["level"+theLevel]){
            exerciseNumber = JSON.stringify(theObj["level"+theLevel]).split('"type":"exercise"').length-1;
        }
        else{
            exerciseNumber = JSON.stringify(theObj).split('"type":"exercise"').length-1;
        }
    }
    else{
        if (theObj["level"+theLevel]){
            exerciseNumber = [];
            theLength = theObj["level"+theLevel].length;
            newDepth = theDepth - 1;
            newLevel = theLevel + 1;
            for (var i=0; i<theLength; i++){
                exerciseNumber.push(countExercises(theObj["level"+theLevel][i], newDepth, newLevel));
            }
        }
        else{
            exerciseNumber = JSON.stringify(theObj["level"+theLevel]).split('"type":"exercise"').length-1;
        }
    }
    return exerciseNumber;
}

function clickImage(myImage){
    var myID = getDataAttribute(myImage, 'id');
    var cleanID = myID;
    if (myID[0] == "p") {
        cleanID = myID.substr(4);
    }
	var currentLiNode = $("li[data-id='" + cleanID + "']")[0];
	eventFire(currentLiNode, "click");
}

function showHideChildren(e) {
    if (hasClass(this, "listShown")) {
        $(this.parentNode).next().slideUp(300);
        $(this).removeClass("listShown");
        $(this).addClass("listHidden");
        this.innerHTML = '<img width="16" height="16" src="'+acc.RESOURCES_FOLDER+'/layout/menu/MLplus.png">';
        e.stopPropagation();
    }
    else {
        $(this.parentNode).next().slideDown(300);
        $(this).removeClass("listHidden");
        $(this).addClass("listShown");
        this.innerHTML = '<img width="16" height="16" src="'+acc.RESOURCES_FOLDER+'/layout/menu/MLminus.png">';
        e.stopPropagation();
    }
}

function level2ndClick() {
    var myLength;
    var myID = getDataAttribute(this, 'id');
    cleanSelections();
    if (false == $(this).next().is(':visible')) {
        /*$('nav > ul').slideUp(300);*/
    }	
	updateMenu(myID);
	document.getElementById("content").scrollTop=0;
    document.getElementById("content").style.overflow = "hidden";
    updateContent(myID);
}

function level1stClick() {
    var clickExpandsSelection = acc.levelExpands;
    if (!clickExpandsSelection) {
        var myLength;
        var myID = getDataAttribute(this, 'id');
        cleanSelections();
        if (false == $(this).next().is(':visible')) {
            /*hideTheMenu();*/
        }
        updateMenu(myID);
		document.getElementById("content").scrollTop=0;
		document.getElementById("content").style.overflow = "hidden";
        updateContent(myID);
        document.getElementById("goBack").disabled = false;
        document.getElementById("goBack").className = "uibuttons navButtonsEnabled";
        document.getElementById("goBack").firstChild.src = acc.RESOURCES_FOLDER+"/layout/navigation/BtnUp_On.png";
    } else {
        $(this.lastChild).click();
    }
}

function createEachLevel(lvl, theObj, myID)
{
    var theHTML;
    var myLevel = lvl + 1;
    var i;
    var myText = localizeText(theObj.title, acc.myLang);
    var spanTaNeyvr = new RegExp;
    var searchPattern = /(.*?)\|(.*?)/;
    var replacePattern = '</span><span>$1</span><span class = "whiteMe">$2';
	var hideLevelClass = '';
    if ((lvl+1)==acc.DEPTH_COUNT){
        acc.pageNo = 0;
    }
    if (localizeText(theObj.title, acc.myLang).indexOf("|") > 0) {
        myText = localizeText(theObj.title, acc.myLang).replace(searchPattern, replacePattern);
        //myText = localizeText(theObj.title, acc.myLang).replace('|', '</span><span class = "whiteMe">'); 
    }
    if (theObj.hasOwnProperty("level" + myLevel)) {
		if (myLevel-1 >= acc.lvlOfAccDevelopment){
			 hideLevelClass = ' alwaysHidden ';
		}
		//--remove image: MLplus.png
		theHTML = '<li data-id="' + myID + '"  style="cursor:default" class="alwaysHidden"><div class="MLpos bempty"><img width="15" height="15" src="'+acc.RESOURCES_FOLDER+'/layout/menu/MLpos.png"></div><span>' + myText + '</span></li>';
        //if (theObj["level"+myLevel]){
        theHTML += '<ul class="accClass'+hideLevelClass+'">';
        if (Array.isArray(theObj["level" + myLevel])) {
			if (Object.size(theObj["level" + myLevel])==0){
				/*theHTML = theHTML.replace('<img width="16" height="16" src="'+acc.RESOURCES_FOLDER+'/layout/menu/MLminus.png">', '');*/
			}
			else{
				for (i = 0; i < Object.size(theObj["level" + myLevel]); i++) {
					theHTML += createEachLevel(myLevel, theObj["level" + myLevel][i], myID + "_" + i);
				}
			}
        }
        else {
            theHTML += createEachLevel(myLevel, theObj["level" + myLevel], myID + "_0");
        }
        theHTML += '</ul>';
		theHTML = theHTML.replace('<ul class="accClass"></ul>', '');
    }
    else {
        theHTML = '<li data-id="' + myID + '" ><div class="MLpos bempty"><img width="15" height="15" src="'+acc.RESOURCES_FOLDER+'/layout/menu/MLpos.png"></div><span>' + myText + '</span><div class="MLsign listHidden"></div></li>';
        var a = 0;
		myID=myID + "";
		//console.log("1672-myID "+myID)
        if (myTypeIs(myID + "") == "exercise") {
             if ((lvl+1)<acc.DEPTH_COUNT){
                acc.pageNo = 0;
            }
            var myI = myID.substr(myID.lastIndexOf("_") + 1);
            var extraClass = '';
			if (myID.lastIndexOf("_")>=0){
				extraClass = (myI % 2 == 0 ? '' : ' altColor');
			}
            acc.pageNo++;
            theHTML = '<li data-id="' + myID + '" class="menuEx' + extraClass + '" data-page="' + acc.pageNo + '"><div class="MLpos bempty"><img width="15" height="15" src="'+acc.RESOURCES_FOLDER+'/layout/menu/MLpos.png"></div><a href="#" >' + localizeText(theObj.title, acc.myLang) + '</a></li><ul></ul>';
        }
    }
    return theHTML;
}

function readXML() {
    var theXMLElements = new Object();
    var countCorrect;
    var itemType;
    var myLVL1, myLVL2, myLVL3;
    theXMLElements.menu = '';
    theXMLElements.content = '';
    //*****************************

    // SEPARATE EXERCISE DATA TO EXTRA[i.e. video] DATA
    var exerciseObject = JSON.parse(JSON.stringify(txtMenu));
    var extraObject = JSON.parse(JSON.stringify(txtMenu));


    for (i = 0; i < Object.size(txtMenu.menu.level1); i++) {
        for (j = 0; j < Object.size(txtMenu.menu.level1[i].level2); j++) {
            for (k = 0; k < Object.size(txtMenu.menu.level1[i].level2[j].level3); k++) {

                try {
                    if (txtMenu.menu.level1[i].level2[j].level3[k].type && txtMenu.menu.level1[i].level2[j].level3[k].type === "video" || txtMenu.menu.level1[i].level2[j].level3[k].type && txtMenu.menu.level1[i].level2[j].level3[k].type === "audio") {
                        //console.log("txtMenu: "+txtMenu.menu.level1[i].level2[j].level3[k].type +" | "+i+" | "+j+" | "+k)
                        delete exerciseObject.menu.level1[i].level2[j].level3[k];
                    }
                }
                catch (e) {
                    //console.log("error Exercise: " + e);
                }

                try {
                    if (txtMenu.menu.level1[i].level2[j].level3[k].type && txtMenu.menu.level1[i].level2[j].level3[k].type === "exercise") {
                        //console.log("txtMenu: "+txtMenu.menu.level1[i].level2[j].level3[k].type +" | "+i+" | "+j+" | "+k)
                        delete extraObject.menu.level1[i].level2[j].level3[k];
                    }
                }
                catch (e) {
                    //console.log("error Extras: " + e);
                }
            }
        }

    }
    acc.jsObjExtras = extraObject;
    //******************************
    var jsonText = "";
    //acc.jsObj = txtMenu;
    acc.jsObj = exerciseObject;
    theXMLElements.menu += '<ul class="accClass">';
    acc.pageNo = 0;
    for (i = 0; i < Object.size(acc.jsObj.menu.level1); i++)
    {
        theXMLElements.menu += createEachLevel(1, acc.jsObj.menu.level1[i], i);
    }
    theXMLElements.menu += '</ul>';

    return theXMLElements;
}


function makePageChanges(theContent) {
    $("nav").html(theContent.menu);

	var tempLang = (acc.myLang==acc.DEFLANG?'':'-'+acc.myLang);
    theHTML = '<object id="exercise" name="exercise" type="text/html" data="'+acc.ACTIVITIES_FOLDER+'/activity'+tempLang+'.html" ></object>';
    $("#myObject").html(theHTML);
  
    switch (get_browser()) {
        case "Microsoft Internet Explorer":
        case "Netscape":
          //  document.querySelector("#content-wrapper").style.height = "550px";
            break;
        case "Chrome":
           // document.querySelector("#content-wrapper").style.height = "550px";
            break;
    }
}

function buildGui(setts) {
    var localProps = [];
    for (var name in setts.buttonLabels) {
        localProps.push(name);
    }

    for (var i = 0; i < Object.size(setts.buttonLabels); i++) {
        try {
            document.getElementsByName(localProps[i])[0].value = setts.buttonLabels[localProps[i]];
        } catch (err) {
            // if(window.console && console.error("buildGui Error:" + err));
        }
    }
    return setts;
}

function keepCorrectButtons(setts) {
    var localProps = [];
    for (var i = 0; i < Object.size(setts.buttonsOn); i++) {
        try {
            removeClass(document.getElementsByName(setts.buttonsOn[i])[0], 'bempty');
        } catch (err) {
        }
    }
	if (hasClass(document.getElementById("showgrade"), "bempty")){
		document.getElementById("seperator0").style.display = "none";
	}
}

function GetFilename(url) {
    if (url) {
        var m = url.toString().match(/.*\/(.+?)\./);
        if (m && m.length > 1) {
            return m[1];
        }
    }
    return "";
}

function changeIndex(evt) {
    $("nav").addClass("lowerIndex");
    PrefixedEventRemove(document.querySelector("nav"), "AnimationEnd", changeIndex);
}
function closeMenuOnFocus() {
	console.log('here')	
	document.getElementById("menuList").firstChild.src = acc.RESOURCES_FOLDER+"/layout/menu/menuListBTN.jpg";
	//Hide tha navigation list....		
	removeClass(document.querySelector("nav"), "fadeInRight");
	$("nav").addClass("fadeOutRight animated", function () {
	});
	$("nav").addClass("lowerIndex");
}

function registration(userInfo, state, unitState, error){		
	if (error){
	}
	else {
		acc.userInfo = userInfo;
		acc.state = state;
		acc.unitState = unitState;
		console.log("userInfo - "+acc.userInfo);
		console.log("state - "+acc.state);
		console.log("unitState - "+acc.unitState);
		if ((acc.state=="")||(acc.state==null)){
			acc.state = "0_0";
		}
		$('li[data-id="'+acc.state+'"]').click();
	}
}

function onUnloadApp(evt){
	complete(acc.unitState);
}

$(document).ready(function () {
    var myLength;

    makePageChanges(readXML());
    acc.unitPages = countExercises(txtMenu.menu, acc.DEPTH_COUNT);
    var listItemsNode = document.querySelectorAll('nav > ul.accClass > li');
    for (i = 0; i < listItemsNode.length; i++)
    {
        myLength = listItemsNode[i].childNodes.length;
        if (myLength > 2) {
			/*
           listItemsNode[i].addEventListener("click", level1stClick);
           listItemsNode[i].childNodes[myLength - 1].addEventListener("click", showHideChildren);
		   */
        }
    }

    listItemsNode = document.querySelectorAll("nav > ul.accClass > ul.accClass > li");
    for (i = 0; i < listItemsNode.length; i++)
    {
        myLength = listItemsNode[i].childNodes.length;
        if (myLength > 2) {
            listItemsNode[i].addEventListener("click", level2ndClick);
            listItemsNode[i].childNodes[myLength - 1].addEventListener("click", showHideChildren);
        }
    }
    listItemsNode = document.querySelectorAll("nav > ul.accClass > ul.accClass > ul.accClass > li");
    for (i = 0; i < listItemsNode.length; i++)
    {
        myLength = listItemsNode[i].childNodes.length;
        if (myLength > 2) {
            listItemsNode[i].addEventListener("click", level2ndClick);
            listItemsNode[i].childNodes[myLength - 1].addEventListener("click", showHideChildren);
        }
    }

    var allmenuExs = document.getElementsByClassName("menuEx");
    if (allmenuExs.length > 0)
    {
        for (i = 0; i < allmenuExs.length; i++)
        {
            allmenuExs[i].addEventListener("click",
                    function () {
                        loadExercise(getDataAttribute(this, 'id'));
						// MENU UPDATE
						cleanSelections();
						updateMenu(getDataAttribute(this, 'id'));
						document.getElementById("menuList").firstChild.src = acc.RESOURCES_FOLDER+"/layout/menu/menuListBTN.jpg";
                        //Hide tha navigation list....		
                        removeClass(document.querySelector("nav"), "fadeInRight");
                        $("nav").addClass("fadeOutRight animated", function () {

                        });
                        $("nav").addClass("lowerIndex");
                    });
        }
    }

    $('nav > ul:eq(0)').show('fast');

    //remove unecessary buttons, as defined in the settings
    keepCorrectButtons(settings);
    //label buttons, as defined in the settings
    acc.globalSettings = buildGui(settings);

    document.getElementById("navigationButs").addEventListener("click", function (e) {

        var locObj = crossBrowserSourceElement(e, "submit");

        if (locObj.condtn) {
            delegateButtonClicks(e, this, locObj.theTargetName, locObj);
        } else {
            //nothing
        }
    });

    document.getElementById("buttons").addEventListener("click", function (e) {

        var locObj = crossBrowserSourceElement(e, "submit");

        if (locObj.condtn) {
            delegateButtonClicks(e, this, locObj.theTargetName, locObj);
        } else {
            //nothing
        }
    });

    $("nav").css("opacity", 0);
    $("nav").addClass("lowerIndex");
	$("nav").addClass("responSize");

    document.getElementById("menuList").addEventListener("click", function (e) {
		e.stopPropagation();
        if (hasClass(document.querySelector("nav"), "animated")) {
            if (hasClass(document.querySelector("nav"), "fadeOutRight")) {
				document.getElementById("menuList").firstChild.src = acc.RESOURCES_FOLDER+"/layout/menu/menuListBTNhover.jpg";
                removeClass(document.querySelector("nav"), "fadeOutRight");
                removeClass(document.querySelector("nav"), "lowerIndex");
                $("nav").addClass("fadeInRight");
            } else if (hasClass(document.querySelector("nav"), "fadeInRight")) {
				document.getElementById("menuList").firstChild.src = acc.RESOURCES_FOLDER+"/layout/menu/menuListBTN.jpg";
                removeClass(document.querySelector("nav"), "fadeInRight");
                $("nav").addClass("fadeOutRight");
                PrefixedEvent(document.querySelector("nav"), "AnimationEnd", changeIndex);
            }
        }
        else {
            removeClass(document.querySelector("nav"), "lowerIndex");
            $("nav").addClass("animated fadeInRight");
        }
    });
	if (acc.hiddenAccordion==true){
		/*
		document.querySelector("#menuList").style.display = "none";
		document.querySelector("nav").style.display = "none";	
		*/
	}
    document.getElementById("previous").disabled = true;
    document.getElementById("previous").firstChild.src = acc.RESOURCES_FOLDER+"/layout/navigation/BtnPrevious_Dis.png";
    //document.getElementById("previous").style.color="#dddddd";
    $(document.getElementById("previous")).addClass("navButtonsDisabled");
    document.getElementById("next").disabled = true;
    document.getElementById("next").firstChild.src = acc.RESOURCES_FOLDER+"/layout/navigation/BtnNext_Dis.png";
	//document.getElementById("next").style.color="#dddddd";
    /*
     document.getElementById("tapescr").disabled = true;
     $(document.getElementById("tapescr")).addClass("navButtonsDisabled");
     */
    $(document.getElementById("next")).addClass("navButtonsDisabled");
    document.getElementById("counter").value = "";
    document.getElementById("counter").style.cursor = "default";

    // UP LEVEL INIT
    document.getElementById("goBack").disabled = true;
    document.getElementById("goBack").firstChild.src = acc.RESOURCES_FOLDER+"/layout/navigation/BtnUp_Dis.png";
    $(document.getElementById("goBack")).addClass("navButtonsDisabled");

	if (!acc.TOOLBAR_EXE_ONLY) {
    	enableToolbar();
	}	
	//loadJSON(function(response) {
	// Parse JSON string into object
	//acc.infoJSON = JSON.parse(response);
    try {
	   register(registration);
    }
    catch(err){
	   $('li[data-id="0_0"]').click();
    }

	document.querySelector("body").addEventListener("unload", onUnloadApp);

	
	/*
	  $("div").focusin(function(){
        $(this).css("background-color", "#FFFFCC");
    });
    $("div").focusout(function(){
        $(this).css("background-color", "#FFFFFF");
    });
	*/

	//$(document.getElementById("menuList")).focusin(function(){
       /* $(this).css("background-color", "#FFFFFF");*/
		//console.log('focus in');
  // });

$("html").click(function(){
	closeMenuOnFocus()
})

// END OF DOCUMENT READY

});