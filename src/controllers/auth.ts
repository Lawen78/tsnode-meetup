
import * as jwt from "jsonwebtoken";
import * as passport from "passport";
import * as moment from "moment";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { model as User, IUser } from "../models/mongodb/user";
import {config} from '../config/configServer';
import {Request, Response, NextFunction} from 'express';
import '../config/mongodb';

class Auth {

    public initialize = () => {
        passport.use("jwt", this.getJWTStrategy());
        return passport.initialize();
    }

    public authenticate = (callback: any) => passport.authenticate("jwt", { session: false, failWithError: true }, callback);

    private genJWToken = (user: IUser): Object => {
        let expires = moment().utc().add({ days: 7 }).unix();
        let token = jwt.sign({
            exp: expires,
            username: user.username
        }, config.server.SECRET_JWT);

        return {
            token: "JWT " + token,
            expires: moment.unix(expires).format(),
            user: user._id
        };
    }

    public login = async (req: Request, res: Response) => {
        try {

            if(req.body.username && req.body.password){
              let user = await User.findOne({ "username": req.body.username }).exec();

              if (user === null) throw "User not found";

              let success = await user.comparePassword(req.body.password);
              if (success === false) throw "";

              res.status(200).json(this.genJWToken(user));
            } else {
              throw new Error();
            }



        } catch (err) {
            res.status(401).json({ "message": "Invalid credentials", "errors": err });
        }
    }

    private getJWTStrategy = (): JWTStrategy => {
        const params = {
            secretOrKey: config.server.SECRET_JWT,
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
            passReqToCallback: true
        };

        return new JWTStrategy(params, (req: Request, payload: any, done: any) => {
            User.findOne({ "username": payload.username }, (err, user) => {
                /* istanbul ignore next: passport response */
                if (err) {
                    return done(err);
                }
                /* istanbul ignore next: passport response */
                if (user === null) {
                    return done(null, false, { message: "The user in the token was not found" });
                }

                return done(null, { _id: user._id, username: user.username });
            });
        });
    }

}

export default new Auth();