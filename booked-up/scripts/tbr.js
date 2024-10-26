document.addEventListener("DOMContentLoaded", () => {
    const shelves = document.querySelectorAll('.large-shelf');
    const BOOKS_PER_SHELF = 20;
    
    // Updated color palette
    const colors = [
        '#e8d1a7', // cream
        '#9d9167', // olive
        '#84592B', // medium brown
        '#743014', // dark brown
        '#8B4513', // saddle brown
        '#D2B48C', // tan
    ];

    // Define height ranges as percentages of shelf height
    const heightRanges = [
        { min: 60, max: 70 },   // Short books
        { min: 70, max: 80 },   // Medium books
        { min: 80, max: 90 },   // Tall books
        { min: 85, max: 95 },   // Extra tall books
    ];

    // Create popup elements - moved outside function to be accessible globally
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
                    <div class="popup-buttons">
                        <button id="remove-from-tbr" class="remove-btn">Remove from TBR</button>
                    </div>
                </div>
                <button class="popup-close-btn">×</button>
            </div>
        </div>
    `;

       // Get additional button
       const markAsReadButton = document.getElementById('mark-as-read');

       // Function to mark book as read
       function markAsRead(index) {
           const tbrShelf = JSON.parse(localStorage.getItem('tbrShelf')) || [];
           if (index >= 0 && index < tbrShelf.length) {
               const book = tbrShelf[index];
               
               // Get or initialize read books array
               const readBooks = JSON.parse(localStorage.getItem('readBooks')) || [];
               
               // Add book to read books
               readBooks.push({
                   ...book,
                   dateRead: new Date().toISOString(),
                   readFromTBR: true
               });
               
               // Update localStorage
               localStorage.setItem('readBooks', JSON.stringify(readBooks));
               
               // Remove from TBR
               tbrShelf.splice(index, 1);
               localStorage.setItem('tbrShelf', JSON.stringify(tbrShelf));
               
               // Update display
               displayBooks();
               bookPopup.classList.add('hidden');
               
               // Show confirmation
               alert(`"${book.title}" has been marked as read and moved to your Read Books collection!`);
           }
       }
   
       // Add event listener for mark as read button
       if (markAsReadButton) {
           markAsReadButton.addEventListener('click', (e) => {
               e.stopPropagation();
               const index = parseInt(removeButton.dataset.bookIndex);
               markAsRead(index);
           });
       }
    
    // Add popup to document if it doesn't exist
    if (!document.getElementById('tbr-book-popup')) {
        document.body.insertAdjacentHTML('beforeend', popupHTML);
    }

    // Get popup elements
    const bookPopup = document.getElementById('tbr-book-popup');
    const closeButton = bookPopup.querySelector('.popup-close-btn');
    const removeButton = document.getElementById('remove-from-tbr');
    const popupCover = document.getElementById('popup-cover-image');
    const popupTitle = document.getElementById('popup-title');
    const popupAuthor = document.getElementById('popup-author');
    const popupRating = document.getElementById('popup-rating');
    const popupSummary = document.getElementById('popup-summary-text');

    // Function to show popup
    function showPopup(bookData, index) {
        if (!bookPopup) return;
        
        popupCover.src = bookData.cover || 'https://via.placeholder.com/150';
        popupTitle.textContent = bookData.title || 'Title Not Available';
        popupAuthor.textContent = bookData.author || 'Author Not Available';
        popupRating.textContent = bookData.rating || 'Rating Not Available';
        popupSummary.textContent = bookData.summary || 'No Summary Available';
        
        // Store the index for removal
        removeButton.dataset.bookIndex = index;
        
        // Show popup
        bookPopup.classList.remove('hidden');

        // Log for debugging
        console.log('Showing popup for book:', bookData);
    }

    // Function to create a book element
    function createBookElement(bookData, index) {
        const book = document.createElement('div');
        book.className = 'book';
        
        // Randomly select a height range and calculate height as percentage
        const heightRange = heightRanges[Math.floor(Math.random() * heightRanges.length)];
        const height = Math.floor(Math.random() * (heightRange.max - heightRange.min + 1)) + heightRange.min;
        book.style.height = `${height}%`;
        
        // Generate random width between 35px and 55px
        const width = Math.floor(Math.random() * (55 - 35 + 1)) + 35;
        book.style.width = `${width}px`;
        
        // Add a slight random rotation
        const rotation = (Math.random() - 0.5) * 1.5;
        book.style.transform = `rotate(${rotation}deg)`;
        
        book.style.backgroundColor = bookData.color;
        
        // Create title label
        const label = document.createElement('div');
        label.className = 'book-label';
        label.textContent = bookData.title.substring(0, 10) + (bookData.title.length > 10 ? '...' : '');
        book.appendChild(label);

        // Add click event to show popup
        book.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            showPopup(bookData, index);
        });
        
        return book;
    }

    // Function to remove book from TBR
    function removeBook(index) {
        const tbrShelf = JSON.parse(localStorage.getItem('tbrShelf')) || [];
        if (index >= 0 && index < tbrShelf.length) {
            tbrShelf.splice(index, 1);
            localStorage.setItem('tbrShelf', JSON.stringify(tbrShelf));
            displayBooks();
            bookPopup.classList.add('hidden');
        }
    }

    // Function to display books
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

    // Event Listeners
    if (closeButton) {
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            bookPopup.classList.add('hidden');
        });
    }

    if (removeButton) {
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(removeButton.dataset.bookIndex);
            removeBook(index);
        });
    }

    // Close popup when clicking outside
    document.addEventListener('click', (event) => {
        if (bookPopup && !bookPopup.contains(event.target)) {
            bookPopup.classList.add('hidden');
        }
    });

    // Initialize the display
    displayBooks();
});