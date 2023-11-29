const readBooks = [];
const unreadBooks = [];

function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const isRead = document.getElementById('isRead').checked;
    const coverUrl = document.getElementById('coverURL').value;

    const newBook = {
        title,
        author,
        year,
        isRead,
        coverUrl
    };

    if (isRead) {
        readBooks.push(newBook);
    } else {
        unreadBooks.push(newBook);
    }

    renderBookshelf();
    clearForm();
}

function renderBookshelf() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const readBookshelf = document.getElementById('readBooks');
    const unreadBookshelf = document.getElementById('unreadBooks');

    readBookshelf.innerHTML = '';
    unreadBookshelf.innerHTML = '';

    function createBookElement(book, shelf) {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');

        const infoWrapper = document.createElement('div');
        infoWrapper.classList.add('wrapper')
    
        const cover = document.createElement('img');
        cover.src = book.coverUrl;
        cover.alt = `Cover buku ${book.title}`;
        infoWrapper.appendChild(cover);
    
        const bookInfo = document.createElement('div');
        bookInfo.classList.add('book-info');
    
        const title = document.createElement('h3');
        title.textContent = book.title;
    
        const author = document.createElement('p');
        author.textContent = `Penulis: ${book.author}`;
    
        const year = document.createElement('p');
        year.textContent = `Tahun Terbit: ${book.year}`;
    
        bookInfo.appendChild(title);
        bookInfo.appendChild(author);
        bookInfo.appendChild(year);
    
        const actionButton = document.createElement('button');
        if (shelf === 'read') {
            actionButton.textContent = 'Edit';
            actionButton.addEventListener('click', function() {
                populateForm(book);
            });
        } else {
            actionButton.textContent = 'Delete';
            actionButton.addEventListener('click', function() {
                removeFromShelf(book, shelf);
                renderBookshelf();
            });
        }
        
        bookInfo.appendChild(actionButton);
        infoWrapper.appendChild(bookInfo);
        bookCard.appendChild(infoWrapper);
    
        return bookCard;
    }

    readBooks.forEach(book => {
        if (book.title.toLowerCase().includes(searchInput)) {
            const bookElement = createBookElement(book, 'read');
            readBookshelf.appendChild(bookElement);
        }
    });

    unreadBooks.forEach(book => {
        if (book.title.toLowerCase().includes(searchInput)) {
            const bookElement = createBookElement(book, 'unread');
            unreadBookshelf.appendChild(bookElement);
        }
    });
}

function removeFromShelf(book, shelf) {
    if (shelf === 'read') {
        const index = readBooks.indexOf(book);
        readBooks.splice(index, 1);
    } else {
        const index = unreadBooks.indexOf(book);
        unreadBooks.splice(index, 1);
    }
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('year').value = '';
    document.getElementById('isRead').checked = false;
    document.getElementById('coverURL').value = '';
}

function populateForm(book) {
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('year').value = book.year;
    document.getElementById('isRead').checked = book.isRead;
    document.getElementById('coverURL').value = book.coverUrl;
}

function searchByTitle() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function () {
        renderBookshelf();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    searchByTitle();
    renderBookshelf();
});