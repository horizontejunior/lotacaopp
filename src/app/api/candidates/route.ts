import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const requestData = await req.json();
    console.log("Dados recebidos:", requestData);

    // Garanta que todos os campos são strings
    const registration = String(requestData.registration);
    const candidateName = String(requestData.candidateName);
    const gender = String(requestData.gender);
    const password = String(requestData.password);

    if (!registration || !password || !candidateName || !gender) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios!" },
        { status: 400 }
      );
    }

    // Verifica se o usuário já existe
    const { data: existingUser, error: queryError } = await supabase
      .from("user")
      .select("*")
      .eq("registration", registration);

    if (queryError) throw queryError;
    if (existingUser?.length) {
      return NextResponse.json(
        { error: "Usuário já cadastrado!" },
        { status: 400 }
      );
    }

    // Criptografa a senha (garantindo que password é string)
    const hashedPassword = await bcrypt.hash(password, 10); // 10 é o número de rounds válido

    // Insere o usuário no banco
    const { data, error: insertError } = await supabase
      .from("user")
      .insert([{
        registration,
        candidateName: candidateName,
        gender,
        password: hashedPassword
      }])
      .select();

    if (insertError) throw insertError;

    return NextResponse.json(
      { message: "Usuário cadastrado com sucesso!", user: data },
      { status: 201 }
    );

  } catch (error) {
    console.error("Erro detalhado:", error);
    return NextResponse.json(
      { 
        error: "Erro no cadastro",
        message: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}