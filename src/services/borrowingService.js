const {Borrowing, Member, Book} = require('../models')

const {validateAddBorrowing, validateReturnBook} = require('../validator/borrowing');
const NotFoundException = require("../exceptions/NotFoundException");
const ForbiddenException = require("../exceptions/ForbiddenException");

class BorrowingService{
    async addBorrowing(data){
        const {book_id, member_id} = validateAddBorrowing(data);

        const book = await this.checkBookAndMember(book_id, member_id); //check book and member is existed?

        if(book.stock <= 0 ){
            throw new ForbiddenException('Books not available');
        }

        //Check active borrowing
        const activeBorrowings = await Borrowing.count({
            where:{
                member_id:member_id,
                status:'BORROWED',
            }
        });

        if (activeBorrowings >= 3){
            throw new ForbiddenException('Maximum 3 books per member');
        }

        // For transaction
        const t = await Borrowing.sequelize.transaction();

        try{
            //decrease book stock
            await book.decrement('stock',{by:1, transaction: t})

            //add borrowing
            const borrowing = await Borrowing.create({
                book_id,
                member_id,
            },{
                transaction: t
            });

            await t.commit()
            return borrowing.id;
        }catch (err){
            await t.rollback()
            throw err;
        }
    }

    async checkBookAndMember(book_id, member_id){
        const book = await Book.findByPk(book_id);
        if(!book){
            throw new NotFoundException('Book doesn\'t exist');
        }

        const member = await Member.findByPk(member_id);
        if(!member){
            throw new NotFoundException('Member doesn\'t exist');
        }

        return book;
    }

    async returnBook(data){
        const {id, member_id} = validateReturnBook(data);
        const borrowing = await Borrowing.findOne({
            where:{
                id, status:'BORROWED',
            }
        })

        if(!borrowing){
            throw new NotFoundException('Borrowing doesn\'t exist');
        }

        if(borrowing.member_id !== member_id){
            throw new ForbiddenException('This book is not borrowed by this member');
        }

        const book = await Book.findByPk(borrowing.book_id);

        const t = await Borrowing.sequelize.transaction();
        try{
            await book.increment('stock',{by:1, transaction: t})

            await Borrowing.update({
                status: 'RETURNED', return_date: new Date()
            },{
                where:{
                    id
                }, transaction: t
            })

            await t.commit();
        }catch (err){
            await t.rollback()
            throw err;
        }
    }
}

module.exports = BorrowingService;
