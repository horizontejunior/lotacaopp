'use client'


import { useRouter } from 'next/navigation';
import { useState } from 'react';


export default function Home() {
  const [gender, setGender] = useState<string>('');
  const [registration, setRegistration] = useState('');
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  
    const candidateName = (document.getElementById('candidateName') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const genderInput = document.querySelector('input[name="gender"]:checked') as HTMLInputElement;
    const gender = genderInput ? genderInput.value : null;
  
    if (!registration || !candidateName || !gender || !password) {
      alert('Preencha todos os campos corretamente!');
      return;
    }

  
    const response = await fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        registration: registration,
        candidateName,
        gender,
        password,
      }),
    });
  
    const result = await response.json();
    alert(result.message || result.error);
    router.push("./")
  }
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">

      <form className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96">
        <h2 className="text-center text-2xl font-bold text-yellow-500 mb-6">Cadastro de Candidatos</h2>

        <input
          type="number"
          value={registration}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 5) {
              setRegistration(value);
            }
          }}
          placeholder="Inscrição"
          className="w-full p-2 mb-4 rounded bg-gray-700 border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
          />

        <input
          id="candidateName"
          placeholder="Nome do Candidato"
          required
          className="w-full p-2 mb-4 rounded bg-gray-700 border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        
        <input
          id="password"
          placeholder="Senha"
          type="password"
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