const BorrowingService = require('../services/BorrowingService');
const borrowingService = new BorrowingService();

class BorrowingController {
    async postBorrowing(req,res,next){
        try{
            const id = await borrowingService.addBorrowing(req.body);

            return res.status(201).json({
                status: 'success',
                data:{
                    id,
                },
            })
        }catch (e){
            next(e);
        }
    }

    async putBorrowing(req,res,next){
        try{
            const {id} = req.params;
            const {member_id} = req.body;

            await borrowingService.returnBook({
                id, member_id,
            });

            return res.status(200).json({
                status: 'success',
                message:'Borrowing updated successfully',
            })
        }catch (e){
            next(e);
        }
    }
}

module.exports = BorrowingController;
