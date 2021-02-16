//Dependencies
const express = require("express")
const path = require("path")
const fs = require("fs")

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
    newNote.id = newNote.title.replace(/\s+/g, "").toLowerCase() //gives note an id to be grabbed by (removes space and de-capitalizes. title=New Note -> id=newnote)
    fs.readFile("./db/db.json", "utf-8", (err, data)=>{ //utf-8 eliminates the need for server-side logic to individually determine charEnc for each incoming form submission.
        let oldNote = JSON.parse(data) //convert json string to object so new note can be pushed in
        oldNote.push(newNote) //push newnote to oldnote
        fs.writeFile("./db/db.json", JSON.stringify(oldNote), ()=>{}) //overwrite db with newly pushed item
        res.json(newNote) //sends JSON response
    })
})

//Paths - Delete
app.delete("/api/notes/:id", (req, res)=>{
    let id = req.params.id; //id = id in returned note object
    fs.readFile("./db/db.json", "utf-8", (err, data)=>{
        if (err) throw err
        let getNotes = JSON.parse(data) //convert json string to object
        for (let i=0; i<getNotes.length; i++){
            if (getNotes[i].id === id){
                getNotes.splice(i, 1) //remove one from index
            }
        }
        fs.writeFile("./db/db.json", JSON.stringify(getNotes),()=>{}) //overwrite db now that the note has been removed
        res.json(getNotes) //send JSON response
    })
})

app.listen(PORT, ()=>{
    console.log(`app listening @ ${PORT}`)
})