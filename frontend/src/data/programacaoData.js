// 📅 DADOS DA PROGRAMACAO SEMANAL FLAME
// Identidade: Magenta #FF006E + Cyan #00D4FF + Preto #0A0A0A

export const programacaoSemanal = [
  {
    id: 'quinta',
    dia: 'QUINTA-FEIRA',
    diaSemana: 4,
    titulo: 'FLAME Acustico',
    emoji: '🎵',
    subtitulo: 'Musica ao vivo + happy hour premium',
    descricaoCurta: 'O esquenta perfeito para o fim de semana.',
    descricaoCompleta: 'Toda quinta o FLAME recebe talentos locais para shows intimistas. Violao, voz e muita vibe enquanto voce aproveita nosso Happy Hour. Perfeito para after work, primeiro encontro ou reuniao com amigos.',

    horarios: [
      {
        inicio: '16:00',
        fim: '18:00',
        atividade: 'Abertura + Narguile',
        descricao: 'Comece a noite com calma'
      },
      {
        inicio: '18:00',
        fim: '20:00',
        atividade: 'Happy Hour Premium',
        descricao: '2x1 em drinks selecionados'
      },
      {
        inicio: '20:00',
        fim: '23:00',
        atividade: 'Show Acustico ao vivo',
        descricao: 'Musicos locais em apresentacao intimista'
      },
      {
        inicio: '23:00',
        fim: '02:00',
        atividade: 'DJ Set Chill',
        descricao: 'Indie, MPB moderna, jazz suave'
      }
    ],

    promocoes: [
      {
        icone: '🍹',
        titulo: 'Happy Hour 2x1',
        descricao: 'Drinks autorais selecionados',
        validade: 'ate 20h'
      },
      {
        icone: '🍔',
        titulo: 'Combo Gastronomico',
        preco: 'R$ 85',
        descricao: '1 prato + 2 drinks'
      },
      {
        icone: '💨',
        titulo: 'Narguile Premium',
        preco: 'R$ 80',
        descricao: 'Essencias selecionadas'
      }
    ],

    lineup: [
      { semana: 1, data: '05/12', artista: 'Duo Acoustico', genero: 'MPB/Bossa' },
      { semana: 2, data: '12/12', artista: 'Voz & Violao', genero: 'Folk/Indie' },
      { semana: 3, data: '19/12', artista: 'Trio Carioca', genero: 'Pop Nacional' },
      { semana: 4, data: '26/12', artista: 'Especial Fim de Ano', genero: 'Repertorio Especial' }
    ],

    musica: ['Acustico', 'MPB', 'Indie', 'Jazz suave'],
    publico: '25-45 anos, casais, grupos after work',
    dressCode: 'Casual smart',
    reserva: 'Recomendada para grupos 6+'
  },

  {
    id: 'sexta',
    dia: 'SEXTA-FEIRA',
    diaSemana: 5,
    titulo: 'FLAME Night',
    emoji: '🎧',
    subtitulo: 'DJ convidado + energia maxima',
    descricaoCurta: 'A noite mais quente de Botafogo.',
    descricaoCompleta: 'Sexta e dia de trazer os melhores DJs do Rio para o FLAME. House, tech house e muito brazilian bass. Gastronomia premium, drinks autorais e narguile de classe mundial. A chama acende!',

    horarios: [
      {
        inicio: '16:00',
        fim: '18:00',
        atividade: 'Abertura + Sunset',
        descricao: 'Comece cedo, aproveite mais'
      },
      {
        inicio: '18:00',
        fim: '20:00',
        atividade: 'Happy Hour Premium',
        descricao: '2x1 em drinks selecionados'
      },
      {
        inicio: '20:00',
        fim: '22:00',
        atividade: 'Warm Up DJ',
        descricao: 'DJ residente preparando a vibe'
      },
      {
        inicio: '22:00',
        fim: '02:00',
        atividade: 'DJ Convidado',
        descricao: 'Set completo - House / Tech House'
      }
    ],

    promocoes: [
      {
        icone: '🎟',
        titulo: 'Lista FLAME',
        descricao: 'Prioridade na entrada',
        preco: 'Instagram'
      },
      {
        icone: '🥃',
        titulo: 'Combo Drinks',
        preco: 'R$ 120',
        descricao: '4 drinks autorais'
      },
      {
        icone: '💨',
        titulo: 'Narguile Premium',
        preco: 'R$ 80',
        descricao: 'Essencias internacionais'
      }
    ],

    lineup: [
      { semana: 1, data: '06/12', artista: 'DJ Residente', genero: 'Tech House', bpm: '125-128' },
      { semana: 2, data: '13/12', artista: 'DJ Convidado', genero: 'Deep House', bpm: '120-125' },
      { semana: 3, data: '20/12', artista: 'DJ Special', genero: 'Brazilian Bass', bpm: '128-130' },
      { semana: 4, data: '27/12', artista: 'Especial Reveillon', genero: 'Set especial', bpm: '120-130' }
    ],

    musica: ['Deep House', 'Tech House', 'Brazilian Bass'],
    bpm: '120-128',
    publico: '22-35 anos, grupos de amigos, energia alta',
    dressCode: 'Urbano sofisticado',
    reserva: 'Essencial para mesas'
  },

  {
    id: 'sabado',
    dia: 'SABADO',
    diaSemana: 6,
    titulo: 'FLAME Total',
    emoji: '🔥',
    subtitulo: 'A noite mais quente da semana',
    descricaoCurta: 'DJ premium + casa cheia ate tarde.',
    descricaoCompleta: 'Sabado no FLAME e experiencia completa. Melhor DJ da semana, gastronomia premium, drinks autorais e narguile de classe mundial. A chama que voce NAO pode perder.',
    destaque: true,

    horarios: [
      {
        inicio: '16:00',
        fim: '18:00',
        atividade: 'Abertura + Sunset',
        descricao: 'Narguile e drinks para comecar'
      },
      {
        inicio: '18:00',
        fim: '20:00',
        atividade: 'Pre-Party',
        descricao: 'Gastronomia + Happy Hour'
      },
      {
        inicio: '20:00',
        fim: '22:00',
        atividade: 'FLAME Warming',
        descricao: 'DJ residente elevando a energia'
      },
      {
        inicio: '22:00',
        fim: '03:00',
        atividade: 'FESTA TOTAL',
        descricao: 'DJ Premium - a noite explode!'
      }
    ],

    promocoes: [
      {
        icone: '🍾',
        titulo: 'Garrafa Premium',
        preco: 'R$ 280',
        descricao: 'Mesa reservada + mixers'
      },
      {
        icone: '💨',
        titulo: 'Narguile VIP',
        preco: 'R$ 120',
        descricao: 'Essencias premium importadas'
      },
      {
        icone: '🎁',
        titulo: 'Aniversariante',
        descricao: 'Entrada gratis + drink',
        preco: 'Free'
      }
    ],

    lineup: [
      { semana: 1, data: '07/12', artista: 'DJ Premium', genero: 'House', bpm: '125-130' },
      { semana: 2, data: '14/12', artista: 'DJ Internacional', genero: 'Disco House', bpm: '120-126' },
      { semana: 3, data: '21/12', artista: 'DJ Especial', genero: 'Progressive House', bpm: '128-132' },
      { semana: 4, data: '28/12', artista: 'REVEILLON ESPECIAL', genero: 'Line-up secreto', bpm: '120-132' }
    ],

    temaMes: {
      nome: 'FLAME Party',
      emoji: '🔥',
      descricao: 'Experiencia completa FLAME',
      dressCode: 'Produza-se!',
      premio: 'Surpresas para os melhores looks'
    },

    musica: ['Progressive House', 'Tech House', 'Brazilian Vibes'],
    bpm: '122-130',
    publico: '25-40 anos, celebracoes, grupos grandes',
    dressCode: 'Festa (se produza!)',
    reserva: 'OBRIGATORIA (casa lota as 22h)',
    atencao: '⚠ Casa atinge capacidade maxima. Reserve ou chegue cedo!'
  },

  {
    id: 'domingo',
    dia: 'DOMINGO',
    diaSemana: 0,
    titulo: 'FLAME Relax',
    emoji: '🌅',
    subtitulo: 'Jazz, bossa e MPB ao vivo',
    descricaoCurta: 'Vibe sunset para fechar o fim de semana com classe.',
    descricaoCompleta: 'Domingo e o dia de desacelerar com estilo. Jazz ao vivo, drinks classicos, gastronomia premium e narguile em ambiente intimista. Perfeito para casais, encontros ou simplesmente curtir musica boa.',

    horarios: [
      {
        inicio: '16:00',
        fim: '18:00',
        atividade: 'Sunset Session',
        descricao: 'Narguile + drinks leves'
      },
      {
        inicio: '18:00',
        fim: '20:00',
        atividade: 'MPB / Bossa Nova',
        descricao: 'Musica ambiente ao vivo'
      },
      {
        inicio: '20:00',
        fim: '23:00',
        atividade: 'Jazz ao vivo',
        descricao: 'Standards e classicos'
      },
      {
        inicio: '23:00',
        fim: '02:00',
        atividade: 'Bossa Lounge',
        descricao: 'DJ set relaxante'
      }
    ],

    promocoes: [
      {
        icone: '🍷',
        titulo: 'Vinho Premium',
        preco: 'R$ 120',
        descricao: 'Garrafa selecionada'
      },
      {
        icone: '🍹',
        titulo: 'Drinks Classicos',
        descricao: 'Old Fashioned, Manhattan, Negroni',
        desconto: '-20%'
      },
      {
        icone: '💨',
        titulo: 'Narguile Relax',
        preco: 'R$ 70',
        descricao: 'Essencias suaves'
      }
    ],

    lineup: [
      { semana: 1, data: '08/12', artista: 'Trio Bossa Carioca', genero: 'Bossa Nova' },
      { semana: 2, data: '15/12', artista: 'Jazz Standards', genero: 'Jazz Covers' },
      { semana: 3, data: '22/12', artista: 'MPB Moderna', genero: 'Releituras MPB' },
      { semana: 4, data: '29/12', artista: 'Especial Fim de Ano', genero: 'Best Of 2024' }
    ],

    musica: ['Bossa Nova', 'Jazz', 'MPB Moderna'],
    bpm: '80-100',
    publico: '28-50 anos, casais, musica ao vivo lovers',
    dressCode: 'Casual elegante',
    reserva: 'Recomendada (ambiente mais intimista)'
  }
];

// 🎉 EVENTOS ESPECIAIS MENSAIS
export const eventosEspeciais = [
  {
    id: 'flame-night-especial',
    titulo: 'FLAME Night Especial',
    emoji: '🔥',
    tipo: 'Festa Tematica',
    descricao: 'Noites tematicas especiais com decoracao, drinks exclusivos e DJs convidados.',
    frequencia: '1x por mes',
    proximaData: '15 de Dezembro (Sexta)',

    comoFunciona: [
      'Decoracao tematica especial',
      'Drinks exclusivos do tema',
      'DJ convidado especial',
      'Narguile com essencias tematicas',
      'Gastronomia especial'
    ],

    inclui: [
      'Entrada com drink de boas-vindas',
      'Ambiente totalmente tematico',
      'DJ set especial',
      'Sorteios e brindes'
    ],

    investimento: 'R$ 80/pessoa (com drink)',
    vagas: '100 pessoas',
    horario: '20h-03h',
    dressCode: 'Tematico (opcional mas incentivado)'
  },

  {
    id: 'flame-corporativo',
    titulo: 'FLAME Corporativo',
    emoji: '💼',
    tipo: 'Eventos Empresariais',
    descricao: 'Eventos corporativos exclusivos com toda a experiencia FLAME.',
    frequencia: 'Sob demanda',

    inclui: [
      'Espaco reservado',
      'Open bar drinks autorais',
      'Gastronomia premium',
      'Narguile premium',
      'DJ/playlist personalizada'
    ],

    investimento: 'R$ 150/pessoa (minimo 25 pessoas)',
    horario: '16h-23h (flexivel)',

    idealPara: [
      'Confraternizacoes',
      'Lancamentos de produtos',
      'Team building',
      'Networking empresarial'
    ]
  },

  {
    id: 'flame-aniversario',
    titulo: 'FLAME Aniversario',
    emoji: '🎂',
    tipo: 'Comemoracao Especial',
    descricao: 'Comemore seu aniversario com estilo no FLAME!',

    inclui: [
      'Bolo + vela + cantoria',
      '1 drink especial gratis',
      'Post nos stories @flame',
      '10% desconto na conta do grupo'
    ],

    investimento: 'A partir de R$ 250 (bolo + decoracao)',
    minPessoas: '8 pessoas',
    horarioCantoria: '22h',

    adicionais: [
      { item: 'Decoracao tematica', preco: '+R$ 200' },
      { item: 'Foto profissional', preco: '+R$ 250' },
      { item: 'Garrafa personalizada', preco: '+R$ 150' }
    ],

    comoFunciona: [
      'Avisar com 5 dias de antecedencia',
      'Escolher sabor bolo',
      'Reservar mesa (minimo 8 pessoas)',
      'No dia: cantoria as 22h'
    ]
  },

  {
    id: 'flame-reveillon',
    titulo: 'FLAME Reveillon',
    emoji: '🎆',
    tipo: 'Festa de Fim de Ano',
    descricao: 'A virada mais quente de Botafogo!',
    data: '31 de Dezembro',

    inclui: [
      'Open bar premium 5h',
      'Ceia de Ano Novo',
      'DJ + banda ao vivo',
      'Espumante na virada',
      'Narguile incluso',
      'Brinde especial'
    ],

    investimento: 'R$ 450/pessoa (lote promocional)',
    horario: '21h-05h',
    vagas: 'Limitadas - reserve com antecedencia',
    dressCode: 'Festa (branco ou dourado)'
  }
];

// 🍹 HAPPY HOUR PERMANENTE
export const happyHour = {
  titulo: 'FLAME Happy Hour',
  emoji: '🔥',
  descricao: '2 DRINKS PELO PRECO DE 1',
  horario: 'Segunda a Domingo | 16h as 20h',

  validoPara: [
    'Drinks autorais selecionados',
    'Gin Tonica Premium',
    'Cervejas especiais',
    'Caipirinhas'
  ],

  combo: {
    nome: 'Combo FLAME Experience',
    preco: 'R$ 95',
    inclui: '2 drinks + 1 porcao + narguile basico'
  }
};

// ❓ FAQ
export const faq = [
  {
    pergunta: 'Preciso reservar mesa?',
    resposta: 'Para quinta e domingo, recomendado para grupos 6+. Para sexta e sabado, reserva e essencial pois a casa lota rapido (especialmente apos 22h).'
  },
  {
    pergunta: 'Qual o melhor dia para ir?',
    resposta: 'Depende do que voce busca! Quinta para algo mais tranquilo com musica ao vivo, sexta para DJ e energia alta, sabado para a festa total, e domingo para relaxar com jazz e bossa.'
  },
  {
    pergunta: 'Tem musica ao vivo toda semana?',
    resposta: 'Sim! Toda quinta temos show acustico ao vivo (20h-23h) e todo domingo temos jazz/MPB ao vivo (20h-23h).'
  },
  {
    pergunta: 'Como funciona o narguile?',
    resposta: 'Oferecemos essencias premium internacionais com equipamentos de alta qualidade. Temos opcoes desde basicas ate VIP com essencias importadas exclusivas.'
  },
  {
    pergunta: 'Tem dress code?',
    resposta: 'Quinta e domingo: casual elegante. Sexta: urbano sofisticado. Sabado: festa, se produza! O importante e estar confortavel e com estilo.'
  },
  {
    pergunta: 'A partir de que horas abre?',
    resposta: 'Abrimos as 16h todos os dias! Venha aproveitar o sunset e o happy hour.'
  },
  {
    pergunta: 'Qual a capacidade do FLAME?',
    resposta: 'Temos 120 lugares em ambiente premium. Sabados lotam rapido (geralmente 22h ja estamos no limite). Reserve com antecedencia!'
  },
  {
    pergunta: 'Aceitam cartao?',
    resposta: 'Sim! Aceitamos todos os cartoes (debito/credito), PIX e dinheiro.'
  },
  {
    pergunta: 'Tem estacionamento?',
    resposta: 'Temos convenio com estacionamento a 50m do FLAME. Apresente o cupom para desconto.'
  }
];

// 🔜 PROXIMAS ATRACOES (Timeline)
export const proximasAtracoes = [
  {
    id: 1,
    mes: 'DEZ',
    dia: '15',
    titulo: 'FLAME Night Especial',
    subtitulo: 'Festa Tematica',
    tipo: 'evento-especial',
    status: 'vagas-limitadas'
  },
  {
    id: 2,
    mes: 'DEZ',
    dia: '31',
    titulo: 'Reveillon',
    subtitulo: 'Virada 2025',
    tipo: 'festa-especial',
    status: 'last-tickets'
  },
  {
    id: 3,
    mes: 'JAN',
    dia: '10',
    titulo: 'FLAME Verao',
    subtitulo: 'Festa Tropical',
    tipo: 'tema-mensal',
    status: 'em-breve'
  },
  {
    id: 4,
    mes: 'FEV',
    dia: '14',
    titulo: 'FLAME Love',
    subtitulo: 'Valentine Special',
    tipo: 'evento-especial',
    status: 'em-breve'
  },
  {
    id: 5,
    mes: 'MAR',
    dia: '20',
    titulo: 'FLAME Anniversary',
    subtitulo: '1 Ano FLAME',
    tipo: 'mega-festa',
    status: 'em-breve'
  }
];

export default {
  programacaoSemanal,
  eventosEspeciais,
  happyHour,
  faq,
  proximasAtracoes
};
