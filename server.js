const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const shortid = require('shortid');

const DATA_FILE = path.join(__dirname,'data.json');
function loadData(){ try { return JSON.parse(fs.readFileSync(DATA_FILE)); } catch(e){ return {users:[], injEnabled: true}; } }
function saveData(d){ fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2)); }
function cleanupExpired(d){
  const now = Date.now();
  d.users = d.users.filter(u => { if(!u.expires) return true; return u.expires > now; });
}

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));

app.get('/api/keys', (req,res)=>{
  const d = loadData();
  cleanupExpired(d);
  saveData(d);
  res.json({ok:true, users:d.users});
});

app.post('/api/key', (req,res)=>{
  const {username, password, duration} = req.body;
  if(!username || !password || !duration) return res.status(400).json({ok:false, error:'missing fields'});
  const d = loadData();
  cleanupExpired(d);
  // create key
  const key = shortid.generate() + '-' + Math.random().toString(36).slice(2,8);
  let expires = null;
  const now = Date.now();
  const ms = { '1h':3600*1000, '1d':24*3600*1000, '3d':3*24*3600*1000, '5d':5*24*3600*1000, '7d':7*24*3600*1000, '13d':13*24*3600*1000 };
  if(ms[duration]) expires = now + ms[duration];
  const user = { id: shortid.generate(), username, password, key, created: now, expires, active: true };
  d.users.push(user);
  saveData(d);
  res.json({ok:true, user});
});

app.delete('/api/user/:username', (req,res)=>{
  const name = req.params.username;
  const d = loadData();
  const before = d.users.length;
  d.users = d.users.filter(u => u.username !== name);
  saveData(d);
  res.json({ok:true, removed: before - d.users.length});
});

app.post('/api/toggle-inj', (req,res)=>{
  const d = loadData();
  d.injEnabled = !d.injEnabled;
  saveData(d);
  res.json({ok:true, injEnabled: d.injEnabled});
});

// Login endpoint used by AndLua app
app.post('/api/login', (req,res)=>{
  const {username, password, key} = req.body;
  const d = loadData();
  cleanupExpired(d);
  saveData(d);
  // check if inj disabled
  if(!d.injEnabled) return res.json({ok:false, error:'inj_disabled'});
  // find user by username+password and active key
  let found = d.users.find(u => u.username === username && u.password === password && u.key === key && u.active);
  if(found){
    res.json({ok:true, msg:'CORRECT', username: found.username});
  } else {
    res.json({ok:false, msg:'WRONG'});
  }
});

// Simple status endpoint (for testing from AndLua)
app.get('/api/status', (req,res)=>{
  const d = loadData();
  cleanupExpired(d);
  saveData(d);
  res.json({ok:true, injEnabled: d.injEnabled, users: d.users.length});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Server listening on', PORT));
