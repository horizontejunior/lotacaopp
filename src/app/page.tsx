"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ registration: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      registration: form.registration,
      password: form.password,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setMessage("Inscrição ou senha incorreta.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
    <h1 className="text-3xl font-extrabold text-yellow-500 mb- uppercase tracking-wide text-center">
      Intenção de Vaga
    </h1>
    <h1 className="text-2xl font-extrabold text-yellow-500 uppercase tracking-wide text-center">
      PPSC 2025 - T1
    </h1>
      <div className="pt-10 text-yellow-500 mb-8 uppercase tracking-wide">
      
        <h2 className="text-3xl font-bold text-center mb-4">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            type="number"
            name="registration"
            placeholder="Inscrição"
            value={form.registration}
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 rounded bg-gray-700 border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 rounded bg-gray-700 border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300"
            disabled={isLoading}
          >
            Entrar
          </button>
        </form>

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}

        {/* Link para a página de cadastro */}
        <p className="mt-4 text-center text-gray-600">
          Ainda não tem conta{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Crie aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
