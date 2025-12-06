const API_BASE_URL = 'http://localhost:3010'

const menuList = document.querySelector(".menuList")
const eventsList = document.querySelector(".eventsList")

const modal = document.getElementById('menuDetailModal');
const modalCloseBtn = modal ? modal.querySelector('.modal-close-btn') : null


const getMenuItems = async () => {
    try
    {
        const response = await fetch(`${API_BASE_URL}/api/v1/menu`)
        if(!response.ok)
        {
            throw new Error(`HTTP Error status: ${response.status}`)
        }
        return await response.json()
    }
    catch (error)
    {
        console.error("Could not fetch menu", error)
        if(menuList) menuList.innerHTML = `<p>Error loading menu. (Check API server is running on ${API_BASE_URL})</p>`
        return []
    }
}

const getEvents = async () => {
    try
    {
        const response = await fetch(`${API_BASE_URL}/api/v1/events`)
        if(!response.ok)
        {
            throw new Error(`HTTP Error status ${response.status}`)
        }
        return await response.json()
    }
    catch (error)
    {
        console.error("Could not fetch events.", error)
        if(eventsList) eventsList.innerHTML = `<p>Error loading events schedule. (Check API server is running on ${API_BASE_URL})</p>`
        return []
    }
}

const getEventDetails = async (eventId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/events/${eventId}`)
        if (response.status === 404) {
             throw new Error("Event not found (404)")
        }
        if (!response.ok) {
            throw new Error(`HTTP Error status: ${response.status}`)
        }
        return await response.json();
    } catch (error) {
        console.error("Could not fetch event details:", error)
        return null
    }
}


const showMenu = menu => {
    if (!menuList) return;
    menuList.innerHTML = ''
    if(!menu || menu.length === 0)
        {
            menuList.innerHTML = '<p>Oops! We\'re updating the menu Check back soon!</p>'
            return
        }

    const fallbackimage = 'https://placehold.co/400x250/6699CC/FFFFFF?text=Hellenic+Heat'
    
    menu?.forEach(({_id, name, image, details, price}) => {
        let imageUrl = image || fallbackimage
        if (imageUrl && imageUrl.includes('google.com/url')) {
             imageUrl = 'https://placehold.co/400x250/333/eee?text=Fusion+Dish'
        } else if (!imageUrl) {
            imageUrl = 'placeholder-dish.jpg'
        }

        const menuItem = document.createElement("a")
        menuItem.href = "#" 
        
        menuItem.className = "card-link data-card menu menu-modal-trigger"
        
        const formattedPrice = parseFloat(price).toFixed(2)
        
        menuItem.dataset.id = _id
        menuItem.dataset.name = name
        menuItem.dataset.image = imageUrl
        menuItem.dataset.details = details
        menuItem.dataset.price = formattedPrice

        menuItem.innerHTML = `
            <img 
                src="${imageUrl}" 
                alt="${name}" 
                class="card-image" 
                onerror="this.onerror=null; this.src='${fallbackimage}'">
            <div class="card-content">
                <h3 class="card-title">${name}</h3>
                <p class="card-description">${details}</p>
            </div>
            <div class="card-footer">
                <span class="card-value">$${formattedPrice}</span>
                <span class="card-type">MENU</span>
            </div>
        `

        menuList.appendChild(menuItem)
    })
}


const showShortEvents = events => {
    if (!eventsList) return;
    eventsList.innerHTML = ''
    if(!events || events.length === 0)
    {
        eventsList.innerHTML = '<p>No events currently scheduled. Check back next week!</p>'
        return
    }

    // Sort the events by date
    const compareEvents = (a,b) => {
        return a.date === b.date ? 0 : a.date > b.date ? 1 : -1
    }

    const sortedEvents = events.toSorted(compareEvents)

    sortedEvents?.forEach(({_id, name, date}) => {
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
        
        const imageUrl = "https://placehold.co/400x200/003366/ffc400?text=Event"
        
        eventItem.innerHTML = `
            <img src="${imageUrl}" alt="${name}" class="card-image">
            <div class="card-content">
                <h3 class="card-title">${name}</h3>
                
            </div>
            <div class="card-footer">
                <span class="card-value">${eventDate}</span>
                
            </div>
        `
        eventsList.appendChild(eventItem)
    })
}


const showEventDetails = (event) => {
    const contentDiv = document.getElementById('eventDetailContent')
    if (!contentDiv) return;

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
    
    const imageUrl = "https://placehold.co/1000x350/003366/ffc400?text=Featured+Event"

    // Inject the HTML for event
    contentDiv.innerHTML = `
        <div class="event-detail-container">
            <img src="${imageUrl}" alt="${event.name}" class="event-image-full">
            
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
            e.preventDefault(); // Crucial: Stop navigation to #
            
            // Collect the data from the data- attributes
            const data = trigger.dataset
            showModal(data);
        }
    });

    // Event listeners for closing the modal
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', hideModal);
    }
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', (e) => {
        // Ensure the click target is the modal overlay itself, not content inside it
        if (e.target.id === 'menuDetailModal') {
            hideModal();
        }
    });
    
    // Close modal on escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            hideModal();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    // Check if the current URL path starts with /event/ (meaning it's a detail page)
    if (path.startsWith('/event/')) {
        const parts = path.split('/')
        const eventId = parts[2] // The ID is the third part (e.g., in /event/123)
        
        if (eventId) {
            (async () => {
                const eventData = await getEventDetails(eventId);
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
    
            showMenu(menuData)
            showShortEvents(eventsData)

            setupModal();
        })()
    }
});