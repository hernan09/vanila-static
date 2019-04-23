const mongoose = require('mongoose')
const Schema = mongoose.Schema

let peliculas = new Schema({
  name: {type:String},
  url:{type:String},
  img:{type:String}
})

module.exports=mongoose.model('peliculas',peliculas)