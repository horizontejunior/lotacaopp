'use client'

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  
  if (!session) {
    return (
      <p className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        Acesso negado. Faça login para continuar.
      </p>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full flex flex-col min-h-screen bg-gray-900 text-white">
     
      <h1 className="pt-10 text-2xl font-light text-center text-yellow-500 mb-4 uppercase tracking-wide">
      Seja bem vindo, {session.user.name} 
      </h1>
      <div className="w-screen flex flex-col items-center justify-center">
        <Link
          href="/intention"
          className="w-50 m-2 bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300 text-center"
        >
          Minhas intenções
        </Link>
        <Link
          href="/consult"
          className="w-50 m-2 bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300 text-center"
        >
          Consultar Intenções
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-50 m-2 bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300 text-center"
        >
          Sair
        </button>
      </div>
      </div>
    </div>
  );
}
