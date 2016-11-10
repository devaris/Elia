
var UNIT = 1;
var LESSON = 1;

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1).toLowerCase();
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    	// If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    	// If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    	// If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
  query_string.dummy = 0;
    return query_string;
} ();


function findUpTag(el, tag) {
    while (el.parentNode) {
        el = el.parentNode;
        if (el.tagName.toLowerCase() === tag)
            return el;
    }
    return null;
}


$(document).ready(function() {
	UNIT = QueryString.u ? QueryString.u : UNIT;
        LESSON = QueryString.l ? QueryString.l : LESSON;
	
        var SlideTo = 0;
        //hack!
        if (LESSON == 2) {
            LESSON = 1;
            SlideTo = 1;
        }
    
	// APPLY STYLES (dynamicccs.js)
		applyMyStyles(UNIT);
        
	document.getElementsByClassName("menu")[(LESSON - 1)].style.backgroundImage="url(layout/units/" + UNIT + "/" + LESSON + "/back.jpg)";
	//loop 1
	var theHtml = "";
	var theAlink = "";
	var theVideoLink = "txt";
	var theImageLink = "btnvideo";
	for (var i=0; i<buttonsLoc[UNIT-1][LESSON-1].videoButsCoords.coords.leftTop.length; i++) {
		theAlink = UNIT + '/' + LESSON + '/' + theVideoLink + (i+1);
		theVlink = UNIT + '/' + LESSON + '/' + theImageLink + (i+1);
		theHtml += '<a class="html5lightbox" data-ogg="videos/' + theAlink + '.ogg" href="resources/videos/' + theAlink + '.mp4" data-width="640" data-height="480" data-group="mygroup"><img class="swing" src="layout/units/' + theVlink  +'.png"></a>';
	}
	
	$($(".videoButs")[(LESSON - 1)]).html(theHtml);
	
	theHtml = "";
	var thePlAllLink = 'partall';
	for (i=0; i<buttonsLoc[UNIT-1][LESSON-1].playButsCoords.coords.leftTop.length; i++) {
		 //theHtml += '<a class="html5lightbox" data-ogg="videos/' + UNIT + '/' + LESSON + '/' + thePlAllLink + (i+1) +'.ogg" href="resources/videos/' + UNIT + '/' + LESSON + '/' + thePlAllLink + (i+1) + '.mp4" data-width="800" data-height="600"><img src="layout/btnplay.png" onMouseOver="mouseOverImage(this)" onMouseOut="mouseOutImage(this)">';
		 theHtml += '<a class="html5lightbox" data-ogg="videos/' + UNIT + '/' + LESSON + '/' + thePlAllLink + (i+1) +'.ogg" href="resources/videos/' + UNIT + '/' + LESSON + '/' + thePlAllLink + (i+1) + '.mp4" data-width="800" data-height="600"><img src="layout/btnplay.png">';
	}

	$($(".playButs")[(LESSON - 1)]).html(theHtml);

	theHtml = "";
	for (i=0; i<buttonsLoc[UNIT-1][LESSON-1].actButsCoords.coords.leftTop.length; i++) {
		//theHtml += '<a href="activities/' + UNIT + '/' + LESSON + '/' + (i+1) + '/activity.html"><img src="layout/btnactivity.png" onMouseOver="mouseOverImage(this)" onMouseOut="mouseOutImage(this)"></a>';
		theHtml += '<a href="activities/' + UNIT + '/' + LESSON + '/' + (i+1) + '/activity.html"><img src="layout/btnactivity.png"></a>';
	}

	$($(".actButs")[(LESSON - 1)]).html(theHtml);
	
         //alert("lesson length in this unit is " + buttonsLoc[UNIT-1].length);
            
         //this is bullshit - this is an outer loop including the repetition of the code, but i cant think straight!!!
        var theSlideHTML = '<div class="swiper-slide"><div class="menu" style="background:url(layout/back.jpg) no-repeat; height:1024px;"><div class="videoButs"></div><div class="playButs"></div></div><article><div class="actButs"></div></article></div>';
        for (var j=1; j<buttonsLoc[UNIT-1].length; j++){
            var currentLesson = parseInt(j+1);
            theHtml = "";
            $(".swiper-wrapper").append(theSlideHTML);
            document.getElementsByClassName("menu")[(j)].style.backgroundImage="url(layout/units/" + UNIT + "/" + currentLesson + "/back.jpg)";
            for (i=0; i<buttonsLoc[UNIT-1][j].videoButsCoords.coords.leftTop.length; i++) {
		theAlink = UNIT + '/' + currentLesson + '/' + theVideoLink + (i+1);
		theVlink = UNIT + '/' + currentLesson + '/' + theImageLink + (i+1);
		theHtml += '<a class="html5lightbox" data-ogg="videos/' + theAlink + '.ogg" href="resources/videos/' + theAlink + '.mp4" data-width="640" data-height="480" data-group="mygroup"><img class="swing" src="layout/units/' + theVlink  +'.png"></a>';
            }
           $($(".videoButs")[j]).html(theHtml);
           
           theHtml = "";
            var thePlAllLink = 'partall';
            for (i=0; i<buttonsLoc[UNIT-1][j].playButsCoords.coords.leftTop.length; i++) {
		 //theHtml += '<a class="html5lightbox" data-ogg="videos/' + UNIT + '/' + currentLesson + '/' + thePlAllLink + (i+1) +'.ogg" href="resources/videos/' + UNIT + '/' + currentLesson + '/' + thePlAllLink + (i+1) + '.mp4" data-width="800" data-height="600"><img src="layout/btnplay.png" onMouseOver="mouseOverImage(this)" onMouseOut="mouseOutImage(this)">';
		 theHtml += '<a class="html5lightbox" data-ogg="videos/' + UNIT + '/' + currentLesson + '/' + thePlAllLink + (i+1) +'.ogg" href="resources/videos/' + UNIT + '/' + currentLesson + '/' + thePlAllLink + (i+1) + '.mp4" data-width="800" data-height="600"><img src="layout/btnplay.png">';
            }
            $($(".playButs")[(j)]).html(theHtml);
            
            theHtml = "";
            for (i=0; i<buttonsLoc[UNIT-1][j].actButsCoords.coords.leftTop.length; i++) {
            	//theHtml += '<a href="activities/' + UNIT + '/' + currentLesson + '/' + (i+1) + '/activity.html"><img src="layout/btnactivity.png" onMouseOver="mouseOverImage(this)" onMouseOut="mouseOutImage(this)"></a>';
				theHtml += '<a href="activities/' + UNIT + '/' + currentLesson + '/' + (i+1) + '/activity.html"><img src="layout/btnactivity.png"></a>';
            }

            $($(".actButs")[j]).html(theHtml);
	
        }
        

	$(".videoButs > a").each(function(index, element){($(this.parentNode).css("float", "left"));});
        
        var mySwiper = new Swiper('.swiper-container',{});
        mySwiper.swipeTo(SlideTo);        
});