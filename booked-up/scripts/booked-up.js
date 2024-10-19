// HTML elements
const bookAuthor = document.querySelector('#author');
const bookTitle = document.querySelector('#title');
const bookGenre = document.querySelector('#genre');
const bookRating = document.querySelector('#rating');
const bookSummary = document.querySelector('#summary');
const bookCover = document.querySelector('#bookCover');

// API key
const API_KEY = "AIzaSyAKFL8GpVr2tH4rB4jx3kt5fImuOwX0qO0";

// Function to fetch book data
async function apiFetch() {
    const searchTerm = 'harry potter'; // Default search term for testing
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${'AIzaSyAKFL8GpVr2tH4rB4jx3kt5fImuOwX0qO0'}`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log('API Response:', data);
            displayResults(data.items[0]); // Display first book for testing
        } else {
            throw new Error('API response was not ok');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        bookTitle.textContent = 'Error loading book data';
    }
}

function displayResults(bookData) {
    if (!bookData || !bookData.volumeInfo) {
        console.error('Invalid book data');
        return;
    }

    const volumeInfo = bookData.volumeInfo;

    // Update DOM elements with book data
    bookTitle.textContent = volumeInfo.title || 'Title not available';
    bookAuthor.textContent = volumeInfo.authors ? 
        `By: ${volumeInfo.authors.join(', ')}` : 'Author unknown';
    bookGenre.textContent = volumeInfo.categories ? 
        `Genre: ${volumeInfo.categories[0]}` : 'Genre not available';
    bookRating.textContent = volumeInfo.averageRating ? 
        `Rating: ${volumeInfo.averageRating}/5` : 'Rating not available';
    bookSummary.textContent = volumeInfo.description || 'No description available';

    // Set book cover image
    if (volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail) {
        bookCover.src = volumeInfo.imageLinks.thumbnail;
        bookCover.alt = `Cover of ${volumeInfo.title}`;
    } else {
        bookCover.src = './images/default-cover.jpg'; // Update this path to your default image
        bookCover.alt = 'Book cover not available';
    }
}

// Call the API when the page loads
document.addEventListener('DOMContentLoaded', apiFetch);

// Add current year to footer
document.querySelector('#current-year').textContent = new Date().getFullYear();

// Add last modified date to footer
document.querySelector('#last-modified').textContent = `Last Modified: ${document.lastModified}`;








document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.querySelector('.search-box');
    const searchItems = document.querySelectorAll('.search-item');

    // Add debounce function to improve performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Function to filter items
    const filterItems = (searchTerm) => {
        searchTerm = searchTerm.toLowerCase();
        
        searchItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    };

    // Add event listener with debounce
    searchBox.addEventListener('input', debounce((e) => {
        filterItems(e.target.value);
    }, 300));

    // Add keyboard navigation
    searchBox.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchBox.value = '';
            filterItems('');
        }
    });
});