const {Book} = require('../models');
const {Op, Sequelize} = require("sequelize");

const {validateFilterQueryGetBooks} = require('../validator/book');

class BookService {
    async getAll(data) {
        const {title, author, page, limit} = validateFilterQueryGetBooks(data); //validate data

        return await Book.findAndCountAll({
            where:{
              [Op.and]:[
                  {
                      title:{
                          [Op.iLike]:`%${title}%`,
                      }
                  },
                  {
                      author:{
                          [Op.iLike]:`%${author}%`,
                      }
                  },
              ]
            },
            attributes: ['id','title','author',
                'published_year','stock','isbn',
                [Sequelize.literal(`CASE WHEN "stock" > 0 THEN TRUE ELSE FALSE END`), 'available']],
            limit:  limit,
            offset: (page-1) * limit,
        });
        //data 30, Page 1 => 1-10, Page 2 => 11-20, Page 3 => 21-30
    }
}

module.exports = BookService;
