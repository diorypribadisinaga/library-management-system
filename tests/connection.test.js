require('dotenv').config();

const {describe, test, expect} = require("@jest/globals");

const {Book} = require("../src/models");

describe("connection test", () => {
    test("connection test",async ()=>{
        const sequelize = await Book.sequelize;
        try {
            await sequelize.authenticate();
            console.log("Connection has been established successfully.");
            expect(true).toBe(true);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            expect(error).toBeNull();
        }finally {
            await sequelize.close();
        }
    });
})
