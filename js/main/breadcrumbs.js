var homeElem  = "Home"
var pathElements=[homeElem]
var BCseparator = " > "

$(document).ready(function()    {
	var theHTML
	theHTML = homeElem + BCseparator	
	$("#breadcrumbs").html(theHTML);
	$('#breadcrumbs').dragscroll({
		scrollBars : false,
        smoothness : 15,
        mouseWheelVelocity : 2,
		onScrollStart : function(event){
			alert("starttest me");
			event.stopPropagation();
		},
		onScrollEnds : function(event){
			alert("test me");
			event.stopPropagation();
		}
    });
	document.getElementById("bcLeft").style = "display: none";
	document.getElementById("bcRight").style = "display: none";
	document.getElementById("breadcrumbs").style = "display: none";
});

function showBClabels(){
	if (document.getElementsByClassName("dragscroll-inner")[0].scrollWidth>document.getElementById("breadcrumbs").clientWidth){
		document.getElementById("bcLeft").style = "display: block";
		document.getElementById("bcRight").style = "display: block";
	}
	else{
		document.getElementById("bcLeft").style = "display: none";
		document.getElementById("bcRight").style = "display: none";
	}
		
}

function updateBC(linkID){
	var linkElem = linkID.split("_");
	var myPosition;
	var myLevel;
	var myID;
	
	pathElements = [homeElem];
	myPosition  = acc.jsObj.menu;
	var theHTML = '<a href="#" data-id="bchome" name="bchome" class="bcLink" >'+pathElements[0]+'</a>';
	if (linkID!="home"){	
	for (i=0;i<linkElem.length;i++){
		myLevel = "level"+(i*1+1);
		pathElements.push(myPosition[myLevel][linkElem[i]].title);
		myPosition=myPosition[myLevel][linkElem[i]];
	}
	
	for (i=1;i<pathElements.length;i++){
		if (i==1){
			myID = linkElem[i-1];
		}
		else{
			myID += "_"+linkElem[i-1];
		}
		theHTML+= BCseparator+	'<a href="#" data-id="'+'bc'+myID+'" name="'+'bc'+myID+'" class="bcLink" >'+pathElements[i]+'</a>';
	}
	}
	//theHTML = '<div class="dragscroll-scroller"><div class="dragscroll-inner">' + theHTML + '</div></div>';
	$("#breadcrumbs").html(theHTML);	
	$('#breadcrumbs').dragscroll({
		scrollBars : false,
        smoothness : 5,
        mouseWheelVelocity : 25,
		onScrollStart : function(event){
			alert("starttest me");
			event.stopPropagation();
		},
		onScrollEnds : function(event){
			alert("test me");
			event.stopPropagation();
		}
    });
	
	document.getElementsByClassName("dragscroll-inner")[0].addEventListener("click", function(e){
		var locObj = crossBrowserSourceElement(e, "a");
		if (locObj.condtn) {
			updateALL(locObj.theTargetName)
		} else {
			//nothing
		}
	});	
	
	showBClabels()
	/* 	
		The code below has been replaced with the code above.
	*/
	/*var allBCs = document.querySelectorAll(".dragscroll-inner > a");
	if (allBCs.length>0)
	{
		for (i=0;i<allBCs.length;i++)
		{
			allBCs[i].addEventListener("click", 
			function (){
				updateALL(this.dataset['id']);
			})
		}
	}	
	*/
}

function updateALL(linkID)
{	
	var cleanID = linkID;
	if (linkID[0]=="b"){
		cleanID = linkID.substr(2);
	}	
	acc.linkID = cleanID+"";
	cleanSelections();
	updateContent(cleanID);
	updateMenu(cleanID);
	updateButtons(cleanID);
}


updateBC = function(){};
