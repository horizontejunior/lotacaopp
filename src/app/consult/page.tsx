'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Candidate = {
  id: number;
  candidateName: string;
  score: number;
  gender: string;
  intention: string;
  location: string;
};

type City = {
  id: number;
  city_name: string;
};

export default function CandidatoList() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('todos');
  const [selectedGender, setSelectedGender] = useState<string>('todos');

  useEffect(() => {
    const fetchData = async () => {
      const { data: cityData } = await supabase.from('city').select('*');
      setCities(cityData || []);

      const { data: candidateData } = await supabase.from('candidates').select('*');
      setCandidates(candidateData || []);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...candidates];

    if (selectedCity !== 'todos') {
      filtered = filtered.filter(c => c.location === selectedCity);
    }

    if (selectedGender !== 'todos') {
      filtered = filtered.filter(c => c.gender === selectedGender);
    }
    filtered.sort((a, b) => b.score - a.score);
    setFilteredCandidates(filtered);
  }, [candidates, selectedCity, selectedGender]);

  const getCityName = (id: string) => {
    const city = cities.find(c => c.id.toString() === id);
    return city ? city.city_name : 'Desconhecida';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-yellow-500 mb-6 text-center uppercase">Lista de Candidatos</h1>

      <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
        <div>
          <label className="block mb-1 font-semibold text-yellow-500">Filtrar por Cidade:</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="p-2 rounded bg-gray-800 border border-yellow-500"
          >
            <option value="todos">Todas</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id.toString()}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-yellow-500">Filtrar por Sexo:</label>
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="p-2 rounded bg-gray-800 border border-yellow-500"
          >
            <option value="todos">Todos</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-xl overflow-hidden">
          <thead className="bg-yellow-500 text-gray-900">
            <tr>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Nota</th>
              <th className="px-4 py-2 text-left">Sexo</th>
              <th className="px-4 py-2 text-left">Intenção</th>
              <th className="px-4 py-2 text-left">Cidade</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((candidato) => (
              <tr key={candidato.id} className="border-b border-gray-700">
                <td className="px-4 py-2">{candidato.candidateName}</td>
                <td className="px-4 py-2">{candidato.score.toFixed(2)}</td>
                <td className="px-4 py-2">{candidato.gender}</td>
                <td className="px-4 py-2">{candidato.intention}</td>
                <td className="px-4 py-2">{getCityName(candidato.location)}</td>
              </tr>
            ))}
            {filteredCandidates.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  Nenhum candidato encontrado com os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
