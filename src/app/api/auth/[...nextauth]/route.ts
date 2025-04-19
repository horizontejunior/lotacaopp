import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/auth"; // ajuste o caminho se necessário

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
