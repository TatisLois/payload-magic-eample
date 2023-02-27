const { Magic } = require("@magic-sdk/admin");
const MagicStrategy = require("passport-magic").Strategy;

export const magic = new Magic(process.env.MAGIC_SECRET_KEY);

export const strategy = new MagicStrategy(async function (user, done) {
  try {
    const userMetadata = await magic.users.getMetadataByIssuer(user.issuer);
    done(null, userMetadata);
  } catch (error) {
    console.log("error userMetadata", error);
    done(error, null);
  }
});
