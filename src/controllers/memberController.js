const MemberService = require('../services/memberService');
const memberService = new MemberService();

class MemberController {
    async postMember(req, res,next) {
        try{
            const id = await memberService.addMember(req.body);

            res.status(201).json({
                status: 'success',
                data:{
                    id
                },
            });
        }catch (e){
            next(e);
        }

    }

    async getMemberBorrowingsHistory(req,res,next){
        try {
            const {id} = req.params;
            const {status, page= 1, limit= 10} = req.query;

            const {count, rows} = await memberService.getMemberBorrowingsHistory({id,
                status, page, limit,
            });

            return res.status(200).json({
                data:{
                    borrowings:rows,
                },
                pagination:{
                    total:count,
                    page: +page,
                    limit:+limit,
                    totalPages:Math.ceil(count / limit),
                }
            })
        }catch (err){
            next(err);
        }
    }
}

module.exports = MemberController;
