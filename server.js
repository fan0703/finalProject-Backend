const express = require('express')
require('dotenv').config()
const articleRouter = require('./routes/articles')
const Article = require('./models/article')
const mongoose = require('mongoose')
const db = mongoose.connection
const methodOverride = require('method-override')
const app = express()
const mongoURI = process.env.MONGODB_URI
const PORT = process.env.PORT || 5000

// mongoose.connect(mongoURI,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

mongoose.connect(process.env.MONGO_URI)
mongoose.connection.once("open", ()=>{
    console.log("connected to mongo")
})


//Error/disconnection
db.on('error', err => console.log(err.message + ' is Mongod not running?'))
db.on('disconnected', () => console.log('mongo disconnected'))


app.set('view engine', 'ejs')


app.use('/articles', articleRouter)
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(express.json())
app.use(express.static('public'))


app.get('/', async (req, res)=>{
    const articles = await Article.find().sort({createdAt: 'desc'})
    res.render('index', {articles: articles})
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))