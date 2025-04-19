import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.SUPABASE_URL || "https://ogrmujxqvbnzonnqppce.supabase.co",
  process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ncm11anhxdmJuem9ubnFwcGNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MTE0MTgsImV4cCI6MjA1OTI4NzQxOH0.y5LxewJ8XgGXQb4zKjjXhXUZ969APxhCzFyYG2p47K8"
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
  secret: process.env.NEXTAUTH_SECRET,
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
