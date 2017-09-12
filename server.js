const express = require('express')
const hbs = require('hbs')  //hbs is nothing more than an express wrapper for handlebars. It makes it easier to integrate when working with express.! handlebars - templating engine based on moustache.
// nodemon won't watch hbs files. so when running the server use - nodemon server.js -e js,hbs
const fs = require('fs')
const port = process.env.PORT || 3000  // port from system env is for heroku. to keep running it at localhost, default is specified at 3000.

var app = express();

hbs.registerPartials(__dirname+'/views/partials')  //Partials are parts of your website that you can reuse on various pages by just defining them once in the partials. Eg, footers, headers etc.
//express middleware - to teach express what it doesn't do normally. Can execute code, change req, res objects, ex, user authentication and auth.

app.use((req,res,next) =>{  //next is used to tell express that we are done.unless we call next(), express won't proceed with the rest of the code and it gets stuck at page loading.
	var now = new Date().toString()
	var log = (`${now}: ${req.method},${req.url}`)
	fs.appendFile('server.log', log+'\n', (err)=>{
		if(err){
			console.log('Unable to append to server.log')
		}	
	})
	next()
})

// app.use((req,res,next) =>{
// 	res.render('maintenance.hbs', {
// 		pageTitle: 'Maintenance Page'
// 	})
// })
app.use(express.static(__dirname+'/public'))


app.set('view engine', 'hbs')  // Telling express what view engine we want to use, i.e hbs.

hbs.registerHelper('getCurrentYear', ()=>{  //helpers to run javascript code from inside the templates.
	return new Date().getFullYear();
})
hbs.registerHelper('screamIt',(text)=>{
	return text.toUpperCase()
})
//HTTP handler for GET request. Below, handling what to return when user accesses the root. We can handle request and response.
app.get('/', (req,res)=>{
	// res.send('<h1>Hello Express!</h1>')
	// res.send({
	// 	name:'Lavanya',
	// 	likes:[
	// 	'Music',
	// 	'Lifting'
	// 	]
	// })
	d = new Date().getDay();
	days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
	res.render('home.hbs', {
		pageTitle: 'Home Page',
		welcomeMsg: `Welcome to my website. Hope you are having a wonderful ${days[d]}!`,
	})
})

app.get('/about',(req,res) =>{
	// res.send("About Page") 
	res.render('about.hbs', {
		pageTitle: 'About Page',
	})
})

// app.get('/home',(req,res) =>{
// 	// res.send("About Page") 
// 	d = new Date().getDay();
// 	days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
// 	res.render('home.hbs', {
// 		pageTitle: 'Home Page',
// 		welcomeMsg: `Welcome to my website. Hope you are having a wonderful ${days[d]}!`,
// 		currentYear: new Date().getFullYear()
// 	})
// })

app.get('/bad', (req,res) =>{
	res.send({
		errorMessage: "Unable to load the page"
	})
})

app.listen(port,()=>{
	console.log(`Server is up at port ${port}`)
})  //port number. usually devs use 3000(?)               