document.addEventListener("DOMContentLoaded", async () => {
    const bookPopup = document.getElementById('book-popup');
    const closeButton = document.querySelector('.popup-close-btn');
    const addTBRButton = document.getElementById('add-to-tbr');
    const clearTBRButton = document.getElementById('clear-tbr-btn');
    const shelves = document.querySelectorAll('.shelf');
    
    // Popup content elements
    const popupCover = document.getElementById('popup-cover-image');
    const popupTitle = document.getElementById('popup-title');
    const popupAuthor = document.getElementById('popup-author');
    const popupRating = document.getElementById('popup-rating');
    const popupSummary = document.getElementById('popup-summary-text');

    // Constants
    const BOOKS_PER_SHELF = 12;
    const colors = ['#743014', '#84592B', '#9d9167', '#e8d1a7', '#D2B48C'];

// Function to create a book element
function createBookElement(bookData) {
    const book = document.createElement('div');
    book.className = 'book';
    
    // Generate random height between 85px and 110px
    const height = Math.floor(Math.random() * (110 - 85 + 1)) + 85;
    book.style.height = `${height}px`;
    
    // Generate random width between 35px and 45px
    const width = Math.floor(Math.random() * (45 - 35 + 1)) + 35;
    book.style.width = `${width}px`;
    
    // Add a slight random rotation for more natural look
    const rotation = (Math.random() - 0.5) * 2; // Random value between -1 and 1
    book.style.transform = `rotate(${rotation}deg)`;
    
    book.style.backgroundColor = bookData.color;
    
    // Create and add title label
    const label = document.createElement('div');
    label.className = 'book-label';
    label.textContent = bookData.title.substring(0, 10) + (bookData.title.length > 10 ? '...' : '');
    book.appendChild(label);
    
    return book;
}
    
    // Function to add book to shelf
    function addBookToShelf(bookData) {
        for (let shelf of shelves) {
            if (shelf.children.length < BOOKS_PER_SHELF) {
                const book = createBookElement(bookData);
                shelf.appendChild(book);
                return true;
            }
        }
        return false;
    }
    
    // Function to clear all shelves
    function clearShelves() {
        shelves.forEach(shelf => {
            while (shelf.firstChild) {
                shelf.removeChild(shelf.firstChild);
            }
        });
        localStorage.removeItem('tbrShelf');
    }
    
    // Load existing books from localStorage
    function loadExistingBooks() {
        const tbrShelf = JSON.parse(localStorage.getItem('tbrShelf')) || [];
        tbrShelf.forEach(bookData => addBookToShelf(bookData));
    }

    // Add event listeners
    closeButton.addEventListener('click', () => {
        bookPopup.classList.add('hidden');
    });

    window.addEventListener('click', (event) => {
        if (event.target === bookPopup) {
            bookPopup.classList.add('hidden');
        }
    });

    clearTBRButton.addEventListener('click', clearShelves);

    // Selected book variable
    let selectedBook = null;

    function showPopup(book) {
        selectedBook = book;
        popupCover.src = book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/100';
        popupTitle.textContent = book.volumeInfo.title || 'No Title Available';
        popupAuthor.textContent = book.volumeInfo.authors?.join(', ') || 'Author Unavailable';
        popupRating.textContent = `Rating: ${book.volumeInfo.averageRating || 'N/A'}`;
        popupSummary.textContent = book.volumeInfo.description || 'No Summary Available';
        bookPopup.classList.remove('hidden');
    }

    // Modified Add to TBR functionality
    addTBRButton.addEventListener('click', () => {
        if (!selectedBook) return;
        
        const tbrShelf = JSON.parse(localStorage.getItem('tbrShelf')) || [];
        
        // Check if there's space on any shelf
        if (tbrShelf.length >= BOOKS_PER_SHELF * shelves.length) {
            alert('Your bookshelves are full! Please clear some space first.');
            return;
        }

        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const bookData = {
            cover: popupCover.src,
            title: popupTitle.textContent,
            author: popupAuthor.textContent,
            rating: popupRating.textContent,
            summary: popupSummary.textContent,
            color: randomColor
        };
        
        // Add book to shelf and storage
        if (addBookToShelf(bookData)) {
            tbrShelf.push(bookData);
            localStorage.setItem('tbrShelf', JSON.stringify(tbrShelf));
            bookPopup.classList.add('hidden');
        }
    });

    // Fetch books function
    async function fetchBooks() {
        try {
            const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=subject');
            const data = await response.json();
            return data.items;
        } catch (error) {
            console.error('Error fetching books:', error);
            return [];
        }
    }

    // Group books by category
    function groupByCategory(books) {
        const categories = {};
        books.forEach(book => {
            const category = book.volumeInfo.categories ? book.volumeInfo.categories[0] : 'Uncategorized';
            if (!categories[category]) { categories[category] = []; }
            categories[category].push(book);
        });
        return categories;
    }

    // Display books function
    function displayBooks(categories) {
        const container = document.getElementById('book-container');
        if (!container) {
            console.error("Book container element not found!");
            return;
        }
        container.innerHTML = '';
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
                bookItem.addEventListener('click', () => showPopup(book));
                bookGrid.appendChild(bookItem);
            });
            categoryDiv.appendChild(bookGrid);
            container.appendChild(categoryDiv);
        });
    }

    // Initialize the page
    loadExistingBooks(); // Load existing books on the shelf
    const books = await fetchBooks();
    if (books && books.length > 0) {
        const groupedBooks = groupByCategory(books);
        displayBooks(groupedBooks);
    } else {
        console.error("No books found!");
    }
});