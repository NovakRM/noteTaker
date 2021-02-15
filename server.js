//Add Dependencies (incl Nodemon for hot refresh)
const express = require("express")
const path = require("path")
const fs = require("fs")
const db = require("./db/db.json")

const PORT = process.env.PORT || 3000 //dynamic port

app.use(express.urlencoded({extended: true}))
app.use(express.json())

//Paths - Get
app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "./public/index.html"))
})

app.get("/index", (req, res)=>{
    res.sendFile(path.join(__dirname, "./public/index.html"))
})

app.get("/notes", (req, res)=>{
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

app.get("/api/notes", (req, res)=>{
    res.sendFile(path.join(__dirname, "./db/db.json"))
}) //object containing saved notes

//Paths - Post
app.post("/api/notes", (req, res)=>{
    let newNote = req.body //newNote = content sent by client
    newNote.id = newNote.id.replace(/\s+/g, "").toLowerCase() //gives note an id to be grabbed by
    fs.readFile("./db/db.json", 'utf-8', (err, data)=>{
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
