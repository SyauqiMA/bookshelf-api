const nanoid = require('nanoid');
const books = require('./books');
const { successMessage, failMessage } = require('./helper');

const addBookHandler = (request, h) => {
  const bookData = request.payload;

  if (!bookData.name) {
    const response = h
      .response(failMessage('Gagal menambahkan buku. Mohon isi nama buku'))
      .code(400);
    return response;
  }

  if (bookData.readPage > bookData.pageCount) {
    const response = h
      .response(
        failMessage(
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        ),
      )
      .code(400);
    return response;
  }

  bookData.id = nanoid.nanoid(16);
  bookData.insertedAt = new Date().toISOString();
  bookData.updatedAt = bookData.insertedAt;
  bookData.finished = bookData.readPage === bookData.pageCount;

  books.push(bookData);

  const response = h
    .response(
      successMessage('Buku berhasil ditambahkan', {
        bookId: bookData.id,
      }),
    )
    .code(201);
  return response;
};

const getAllBooksHandler = (request, h) => {
  let { name, reading, finished } = request.query;
  // console.log(name, reading, finished);
  // clone the array of objects
  let booksFiltered = books.map((a) => ({ ...a }));

  if (name !== undefined) {
    name = String(name);
    booksFiltered = booksFiltered.filter(
      (b) => b.name.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    );
  }

  if (reading !== undefined) {
    reading = Boolean(Number(reading));
    booksFiltered = booksFiltered.filter((b) => b.reading === reading);
  }

  if (finished !== undefined) {
    finished = Boolean(Number(finished));
    booksFiltered = booksFiltered.filter((b) => b.finished === finished);
  }

  const booksData = booksFiltered.map((b) => ({
    id: b.id,
    name: b.name,
    publisher: b.publisher,
  }));

  const response = h
    .response(
      successMessage(null, {
        books: booksData,
      }),
    )
    .code(200);

  return response;
};

const getBookDetailByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const bookData = books.filter((b) => b.id === bookId)[0];

  if (!bookData) {
    const response = h.response(failMessage('Buku tidak ditemukan')).code(404);
    return response;
  }

  const response = h
    .response(
      successMessage(null, {
        book: bookData,
      }),
    )
    .code(200);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const editData = request.payload;
  const bookData = books.find((b) => b.id === bookId);

  if (!editData.name) {
    const response = h
      .response(failMessage('Gagal memperbarui buku. Mohon isi nama buku'))
      .code(400);
    return response;
  }

  if (editData.readPage > editData.pageCount) {
    const response = h
      .response(
        failMessage(
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        ),
      )
      .code(400);
    return response;
  }

  if (!bookData) {
    const response = h
      .response(failMessage('Gagal memperbarui buku. Id tidak ditemukan'))
      .code(404);
    return response;
  }

  // book is found
  editData.updatedAt = new Date().toISOString();
  Object.assign(bookData, editData);

  const response = h
    .response(successMessage('Buku berhasil diperbarui'))
    .code(200);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    const response = h
      .response(failMessage('Buku gagal dihapus. Id tidak ditemukan'))
      .code(404);
    return response;
  }

  // book is found
  books.splice(bookIndex, 1);

  const response = h
    .response(successMessage('Buku berhasil dihapus'))
    .code(200);
  return response;
};
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookDetailByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
