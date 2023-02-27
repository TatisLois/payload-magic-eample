import jwt from "./jwt";
import type { Payload } from "payload";
import { setTokenCookie } from "./cookie";
const { Magic } = require("@magic-sdk/admin");

const magic = new Magic(process.env.MAGIC_SECRET_KEY);
const session_expires_days = 5;

export const login = {
  route: "/magic/login",
  method: "post",
  handler: async (req, res, next) => {
    try {
      const payload: Payload = req?.payload;
      const client_DID_token = req.headers.authorization.substr(7);
      // validation only throws if DID is invalid
      await magic.token.validate(client_DID_token);

      const magicStrategyUser = req?.user;
      const magicStrategyUserEmail = magicStrategyUser?.email;

      const result = await payload.find({
        collection: "users",
        where: {
          email: {
            like: magicStrategyUserEmail,
          },
        },
        overrideAccess: true,
        showHiddenFields: true,
      });

      const possible_payload_user_email = result?.docs[0]?.email;
      const possible_payload_user_id = result?.docs[0]?.id;

      const canNotLoginUser =
        possible_payload_user_email !== magicStrategyUserEmail;

      if (canNotLoginUser) {
        throw new Error("Magic E-mail lookup failed, invalid user");
      }

      const expiration =
        Math.floor(Date.now() / 1000) + 60 * 60 * 24 * session_expires_days;

      let token = jwt.sign(
        {
          collection: "users",
          email: possible_payload_user_email,
          id: possible_payload_user_id,
          exp: expiration,
        },
        payload.secret
      );

      const payload_authentication_token_name = `${payload.config.cookiePrefix}-token`;

      setTokenCookie({
        res,
        token,
        token_name: payload_authentication_token_name,
      });

      req.user = {
        collection: "users",
        email: possible_payload_user_email,
        id: possible_payload_user_id,
      };

      res.status(200).send({ redirect: "/" });
    } catch (error) {
      const message = error?.message
        ? error?.message
        : "A user failed to login through ";

      res.status(401).send({
        error: {
          status: 401,
          message: [message],
        },
      });
    }
  },
};
