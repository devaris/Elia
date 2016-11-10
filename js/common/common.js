// JavaScript Document
function normalisedXtraButtons() {

    var x = document.getElementById("extraText_child_obj");
    var y = (x.contentWindow || x.contentDocument);
    if (y.document)y = y.document;

    try {
        var ieActivity = y.frames;
    } catch(err) {
        var allOtherActivity = window.frames[0];
    }

    if (ieActivity) {
        var normalisedActivity= ieActivity;
    } else {
        var normalisedActivity = allOtherActivity;
    }
	
	return normalisedActivity;
}

var is_array = function(value) {
    return value &&
            typeof value === 'object' &&
            typeof value.length === 'number' &&
            typeof value.splice === 'function' &&
            !(value.propertyIsEnumerable('length'));
};

var localizeText = function(obj, lang) {
	var temp='';
	if ((typeof(obj)=="object")&&(!is_array(obj))){
		if (lang == ""){
			for (var prop in obj) {
				temp = obj[prop];
				break;
			}	
		}
		else{		
			temp = obj[lang];
		}
	}
	else if (typeof(obj)=="string"){
		temp = obj;
	}
	else if (is_array(obj)) {
		temp = obj;
	}
	return temp;
};

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
};

function GetFilename(url) {
    if (url) {
        var m = url.toString().match(/.*\/(.+?)\./);
        if (m && m.length > 1) {
            return m[1];
        }
    }
    return "";
}

function create(htmlStr) {
    var frag = document.createDocumentFragment(),
            temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

function insertAfter(newElement, targetElement) {
    //target is what you want it to go after. Look for this elements parent.
    var parent = targetElement.parentNode;

    //if the parents lastchild is the targetElement...
    if (parent.lastchild == targetElement) {
        //add the newElement after the target element.
        parent.appendChild(newElement);
    } else {
        // else the target has siblings, insert the new element between the target and it's next sibling.
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}

function loadJSON(callback) {   

	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', settings.JSONinfoFile, true); // Replace 'my_data' with the path to your file
	xobj.onreadystatechange = function () {
	  if (xobj.readyState == 4 && xobj.status == "200") {
		// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
		callback(xobj.responseText);
	  }
	};
	xobj.send(null);  
}

function loadActJSON(filepath, callback) {   
	
	var xobj = new XMLHttpRequest();
	try {
		xobj.overrideMimeType("application/json");
	//xobj.open('GET', filepath, true); // Replace 'my_data' with the path to your file
	
		xobj.onreadystatechange = function () {
			  //if (xobj.readyState == 4 && xobj.status == "200") {
			  if (xobj.readyState == 4) {
				// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
				callback(xobj.responseText);
			  }
		};
    	xobj.open('GET', filepath, true); // Replace 'my_data' with the path to your file
		
	}
	catch(e) {
		try {
			xobj = new ActiveXObject('Microsoft.XMLHTTP')
			xobj.onreadystatechange = function () {
					//if ((xobj.readyState == 4) &&(oReq.status == 200 || oReq.status == 304)) {
					if (xobj.readyState == 4) {
					// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
					callback(xobj.responseText);
				  }
			};
			xobj.open('GET', filepath, true)
			
		}
		catch (e1) {
			throw new Error("Exception during GET request: " + e1)
		}
	}
	
	
	
	xobj.send(null);  
}

function importXML(xmlfile) {
    try {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", xmlfile, false);
    } catch (Exception) {
        var ie = (typeof window.ActiveXObject != 'undefined');

        if (ie) {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            while (xmlDoc.readyState != 4) {
            }
            ;
            xmlDoc.load(xmlfile);
            makePageChanges(readXML());
            xmlloaded = true;
        } else {
            xmlDoc = document.implementation.createDocument("", "", null);
            xmlDoc.onload = makePageChanges(readXML());
            xmlDoc.load(xmlfile);
            xmlloaded = true;

        }
    }

    if (!xmlloaded) {
        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
        xmlhttp.send("");
        xmlDoc = xmlhttp.responseXML;
        makePageChanges(readXML());
        xmlloaded = true;
    }
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

function addMyRule(styleSheet_filename, selector, rule) {
    var stylesheet;
    for (var i in document.styleSheets) {
        if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf(styleSheet_filename) >= 0) {
            stylesheet = document.styleSheets[i];
            break;
        }
    }

    if (stylesheet.addRule) {	//IE
        stylesheet.addRule(selector, rule);
    } else if (stylesheet.insertRule) {
        stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
    }
}

function removeMyRule(styleSheet_filename, selector) {
    var stylesheet;
    var myIndex;
    for (var i in document.styleSheets) {
        if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf(styleSheet_filename) >= 0) {
            stylesheet = document.styleSheets[i];
            break;
        }
    }

    for (var j in document.styleSheets.cssRules) {
        if (stylesheet.cssRules[j].selectorText == selector) {
            myIndex = j;
            break;
        }
    }

    if (stylesheet.removeRule) {	//IE
        stylesheet.removeRule(myIndex);
    } else if (stylesheet.deleteRule) {
        stylesheet.deleteRule(myIndex);
    }
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
};

function get_browser() {
    var N = navigator.appName, ua = navigator.userAgent, tem;
    var M = ua.match(/(opera|chrome|safari|firefox|msie|ipad)\/?\s*(\.?\d+(\.\d+)*)/i);
    if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null)
        M[2] = tem[1];
    M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
    return M[0];
}
;

function get_browser_version() {
    var N = navigator.appName, ua = navigator.userAgent, tem;
    var M = ua.match(/(opera|chrome|safari|firefox|msie|ipad)\/?\s*(\.?\d+(\.\d+)*)/i);
    if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null)
        M[2] = tem[1];
    M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
    return M[1];
}
;

function getInternetExplorerVersion()
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
{
	var rv = -1; // Return value assumes failure.
	if (navigator.appName == 'Microsoft Internet Explorer')
	{
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat( RegExp.$1 );
	}
	else if (navigator.appName == 'Netscape')
	{
		var ua = navigator.userAgent;
		var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat( RegExp.$1 );
	}
	return rv;
}

function checkVersion()
{
    var msg = "You're not using Internet Explorer.";
    var ver = getInternetExplorerVersion();

    if (ver > -1)
    {
        if (ver >= 8.0)
            msg = "You're using a recent copy of Internet Explorer.";
        else
            msg = "You should upgrade your copy of Internet Explorer.";
    }
    //alert( msg );
}

function getDataAttribute(elem, attr) {
    var attrValue;
    var ver = getInternetExplorerVersion();

    if ((ver > -1) && (ver < 11))
        attrValue = elem.getAttribute('data-' + attr);
    else
        attrValue = elem.dataset[attr];
    return attrValue;
}

function setDataAttribute(elem, attr, value) {
    var attrValue;
    var ver = getInternetExplorerVersion();

    if ((ver > -1) && (ver < 11))
        elem.setAttribute('data-' + attr, value);
    else
        elem.dataset[attr] = value;
}

function HTMLCollectionToArray(HTMLCollection) {
    var nodes = [];

    var len = HTMLCollection.length;

    for (i = 0; i < len; i++) {
        var node = HTMLCollection[i];
        nodes.push(node);
    }

    return nodes;
}

function doAfterAllImagesLoaded(myEvent) {

    var total_images = document.getElementsByTagName("img").length;
    var images_loaded = 0;

    $("body").find('img').each(function() {
        var fakeSrc = $(this).attr('src');
        $("<img/>").attr("src", fakeSrc).css('display', 'none').load(function() {
            images_loaded++;
            if (images_loaded >= total_images) {
                // now all images are loaded.
                /*alert("all images are loaded. Click OK to view.")*/
                $("body img").show();
                myEvent();
            }
        });

    });
    return true;
}

function setAttrs(elements, key, value) {
    var length = elements.length;
    for (var i = 0; i < length; i++) {
        elements[i].setAttribute(key, value);
    }
}

function clearAttrs(elements, key) {
    var length = elements.length;
    for (var i = 0; i < length; i++) {
        elements[i].removeAttribute(key);
    }
}

// CHECK IF THERE IS MAIN
function inIframe() {
	try {
		return window.self !== window.top;
	} catch (e) {
		return true;
	}
}

function loadjscssfile(filename, filetype){
	if (filetype=="js"){ //if filename is a external JavaScript file
		var fileref=document.createElement('script')
		fileref.setAttribute("type","text/javascript")
		fileref.setAttribute("src", filename)
	}
	else if (filetype=="css"){ //if filename is an external CSS file
		var fileref=document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename)
	}
	if (typeof fileref!="undefined")
		document.getElementsByTagName("head")[0].appendChild(fileref)
}