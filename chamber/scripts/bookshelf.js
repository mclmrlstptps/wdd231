
const colors = [
    '#743014',
    '#84592B',
    '#9d9167',
    '#e8d1a7', 
    '#D2B48C', 

];

function createBooks() {
    const shelves = document.querySelectorAll('.shelf');
    
    shelves.forEach(shelf => {
        // Generate random number of books per shelf (6-10 books)
        const numberOfBooks = Math.floor(Math.random() * 5) + 6;
        
        for (let i = 0; i < numberOfBooks; i++) {
            const book = document.createElement('div');
            book.className = 'book';
            
            // Random height for each book (80-100% of shelf height)
            const height = Math.floor(Math.random() * 20) + 80;
            book.style.height = `${height}%`;
            
            // Random color from our palette
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            book.style.setProperty('--book-color', randomColor);
            
            shelf.appendChild(book);
        }
    });
}

// Initialize the bookshelf when the page loads
document.addEventListener('DOMContentLoaded', createBooks);
