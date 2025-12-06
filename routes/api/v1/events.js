const router = require('express').Router()
const {getCollection, ObjectId} = require('../../../dbconnect')

let collection = null
const getEventItem = async () => {
    if(!collection) collection = await getCollection('Food-TruckAPI', 'Events')
    return collection
}


router.get('/', async (request, response) => {
    const collection = await getEventItem()
    const found = await collection.find().toArray()
    response.send(found)
})

router.get('/:id', async (request, response) => {
    const {id} = request.params
    const collection = await getEventItem()
    const found = await collection.findOne({_id: new ObjectId(id)})
    if(found) response.send(found)
    else response.send({error: {message: `Could not find the event with id: ${id}`}})
})

router.post('/add', async (request, response) => {
    const {name, location, date, time, details, image} = request.body
    const collection = await getEventItem()
    const {acknowledged, insertedId} = await collection.insertOne({name, location, date, time, details, image})
    response.send({acknowledged, insertedId})
})  

module.exports = router