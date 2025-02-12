const {describe, test, expect, beforeEach, beforeAll} = require("@jest/globals");
const BookService = require("../../src/services/bookService");
const ValidationException = require("../../src/exceptions/ValidationException");

const bookService = new BookService();

const {Book, Borrowing, Member} = require('../../src/models');

const books = require('../../src/data/books');
const members = require("../../src/data/members");

beforeAll(async ()=>{
    await Borrowing.destroy({where:{}});
    await Member.destroy({where:{}});
    await Book.destroy({where:{}});

    await Book.bulkCreate([...books]);
    await Member.bulkCreate([...members]);
});

describe('Test get all books', () => {
    test('get all books without filter title and author', async () => {
        const data = {
            title :'', author: '', page : 1, limit:10,
        }
        const {count, rows} = await bookService.getAll(data);
        expect(count).toBe(20);
        expect(rows.length).toBe(10);
    });

    test('get all books with filter page and limit', async () => {
        const data = {
            title :'', author: '', page: 3, limit:9,
        }
        const {count,rows} = await bookService.getAll(data);
        expect(count).toBe(20);
        expect(rows.length).toBe(2);
    });

    test('get all books with filter title', async () => {
        const data = {
            title : 'the', author: '', page: 2, limit:10,
        }
        const {count,rows} = await bookService.getAll(data);
        expect(count).toBe(14);
        expect(rows.length).toBe(4);
    });

    test('get all books with filter author', async () => {
        const data = {
            title : '', author: 'J.R.R. Tolkien', page: 1, limit:10,
        }
        const {count,rows} = await bookService.getAll(data);
        expect(count).toBe(2);
        expect(rows.length).toBe(2);
    });

    test('get all books with filter title and author', async () => {
        const data = {
            title : 'The Hobbit', author: 'J.R.R. Tolkien', page: 1, limit:10,
        }
        const {count,rows} = await bookService.getAll(data);
        expect(count).toBe(1);
        expect(rows.length).toBe(1);
    });

    test('get all books fail validation', async () => {
        try {
            const data = {
                title : 'The Hobbit', author: 'J.R.R. Tolkien', page: 'd', limit:10,
            }
            await bookService.getAll(data);
        }catch(err) {
            console.log(err.message);
            expect(err).toBeInstanceOf(ValidationException);
        }
    });

})
