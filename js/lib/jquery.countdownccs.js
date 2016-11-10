/*!
 * The Final Countdown for jQuery v2.0.4 (http://hilios.github.io/jQuery.countdown/)
 * Copyright (c) 2014 Edson Hilios
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
 

var theTimer = {};

function calculateTime(hours,minutes,seconds){
	
	theTimer.d = new Date();
	
	theTimer.myCurrentYear = theTimer.d.getFullYear();
	theTimer.myCurrentMonth = theTimer.d.getMonth()+1;
	theTimer.myCurrentDate = theTimer.d.getDate();
	
	theTimer.myCurrentHours = theTimer.d.getHours();
	theTimer.myCurrentMinutes = theTimer.d.getMinutes();
	theTimer.myCurrentSeconds = theTimer.d.getSeconds();
	
	theTimer.userHours = theTimer.myCurrentHours + Number(hours);
	theTimer.userMinutes = theTimer.myCurrentMinutes + Number(minutes);
	theTimer.userSeconds = theTimer.myCurrentSeconds + Number(seconds);

	theTimer.dCurrent = theTimer.myCurrentYear.toString() +"/"+ theTimer.myCurrentMonth.toString() +"/"+ theTimer.myCurrentDate.toString()+" "+theTimer.userHours+":"+theTimer.userMinutes+":"+theTimer.userSeconds;
	
	return theTimer.dCurrent
}

function finisheeeed(){
	console.log("finisheeeed")
}

theTimer.createTimer = function (myJSONValue){
	
	// CALCULATE AND ADD USER INPUT
	var JSONVal = myJSONValue.split('|');
	
	for (var i=0; i<3; i++){
		if(!JSONVal[i]){
			JSONVal[i] = "0";
		}		
	}
	
	// ADD ELEMENTS
	$(".timer").html('<div id="timerID"></div><br><button id="resetTimer" class="btn btn-lg btn-primary" type="button"><i class="fa fa-repeat"></i></button><button id="playTimer" class="btn btn-lg btn-primary" type="button"><i class="fa fa-play"></i></button><button id="pauseTimer" class="btn btn-lg btn-primary" type="button"><i class="fa fa-pause"></i></button>');
					 //<br><div class="btn-group" data-toggle="buttons"><label class="btn btn-default" id="btn-pause"><input type="radio" name="options" id="option2" autocomplete="off"><i class="glyphicon glyphicon-pause"></i>Pause</label><label class="btn btn-default active" id="btn-resume"><input type="radio" name="options" id="option2" autocomplete="off" checked><i class="glyphicon glyphicon-play"></i>Resume</label></div>');
	
	// SETUP TIMER
	
	var theCurrentTimer = calculateTime(JSONVal[0],JSONVal[1],JSONVal[2]);
	var timerInInitState = true;
	
	$('#timerID').countdown(theCurrentTimer, function(event) {
		var $this = $(this).html(event.strftime(''
		+ '<span>%M</span> M '
		+ '<span>%S</span> S'
		))//.on('finish.countdown', finisheeeed);
	});
	
	// INIT/EVENTS TIMER
	$('#timerID').countdown('pause');


	$('#playTimer').click(function() {
		if(timerInInitState){
			theCurrentTimer = calculateTime(JSONVal[0],JSONVal[1],JSONVal[2]);
			$('#timerID').countdown(theCurrentTimer);
			timerInInitState = false;
		} else {
			$('#timerID').countdown('resume');
		}
		
		$('#playTimer').addClass("active");
		$('#pauseTimer').removeClass("active");
		//$('#resetTimer').attr('src', "../../../resources/images/reset.png");
	});
	
	$('#pauseTimer').click(function() {
		$('#timerID').countdown('pause');
		
		$('#playTimer').removeClass("active");
		$('#pauseTimer').addClass("active");
		//$('#resetTimer').attr('src', "../../../resources/images/reset.png");
	});	
	
	$('#resetTimer').click(function() {
		theCurrentTimer = calculateTime(JSONVal[0],JSONVal[1],JSONVal[2]);
		$('#timerID').countdown(theCurrentTimer);
		$('#timerID').countdown('pause');
		timerInInitState = true;
		
		$('#playTimer').removeClass("active");
		$('#pauseTimer').removeClass("active");
	});


};
 
(function(factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define([ "jquery" ], factory);
    } else {
        factory(jQuery);
    }
})(function($) {
    "use strict";
    var PRECISION = 100;
    var instances = [], matchers = [];
    matchers.push(/^[0-9]*$/.source);
    matchers.push(/([0-9]{1,2}\/){2}[0-9]{4}( [0-9]{1,2}(:[0-9]{2}){2})?/.source);
    matchers.push(/[0-9]{4}([\/\-][0-9]{1,2}){2}( [0-9]{1,2}(:[0-9]{2}){2})?/.source);
    matchers = new RegExp(matchers.join("|"));
    function parseDateString(dateString) {
        if (dateString instanceof Date) {
            return dateString;
        }
        if (String(dateString).match(matchers)) {
            if (String(dateString).match(/^[0-9]*$/)) {
                dateString = Number(dateString);
            }
            if (String(dateString).match(/\-/)) {
                dateString = String(dateString).replace(/\-/g, "/");
            }
            return new Date(dateString);
        } else {
            throw new Error("Couldn't cast `" + dateString + "` to a date object.");
        }
    }
    var DIRECTIVE_KEY_MAP = {
        Y: "years",
        m: "months",
        w: "weeks",
        d: "days",
        D: "totalDays",
        H: "hours",
        M: "minutes",
        S: "seconds"
    };
    function strftime(offsetObject) {
        return function(format) {
            var directives = format.match(/%(-|!)?[A-Z]{1}(:[^;]+;)?/gi);
            if (directives) {
                for (var i = 0, len = directives.length; i < len; ++i) {
                    var directive = directives[i].match(/%(-|!)?([a-zA-Z]{1})(:[^;]+;)?/), regexp = new RegExp(directive[0]), modifier = directive[1] || "", plural = directive[3] || "", value = null;
                    directive = directive[2];
                    if (DIRECTIVE_KEY_MAP.hasOwnProperty(directive)) {
                        value = DIRECTIVE_KEY_MAP[directive];
                        value = Number(offsetObject[value]);
                    }
                    if (value !== null) {
                        if (modifier === "!") {
                            value = pluralize(plural, value);
                        }
                        if (modifier === "") {
                            if (value < 10) {
                                value = "0" + value.toString();
                            }
                        }
                        format = format.replace(regexp, value.toString());
                    }
                }
            }
            format = format.replace(/%%/, "%");
            return format;
        };
    }
    function pluralize(format, count) {
        var plural = "s", singular = "";
        if (format) {
            format = format.replace(/(:|;|\s)/gi, "").split(/\,/);
            if (format.length === 1) {
                plural = format[0];
            } else {
                singular = format[0];
                plural = format[1];
            }
        }
        if (Math.abs(count) === 1) {
            return singular;
        } else {
            return plural;
        }
    }
    var Countdown = function(el, finalDate, callback) {
        this.el = el;
        this.$el = $(el);
        this.interval = null;
        this.offset = {};
        this.instanceNumber = instances.length;
        instances.push(this);
        this.$el.data("countdown-instance", this.instanceNumber);
        if (callback) {
            this.$el.on("update.countdown", callback);
            this.$el.on("stoped.countdown", callback);
            this.$el.on("finish.countdown", callback);
        }
        this.setFinalDate(finalDate);
        this.start();
    };
    $.extend(Countdown.prototype, {
        start: function() {
            if (this.interval !== null) {
                clearInterval(this.interval);
            }
            var self = this;
            this.update();
            this.interval = setInterval(function() {
                self.update.call(self);
            }, PRECISION);
        },
        stop: function() {
            clearInterval(this.interval);
            this.interval = null;
            this.dispatchEvent("stoped");
        },
        pause: function() {
            this.stop.call(this);
        },
        resume: function() {
            this.start.call(this);
        },
        remove: function() {
            this.stop();
            instances[this.instanceNumber] = null;
            delete this.$el.data().countdownInstance;
        },
        setFinalDate: function(value) {
            this.finalDate = parseDateString(value);
        },
        update: function() {
            if (this.$el.closest("html").length === 0) {
                this.remove();
                return;
            }
            this.totalSecsLeft = this.finalDate.getTime() - new Date().getTime();
            this.totalSecsLeft = Math.ceil(this.totalSecsLeft / 1e3);
            this.totalSecsLeft = this.totalSecsLeft < 0 ? 0 : this.totalSecsLeft;
            this.offset = {
                seconds: this.totalSecsLeft % 60,
                minutes: Math.floor(this.totalSecsLeft / 60) % 60,
                hours: Math.floor(this.totalSecsLeft / 60 / 60) % 24,
                days: Math.floor(this.totalSecsLeft / 60 / 60 / 24) % 7,
                totalDays: Math.floor(this.totalSecsLeft / 60 / 60 / 24),
                weeks: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 7),
                months: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 30),
                years: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 365)
            };
            if (this.totalSecsLeft === 0) {
                this.stop();
                this.dispatchEvent("finish");
            } else {
                this.dispatchEvent("update");
            }
        },
        dispatchEvent: function(eventName) {
            var event = $.Event(eventName + ".countdown");
            event.finalDate = this.finalDate;
            event.offset = $.extend({}, this.offset);
            event.strftime = strftime(this.offset);
            this.$el.trigger(event);
        }
    });
    $.fn.countdown = function() {
        var argumentsArray = Array.prototype.slice.call(arguments, 0);
        return this.each(function() {
            var instanceNumber = $(this).data("countdown-instance");
            if (instanceNumber !== undefined) {
                var instance = instances[instanceNumber], method = argumentsArray[0];
                if (Countdown.prototype.hasOwnProperty(method)) {
                    instance[method].apply(instance, argumentsArray.slice(1));
                } else if (String(method).match(/^[$A-Z_][0-9A-Z_$]*$/i) === null) {
                    instance.setFinalDate.call(instance, method);
                    instance.start();
                } else {
                    $.error("Method %s does not exist on jQuery.countdown".replace(/\%s/gi, method));
                }
            } else {
                new Countdown(this, argumentsArray[0], argumentsArray[1]);
            }
        });
    };
});