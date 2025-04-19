'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useSession } from "next-auth/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type City = {
  id: number;
  city_name: string;
};

type Candidate = {
  id: number;
  candidateName: string;
  score: number;
  gender: string;
  intention: string;
  city: City;
};

type RawCandidate = {
  id: number;
  score: number;
  gender: string;
  level: string;
  registration: {
    candidateName: string;
  } | null;
  city: {
    id: number;
    city_name: string;
  } | null;
};

export default function CandidatoList() {
  
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('todos');
  const [selectedGender, setSelectedGender] = useState<string>('todos');
  const { data: session } = useSession();
  useEffect(() => {
    const fetchData = async () => {
      const { data: cityData, error: cityError } = await supabase
        .from('city')
        .select('*');

      if (cityError) {
        console.error('Erro ao buscar cidades:', cityError);
        return;
      }

      setCities(cityData || []);

      const { data: candidateData, error: candidateError } = await supabase
        .from('intentions')
        .select('id, score, gender, level, registration (candidateName), city (id, city_name)');

      if (candidateError) {
        console.error('Erro ao buscar candidatos:', candidateError);
        return;
      }

      const transformed: Candidate[] = (candidateData as unknown as RawCandidate[]).map((c) => ({
        id: c.id,
        candidateName: c.registration?.candidateName || 'Desconhecido',
        score: c.score,
        gender: c.gender,
        intention: c.level,
        city: {
          id: c.city?.id ?? 0,
          city_name: c.city?.city_name ?? 'Desconhecida',
        },
      }));

      setCandidates(transformed);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...candidates];

    if (selectedCity !== 'todos') {
      filtered = filtered.filter(c => c.city.id.toString() === selectedCity);
    }

    if (selectedGender !== 'todos') {
      filtered = filtered.filter(c => c.gender === selectedGender);
    }

    filtered.sort((a, b) => b.score - a.score);
    setFilteredCandidates(filtered);
  }, [candidates, selectedCity, selectedGender]);
  if (!session) {
    return (
      <p className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        Acesso negado. Faça login para continuar.
      </p>
    );
  }
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
              <th className="px-4 py-2 text-left">Ordem</th>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Nota</th>
              <th className="px-4 py-2 text-left">Sexo</th>
              <th className="px-4 py-2 text-left">Intenção</th>
              <th className="px-4 py-2 text-left">Cidade</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((candidato, index) => (
              <tr key={candidato.id} className="border-b border-gray-700">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{candidato.candidateName}</td>
                <td className="px-4 py-2">{candidato.score.toFixed(2)}</td>
                <td className="px-4 py-2">{candidato.gender}</td>
                <td className="px-4 py-2">{candidato.intention}</td>
                <td className="px-4 py-2">{candidato.city.city_name}</td>
              </tr>
            ))}
            {filteredCandidates.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">
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
