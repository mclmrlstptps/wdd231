// Group books by category
function groupByCategory(books) {
    const categories = {};

    books.forEach(book => {
        const category = book.volumeInfo.categories 
                         ? book.volumeInfo.categories[0] 
                         : 'Uncategorized';
        
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(book);
    });

    return categories;
}

// Function to display books grouped by category
function displayBooks(categories) {
    const container = document.getElementById('book-container');
    
    if (!container) {
        console.error("Book container element not found!");
        return;
    }

    container.innerHTML = '';  // Clear any existing content

    Object.keys(categories).forEach(category => {
        // Create the category section
        const categoryDiv = document.createElement('div');
        const title = document.createElement('h2');
        title.className = 'category-title';
        title.textContent = category;
        categoryDiv.appendChild(title);

        const bookGrid = document.createElement('div');
        bookGrid.className = 'book-grid';

        // Loop over each book in the category
        categories[category].forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';

            // Handle missing images
            const img = document.createElement('img');
            img.src = (book.volumeInfo && book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) 
                      ? book.volumeInfo.imageLinks.thumbnail
                      : 'https://via.placeholder.com/100';
            img.alt = (book.volumeInfo && book.volumeInfo.title) 
                      ? book.volumeInfo.title 
                      : 'No Title Available';
            
            bookItem.appendChild(img);

            // Handle missing titles
            const bookTitle = document.createElement('p');
            bookTitle.className = 'book-title'; // Add class for easy selection later
            bookTitle.textContent = (book.volumeInfo && book.volumeInfo.title) 
                                    ? book.volumeInfo.title 
                                    : 'No Title Available';
            bookItem.appendChild(bookTitle);

            // Add click event to show the popup
            bookItem.addEventListener('click', () => showPopup(book));

            // Add the book item to the grid
            bookGrid.appendChild(bookItem);
        });

        // Append the grid to the category section
        categoryDiv.appendChild(bookGrid);
        container.appendChild(categoryDiv);
    });
}


// Main function
async function main() {
    const books = await fetchBooks();
    if (books && books.length > 0) {
        const groupedBooks = groupByCategory(books);
        displayBooks(groupedBooks);
    } else {
        console.error("No books found!");
    }
}

// Fetch books using Google Books API
async function fetchBooks() {
    const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=subject');
    const data = await response.json();
    
    // Log the response to make sure data is retrieved
    console.log(data);

    return data.items; // Adjust based on actual API response structure
}

// Call main after DOM content is fully loaded
document.addEventListener("DOMContentLoaded", main);

// Pop up script
const popup = document.getElementById('book-popup');
const popupCover = document.getElementById('popup-cover-image');
const popupTitle = document.getElementById('popup-title');
const popupAuthor = document.getElementById('popup-author');
const popupRating = document.getElementById('popup-rating');
const popupSummary = document.getElementById('popup-summary-text');
const popupClose = document.querySelector('.popup-close');

function showPopup(book) {
    console.log(book); // Debugging: Check the book object
    popupCover.src = book.cover; // Assuming book.cover contains a valid URL
    popupTitle.textContent = book.title;
    popupAuthor.textContent = book.author;
    popupRating.textContent = book.rating;
    popupSummary.textContent = book.summary;

    popup.classList.remove('hidden'); // Show the pop-up
}

// Close pop-up when the "x" is clicked
popupClose.addEventListener('click', () => {
    popup.classList.add('hidden'); // Hide the pop-up
});

// Add book to TBR shelf
const addTBRButton = document.getElementById('add-tbr-button');

addTBRButton.addEventListener('click', () => {
    const bookData = {
        cover: popupCover.src,
        title: popupTitle.textContent,
        author: popupAuthor.textContent,
        rating: popupRating.textContent,
        summary: popupSummary.textContent
    };

    // Retrieve existing TBR shelf from localStorage or initialize it
    const tbrShelf = JSON.parse(localStorage.getItem('tbrShelf')) || [];

    // Add the new book to the TBR shelf
    tbrShelf.push(bookData);

    // Save updated TBR shelf to localStorage
    localStorage.setItem('tbrShelf', JSON.stringify(tbrShelf));

    // Optionally, you can alert the user or log to the console
    alert(`${bookData.title} has been added to your TBR shelf!`);
});

const colors = [
    '#743014',
    '#84592B',
    '#9d9167',
    '#e8d1a7', 
    '#D2B48C', 
];

let selectedBook = null; // Global variable to hold the selected book

// Function to show the popup
function showPopup(book) {
    selectedBook = book; // Store the selected book
    const popup = document.querySelector('.popup');
    
    // Assuming you have elements for cover, author, title, etc. in your popup
    document.querySelector('.popup-cover img').src = book.cover; // Set the cover image
    document.querySelector('.popup-title').textContent = book.title;
    document.querySelector('.popup-author').textContent = book.author;
    document.querySelector('.popup-rating').textContent = book.rating;
    document.querySelector('.popup-summary').textContent = book.summary;

    popup.classList.remove('hidden');
}

// Event listener for the "Add to TBR" button
document.querySelector('.add-tbr-button').addEventListener('click', () => {
    // Change the color of the book on the bookshelf
    if (selectedBook) {
        const bookshelfBooks = document.querySelectorAll('.book');
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        bookshelfBooks[selectedBook.index].style.setProperty('--book-color', randomColor); // Set color to a random one

        // Close the popup
        document.querySelector('.popup').classList.add('hidden');
    }
});

// Event listener for bookshelf books to reopen the popup
document.querySelectorAll('.book').forEach((bookElement, index) => {
    bookElement.addEventListener('click', () => {
        // Fetch the book details based on the index or some identifier
        const book = {
            cover: 'url_from_api', // Replace with actual data
            title: 'Book Title',
            author: 'Author Name',
            rating: '5 stars', // Example data, replace with actual data
            summary: 'This is a summary.', // Replace with actual data
            index: index // Store the index to identify which book was clicked
        };
        
        showPopup(book);
    });
});