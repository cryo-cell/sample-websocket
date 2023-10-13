const express = require("express")
const app = express()
const path = require("path")
const http = require("http")
const server=http.createServer(app)
const {Server} = require("socket.io")

const port = process.env.PORT || 3000;
//port for the app to listen on
//wrapping express server in http server
const io= new Server(server)
app.use(express.static(path.resolve("")))

let arr =[];
let playingArr =[]

io.on("connection", (socket)=> {
    socket.on("find", (e)=> {
        if (e.name!=null){
            arr.push(e.name)
            if (arr.length == 2){
                let p1obj={
                    p1name: arr[0],
                    p1value: "X",
                    p1move: ""
                }
                let p2obj={
                    p2name: arr[1],
                    p2value: "O",
                    p2move: ""
                }
                let obj ={
                    p1:p1obj,
                    p2:p2obj,
                    sum:1
                }
                playingArr.push(obj)
                arr.splice(0,2)
                io.emit("find", {allPlayers:playingArr})
            }
        }
    })
    socket.on("playing",(e)=> {
        if(e.value=="X"){
            let objChange=playingArr.find(obj=>obj.p1.p1name===e.name)
            objChange.p1.p1move=e.id

            objChange.sum++
        }
        else if(e.value=="O"){
            let objChange=playingArr.find(obj=>obj.p2.p2name===e.name)

            objChange.p2.p2move=e.id
            objChange.sum++
        }

        io.emit("playing",{allPlayers:playingArr})
    })

    socket.on("gameOver", (e)=> {
        playingArr=playingArr.filter(obj=>obj.p1.p1name!==e.name)
        //console.log(playingArr)
    })
})

app.get("/", (req, res)=> {
    return res.sendFile("index.html")
})

server.listen(port, () => {
    console.log(`Port connected on ${port}`)
})