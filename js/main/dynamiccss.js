/* 
Global Functionality
*/

Object.size = function(obj) { 
    var size = 0, key; 
    for (key in obj) { 
        if (obj.hasOwnProperty(key)) size++; 
    } 
    return size; 
};

// Browser support for insertRule isn't as global
function addCSSRule(sheet, selector, rules, index) {
	if(sheet.insertRule) {
		sheet.insertRule(selector + "{" + rules + "}", index);
	}
	else {
		sheet.addRule(selector, rules, index);
	}
}

// Use it!
//addCSSRule(document.styleSheets[1], "header", "float: left", document.styleSheets[1].cssRules.length);

function setStyle(cssText) {
	
	// Create the <style> tag
	var sheet = document.createElement('style');
	
	sheet.type = 'text/css';	
	
	/* Optional */ 
	window.customSheet = sheet;
	(document.head || document.getElementsByTagName('head')[0]).appendChild(sheet);
	setStyle = function setStyle(cssText, node) {
		/* Optional */ cssText += '\n';
		if(!node || node.parentNode !== sheet) {
			return sheet.appendChild(document.createTextNode(cssText));
			//return sheet.insertBefore(document.createTextNode(cssText));
		}
		node.nodeValue = cssText;
		return node;
	};
	
	return setStyle(cssText);
}

function mouseOverImage(elm) {
	var extName = elm.src.slice(-4); 
	var fileName = elm.src.slice(0,(elm.src.length-4)); 
	
    elm.src = fileName + '_on' + extName;
	
    /*
	img.style.width = elm.getAttribute('data-cat-width');
    img.style.height = elm.getAttribute('data-cat-height');
	*/
}
function mouseOutImage(elm) {
   var extName = elm.src.slice(-4); 
   var fileName = elm.src.slice(0,(elm.src.length-7)); 
   
   elm.src = fileName + extName;
}

/* 
Specific Functionality
*/
//var curIndex = 0;
//var curIndex = UNIT;

//var applyMyStyles = (function() {
function applyMyStyles(unitakia) {							  
	
	curIndex = parseInt(unitakia-1);
	//alert("UNIT: "+UNIT)
	
	// Loop through Lessons
	for (curLes=0;curLes<buttonsLoc[curIndex].length;curLes++){
		
		// VIDEO BUTTONS ****************
		// Set Style For Video Buttons Container	
		setStyle('.swiper-wrapper div:nth-child('+(curLes+1)+') .videoButs{position:'+buttonsLoc[curIndex][curLes].videoButsCoords.position+'; left:'+buttonsLoc[curIndex][curLes].videoButsCoords.left+'px;}');
		
		// Keep Videos Buttons Coordinates
		var curVideoCoords = buttonsLoc[curIndex][curLes].videoButsCoords.coords.leftTop;
		
		// Assign Position CSS for each img of buttons
		for (curVBIndex=0;curVBIndex<curVideoCoords.length;curVBIndex++){
			setStyle('.swiper-wrapper div:nth-child('+(curLes+1)+') .videoButs a:nth-child('+(curVBIndex+1)+') img {position:'+buttonsLoc[curIndex][curLes].videoButsCoords.coords.position+'; left:'+curVideoCoords[curVBIndex].left+'px; top:'+curVideoCoords[curVBIndex].top+'px;}');
		}
		
		
		// PLAY BUTTONS ****************		
		// Set Style For Play All Buttons Container	
		setStyle('.swiper-wrapper div:nth-child('+(curLes+1)+') .playButs{position:'+buttonsLoc[curIndex][curLes].playButsCoords.position+'; left:'+buttonsLoc[curIndex][curLes].playButsCoords.left+'px;}');
		
		// Keep Play All Buttons Coordinates
		var curPlayAllCoords = buttonsLoc[curIndex][curLes].playButsCoords.coords.leftTop;
		
		// Assign Position CSS for each img of buttons
		for (curPBIndex=0;curPBIndex<curPlayAllCoords.length;curPBIndex++){
			setStyle('.swiper-wrapper div:nth-child('+(curLes+1)+') .playButs a:nth-child('+(curPBIndex+1)+') img {position:'+buttonsLoc[curIndex][curLes].playButsCoords.coords.position+'; left:'+curPlayAllCoords[curPBIndex].left+'px; top:'+curPlayAllCoords[curPBIndex].top+'px;}');
		}
		
		// ACT BUTTONS ****************		
		// Set Style For Activity Buttons Container	
		setStyle('.swiper-wrapper div:nth-child('+(curLes+1)+') .actButs{position:'+buttonsLoc[curIndex][curLes].actButsCoords.position+'; left:'+buttonsLoc[curIndex][curLes].actButsCoords.left+'px;}');
		
		// Keep Activity Buttons Coordinates
		var curActivityCoords = buttonsLoc[curIndex][curLes].actButsCoords.coords.leftTop;
		
		//alert(curIndex)
		//alert(curLes)
		
		// Assign Position CSS for each img of buttons
		for (curABIndex=0;curABIndex<curActivityCoords.length;curABIndex++){
			setStyle('.swiper-wrapper div:nth-child('+(curLes+1)+') .actButs a:nth-child('+(curABIndex+1)+') img {position:'+buttonsLoc[curIndex][curLes].actButsCoords.coords.position+'; left:'+curActivityCoords[curABIndex].left+'px; top:'+curActivityCoords[curABIndex].top+'px;}');
		}
		
	}

	
//})(curIndex);
};

