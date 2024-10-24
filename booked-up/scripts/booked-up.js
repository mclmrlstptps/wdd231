// Variables to keep track of the currently selected book and TBR shelf
let currentBook = null;
let tbrShelf = []; // Array to store the TBR shelf books

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
        categories[category].forEach((book, index) => {
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
            const title = document.createElement('p');
            title.textContent = (book.volumeInfo && book.volumeInfo.title) 
                                ? book.volumeInfo.title 
                                : 'No Title Available';
            bookItem.appendChild(title);

            // Add a data attribute for identifying the book
            bookItem.setAttribute('data-title', title.textContent);
            bookItem.setAttribute('data-author', (book.volumeInfo.authors && book.volumeInfo.authors.length > 0) ? book.volumeInfo.authors[0] : 'Unknown Author');
            bookItem.setAttribute('data-cover', img.src);

            // Add a click event listener to each book item for the popup
            bookItem.addEventListener('click', () => {
                showPopup({
                    cover: img.src,
                    title: title.textContent,
                    author: (book.volumeInfo.authors && book.volumeInfo.authors.length > 0) ? book.volumeInfo.authors[0] : 'Unknown Author',
                    rating: book.volumeInfo.averageRating ? book.volumeInfo.averageRating : 'N/A',
                    summary: book.volumeInfo.description ? book.volumeInfo.description : 'No Summary Available',
                });
            });

            bookGrid.appendChild(bookItem);
        });

        categoryDiv.appendChild(bookGrid);
        container.appendChild(categoryDiv);
    });
}

// Function to show the pop-up card
function showPopup(book) {
    currentBook = book; // Store the current book information
    const popup = document.getElementById('book-popup');
    const popupCover = document.getElementById('popup-cover-image');
    const popupTitle = document.getElementById('popup-title');
    const popupAuthor = document.getElementById('popup-author');
    const popupRating = document.getElementById('popup-rating');
    const popupSummary = document.getElementById('popup-summary-text');
    const popupClose = document.querySelector('.popup-close');

    popupCover.src = book.cover; // Assuming `cover` is the URL of the book's image
    popupTitle.textContent = book.title;
    popupAuthor.textContent = book.author;
    popupRating.textContent = `Rating: ${book.rating}`;
    popupSummary.textContent = book.summary;

    popup.classList.remove('hidden'); // Show the pop-up

    // Close pop-up when the "x" is clicked
    popupClose.onclick = () => {
        hidePopup(); // Use the new function to hide the pop-up
    };
}

// Function to hide the pop-up card
function hidePopup() {
    const popup = document.getElementById('book-popup');
    popup.classList.add('hidden'); // Hide the pop-up
}

// Event listener for the button to add to TBR shelf
document.getElementById('add-to-tbr').addEventListener('click', function() {
    if (currentBook) {
        addToTbrShelf(currentBook); // Use the current book stored in the variable
        hidePopup(); // Automatically close the pop-up after adding to TBR
    } else {
        alert("Please select a book to add to your TBR shelf.");
    }
});

// Function to add a book to the TBR shelf
function addToTbrShelf(book) {
    if (!tbrShelf.some(b => b.title === book.title)) { // Prevent duplicates
        tbrShelf.push(book);
        alert(`${book.title} has been added to your TBR shelf!`);
        
        // Get all book items and find the corresponding one
        const bookItems = document.querySelectorAll('.book-item');
        bookItems.forEach((bookItem, index) => {
            if (bookItem.getAttribute('data-title') === book.title) {
                const randomColor = getRandomColor(); // Get a random color
                const bookRectangle = document.querySelector(`.shelf .book:nth-child(${index + 1})`); // Select the specific book rectangle based on index
                if (bookRectangle) {
                    bookRectangle.style.backgroundColor = randomColor; // Change the color of the book rectangle
                    console.log(`Changed color of the rectangle for ${book.title} to ${randomColor}`); // Debugging log
                }
            }
        });
    } else {
        alert(`${book.title} is already in your TBR shelf.`);
    }
}



// Function to get a random color from the defined palette
function getRandomColor() {
    const colors = ['#743014', '#84592B', '#9d9167', '#e8d1a7', '#D2B48C'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Event listener for the button to add to TBR shelf
document.getElementById('add-to-tbr').addEventListener('click', function() {
    if (currentBook) {
        addToTbrShelf(currentBook); // Use the current book stored in the variable
    } else {
        alert("Please select a book to add to your TBR shelf.");
    }
});

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

    return data.items || []; // Return an empty array if items are undefined
}

// Call main after DOM content is fully loaded
document.addEventListener("DOMContentLoaded", main);

// Bookshelf JS
function createBooks() {
    const shelves = document.querySelectorAll('.shelf');
    
    shelves.forEach(shelf => {
        const numberOfBooks = Math.floor(Math.random() * 5) + 6;
        
        for (let i = 0; i < numberOfBooks; i++) {
            const book = document.createElement('div');
            book.className = 'book';
            book.setAttribute('data-title', `Book ${i + 1}`); // Add data-title attribute for identification
            
            const height = Math.floor(Math.random() * 20) + 80;
            book.style.height = `${height}%`;
            
            const shelfBackgroundColor = getComputedStyle(shelf).backgroundColor; // Get the background color of the shelf
            book.style.backgroundColor = shelfBackgroundColor; // Set the initial color of the book to match the shelf
            
            shelf.appendChild(book);
        }
    });
}

// Initialize the bookshelf when the page loads
document.addEventListener('DOMContentLoaded', createBooks);