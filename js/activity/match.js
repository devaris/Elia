function Match(exerciseRef, DOMposition, activitySelections){
	//private properties
	var matchNS = this;
	var score;
	var mySignature = "match";
	var myPlumbPointer;
	var activityIndex = HTMLCollectionToArray(document.getElementsByClassName("activity")).indexOf(DOMposition.parentNode);
	var delimExercise = "_";
	var exercisePrefix = "EX"+activityIndex+delimExercise;	
	var scopePrefix = exercisePrefix + "couple";
	var delimItem = "_";
	var answersShown;
	/*efiRemove var activitySelections = [];	*/
	var myHighlight;
    //public properties
    this.exerciseRef = exerciseRef;

    //private constructor
   var __construct = function(that) {
		//alert("cookiJSON = "+JSON.stringify(spa.activityJSON))
		score = 0;
		var xtraHTML = spa.checkExistenceOfXtraHTML(exerciseRef.activity);
		if (xtraHTML["before"]!=""){
			DOMposition.appendChild(xtraHTML["before"]);
		}
		var newDiv = document.createElement("DIV");
		newDiv.innerHTML = prepareMatchContent(exerciseRef);
		DOMposition.appendChild(newDiv);
		if (xtraHTML["after"]!=""){
			DOMposition.appendChild(xtraHTML["after"]);
		}
		prepareMatchConnectors();
		assignCode();
		createShowAnswers();			
		if ((exerciseRef.settings.typeOfCheck.type) && (exerciseRef.settings.typeOfCheck.type == "immediate")){		
			jsPlumb.bind("connection", function(info) {
			updateConns(info.connection);
			var temp = matchNS.checkAnswers(this);
			spa.getScore(matchNS, temp);
			spa.updateScore();
			spa.saveCookie();
			});
		}
		if ((exerciseRef.settings.typeOfCheck.type) && (exerciseRef.settings.typeOfCheck.type == "individual")) {
			var myItems = DOMposition.getElementsByClassName("myItem");
			for (i = 0; i < myItems.length; i++) {
				if (myItems[i].querySelector(".myCheck")){
					myItems[i].querySelector(".myCheck").addEventListener("click", function() {
						var temp = matchNS.checkAnswers(this);
						spa.getScore(matchNS, temp);
						spa.updateScore();
					});
				}
			}
		}
	}
	
	var prepareMatchContent = function(exerciseRef){
		var theJSONElements = "";
		var sets=exerciseRef.activity.sets;
		console.log('63 - sets '+sets)
		var set1=sets.set1;
		var set2=sets.set2;
		var setsClassNames = ["SourceItems", "TargetItems"]
		var cookieSelections;
		var setAnswers;
		var selectionObj;
		//alert(x.length);
		var freturn = "";
		var newAnswer = "";
		var searchPattern = new RegExp;
		var theImagesPath = exerciseRef.settings.path;
		var locaImagesPath =  theImagesPath ? theImagesPath : window.location.pathname.substr(0, window.location.pathname.lastIndexOf("/")+1) + "images/" ;
		//
		var numOfColumns = Object.size(sets);
		for (j=1;j<=numOfColumns;j++)
		{
			if (j>1){
				theJSONElements += '<ul class="inbetween_ul"></ul>';
			}
			var sClaNam = setsClassNames[j-1];
			if (sClaNam==undefined) {
				sClaNam = setsClassNames[1];
				}
			theJSONElements += '<ul class="MatchSet'+j+' tags ' + sClaNam + '">';
			for (i=0;i<sets["set"+j].length;i++)
			{
				theJSONElements += '<li id="'+exercisePrefix+'set'+j+'_' + i + '" class="myItem '+'set'+j+'" ';
				theJSONElements += '>';
				var myText=sets["set"+j][i].text;
				newAnswer=sets["set"+j][i].image;
				var myAudio=sets["set"+j][i].audio;
				if (newAnswer!=''){
					searchPattern = /(.*?)@@(.*?)@@(\d+)@@(\d+)/g;
					replacePattern = '<img src="' + locaImagesPath + '$1.$2' + '" alt="$1.$2" width="$3" height="$4" >';
					newAnswer = newAnswer.replace(searchPattern, replacePattern);						
					theJSONElements += newAnswer;
				}
				else if (myText!=''){
					theJSONElements += '<span>' + myText + '</span>';
				}
				theJSONElements += '</li>';
			}
			theJSONElements += '</ul>';
		}	

		for (i=0;i<Object.size(sets)-1;i++)
		{
			cookieSelections = activitySelections[i];
			if (cookieSelections==undefined){
				cookieSelections=[];
				activitySelections[i] = [];
			}	
			for (j=0;j<sets["set"+(i+1)].length;j++){
				if (cookieSelections[j]==undefined){
					cookieSelections[j]=[];
					activitySelections[i] = [];
				}
			}
		}
		return theJSONElements;
	}

	var assignCode = function(){
		
		jsPlumb.selectEndpoints().each(function(endpoint) {
			endpoint.bind("mousedown", function(event) {	
				//alert(event.element.id)
				//removeColorFromConns(event.element);					
			});	
			/* endpoint.bind("mouseup", function(event) {
				updateConns(event.element);						
			});*/
		});
				
		/*	$("._jsPlumb_endpoint").bind("mousedown", function() {
			alert("click " + $(this).connection.id);					
			//alert("click endpoint");					
		});	
		*/
		
		jsPlumb.bind("connectionMoved", function(info) { 
			moveTheConnection(info);
		});
		
		jsPlumb.bind("connectionDetached", function(info) { 
			detachTheConnection(info);
		});
		
	}
	
	var prepareMatchConnectors = function(){
		var cookieSelections;
		var setAnswers;
		var sets=exerciseRef.activity.sets;
		var maxConnections = [];
		var conns_array = [];
		var exampleColor = "#FFE799";
		var connectorColour = "#58BADD";
		var colourOfExample = "#000000";
		var strokeColor = "#FFC200";
	
		var myEndPointStyle = {fillStyle:exampleColor, opacity:0.5, strokeStyle: strokeColor,  lineWidth:4 };
		var myconnectorStyle = { strokeStyle:connectorColour, lineWidth:4 };
	
		jsPlumb.ready(function() {
			jsPlumb.Defaults.Container = DOMposition;
			// your jsPlumb related init code goes here
			jsPlumb.Defaults.DragOptions = { cursor: "crosshair" };
			jsPlumb.Defaults.EndpointStyles = [{ fillStyle:"#23408f" }, { fillStyle:"#23408f" }];
			jsPlumb.Defaults.PaintStyle = { lineWidth : 4, strokeStyle : exampleColor };
		});
		
		// configure some drop options for use by all endpoints.	
		var exampleDropOptions = {
			tolerance:"touch",
			hoverClass:"dropHover",
			activeClass:"dragActive"
		};
	
		var exampleEndpoint = {
			endpoint:["Dot", {radius:11} ],
			anchor:(spa.myDir=="rtl"?"BottomRight":"BottomLeft"),
			paintStyle: myEndPointStyle,
			isSource:true,
			scope:'yellow_dot',
			connectorStyle:myconnectorStyle,
			connector : "Straight",
			isTarget:true,
			dropOptions : exampleDropOptions,				
			onMaxConnections:function(info) {
				alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
			},
			beforeDrop:function(connection) {
				return updateConns(connection);
			}
		};		
		setAnswers = exerciseRef.activity.answers;
		if (exerciseRef.activity.maxConnections){
			maxConnections = exerciseRef.activity.maxConnections;
		}
		else{
			for (i=0; i<Object.size(sets); i++){
				maxConnections.push(-1);
			}
		}
		var moreSets = Object.size(sets)>2?true:false;
		for (var h=0; h<Object.size(sets)-1; h++){
			setAnswers = moreSets?exerciseRef.activity.answers[h]:exerciseRef.activity.answers;
			var set1Lis = DOMposition.getElementsByClassName("set"+(h+1));
			var setsCounter = h*2+1;
			var set1_array = [];
			for (i=0;i<set1Lis.length;i++){	
				var myMaxConn = moreSets?maxConnections[h][0]:maxConnections[0];
				if ((myMaxConn==undefined)||(myMaxConn==-1)){
					myMaxConn = (is_array(setAnswers[i])?setAnswers[i].length:1)
				}
				exampleEndpoint = {
					endpoint:["Dot", {radius:11} ],
					anchor:(spa.myDir=="rtl"?"BottomRight":"BottomLeft"),
					paintStyle:myEndPointStyle,
					isSource:true,
					//scope:'yellow_dot',
					scope:scopePrefix+h,
					connectorStyle:myconnectorStyle,
					connector : "Straight",
					parameters:{
						"set1":set1Lis[i].id
					},
					isTarget:true,
					dropOptions : exampleDropOptions,
					maxConnections: myMaxConn,				
					onMaxConnections:function(info) {
						//alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
					},
					beforeDrop:function(connection) {
						return updateConns(connection);
					}
				};
				var horPosition = (spa.myDir=="rtl"?-0.05:1.05);
				if ((exerciseRef.settings.typeOfCheck.type) && (exerciseRef.settings.typeOfCheck.type == "individual")) {
					var theCheck = document.createElement('img');
					theCheck.setAttribute('class', 'myCheck');
					theCheck.setAttribute('src', spa.CHECK_ICON_DIS);
					DOMposition.querySelector("#"+set1Lis[i].id).appendChild(theCheck);
					theCheck.style.position = "absolute";
					theCheck.style.top = DOMposition.querySelector("#"+set1Lis[i].id).offsetTop-theCheck.offsetHeight/4+'px';
					if (spa.myDir=="rtl"){
						theCheck.style.right = DOMposition.querySelector("#"+set1Lis[i].id).offsetWidth+theCheck.offsetWidth+'px';
					}
					else{
						theCheck.style.left = DOMposition.querySelector("#"+set1Lis[i].id).offsetWidth+theCheck.offsetWidth+'px';
					}
					/*horPosition = (spa.myDir=="rtl"?-0.08:1.08);*/
					//theJSONElements += '<img class="myCheck" ' + 'src="' + spa.CHECK_ICON + '" >';
				}
				var vertPosition = 1/(getRowsById("#"+set1Lis[i].id)*2);
				//var e1 = jsPlumb.addEndpoint($("#"+set1Lis[i].id), { anchor:[1.05, vertPosition, 0, 1] }, exampleEndpoint);
				set1_array.push(jsPlumb.addEndpoint($("#"+set1Lis[i].id), { anchor:[horPosition, vertPosition, 0, 1] }, exampleEndpoint));
				//var e0 = jsPlumb.addEndpoint(allMATCHLis[i].id)
				
			}
			matchNS["set"+setsCounter+"_array"] = set1_array;
		
			var myMaxConn = moreSets?maxConnections[h][1]:maxConnections[1];
			if ((myMaxConn==undefined)||(myMaxConn==-1)){
				for (i=0;i<setAnswers.length;i++){
					if (is_array(setAnswers[i])){
						for (var j=0;j<setAnswers[i].length;j++){
							conns_array[setAnswers[i][j]]=(conns_array[setAnswers[i][j]]==undefined?1:conns_array[setAnswers[i][j]]+1)
						}
					}
					else{
						conns_array[setAnswers[i]]=(conns_array[setAnswers[i]]==undefined?1:conns_array[setAnswers[i]]+1)
					}
				}
			}
		
			var set2Lis = DOMposition.getElementsByClassName("set"+(h+2))
			var set2_array = [];
			conns_array = [];
			for (i=0;i<set2Lis.length;i++){		
				var myMaxConn = moreSets?maxConnections[h][1]:maxConnections[1];
				if ((myMaxConn==undefined)||(myMaxConn==-1)){
					myMaxConn = (conns_array[i]==undefined?1:conns_array[i]);
				}
				exampleEndpoint = {
					endpoint:["Dot", {radius:11} ],
					anchor:(spa.myDir=="rtl"?"BottomRight":"BottomLeft"),
					paintStyle:myEndPointStyle,
					isSource:true,
					//scope:'yellow_dot',
					scope:scopePrefix+h,
					connectorStyle:myconnectorStyle,
					connector : "Straight",
					 parameters:{
						"set2":set2Lis[i].id
					 },
					isTarget:true,
					dropOptions : exampleDropOptions,
					maxConnections: myMaxConn,				
					onMaxConnections:function(info) {
						//alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
					},
					beforeDrop:function(connection) {
						return updateConns(connection);
					}
				};
				var vertPosition = 1/(getRowsById("#"+set2Lis[i].id)*2)
				//var e2 = jsPlumb.addEndpoint($("#"+set2Lis[i].id), { anchor:[-0.15, vertPosition, 0, 1] }, exampleEndpoint);
				set2_array.push(jsPlumb.addEndpoint($("#"+set2Lis[i].id), { anchor:[(spa.myDir=="rtl"?1.15:-0.15), vertPosition, 0, 1] }, exampleEndpoint));
				//var e0 = jsPlumb.addEndpoint(allMATCHLis[i].id)
			}
			matchNS["set"+(setsCounter+1)+"_array"] = set2_array;	
		}
	
		for (var h=0; h<Object.size(sets)-1; h++)
		{
			setsCounter = h*2+1;
			if (moreSets){
				activitySelections = activitySelections==undefined ? [] : activitySelections;
				cookieSelections = activitySelections[h];
				cookieSelections = cookieSelections==undefined ? [] : cookieSelections;
				setAnswers = exerciseRef.activity.answers[h];
			}
			else
			{
				cookieSelections = activitySelections[h];
				setAnswers = exerciseRef.activity.answers;
			}				
			for (j=0;j<cookieSelections.length;j++){
				if (cookieSelections[j]==undefined){
					
				}
				else{
					if (is_array(cookieSelections[j])){
						if (cookieSelections[j].length>0){
							for (var k=0;k<cookieSelections[j].length;k++){
								if (cookieSelections[j][k].value!=-1){
									var theConn = jsPlumb.connect({source:matchNS["set"+(setsCounter)+"_array"][j], target:matchNS["set"+(setsCounter+1)+"_array"][cookieSelections[j][k].value]});
																		
									var mySource = matchNS["set"+(setsCounter)+"_array"][j].elementId;
									var myTarget = matchNS["set"+(setsCounter+1)+"_array"][cookieSelections[j][k].value].elementId;
									var myScope = theConn.scope;
									var theCouple = myScope.substr(scopePrefix.length)*1;
									var indexL, indexR;
				
									if (mySource.substr(0,mySource.lastIndexOf(delimItem))==exercisePrefix+"set"+(theCouple+1)){
										indexL = mySource.substr(mySource.lastIndexOf(delimItem)+1);
										indexR = myTarget.substr(myTarget.lastIndexOf(delimItem)+1);
									}
									else{
										indexL = myTarget.substr(myTarget.lastIndexOf(delimItem)+1);
										indexR = mySource.substr(mySource.lastIndexOf(delimItem)+1);
									}
									
									var setLis = DOMposition.getElementsByClassName("set"+(theCouple+1))
									DOMposition.querySelector("#"+setLis[indexL].id+" .myCheck").setAttribute('src', spa.CHECK_ICON);
									if(cookieSelections[j][k].checked == true){
										var foundIt=false;
										if (is_array(setAnswers[j])){
											var foundIt=false;
											for (var l=0; l<setAnswers[j].length; l++){
												if (setAnswers[j][l]==cookieSelections[j][k].value){
													foundIt = true;
													break;
												}
											}
										}
										else{
											if (setAnswers[j]==cookieSelections[j][k].value){
												foundIt = true;
											}									
										}
										if (foundIt){
											theConn.addClass("checkCorrect");
										}
										else{
											theConn.addClass("checkWrong");	
										}
									}
								}
							}
						}
					}
					else{
						if (cookieSelections[j].value!=-1){
							var theConn = jsPlumb.connect({source:matchNS["set"+(setsCounter)+"_array"][j], target:matchNS["set"+(setsCounter+1)+"_array"][cookieSelections[j].value]});
							if(cookieSelections[j].checked == true){
								if (setAnswers[j]==cookieSelections[j].value){
									theConn.addClass("checkCorrect");
								}
								else{
									theConn.addClass("checkWrong");	
								}
							}
						}					
					}
				}
			}
		}			
		if (exerciseRef.activity.examples){
			var examples = exerciseRef.activity.examples;
			if (is_array(examples)){
				exampleEndpoint = {
					endpoint:["Dot", {radius:11} ],
					anchor:(spa.myDir=="rtl"?"BottomRight":"BottomLeft"),
					paintStyle:myEndPointStyle,
					//isSource:true,
					scope:scopePrefix+'EX',
					connectorStyle:{ strokeStyle:colourOfExample, lineWidth:4 },
					connector : "Straight",
					//isTarget:true,
					//dropOptions : exampleDropOptions,
					maxConnections: 1,				
					onMaxConnections:function(info) {
					//alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
					}
				};
				if (moreSets){
					for (var i=0; i<examples.length;i++){
						var setEx = examples[i];
						if (is_array(setEx)){
							for (var j=0;j<setEx.length;j++){
								var theEx = setEx[j];
								var myEx;
								if (is_array(theEx[0])){
									for (var k=0; k<theEx.length; k++){
										myEx = theEx[k];	
										if (spa.myDir=="rtl"){
											vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0])*2);
											var rightEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0]), { anchor:[-0.05, vertPosition, 0, 1] }, exampleEndpoint);
											vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1])*2);
											var leftEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1]), { anchor:[1.15, vertPosition, 0, 1] }, exampleEndpoint);
											theConn = jsPlumb.connect({source:rightEndpoint, target:leftEndpoint});
										}
										else{
											vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0])*2);
											var leftEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0]), { anchor:[1.05, vertPosition, 0, 1] }, exampleEndpoint);
											vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1])*2);
											var rightEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1]), { anchor:[-0.15, vertPosition, 0, 1] }, exampleEndpoint);
											theConn = jsPlumb.connect({source:leftEndpoint, target:rightEndpoint});
										}
										//
									}
								}
								else{
									myEx = theEx;										
									if (spa.myDir=="rtl"){		
										vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0])*2);
										var rightEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0]), { anchor:[-0.05, vertPosition, 0, 1] }, exampleEndpoint)
										set2Lis = DOMposition.getElementsByClassName("set"+(i+2))
										vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1])*2)
										var leftEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1]), { anchor:[1.15, vertPosition, 0, 1] }, exampleEndpoint)
										theConn = jsPlumb.connect({source:rightEndpoint, target:leftEndpoint});
									}
									else{
										vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0])*2);
										var leftEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0]), { anchor:[1.05, vertPosition, 0, 1] }, exampleEndpoint)
										set2Lis = DOMposition.getElementsByClassName("set"+(i+2))
										vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1])*2)
										var rightEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1]), { anchor:[-0.15, vertPosition, 0, 1] }, exampleEndpoint)
										theConn = jsPlumb.connect({source:leftEndpoint, target:rightEndpoint});
									}
								}
								jsPlumb.selectEndpoints({ scope:scopePrefix+'EX' }).setEnabled(false);
							}
						}
					}
				}
				else{
					var setEx = examples;
					i=0;
					for (var j=0;j<setEx.length;j++){
						var theEx = setEx[j];
						var myEx;
						if (is_array(theEx[0])){
							for (var k=0; k<theEx.length; k++){
								myEx = theEx[k];									
								if (spa.myDir=="rtl"){		
									vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0])*2);
									var rightEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0]), { anchor:[-0.05, vertPosition, 0, 1] }, exampleEndpoint)
									vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1])*2)
									var leftEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1]), { anchor:[1.15, vertPosition, 0, 1] }, exampleEndpoint)
									theConn = jsPlumb.connect({source:rightEndpoint, target:leftEndpoint});
								}
								else{
									vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0])*2);
									var leftEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0]), { anchor:[1.05, vertPosition, 0, 1] }, exampleEndpoint)
									vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1])*2)
									var rightEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1]), { anchor:[-0.15, vertPosition, 0, 1] }, exampleEndpoint)
									theConn = jsPlumb.connect({source:leftEndpoint, target:rightEndpoint});
								}
							}
						}
						else{
							myEx = theEx;
							if (spa.myDir=="rtl"){		
								vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0])*2);
								var rightEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0]), { anchor:[-0.05, vertPosition, 0, 1] }, exampleEndpoint)
								set2Lis = DOMposition.getElementsByClassName("set"+(i+2))
								vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1])*2)
								var leftEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1]), { anchor:[1.15, vertPosition, 0, 1] }, exampleEndpoint)
								theConn = jsPlumb.connect({source:rightEndpoint, target:leftEndpoint});
							}
							else{
								vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0])*2);
								var leftEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0]), { anchor:[1.05, vertPosition, 0, 1] }, exampleEndpoint)
								set2Lis = DOMposition.getElementsByClassName("set"+(i+2))
								vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1])*2)
								var rightEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1]), { anchor:[-0.15, vertPosition, 0, 1] }, exampleEndpoint)
								theConn = jsPlumb.connect({source:leftEndpoint, target:rightEndpoint});
							}
						}
						jsPlumb.selectEndpoints({ scope:scopePrefix+'EX' }).setEnabled(false);
					}					
				}
			}
		}
		setAnswers = exerciseRef.activity.answers;
	}

	var hideAnswers = function (){
		var myConn, mySource, myTarget, myScope;
		var allConns=jsPlumb.getAllConnections();
		if (allConns.length>0){
		//alert("cookiJSON = "+JSON.stringify(spa.activityJSON))
			for (var i=0;i<allConns.length;i++){
				myConn = allConns[i];
				mySource = myConn.sourceId;
				myTarget = myConn.targetId;
				myScope = myConn.scope;
				var connExercise = myScope.substr(0, myScope.indexOf(delimExercise)+1);
				if (connExercise==exercisePrefix){
					if ((myScope.substr(scopePrefix.length)!='EX')&&(myScope.substr(scopePrefix.length)!='SAns')){
						myConn.removeClass("showMe");
						myConn.addClass("hideMe");
					}
				}
			}
		}		
	}
	
	var showAnswers = function (){
		var myConn, mySource, myTarget, myScope;
		var allConns=jsPlumb.getAllConnections();
		if (allConns.length>0){
		//alert("cookiJSON = "+JSON.stringify(spa.activityJSON))
			for (var i=0;i<allConns.length;i++){
				myConn = allConns[i];
				mySource = myConn.sourceId;
				myTarget = myConn.targetId;
				myScope = myConn.scope;
				var connExercise = myScope.substr(0, myScope.indexOf(delimExercise)+1);
				if (connExercise==exercisePrefix){
					if ((myScope.substr(scopePrefix.length)!='EX')&&(myScope.substr(scopePrefix.length)!='SAns')){
						myConn.removeClass("hideMe");
						myConn.addClass("showMe");
					}
				}
			}
		}		
	}

	var resetMyCookie = function(){
		var sets=exerciseRef.activity.sets;
		var cookieSelections;
		var setAnswers;
		var selectionObj;
	
		for (var i=0;i<Object.size(sets)-1;i++){
				activitySelections=activitySelections==undefined?[]:activitySelections;
				cookieSelections = activitySelections[i];
				if (cookieSelections==undefined){
					cookieSelections=[];
					activitySelections[i] = [];
				}
			for (var j=0;j<sets["set"+(i+1)].length;j++){
				cookieSelections[j]=[];
				activitySelections[i][j] = [];
			}
		}	
	}

	var getRowsById = function(selector) {
		var height = $(selector).height();
		var line_height = $(selector).css("line-height");
		line_height = parseFloat(line_height);
		var rows = height / line_height;
		return Math.round(rows);
	}

	var updateConns = function(elem){
		var allConns=jsPlumb.getAllConnections();
		var myConn, mySource, myTarget, myScope, theCouple;
		var newConn = true;	
		if (allConns.length>0){
			for (var i=0;i<allConns.length;i++){	
				myConn = allConns[i];		
				mySource = myConn.sourceId;
				myTarget = myConn.targetId;		
				myScope = myConn.scope;
				theCouple = myScope.substr(scopePrefix.length)*1;
			
				if (mySource.substr(0,mySource.lastIndexOf(delimItem))==exercisePrefix+"set"+(theCouple+1)){
					indexL = mySource.substr(mySource.lastIndexOf(delimItem)+1);
					indexR = myTarget.substr(myTarget.lastIndexOf(delimItem)+1);
				}
				else{
					indexL = myTarget.substr(myTarget.lastIndexOf(delimItem)+1);
					indexR = mySource.substr(mySource.lastIndexOf(delimItem)+1);
				}
				var foundIt = false;
				if (elem==undefined){
					newConn=false;	
					for (j=0; j<activitySelections[indexL].length; j++){
						if (activitySelections[indexL][j].value==indexR){
							foundIt=true;
							break;
						}
					}
					if (!foundIt)
					{
						selectionObj = {"value":indexR, "checked":false};
						activitySelections[indexL].push(selectionObj);
						var setLis = DOMposition.getElementsByClassName("set"+(theCouple+1))
						DOMposition.querySelector("#"+setLis[indexL].id+" .myCheck").setAttribute('src', spa.CHECK_ICON);
						spa.saveCookie();
					}
				}
				else{
					if ((myConn.sourceId==elem.sourceId)&&(myConn.targetId==elem.targetId)&&(myConn.scope==elem.scope)){
						newConn=false;		
						for (j=0; j<activitySelections[theCouple][indexL].length; j++){
							if (activitySelections[theCouple][indexL][j].value==indexR){
								foundIt=true;
								break;
							}
						}
						if (!foundIt)
						{
							selectionObj = {"value":indexR, "checked":false};
							activitySelections[theCouple][indexL].push(selectionObj);
							spa.saveCookie();
						}
					}
				}
			}
		}
		if (newConn){
			myConn = elem;		
			mySource = myConn.sourceId;
			myTarget = myConn.dropEndpoint.element.id;		
			myScope = myConn.scope;
			theCouple = myScope.substr(scopePrefix.length)*1;
			
			if (mySource.substr(0,mySource.lastIndexOf(delimItem))==exercisePrefix+"set"+(theCouple+1)){
				indexL = mySource.substr(mySource.lastIndexOf(delimItem)+1);
				indexR = myTarget.substr(myTarget.lastIndexOf(delimItem)+1);
			}
			else{
				indexL = myTarget.substr(myTarget.lastIndexOf(delimItem)+1);
				indexR = mySource.substr(mySource.lastIndexOf(delimItem)+1);
			}			
		
			selectionObj = {"value":indexR, "checked":false};
			if (activitySelections[theCouple][indexL] == undefined){
				activitySelections[theCouple][indexL] = [];
			}
			activitySelections[theCouple][indexL].push(selectionObj);
			spa.saveCookie();
						
			var setLis = DOMposition.getElementsByClassName("set"+(theCouple+1))
			DOMposition.querySelector("#"+setLis[indexL].id+" .myCheck").setAttribute('src', spa.CHECK_ICON);
		}
		return true;
	}

	var detachTheConnection = function (info){
		var mySource = info.sourceId;
		var myTarget = info.targetId;
		var myScope = info.connection.scope;
		var theCouple = myScope.substr(scopePrefix.length)*1;
		var indexL, indexR;
				
		if (mySource.substr(0,mySource.lastIndexOf(delimItem))==exercisePrefix+"set"+(theCouple+1)){
			indexL = mySource.substr(mySource.lastIndexOf(delimItem)+1);
			indexR = myTarget.substr(myTarget.lastIndexOf(delimItem)+1);
		}
		else{
			indexL = myTarget.substr(myTarget.lastIndexOf(delimItem)+1);
			indexR = mySource.substr(mySource.lastIndexOf(delimItem)+1);
		}
		for (j=0;activitySelections[theCouple][indexL].length;j++){
			if (activitySelections[theCouple][indexL][j].value==indexR){		
				activitySelections[theCouple][indexL].splice(j, 1);
				break;
			}
		}
		var setLis = DOMposition.getElementsByClassName("set"+(theCouple+1))
		DOMposition.querySelector("#"+setLis[indexL].id+" .myCheck").setAttribute('src', spa.CHECK_ICON_DIS);
		spa.saveCookie();	
	}

	var moveTheConnection = function (info){
		var mySource = info.originalSourceId;
		var myTarget = info.originalTargetId;
		var mySourceEndpoint = info.originalSourceEndpoint;
		var myTargetEndpoint = info.originalTargetEndpoint;
		var myScope = info.originalTargetEndpoint.scope;
		var theCouple = myScope.substr(scopePrefix.length)*1;
		var indexL, indexR;
		var endpointL, endpointR;
		
		var myNewSource = info.newSourceId;
		var myNewTarget = info.newTargetId;
		var myNewSourceEndpoint = info.newSourceEndpoint;
		var myNewTargetEndpoint = info.newTargetEndpoint;
		var myNewScope = info.newTargetEndpoint.scope;
		var theNewCouple = myNewScope.substr(scopePrefix.length)*1;
		var indexNewL, indexNewR;
		var endpointNewL, endpointNewR;
				
		if (mySource.substr(0,mySource.lastIndexOf(delimItem))==exercisePrefix+"set"+(theCouple+1)){
			indexL = mySource.substr(mySource.lastIndexOf(delimItem)+1);
			indexR = myTarget.substr(myTarget.lastIndexOf(delimItem)+1);
			endpointL = mySourceEndpoint;
			endpointR = myTargetEndpoint;
		}
		else{
			indexL = myTarget.substr(myTarget.lastIndexOf(delimItem)+1);
			indexR = mySource.substr(mySource.lastIndexOf(delimItem)+1);
			endpointL = myTargetEndpoint;
			endpointR = mySourceEndpoint;
		}
			
		if (myNewSource.substr(0,myNewSource.lastIndexOf(delimItem))==exercisePrefix+"set"+(theNewCouple+1)){
			indexNewL = myNewSource.substr(myNewSource.lastIndexOf(delimItem)+1);
			indexNewR = myNewTarget.substr(myNewTarget.lastIndexOf(delimItem)+1);
			endpointNewL = myNewSourceEndpoint;
			endpointNewR = myNewTargetEndpoint;
		}
		else{
			indexNewL = myNewTarget.substr(myNewTarget.lastIndexOf(delimItem)+1);
			indexNewR = myNewSource.substr(myNewSource.lastIndexOf(delimItem)+1);
			endpointNewL = myNewTargetEndpoint;
			endpointNewR = myNewSourceEndpoint;
		}
		if	(exerciseRef.settings.typeOfCheck.type == "individual"){
			var setLis = DOMposition.getElementsByClassName("set"+(theCouple+1))
			if (endpointL.connections.length>=1){
				DOMposition.querySelector("#"+setLis[indexL].id+" .myCheck").setAttribute('src', spa.CHECK_ICON);
			}else{
				DOMposition.querySelector("#"+setLis[indexL].id+" .myCheck").setAttribute('src', spa.CHECK_ICON_DIS);
			}
			if (endpointL!=endpointNewL){
				setLis = DOMposition.getElementsByClassName("set"+(theNewCouple+1))
				if (endpointNewL.connections.length>=1){
					DOMposition.querySelector("#"+setLis[indexNewL].id+" .myCheck").setAttribute('src', spa.CHECK_ICON);
				}else{
					DOMposition.querySelector("#"+setLis[indexNewL].id+" .myCheck").setAttribute('src', spa.CHECK_ICON_DIS);
					}
			}
		}
		switch(exerciseRef.settings.typeOfCheck.cleanOnClick){
			case "all":
				myConn.removeClass("checkCorrect");
				myConn.removeClass("checkWrong");
				if (is_array(myAnswer))
					for (j=0;myAnswer.length;j++)							
						activitySelections[theCouple][indexL][j].checked=false;
				else
					activitySelections[theCouple][indexL].checked=false;
				break;
			case "selection":							
				for (j=0;activitySelections[theCouple][indexL].length;j++){
					if (activitySelections[theCouple][indexL][j].value==indexR){		
						activitySelections[theCouple][indexL].splice(j, 1);
						break;
					}
				}
											
				var x=jsPlumb.getAllConnections();
				var myConn;	
				if (x.length>0){
					for (var i=0;i<x.length;i++){	
						myConn = x[i];	
						if ((myConn.sourceId == myNewSource) && (myConn.targetId == myNewTarget) && (myConn.scope == myNewScope)){
							myConn.removeClass("checkCorrect");
							myConn.removeClass("checkWrong");
							break;
						}							
					}
				}
				break;
			default:
				myConn.removeClass("checkCorrect");
				myConn.removeClass("checkWrong");
				if (is_array(myAnswer))
					for (j=0;myAnswer.length;j++)							
						activitySelections[theCouple][indexL][j].checked=false;
				else
					activitySelections[theCouple][indexL].checked=false;
						
		}
		spa.saveCookie();		
	}

	var removeColorFromConns = function (elem){
		alert ("removeColors");
		var x=jsPlumb.getAllConnections();
		var myConn, mySource, myTarget, myScope, theCouple;
		if (x.length>0){
			for (var i=0;i<x.length;i++){	
				myConn = x[i];		
				mySource = myConn.sourceId;
				myTarget = myConn.targetId;		
				myScope = myConn.scope;
				theCouple = myScope.substr(scopePrefix.length)*1;
				
				if (mySource.substr(0,mySource.lastIndexOf(delimItem))==exercisePrefix+"set"+(theCouple+1)){
					indexL = mySource.substr(mySource.lastIndexOf(delimItem)+1);
					indexR = myTarget.substr(myTarget.lastIndexOf(delimItem)+1);
				}
				else{
					indexL = myTarget.substr(myTarget.lastIndexOf(delimItem)+1);
					indexR = mySource.substr(mySource.lastIndexOf(delimItem)+1);
				}
				var myAnswer = exerciseRef.activity.answers[indexL];
				switch(exerciseRef.settings.typeOfCheck.cleanOnClick){
					case "all":
						myConn.removeClass("checkCorrect");
						myConn.removeClass("checkWrong");
						if (is_array(myAnswer))
							for (j=0;myAnswer.length;j++)							
								activitySelections[indexL][j].checked=false;
						else
							activitySelections[indexL].checked=false;
						break;
					case "selection":
						if (elem==undefined){
							myConn.removeClass("checkCorrect");
							myConn.removeClass("checkWrong");
							if (is_array(myAnswer))
								for (j=0;myAnswer.length;j++)							
									activitySelections[indexL][j].checked=false;
							else
								activitySelections[indexL].checked=false;
						}
						else{						
							if ((myConn.sourceId==elem.id)||(myConn.targetId==elem.id)){	
								for (j=0;activitySelections[indexL].length;j++){
									if (activitySelections[indexL][j].value==indexR){		
										activitySelections[indexL].splice(j, 1);
										break;
									}
								}
				
								myConn.removeClass("checkCorrect");
								myConn.removeClass("checkWrong");							
							}
						}
						break;
					default:
						myConn.removeClass("checkCorrect");
						myConn.removeClass("checkWrong");
						if (is_array(myAnswer))
							for (j=0;myAnswer.length;j++)							
								activitySelections[indexL][j].checked=false;
						else
							activitySelections[indexL].checked=false;
				}		
			}
			spa.saveCookie();
		}
		//updateConns();
	}
	
	var createShowAnswers = function(){
		var sets=exerciseRef.activity.sets;
		var setAnswers = exerciseRef.activity.answers;
		var moreSets = Object.size(sets)>2?true:false;		
		
		
		var exampleColor = "#FFE799";
		var connectorColour = "#58BADD";
		var colourOfExample = "#000000";
		var strokeColor = "#FFC200";	
		
		var myEndPointStyle = {fillStyle:exampleColor, opacity:0.5, strokeStyle: strokeColor,  lineWidth:4 };
		var myconnectorStyle = { strokeStyle:connectorColour, lineWidth:4 };	
		
		sAnsEndpoint = {
			endpoint:["Dot", {radius:11} ],
			anchor:(spa.myDir=="rtl"?"BottomRight":"BottomLeft"),
			paintStyle:myEndPointStyle,
			//isSource:true,
			scope:scopePrefix+'SAns',
			connectorStyle: myconnectorStyle,
			connector : "Straight",
			//isTarget:true,
			//dropOptions : exampleDropOptions,
			maxConnections: 1,				
			onMaxConnections:function(info) {
			//alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
			}
		};
		if (moreSets){
			for (var i=0; i<setAnswers.length;i++){
				var setEx = setAnswers[i];
				if (is_array(setEx)){
					for (var j=0;j<setEx.length;j++){
						var theEx = setEx[j];
						var myEx;
						if (is_array(theEx[0])){
							for (var k=0; k<theEx.length; k++){
								myEx = theEx[k];									
								if (spa.myDir=="rtl"){	
									vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0])*2);
									var rightEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0]), { anchor:[-0.05, vertPosition, 0, 1] }, sAnsEndpoint);
									vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1])*2);
									var leftEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1]), { anchor:[1.15, vertPosition, 0, 1] }, sAnsEndpoint);
									theConn = jsPlumb.connect({source:rightEndpoint, target:leftEndpoint});
								}
								else{
									vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0])*2);
									var leftEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0]), { anchor:[1.05, vertPosition, 0, 1] }, sAnsEndpoint);
									vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1])*2);
									var rightEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1]), { anchor:[-0.15, vertPosition, 0, 1] }, sAnsEndpoint);
									theConn = jsPlumb.connect({source:leftEndpoint, target:rightEndpoint});
								}
							}
						}
						else{
							myEx = theEx;	
							if (spa.myDir=="rtl"){	
								vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0])*2);
								var rightEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0]), { anchor:[-0.05, vertPosition, 0, 1] }, sAnsEndpoint);
								set2Lis = DOMposition.getElementsByClassName("set"+(i+2));
								vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1])*2);
								var leftEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1]), { anchor:[1.15, vertPosition, 0, 1] }, sAnsEndpoint);
								theConn = jsPlumb.connect({source:rightEndpoint, target:leftEndpoint});
							}
							else{
								vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0])*2);
								var leftEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+1)+"_"+myEx[0]), { anchor:[1.05, vertPosition, 0, 1] }, sAnsEndpoint);
								set2Lis = DOMposition.getElementsByClassName("set"+(i+2));
								vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1])*2);
								var rightEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+2)+"_"+myEx[1]), { anchor:[-0.15, vertPosition, 0, 1] }, sAnsEndpoint);
								theConn = jsPlumb.connect({source:leftEndpoint, target:rightEndpoint});
							}
						}
						jsPlumb.selectEndpoints({ scope:scopePrefix+'SAns' }).setEnabled(false);
					}
				}
			}
		}
		else{
			i=0;
			for (var j=0;j<setAnswers.length;j++){
				var theEx = setAnswers[j];
				var myEx;
				if (is_array(theEx)){
					for (var k=0; k<theEx.length; k++){
						myEx = theEx[k];									
						if (spa.myDir=="rtl"){	
							vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+1)+"_"+j)*2);
							var rightEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+1)+"_"+j), { anchor:[-0.05, vertPosition, 0, 1] }, sAnsEndpoint);
							vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+2)+"_"+myEx)*2);
							var leftEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+2)+"_"+myEx), { anchor:[1.15, vertPosition, 0, 1] }, sAnsEndpoint);
							theConn = jsPlumb.connect({source:rightEndpoint, target:leftEndpoint});
						}
						else{
							vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+1)+"_"+j)*2);
							var leftEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+1)+"_"+j), { anchor:[1.05, vertPosition, 0, 1] }, sAnsEndpoint);
							vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+2)+"_"+myEx)*2);
							var rightEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+2)+"_"+myEx), { anchor:[-0.15, vertPosition, 0, 1] }, sAnsEndpoint);
							theConn = jsPlumb.connect({source:leftEndpoint, target:rightEndpoint});
						}
					}
				}
				else{
					myEx = theEx;	
					if (spa.myDir=="rtl"){	
						vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+1)+"_"+j)*2);
						var rightEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+1)+"_"+j), { anchor:[-0.05, vertPosition, 0, 1] }, sAnsEndpoint);
						set2Lis = DOMposition.getElementsByClassName("set"+(i+2));
						vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+2)+"_"+myEx)*2);
						var leftEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+2)+"_"+myEx), { anchor:[1.15, vertPosition, 0, 1] }, sAnsEndpoint);
						theConn = jsPlumb.connect({source:rightEndpoint, target:leftEndpoint});
					}
					else{
						vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+1)+"_"+j)*2);
						var leftEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+1)+"_"+j), { anchor:[1.05, vertPosition, 0, 1] }, sAnsEndpoint);
						set2Lis = DOMposition.getElementsByClassName("set"+(i+2));
						vertPosition = 1/(getRowsById("#"+exercisePrefix+"set"+(i+2)+"_"+myEx)*2);
						var rightEndpoint = jsPlumb.addEndpoint($("#"+exercisePrefix+"set"+(i+2)+"_"+myEx), { anchor:[-0.15, vertPosition, 0, 1] }, sAnsEndpoint);
						theConn = jsPlumb.connect({source:leftEndpoint, target:rightEndpoint});
					}
				}
				jsPlumb.selectEndpoints({ scope:scopePrefix+'SAns' }).setEnabled(false);
			}					
		}
		matchNS.hideSAns();
	}

//public functions
	matchNS.hideSAns = function(){
		jsPlumb.selectEndpoints({ scope:scopePrefix+'SAns' }).setVisible(false);
		answersShown = false;
	}

	matchNS.showAnswers = function(){
		answersShown = !answersShown;
		if (answersShown){
			hideAnswers();
		}
		else{
			showAnswers();	
		}
		jsPlumb.selectEndpoints({ scope:scopePrefix+'SAns' }).setVisible(answersShown);
	}

	matchNS.checkAnswers = function(myItem){
		var qScore;
		var allConns, theAnswers;
		var mySource, myTarget;
		var myConn;
		var indexL, indexR;
		score  = 0;
		//hideAnswers();
		var mistakes;
		var selectionObj;
		var sets=exerciseRef.activity.sets;
		var moreSets = Object.size(sets)>2?true:false;
		var myScope;
		var theCouple;
		//spa.resetCookie(-1);
		
		resetMyCookie();
		
		allConns=jsPlumb.getAllConnections();
		if (allConns.length>0){
		//alert("cookiJSON = "+JSON.stringify(spa.activityJSON))
			for (var i=0;i<allConns.length;i++){
				qScore = 0;
				mistakes = 0;
				myConn = allConns[i];
				mySource = myConn.sourceId;
				myTarget = myConn.targetId;
				myScope = myConn.scope;
				var connExercise = myScope.substr(0, myScope.indexOf(delimExercise)+1);
				theCouple = myScope.substr(scopePrefix.length)*1;
					
				if (mySource.substr(0,mySource.lastIndexOf(delimItem))==exercisePrefix+"set"+(theCouple+1)){
					indexL = mySource.substr(mySource.lastIndexOf(delimItem)+1);
					indexR = myTarget.substr(myTarget.lastIndexOf(delimItem)+1);
				}
				else{
					indexL = myTarget.substr(myTarget.lastIndexOf(delimItem)+1);
					indexR = mySource.substr(mySource.lastIndexOf(delimItem)+1);
				}
				var myAnswer = moreSets?exerciseRef.activity.answers[theCouple][indexL]:exerciseRef.activity.answers[indexL];
				if (connExercise==exercisePrefix){
					if ((myScope.substr(scopePrefix.length)!='EX')&&(myScope.substr(scopePrefix.length)!='SAns')){
						//var myItemId = myItem.parentNode.id.substr(myItem.parentNode.id.lastIndexOf(delimItem)+1);
						if ((exerciseRef.settings.typeOfCheck.type != "individual")||((exerciseRef.settings.typeOfCheck.type == "individual")&&(myItem==undefined))||(exerciseRef.settings.typeOfCheck.type == "individual")&&((myItem.parentNode.id.substr(myItem.parentNode.id.lastIndexOf(delimItem)+1)==indexL))){
							myConn.removeClass("checkCorrect");
							myConn.removeClass("checkWrong");
							var foundIt = false;			
							selectionObj = {"value":indexR, "checked":true};
							activitySelections[theCouple][indexL].push(selectionObj);
							try {
								if ((exerciseRef.settings.typeOfCheck.type == "individual")&&(myItem.parentNode.id.substr(myItem.parentNode.id.lastIndexOf(delimItem)+1)==indexL))
									myItem.src = spa.CHECK_ICON_ON;
							}
							catch(e){
							}				
							if (is_array(myAnswer)){
								for (j=0; j<myAnswer.length; j++){
									if (myAnswer[j]==indexR){
										foundIt=true;
										break;
									}
								}
							}
							else{
								if (myAnswer==indexR){
									foundIt=true;
								}
							}
							if (foundIt==true){
								myConn.addClass("checkCorrect");
								qScore++;
							}
							else{
								myConn.addClass("checkWrong");	
								qScore--;
							}
						}
						else{
						}
				
					if (myAnswer==undefined){						
					}
					else{
						if (qScore<0)
							qScore=0;
					}
					var no=1;
					if (is_array(myAnswer))
						no = myAnswer.length;
					score=score+Math.round(qScore/no * 100) / 100;		
				}
				}
			}
		}
		if (score<0)
			score = 0;

		if ($(allConns[i]).attr("any_answer")){
			if (mistakes>0){
				qScore = 0;
			}
		}
		var theAnswers = 0;
		if (moreSets) {
			for (var i=0; i<Object.size(sets)-1; i++){
				theAnswers=theAnswers + exerciseRef.activity.answers[i].length;
			}
		}
		else{
			theAnswers=exerciseRef.activity.answers.length;
		}
		var percentage = Math.round((score/theAnswers)*100);
		if (percentage==100){
			
		} else {
			
		}
	
		var temp = {"score": score, "percentage": percentage};
		return temp;
	}

	matchNS.disableActivity = function (){
		jsPlumb.selectEndpoints().setEnabled(false);
		jsPlumb.selectEndpoints().unbind("mousedown");	
	}
   

	//initialize Object....
    __construct(this);
}