
const router = require('express').Router()
const {getCollection, ObjectId} = require('../../../dbconnect')

let collection = null
const getMenuItem = async () => {
    if(!collection) collection = await getCollection('Food-TruckAPI', 'MenuItems')
    return collection
}







router.get('/', async (request, response) => {
    console.log('Hit /api/v1/menu')
    const collection = await getMenuItem()
    const found = await collection.find().toArray()
    response.send(found)
})

module.exports = router