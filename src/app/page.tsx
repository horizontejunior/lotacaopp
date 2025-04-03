'use client'

import { useState } from 'react';

export default function Home() {
  const [gender, setGender] = useState<string>('');
  const [city, setCity] = useState<string>('');
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  
    const registration = (document.getElementById('registration') as HTMLInputElement).value;
    const candidateName = (document.getElementById('candidateName') as HTMLInputElement).value;
    const score = parseFloat((document.getElementById('score') as HTMLInputElement).value);
    const genderInput = document.querySelector('input[name="gender"]:checked') as HTMLInputElement;
    const city = (document.getElementById('city') as HTMLSelectElement).value;
  
    const gender = genderInput ? genderInput.value : null;
  
    if (!registration || !candidateName || isNaN(score) || !gender || !city) {
      alert('Preencha todos os campos corretamente!');
      return;
    }
  
    const response = await fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registration, candidateName, score, gender, city }),
    });
  
    const result = await response.json();
    alert(result.message || result.error);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-extrabold text-yellow-500 mb-8 uppercase tracking-wide">
        Intenção de Vaga PPSC 2025
      </h1>

      <form className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96">
        <h2 className="text-center text-2xl font-bold text-yellow-500 mb-6">Cadastro de Candidatos</h2>

        <input
          id="registration"
          type="number"
          placeholder="Inscrição"
          required
          className="w-full p-2 mb-4 rounded bg-gray-700 border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <input
          id="candidateName"
          placeholder="Nome do Candidato"
          required
          className="w-full p-2 mb-4 rounded bg-gray-700 border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <input
          id="score"
          type="number"
          step={0.01}
          placeholder="Nota"
          required
          className="w-full p-2 mb-4 rounded bg-gray-700 border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <div className="mb-4">
          <label className="block text-yellow-500 font-bold mb-2">Sexo:</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="Masculino"
                checked={gender === 'Masculino'}
                onChange={(e) => setGender(e.target.value)}
                className="accent-yellow-500"
              />
              Masculino
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="Feminino"
                checked={gender === 'Feminino'}
                onChange={(e) => setGender(e.target.value)}
                className="accent-yellow-500"
              />
              Feminino
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="city" className="block text-yellow-500 font-bold mb-2">
            Cidade de Lotação:
          </label>
          <select
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Selecione uma cidade</option>
            <option value="São Paulo">São Paulo</option>
            <option value="Rio de Janeiro">Rio de Janeiro</option>
            <option value="Belo Horizonte">Belo Horizonte</option>
            <option value="Curitiba">Curitiba</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300"
        >
          CADASTRAR
        </button>
      </form>
    </div>
  );
}
