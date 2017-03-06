import {Meteor} from 'meteor/meteor';
import {TAPi18n} from 'meteor/tap:i18n';

let Reflux = require('reflux');

import MeetingTimeActions from '../actions/meetingTimeActions';

import MeetingActions from '../actions/meetingActions';
import MeetingStore from './meetingStore';

import DefaultModalActions from "../actions/defaultModalActions";

var STAGE_TIME_ARRAY = [2700, 2400, 1800, 1200, 900, 300, 0];
var MINUTES_PER_STAGE = [0, 5, 10, 10, 5, 10, 5];

let MeetingTimeStore = Reflux.createStore({
	listenables: [MeetingTimeActions],
	state: {
		timeLeftInSeconds: null,
		timeInterval: null
	},
	onMeetingDataHasChanged: function(meeting) {
		var me = this;

		if(!meeting) {
			return;
		}
		if(document.getElementById('timer')){
			// 0 -> paused /// 1 -> active
			if (meeting.status_code == 0) {
				clearInterval(me.state.timeInterval);
				me.state.timeLeftInSeconds = meeting.current_stage_time_remaining;

				if (me.state.timeLeftInSeconds <= 0) {
					document.getElementById('timer').innerHTML = "00:00";
				} else {
					var endtime = Date.parse(new Date()) + (me.state.timeLeftInSeconds*1000);
					var t = me.getTimeRemaining(endtime);
					document.getElementById('timer').innerHTML = t.minutes + ":" + t.seconds;
				}
			} else {
				me.onStartTimer(meeting, meeting.current_stage_endtime);
			}
		}
	},
	onKillTimer: function() {
		var me = this;
		clearInterval(me.state.timeInterval);
	},
	onStartTimer: function(meeting, endtime) {
		var me = this;
		clearInterval(me.state.timeInterval);

		var t = endtime - Date.parse(new Date());

		if (t <= 0) {
			document.getElementById('timer').innerHTML = "00:00";
			if(meeting.facilitator == Meteor.userId()) {
				DefaultModalActions.showWarning(TAPi18n.__("timer.timeExpired"));
				me.state.timeLeftInSeconds = 0;
				me.onPauseTimer(meeting._id);
			}
		} else {
			me.state.timeInterval = setInterval(function(){

				var t = me.getTimeRemaining(endtime);
				document.getElementById('timer').innerHTML = t.minutes + ":" + t.seconds;

				if(t.total<=0){
					if(meeting.facilitator == Meteor.userId()) {
						DefaultModalActions.showWarning(TAPi18n.__("timer.timeExpired"));
						me.state.timeLeftInSeconds = 0;
						me.onPauseTimer(meeting._id);
					}
					clearInterval(me.state.timeInterval);
					document.getElementById('timer').innerHTML = "00:00";
				}
			}, 1000);
		}
	},
	onPauseTimer: function(meetingId) {
		var me = this;

		MeetingActions.updateMeetingStatusWithTimeRemaining(meetingId, 0, me.state.timeLeftInSeconds, null);
	},
	getTimeRemaining: function (endtime) {
		var me = this;
	  var t = endtime - Date.parse(new Date());

		me.state.timeLeftInSeconds = Math.floor( (t/1000) );

	  var seconds = Math.floor( (t/1000) % 60 );
	  var minutes = Math.floor( (t/1000/60) % 60 );

		var zeroSeconds = seconds < 10 ? "0" : "";
		var zeroMinutes = minutes < 10 ? "0" : "";

	  return {
			'total': t,
	    'minutes': zeroMinutes + minutes,
	    'seconds': zeroSeconds + seconds
	  };
	}
});

export default MeetingTimeStore;
