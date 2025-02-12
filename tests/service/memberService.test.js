const {describe, test, expect, beforeEach, beforeAll, afterEach} = require("@jest/globals");
const MemberService = require("../../src/services/memberService");
const BorrowingService = require('../../src/services/BorrowingService');
const {Op} = require("sequelize");

const {Book, Member, Borrowing} = require('../../src/models');

const ValidationException = require("../../src/exceptions/ValidationException");
const ForbiddenException = require("../../src/exceptions/ForbiddenException");

const memberService = new MemberService();
const borrowingService = new BorrowingService();

const books = require('../../src/data/books');
const members = require('../../src/data/members');

beforeAll(async ()=>{
    await Borrowing.destroy({where:{}});
    await Member.destroy({where:{}});
    await Book.destroy({where:{}});

    await Book.bulkCreate([...books]);
    await Member.bulkCreate([...members]);
});

describe('Test add member', () => {
    test('Test add member success', async () => {
        const data = {
            name:'Name 1', email:'email@gmail.com', phone:'+6243543434', address:'Jl. Alamat'
        }
        const id = await memberService.addMember(data);
        expect(id).toBeDefined();
    });

    test('Test add member fail validation', async () => {
        const dataDummy = [
            {name:'', email:'email@gmail.com', phone:'+6243543434', address:'Jl. Alamat'},
            {name:'Name 1', email:'email', phone:'+6243543434', address:'Jl. Alamat'},
            {name:'Name 1', email:'email@gmail.com', phone:'dsfd', address:'Jl. Alamat'},
            {name:'Name 1', email:'email@gmail.com', phone:'+6243543434', address:''},
        ];

        for (const data of dataDummy) {
            await expect(memberService.addMember(data)).rejects.toThrow(ValidationException);
        }
    });

    test('Test add member fail, email already exist', async () => {
        const data = {
            name:'Name 2', email:'emailnew@gmail.com', phone:'+6243543434', address:'Jl. Alamat'
        }
        const id = await memberService.addMember(data);
        expect(id).toBeDefined();

        await expect(memberService.addMember(data)).rejects.toThrow(ForbiddenException);
    });
})


describe('Test get member borrowing history', () => {
    beforeEach(async ()=>{
        const books = await Book.findAll({
            where: {
                stock : {
                    [Op.gte]: 4
                }
            }, limit: 3
        });

        const member = await Member.findOne({
            where: {
                name:'Christopher Lee'
            }
        });

        for(let i= 0; i<books.length;i++){
            const data = {
                book_id: books[i].id, member_id: member.id,
            }
            const id = await borrowingService.addBorrowing(data);

            if (i === 1){
                await borrowingService.returnBook({id, member_id: member.id});
            }
        }
    });
    afterEach(async ()=>{
        await Borrowing.destroy({where:{}});
    });

    test('get all borrowings without filter', async () => {
        const member = await Member.findOne({
            where: {
                name:'Christopher Lee'
            }
        });

        const {count,rows} = await memberService.getMemberBorrowingsHistory({id:member.id,
            page:1, limit:10});

        expect(count).toBe(3);
        expect(rows.length).toBe(3);
    });

    test('get all borrowings with page and limit', async () => {
        const member = await Member.findOne({
            where: {
                name:'Christopher Lee'
            }
        });

        const {count,rows} = await memberService.getMemberBorrowingsHistory({id:member.id,
            page:3, limit:1});

        expect(count).toBe(3);
        expect(rows.length).toBe(1);
    });

    test('get all borrowings with status', async () => {
        const member = await Member.findOne({
            where: {
                name:'Christopher Lee'
            }
        });

        const {count,rows} = await memberService.getMemberBorrowingsHistory({id:member.id,
            page:1, limit:10, status:'BORROWED'});

        expect(count).toBe(2);
        expect(rows.length).toBe(2);
    })
})
