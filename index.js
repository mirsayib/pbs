const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const nodemon = require('nodemon')

const app = express()
const cors = require('cors')

app.use(cors())

app.use(express.json())
app.use(morgan((tokens, req, res)=>{return format(tokens, req, res)}))


const format = (tokens, req, res) => {
    console.log(req.body);
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body),
    ].join(' ')
}


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/info', (req, res) => {
    const temp = `<p>Phonebook has info for ${persons.length} people</p> 
    <p>${new Date()}</p>
    `
    res.send(temp)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person) res.json(person)
    else {
        res.statusMessage = `Person with id ${id} does not exist`
        res.status(404).end()
    }
})


app.post('/api/persons', (req, res) => {
    const body = req.body

    if(!body.name || !body.number ){
        return res.status(400).json({
            error: 'Data missing',
        })
    }

    if(persons.find(person => person.name === body.name)){
        return res.status(400).json({
            error: 'Name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random()*100000)
    }
    persons = persons.concat(person)
    res.json(person)
})


app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})



const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})
