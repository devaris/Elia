// JavaScript Document

spa.myCookieName;
spa.cookieJSON;
spa.activityJSON;
spa.COOKIE_LIFETIME = 365;
spa.COMBINED_UNITS = 6;

/*
This following function is needed only on systems that ALPHA version of Richmond code has been installed or run and it migrates
and resets the OLD cookie that handled only one exercise per activity to the NEW more complex cookie that can save two or more
exercises per activity. In the future this function will become obsolete.
Please remove the function and it's reference in futire projects.
*/
spa.checkCookieRichmondMigration = function(my_activity){
	if (is_array(my_activity.selections)){
		my_activity.selections={};
		my_activity.score='';
		my_activity.percentage='';
	}
	return my_activity;
};

spa.prepareActivityCookie = function(){
	var myBrowser = get_browser();
	var cookieJSON = {};
	var activitiesFolder = "activities";
	var activityURLPos = spa.activityFolder.lastIndexOf(spa.ACTIVITIES_FOLDER)+spa.ACTIVITIES_FOLDER.length+1;
	var activityPathChunk = spa.activityFolder.substring(activityURLPos);
	activityURLPos = activityPathChunk.lastIndexOf("/");
	activityPathChunk = activityPathChunk.substring(0,activityURLPos);
	activityPathChunk = activityPathChunk.replace(/\//g, "_");
	var theUnitNum = activityPathChunk.split("_")[0];
	var myCookieNo = Math.ceil(theUnitNum / spa.COMBINED_UNITS);

	spa.myCookieName = spa.DISTINCTIVE_TITLE + "_" + myCookieNo;

	var ckNmParts = spa.myCookieName.split("_");
	var myUnitsSet = ckNmParts[ckNmParts.length-1];
	for (var i = myUnitsSet*spa.COMBINED_UNITS-spa.COMBINED_UNITS+1; i<=myUnitsSet*spa.COMBINED_UNITS; i++){
		cookieJSON[i+""]={};
	}

	if (myBrowser=='Chrome') {
 		if (localStorage.getItem(spa.myCookieName)===null){
			localStorage.setObject(spa.myCookieName,cookieJSON);
			//{"selections":[]});
			cookieJSON = localStorage.getObject(spa.myCookieName);
		}
		else{
			cookieJSON = localStorage.getObject(spa.myCookieName);
		}
	}
	else{
		//$.cookie(spa.myCookieName, null);
		//$.removeCookie(spa.myCookieName);
		$.cookie.json = true;
		if ($.cookie(spa.myCookieName)==null){
			$.cookie(spa.myCookieName, cookieJSON);
			cookieJSON = $.cookie(spa.myCookieName);
		}
		else{
			cookieJSON = $.cookie(spa.myCookieName);
		}
	}

	var restOfActPathChunk = activityPathChunk.substring(activityPathChunk.indexOf("_")+1);
	if (!cookieJSON[theUnitNum][restOfActPathChunk]){
		cookieJSON[theUnitNum][restOfActPathChunk]={"selections":{}, "score":'', "percentage":''};
	}
	else{
		cookieJSON[theUnitNum][restOfActPathChunk] = spa.checkCookieRichmondMigration(cookieJSON[theUnitNum][restOfActPathChunk]);
		//This function will migrate old-one exercise per activity cookies to new-many exercises per activity cookies.
	}
	spa.cookieJSON = cookieJSON;
	return cookieJSON[theUnitNum][restOfActPathChunk];
};

spa.updateArray = function(myArray, value) {
	for (var i=0; i<myArray.length; i++){
		if (is_array(myArray[i]))
			spa.updateArray(myArray[i], value);
		else
			myArray[i].value = value;
			myArray[i].checked = false;
	}
};

spa.resetCookie = function(value) {
	if (is_array(spa.activityJSON.selections))
		spa.updateArray(spa.activityJSON.selections, value);
	return true;
};

spa.saveCookie = function() {
	var myBrowser = get_browser();
	if (myBrowser=='Chrome') {
		localStorage.setObject(spa.myCookieName,null);
		localStorage.setObject(spa.myCookieName,spa.cookieJSON);
	}
	else{
		$.removeCookie(spa.myCookieName);
		$.cookie(spa.myCookieName, spa.cookieJSON);
	}
	return true;
};