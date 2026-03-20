const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'fatal.exception.secret', resave: false, saveUninitialized: true }));
app.use(express.static('public'));
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = [ { username: 'admin', password: 'root' }, { username: 'reew', password: 'fatal' } ];
    const user = users.find(u => u.username === username && u.password === password);
    if(user){ req.session.user = user.username; res.redirect('/home.html'); } 
    else { res.send("<h2 style='color:red'>ACCESS DENIED</h2><a href='/index.html'>Try Again</a>"); }
});
app.get('/home.html', (req, res) => { if(req.session.user){ res.sendFile(path.join(__dirname,'public/home.html')); } else { res.redirect('/index.html'); } });
app.get('/logout', (req,res)=>{ req.session.destroy(); res.redirect('/index.html'); });
app.listen(3000, ()=>{ console.log("Ultimate Hacker System running at http://localhost:3000"); });
