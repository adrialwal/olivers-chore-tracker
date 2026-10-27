# Oliver's Chore Tracker

A chore and star-reward app for kids, made to run on an iPad as a Home Screen app.
Everything is set up in the app's parent mode, so no coding is needed.

- **Chores** grouped into routines (Morning, After School, Bedtime, Anytime, or your own), repeating every day, on chosen days, or once
- **Stars** are added as soon as a chore is tapped, with a celebration
- **Reward Shop**: rewards you create (like screen time) are bought instantly with stars
- **Parent mode** with a separate PIN for each grown-up: bonus stars, history with undo, chores, rewards, appearance
- **Themes**: Blocky, Space, Clean, Geography and Flags, each in light or dark, plus custom colors
- **Seasons and US holidays** (off by default) switch automatically by date
- **Sounds** (off by default)
- **Works offline.** Data stays on each iPad, and nothing is sent anywhere.
- **Two houses**: each iPad keeps its own stars and history. *Share setup* copies chores and rewards to the other iPad.

## 1. Put it on GitHub (one time)

1. Sign in at [github.com](https://github.com) and click **+ → New repository**.
   - Name: `olivers-chore-tracker`
   - Visibility: **Public** (free GitHub Pages hosting needs this; your child's data is never in the repo, only the app code)
   - Don't add a README or .gitignore. Click **Create repository**.
2. Upload the code, using either option:
   - **From this Claude Code session:** connect the repo to the session and Claude will push it for you.
   - **From a computer with git:**
     ```bash
     git remote add origin https://github.com/YOUR-USERNAME/olivers-chore-tracker.git
     git push -u origin main
     ```
3. In the repo on GitHub, go to **Settings → Pages**. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Open the **Actions** tab and wait for **Deploy to GitHub Pages** to turn green (about a minute).
   If it ran before step 3, click it and choose **Re-run all jobs**.
5. Your app is now at `https://YOUR-USERNAME.github.io/olivers-chore-tracker/`

## 2. Install on each iPad

1. Open the link above in **Safari** (it has to be Safari).
2. Tap the **Share** button, then **Add to Home Screen**, then **Add**.
3. Open it from the Home Screen icon and follow the setup steps.
   **Save the recovery code** it shows you (a screenshot is fine).

**Second house:** on the first iPad, go to 🔒 → *Share & Backup* → **Share setup** and send the file (AirDrop, Messages or email).
On the second iPad, install the app, then tap **Import a setup or backup file** on the welcome screen.
Chores, rewards and the look are copied; each house keeps its own stars and PINs.

Optional: to keep a kid inside the app, use iPad **Guided Access** (Settings → Accessibility → Guided Access).

## 3. Updates

When new code is pushed to `main`, GitHub rebuilds the site automatically. Each iPad picks up the update the
next time the app is opened with internet. Chores, stars and history are not affected.

## Backups

Data lives only on the iPad. Deleting the Home Screen app deletes its data.
Use 🔒 → *Share & Backup* → **Save a backup** now and then, and save it to Files or iCloud Drive.

## For developers

```bash
npm install
npm run dev      # local dev server
npm test         # unit tests
npm run build    # production build in dist/
npm run icons    # regenerate app icons (needs Playwright)
```

React + TypeScript + Vite. Data is saved in IndexedDB on the device. A service worker (vite-plugin-pwa) makes it work offline.
All artwork (pixel avatars, icon) and sounds are original and generated in code.
