'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { InputMask } from '@react-input/mask';
import { useSession } from 'next-auth/react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function IntentionPage() {
  const [intention, setIntention] = useState('');
  const [cities, setCities] = useState<{ id: number; city_name: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [score, setScore] = useState('');
  const [intentions, setIntentions] = useState<
    { level: string; cityId: string; cityName: string }[]
  >([]);
  const [usedLevels, setUsedLevels] = useState<number[]>([]);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchInitialData = async () => {
      const cityResponse = await supabase
        .from('city')
        .select('id, city_name')
        .order('city_name');

      if (cityResponse.error) {
        console.error('Erro ao buscar cidades:', cityResponse.error);
      } else {
        setCities(cityResponse.data || []);
      }

      const userId = session?.user?.id;
      if (!userId) {
        console.warn('Usuário ainda não carregado');
        return;
      }

      const intentionResponse = await supabase
        .from('intentions')
        .select('level, city, city_data:city(city_name)')
        .eq('registration', session.user.id);

      if (intentionResponse.error) {
        console.error(
          'Erro ao buscar intenções:',
          JSON.stringify(intentionResponse.error, null, 2)
        );
      } else {
        type IntentionFromDB = {
          level: string;
          city: number;
          city_data: { city_name: string };
        };

        const loadedIntentions = (intentionResponse.data as unknown as IntentionFromDB[]).map((item) => ({
          level: item.level,
          cityId: item.city.toString(),
          cityName: item.city_data.city_name,
        }));

        setIntentions(loadedIntentions);
        setUsedLevels(loadedIntentions.map((item) => parseInt(item.level)));
      }
    };

    fetchInitialData();
  }, [session]);

  if (!session?.user?.id) return;

  const handleRemove = (level: string) => {
    const updated = intentions.filter((i) => i.level !== level);
    setIntentions(updated);
    setUsedLevels(updated.map((i) => parseInt(i.level)));
  };

  const handleSave = async () => {
    if (!session) return alert('Sessão expirada. Faça login novamente.');

    const parsedScore = parseFloat(score);
    if (isNaN(parsedScore) || intentions.length === 0) {
      return alert('Informe uma nota válida e ao menos uma intenção');
    }

    const deleteResponse = await supabase
      .from('intentions')
      .delete()
      .eq('registration', session.user.id);

    if (deleteResponse.error) {
      console.error('Erro ao excluir intenções antigas:', deleteResponse.error);
      return alert('Erro ao excluir intenções antigas');
    }

    const insertResponse = await supabase
      .from('intentions')
      .insert(
        intentions.map((intention) => ({
          registration: session.user.id,
          level: intention.level,
          city: parseInt(intention.cityId),
          score: parsedScore,
          gender: session.user.gender
        }))
      );

    if (insertResponse.error) {
      console.error('Erro ao salvar novas intenções:', insertResponse.error);
      alert(`Erro ao salvar intenções: ${JSON.stringify(insertResponse.error, null, 2)}`);
      return;
    }

    alert('Intenções salvas com sucesso!');
    setIntentions([]);
    setUsedLevels([]);
    setScore('');
  };

  const handleAddOrUpdateIntention = () => {
    if (!selectedCity || !intention) return alert('Selecione uma cidade e um nível');

    const existingIntentionIndex = intentions.findIndex((i) => i.level === intention);

    if (existingIntentionIndex !== -1) {
      const existingCityName = intentions[existingIntentionIndex].cityName;
      const selectedCityName = cities.find((c) => c.id.toString() === selectedCity)?.city_name || '';

      if (intentions[existingIntentionIndex].cityId !== selectedCity) {
        const updatedIntentions = [...intentions];
        updatedIntentions[existingIntentionIndex] = {
          level: intention,
          cityId: selectedCity,
          cityName: selectedCityName,
        };
        setIntentions(updatedIntentions);
      } else {
        alert(`Você já adicionou a cidade ${existingCityName} para o nível ${intention}.`);
      }
    } else if (intentions.length < 3) {
      const cityName = cities.find((c) => c.id.toString() === selectedCity)?.city_name || '';
      const newIntentions = [
        ...intentions,
        { level: intention, cityId: selectedCity, cityName },
      ];
      setIntentions(newIntentions);
      setUsedLevels(newIntentions.map((i) => parseInt(i.level)));
    } else {
      alert('Você só pode cadastrar até 3 intenções.');
    }

    setSelectedCity('');
    setIntention('');
  };

  return (
    <div className="flex flex-row gap-8 items-start justify-center min-h-screen bg-gray-900 text-white p-8">
      <form className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96">
        <h2 className="text-center text-2xl font-bold text-yellow-500 mb-6">
          Cadastro de Intenções
        </h2>

        <div className="mb-4">
          <label className="text-yellow-500 font-bold">Nota:</label>
          <InputMask
            mask="_.__"
            replacement={{ _: /\d/ }}
            placeholder="Nota"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full p-2 mt-1 rounded bg-gray-700 border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="mb-4">
          <label className="text-yellow-500 font-bold">Cidade desejada:</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full p-2 mt-1 rounded bg-gray-700 border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Escolha uma cidade</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>{city.city_name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-yellow-500 font-bold">Nível de intenção:</label>
          <select
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            className="w-full p-2 mt-1 rounded bg-gray-700 border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Escolha o nível</option>
            {[1, 2, 3].map((level) => {
              const isUsed = usedLevels.includes(level);
              const isEditing = intention === level.toString();
              return (
                <option key={level} value={level} disabled={isUsed && !isEditing}>
                  Nível {level} {isUsed && !isEditing ? '(Já usado)' : ''}
                </option>
              );
            })}
          </select>
        </div>

        <button
          type="button"
          onClick={handleAddOrUpdateIntention}
          className="w-full bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 mb-4"
        >
          {intentions.some((i) => i.level === intention) ? 'Atualizar' : '+ Adicionar'}
        </button>

        <div className="mb-4">
          {intentions.map((item) => (
            <div
              key={`${item.level}-${item.cityId}`}
              className="flex justify-between items-center bg-gray-700 text-white p-2 rounded mb-2"
            >
              <span>
                Nível {item.level}: {item.cityName}
              </span>
              <button
                onClick={() => handleRemove(item.level)}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                Remover
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
        >
          Salvar Intenções
        </button>
      </form>
    </div>
  );
}