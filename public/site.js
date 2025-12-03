const menuList = document.querySelector(".menuList")
const eventsList = document.querySelector(".eventsList")


// const menu = [
//     {id: 1, name: 'item1', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?cs=srgb&dl=pexels-ella-olsson-572949-1640777.jpg&fm=jpg', details: 'Details about item 1', price: '$15.00'},
//     {id: 2, name: 'item2', image: '', details: 'Details about item 2', price: '$12.00'}
    
// ]

const events = [
    {id: 1, name: 'event1', image: '', details: 'Details about event 1', time: '7/11/2025'},
    {id: 2, name: 'event2', image: '', details: 'Details about event 2', time: '7/11/2025'}
    
]

const getMenuItems = async () => {
    const response = await fetch('/api/v1/menu')
    return await response.json()
}

const showMenu = menu => {
	menu?.forEach(({menuId, name, image, details, price}) => {
		const menuItem = document.createElement("div")
		menuItem.className = "menu-item"
		menuItem.innerHTML = `
			<img src="${image}" alt="${name}">
			<h2>${name}</h2>
			<p><strong>Details</strong> ${details}</p>
            <p><strong>Price:</strong> ${price}</p>
            <br/>
		`

		menuList.appendChild(menuItem)
	})
}

const showEvent = events => {
	events?.forEach(({eventId, name, image, details, time}) => {
		const eventItem = document.createElement("div")
		eventItem.className = "event-list"
		eventItem.innerHTML = `
			<img src="${image}" alt="${name}">
			<h2>${name}</h2>
			<p><strong>Details</strong> ${details}</p>
            <p><strong>Date and Time</strong> ${time}</p>
            <br/>
		`
		//eventItem.onclick = () => showEventDetails(eventid)
		eventsList.appendChild(eventItem)
	})
}


;(async () => {
    const menu = await getMenuItems()
    console.log("MENU DATA:", menu)
    showMenu(menu)
})()

showEvent(events)

