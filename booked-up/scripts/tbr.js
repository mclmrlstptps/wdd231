// Updated color palette to match the image
const colors = [
    '#e8d1a7', // cream
    '#9d9167', // olive
    '#84592B', // medium brown
    '#743014', // dark brown
    '#8B4513', // saddle brown
    '#D2B48C', // tan
];

function createBooks() {
    const shelves = document.querySelectorAll('.shelf');
    
    shelves.forEach(shelf => {
        // Generate random number of books per shelf (5-8 books)
        const numberOfBooks = Math.floor(Math.random() * 4) + 5;
        
        for (let i = 0; i < numberOfBooks; i++) {
            const book = document.createElement('div');
            book.className = 'book';
            
            // Random height for each book (70-90% of shelf height)
            const height = Math.floor(Math.random() * 20) + 70;
            book.style.height = `${height}%`;
            
            // Random width for each book (40-70px)
            const width = Math.floor(Math.random() * 30) + 40;
            book.style.width = `${width}px`;
            
            // Random color from our palette
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            book.style.setProperty('--book-color', randomColor);
            
            // Add slight random rotation
            const rotation = (Math.random() - 0.5) * 2;
            book.style.transform = `rotate(${rotation}deg)`;
            
            shelf.appendChild(book);
        }
    });
}

// Initialize the bookshelf when the page loads
document.addEventListener('DOMContentLoaded', () => {
    createBooks();
    
    // Update copyright year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const shelves = document.querySelectorAll('.large-shelf');
    const BOOKS_PER_SHELF = 30;
    const colors = ['#743014', '#84592B', '#9d9167', '#e8d1a7', '#D2B48C'];

    // Create popup elements
    const popupHTML = `
        <div id="tbr-book-popup" class="hidden">
            <div class="popup-content">
                <div class="popup-cover">
                    <img id="popup-cover-image" alt="Book cover">
                </div>
                <div class="popup-info">
                    <h3 id="popup-title"></h3>
                    <p id="popup-author"></p>
                    <p id="popup-rating"></p>
                    <div id="popup-summary-text" class="popup-summary"></div>
                    <button id="remove-from-tbr">Remove from TBR</button>
                </div>
            </div>
            <button class="popup-close-btn">X</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // Get popup elements
    const bookPopup = document.getElementById('tbr-book-popup');
    const closeButton = document.querySelector('.popup-close-btn');
    const removeButton = document.getElementById('remove-from-tbr');
    const popupCover = document.getElementById('popup-cover-image');
    const popupTitle = document.getElementById('popup-title');
    const popupAuthor = document.getElementById('popup-author');
    const popupRating = document.getElementById('popup-rating');
    const popupSummary = document.getElementById('popup-summary-text');

    // Function to create a book element
    function createBookElement(bookData, index) {
        const book = document.createElement('div');
        book.className = 'book';
        
        // Generate random height between 85px and 110px
        const height = Math.floor(Math.random() * (110 - 85 + 1)) + 85;
        book.style.height = `${height}px`;
        
        // Generate random width between 35px and 45px
        const width = Math.floor(Math.random() * (45 - 35 + 1)) + 35;
        book.style.width = `${width}px`;
        
        // Add a slight random rotation
        const rotation = (Math.random() - 0.5) * 2;
        book.style.transform = `rotate(${rotation}deg)`;
        
        book.style.backgroundColor = bookData.color;
        
        // Create title label
        const label = document.createElement('div');
        label.className = 'book-label';
        label.textContent = bookData.title.substring(0, 10) + (bookData.title.length > 10 ? '...' : '');
        book.appendChild(label);

        // Add click event to show popup
        book.addEventListener('click', () => showPopup(bookData, index));
        
        return book;
    }

    // Function to show popup
    function showPopup(bookData, index) {
        popupCover.src = bookData.cover;
        popupTitle.textContent = bookData.title;
        popupAuthor.textContent = bookData.author;
        popupRating.textContent = bookData.rating;
        popupSummary.textContent = bookData.summary;
        
        // Store the index for removal
        removeButton.dataset.bookIndex = index;
        
        bookPopup.classList.remove('hidden');
    }

    // Function to display books on shelves
    function displayBooks() {
        // Clear existing books
        shelves.forEach(shelf => shelf.innerHTML = '');
        
        // Get books from localStorage
        const tbrShelf = JSON.parse(localStorage.getItem('tbrShelf')) || [];
        
        // Distribute books across shelves
        tbrShelf.forEach((bookData, index) => {
            const shelfIndex = Math.floor(index / BOOKS_PER_SHELF);
            if (shelfIndex < shelves.length) {
                const book = createBookElement(bookData, index);
                shelves[shelfIndex].appendChild(book);
            }
        });
    }

    // Function to remove book from TBR
    function removeBook(index) {
        const tbrShelf = JSON.parse(localStorage.getItem('tbrShelf')) || [];
        tbrShelf.splice(index, 1);
        localStorage.setItem('tbrShelf', JSON.stringify(tbrShelf));
        displayBooks();
        bookPopup.classList.add('hidden');
    }

    // Event Listeners
    closeButton.addEventListener('click', () => {
        bookPopup.classList.add('hidden');
    });

    removeButton.addEventListener('click', () => {
        const index = parseInt(removeButton.dataset.bookIndex);
        removeBook(index);
    });

    // Close popup when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === bookPopup) {
            bookPopup.classList.add('hidden');
        }
    });

    // Initialize the display
    displayBooks();
});