// Dados dos 27 slides da apresentação FLAME
export const slidesData = [
  // SLIDE 1: CAPA
  {
    id: 1,
    type: 'cover',
    background: 'gradient-orange',
    content: {
      title: 'FLAME',
      subtitle: 'Lounge Bar | Botafogo, Rio de Janeiro\nProposta de Investimento',
      icons: ['network', 'zap', 'trending-up']
    }
  },

  // SLIDE 2: O QUE É FLAME
  {
    id: 2,
    type: 'three-columns',
    title: 'O QUE É FLAME?',
    columns: [
      {
        icon: 'target',
        title: 'CONCEITO',
        items: [
          'Pub descontraído com drinks autorais',
          'Música ao vivo + DJ sets',
          'Ambiente social e energético'
        ]
      },
      {
        icon: 'users',
        title: 'PÚBLICO-ALVO',
        items: [
          'Idade: 25-45 anos',
          'Classe: A/B',
          'Gasto médio: R$ 100/pessoa',
          'Frequência: Semanal'
        ]
      },
      {
        icon: 'star',
        title: 'DIFERENCIAL',
        items: [
          '8ª rua mais cool do mundo',
          'Movimento garantido',
          'Público disposto a gastar'
        ]
      }
    ]
  },

  // SLIDE 3: CONCEITO VISUAL
  {
    id: 3,
    type: 'grid-2x2',
    title: 'CONCEITO FLAME',
    grid: [
      {
        icon: 'wine',
        title: 'DRINKS AUTORAIS',
        items: ['Coquetelaria premium', 'Bartenders especializados', 'Margem: 70%']
      },
      {
        icon: 'music',
        title: 'MÚSICA AO VIVO',
        items: ['Jazz, R&B, House', 'DJs e bandas', 'Eventos semanais']
      },
      {
        icon: 'home',
        title: 'AMBIENTE',
        items: ['Design sofisticado', 'Iluminação conceitual', 'Capacidade 60 pessoas']
      },
      {
        icon: 'star',
        title: 'EXPERIÊNCIA',
        items: ['Atendimento premium', 'Instagramável', 'Fidelização']
      }
    ]
  },

  // SLIDE 4: POR QUE BOTAFOGO?
  {
    id: 4,
    type: 'location',
    title: 'POR QUÊ ARNALDO QUINTELA?',
    highlight: {
      icon: 'award',
      text: '8ª RUA MAIS COOL DO MUNDO',
      subtitle: 'Ranking Time Out Magazine 2024'
    },
    blocks: [
      { icon: 'trending-up', title: '+15 BARES', text: 'Abertos em 12 meses' },
      { icon: 'dollar-sign', title: 'VALORIZAÇÃO', text: 'Imóveis +40% em 2 anos' },
      { icon: 'users', title: 'PÚBLICO JOVEM', text: 'Alto poder aquisitivo' },
      { icon: 'clock', title: 'TIMING PERFEITO', text: 'Antes da saturação' }
    ],
    footer: 'Referências: Quartinho, Culto, Comuna\nTodos com fila de 2h+ todo fim de semana'
  },

  // SLIDE 5: INVESTIMENTO - VISÃO GERAL
  {
    id: 5,
    type: 'investment-overview',
    title: 'INVESTIMENTO TOTAL',
    amount: 'R$ 300.000',
    subtitle: 'Investimento único, parcelado em 3x',
    breakdown: [
      { icon: 'building', label: 'Infraestrutura', percent: 58, value: 'R$ 175.000' },
      { icon: 'settings', label: 'Equipamentos', percent: 28, value: 'R$ 82.500' },
      { icon: 'file-text', label: 'Legalização', percent: 14, value: 'R$ 42.500' }
    ],
    footer: [
      'Orçamento fechado - Sem surpresas',
      'Margem de segurança de 15% incluída',
      'Tudo mapeado e justificado'
    ]
  },

  // SLIDE 6: INVESTIMENTO - PARCELAMENTO
  {
    id: 6,
    type: 'timeline-horizontal',
    title: 'COMO VOCÊ VAI INVESTIR',
    timeline: [
      {
        day: 'DIA 30',
        parcela: '1ª Parcela',
        valor: 'R$ 100.000',
        etapa: 'Após contrato',
        validacao: 'CNPJ ativo'
      },
      {
        day: 'DIA 75',
        parcela: '2ª Parcela',
        valor: 'R$ 100.000',
        etapa: 'Após licenças',
        validacao: 'AVCB emitido'
      },
      {
        day: 'DIA 150',
        parcela: '3ª Parcela',
        valor: 'R$ 100.000',
        etapa: 'Início montagem',
        validacao: 'Espaço pronto'
      }
    ],
    highlight: {
      icon: 'shield',
      title: 'PROTEÇÃO',
      text: 'Você valida cada etapa antes\nde liberar o próximo valor'
    }
  },

  // SLIDE 7: FATURAMENTO PROJETADO
  {
    id: 7,
    type: 'calculation',
    title: 'FATURAMENTO MENSAL',
    steps: [
      { label: 'CAPACIDADE', calc: '60 pessoas × 75% ocupação', result: '45 pessoas' },
      { label: 'ROTAÇÃO', calc: '1,5h permanência', result: '4 giros em 6h' },
      { label: 'MOVIMENTO DIÁRIO', calc: '45 × 4', result: '180 pessoas/dia' },
      { label: 'TICKET MÉDIO', calc: 'R$ 80 por pessoa', result: '(conservador)' },
      { label: 'FATURAMENTO DIA', calc: '180 × R$ 80', result: 'R$ 14.400' },
      { label: 'FATURAMENTO MÊS BASE', calc: 'R$ 14.400 × 16 dias', result: 'R$ 230.400/mês' },
      { label: '+ PATROCÍNIOS/COLLABS', calc: 'Marcas, eventos', result: 'R$ 5.000/mês' },
      { label: 'FATURAMENTO TOTAL', calc: 'R$ 230.400 + R$ 5.000', result: 'R$ 235.400/mês', highlight: true }
    ]
  },

  // SLIDE 8: CUSTOS E MARGEM
  {
    id: 8,
    type: 'waterfall',
    title: 'DE ONDE VEM O LUCRO?',
    waterfall: [
      { label: 'RECEITA BRUTA', value: 'R$ 235.400', percent: '100%', type: 'positive' },
      { label: 'Custos Variáveis', value: '-R$ 111.800', percent: '47,5%', type: 'negative' },
      { label: 'MARGEM CONTRIBUIÇÃO', value: 'R$ 123.600', percent: '52,5%', type: 'positive' },
      { label: 'Custos Fixos', value: '-R$ 61.460', percent: '26,1%', type: 'negative' },
      { label: 'EBITDA', value: 'R$ 62.140', percent: '26,4%', type: 'positive' },
      { label: 'Pró-labore', value: '-R$ 39.000', percent: '16,6%', type: 'negative' },
      { label: 'Antes Impostos', value: 'R$ 23.140', percent: '9,8%', type: 'positive' },
      { label: 'Impostos Simples 6%', value: '-R$ 14.124', percent: '6%', type: 'negative' },
      { label: 'LUCRO LÍQUIDO', value: 'R$ 9.016', percent: '3,8%', type: 'final' }
    ],
    observacao: {
      items: [
        'Cenário BASE conservador',
        'META: R$ 280k/mês = 14% lucro líquido',
        'Diferença: +20% ocupação + patrocínios'
      ]
    }
  },

  // SLIDE 9: SEU RETORNO MENSAL
  {
    id: 9,
    type: 'return-3scenarios',
    title: 'QUANTO VOCÊ RECEBE TODO MÊS',
    scenarios: [
      {
        emoji: 'frown',
        title: 'CENÁRIO BASE (R$ 235k/mês)',
        proLabore: 'R$ 15.000/mês',
        lucro: 'R$ 2.254/mês (50% de R$ 4.508)',
        total: 'R$ 17.254/mês',
        subtitle: 'Pró-labore fixo + Lucro distribuído após 6 meses'
      },
      {
        emoji: 'smile',
        title: 'CENÁRIO REALISTA (R$ 280k/mês)',
        proLabore: 'R$ 15.000/mês',
        lucro: 'R$ 16.800/mês (50%)',
        total: 'R$ 31.800/mês',
        subtitle: 'META: Atingir em 3-6 meses',
        highlight: true
      },
      {
        emoji: 'rocket',
        title: 'CENÁRIO OTIMISTA (R$ 350k/mês)',
        proLabore: 'R$ 15.000/mês',
        lucro: 'R$ 32.500/mês (50%)',
        total: 'R$ 47.500/mês',
        subtitle: 'Alta temporada + eventos especiais'
      }
    ],
    footer: [
      'META: Atingir cenário REALISTA em 3-6 meses',
      'Sua participação ativa em patrocínios acelera resultado'
    ]
  },

  // SLIDE 10: PAYBACK E ROI
  {
    id: 10,
    type: 'payback-roi-3scenarios',
    title: 'QUANDO VOCÊ RECUPERA O INVESTIMENTO',
    payback: {
      scenarios: [
        { label: 'CENÁRIO BASE', meses: '17,4 meses', recebe: 'R$ 17.254/mês' },
        { label: 'CENÁRIO REALISTA', meses: '9,4 meses', recebe: 'R$ 31.800/mês', highlight: true },
        { label: 'CENÁRIO OTIMISTA', meses: '6,3 meses', recebe: 'R$ 47.500/mês' }
      ],
      timelineRealista: [
        { mes: 'Mês 1', valor: '-R$ 268.200' },
        { mes: 'Mês 3', valor: '-R$ 204.600' },
        { mes: 'Mês 6', valor: '-R$ 109.200' },
        { mes: 'Mês 9', valor: '-R$ 13.800' },
        { mes: 'Mês 10', valor: '+R$ 18.000' }
      ]
    },
    roi: {
      scenarios: [
        {
          label: 'CENÁRIO BASE',
          recebeAno: 'R$ 207.048',
          roiAno: '69% ao ano'
        },
        {
          label: 'CENÁRIO REALISTA',
          recebeAno: 'R$ 381.600',
          roiAno: '127% ao ano',
          doisAnos: 'R$ 763.200 total | R$ 463.200 lucro (154%)',
          highlight: true
        },
        {
          label: 'CENÁRIO OTIMISTA',
          recebeAno: 'R$ 570.000',
          roiAno: '190% ao ano'
        }
      ]
    },
    footer: [
      'Trabalhamos para atingir cenário REALISTA',
      'Base é piso de segurança mínimo'
    ]
  },

  // SLIDE 11: CENÁRIOS COMPARADOS
  {
    id: 11,
    type: 'scenarios-table',
    title: '3 CENÁRIOS DE FATURAMENTO',
    table: {
      headers: ['CENÁRIO', 'Ocupação', 'Fat./Mês', 'Seu Ganho/Mês', 'ROI/Ano', 'Payback'],
      rows: [
        { emoji: 'frown', label: 'Base', ocupacao: '70%', fat: 'R$ 235k', recebe: 'R$ 17.254', roi: '69%', payback: '17 meses' },
        { emoji: 'smile', label: 'Realista', ocupacao: '80%', fat: 'R$ 280k', recebe: 'R$ 31.800', roi: '127%', payback: '9 meses', highlight: true },
        { emoji: 'rocket', label: 'Otimista', ocupacao: '90%', fat: 'R$ 350k', recebe: 'R$ 47.500', roi: '190%', payback: '6 meses' }
      ]
    },
    breakdown: {
      title: 'BREAKDOWN REALISTA:',
      items: [
        'Faturamento bar:       R$ 275.000',
        '+ Patrocínios/Collabs: R$ 5.000',
        'TOTAL:                 R$ 280.000/mês'
      ]
    },
    footer: [
      'META: Cenário REALISTA em 3-6 meses',
      'Base: Piso mínimo de segurança',
      'Otimista: Alta temporada + eventos especiais',
      'Patrocínios aceleram resultado'
    ]
  },

  // SLIDE 12: AS 5 ENGRENAGENS
  {
    id: 12,
    type: 'diagram',
    title: 'COMO UM BAR FUNCIONA',
    diagram: [
      { icon: 'wine', label: 'PRODUTO' },
      { icon: 'users', label: 'PESSOAS' },
      { icon: 'dollar-sign', label: 'DINHEIRO' },
      { icon: 'bar-chart-3', label: 'GESTÃO' },
      { icon: 'smartphone', label: 'MARKETING' }
    ],
    explanation: '5 sistemas que precisam funcionar perfeitamente\n\nSe UM travar → Negócio para\nVou explicar cada um nos próximos slides'
  },

  // SLIDE 13: ENGRENAGEM 1 - PRODUTO
  {
    id: 13,
    type: 'gear-product',
    title: 'ENGRENAGEM 1: PRODUTO',
    sections: [
      {
        title: 'O QUE VENDEMOS:',
        items: [
          'Drinks        60% receita   Margem 70%',
          'Comida        30% receita   Margem 60%',
          'Experiência   10% receita   Margem N/A'
        ]
      },
      {
        title: 'ESTRATÉGIA DE PRECIFICAÇÃO:',
        items: [
          'Drinks autorais      R$ 28-35',
          'Cervejas premium     R$ 18-24',
          'Petiscos            R$ 35-65'
        ]
      },
      {
        title: 'CMV OTIMIZADO: 30%',
        highlight: true,
        items: [
          'Para cada R$ 100 vendidos:',
          '→ R$ 30 custo do produto (consignado)',
          '→ R$ 70 margem bruta'
        ]
      },
      {
        title: 'CONSIGNADO 30/45/60 DIAS',
        highlight: true,
        items: [
          'Distribuidora parceira',
          'Reduz capital de giro inicial',
          'Paga só após vender'
        ]
      }
    ]
  },

  // SLIDE 14: ENGRENAGEM 2 - PESSOAS
  {
    id: 14,
    type: 'organogram',
    title: 'ENGRENAGEM 2: PESSOAS',
    organogram: {
      gestor: 'GESTÃO',
      areas: [
        { nome: 'BARTENDERS', pessoas: '2 pessoas', custo: 'R$ 8k/mês' },
        { nome: 'GARÇONS', pessoas: '3 pessoas', custo: 'R$ 9k/mês' },
        { nome: 'COZINHA', pessoas: '1 pessoa', custo: 'R$ 4k/mês' },
        { nome: 'SEGURANÇA', pessoas: '1 pessoa', custo: 'R$ 3,5k/mês' },
        { nome: 'LIMPEZA', pessoas: '1 pessoa', custo: 'R$ 2,5k/mês' }
      ],
      total: {
        folha: 'R$ 27.000',
        encargos: 'R$ 11.000',
        total: 'R$ 38.000/mês (17% da receita)'
      }
    },
    decisoes: [
      'Contrata: Leonardo',
      'Treina:   Leonardo',
      'Demite:   Leonardo',
      'Aprova:   Rodrigo (>R$ 8k/mês)'
    ]
  },

  // SLIDE 15: ENGRENAGEM 3 - DINHEIRO
  {
    id: 15,
    type: 'cashflow',
    title: 'ENGRENAGEM 3: DINHEIRO',
    entrada: {
      title: 'ENTRADA',
      items: [
        '70% Cartão (cai em 30 dias)',
        '30% Dinheiro/Pix (cai na hora)'
      ]
    },
    saida: {
      title: 'SAÍDA',
      items: [
        'Fornecedores    Dia 30',
        'Funcionários    Dia 5',
        'Aluguel         Dia 10',
        'Fixos          Conforme vencimento'
      ]
    },
    controle: {
      title: 'CONTROLE',
      items: [
        'Sistema PDV rastreia tudo',
        'Rodrigo tem acesso em tempo real',
        'Relatório semanal automático',
        'Reunião mensal de números'
      ]
    },
    alcadas: {
      title: 'ALÇADAS',
      items: [
        'Até R$ 5k:        Leonardo decide',
        'R$ 5k - R$ 20k:   Leonardo decide + avisa Rodrigo',
        'Acima R$ 20k:     Precisa aprovação Rodrigo'
      ]
    }
  },

  // SLIDE 16: ENGRENAGEM 4 - GESTÃO
  {
    id: 16,
    type: 'management',
    title: 'ENGRENAGEM 4: GESTÃO',
    controls: [
      { icon: 'package', title: 'ESTOQUE', items: ['Inventário semanal', 'Meta: Zero sumiço'] },
      { icon: 'check-circle', title: 'QUALIDADE', items: ['Checklists diários', 'Padrão de excelência'] },
      { icon: 'trash-2', title: 'DESPERDÍCIO', items: ['Meta: Máx 3% faturamento', 'Tudo registrado'] }
    ],
    kpis: {
      title: 'KPIs QUE OS SÓCIOS ACOMPANHAM:',
      items: [
        { label: 'CMV', target: '≤ 30%' },
        { label: 'Ocupação', target: '≥ 75%' },
        { label: 'Ticket Médio', target: 'R$ 100' },
        { label: 'Satisfação', target: '4,5★' },
        { label: 'Desperdício', target: '≤ 3%' },
        { label: 'Patrocínios', target: 'R$ 5k/mês' }
      ]
    }
  },

  // SLIDE 17: ENGRENAGEM 5 - MARKETING
  {
    id: 17,
    type: 'marketing',
    title: 'ENGRENAGEM 5: MARKETING',
    digital: {
      title: 'DIGITAL (70% do esforço)',
      items: [
        'Instagram:  Posts + Stories diários',
        'Meta:       10k seguidores em 6 meses',
        'Influencers: 3 por mês (micro/mid)',
        'Google:     Avaliações 4,5★+',
        'Responsável: Luiz Mariano'
      ]
    },
    offline: {
      title: 'OFFLINE (30% do esforço)',
      items: [
        'Boca a boca:  Melhor canal',
        'Parcerias:    Bares da rua',
        'Eventos:      Semanais temáticos',
        'Responsável: Luiz + Figueiredo'
      ]
    },
    investimento: {
      value: 'R$ 1.500/mês',
      note: '(Luiz executa internamente)'
    },
    retorno: '+100 clientes novos/mês',
    patrocinios: {
      title: 'PATROCÍNIOS E COLLABS',
      items: [
        'Marcas de bebidas: R$ 2-3k/mês',
        'Eventos corporativos: R$ 3-5k/evento',
        'Parcerias influencers: Barter',
        'META: R$ 5-8k/mês',
        'Responsável: Azevedo (network) + Luiz (execução)'
      ]
    }
  },

  // SLIDE 18: PAPÉIS DOS SÓCIOS
  {
    id: 18,
    type: 'roles-4partners',
    title: 'PAPÉIS E RESPONSABILIDADES',
    partners: [
      {
        name: 'AZEVEDO',
        percent: '50%',
        role: 'Capital + Network',
        tasks: [
          'Investimento R$ 300k',
          'Network corporativo e VIP',
          'Aprovar gastos >R$ 20k',
          'Decisões estratégicas',
          'Revisar números mensais'
        ],
        dedicacao: 'Reunião semanal 30min'
      },
      {
        name: 'LEONARDO',
        percent: '23%',
        role: 'Operação Diária',
        tasks: [
          'Operação dia a dia',
          'Fornecedores e compras',
          'Cardápio e precificação',
          'Resolver problemas imediatos',
          'Eventos e parcerias'
        ],
        dedicacao: '5-6 noites/semana'
      },
      {
        name: 'FIGUEIREDO',
        percent: '23%',
        role: 'Gestão Operacional',
        tasks: [
          'Gestão de equipe',
          'Contratação e treinamento',
          'Controle de qualidade',
          'Processos e padrões',
          'Suporte à operação'
        ],
        dedicacao: '4-5 noites/semana'
      },
      {
        name: 'LUIZ MARIANO',
        percent: '4%',
        role: 'Marketing',
        tasks: [
          'Marketing digital (Instagram)',
          'Relacionamento com influencers',
          'Eventos e divulgação',
          'Conteúdo e branding',
          'Crescimento online'
        ],
        dedicacao: 'Digital + eventos'
      }
    ],
    juntos: {
      title: 'DECISÕES EM CONJUNTO',
      items: [
        'Reunião semanal 30min',
        'Planejamento mensal',
        'Gastos acima de R$ 20k',
        'Contratações-chave',
        'Decisões estratégicas'
      ]
    }
  },

  // SLIDE 19: ESTRUTURA SOCIETÁRIA
  {
    id: 19,
    type: 'society',
    title: 'ESTRUTURA SOCIETÁRIA',
    participacao: [
      { socio: 'Rodrigo Azevedo', percent: '50%', valor: 'R$ 300k investimento' },
      { socio: 'Leonardo Palha', percent: '23%', valor: 'Gestão operacional/financeira' },
      { socio: 'Rodrigo Figueiredo', percent: '23%', valor: 'Operacional/segurança' },
      { socio: 'Luiz Mariano', percent: '4%', valor: 'Marketing digital' }
    ],
    proLabore: {
      items: [
        { socio: 'Azevedo', valor: 'R$ 15.000' },
        { socio: 'Leonardo', valor: 'R$ 10.000' },
        { socio: 'Figueiredo', valor: 'R$ 10.000' },
        { socio: 'Luiz Mariano', valor: 'R$ 4.000' }
      ],
      total: 'R$ 39.000/mês (16,6% da receita)'
    },
    lucro: [
      'Primeiros 6 meses:  100% reinvestido',
      'Após 6 meses:       50% distribuído',
      'Proporção:          50/23/23/4'
    ],
    consignado: {
      title: 'CAPITAL DE GIRO OTIMIZADO',
      items: [
        'Bebidas em consignado: 30/45/60 dias',
        'Reduz necessidade de caixa inicial',
        'Fornecedores principais já confirmados',
        'Melhora fluxo de caixa nos primeiros meses'
      ]
    },
    marca: {
      title: 'MARCA "FLAME"',
      items: [
        'Registrada em nome: Leonardo',
        'Sociedade:          Licencia (não possui)',
        'Proteção mútua:     Se der ruim, sem marca queimada'
      ]
    }
  },

  // SLIDE 20: COMO TOMAMOS DECISÕES
  {
    id: 20,
    type: 'decisions-table',
    title: 'REGRAS DE DECISÃO',
    categories: [
      {
        tipo: 'LEONARDO DECIDE SOZINHO',
        items: [
          'Operação dia a dia (até R$ 5k)',
          'Contratações (até R$ 5k/mês)',
          'Fornecedores (até R$ 10k/mês)',
          'Cardápio e preços (sem limite)'
        ]
      },
      {
        tipo: 'DECISÕES EM CONJUNTO',
        highlight: true,
        items: [
          'Gastos grandes (>R$ 20k)',
          'Contratações-chave (>R$ 8k/mês)',
          'Estratégia (sempre)',
          'Expansão/venda (sempre)'
        ]
      },
      {
        tipo: 'SE DISCORDARMOS',
        items: [
          '1. Conversa (15 dias)',
          '2. Mediação OAB (30 dias)',
          '3. Processo (último recurso)',
          'Objetivo: NUNCA chegar no 3'
        ]
      }
    ]
  },

  // SLIDE 21: TIMELINE VISUAL
  {
    id: 21,
    type: 'timeline-horizontal',
    title: 'DO ZERO AO LUCRO: 7 MESES',
    timeline: [
      { mes: 'MÊS 1', fase: 'Papelada', custo: 'R$ 5k', icon: 'file-text', detalhe: 'Contrato' },
      { mes: 'MÊS 2-3', fase: 'Licenças', custo: 'R$ 8k', icon: 'landmark', detalhe: 'Alvarás' },
      { mes: 'MÊS 4-5', fase: 'Reforma', custo: 'R$ 175k', icon: 'building', detalhe: 'Obras' },
      { mes: 'MÊS 6', fase: 'Montagem', custo: 'R$ 82k', icon: 'settings', detalhe: 'Equipe' },
      { mes: 'MÊS 7', fase: 'Opening', custo: '+R$ 100k', icon: 'party-popper', detalhe: 'Soft/Grand Opening' },
      { mes: 'MÊS 8+', fase: 'Lucro', custo: 'Recorrente', icon: 'dollar-sign', detalhe: 'Operação Estável' }
    ],
    highlight: [
      'Total: 217 dias',
      'Fases validadas por checkpoint',
      'Rodrigo aprova antes de cada avanço'
    ]
  },

  // SLIDE 22: FASES RESUMIDAS (1/2)
  {
    id: 22,
    type: 'phases-1',
    title: 'AS 6 FASES DO PROJETO',
    fases: [
      {
        numero: 1,
        nome: 'LEGALIZAÇÃO',
        tempo: '45 dias',
        custo: 'R$ 8k',
        descricao: 'CNPJ, alvarás, licenças',
        deposito: 'Rodrigo deposita R$ 100k',
        checkpoint: 'Licenças aprovadas'
      },
      {
        numero: 2,
        nome: 'REFORMA',
        tempo: '60 dias',
        custo: 'R$ 175k',
        descricao: 'Obras, decoração, som, luz',
        deposito: 'Rodrigo deposita R$ 100k',
        checkpoint: 'Espaço pronto'
      },
      {
        numero: 3,
        nome: 'MONTAGEM',
        tempo: '30 dias',
        custo: 'R$ 82k',
        descricao: 'Equipamentos, estoque, equipe',
        deposito: 'Rodrigo deposita R$ 100k',
        checkpoint: 'Tudo operacional'
      }
    ]
  },

  // SLIDE 23: FASES RESUMIDAS (2/2)
  {
    id: 23,
    type: 'phases-2',
    title: 'AS 6 FASES DO PROJETO (cont.)',
    fases: [
      {
        numero: 4,
        nome: 'MARKETING',
        tempo: '15 dias',
        custo: 'R$ 8k',
        descricao: 'Divulgação, influencers, imprensa',
        checkpoint: '200+ na lista VIP'
      },
      {
        numero: 5,
        nome: 'SOFT OPENING',
        tempo: '7 dias',
        custo: 'GERA +R$ 19k',
        descricao: 'Teste operacional, ajustes',
        checkpoint: 'Processo refinado',
        lucro: true
      },
      {
        numero: 6,
        nome: 'GRAND OPENING',
        tempo: '30 dias',
        custo: 'GERA +R$ 80k',
        descricao: 'Abertura oficial, estabilização',
        checkpoint: 'Lucratividade provada',
        lucro: true
      }
    ],
    destaque: {
      title: 'Fases 5 e 6 JÁ GERAM LUCRO',
      subtitle: 'Não é só investimento!',
      extra: 'CAPITAL DE GIRO OTIMIZADO\nBebidas em consignado 30/45/60 dias\nReduz necessidade de caixa inicial'
    }
  },

  // SLIDE 24: RISCOS E PROTEÇÕES
  {
    id: 24,
    type: 'risks',
    title: 'O QUE PODE DAR ERRADO',
    risks: [
      { icon: 'file-text', risco: 'Licenças atrasam', protecao: 'Despachante + processo mapeado' },
      { icon: 'dollar-sign', risco: 'Reforma estoura', protecao: '3 orçamentos + contrato fechado' },
      { icon: 'users', risco: 'Não lota início', protecao: 'Marketing antecipado + soft opening' },
      { icon: 'wrench', risco: 'Equipe ruim', protecao: 'Treinamento + período experiência' },
      { icon: 'swords', risco: 'Conflito sócios', protecao: 'Contrato com mediação' }
    ],
    footer: [
      'Para cada problema, existe solução mapeada',
      'Não prometemos que nada vai dar errado',
      'Prometemos que sabemos como resolver'
    ]
  },

  // SLIDE 25: VOCÊ ESTÁ DENTRO?
  {
    id: 25,
    type: 'decision',
    title: 'VOCÊ ESTÁ DENTRO?',
    ganha: {
      title: 'O QUE VOCÊ GANHA:',
      items: [
        'R$ 31.800/mês (cenário realista)',
        'Payback em 9,4 meses',
        'ROI de 127% ao ano',
        '50% de um negócio lucrativo',
        'Pró-labore fixo R$ 15k/mês (garantido)',
        'Acesso total aos números (tempo real)',
        'Controle sobre decisões >R$ 20k',
        'Parceria com profissionais experientes'
      ]
    },
    precisa: {
      title: 'O QUE VOCÊ PRECISA FAZER:',
      items: [
        'Investir R$ 300k (3x R$ 100k validado por etapa)',
        'Estar presente 2-3 noites/semana',
        'Trazer network VIP e corporativo',
        'Buscar patrocínios/collabs (meta R$ 5k/mês)',
        'Reunião semanal 30min',
        'Confiar no trabalho operacional da equipe',
        'Ter paciência primeiros 6 meses'
      ]
    },
    question: 'FAZ SENTIDO PRA VOCÊ?'
  },

  // SLIDE 26: PRÓXIMOS PASSOS
  {
    id: 26,
    type: 'next-steps',
    title: 'PRÓXIMOS PASSOS',
    steps: [
      {
        icon: 'clock',
        titulo: 'HOJE (Pós-apresentação)',
        items: [
          'Leve essa apresentação',
          'Pense com calma',
          'Liste dúvidas'
        ]
      },
      {
        icon: 'clock',
        titulo: 'AMANHÃ',
        items: [
          'Conversamos, tiro dúvidas',
          'Se estiver dentro → Mando contrato'
        ]
      },
      {
        icon: 'clock',
        titulo: 'EM 3 DIAS',
        items: [
          'Você lê contrato com calma',
          '(Opcional) Mostra pra seu advogado',
          'Marcamos assinatura'
        ]
      },
      {
        icon: 'clock',
        titulo: 'DIA DA ASSINATURA',
        items: [
          'Assinamos em cartório',
          'Você deposita R$ 100k',
          'Eu começo Fase 1'
        ]
      }
    ],
    footer: [
      'Sem drama, sem pressão',
      'Mas se for pra fazer, vamos fazer logo',
      'Mercado não espera'
    ]
  },

  // SLIDE 27: PERGUNTAS
  {
    id: 27,
    type: 'questions',
    title: 'PERGUNTAS',
    mainText: 'ABRE O JOGO',
    subText: 'O que ficou de dúvida?'
  }
];

export default slidesData;





