'use client'

import Link from "next/link";


export default function Home() {

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="pt-10 text-3xl font-extrabold text-yellow-500 mb-8 uppercase tracking-wide">
        Intenção de Vaga PPSC 2025
      </h1>
      <div className="w-md">
            <Link href="/register" className="w-full m-6 bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300">
            Cadastrar Intenção
          </Link>
          <Link href="/consult" className="w-full bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300">
            Consultar Intenções
          </Link>
        </div>
    </div>
  );
}
