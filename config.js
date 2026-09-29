/* ==========================================================================
   CONFIGURAÇÃO DOS PROGRAMAS — IMO
   --------------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar para mudar preços,
   número de WhatsApp, horários ou textos dos programas.
   Todos os cálculos (valor por consulta, economia, parcelas) são feitos
   automaticamente a partir destes números.
   ========================================================================== */

window.IMO_CONFIG = {

  clinica: {
    nome: "Instituto de Medicina Orgânica",
    sigla: "IMO",
    cidade: "Goiânia · GO",
    medico: "Dr. João Carlos Normanha",
    crm: "CRM/GO 16888",
    cnpj: "55.824.724/0001-41",
    // Número no formato internacional, só dígitos: 55 + DDD + número
    whatsapp: "5562993905078",
    whatsappExibicao: "(62) 99390-5078"
  },

  // Primeira consulta: obrigatória antes de qualquer programa
  primeiraConsulta: {
    valor: 550,
    duracao: "1h30",
    modalidade: "Online"
  },

  // Texto fixo do destaque de economia no topo da página
  destaqueEconomia: "até 25%",

  // Consulta avulsa (retorno sem programa) — base para a comparação de economia
  consultaAvulsa: {
    valor: 450,
    modalidade: "Online",
    telemonitoramento: false
  },

  telemonitoramento: {
    canal: "WhatsApp com a farmacêutica da equipe",
    dias: ["Seg", "Qua", "Sex"],          // dias com atendimento
    horario: "12h às 18h",
    observacao: "O horário pode ser alterado em semanas com feriados."
  },

  pagamento: {
    pix: "Pix à vista",
    boleto: { parcelas: 2, texto: "Boleto em até 2x sem juros" },
    cartao: { parcelas: 6, texto: "Cartão de crédito à vista ou em até 6x (acréscimo das taxas da bandeira)" }
  },

  cancelamento: {
    dias: 45,
    texto: "Estornamos o valor integral se o cancelamento for solicitado em até 45 dias após a contratação, mesmo que consultas já tenham sido realizadas."
  },

  programas: [
    {
      id: "intensivo",
      nome: "Intensivo",
      destaque: true,
      selo: "Mais vantajoso",
      resumo: "Para quem está iniciando ou ajustando o tratamento e precisa de proximidade máxima com a equipe.",
      valor: 4000,
      valorConsultaExibido: 330,   // valor por consulta mostrado na página (arredondado)
      consultas: 12,
      frequencia: "Consultas mensais",
      meses: 12,
      telemonitoramentoMeses: 12,
      prioridade: "Prioridade na agenda: consulta em até 2 dias úteis",
      descontoRenovacao: 25,   // % de desconto no ano seguinte (0 = sem desconto)
      beneficios: [
        "12 consultas online, uma por mês",
        "Telemonitoramento durante os 12 meses",
        "Prioridade na agenda: atendimento em até 2 dias úteis",
        "25% de desconto na renovação do próximo ano"
      ]
    },
    {
      id: "completo",
      nome: "Completo",
      destaque: false,
      selo: "12 meses de suporte",
      resumo: "Seis consultas ao longo do ano, com telemonitoramento contínuo entre elas.",
      valor: 2200,
      valorConsultaExibido: 360,   // valor por consulta mostrado na página (arredondado)
      consultas: 6,
      frequencia: "6 consultas em 12 meses",
      meses: 12,
      telemonitoramentoMeses: 12,
      prioridade: null,
      descontoRenovacao: 0,
      beneficios: [
        "6 consultas online ao longo de 12 meses",
        "Telemonitoramento durante os 12 meses"
      ]
    },
    {
      id: "basico",
      nome: "Básico",
      destaque: false,
      selo: "Porta de entrada",
      resumo: "Acompanhamento de 6 meses para quem já tem o tratamento mais estável.",
      valor: 1200,
      consultas: 3,
      frequencia: "3 consultas em 6 meses",
      meses: 6,
      telemonitoramentoMeses: 6,
      prioridade: null,
      descontoRenovacao: 0,
      beneficios: [
        "3 consultas online ao longo de 6 meses",
        "Telemonitoramento durante os 6 meses"
      ]
    }
  ],

  // Mensagens que aparecem prontas no WhatsApp ao clicar nos botões
  mensagens: {
    primeiraConsulta: "Olá! Gostaria de agendar minha primeira consulta online no Instituto de Medicina Orgânica.",
    avulsa: "Olá! Já sou paciente do IMO e gostaria de agendar uma consulta avulsa online.",
    programa: "Olá! Gostaria de aderir ao Programa {PROGRAMA} ({MESES} meses) do IMO.",
    duvida: "Olá! Tenho uma dúvida sobre os programas de acompanhamento do IMO."
  }
};
