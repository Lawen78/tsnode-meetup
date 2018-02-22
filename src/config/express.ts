import * as express from 'express';
import {Application} from 'express';
import * as bodyParser from 'body-parser';
import auth from '../controllers/auth';
import {initRoutes} from '../routes';

export function initApp(){
    let app = express();

    app.use(bodyParser.json());


    // so we can get the client's IP address
    app.enable("trust proxy");

    app.use(auth.initialize());

    app.all('/api/' + "*", (req, res, next) => {
        if (req.path.includes('/api/' + "login")) return next();

        return auth.authenticate((err: any, user: any, info: any) => {
            if (err) { return next(err); }
            if (!user) {
                if (info.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Your token has expired. Please generate a new one" });
                } else {
                    return res.status(401).json({ message: info.message });
                }
            }
            app.set("user", user);
            return next();
        })(req, res, next);
    });

    const routes = initRoutes(app);

    return app;
};