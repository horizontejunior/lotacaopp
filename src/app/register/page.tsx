'use client'

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [gender, setGender] = useState<string>('');
  const [intention, setIntention] = useState<string>('');
  const [cities, setCities] = useState<{ id: number; city_name: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');

  useEffect(() => {
    const fetchCities = async () => {
      const { data, error } = await supabase.from('city').select('id, city_name').order('city_name');
      if (error) console.error('Erro ao buscar cidades:', error);
      else setCities(data || []);
    };
    fetchCities();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  
    const candidateName = (document.getElementById('candidateName') as HTMLInputElement).value;
    const score = parseFloat((document.getElementById('score') as HTMLInputElement).value);
    const genderInput = document.querySelector('input[name="gender"]:checked') as HTMLInputElement;
    const gender = genderInput ? genderInput.value : null;
  
    if (!candidateName || isNaN(score) || !gender || !intention || !selectedCity) {
      alert('Preencha todos os campos corretamente!');
      return;
    }
  
    const response = await fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateName,
        score,
        gender,
        intention,
        location: selectedCity,
      }),
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
          id="candidateName"
          placeholder="Nome do Candidato"
          required
          className="w-full p-2 mb-4 rounded bg-gray-700 border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <input
          id="score"
          type="number"
          step={0.01}
          placeholder="Nota final (Ex: 7,98)"
          required
          className="w-full p-2 mb-4 rounded bg-gray-700 border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <div className="mb-4">
          <label htmlFor="location" className="block text-yellow-500 font-bold mb-2">Cidade desejada:</label>
          <select
            id="location"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Selecione uma cidade</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>{city.city_name}</option>
            ))}
          </select>
        </div>

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
          <label htmlFor="intention" className="block text-yellow-500 font-bold mb-2">
            Nível de interesse:
          </label>
          <select
            id="intention"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Selecione um</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
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