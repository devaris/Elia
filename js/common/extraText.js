
// GLOBAL TIME for extra show/hide
var globalTimerExtraText = 500;


var extraButtons = {
    showtext: false,
    showgrammar: false,
    showLF: false,
    showUE: false,
    showCU: false,
    showaudio: false,
    showvideo: false,
    showjusttext: false
};

function enableAllButs() {
    extraButtons.showtext = false;
    extraButtons.showgrammar = false;
    extraButtons.showLF = false;
    extraButtons.showUE = false;
    extraButtons.showCU = false;
    extraButtons.showaudio = false;
    extraButtons.showvideo = false;
    extraButtons.showjusttext = false;
}

function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function animateExtraShow(theExtraTextDiv, theButton) {

    theExtraTextDiv.style.visibility = 'visible';
    theExtraTextDiv.style.opacity = 0;
    theExtraTextDiv.style.width = 0;

    // Check and mute Video			
    try {
        var normalisedActivity = normalisedXtraButtons();
        normalisedActivity.document.getElementsByTagName('video')[0].pause();
    } catch (e) {
        //ERROR FINDING VIDEO
        console.log("AnimateExtraShow NormalisedActivity - Video Pause error: " + e)
    }

    $(theExtraTextDiv).animate({
        opacity: 1,
        //left: "+=50",
        //height: "toggle"
        //width: "999px"
        width: "985px"
    }, globalTimerExtraText, function () {
        // Animation complete.
        theButton.disabled = false;
    });

}

function animateExtraHide(theExtraTextDiv, theButton) {

    var keepMyLeft = theExtraTextDiv.style.left;
	var keepMyRight = theExtraTextDiv.style.right;
    var keepMyWidth = theExtraTextDiv.style.width;

    // Check and mute Video			
    try {
        var normalisedActivity = normalisedXtraButtons();
        normalisedActivity.document.getElementsByTagName('video')[0].pause();
    } catch (e) {
        //ERROR FINDING VIDEO
        console.log("AnimateExtraHide NormalisedActivity Video Pause error: " + e)
    }

	switch(spa.myDir){
		case "rtl":
			$(theExtraTextDiv).animate({
				//opacity: 0,
				//left: 0,
				right: 0,
				//position: "relative",
				//height: "toggle"
				width: 0
			}, globalTimerExtraText, function () {
				// Animation complete.
				theButton.disabled = false;
		
				theExtraTextDiv.style.visibility = 'hidden';
		
				theExtraTextDiv.style.right = keepMyRight;
				theExtraTextDiv.style.width = keepMyWidth;
		
			});
			break;
		default:
			$(theExtraTextDiv).animate({
				//opacity: 0,
				left: 0,
				//right: 0,
				//position: "relative",
				//height: "toggle"
				width: 0
			}, globalTimerExtraText, function () {
				// Animation complete.
				theButton.disabled = false;
		
				theExtraTextDiv.style.visibility = 'hidden';
		
				theExtraTextDiv.style.left = keepMyLeft;
				theExtraTextDiv.style.width = keepMyWidth;
		
			});
			break;
	}
}

function showObject(whichText, theExtraTextDiv, childDiv, myObj, theExtraTextDiv, theButton) {
    if ((get_browser() != "Safari") && (get_browser() != "Netscape")) {//this is  a workaround to resolve the scrolling on safari/ipad. what is done, the external html page
                                    //loads in the object, but then the contents are transfered to the div that displays inline content from json
        //Calculate OBJECT height
        try {
            //alert("1 - "+$(myObj.contentWindow.document.body.childNodes[1]).height())
            var myObbH = $(myObj.contentWindow.document.body.childNodes[1]).height() + 100;
        } catch (err) {
            //alert("2 - "+$(myObj.contentDocument.body.childNodes[1]).height())
            var myObbH = $(myObj.contentDocument.body.childNodes[1]).height() + 100;
        }
        myObj.setAttribute("height", myObbH);

        ShowDivInCenter(whichText, theExtraTextDiv, childDiv, myObj);

        animateExtraShow(theExtraTextDiv, theButton);
    } else {
        //alert(get_browser());
        var theExtraTextDiv = document.getElementById('extraTextDiv');

        var childDiv = document.getElementById('extraText_child');
        var myHtml = document.getElementById('extraText_child_div');
        var myObj = document.getElementById('extraText_child_obj');

        //document.getElementById("extraText_child_div").innerHTML = window.frames[0].document.body.innerHTML;

        myObj.style.display = 'none';
        myHtml.style.display = 'block';
        //$(theExtraTextDiv).css("zindex", 400);
        myHtml.innerHTML = window.frames[0].document.body.innerHTML;
        ShowDivInCenter(whichText, theExtraTextDiv, childDiv, myHtml);

        animateExtraShow(theExtraTextDiv, theButton);

    }
}



// LOAD JSON HTML or HTML PAGE
function createExtraText(whichText, theButton) {

    var theExtraTextDiv = document.getElementById('extraTextDiv');

    var childDiv = document.getElementById('extraText_child');
    var myHtml = document.getElementById('extraText_child_div');
    var myObj = document.getElementById('extraText_child_obj');

    childDiv.style.display = 'block';

    theButton.disabled = true;

    //alert(whichText)

    if (extraButtons[whichText]) {

        enableAllButs();
        //extraButtons[whichText] = false;
        animateExtraHide(theExtraTextDiv, theButton);

    } else {

        enableAllButs();
        extraButtons[whichText] = true;

        // READ JSON
        var whichTextSetting = activity.elements[whichText];

        if ((whichTextSetting.indexOf('.html') == -1) && (whichTextSetting.indexOf('.htm') == -1)) {

            myObj.style.display = 'none';
            myHtml.style.display = 'block';
			
			if (spa.myVersion == "student"){
				whichTextSetting = whichTextSetting.substr(0, whichTextSetting.indexOf('.jpg'))+"St"+whichTextSetting.substr(whichTextSetting.indexOf('.jpg'))
			}
            myHtml.innerHTML = whichTextSetting;
            ShowDivInCenter(whichText, theExtraTextDiv, childDiv, myHtml);

            animateExtraShow(theExtraTextDiv, theButton);

        } else {

            myHtml.style.display = 'none';
            myObj.style.display = 'block';
			
			if (spa.myVersion == "student"){
				whichTextSetting = whichTextSetting.substr(0, whichTextSetting.indexOf('.htm'))+"St"+whichTextSetting.substr(whichTextSetting.indexOf('.htm'))
			}

            if (myObj.data.indexOf(whichTextSetting) !== -1) {
                console.log("myObj.data NO CHANGE");
                showObject(whichText, theExtraTextDiv, childDiv, myObj, theExtraTextDiv, theButton);

            } else {
                myObj.style.display = "none";
                myObj.data = whichTextSetting;

                myObj.style.display = "block";
            }

            myObj.onload = function () {
                console.log("myObj.data LOADED");

                showObject(whichText, theExtraTextDiv, childDiv, myObj, theExtraTextDiv, theButton);

                childDiv.onload = null;

            };

            /* CHANGE PATH (ROOT)
             var activityURLPos = document.location.href.lastIndexOf(spa.ACTIVITIES_FOLDER);
             var rootPath = document.location.href.substring(0, activityURLPos);
             myObj.data = rootPath+whichTextSetting;					
             */

        }

    }


}

function ShowDivInCenter(whichText, theExtraTextDiv, childDiv, visElem) {

    function runNano() {
        //console.log("-----DOME3-------")
        $(".nano").nanoScroller();
    }

    try {


        function posOuter() {
            //console.log("-----posOuter-------")
            // OUTER DIV
            divWidthParent = theExtraTextDiv.offsetWidth;
            divHeightParent = theExtraTextDiv.offsetHeight;
            centerXParent = self.innerWidth;
            centerYParent = self.innerHeight;

            var offsetLeftB = (centerXParent - divWidthParent) / 2;
			var offsetRightB = (centerXParent - divWidthParent) / 2;
            var offsetTopB = (centerYParent - divHeightParent) / 2;

            theExtraTextDiv.style.position = 'fixed';
            theExtraTextDiv.style.display = "block";

            if (inIframe()) {
                console.log("inIframe");
                theExtraTextDiv.style.top = '0px';
				switch (spa.myDir){
					case "rtl":
						theExtraTextDiv.style.right = '0px';
						break;
					default:
		                theExtraTextDiv.style.left = '0px';
						break
				}
            } else {
                console.log("Solo");
                theExtraTextDiv.style.top = offsetTopB + 'px';
				switch (spa.myDir){
					case "rtl":
		                theExtraTextDiv.style.right = offsetRightB + 'px';
						break;
					default:
		                theExtraTextDiv.style.left = offsetLeftB + 'px';
				}
            }
        }

        function posInner() {
            //console.log("-----posInner-------")

            if (visElem.firstChild) {
                if (visElem.firstChild.nodeName == "IMG") {
                    divWidth = $(visElem.firstChild).width();
                    divHeight = $(visElem.firstChild).height();
                } else {
                    divWidth = theExtraTextDiv.offsetWidth;
                    divHeight = theExtraTextDiv.offsetHeight;
                    visElem.style.margin = '0px 20px';
                }
            } else {
                divWidth = $(visElem).width();
                divHeight = $(visElem).height();
            }

            centerX = theExtraTextDiv.offsetWidth;
            centerY = theExtraTextDiv.offsetHeight;

            var offsetLeft = (centerX - divWidth) / 2;
			var offsetRight = (centerX - divWidth) / 2;
            var offsetTop = (centerY - divHeight) / 2;

		visElem.style.position = 'absolute';
            //visElem.style.top = offsetTop + 'px';
			switch (spa.myDir){
				case "rtl":
					visElem.style.right = offsetRight + 'px';
					break;
				default:
					visElem.style.left = offsetLeft + 'px';
					break;
			}
            visElem.style.display = "block";

        }

    } catch (e) {
        console.log("ShowDivInCenter Error: " + e);
    }
    runNano();
    posOuter();
    //posInner();


    //setTimeout(function(){runNano();}, 2000);
    //setTimeout(function(){posOuter();}, 1000);
    setTimeout(function () {
        posInner();
    }, globalTimerExtraText);
}



function assignText() {

    //$(".nano").nanoScroller();

    document.getElementById('ShowText').addEventListener("click", function () {
        createExtraText("showtext", this);
    });

    document.getElementById('ShowJust').addEventListener("click", function () {
        createExtraText("showjusttext", this);
    });

    document.getElementById('ShowGrammar').addEventListener("click", function () {
        createExtraText("showgrammar", this);
    });

    document.getElementById('ShowLF').addEventListener("click", function () {
        createExtraText("showLF", this);
    });

    document.getElementById('ShowUE').addEventListener("click", function () {
        createExtraText("showUE", this);
    });

    document.getElementById('ShowCU').addEventListener("click", function () {
        createExtraText("showCU", this);
    });

    document.getElementById('ShowAudio').addEventListener("click", function () {
        createExtraText("showaudio", this);
    });

    try {
        document.getElementById('ShowVideo').addEventListener("click", function () {
            createExtraText("showvideo", this);
        });
    } catch (e) {
        return true;
    }

}

