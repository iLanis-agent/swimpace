// SwimPace engine - CSS swim speed, zones, interval sets (no DOM)
(function (root) {
  'use strict';

  // CSS = critical swim speed, seconds per 100m, from a 400/200 time trial.
  function cssPace(t400sec, t200sec) {
    var t4 = Number(t400sec), t2 = Number(t200sec);
    if (!(t4 > 0) || !(t2 > 0) || t4 <= t2) return null;
    return Math.round((t4 - t2) / 2 * 10) / 10; // seconds per 100m over the 200m delta
  }

  // Zones as second offsets from CSS per 100m.
  var ZONES = [
    { id: 'recovery',  label: 'Recovery',  lo: 16, hi: 25 },
    { id: 'aerobic',   label: 'Aerobic',   lo: 8,  hi: 16 },
    { id: 'threshold', label: 'Threshold', lo: 2,  hi: 8 },
    { id: 'sprint',    label: 'Sprint',    lo: -8, hi: -2 }
  ];

  function zoneTable(css) {
    return ZONES.map(function (z) {
      var a = Math.round((css + z.lo) * 10) / 10, b = Math.round((css + z.hi) * 10) / 10;
      return { id: z.id, label: z.label,
               slowSec: Math.max(a, b),
               fastSec: Math.min(a, b) };
    });
  }

  // Time for a rep of distM at css+offset per 100m.
  function repTime(css, offset, distM) {
    return Math.round((css + offset) * distM / 100 * 10) / 10;
  }

  // Send-off time rounded UP to the nearest 5 seconds (rep + rest).
  function sendOff(repSec, restSec) {
    return Math.ceil((repSec + restSec) / 5) * 5;
  }

  var SETS = {
    threshold: { reps: 10, dist: 100, offset: 3,  rest: 15, label: '10 x 100 threshold' },
    aerobic:   { reps: 5,  dist: 200, offset: 10, rest: 20, label: '5 x 200 aerobic' },
    sprint:    { reps: 16, dist: 50,  offset: -5, rest: 20, label: '16 x 50 sprint' },
    mixed:     { reps: 8,  dist: 100, offset: 5,  rest: 15, label: '8 x 100 mixed' }
  };

  // Full workout: warmup, main set, cooldown. Distances in meters.
  function buildWorkout(css, focus) {
    var spec = SETS[focus] || SETS.threshold;
    var rt = repTime(css, spec.offset, spec.dist);
    var so = sendOff(rt, spec.rest);
    var main = {
      label: spec.label,
      reps: spec.reps, dist: spec.dist,
      targetPerRep: rt,
      sendOff: so,
      actualRest: so - rt,
      distance: spec.reps * spec.dist,
      minutes: Math.round(spec.reps * so / 60 * 10) / 10
    };
    var warmup = { label: 'warmup: 300 easy, mix strokes', distance: 300, minutes: Math.round(repTime(css, 20, 300) / 60 * 10) / 10 };
    var cooldown = { label: 'cooldown: 200 easy choice', distance: 200, minutes: Math.round(repTime(css, 22, 200) / 60 * 10) / 10 };
    return {
      css: css,
      parts: [warmup, main, cooldown],
      totalDistance: warmup.distance + main.distance + cooldown.distance,
      totalMinutes: Math.round((warmup.minutes + main.minutes + cooldown.minutes) * 10) / 10
    };
  }

  // mm:ss(.t) -> seconds. Accepts '7:30', '90', '1:45.5'.
  function parseTime(str) {
    var s = String(str || '').trim();
    if (!s) return null;
    var parts = s.split(':');
    if (parts.length === 1) { var v = parseFloat(parts[0]); return v > 0 ? v : null; }
    var m = parseInt(parts[0], 10), sec = parseFloat(parts[1]);
    if (!(m >= 0) || !(sec >= 0) || sec >= 60) return null;
    var total = m * 60 + sec;
    return total > 0 ? total : null;
  }

  // seconds -> 'm:ss.t'
  function fmtTime(sec) {
    var neg = sec < 0 ? '-' : '';
    var v = Math.abs(sec);
    var m = Math.floor(v / 60);
    var s = v - m * 60;
    var whole = Math.floor(s), tenth = Math.round((s - whole) * 10);
    if (tenth === 10) { whole += 1; tenth = 0; }
    if (whole === 60) { m += 1; whole = 0; }
    return neg + m + ':' + String(whole).padStart(2, '0') + (tenth ? '.' + tenth : '');
  }

  var api = { cssPace: cssPace, ZONES: ZONES, zoneTable: zoneTable, repTime: repTime,
    sendOff: sendOff, SETS: SETS, buildWorkout: buildWorkout,
    parseTime: parseTime, fmtTime: fmtTime };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SwimEngine = api;
})(typeof self !== 'undefined' ? self : this);
