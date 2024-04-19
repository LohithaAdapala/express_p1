const express = require('express')
const app = express()
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
let db = null

const filePath = path.join(__dirname, 'cricketTeam.db')

const initialSServerAndDatabase = async () => {
  try {
    db = await open({
      filename: filePath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server running at 3000')
    })
  } catch (e) {
    console.log(`${e.message}`)
  }
}
initialSServerAndDatabase()

app.get('/players/', async (request, response) => {
  const query = `select * from cricket_team`
  const playerArray = await db.all(query)
  response.send(playerArray)
})
app.use(express.json())
app.post('/players/', async (request, response) => {
  try {
    const body = request.body
    const {player_name, jersey_number, role} = body
    const query = `INSERT INTO cricket_team(player_name,jersey_number,role) VALUES('${player_name}',${jersey_number},'${role}')`
    const object = await db.run(query)
    const id = object.lastId
    response.send('Player Addeed to Team')
  } catch (e) {
    console.log(`${e.message}`)
  }
})

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const query = `select * from cricket_team where player_id=${playerId};`
  const player = await db.get(query)
  response.send(player)
})

app.put('/players/:playerId/', async (request, response) => {
  try{
  const {playerId} = request.params
  
  const {player_name, jersey_number, role} = request.body
  const query = `update cricker_team set player_name= '${player_name}', jersey_number=${jersey_number},role='${role}' where player_id=${playerId}`;
  await db.run(query);
  response.send('Player Details Updated')
  }catch(e){
    console.log(`${e.message}`);
  }

})


app.delete('/players/:playerId', async (request,response)=>{
  const {playerId} = request.params
  const query = `delete from cricket_team where player_id=${playerId}`
  await db.run(query);
  response.send('Player Removed')

})


module.exports=app
