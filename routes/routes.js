const userController = require('../controllers/userController');

const routes = (app) => {
    app.post("/signup", userController.signup);

    app.post("/register", userController.register);

    app.post("/login", userController.login);

    app.get("/logout", userController.logout)

    app.get("/list", userController.getList);

    app.post("/list", userController.updateList);

    app.get("/list/:type/:id", userController.check);

    app.get("/recently", userController.getRecently);

    app.post("/recently", userController.updateRecently);
}


module.exports = routes;