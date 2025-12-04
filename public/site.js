const menuList = document.querySelector(".menuList")
const eventsList = document.querySelector(".eventsList")


// const menu = [
//     {menuid: 4, name: 'Greek Mole Enchiladas', image: 'https://image2url.com/images/1764821178178-1adc00a7-0707-455b-a8d7-7806a41f28d3.jpg', details: 'Corn tortillas filled with shredded chicken or roasted vegetables are topped with a mole-style sauce infused with Greek flavors, such as cinnamon, cloves, and a hint of honey. Crumbled feta cheese replaces queso fresco for a tangy finish, and the dish is garnished with fresh parsley instead of cilantro.', price: '$15.00'},
//     {menuid: 5, name: 'Tzatziki Guacamole', image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fthecitygirlskitchen.wordpress.com%2F2014%2F06%2F22%2Fsimple-staples-tzatziki-guacamole-baked-tortillas%2F&psig=AOvVaw3dwTyDBpp7wuozKRIlOLK8&ust=1764907456475000&source=images&cd=vfe&opi=89978449&ved=0CBYQjRxqFwoTCPiOzeSGo5EDFQAAAAAdAAAAABAU', details: 'A creamy dip combining classic guacamole (avocado, tomato, onion, lime) with Greek tzatziki elements like grated cucumber, dill, garlic, and a spoonful of Greek yogurt. The result is a cool, tangy hybrid dip perfect for pita chips or tortilla chips.', price: '$9.00'},
    
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
		menuItem.className = "menu-item-card"
		const formattedPrice = parseFloat(price).toFixed(2)
		menuItem.innerHTML = `
			<img src="${image || 'placeholder-dish.jpg'}" alt="${name}" class="item-image" width = 800px>
			<h3>${name}</h3>
			<p class="details"><strong>Details:</strong> ${details}</p>
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

