import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.ingresso.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.festa.deleteMany();
  await prisma.admin.deleteMany();

  // Criar admin
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@ticketplatform.com',
      hash: 'd02f312c49a3e7b62daccf1f6e925b1872cf4e891ea13d26d4d52b86d1448579',
      nome: 'Administrador',
    },
  });

  console.log('✅ Admin criado:', admin.email);

  // Criar eventos
  const evento1 = await prisma.evento.create({
    data: {
      nome: 'Festival de Música Eletrônica 2025',
      descricao: 'Uma noite inesquecível com os melhores DJs do cenário eletrônico nacional e internacional. Prepare-se para uma experiência única com som de alta qualidade e uma produção espetacular.',
      imagem: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
      data: new Date('2025-08-15T20:00:00Z'),
      local: 'Arena Music Hall - São Paulo',
      preco: 120.00,
      ingressosDisponiveis: 150,
      ingressosTotal: 500,
      linkPagamento: 'https://pagamento.exemplo.com/festival-eletronica',
      termosUso: 'Ao comprar você concorda com nossos termos de entrada.',
      status: 'ativo',
    },
  });

  const evento2 = await prisma.evento.create({
    data: {
      nome: 'Show de Rock Nacional',
      descricao: 'As melhores bandas de rock nacional em uma noite épica.',
      imagem: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      data: new Date('2025-09-20T19:00:00Z'),
      local: 'Estádio do Rock - Rio de Janeiro',
      preco: 80.00,
      ingressosDisponiveis: 20,
      ingressosTotal: 300,
      linkPagamento: 'https://pagamento.exemplo.com/rock-nacional',
      termosUso: 'Proibido menores de 16 anos.',
      status: 'ativo',
    },
  });

  const evento3 = await prisma.evento.create({
    data: {
      nome: 'Festa de Ano Novo 2025',
      descricao: 'Celebre a virada do ano com muita música e diversão.',
      imagem: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
      data: new Date('2025-12-31T22:00:00Z'),
      local: 'Club Premium - Brasília',
      preco: 200.00,
      ingressosDisponiveis: 50,
      ingressosTotal: 200,
      linkPagamento: 'https://pagamento.exemplo.com/ano-novo',
      termosUso: 'Evento exclusivo para maiores de 18 anos.',
      status: 'ativo',
    },
  });

  console.log('✅ Eventos criados:', [evento1.nome, evento2.nome, evento3.nome]);

  // Criar festas para o dashboard admin
  const festa1 = await prisma.festa.create({
    data: {
      nome: 'Festival de Música Eletrônica 2025',
      quantidadeTotal: 500,
      quantidadeVendidos: 350,
      valorUnitario: 120.00,
      data: new Date('2025-08-15T20:00:00Z'),
      status: 'ativa',
    },
  });

  const festa2 = await prisma.festa.create({
    data: {
      nome: 'Show de Rock Nacional',
      quantidadeTotal: 300,
      quantidadeVendidos: 280,
      valorUnitario: 80.00,
      data: new Date('2025-09-20T19:00:00Z'),
      status: 'ativa',
    },
  });

  const festa3 = await prisma.festa.create({
    data: {
      nome: 'Festa de Ano Novo 2025',
      quantidadeTotal: 200,
      quantidadeVendidos: 150,
      valorUnitario: 200.00,
      data: new Date('2025-12-31T22:00:00Z'),
      status: 'ativa',
    },
  });

  console.log('✅ Festas criadas:', [festa1.nome, festa2.nome, festa3.nome]);

  // Criar alguns ingressos de exemplo
  const ingresso1 = await prisma.ingresso.create({
    data: {
      eventoId: evento1.id,
      cpf: '123.456.789-00',
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      hash: 'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef123',
      status: 'ativo',
    },
  });

  const ingresso2 = await prisma.ingresso.create({
    data: {
      eventoId: evento1.id,
      cpf: '987.654.321-00',
      nome: 'Maria Santos',
      email: 'maria@exemplo.com',
      hash: 'def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef123abc456',
      status: 'ativo',
    },
  });

  const ingresso3 = await prisma.ingresso.create({
    data: {
      eventoId: evento2.id,
      cpf: '456.789.123-00',
      nome: 'Pedro Oliveira',
      email: 'pedro@exemplo.com',
      hash: 'ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef123abc456def789',
      status: 'ativo',
    },
  });

  console.log('✅ Ingressos criados:', [ingresso1.nome, ingresso2.nome, ingresso3.nome]);

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

