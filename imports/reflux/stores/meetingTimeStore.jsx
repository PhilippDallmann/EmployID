/* global document */

import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/tap:i18n';
import MeetingTimeActions from '../actions/meetingTimeActions';

import MeetingActions from '../actions/meetingActions';
import DefaultModalActions from '../actions/defaultModalActions';

const Reflux = require('reflux');

const MeetingTimeStore = Reflux.createStore({
  listenables: [MeetingTimeActions],
  state: {
    timeLeftInSeconds: null,
    timeInterval: null,
  },
  onMeetingDataHasChanged(meeting) {
    const me = this;

    if (!meeting) {
      return;
    }
    if (document.getElementById('timer')) {
      // 0 -> paused /// 1 -> active
      if (meeting.status_code === 0) {
        clearInterval(me.state.timeInterval);
        me.state.timeLeftInSeconds = meeting.current_stage_time_remaining;

        if (me.state.timeLeftInSeconds <= 0) {
          document.getElementById('timer').innerHTML = '00:00';
        } else {
          const endtime = Date.parse(new Date()) + (me.state.timeLeftInSeconds * 1000);
          const t = me.getTimeRemaining(endtime);
          document.getElementById('timer').innerHTML = `${t.minutes}:${t.seconds}`;
        }
      } else {
        me.onStartTimer(meeting, meeting.current_stage_endtime);
      }
    }
  },
  onKillTimer() {
    const me = this;
    clearInterval(me.state.timeInterval);
  },
  onStartTimer(meeting, endtime) {
    const me = this;
    clearInterval(me.state.timeInterval);

    let t = endtime - Date.parse(new Date());

    if (t <= 0) {
      document.getElementById('timer').innerHTML = '00:00';
      if (meeting.facilitator === Meteor.userId()) {
        DefaultModalActions.showWarning(TAPi18n.__('timer.timeExpired'));
        me.state.timeLeftInSeconds = 0;
        me.onPauseTimer(meeting._id);
      }
    } else {
      me.state.timeInterval = setInterval(() => {
        t = me.getTimeRemaining(endtime);
        document.getElementById('timer').innerHTML = `${t.minutes}:${t.seconds}`;

        if (t.total <= 0) {
          if (meeting.facilitator === Meteor.userId()) {
            DefaultModalActions.showWarning(TAPi18n.__('timer.timeExpired'));
            me.state.timeLeftInSeconds = 0;
            me.onPauseTimer(meeting._id);
          }
          clearInterval(me.state.timeInterval);
          document.getElementById('timer').innerHTML = '00:00';
        }
      }, 1000);
    }
  },
  onPauseTimer(meetingId) {
    const me = this;

    MeetingActions.updateMeetingStatusWithTimeRemaining(meetingId, 0, me.state.timeLeftInSeconds, null);
  },
  getTimeRemaining(endtime) {
    const me = this;
    const t = endtime - Date.parse(new Date());

    me.state.timeLeftInSeconds = Math.floor((t / 1000));

    const seconds = Math.floor((t / 1000) % 60);
    const minutes = Math.floor((t / 1000 / 60) % 60);

    const zeroSeconds = seconds < 10 ? '0' : '';
    const zeroMinutes = minutes < 10 ? '0' : '';

    return {
      total: t,
      minutes: zeroMinutes + minutes,
      seconds: zeroSeconds + seconds,
    };
  },
});

export default MeetingTimeStore;
