const BookService = require('../services/bookService');
const bookService = new BookService();

class BookController{
    async getBooks(req, res, next) {
        try{
            const {title = '',author = '',
                page = 1, limit = 10} = req.query;

            const {count,rows} = await bookService.getAll({
                title,author,page,limit,
            });

            res.status(200).json({
                data: rows,
                pagination:{
                    total:count,
                    page: +page,
                    limit:+limit,
                    totalPages:Math.ceil(count / limit),
                }
            });
        }catch (e){
            next(e);
        }
    }
}

module.exports = BookController;
