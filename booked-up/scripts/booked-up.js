// Fetch books using Google Books API (or another API you're using)
async function fetchBooks() {
    const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=subject');
    const data = await response.json();
    return data.items;
}

// Function to group books by category
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
            img.src = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'placeholder-image-url.png';
            bookItem.appendChild(img);

            const title = document.createElement('p');
            title.textContent = book.volumeInfo.title;
            bookItem.appendChild(title);

            bookGrid.appendChild(bookItem);
        });

        categoryDiv.appendChild(bookGrid);
        container.appendChild(categoryDiv);
    });
}

// Main function
async function main() {
    const books = await fetchBooks();
    const groupedBooks = groupByCategory(books);
    displayBooks(groupedBooks);
}

// Call the main function to run the script
main();