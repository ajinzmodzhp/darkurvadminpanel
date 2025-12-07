# X10MX Admin Panel (local)

This package contains a simple Node.js admin panel and API to manage keys/users for your AndLua app.

How to run:
1. Install Node.js (v14+)
2. In the project folder run:
   npm install
   node server.js
3. Open http://localhost:3000 in your browser to access the admin panel.

API endpoints:
- GET /api/keys -> list users (auto-cleans expired keys)
- POST /api/key {username,password,duration} -> create key (duration: '1h','1d','3d','5d','7d','13d')
- DELETE /api/user/:username -> delete all entries for username
- POST /api/toggle-inj -> toggle injection enable/disable flag
- POST /api/login {username,password,key} -> login (returns ok:true if valid)

Place the server behind a public URL (or host on a VPS) and point your AndLua app to the server's /api/login endpoint.

Included example: `lua_sample.lua`
