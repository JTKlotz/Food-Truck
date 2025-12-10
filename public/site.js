const API_BASE_URL = 'http://localhost:3010'

// get elements
const menuList = document.querySelector(".menuList")
const eventsList = document.querySelector(".eventsList")

const modal = document.getElementById('menuDetailModal');
const modalCloseBtn = modal ? modal.querySelector('.modal-close-btn') : null

// retrieve menu items from db
const getMenuItems = async () => {
    try
    {
        const response = await fetch(`${API_BASE_URL}/api/v1/menu`)
        // error handling if fetch doesn't work
        if(!response.ok)
        {
            throw new Error(`HTTP Error status: ${response.status}`)
        }
        return await response.json()
    }
    catch (error)
    {
        console.error("Could not fetch menu", error)
        // if fetch fail, menuList reads "Error loading menu"
        if(menuList) menuList.innerHTML = `<p>Error loading menu.</p>`
        // return empty array
        return []
    }
}

// retrieve events from db
const getEvents = async () => {
    try
    {
        const response = await fetch(`${API_BASE_URL}/api/v1/events`)
        // error handling if fetch doesn't work
        if(!response.ok)
        {
            throw new Error(`HTTP Error status ${response.status}`)
        }
        return await response.json()
    }
    catch (error)
    {
        console.error("Could not fetch events.", error)
        // if fetch fail, eventsList reads "Error loading events schedule"
        if(eventsList) eventsList.innerHTML = `<p>Error loading events schedule.</p>`
        // return empty array
        return []
    }
}

// fetch details about specific event
const getEventDetails = async (eventId) => {
    try {
        // get response from url
        const response = await fetch(`${API_BASE_URL}/api/v1/events/${eventId}`)
        // if 404 disp error "Event not found (404)"
        if (response.status === 404) {
             throw new Error("Event not found (404)")
        }
        // if response != ok disp error "HTTP Error status: + status"
        if (!response.ok) {
            throw new Error(`HTTP Error status: ${response.status}`)
        }
        return await response.json();
    // log error and return null to avoid crash
    } catch (error) {
        console.error("Could not fetch event details:", error)
        return null
    }
}

// display the menu
const showMenu = menu => {
    // if there is no menu, exit; menuList = ''
    if (!menuList) return;
    menuList.innerHTML = ''
    // if no  menu
    if(!menu || menu.length === 0)
        {
            // display "Oops! We're updating the menu. Check back soon!"
            menuList.innerHTML = '<p>Oops! We\'re updating the menu Check back soon!</p>'
            return
        }

    // default image if !image
    const MENU_FALLBACK_IMAGE = 'https://placehold.co/400x250/6699CC/FFFFFF?text=Hellenic+Heat+Dish'
    
    // create html for each menu prop
    menu?.forEach(({_id, name, image, details, price}) => {
        
        // create var imageUrl to hold returned image or default image if !image
        let imageUrl = image || MENU_FALLBACK_IMAGE
        
        // create <a> for each menuItem
        const menuItem = document.createElement("a")
        menuItem.href = "#" 
        
        // assign class name to each
        menuItem.className = "card-link data-card menu menu-modal-trigger"
        
        // format price to display $X.XX
        const formattedPrice = parseFloat(price).toFixed(2)
        
        menuItem.dataset.id = _id
        menuItem.dataset.name = name
        menuItem.dataset.image = imageUrl
        menuItem.dataset.details = details
        menuItem.dataset.price = formattedPrice

        // create html for menuItems
        // image props
        // handle fallback image assign
        // create divs with classes for card display
        menuItem.innerHTML = `
            <img 
                src="${imageUrl}" 
                alt="${name}" 
                class="card-image" 
                onerror="this.onerror=null; this.src='${MENU_FALLBACK_IMAGE}'">
            <div class="card-content">
                <h3 class="card-title">${name}</h3>
                <p class="card-description">${details}</p>
            </div>
            <div class="card-footer">
                <span class="card-value">$${formattedPrice}</span>
                <span class="card-type">MENU</span>
            </div>
        `

        // add menuItem to menuList
        menuList.appendChild(menuItem)
    })
}


const showShortEvents = events => {
    // if no eventsList '...'
    if (!eventsList) return;
    eventsList.innerHTML = ''
    //  if no events disp "..."
    if(!events || events.length === 0)
    {
        eventsList.innerHTML = '<p>No events currently scheduled. Check back next week!</p>'
        return
    }

    // default event image if !image
    const EVENT_FALLBACK_IMAGE = "https://placehold.co/400x200/003366/ffc400?text=Event"

    // Sort the events by date <--- Jordan
    const compareEvents = (a,b) => {
        return a.date === b.date ? 0 : a.date > b.date ? 1 : -1
    }

    const sortedEvents = events.toSorted(compareEvents)

    // create html for each of the sorted events
    sortedEvents?.forEach(({_id, name, date, image}) => {
        const eventItem = document.createElement("a")
        eventItem.href = `/event/${_id}`
        eventItem.className = "card-link data-card event"
        
        let eventDate = 'Date/Time Unknown'
        try {
            eventDate = new Date(date).toLocaleDateString("en-US", {
                month: 'short', day: 'numeric', year: 'numeric'
            })
        } catch (e) {
            eventDate = `Date N/A`
        }
        
        const eventImageUrl = image || EVENT_FALLBACK_IMAGE
        
        eventItem.innerHTML = `
            <img 
                src="${eventImageUrl}" 
                alt="${name}" 
                class="card-image"
                onerror="this.onerror=null; this.src='${EVENT_FALLBACK_IMAGE}'">
            <div class="card-content">
                <h3 class="card-title">${name}</h3>
                
            </div>
            <div class="card-footer">
                <span class="card-value">${eventDate}</span>
                <span class="card-type">EVENT</span>
            </div>
        `
        eventsList.appendChild(eventItem)
    })
}

// display details about specific event
const showEventDetails = (event) => {
    const contentDiv = document.getElementById('eventDetailContent')
    if (!contentDiv) return;

    // handle if event is missing
    if (!event) {
        contentDiv.innerHTML = '<h2 class="section-header">Event Not Found</h2><p style="text-align: center;">Sorry, the event you are looking for does not exist or has been cancelled.</p>'
        return
    }
    
    // Format date for the main detail page
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    })
    
    // default image if !image
    const FEATURED_FALLBACK_IMAGE  = "https://placehold.co/1000x350/003366/ffc400?text=Featured+Event"

    const eventImageUrl = event.image || FEATURED_FALLBACK_IMAGE

    // Inject the HTML for event
    contentDiv.innerHTML = `
        <div class="event-detail-container">
            <img 
                src="${eventImageUrl}" 
                alt="${event.name}" 
                class="event-image-full"
                onerror="this.onerror=null; this.src='${FEATURED_FALLBACK_IMAGE}'">
            
            <div class="event-detail-content">
                <h1 class="event-detail-title">${event.name}</h1>
                
                <div class="event-metadata">
                    <div class="event-detail-item">
                        <span class="event-detail-label">Date</span>
                        <strong>${formattedDate}</strong>
                    </div>
                    <div class="event-detail-item">
                        <span class="event-detail-label">Time</span>
                        <strong>${event.time}</strong>
                    </div>
                    <div class="event-detail-item">
                        <span class="event-detail-label">Location</span>
                        <strong>${event.location}</strong>
                    </div>
                </div>
                
                <h2>Event Details</h2>
                <p class="event-description-text">${event.details || 'No detailed description provided for this event.'}</p>
            </div>
        </div>
    `;
};

// --- MODAL FUNCTIONS FOR IMAGE CLICK POPUP ---

const showModal = (data) => {
    if (!modal) return;
    
    // Populate the modal content (Image only)
    document.getElementById('modalImage').src = data.image
    document.getElementById('modalImage').alt = data.name
    
    // Show the modal
    modal.classList.remove('hidden');
    modalCloseBtn?.focus(); 
}

const hideModal = () => {
    if (!modal) return;
    modal.classList.add('hidden')
}

const setupModal = () => {
    if (!menuList) return;

    // Event listener for opening the modal (delegation on the list container)
    menuList.addEventListener('click', (e) => {
        // Find the closest ancestor that has the menu-modal-trigger class (the <a> tag)
        const trigger = e.target.closest('.menu-modal-trigger')
        if (trigger) {
            // Crucial: Stop navigation to #
            e.preventDefault() 
            
            // Collect the data from the data- attributes
            const data = trigger.dataset
            showModal(data);
        }
    })

    // Event listeners for closing the modal
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', hideModal);
    }
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', (e) => {
        // Ensure the click target is the modal overlay itself, not content inside it
        if (e.target.id === 'menuDetailModal') {
            hideModal()
        }
    })
    
    // Close modal on escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            hideModal()
        }
    })
}

// listener for page load
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    // Check if the current URL path starts with /event/ (meaning it's a detail page)
    if (path.startsWith('/event/')) {
        const parts = path.split('/')
        // The ID is the third part (e.g., in /event/123)
        const eventId = parts[2] 
        
        // if eventId getEventDetails for specific event
        if (eventId) {
            (async () => {
                const eventData = await getEventDetails(eventId)
                showEventDetails(eventData)
            })();
        } else {
             // Handle case where path is just /event/ with no ID
            const contentDiv = document.getElementById('eventDetailContent');
            if(contentDiv) contentDiv.innerHTML = '<p style="text-align: center;">No Event ID provided.</p>'
        }
    } 
    // Otherwise, assume it's the index page (or any page where lists should load)
    else {
        (async () => {
            const [menuData, eventsData] = await Promise.all([getMenuItems(), getEvents()])
    
            // disp menuData
            showMenu(menuData)
            // disp eventsData
            showShortEvents(eventsData)

            // init modal
            setupModal()
        })()
    }
});