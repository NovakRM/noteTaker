const express = require("express")
const path = require("path")
const fs = require("fs")
const {json} = require("express")

var app = express()
var PORT = process.env.PORT || 7500 //dynamic port

//for POST
app.use(express.urlencoded({extended: true})) //recognizes incoming object as string/array. build on body-parser.
app.use(express.json()) //recognize incoming object as a JSON.
app.use(express.static(path.join(__dirname, "public")))

//Paths - Get
app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "./public/index.html"))
}) //both / and /index route to homepage

app.get("/index", (req, res)=>{
    res.sendFile(path.join(__dirname, "./public/index.html"))
})

app.get("/notes", (req, res)=>{
    res.sendFile(path.join(__dirname, "./public/notes.html"))
}) // route to notes

app.get("/api/notes", (req, res)=>{
    res.sendFile(path.join(__dirname, "./db/db.json"))
}) //object containing saved notes

app.get("public/assets/js/index.js", (req, res)=> {
    res.sendFile(path.join(__dirname, "./assets/js/index.js"))
}) //serves js

app.get("/public/assets/css/styles.css", (req, res)=> {
    res.sendFile(path.join(__dirname, "./assets/css/styles.css"))
}) //serves css...weird that it wasn't rendering correctly without it.

//Paths - Post
app.post("/api/notes", (req, res)=>{
    let newNote = req.body; //newNote = content sent by client
    newNote.id = newNote.title.replace(/\s+/g, "").toLowerCase() //gives note an id to be grabbed by
    fs.readFile("./db/db.json", "utf-8", (err, data)=>{ //utf-8 eliminates the need for server-side logic to individually determine charEnc for each incoming form submission.
        let oldNote = JSON.parse(data) //convert json string to object so new note can be pushed in
        oldNote.push(newNote) //push newnote to oldnote
        fs.writeFile("./db/db.json", JSON.stringify(oldNote), ()=>{}) //overwrite db with newly pushed item
        res.json(newNote) //sends JSON response
    })
})

//Paths - Delete
// app.delete("/api/notes/:id", (req,res)=>{

app.listen(PORT, ()=>{
    console.log(`app listening @ ${PORT}`)
})