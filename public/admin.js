const API_BASE_URL = 'http://localhost:3010';

const menuForm = document.getElementById('menuForm');
const eventForm = document.getElementById('eventForm');
const menuMessage = document.getElementById('menuMessage');
const eventMessage = document.getElementById('eventMessage');

/**
 * @param {HTMLElement} element - The paragraph element to display the message in.
 * @param {string} message - The text content of the message.
 * @param {boolean} isError - If true, styles the message as an error.
 */
const displayMessage = (element, message, isError = false) => {
    element.textContent = message;
    element.style.color = isError ? '#cc0000' : '#006600'; // Fallback colors for feedback
    
    // Clear message after 5 seconds
    setTimeout(() => {
        element.textContent = '';
        element.style.color = 'inherit';
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
        
        displayMessage(messageElement, `Submitting data to ${fullEndpoint}...`);

        const response = await fetch(fullEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`Failed to add item. Status: ${response.status}. Message: ${errorData.message || response.statusText}`);
        }

        // Success response
        const result = await response.json();
        displayMessage(messageElement, `Success! Added: ${result.name || 'item'}.`, false);
        formElement.reset(); // Clear the form fields on success

    } catch (error) {
        console.error('API Error:', error);
        displayMessage(messageElement, `Submission failed: ${error.message}`, true);
    }
};


// --- Event Listeners for Form Submissions ---

// Menu form submission
if (menuForm) {
    menuForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(menuForm);
        const data = {
            name: formData.get('name'),
            price: parseFloat(formData.get('price')),
            details: formData.get('details'),
            image: formData.get('image') || undefined,
        };

        if (!data.name || isNaN(data.price)) {
            displayMessage(menuMessage, 'Item Name and a valid Price are required.', true);
            return;
        }

        postData('menu/add', data, menuMessage, menuForm);
    });
}


// Event form submission
if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(eventForm);
        const data = {
            name: formData.get('name'),
            location: formData.get('location'), 
            date: formData.get('date'),
            time: formData.get('time'),
            details: formData.get('details') || undefined,
            image: formData.get('image') || undefined,
        };

        if (!data.name || !data.location || !data.date || !data.time) {
            displayMessage(eventMessage, 'Event Name, Location, Date, and Time are required.', true);
            return;
        }

        postData('events/add', data, eventMessage, eventForm);
    });
}