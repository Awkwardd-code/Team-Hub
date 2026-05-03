const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("../prisma/client");

const hasGoogleConfig =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET) &&
  Boolean(process.env.GOOGLE_CALLBACK_URL);

if (hasGoogleConfig) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName;
          const googleAvatarUrl = profile.photos?.[0]?.value || null;

          if (!email) {
            return done(new Error("Google account email is missing"));
          }

          const existingByGoogleId = await prisma.user.findUnique({ where: { googleId } });
          if (existingByGoogleId) {
            const updated = await prisma.user.update({
              where: { id: existingByGoogleId.id },
              data: {
                googleId: existingByGoogleId.googleId || googleId,
                name: existingByGoogleId.name || name || existingByGoogleId.name,
                avatarUrl: existingByGoogleId.avatarUrl || googleAvatarUrl || undefined,
                emailVerified: true,
                provider: existingByGoogleId.provider || "google",
              },
            });
            return done(null, updated);
          }

          const existingByEmail = await prisma.user.findUnique({ where: { email } });
          if (existingByEmail) {
            const updated = await prisma.user.update({
              where: { id: existingByEmail.id },
              data: {
                googleId: existingByEmail.googleId || googleId,
                name: existingByEmail.name || name || existingByEmail.name,
                avatarUrl: existingByEmail.avatarUrl || googleAvatarUrl || undefined,
                emailVerified: true,
                provider: existingByEmail.provider || "google",
              },
            });
            return done(null, updated);
          }

          const created = await prisma.user.create({
            data: {
              name: name || email.split("@")[0],
              email,
              googleId,
              avatarUrl: googleAvatarUrl || null,
              provider: "google",
              emailVerified: true,
              passwordHash: null,
            },
          });

          return done(null, created);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

module.exports = {
  passport,
  hasGoogleConfig,
};
