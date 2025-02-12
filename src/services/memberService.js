const {Member, Borrowing, Book} = require('../models');

const {validateAddMember, validateFilterQueryGetMemberBorrowingsHistory} = require('../validator/member')
const NotFoundException = require("../exceptions/NotFoundException");
const ForbiddenException = require("../exceptions/ForbiddenException");

class MemberService {
    async addMember(data){
        const {name, email, phone, address} = validateAddMember(data);

        //check email
        await this.checkEmail(email);

        const member = await Member.create({
            name, email, phone, address});

        return member.id;
    }

    async checkEmail(email){
        const member = await Member.findOne({
            where: {email}
        });

        if (member) {
            throw new ForbiddenException('email already exists');
        }
    }

    async getMemberBorrowingsHistory(data){
        const {id,status, page, limit} = validateFilterQueryGetMemberBorrowingsHistory(data);

        //Check member is existed?
        const member = await Member.findByPk(id);

        if(!member){
            throw new NotFoundException('Member not found');
        }

        if (!status){
            return Borrowing.findAndCountAll({
                where:{
                  member_id: id
                },
                include: {
                    model: Book,
                    attributes: ['id','title','author',
                        'published_year','isbn'],
                },
                limit,
                offset: (page-1) * limit,
            });
        }

        return Borrowing.findAndCountAll({
            where:{
                member_id: id,
                status: status
            },
            include: {
                model: Book,
                attributes: ['id','title','author',
                    'published_year','isbn'],
            },
            limit,
            offset: (page-1) * limit,
        });
    }
}

module.exports = MemberService;
