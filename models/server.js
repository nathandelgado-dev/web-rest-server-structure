const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config.db');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            users: '/api/users',
            categories: '/api/categories'
        }
        this.connectDB();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        //Cors
        this.app.use(cors());

        //Read and parse of body
        this.app.use(express.json());

        //Public patch
        this.app.use(express.static('public'));
    }

    async connectDB() {
        await dbConnection();
    }

    routes() {
        this.app.use(this.paths.users, require('../routes/users.routes'));
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.categories, require('../routes/categories.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Runing in port: ${this.port}`);
        })
    }
}

module.exports = Server;