//Add Dependencies (incl Nodemon for hot refresh)
const express = require("express")
// const nodemon = require ("nodemon")
const path = require("path")
const fs = require("fs")
const db = require("./db/db.json")

let app = express()
let PORT = process.env.PORT || 3000 //dynamic port

app.use(express.urlencoded({extended: true}))
app.use(express.json())

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

//Paths - Post
app.post("/api/notes", (req, res)=>{
    let newNote = req.body //newNote = content sent by client
    newNote.id = newNote.id.replace(/\s+/g, "").toLowerCase() //gives note an id to be grabbed by
    fs.readFile("./db/db.json", "utf-8", (err, data)=>{ //utf-8 eliminates the need for server-side logic to individually determine charEnc for each incoming form submission.
        let oldNote = JSON.parse(data) //convert json string to object so new note can be pushed in
        oldNote.push(newNote) //push newnote to oldnote
        fs.writeFile("./db/db.json", JSON.stringify(oldNote), ()=>{}) //overwrite db with newly pushed item
        res.json(newNote) //sends JSON response
    })
})

//Paths - Delete
// app.delete("/api/notes/:id", (req, res)=>{
//     res.send
// })

app.listen(PORT, ()=>{
    console.log(`app listening @ ${PORT}`)
})