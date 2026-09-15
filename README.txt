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
