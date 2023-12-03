import Admin from "@/models/admin";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import dbConnection from "@/utils/dbConnection";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      // name: "credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials, req) {
        const { username, password } = credentials;

        await dbConnection();
        const admin = await Admin.findOne({
          $or: [{ username }, { email: username }],
        });

        console.log("admin", admin);

        if (admin) {
          const passwordCorrect = await compare(password, admin.password);

          console.log(passwordCorrect);

          if (passwordCorrect) {
            return {
              id: admin._id,
              email: admin.email,
            };
          }
        }

        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
