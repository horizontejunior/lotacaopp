import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL || "https://ogrmujxqvbnzonnqppce.supabase.co",
      process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ncm11anhxdmJuem9ubnFwcGNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MTE0MTgsImV4cCI6MjA1OTI4NzQxOH0.y5LxewJ8XgGXQb4zKjjXhXUZ969APxhCzFyYG2p47K8"
    );
    const { registration, password } = await req.json();

    if (!registration || !password) {
      return NextResponse.json(
        { error: "Inscrição e senha são obrigatórias" },
        { status: 400 }
      );
    }

    // Verifica se o usuário existe (sem .single() para evitar erros)
    const { data: users, error: queryError } = await supabase
      .from("user")
      .select("registration, candidateName, gender, password")
      .eq("registration", registration)
      .limit(1);

    if (queryError) {
      console.error("Erro na consulta:", queryError);
      throw queryError;
    }

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "Inscrição não encontrada" },
        { status: 404 }
      );
    }

    const user = users[0];
    console.log("Usuário encontrado:", user);
    console.log("Senha armazenada:", user.password);

    // Compara a senha
    const passwordMatch = await bcrypt.compare(
      String(password), // Garante que é string
      String(user.password) // Garante que é string
    );

    console.log("Resultado da comparação:", passwordMatch);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Senha incorreta" },
        { status: 401 }
      );
    }

    // Remove a senha antes de retornar
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userData } = user;

    return NextResponse.json(
      { 
        message: "Login realizado com sucesso!", 
        user: userData 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro completo:", error);
    return NextResponse.json(
      { 
        error: "Erro interno no servidor",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}