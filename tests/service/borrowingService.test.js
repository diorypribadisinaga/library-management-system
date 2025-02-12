const {describe, test, expect, beforeEach, beforeAll} = require("@jest/globals");

const BorrowingService = require('../../src/services/BorrowingService');
const {Book, Member, Borrowing} = require('../../src/models');
const ValidationException = require('../../src/exceptions/ValidationException');
const ForbiddenException = require('../../src/exceptions/ForbiddenException');
const NotFoundException = require("../../src/exceptions/NotFoundException");

const {Op} = require("sequelize");
const books = require("../../src/data/books");
const members = require("../../src/data/members");

const borrowingService = new BorrowingService();

beforeAll(async ()=>{
    await Borrowing.destroy({where:{}});
    await Member.destroy({where:{}});
    await Book.destroy({where:{}});

    await Book.bulkCreate([...books]);
    await Member.bulkCreate([...members]);
});

describe('Test add borrowing', () => {
    test('Add borrowing success',async ()=>{
        const book = await Book.findOne({
            where: {
                stock : {
                    [Op.gte]: 3
                }
            }
        });
        const member = await Member.findOne({
            where: {}
        })
        const data = {
            book_id: book.id, member_id: member.id,
        };

        const id = await borrowingService.addBorrowing(data);
        expect(id).toBeDefined();

        //Check stock book
        const bookUpdate = await Book.findByPk(book.id);
        expect(bookUpdate.stock).not.toBe(book.stock);
        expect(bookUpdate.stock).toBe(book.stock-1);
    });

    test('Add borrowing fail validation',async ()=>{
        const data = {
            book_id: '', member_id: '',
        };
        await expect(borrowingService.addBorrowing(data)).rejects.toThrow(ValidationException)
    });

    test('Add borrowing fail, book not available',async ()=>{
        const book = await Book.findOne({
            where: {
                stock : {
                    [Op.gte]: 3
                }
            }
        });

        book.stock = 0;
        await book.save();

        const member = await Member.findOne({
            where: {
                name:'Lisa Thomas'
            }
        });

        const data = {
            book_id: book.id, member_id: member.id,
        };

        await expect(borrowingService.addBorrowing(data)).rejects.toThrow(ForbiddenException);
    });

    test('Add borrowing fail, book not found',async ()=>{
        const member = await Member.findOne({
            where: {
                name:'Lisa Thomas'
            }
        });

        const data = {
            book_id: '550e8400-e29b-41d4-a716-446655440000', member_id: member.id,
        };

        await expect(borrowingService.addBorrowing(data)).rejects.toThrow(NotFoundException);
    });

    test('Add borrowing fail, member not found',async ()=>{
        const book = await Book.findOne({
            where: {
                stock : {
                    [Op.gte]: 3
                }
            }
        });

        const data = {
            book_id: book.id, member_id: '550e8400-e29b-41d4-a716-446655440000',
        };

        await expect(borrowingService.addBorrowing(data)).rejects.toThrow(NotFoundException);
    });

    test('Add borrowing fail, member cannot borrow more than 3 books',async ()=>{
        const books = await Book.findAll({
            where: {
                stock : {
                    [Op.gte]: 4
                }
            }, limit: 4
        });

        const member = await Member.findOne({
            where: {
                name:'Lisa Thomas'
            }
        });

        for(let i= 0; i<books.length-1;i++){
            const data = {
                book_id: books[i].id, member_id: member.id,
            }
            const id = await borrowingService.addBorrowing(data);
            expect(id).toBeDefined();
        }

        const data = {
            book_id: books[3].id, member_id: member.id,
        }

        await expect(borrowingService.addBorrowing(data)).rejects.toThrow(ForbiddenException);
    });
});

describe('Test return book',()=>{
    test('return book success',async ()=>{
        const book = await Book.findOne({
            where: {
                stock : {
                    [Op.gte]: 3
                }
            }
        });
        const member = await Member.findOne({
            where: {}
        })
        const data = {
            book_id: book.id, member_id: member.id,
        };

        const id = await borrowingService.addBorrowing(data);

        await borrowingService.returnBook({id, member_id: member.id});

        //Check in database
        const borrowing = await Borrowing.findByPk(id);
        expect(borrowing.status).toBe('RETURNED');
        expect(borrowing.return_date).not.toBeNull();

        const bookUpdate = await Book.findByPk(book.id);
        expect(bookUpdate.stock).toBe(book.stock);
    });

    test('return book fail validation',async ()=>{
        const book = await Book.findOne({
            where: {
                stock : {
                    [Op.gte]: 3
                }
            }
        });
        const member = await Member.findOne({
            where: {}
        })
        const data = {
            book_id: book.id, member_id: member.id,
        };

        const id = await borrowingService.addBorrowing(data);

        await expect(borrowingService.returnBook({id,member_id:''})).rejects.toThrow(ValidationException);
    });

    test('return book fail, borrowing not exist',async ()=>{
        const book = await Book.findOne({
            where: {
                stock : {
                    [Op.gte]: 3
                }
            }
        });
        const member = await Member.findOne({
            where: {}
        })
        const data = {
            book_id: book.id, member_id: member.id,
        };

        const id = await borrowingService.addBorrowing(data);

        await borrowingService.returnBook({id, member_id: member.id});

        await expect(borrowingService.returnBook({id,member_id:member.id})).rejects.toThrow(NotFoundException);
    });

    test('return book fail, book is not borrowed by this member',async ()=>{
        const book = await Book.findOne({
            where: {
                stock : {
                    [Op.gte]: 3
                }
            }
        });
        const member = await Member.findOne({
            where: {}
        })
        const data = {
            book_id: book.id, member_id: member.id,
        };

        const id = await borrowingService.addBorrowing(data);

        const otherMember = await Member.findOne({
            where:{
                id: {
                    [Op.ne]:member.id
                }
            }
        });
        await expect(borrowingService.returnBook({id,member_id:otherMember.id})).rejects.toThrow(ForbiddenException);
    });
});
