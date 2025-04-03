import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configurar Supabase (substitua pelas suas credenciais)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { registration, candidateName, score, gender, city } = await req.json();

    if (!registration || !candidateName || !score || !gender || !city) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    const { data, error } = await supabase.from('candidates').insert([
      { registration, candidateName, score, gender, city }
    ]);

    if (error) throw error;

    return NextResponse.json({ message: 'Candidato cadastrado com sucesso!', data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao cadastrar candidato.', details: error }, { status: 500 });
  }
}
