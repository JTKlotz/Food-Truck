const API_BASE_URL = 'http://localhost:3010';

const menuForm = document.getElementById('menuForm');
const eventForm = document.getElementById('eventForm');
const menuMessage = document.getElementById('menuMessage');
const eventMessage = document.getElementById('eventMessage');

/**
 * Pop-up confirming success/failure on submission
 * @param {HTMLElement} element - The paragraph element to display the message in.
 * @param {string} message - The text content of the message.
 * @param {boolean} isError - If true, styles the message as an error.
 */
const displayMessage = (element, message, isError = false) => {
    element.textContent = message
    element.style.color = isError ? '#cc0000' : '#006600'
    
    // Clear message after 5 seconds
    setTimeout(() => {
        element.textContent = ''
        element.style.color = 'inherit'
    }, 5000);
};

/**
 * Handles the POST request to the API to add a new item or event.
 * @param {string} endpoint - The API endpoint (e.g., 'menu' or 'events').
 * @param {object} data - The data object to send in the request body.
 * @param {HTMLElement} messageElement - The element to display feedback in.
 * @param {HTMLFormElement} formElement - The form to reset upon success.
 */
const postData = async (endpoint, data, messageElement, formElement) => {
    try {
        const fullEndpoint = `${API_BASE_URL}/api/v1/${endpoint}`; 
        
        displayMessage(messageElement, `Submitting data to ${fullEndpoint}...`)

        // Response obj for fetch of endpoint
        const response = await fetch(fullEndpoint, {
            // method = POST
            method: 'POST',
            // tell server body is json
            headers: {
                'Content-Type': 'application/json',
            },
            // convert to string for http
            body: JSON.stringify(data),
        });

        // Error handling
        if (!response.ok) {
            // wait for json error obj
            // catch if no json obj and disply message "Unknown error" so no crash
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            // throw error with response (ex 400)
            // error message in json body || text of status response
            throw new Error(`Failed to add item. Status: ${response.status}. Message: ${errorData.message || response.statusText}`);
        }

        // Success response
        const result = await response.json();
        // disp message of item added || 'item'
        displayMessage(messageElement, `Success! Added: ${result.name || 'item'}.`, false)
        // reset form for new item add
        formElement.reset()

        // Error handling
    } catch (error) {
        // console log the error
        console.error('API Error:', error);
        // pop-up message submission failed with error
        displayMessage(messageElement, `Submission failed: ${error.message}`, true)
    }
};


// --- Event Listeners for Form Submissions ---

// Menu form submission
if (menuForm) {
    // if theres a menuForm create listener  e=event
    menuForm.addEventListener('submit', (e) => {
        // don't nav or reload
        e.preventDefault();
        
        // New menu form
        const formData = new FormData(menuForm);
        // Obj for menu
        const data = {
            name: formData.get('name'),
            price: parseFloat(formData.get('price')),
            details: formData.get('details'),
            // undefined for optional image - not null
            image: formData.get('image') || undefined,
        };

        // Make sure form is filled out with name and price (required)
        if (!data.name || isNaN(data.price)) {
            displayMessage(menuMessage, 'Item Name and a valid Price are required.', true)
            return;
        }

        // Post new menu item
        postData('menu/add', data, menuMessage, menuForm);
    });
}


// Event form submission
if (eventForm) {
    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // get values from eventForm
        const name = eventForm.elements['eventName'].value
        const location = eventForm.elements['location'].value
        const dateInput = eventForm.elements['eventDate'].value
        const timeInput = eventForm.elements['eventTime'].value
        const details = eventForm.elements['eventDetails'].value
        const image = eventForm.elements['eventImage'].value

        // check for form completion
        if (!name || !location || !dateInput || !timeInput) {
            // display message if missing required
            displayMessage(eventMessage, 'Event Name, Location, Date, and Time are required.', true);
            return;
        }

        // create fullDate to override midnight default and avoid time zone error since date and time are separate
        const fullDate = `${dateInput}T${timeInput}:00`

        const data = {
            name,
            location, 
            date: fullDate,
            time: timeInput,
            details: details,
            image: image,
        }

        // add event 
        postData('events/add', data, eventMessage, eventForm);
    });
}