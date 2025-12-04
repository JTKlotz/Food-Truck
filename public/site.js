const menuList = document.querySelector(".menuList")
const eventsList = document.querySelector(".eventsList")


// const menu = [
//     {menuid: 2, name: 'Spanakopita Quesadilla', image: 'https://image2url.com/images/1764820209375-0a2f80e0-2eba-497a-8e03-2fd128165dc8.jpg', details: 'A traditional quesadilla replaces the Mexican filling with a savory Greek filling of spinach, feta cheese, and herbs, similar to the filling of spanakopita.', price: '$12.00'},
//     {menuid: 3, name: 'Grilled Elote', image: 'https://www.skinnytaste.com/wp-content/uploads/2025/06/Mexican-Street-Corn-09.jpg', details: 'The classic grilled or steamed Mexican corn is coated with a mixture using Greek elements like feta cheese, Greek yogurt or crema, and oregano.', price: '$10.00'},
    
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
			<img src="${image || 'placeholder-dish.jpg'}" alt="${name}" class="item-image" width = 800px>
			<h3>${name}</h3>
			<p class="details"><strong>Details</strong> ${details}</p>
            <p class="price"><strong>Price:</strong> ${formattedPrice}</p>
            <br/>
		`

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
		//eventItem.onclick = () => showEventDetails(eventid)
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

