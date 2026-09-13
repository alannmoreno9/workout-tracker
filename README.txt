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
