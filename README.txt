WORKOUT TRACKER - HARDENED PWA

FILES
index.html
styles.css
app.js
plan.json
manifest.webmanifest
sw.js
SECURITY.txt

DEPLOY TO GITHUB PAGES
Upload all files at the repository root. Once GitHub Pages is enabled, open the HTTPS Pages URL in Safari.

IPHONE
Safari > Share > Add to Home Screen.

DATA MODEL
- Editing a yellow weight field changes the current working value only.
- Save Today stores one workout snapshot for that calendar date.
- Saving again on the same date updates that same day's record.
- Progress compares the latest saved workout with the previous workout day and a saved workout from the previous calendar month when available.

BACKUPS
Use Backup/Export periodically. Browser/site data can be erased by device cleanup, Safari settings, or moving to a new phone.


VERSION 2
- Editable yellow Run/Stairs/Walk minute fields.
- Cardio saved in daily snapshots.
- Cardio D/D and M/M progress.
- Migrates existing v1 strength data automatically.


VERSION 3 UPDATE
- Progress now shows CARDIO PROGRESS and STRENGTH PROGRESS placeholders even before any workout history exists.
- This makes it clear from day one that both cardio minutes and lifting weights are being tracked.


VERSION 4 UPDATE
- Added custom Workout app icon for iPhone Home Screen and PWA installs.


VERSION 5 UPDATE
- Replaced the app icon with the dumbbell-only icon (multiple plates).


VERSION 6 UPDATE
- Added Body Weight tracking on the Home screen.
- Saves one scale weight per calendar day; saving again the same day updates that date.
- Progress now shows Body Weight day-over-day and month-over-month change.
- Data tab includes body-weight entries and deletion controls.
- Body-weight history is included in Backup/Import.
- Existing workout/cardio history and the dumbbell app icon remain intact.


VERSION 7 UPDATE
- Uses the final selected app icon: dark blue background with bright white dumbbell and three plates per side.
- Body Weight, Cardio Progress, Strength Progress, Backup/Import, and all prior tracking features remain unchanged.


VERSION 8 UPDATE
- Removed the blue Backup button from the top-right header.
- Backup functions now live only under Data:
  - Import backup
  - Export backup
- All other app features and saved-data behavior remain unchanged.


VERSION 9 FIX
- Fixed body-weight saving for installs migrated from older app versions.
- Body-weight storage is now normalized defensively before every save.
- Added a visible Home-screen status showing whether today's body weight is saved.
- All existing workout, cardio, progress, backup, and icon features remain unchanged.


VERSION 10 UPDATE
- Added automatic day-of-week workout scheduling.
- Monday: Chest + Biceps.
- Tuesday: Legs.
- Wednesday: Back + Triceps.
- Thursday: Legs.
- Friday: Shoulders + Traps.
- Saturday/Sunday: flexible make-up days; choose any weekday plan.
- Abs remains available every workout day.
- Added Traps with Bar Shrugs, Dumbbell Shrugs, and Cable Shrugs.
- Added MON-SUN day navigation with the current day selected automatically.
- Existing exercise/current values/history remain tied to the same workout/exercise IDs.
- Backup import now preserves Body Weight history.


VERSION 11 UPDATE
- Added a dedicated Cardio workout box to the daily schedule.
- Cardio now appears as its own Home-screen card every workout day.
- Monday: Chest + Biceps + Abs + Cardio.
- Tuesday: Legs + Abs + Cardio.
- Wednesday: Back + Triceps + Abs + Cardio.
- Thursday: Legs + Abs + Cardio.
- Friday: Shoulders + Traps + Abs + Cardio.
- Saturday/Sunday make-up schedules also include Cardio.
- Added a standalone Cardio workout page for easier daily cardio entry.


VERSION 12 UPDATE
- Removed the separate daily Abs and Cardio boxes from the Home schedule.
- Each day now shows one larger workout box for a cleaner layout.
- The daily workout box lists items in this order: Cardio, Abs, then the main workout(s).
- Tapping the day box opens a combined day view.
- The combined day view renders sections in this order: Cardio, Abs, then the scheduled workout(s).
- Save Today on the combined day view saves the full day’s workout parts together.


VERSION 13 UI CLEANUP
- Removed the large repeated day/workout hero card from Home.
- Removed the separate “Today’s workout” heading above the daily card.
- The selected weekday tab now provides the day context.
- Home now shows one clean workout card with Today’s Workout, Cardio, Abs, and the scheduled strength workout.
- Reduced repeated day/workout labels while preserving the same workout flow and saved data.


VERSION 14 ROTATING WORKOUT TIPS
- Added a rotating workout-specific coaching sentence directly below the weekday tabs.
- Tips are matched to the selected workout:
  - Chest + Biceps
  - Legs
  - Back + Triceps
  - Shoulders + Traps
- Each workout has a bank of 10 tips covering form, effort, control, and training best practices.
- The displayed tip changes automatically with the date so the same workout does not always show the same message.
- Weekend make-up days use the selected make-up workout’s tip bank.
- No workout history, body-weight data, or exercise values were changed.


VERSION 15 TIP ROTATION UPGRADE
- Split coaching tips by muscle group instead of combined day banks.
- Chest: 10 tips.
- Biceps: 10 tips.
- Legs: 20 tips.
- Back: 10 tips.
- Triceps: 10 tips.
- Shoulders: 10 tips.
- Traps: 10 tips.
- Chest + Biceps, Back + Triceps, and Shoulders + Traps each cycle through 20 total tips.
- Legs cycles through 20 total tips.
- Tip rotation now advances deterministically by workout week rather than random/date modulo selection, preventing early repeats.


VERSION 16 WEEKEND LAYOUT CONSISTENCY
- Moved the Saturday/Sunday make-up workout selector below the Body Weight card.
- Home now keeps the same top layout every day:
  weekday tabs -> rotating workout tip -> Body Weight.
- Weekend make-up controls appear after Body Weight instead of pushing it down.
- No workout history, body-weight data, tip rotation, or exercise values were changed.


VERSION 17 HOME CARD CONTEXT
- Added a “Last completed” line to the daily workout card.
- Added a visual completion bar to the daily workout card.
- Completion is based on the day’s high-level sections:
  - Cardio
  - Abs
  - Main workout block
- Added a tiny weekly counter showing how many workout days have been saved in the current week.
- No changes were made to workout history, body-weight data, exercise values, or tip rotation.


VERSION 18 UI CLEANUP
- Removed the redundant “Today’s Workout” heading from the daily workout card.
- Kept the small “Tap to start” cue in the top-right.
- No changes were made to workout history, completion tracking, tips, body weight, or exercise values.


VERSION 19 HEADER PROGRESS
- Moved the daily completion status into the top-right header next to Workout Tracker.
- Header now shows a compact completed/total count with a thin progress bar.
- Removed the large completion text and progress bar from the daily workout card.
- Kept Last completed and This week in the workout card.
- Progress still tracks Cardio, Abs, and the main workout block.
- No workout history, body-weight data, tips, or exercise values were changed.


VERSION 20 SLEEP TRACKING
- Added Sleep tracking below Body Weight.
- Enter Bedtime and Wake time.
- Uses a fixed 30-minute estimate to fall asleep.
- Optional sleep quality: Poor, Fair, Good, or Great.
- Automatically calculates estimated sleep duration.
- Saves one sleep record per calendar day.
- Progress shows latest sleep, recent history, and a 7-day average.
- Data tab supports sleep deletion.
- Sleep history is included in Backup/Import.


VERSION 21 SLEEP LABELS
- Kept the sleep labels concise:
  - Bedtime
  - Waketime
  - Sleeptime
- Clarified that each sleep record is saved to the wake-up date.
- Kept the fixed 30-minute estimate to fall asleep.
- No changes were made to workout history, sleep calculations, body weight, exercise values, or completion logic.


VERSION 22 SLEEP LABEL CONSISTENCY
- Changed the sleep note from “saved to wake-up date” to “saved to Waketime date”.
- No other sleep, workout, history, body-weight, or progress behavior changed.


VERSION 23 MORNING FLOW
- Reordered the Home screen morning flow:
  1. Sleep
  2. Body Weight
  3. Workout
- No sleep calculations, saved data, workout history, body-weight history, tips, or progress logic changed.


VERSION 24 15-MINUTE SLEEP TIMES
- Bedtime and Waketime now use 15-minute increments only:
  :00, :15, :30, and :45.
- Replaced minute-by-minute native time entry with quarter-hour selections for cleaner, faster logging.
- Existing saved times are rounded to the nearest 15 minutes when shown in the picker.
- Sleeptime calculation still subtracts the fixed 30-minute fall-asleep estimate.
- No workout, body-weight, progress, or backup behavior changed.


VERSION 25 SLEEP TIMING STANDARD
- Standardized all sleep timing to 15-minute increments.
- Bedtime and Waketime remain limited to :00, :15, :30, and :45.
- Changed the fixed estimated time to fall asleep from 30 minutes to 15 minutes.
- Sleeptime now subtracts 15 minutes from the Bedtime-to-Waketime interval.
- No workout, body-weight, progress, backup, or tip behavior changed.


VERSION 26 UPDATE RELIABILITY FIX
- Fixed stale iPhone/PWA caching that could keep an older app.js loaded after deployment.
- Added explicit v26 cache-busting to app.js and styles.css.
- Service worker now uses network-first loading with cached offline fallback.
- Service worker registration is explicitly versioned.
- Bedtime and Waketime remain 15-minute-only selectors (:00, :15, :30, :45).
- Fixed 15-minute fall-asleep estimate remains unchanged.


VERSION 27 DAILY COMPLETION = 5 ITEMS
- Updated the header progress from 3 daily items to 5.
- The five daily completion items are:
  1. Sleep saved
  2. Body Weight saved
  3. Cardio saved
  4. Abs saved
  5. Main workout block saved
- Header now starts at 0/5 and advances as each item is completed.
- The main workout block counts as one item even on split days such as Chest + Biceps.
- No saved history, sleep calculations, workout plan, body-weight data, or tip rotation changed.


VERSION 28 DAILY STRUCTURE
- Home is now ordered: Sleep, Body Weight, Cardio, Exercise.
- Cardio is a separate daily card.
- Cardio options: Run, Stairs, Walk, Box.
- Exercise contains Abs plus the scheduled strength workout.
- Header remains a 5-item daily completion tracker: Sleep, Body Weight, Cardio, Abs, Main Workout.
- Progress is now ordered: Sleep, Body Weight, Cardio, Exercise.


VERSION 29 INLINE CARDIO + TITLE CONSISTENCY
- Cardio minutes can now be entered directly on the Home screen.
- Run, Stairs, Walk, and Box each have their own yellow minutes input.
- Added a Save Cardio button directly inside the Cardio card.
- Cardio no longer requires opening a separate screen for normal daily entry.
- Saving Cardio immediately updates the daily completion counter.
- Standardized Home card titles so Sleep, Body Weight, Cardio, and Exercise use the same font size, weight, style, and color.
- No workout history, sleep calculations, body-weight data, tip rotation, or 0/5 completion logic changed.


VERSION 30 LABEL CLEANUP
- Replaced the Sleep helper note with:
  "Sleeptime includes 15 min to fall asleep automatically"
- Removed the descriptive text line under Body Weight on the Home screen.
- No workout logic, sleep calculation, cardio entry, body-weight saving, progress tracking, or history changed.


VERSION 31 SLEEP NOTE
- Shortened the Sleep helper note to:
  "Includes 15 min to fall asleep"
- No other behavior changed.


VERSION 32 BODY WEIGHT CLEANUP
- Removed the helper text under Body Weight.
- No other behavior changed.


VERSION 33 SMART WAKETIME DEFAULT
- Waketime now defaults to the device's current local time rounded to the nearest 15 minutes when no sleep entry has been saved for the day.
- The Waketime picker opens near the relevant time instead of starting from 12:00 AM.
- Bedtime remains blank until selected, because the current morning time is not a useful default for the prior night's bedtime.
- Existing saved sleep entries still load their saved Bedtime and Waketime values.
