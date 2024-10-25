// Variables to keep track of shelves and current book
let currentBook = null;
let tbrShelf = loadShelf('tbrShelf');
let readShelf = loadShelf('readShelf');

// Load shelf from localStorage
function loadShelf(shelfName) {
    const savedShelf = localStorage.getItem(shelfName);
    return savedShelf ? JSON.parse(savedShelf) : [];
}

// Save shelf to localStorage
function saveShelf(shelfName, shelf) {
    localStorage.setItem(shelfName, JSON.stringify(shelf));
}

// Updated popup functions to match your HTML structure
function showPopup(book) {
    currentBook = book;
    const popup = document.getElementById('book-popup');
    const popupCover = document.getElementById('popup-cover-image');
    const popupTitle = document.getElementById('popup-title');
    const popupAuthor = document.getElementById('popup-author');
    const popupRating = document.getElementById('popup-rating');
    const popupSummary = document.getElementById('popup-summary-text');
    const popupClose = document.querySelector('.popup-close');
    const markAsReadBtn = document.querySelector('.mark-as-read-btn');

    popupCover.src = book.cover;
    popupTitle.textContent = book.title;
    popupAuthor.textContent = book.author;
    popupRating.textContent = `Rating: ${book.rating}`;
    popupSummary.textContent = book.summary;

    // Show the popup
    popup.classList.remove('hidden');

    // Set up event listeners
    popupClose.onclick = hidePopup;
    markAsReadBtn.onclick = handleMarkAsRead;
}

function hidePopup() {
    const popup = document.getElementById('book-popup');
    popup.classList.add('hidden');
}

// Handle marking a book as read
function handleMarkAsRead() {
    if (currentBook) {
        // Remove from TBR shelf
        tbrShelf = tbrShelf.filter(book => book.title !== currentBook.title);
        saveShelf('tbrShelf', tbrShelf);
        
        // Add to Read shelf with timestamp
        const readBook = {
            ...currentBook,
            dateRead: new Date().toISOString()
        };
        readShelf.push(readBook);
        saveShelf('readShelf', readShelf);
        
        // Update display
        updateBookshelfDisplay();
        showTbrAlert(`${currentBook.title} has been marked as read!`);
        hidePopup();
    }
}

// Function to show TBR alert (add this HTML element)
function showTbrAlert(message) {
    // Create alert element if it doesn't exist
    let alert = document.getElementById('tbr-alert');
    if (!alert) {
        alert = document.createElement('div');
        alert.id = 'tbr-alert';
        alert.className = 'alert hidden';
        document.body.appendChild(alert);
    }

    alert.textContent = message;
    alert.classList.remove('hidden');
    setTimeout(() => {
        alert.classList.add('hidden');
    }, 3000);
}

function updateBookshelfDisplay() {
    const shelves = document.querySelectorAll('.shelf');
    if (!shelves.length) return;

    // Clear existing books
    shelves.forEach(shelf => shelf.innerHTML = '');

    // Distribute TBR books across shelves
    tbrShelf.forEach((book, index) => {
        const shelfIndex = Math.floor(index / 6); // 6 books per shelf
        if (shelfIndex < shelves.length) {
            const book_element = document.createElement('div');
            book_element.className = 'book';
            book_element.style.backgroundColor = getRandomColor();
            book_element.style.height = `${Math.floor(Math.random() * 20) + 80}%`;

            // Create a span element for the title
            const titleElement = document.createElement('span');
            titleElement.className = 'book-title';
            titleElement.textContent = book.title.length > 10 ? 
                book.title.substring(0, 10) + '...' : 
                book.title;

            // Style the title
            titleElement.style.writingMode = 'vertical-rl';
            titleElement.style.textAlign = 'center';
            titleElement.style.display = 'block';
            titleElement.style.fontSize = '15px';
            titleElement.style.lineHeight = '1.2';
            titleElement.style.height = '100%';
            titleElement.style.margin = 'auto';

            book_element.appendChild(titleElement);

            // Add click event to show popup
            book_element.setAttribute('title', book.title);
            book_element.addEventListener('click', () => showPopup(book));

            shelves[shelfIndex].appendChild(book_element);
        }
    });

    // Fill remaining space with empty books
    shelves.forEach(shelf => {
        const currentBooks = shelf.children.length;
        const emptyBooksNeeded = 6 - currentBooks;

        for (let i = 0; i < emptyBooksNeeded; i++) {
            const emptyBook = document.createElement('div');
            emptyBook.className = 'book';
            emptyBook.style.height = `${Math.floor(Math.random() * 20) + 80}%`;
            emptyBook.style.backgroundColor = '#462c1e';
            shelf.appendChild(emptyBook);
        }
    });
}

// Random color function
function getRandomColor() {
    const colors = ['#743014', '#84592B', '#9d9167', '#e8d1a7', '#D2B48C'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize bookshelf display
    updateBookshelfDisplay();

    // Add popup close functionality
    const popupClose = document.querySelector('.popup-close');
    if (popupClose) {
        popupClose.addEventListener('click', hidePopup);
    }

    // Handle mark as read button clicks
    const markAsReadBtn = document.querySelector('.mark-as-read-btn');
    if (markAsReadBtn) {
        markAsReadBtn.addEventListener('click', handleMarkAsRead);
    }
});