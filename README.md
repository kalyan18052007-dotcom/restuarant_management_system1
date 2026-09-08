# Restaurant Management — Consolidated

This is a consolidated version of the original project.

Original source:
- 8 HTML files
- 9 CSS files (including duplicate dashboard stylesheet)
- 5 JS files

Consolidated source:
- `index.html`
- `style.css`
- `script.js`

Open `index.html` in a browser. Demo login:
- Username: `admin`
- Password: `admin123`

Data is stored in browser localStorage under the same keys used by the original project:
`loggedIn`, `username`, `menuitems`, `orders`, `customers`, `latestOrder`.

Fixes made during consolidation include:
- removed duplicate `dashborad.css`
- removed missing `login.css` dependency
- unified `Storage.js` / `storage.js`
- fixed broken `getOrder()` return
- added missing `saveOrders()`
- fixed logout typo
- fixed order/menu data flow
- converted multi-page navigation to one HTML single-page application
https://restuarant-management-system1-9qih.vercel.app/#dashboard
