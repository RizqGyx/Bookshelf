const readBooks = [];
const unreadBooks = [];
let bookId = 1;

function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = parseInt(document.getElementById('year').value);
    const isRead = document.getElementById('isRead').checked;
    let coverUrl = document.getElementById('coverURL').value;

    const noImageUrl = 'https://placeholder.com/230x340?text=Novel';
    coverUrl = coverUrl.trim() !== '' ? coverUrl : noImageUrl;

    function validate() {
        if (title === '' || author === '' || isNaN(year) || year.toString().length !== 4) {
            alert('Harap isi semua bidang dengan benar sebelum menambahkan buku dan masukkan sesuai contoh');
            return false;
        }
        return true;
    }

    if (!validate()) {
        return;
    }
    
    const newBook = {
        id: bookId++,
        title,
        author,
        year,
        isRead,
        coverUrl
    };

    if (isRead) {
        readBooks.push(newBook);
        saveToLocalStorage('readBooks', readBooks);
    } else {
        unreadBooks.push(newBook);
        saveToLocalStorage('unreadBooks', unreadBooks);
    }

    saveToLocalStorage();
    renderBookshelf();
    clearForm();
}

function saveToLocalStorage() {
    localStorage.setItem('readBooks', JSON.stringify(readBooks));
    localStorage.setItem('unreadBooks', JSON.stringify(unreadBooks));
}

function loadFromLocalStorage() {
    const storedReadBooks = JSON.parse(localStorage.getItem('readBooks'));
    const storedUnreadBooks = JSON.parse(localStorage.getItem('unreadBooks'));

    if (storedReadBooks) {
        readBooks.push(...storedReadBooks);
    }

    if (storedUnreadBooks) {
        unreadBooks.push(...storedUnreadBooks);
    }
}

function createBookElement(book, shelf) {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');

    const infoWrapper = document.createElement('div');
    infoWrapper.classList.add('wrapper', 'justify-evenly');

    const cover = document.createElement('img');
    cover.setAttribute('height', '500px');
    cover.setAttribute('width', '250px');
    cover.src = book.coverUrl;
    cover.alt = `Cover buku ${book.title}`;
    infoWrapper.appendChild(cover);

    const bookInfo = document.createElement('div');
    bookInfo.classList.add('book-info', 'px-5');

    const title = document.createElement('h3');
    title.textContent = book.title;

    const author = document.createElement('p');
    author.textContent = `Penulis: ${book.author}`;

    const year = document.createElement('p');
    year.textContent = `Tahun Terbit: ${book.year}`;

    bookInfo.appendChild(title);
    bookInfo.appendChild(author);
    bookInfo.appendChild(year);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('px-5', 'py-2', 'bg-blue-400');
    editButton.addEventListener('click', function() {
        populateForm(book);
        bookForm.style.display = 'flex';
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
        deleteButton.classList.add('px-5', 'py-2', 'bg-red-400');
        deleteButton.addEventListener('click', function() {
            removeFromShelf(book, shelf);
            renderBookshelf();
        });

    const redoButton = document.createElement('button');
    redoButton.textContent = 'Redo';
    redoButton.classList.add('px-5', 'py-2', 'bg-lime-400');
    redoButton.addEventListener('click', function() {
        redoBook(book);
    });

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.classList.add('px-5', 'py-2', 'bg-lime-400');
    completeButton.addEventListener('click', function() {
        completeBook(book);
    });

    if (shelf === 'read') {
        bookInfo.appendChild(redoButton);
    } else {
        bookInfo.appendChild(completeButton);
    }
    
    bookInfo.appendChild(editButton);
    bookInfo.appendChild(deleteButton);
    infoWrapper.appendChild(bookInfo);
    bookCard.appendChild(infoWrapper);

    bookCard.classList.add('mt-5');

    return bookCard;
}

function renderBookshelf() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const readBookshelf = document.getElementById('readBooks');
    const unreadBookshelf = document.getElementById('unreadBooks');

    readBookshelf.innerHTML = '';
    unreadBookshelf.innerHTML = '';

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

function redoBook(book) {
    book.isRead = false;
    unreadBooks.push(book);
    removeFromShelf(book, 'read');
    saveToLocalStorage('unreadBooks', unreadBooks);
    renderBookshelf();
}

function completeBook(book) {
    book.isRead = true;
    readBooks.push(book);
    removeFromShelf(book, 'unread');
    saveToLocalStorage('readBooks', readBooks);
    renderBookshelf();
}

function removeFromShelf(book, shelf) {
    if (shelf === 'read') {
        readBooks.forEach((item, index) => {
            if (item.id === book.id) {
                readBooks.splice(index, 1);
            }
        });
        saveToLocalStorage('readBooks', readBooks);
    } else {
        unreadBooks.forEach((item, index) => {
            if (item.id === book.id) {
                unreadBooks.splice(index, 1);
            }
        });
        saveToLocalStorage('unreadBooks', unreadBooks);
    }
    renderBookshelf();
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('year').value = '';
    document.getElementById('isRead').checked = false;
    document.getElementById('coverURL').value = '';
}

function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function loadFromLocalStorage() {
    const storedReadBooks = JSON.parse(localStorage.getItem('readBooks'));
    const storedUnreadBooks = JSON.parse(localStorage.getItem('unreadBooks'));

    if (storedReadBooks) {
        readBooks.push(...storedReadBooks);
    }

    if (storedUnreadBooks) {
        unreadBooks.push(...storedUnreadBooks);
    }
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
    loadFromLocalStorage();
    renderBookshelf();
});

const toggleFormBtn = document.getElementById('toggleFormBtn');
const bookForm = document.getElementById('form');

toggleFormBtn.addEventListener('click', function() {
    if (bookForm.style.display === 'none') {
        bookForm.style.display = 'flex';
    } else {
        bookForm.style.display = 'none';
    }
});