import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Iniciando seed do banco de dados...");

    // Criar alguns municípios de exemplo
    const municipios = [
        { nome: "São Paulo", uf: "SP" },
        { nome: "Rio de Janeiro", uf: "RJ" },
        { nome: "Belo Horizonte", uf: "MG" },
        { nome: "Salvador", uf: "BA" },
        { nome: "Brasília", uf: "DF" },
        { nome: "Fortaleza", uf: "CE" },
        { nome: "Recife", uf: "PE" },
        { nome: "Porto Alegre", uf: "RS" },
        { nome: "Curitiba", uf: "PR" },
        { nome: "Goiânia", uf: "GO" }
    ];

    console.log("📍 Criando municípios...");
    
    for (const municipio of municipios) {
        await prisma.municipio.upsert({
            where: { 
                // Como não temos unique constraint no nome+uf, vou usar uma estratégia diferente
                id: "" // placeholder
            },
            update: {},
            create: {
                nome: municipio.nome,
                uf: municipio.uf
            }
        }).catch(async () => {
            // Se der erro, significa que provavelmente já existe
            // Vamos tentar encontrar por nome e UF
            const existing = await prisma.municipio.findFirst({
                where: {
                    nome: municipio.nome,
                    uf: municipio.uf
                }
            });
            
            if (!existing) {
                await prisma.municipio.create({
                    data: {
                        nome: municipio.nome,
                        uf: municipio.uf
                    }
                });
            }
        });
    }

    console.log("✅ Seed completado com sucesso!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("❌ Erro durante o seed:", e);
        await prisma.$disconnect();
        process.exit(1);
    });