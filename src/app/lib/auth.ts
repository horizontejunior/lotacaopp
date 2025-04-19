import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        registration: { label: "Inscrição", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const { registration, password } = credentials ?? {};

        if (!registration || !password) {
          throw new Error("Inscrição e senha são obrigatórias.");
        }

        const { data: users, error } = await supabase
          .from("user")
          .select("registration, candidateName, gender, password")
          .eq("registration", registration)
          .limit(1);

        const user = users?.[0];

        if (!user || error) {
          throw new Error("Usuário não encontrado.");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw new Error("Senha incorreta.");
        }

        return {
          id: user.registration,
          name: user.candidateName,
          gender: user.gender,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.SECRET!,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.gender = user.gender;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.gender = token.gender;
      return session;
    },
  },
};
