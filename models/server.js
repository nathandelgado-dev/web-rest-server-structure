const express = require('express');
const cors = require('cors');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/api/users';
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

    routes() {
        this.app.use(this.userPath, require('../routes/users'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Runing in port: ${this.port}`);
        })
    }
}

module.exports = Server;