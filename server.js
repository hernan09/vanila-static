const express=require('express')
const mongoose=require('mongoose')
const path=require('path')
const session=require('express-session')
const bodyParser=require('body-parser')
const nodemailer=require('nodemailer')

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
mongoose.connect('mongodb://localhost:27017/pelis',{useNewUrlParser:true},(err)=>{
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
    
    res.redirect('/home')
    
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
        text: 'name' + req.body.user + 'mail' + req.body.email + 'message' + req.body.area,
        html: '<ul><li>' + req.body.user + '</li><li>' + req.body.email + '</li></ul>' + '<p>' + req.body.area + '</p>'

    }

    transporter.sendMail(mailoptions, (error, info) => {
        if (error) console.log(`${error}`)
        else {
            console.log(info)
            res.redirect('/home')
        }
    })
})