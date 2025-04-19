import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  
  try {
    const { registration, score, intentions } = await request.json();
    const { data: existingIntentions, error: fetchError } = await supabase
    .from("intentions")
    .select("*")
    .eq("registration", registration);
  
  if (fetchError) {
    return NextResponse.json({ error: "Erro ao verificar intenções existentes." }, { status: 500 });
  }
  
  if (existingIntentions.length >= 3) {
    return NextResponse.json({ error: "Você já cadastrou o máximo de 3 intenções." }, { status: 400 });
  }
    for (const item of intentions) {
      const { error } = await supabase.from('intentions').insert({
        registration,
        score,
        level: parseInt(item.level),
        city: item.cityId,
      });

      if (error) {
        console.error('Erro ao salvar intenção:', error);
        return NextResponse.json({ error: 'Erro ao salvar uma das intenções.' }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'Intenções salvas com sucesso!' });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
