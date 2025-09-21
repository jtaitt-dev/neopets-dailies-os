# Neopets: Dailies OS (JT$ v7.1)

A modern Tampermonkey userscript that transforms your Neopets dailies into a clean, persistent, floating dashboard with live tracking, edit mode, collapsible groups, import/export, and theme customization.

![Preview](https://images.neopets.com/items/fur_mistletoe_wreath.gif)

---

## ✨ Features

- **Live NST Clock & Auto-Reset** – Tracks Neopian Standard Time and resets daily counters at NST midnight.
- **Persistent Progress Tracking** – Remembers completion state, last completion time, and cooldown timers even after refresh.
- **Animated Progress Bar** – Shows percentage of dailies completed with celebration confetti when you hit 100%.
- **Edit Mode Toggle** – Clean UI by default. Enable edit mode to add, edit, delete dailies/groups, and access import/export tools.
- **Collapsible Groups** – Organize dailies into categories, collapse/expand individually or all at once.
- **Customizable Theme** – Light/Dark mode toggle, custom accent color, adjustable blur.
- **Add & Manage Dailies** – Add custom dailies with name, URL, icon, cooldown, and notes.
- **Import / Export** – Backup or restore your dailies setup as JSON.
- **Cooldown Support** – Supports timers like `30m`, `2h`, `13h`, `daily`, `twice-daily`, and `x/day` counts.

---

## 🚀 Installation

1. **Install Tampermonkey** (or Violentmonkey / Greasemonkey):
   - [Tampermonkey for Chrome](https://tampermonkey.net/?ext=dhdg&browser=chrome)
   - [Tampermonkey for Firefox](https://tampermonkey.net/?ext=dhdg&browser=firefox)

2. **Install the Script**  
   - Click **[Install Script](link-to-raw-script.js)**  
   - Confirm when prompted by Tampermonkey.

3. **Reload Neopets** – The dashboard will appear on the top-right of every page.

---

## 🖱️ Usage

- **Click a Daily** → Marks it complete and opens in a new tab.
- **Hover Tooltips** → Show cooldown info and last completion time.
- **Progress Bar** → See your daily completion percentage.
- **Theme Button** → Toggle light/dark mode or customize accent colors.
- **Edit Mode** → Enable to:
  - Add/Edit/Delete dailies or groups
  - Import / Export your setup
  - Collapse/Expand all groups at once

---

## 🛠️ Customization

- **Accent Color** → Choose any hex color.
- **Blur Strength** → Adjust panel background blur (0px–20px).
- **Add Your Own Dailies** → Include any URL, image, and notes.
- **Persistent Storage** → Data is saved with `GM_setValue` and never lost between sessions.

---

## 🧠 Cooldown Syntax

| Cooldown Value | Behavior                         |
|----------------|----------------------------------|
| `daily`        | Resets at NST midnight           |
| `twice-daily`  | Allows 2 completions per day     |
| `13h`          | Becomes available every 13 hours |
| `30m`          | Becomes available every 30 mins  |
| `x/day`        | Tracks a per-day counter         |
| `anytime`      | No reset, manual toggle only     |

---

## 📦 Backup & Restore

- **Export** → Click **Export** in edit mode to download `dailies_os_backup.json`.
- **Import** → Click **Import** and select a valid JSON backup.

---

## 🖼️ Screenshots

| Light Mode | Dark Mode |
|-----------|-----------|
| ![Light Mode](https://dummyimage.com/300x200/ffffff/0f172a&text=Light+Mode) | ![Dark Mode](https://dummyimage.com/300x200/0b1020/e5e7eb&text=Dark+Mode) |

---

## 📜 License

MIT – Free to use, modify, and share.  

---

## 🙌 Credits

Created by **JT$** – Built for speed, persistence, and a clean, Jony Ive–style UI.  

---

## 💡 Pro Tips

- Use the **Collapse All** button in edit mode to minimize distractions.
- Combine with a **Neopets auto-refresher** script for maximum efficiency.
- Keep backups of your setup before making big edits.
