document.addEventListener("DOMContentLoaded", () => {
    const reviewsContainer = document.getElementById('reviews-container');
    const reviewPopup = document.getElementById('review-popup');
    const reviewForm = document.getElementById('review-form');
    const stars = document.querySelectorAll('.star-rating-input .star');
    const closeButton = document.querySelector('.popup-close-btn');
    let currentBook = null;

    // Ensure popup is hidden initially
    reviewPopup.classList.add('hidden');

    // Star rating input functionality
    stars.forEach(star => {
        star.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent popup from closing
            const rating = star.dataset.rating;
            updateStars(rating);
        });
    });

    function updateStars(rating) {
        stars.forEach(star => {
            const starRating = star.dataset.rating;
            star.classList.toggle('active', starRating <= rating);
        });
    }

    // Function to create star rating HTML for display
    function createStarRating(rating) {
        const starCount = 5;
        let stars = '';
        for (let i = 1; i <= starCount; i++) {
            if (i <= rating) {
                stars += '<span class="star filled">★</span>';
            } else {
                stars += '<span class="star empty">★</span>';
            }
        }
        return stars;
    }

    // Function to create a book card
    function createBookCard(book) {
        const card = document.createElement('div');
        card.className = 'book-card';
        
        const favoriteClass = book.isFavorite ? 'favorited' : '';

        card.innerHTML = `
            <img class="book-cover" src="${book.cover}" alt="${book.title} cover">
            <span class="favorite-indicator ${favoriteClass}">♥</span>
            <h2 class="book-title">${book.title}</h2>
            <div class="star-rating">
                ${createStarRating(book.rating || 0)}
            </div>
            <div class="review-status">
                ${book.startDate ? `Read from ${new Date(book.startDate).toLocaleDateString()} 
                                  to ${new Date(book.endDate).toLocaleDateString()}` 
                               : `Read on: ${new Date(book.dateRead).toLocaleDateString()}`}
            </div>
            ${book.review ? `<div class="review-preview">${book.review.substring(0, 100)}${book.review.length > 100 ? '...' : ''}</div>` : ''}
        `;

        card.addEventListener('click', () => showReviewDialog(book));

        return card;
    }

    // Function to show review dialog
    function showReviewDialog(book) {
        currentBook = book;
        
        // Populate form with existing data
        document.getElementById('start-date').value = book.startDate || '';
        document.getElementById('end-date').value = book.endDate || '';
        document.getElementById('review-text').value = book.review || '';
        document.getElementById('favorite-checkbox').checked = book.isFavorite || false;
        updateStars(book.rating || 0);

        reviewPopup.classList.remove('hidden');
    }

    // Handle form submission
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const readBooks = JSON.parse(localStorage.getItem('readBooks')) || [];
        const bookIndex = readBooks.findIndex(book => 
            book.title === currentBook.title && 
            book.author === currentBook.author
        );

        // Gather all the review data
        const reviewData = {
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value,
            rating: document.querySelectorAll('.star-rating-input .star.active').length,
            review: document.getElementById('review-text').value,
            isFavorite: document.getElementById('favorite-checkbox').checked
        };

        if (bookIndex !== -1) {
            // Update existing book
            readBooks[bookIndex] = {
                ...currentBook,
                ...reviewData,
                lastUpdated: new Date().toISOString()
            };
        } else {
            // Add new book review
            readBooks.push({
                ...currentBook,
                ...reviewData,
                dateRead: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            });
        }

        // Save to localStorage
        localStorage.setItem('readBooks', JSON.stringify(readBooks));
        
        // Update display
        displayReadBooks();
        reviewPopup.classList.add('hidden');

        // Show confirmation
        alert('Review saved successfully!');
    });

    // Function to display all read books
    function displayReadBooks() {
        const readBooks = JSON.parse(localStorage.getItem('readBooks')) || [];
        
        if (readBooks.length === 0) {
            reviewsContainer.innerHTML = '<p class="no-reviews">No books reviewed yet.</p>';
            return;
        }

        // Sort books by date read (most recent first)
        readBooks.sort((a, b) => {
            const dateA = new Date(b.lastUpdated || b.dateRead);
            const dateB = new Date(a.lastUpdated || a.dateRead);
            return dateA - dateB;
        });

        // Clear container
        reviewsContainer.innerHTML = '';

        // Add each book card
        readBooks.forEach(book => {
            const card = createBookCard(book);
            reviewsContainer.appendChild(card);
        });
    }

    function markAsRead(index) {
        const tbrShelf = JSON.parse(localStorage.getItem('tbrShelf')) || [];
        if (index >= 0 && index < tbrShelf.length) {
            const book = tbrShelf[index];
            
            // Get existing read books array
            const readBooks = JSON.parse(localStorage.getItem('readBooks')) || [];
            
            // Add book to read books with additional data
            readBooks.push({
                ...book,                         // Keep all original book data
                dateRead: new Date().toISOString(),
                readFromTBR: true,
                rating: 0,                       // Initial rating
                review: '',                      // Empty review to start
                isFavorite: false,              // Initial favorite status
                startDate: null,                // Reading start date
                endDate: new Date().toISOString() // Completion date
            });
            
            // Update localStorage
            localStorage.setItem('readBooks', JSON.stringify(readBooks));
            
            // Remove from TBR
            tbrShelf.splice(index, 1);
            localStorage.setItem('tbrShelf', JSON.stringify(tbrShelf));
            
            // Update display
            displayBooks();
            bookPopup.classList.add('hidden');
        }
    }

    // Prevent popup from closing when clicking form content
    const popupContent = document.querySelector('.review-form-content');
    popupContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Close popup handlers
    reviewPopup.addEventListener('click', (e) => {
        if (e.target === reviewPopup) {
            reviewPopup.classList.add('hidden');
        }
    });

    closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        reviewPopup.classList.add('hidden');
    });

    // Close popup with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            reviewPopup.classList.add('hidden');
        }
    });

    // Initialize the page
    displayReadBooks();
});