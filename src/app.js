require('express-async-errors');
const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const { controllers } = require('./controllers');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

controllers.forEach(ctrl => ctrl.setup(app));

app.use((err, req,res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    return res.status(err.code ?? 500).send(err.message);
})


module.exports = {
    app,
};
