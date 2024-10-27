document.addEventListener('DOMContentLoaded', () => {
    const carouselTrack = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const readBooksContainer = document.getElementById('read-books-container');
    const totalBooksElement = document.getElementById('total-books');
    
    let currentIndex = 0;

    function loadTBRBooks() {
        const tbrBooks = JSON.parse(localStorage.getItem('tbrShelf')) || [];
        carouselTrack.innerHTML = '';

        // Function to get book at index with wraparound
        const getBook = (index) => {
            const normalizedIndex = ((index % tbrBooks.length) + tbrBooks.length) % tbrBooks.length;
            return tbrBooks[normalizedIndex];
        };

        // Create 5 carousel items
        for (let i = -2; i <= 2; i++) {
            const book = getBook(currentIndex + i);
            const div = document.createElement('div');
            div.className = 'carousel-item';
            div.setAttribute('data-position', i);
            
            div.innerHTML = `
                <div class="book-container">
                    <img src="${book.cover}" alt="${book.title}">
                </div>
                <div class="book-title">${book.title}</div>
            `;
            
            carouselTrack.appendChild(div);
        }
    }

    function updateCarousel() {
        const items = document.querySelectorAll('.carousel-item');
        const tbrBooks = JSON.parse(localStorage.getItem('tbrShelf')) || [];

        items.forEach((item, index) => {
            const position = index - 2; // Convert index to position (-2 to 2)
            const bookIndex = ((currentIndex + position) % tbrBooks.length + tbrBooks.length) % tbrBooks.length;
            const book = tbrBooks[bookIndex];

            // Update content
            const bookContainer = item.querySelector('.book-container');
            const img = item.querySelector('img');
            const titleDiv = item.querySelector('.book-title');

            img.src = book.cover;
            img.alt = book.title;
            titleDiv.textContent = book.title;
            
            // Update position attribute
            item.setAttribute('data-position', position);
        });
    }

    // Navigation handlers
    prevButton.addEventListener('click', () => {
        const tbrBooks = JSON.parse(localStorage.getItem('tbrShelf')) || [];
        currentIndex = ((currentIndex - 1) % tbrBooks.length + tbrBooks.length) % tbrBooks.length;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        const tbrBooks = JSON.parse(localStorage.getItem('tbrShelf')) || [];
        currentIndex = (currentIndex + 1) % tbrBooks.length;
        updateCarousel();
    });

    // Initialize carousel
    loadTBRBooks();

    // Load read books
    function loadReadBooks() {
        const readBooks = JSON.parse(localStorage.getItem('readBooks')) || [];
        readBooksContainer.innerHTML = '';
        
        readBooks.forEach(book => {
            const div = document.createElement('div');
            div.className = 'read-book-item';
            
            div.innerHTML = `
                <img src="${book.cover}" alt="${book.title}">
            `;
            
            readBooksContainer.appendChild(div);
        });

        // Update stats
        totalBooksElement.textContent = readBooks.length;
    }

    // Initialize
    loadTBRBooks();
    loadReadBooks();
});