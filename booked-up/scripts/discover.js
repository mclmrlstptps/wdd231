// Group books by category
function groupByCategory(books) {
    const categories = {};
    books.forEach(book => {
        const category = book.volumeInfo.categories ? book.volumeInfo.categories[0] : 'Uncategorized';
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
        const categoryDiv = document.createElement('div');
        const title = document.createElement('h2');
        title.className = 'category-title';
        title.textContent = category;
        categoryDiv.appendChild(title);

        const bookGrid = document.createElement('div');
        bookGrid.className = 'book-grid';

        categories[category].forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';

            const img = document.createElement('img');
            img.src = book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/100';
            img.alt = book.volumeInfo.title || 'No Title Available';
            bookItem.appendChild(img);

            const bookTitle = document.createElement('p');
            bookTitle.className = 'book-title';
            bookTitle.textContent = book.volumeInfo.title || 'No Title Available';
            bookItem.appendChild(bookTitle);

            bookItem.addEventListener('click', () => showPopup(book));  // Attach pop-up event
            bookGrid.appendChild(bookItem);
        });

        categoryDiv.appendChild(bookGrid);
        container.appendChild(categoryDiv);
    });
}

// Fetch books using Google Books API
async function fetchBooks() {
    const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=subject');
    const data = await response.json();
    return data.items;
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

// Call main after DOM content is fully loaded
document.addEventListener("DOMContentLoaded", main);

// Pop-up script variables and functions
const popup = document.getElementById('book-popup');
const popupCover = document.getElementById('popup-cover-image');
const popupTitle = document.getElementById('popup-title');
const popupAuthor = document.getElementById('popup-author');
const popupRating = document.getElementById('popup-rating');
const popupSummary = document.getElementById('popup-summary-text');
const popupClose = document.querySelector('.popup-close');
const addTBRButton = document.getElementById('add-tbr-button');

// Global variable for selected book
let selectedBook = null;

function showPopup(book) {
    selectedBook = book;
    popupCover.src = book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/100';
    popupTitle.textContent = book.volumeInfo.title || 'No Title Available';
    popupAuthor.textContent = book.volumeInfo.authors?.join(', ') || 'Author Unavailable';
    popupRating.textContent = `Rating: ${book.volumeInfo.averageRating || 'N/A'}`;
    popupSummary.textContent = book.volumeInfo.description || 'No Summary Available';

    popup.classList.remove('hidden');
}

// Close pop-up on click of the "x" button
popupClose.addEventListener('click', () => {
    popup.classList.add('hidden');
});

// Add to TBR functionality
const colors = ['#743014', '#84592B', '#9d9167', '#e8d1a7', '#D2B48C'];
addTBRButton.addEventListener('click', () => {
    if (!selectedBook) return;

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const bookData = {
        cover: popupCover.src,
        title: popupTitle.textContent,
        author: popupAuthor.textContent,
        rating: popupRating.textContent,
        summary: popupSummary.textContent,
        color: randomColor
    };

    const tbrShelf = JSON.parse(localStorage.getItem('tbrShelf')) || [];
    tbrShelf.push(bookData);
    localStorage.setItem('tbrShelf', JSON.stringify(tbrShelf));
    alert(`${bookData.title} has been added to your TBR shelf!`);

    popup.classList.add('hidden');
});
