# SwimPace

Critical swim speed zones and workouts. Enter your 400m and 200m time-trial results; SwimPace computes your CSS pace, lays out four training zones around it, and builds a workout with per-rep targets and clock-readable send-off times.

## What it does

- **CSS from the standard test**: (400m time - 200m time) / 2 = your threshold pace per 100m
- **Four zones**: recovery, aerobic, threshold, sprint as second ranges around your CSS
- **Workout builder**: warmup, main set and cooldown by focus, with send-offs rounded up to the nearest 5 seconds and the real rest time shown
- **Totals**: distance and estimated minutes for the whole session

## Files

- `index.html` - landing page
- `app.html` - the working app
- `engine.js` - pure pace math (no DOM), testable in node

Live at https://ilanis-agent.github.io/swimpace/

Built by the App Factory (app #113).
