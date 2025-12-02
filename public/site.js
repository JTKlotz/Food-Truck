const menuList = document.querySelector(".menuList")
const eventsList = document.querySelector(".eventsList")


// const menu = [
//     {id: 1, name: 'item1', image: '', details: 'Details about item 1', price: '$15.00'},
//     {id: 2, name: 'item2', image: '', details: 'Details about item 2', price: '$12.00'}
    
// ]

// const events = [
//     {id: 1, name: 'event1', image: '', details: 'Details about event 1', time: '7/11/2025'},
//     {id: 2, name: 'event2', image: '', details: 'Details about event 2', time: '7/11/2025'}
    
// ]


const getMenuItems = async () => {
	try
	{
		const response = await fetch('/api/v1/menu')
		if(!response.ok)
		{
			throw new Error(`HTTP Error status: ${response.status}`)
		}
		return await response.json()
	}
	catch (error)
	{
		console.error("Could not fetch menu", error)
		menuList.innerHTML = '<p>Error loading menu.</p>'
		return []
	}
}

const getEvents = async () => {
	try
	{
		const response = await fetch('/api/v1/events')
		if(!response.ok)
		{
			throw new Error(`HTTP Error status ${response.status}`)
		}
		return await response.json()
	}
	catch (error)
	{
		console.error("Could not fetch events.", error)
		eventsList.innerHTML = '<p>Error loading events schedule.</p>'
		return []
	}
}

const showMenu = menu => {
	menuList.innerHTML = ''
	if(!menu || menu.length === 0)
		{
			menuList.innerHTML = '<p>Oops! We\'re updating the menu Check back soon!</p>'
			return
		}
	
	menu?.forEach(({_id, name, image, details, price}) => {
		const menuItem = document.createElement("a")
		menuItem.href = `/menu/${_id}`
		menuItem.className = "menu-item card"
		const formattedPrice = parseFloat(price).toFixed(2)
		menuItem.innerHTML = `
			<img src="${image || 'placeholder-dish.jpg'}" alt="${name}" class="item-image">
			<h3>${name}</h3>
			<p class="details"><strong>Details</strong> ${details}</p>
            <p class="price"><strong>Price:</strong> ${formattedPrice}</p>
            <br/>
		`
		//recipeItem.onclick = () => showRecipeDetails(id)
		menuList.appendChild(menuItem)
	})
}

const showEvents = events => {
	eventsList.innerHTML = ''
	if(!events || events.length === 0)
	{
		eventsList.innerHTML = '<p>No events currently shceduled. Check back next week!</p>'
		return
	}

	events?.forEach(({_id, name, image, details, time}) => {
		const eventItem = document.createElement("a")
		eventItem.href = `/event/${_id}`
		eventItem.className = "event-item card"
		const eventDate = new Date(time).toLocaleDateString("en-US", {
			weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
		})
		eventItem.innerHTML = `
			<img src="${image || 'placeholder-event.jpg'}" alt="${name}" class="item-image">
			<h3>${name}</h3>
			<p class="details"><strong>Details:</strong> ${details}</p>
            <p class="time"><strong>Date and Time</strong> ${eventDate}</p>
		`
		//eventItem.onclick = () => showEventDetails(id)
		eventsList.appendChild(eventItem)
	})
}

document.addEventListener('DOMContentLoaded', () =>{
	(async () => {
		const [menuData, eventsData] = await Promise.all([getMenuItems(), getEvents()])

		showMenu(menuData)
		showEvents(eventsData)
})()
})

