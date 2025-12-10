
const router = require('express').Router()
const {getCollection, ObjectId} = require('../../../dbconnect')

let collection = null
const getMenuItem = async () => {
    if(!collection) collection = await getCollection('Food-TruckAPI', 'MenuItems')
    return collection
}

// get menu items and set res to array
router.get('/', async (request, response) => {
    const collection = await getMenuItem()
    const found = await collection.find().toArray()
    response.send(found)
})

// get menu item by id
router.get('/:id', async (request, response) => { 
    const {id} = request.params
    const collection = await getMenuItem()
    const found = await collection.findOne({_id: new ObjectId(id)})
    if(found) response.send(found)
    else response.send({error: {message: `Could not find the menu item with id: ${id}`}})
})

// add menu item
router.post('/add', async (request, response) => {
    const {name, image, details, price} = request.body
    const collection = await getMenuItem()
    const {acknowledged, insertedId} = await collection.insertOne({name, image, details, price})
    response.send({acknowledged, insertedId})
})  

module.exports = router