// Dados dos 27 slides do ROADMAP FLAME
export const roadmapData = [
  // SLIDE 1: CAPA
  {
    id: 1,
    type: 'cover',
    background: 'gradient-red',
    content: {
      title: 'ROADMAP',
      subtitle: '60 Dias até o Grand Opening\n07/Out - 06/Dez 2025',
      icons: ['calendar', 'trending-up', 'target']
    }
  },

  // SLIDE 2: VISÃO GERAL
  {
    id: 2,
    type: 'timeline-horizontal',
    title: 'CRONOGRAMA EXECUTIVO',
    timeline: [
      {
        day: 'SEMANA 1-3',
        parcela: '21 dias',
        valor: 'FASE 1',
        etapa: 'Legalização + Projetos',
        validacao: 'CNPJ + AVCB'},
      {
        day: 'SEMANA 3-6',
        parcela: '21 dias',
        valor: 'FASE 2',
        etapa: 'Reforma Pesada',
        validacao: 'Espaço pronto'},
      {
        day: 'SEMANA 6-8',
        parcela: '14 dias',
        valor: 'FASE 3',
        etapa: 'Montagem Operacional',
        validacao: 'Equipamentos OK'},
      {
        day: 'SEMANA 8-9',
        parcela: '7 dias',
        valor: 'FASE 4',
        etapa: 'Marketing Pré-Abertura',
        validacao: 'Lista VIP 200+'},
      {
        day: 'SEMANA 9-10',
        parcela: '10 dias',
        valor: 'FASE 5+6',
        etapa: 'Soft + Grand Opening',
        validacao: 'NEGÓCIO ABERTO'}
    ],
    highlight: {
      icon: 'calendar',
      title: '60 DIAS',
      text: 'Data Início: 07 de Outubro 2025\nGrand Opening: 06 de Dezembro 2025\nInvestimento Total: R$ 274.000'}
  },

  // SLIDE 3: ESTRATÉGIA DE COMPRESSÃO
  {
    id: 3,
    type: 'three-columns',
    title: 'ESTRATÉGIA: PARALELO É A CHAVE',
    columns: [
      {
        icon: 'zap',
        title: 'SEMANA 1-3',
        items: [
          'Documentação CNPJ/Alvarás',
          'Projetos Arquitetônicos',
          'Orçamentos Reforma',
          'Licenças Bombeiros',
          'Compra Equipamentos Longos']
      },
      {
        icon: 'hammer',
        title: 'SEMANA 3-6',
        items: [
          'Reforma Pesada',
          'Finalização Licenças',
          'Chegada Equipamentos',
          'Recrutamento Equipe',
          'Criação Cardápio']
      },
      {
        icon: 'rocket',
        title: 'SEMANA 6-10',
        items: [
          'Acabamentos + Instalações',
          'Treinamento Equipe',
          'Marketing Intenso',
          'Soft Opening',
          'Grand Opening']
      }
    ]
  },

  // SLIDE 4: CRONOGRAMA VISUAL INTEGRADO
  {
    id: 4,
    type: 'project-timeline',
    title: 'CRONOGRAMA VISUAL INTEGRADO',
    phases: [
      {
        fase: 'OUTUBRO 2025',
        prazo: 'Semana 1-3: 07/out - 28/out',
        tasks: [
          '07-13/out: FASE 1 Legalização inicio',
          '14-20/out: Projetos Arquitetônicos',
          '21-27/out: FASE 2 Reforma inicio + CNPJ/AVCB emitidos'],
        highlight: true
      },
      {
        fase: 'NOVEMBRO 2025',
        prazo: 'Semana 4-8: 28/out - 25/nov',
        tasks: [
          '28/out-10/nov: Reforma estrutural (elétrica, hidráulica)',
          '11-17/nov: Acabamentos + Instalação equipamentos',
          '18-25/nov: FASE 3 Montagem (estoque + equipe treinada)'],
        highlight: true
      },
      {
        fase: 'DEZEMBRO 2025',
        prazo: 'Semana 9-10: 25/nov - 08/dez',
        tasks: [
          '25/nov-02/dez: FASE 4 Marketing intenso + Preview VIP',
          '03-05/dez: FASE 5 Soft Opening (3 dias)',
          '06-08/dez: FASE 6 Grand Opening Weekend '],
        highlight: true
      }
    ]
  },

  // SLIDE 5: MILESTONES CRÍTICOS
  {
    id: 5,
    type: 'grid-2x2',
    title: 'MILESTONES CRÍTICOS',
    grid: [
      {
        icon: 'check-circle',
        title: 'SEMANA 1 (07-13/out)',
        items: ['Aluguel assinado', 'Conta PJ aberta', 'CNPJ protocolado', 'Arquiteto contratado']
      },
      {
        icon: 'check-circle',
        title: 'SEMANA 3 (21-27/out)',
        items: ['CNPJ emitido', 'AVCB emitido', 'Reforma iniciada', 'Demolição completa']
      },
      {
        icon: 'check-circle',
        title: 'SEMANA 6 (11-17/nov)',
        items: ['Acabamentos concluídos', 'Equipamentos instalando', 'Mobiliário chegando']
      },
      {
        icon: 'check-circle',
        title: 'SEMANA 8 (25/nov-02/dez)',
        items: ['Marketing ativo', 'Lista VIP 200+', 'Preview realizado', 'Tudo ajustado']
      }
    ]
  },

  // SLIDE 6: FASE 1 OVERVIEW
  {
    id: 6,
    type: 'investment-overview',
    title: 'FASE 1: LEGALIZAÇÃO E PROTEÇÃO',
    amount: 'R$ 8.000',
    subtitle: '21 dias | 07/out - 28/out | URGENTE - Começa HOJE',
    breakdown: [
      { icon: 'file-text', label: 'Taxas CNPJ/Inscrições', percent: 15, value: 'R$ 1.200'},
      { icon: 'shield', label: 'PPCI + Bombeiros', percent: 44, value: 'R$ 3.500'},
      { icon: 'check-circle', label: 'Licenças Sanitárias', percent: 10, value: 'R$ 800'},
      { icon: 'music', label: 'ECAD + Som', percent: 8, value: 'R$ 600'},
      { icon: 'map', label: 'TUAP (calçada)', percent: 15, value: 'R$ 1.200'},
      { icon: 'shield', label: 'Seguros (1º mês)', percent: 8, value: 'R$ 700'}
    ],
    footer: [
      'CNPJ Ativo',
      'AVCB (Bombeiros)',
      'Alvará Sanitário',
      'Seguros ativos']
  },

  // SLIDE 7: FASE 1 TIMELINE DETALHADO
  {
    id: 7,
    type: 'project-timeline',
    title: 'FASE 1: TIMELINE DETALHADO',
    phases: [
      {
        fase: 'SEMANA 1 (07-13/out)',
        prazo: 'Início imediato',
        tasks: [
          'Segunda 07/out: Assinar aluguel + Abrir conta PJ',
          'Terça 08/out: Protocolar CNPJ na Junta',
          'Quarta 09/out: Solicitar Inscrição Estadual',
          'Quinta 10/out: Protocolar Alvará Localização',
          'Sexta 11/out: Contratar Arquiteto + Engenheiro'],
        highlight: true
      },
      {
        fase: 'SEMANA 2 (14-20/out)',
        prazo: 'Aguardando aprovações',
        tasks: [
          'Segunda 14/out: Aguardar CNPJ (emissão)',
          'Terça 15/out: Vistoria Vigilância Sanitária',
          'Quarta 16/out: Protocolar Licença Sanitária',
          'Quinta 17/out: Entregar Projeto Bombeiros (PPCI)',
          'Sexta 18/out: Protocolar TUAP (ocupação calçada)']
      },
      {
        fase: 'SEMANA 3 (21-28/out)',
        prazo: 'Finalizações',
        tasks: [
          'Segunda 21/out: Receber CNPJ',
          'Terça 22/out: Instalar Extintores',
          'Quarta 23/out: Vistoria Bombeiros',
          'Quinta 24/out: Receber AVCB',
          'Sexta 25/out: Licença ECAD (som)',
          'Sábado 26/out: Seguros contratados'],
        highlight: true
      }
    ]
  },

  // SLIDE 8: FASE 1 ENTREGAS E CUSTOS
  {
    id: 8,
    type: 'waterfall',
    title: 'FASE 1: ENTREGAS E INVESTIMENTO',
    waterfall: [
      { label: 'Taxas CNPJ/Inscrições', value: 'R$ 1.200', percent: '15%', type: 'negative'},
      { label: 'Licenças Sanitárias', value: 'R$ 800', percent: '10%', type: 'negative'},
      { label: 'PPCI + Bombeiros', value: 'R$ 3.500', percent: '44%', type: 'negative'},
      { label: 'ECAD + Som', value: 'R$ 600', percent: '8%', type: 'negative'},
      { label: 'TUAP', value: 'R$ 1.200', percent: '15%', type: 'negative'},
      { label: 'Seguros (1º mês)', value: 'R$ 700', percent: '8%', type: 'negative'},
      { label: 'TOTAL FASE 1', value: 'R$ 8.000', percent: '100%', type: 'final'}
    ],
    observacao: {
      items: [
        'CNPJ Ativo',
        'Inscrições (Estadual + Municipal)',
        'AVCB (Bombeiros)',
        'Alvará Sanitário',
        'TUAP em análise',
        'Seguros ativos']
    }
  },

  // SLIDE 9: FASE 2 OVERVIEW
  {
    id: 9,
    type: 'investment-overview',
    title: 'FASE 2: INFRAESTRUTURA FÍSICA',
    amount: 'R$ 175.000',
    subtitle: '28 dias | 21/out - 18/nov |  CRÍTICO - Paralelo à Fase 1',
    breakdown: [
      { icon: 'file-text', label: 'Projetos (Arq + Eng)', percent: 5, value: 'R$ 9.000'},
      { icon: 'hammer', label: 'Demolição + Infraestrutura', percent: 14, value: 'R$ 25.000'},
      { icon: 'building', label: 'Construção Civil', percent: 17, value: 'R$ 30.000'},
      { icon: 'paint-bucket', label: 'Acabamentos', percent: 15, value: 'R$ 26.000'},
      { icon: 'wind', label: 'Climatização', percent: 9, value: 'R$ 15.000'},
      { icon: 'music', label: 'Sistema de Som', percent: 7, value: 'R$ 12.000'},
      { icon: 'lightbulb', label: 'Iluminação', percent: 6, value: 'R$ 10.000'},
      { icon: 'sofa', label: 'Móveis', percent: 20, value: 'R$ 35.000'},
      { icon: 'palette', label: 'Decoração + Sinalização', percent: 7, value: 'R$ 13.000'}
    ],
    footer: [
      'Reforma 100% concluída',
      'Climatização instalada',
      'Som profissional funcionando',
      'Ambiente decorado']
  },

  // SLIDE 10: FASE 2 PREPARAÇÃO
  {
    id: 10,
    type: 'project-timeline',
    title: 'FASE 2: PREPARAÇÃO (15-20/out)',
    phases: [
      {
        fase: 'PLANEJAMENTO',
        prazo: '6 dias antes da reforma',
        tasks: [
          'Terça 15/out: Briefing Arquiteto',
          'Quarta 16/out: Medições espaço',
          'Quinta 17/out: Primeira proposta layout',
          'Sexta 18/out: Aprovação layout Rodrigo',
          'Sábado 19/out: Projetos elétrico/hidráulico',
          'Domingo 20/out: Solicitar 3 orçamentos'],
        highlight: true
      }
    ]
  },

  // SLIDE 11: FASE 2 REFORMA (4 SEMANAS)
  {
    id: 11,
    type: 'project-timeline',
    title: 'FASE 2: REFORMA - 4 SEMANAS',
    phases: [
      {
        fase: 'SEMANA 1 REFORMA (21-27/out)',
        prazo: 'Demolição + Infraestrutura',
        tasks: [
          'Segunda 21/out: Escolher empreiteiro + Assinar contrato',
          'Quarta 23/out: INÍCIO DEMOLIÇÃO ️',
          'Quinta 24/out: Demolição + Remoção entulho',
          'Sexta 25/out: Início nova elétrica',
          'Sábado 26/out: Início nova hidráulica'],
        highlight: true
      },
      {
        fase: 'SEMANA 2 REFORMA (28/out-03/nov)',
        prazo: 'Construção Civil',
        tasks: [
          'Elétrica (fiação, quadros)',
          'Hidráulica (tubulação)',
          'Reforço estrutural',
          'Alvenaria nova (paredes)',
          'Reboco + Contrapiso']
      },
      {
        fase: 'SEMANA 3 REFORMA (04-10/nov)',
        prazo: 'Instalações e Revestimentos',
        tasks: [
          'Instalação portas/janelas',
          'Gesso/Forro',
          'Instalação piso principal',
          'Revestimento paredes',
          'Azulejos banheiros',
          'Pintura início']
      },
      {
        fase: 'SEMANA 4 REFORMA (11-18/nov)',
        prazo: 'Acabamentos Finais',
        tasks: [
          'Pintura geral',
          'Instalação Climatização',
          'Instalação Sistema de Som',
          'Instalação Iluminação',
          'Mobiliário sob medida',
          'Decoração + Sinalização externa',
          'Limpeza final + Vistoria'],
        highlight: true
      }
    ]
  },

  // SLIDE 12: FASE 2 INVESTIMENTO DETALHADO
  {
    id: 12,
    type: 'waterfall',
    title: 'FASE 2: BREAKDOWN INVESTIMENTO',
    waterfall: [
      { label: 'Projetos (Arq + Eng)', value: 'R$ 9.000', percent: '5%', type: 'negative'},
      { label: 'Demolição + Infraestrutura', value: 'R$ 25.000', percent: '14%', type: 'negative'},
      { label: 'Construção Civil', value: 'R$ 30.000', percent: '17%', type: 'negative'},
      { label: 'Acabamentos', value: 'R$ 26.000', percent: '15%', type: 'negative'},
      { label: 'Climatização', value: 'R$ 15.000', percent: '9%', type: 'negative'},
      { label: 'Sistema de Som', value: 'R$ 12.000', percent: '7%', type: 'negative'},
      { label: 'Iluminação', value: 'R$ 10.000', percent: '6%', type: 'negative'},
      { label: 'Móveis (total)', value: 'R$ 35.000', percent: '20%', type: 'negative'},
      { label: 'Decoração + Sinalização', value: 'R$ 13.000', percent: '7%', type: 'negative'},
      { label: 'TOTAL FASE 2', value: 'R$ 175.000', percent: '100%', type: 'final'}
    ],
    observacao: {
      items: [
        'Móveis: R$ 20k sob medida + R$ 15k comprados',
        'Decoração: R$ 8k decoração + R$ 5k sinalização',
        'Reforma completa turn-key']
    }
  },

  // SLIDE 13: FASE 3 OVERVIEW
  {
    id: 13,
    type: 'investment-overview',
    title: 'FASE 3: MONTAGEM OPERACIONAL',
    amount: 'R$ 82.500',
    subtitle: '14 dias | 11/nov - 25/nov | PARALELO aos acabamentos',
    breakdown: [
      { icon: 'refrigerator', label: 'Equipamentos Grandes', percent: 30, value: 'R$ 25.000'},
      { icon: 'utensils', label: 'Equipamentos Pequenos', percent: 10, value: 'R$ 8.000'},
      { icon: 'coffee', label: 'Utensílios Serviço', percent: 15, value: 'R$ 12.000'},
      { icon: 'smartphone', label: 'Sistema PDV (setup)', percent: 5, value: 'R$ 4.000'},
      { icon: 'wine', label: 'Estoque Bebidas', percent: 28, value: 'R$ 23.000'},
      { icon: 'pizza', label: 'Estoque Alimentos', percent: 6, value: 'R$ 5.000'},
      { icon: 'box', label: 'Descartáveis/Limpeza', percent: 2, value: 'R$ 2.000'},
      { icon: 'users', label: 'Treinamento Equipe', percent: 4, value: 'R$ 3.000'}
    ],
    footer: [
      'Todos equipamentos instalados',
      'Sistema PDV operacional',
      'Estoque inicial completo (1 mês)',
      'Equipe contratada e treinada (8 pessoas)']
  },

  // SLIDE 14: FASE 3 TIMELINE DETALHADO
  {
    id: 14,
    type: 'project-timeline',
    title: 'FASE 3: TIMELINE DETALHADO',
    phases: [
      {
        fase: 'SEMANA 1 (11-17/nov)',
        prazo: 'Equipamentos e Sistema',
        tasks: [
          'Segunda 11/nov: Compra Equipamentos Grandes (já encomendados desde 15/out)',
          'Terça 12/nov: Instalação Geladeiras/Freezers',
          'Quarta 13/nov: Instalação Chopeira/Máq Gelo',
          'Quinta 14/nov: Instalação Fogão/Forno/Fritadeira',
          'Sexta 15/nov: Compra Utensílios (copos, pratos)',
          'Sábado 16/nov: Configurar Sistema PDV',
          'Domingo 17/nov: Cadastro produtos no sistema'],
        highlight: true
      },
      {
        fase: 'SEMANA 2 (18-25/nov)',
        prazo: 'Estoque e Equipe',
        tasks: [
          'Segunda 18/nov: Compra Estoque Bebidas Alcoólicas',
          'Terça 19/nov: Compra Estoque Alimentos',
          'Quarta 20/nov: Recrutamento Equipe (entrevistas)',
          'Quinta 21/nov: Contratação Equipe (8 pessoas)',
          'Sexta 22/nov: Treinamento Dia 1 (Conceito)',
          'Sábado 23/nov: Treinamento Dia 2 (PDV/Processos)',
          'Domingo 24/nov: Treinamento Dia 3 (Simulação)',
          'Segunda 25/nov: Treinamento Dia 4 (Prova prática)'],
        highlight: true
      }
    ]
  },

  // SLIDE 15: FASE 3 BREAKDOWN
  {
    id: 15,
    type: 'waterfall',
    title: 'FASE 3: BREAKDOWN INVESTIMENTO',
    waterfall: [
      { label: 'Equipamentos Grandes', value: 'R$ 25.000', percent: '30%', type: 'negative'},
      { label: 'Equipamentos Pequenos', value: 'R$ 8.000', percent: '10%', type: 'negative'},
      { label: 'Utensílios Serviço', value: 'R$ 12.000', percent: '15%', type: 'negative'},
      { label: 'Sistema PDV (setup)', value: 'R$ 4.000', percent: '5%', type: 'negative'},
      { label: 'Estoque Bebidas', value: 'R$ 23.000', percent: '28%', type: 'negative'},
      { label: 'Estoque Alimentos', value: 'R$ 5.000', percent: '6%', type: 'negative'},
      { label: 'Descartáveis/Limpeza', value: 'R$ 2.000', percent: '2%', type: 'negative'},
      { label: 'Treinamento Equipe', value: 'R$ 3.000', percent: '4%', type: 'negative'},
      { label: 'Parcerias', value: 'R$ 500', percent: '1%', type: 'negative'},
      { label: 'TOTAL FASE 3', value: 'R$ 82.500', percent: '100%', type: 'final'}
    ],
    observacao: {
      items: [
        'Equipamentos operacionais',
        'Estoque 1 mês (consignado 30/45/60 dias)',
        'Equipe: 2 bartenders, 3 garçons, 1 cozinha',
        'Fornecedores fechados']
    }
  },

  // SLIDE 16: FASE 4 OVERVIEW
  {
    id: 16,
    type: 'investment-overview',
    title: 'FASE 4: PRÉ-ABERTURA (MARKETING)',
    amount: 'R$ 8.500',
    subtitle: '7 dias | 25/nov - 02/dez |  BUZZ INTENSO',
    breakdown: [
      { icon: 'camera', label: 'Fotógrafo + Conteúdo', percent: 29, value: 'R$ 2.500'},
      { icon: 'file-text', label: 'Material Gráfico', percent: 18, value: 'R$ 1.500'},
      { icon: 'map-pin', label: 'Panfletagem', percent: 6, value: 'R$ 500'},
      { icon: 'users', label: 'Influencers', percent: 24, value: 'R$ 2.000'},
      { icon: 'newspaper', label: 'Assessoria Imprensa', percent: 6, value: 'R$ 500'},
      { icon: 'star', label: 'Preview VIP', percent: 17, value: 'R$ 1.500'}
    ],
    footer: [
      'Lista VIP 200+ pessoas',
      '15 influencers confirmados',
      'Matérias de imprensa agendadas',
      'Preview realizado com sucesso']
  },

  // SLIDE 17: FASE 4 DAILY
  {
    id: 17,
    type: 'project-timeline',
    title: 'FASE 4: DIA A DIA DO MARKETING',
    phases: [
      {
        fase: 'Segunda 25/nov',
        prazo: 'Lançamento',
        tasks: [
          'Fotógrafo profissional (fotos espaço)',
          'Post Instagram "Em breve FLAME"',
          'Início cadastro Lista VIP'],
        highlight: true
      },
      {
        fase: 'Terça-Quinta 26-28/nov',
        prazo: 'Engajamento',
        tasks: [
          'Stories diários (making of)',
          'Design cardápios impressos + Impressão 1000 flyers',
          'Panfletagem Arnaldo Quintela',
          'Contato influencers (20 pessoas)',
          'Envio convites personalizados',
          'Releases para imprensa']
      },
      {
        fase: 'Sexta 29/nov',
        prazo: 'Confirmações',
        tasks: [
          'Stories: countdown 6 dias',
          'Confirmação influencers',
          'Kit de imprensa preparado']
      },
      {
        fase: 'Sábado 30/nov',
        prazo: 'PREVIEW VIP',
        tasks: [
          'PREVIEW VIP (30 convidados)',
          'Teste operacional completo',
          'Coleta feedbacks + Ajustes identificados'],
        highlight: true
      },
      {
        fase: 'Domingo 01/dez + Segunda 02/dez',
        prazo: 'Preparação Final',
        tasks: [
          'Implementação ajustes urgentes',
          'Stories: Countdown 5 dias',
          'Lista VIP: 200+ pessoas',
          'Briefing final equipe',
          'Último checklist + Limpeza profunda',
          'PRONTO PARA SOFT OPENING'],
        highlight: true
      }
    ]
  },

  // SLIDE 18: SOFT OPENING
  {
    id: 18,
    type: 'return-3scenarios',
    title: 'FASE 5: SOFT OPENING (3 DIAS)',
    scenarios: [
      {
        emoji: 'smile',
        title: 'Terça 03/dez - DIA 1',
        proLabore: 'Só Lista VIP (80 pessoas)',
        lucro: 'Equipe completa + Leonardo + Rodrigo',
        total: 'Receita: R$ 8.000',
        subtitle: 'Fotógrafo registrando tudo'},
      {
        emoji: 'smile',
        title: 'Quarta 04/dez - DIA 2',
        proLabore: 'VIP + Instagram (120 pessoas)',
        lucro: 'Drink especial "Opening" + Stories ao vivo',
        total: 'Receita: R$ 12.000',
        subtitle: 'Ajustes implementados',
        highlight: true
      },
      {
        emoji: 'smile',
        title: 'Quinta 05/dez - DIA 3',
        proLabore: 'Aberto ao público (150 pessoas)',
        lucro: 'DJ convidado + Promoção 2º drink 50% off',
        total: 'Receita: R$ 18.000',
        subtitle: 'Stress test operacional'}
    ],
    footer: [
      'TOTAL 3 DIAS: R$ 38.000 receita',
      'CMV: R$ 14.500 (38%)',
      'RESULTADO: R$ 23.500 positivo']
  },

  // SLIDE 19: GRAND OPENING
  {
    id: 19,
    type: 'return-3scenarios',
    title: 'FASE 6: GRAND OPENING WEEKEND',
    scenarios: [
      {
        emoji: 'rocket',
        title: 'Sexta 06/dez - NIGHT 1 ',
        proLabore: 'GRAND OPENING OFICIAL',
        lucro: 'Imprensa + 20 Influencers + DJ especial',
        total: 'Receita: R$ 25.000',
        subtitle: 'Discurso Leonardo + Rodrigo',
        highlight: true
      },
      {
        emoji: 'smile',
        title: 'Sábado 07/dez - NIGHT 2',
        proLabore: 'Banda ao vivo',
        lucro: 'Sorteio brindes + Happy Hour estendido',
        total: 'Receita: R$ 22.000',
        subtitle: 'Casa lotada'},
      {
        emoji: 'rocket',
        title: 'Domingo 08/dez - NIGHT 3',
        proLabore: 'DJ set especial',
        lucro: 'Lançamento drink signature',
        total: 'Receita: R$ 20.000',
        subtitle: 'Encerramento épico'}
    ],
    footer: [
      'TOTAL 3 DIAS: R$ 67.000 receita',
      'Custos Evento: R$ 7.000',
      'RESULTADO: R$ 60.000 positivo']
  },

  // SLIDE 20: RESULTADO FINANCEIRO OPENING
  {
    id: 20,
    type: 'scenarios-table',
    title: 'RESULTADO FINANCEIRO: OPENING WEEK',
    table: {
      headers: ['PERÍODO', 'Receita', 'Custos', 'Resultado', 'Status'],
      rows: [
        { emoji: 'smile', label: 'Soft Day 1', ocupacao: '03/dez', fat: 'R$ 8.000', recebe: 'R$ 3.000', roi: 'R$ 5.000', payback: 'OK'},
        { emoji: 'smile', label: 'Soft Day 2', ocupacao: '04/dez', fat: 'R$ 12.000', recebe: 'R$ 4.500', roi: 'R$ 7.500', payback: 'OK'},
        { emoji: 'smile', label: 'Soft Day 3', ocupacao: '05/dez', fat: 'R$ 18.000', recebe: 'R$ 7.000', roi: 'R$ 11.000', payback: 'OK'},
        { emoji: 'rocket', label: 'Grand Day 1', ocupacao: '06/dez', fat: 'R$ 25.000', recebe: 'R$ 3.000', roi: 'R$ 22.000', payback: '', highlight: true },
        { emoji: 'smile', label: 'Grand Day 2', ocupacao: '07/dez', fat: 'R$ 22.000', recebe: 'R$ 2.000', roi: 'R$ 20.000', payback: ''},
        { emoji: 'rocket', label: 'Grand Day 3', ocupacao: '08/dez', fat: 'R$ 20.000', recebe: 'R$ 2.000', roi: 'R$ 18.000', payback: ''}
      ]
    },
    breakdown: {
      title: 'CONSOLIDADO 7 DIAS:',
      items: [
        'Receita Total: R$ 105.000',
        'Custos Totais: R$ 21.500',
        'LUCRO LÍQUIDO: R$ 83.500']
    },
    footer: [
      'Soft Opening recupera investimento em marketing',
      'Grand Opening gera caixa operacional',
      'Negócio já lucrativo desde dia 1']
  },

  // SLIDE 21: RESUMO FINANCEIRO CONSOLIDADO
  {
    id: 21,
    type: 'calculation',
    title: 'RESUMO FINANCEIRO CONSOLIDADO',
    steps: [
      { label: 'FASE 1: Legalização', calc: '21 dias', result: 'R$ 8.000'},
      { label: 'FASE 2: Infraestrutura', calc: '28 dias', result: 'R$ 175.000'},
      { label: 'FASE 3: Montagem', calc: '14 dias', result: 'R$ 82.500'},
      { label: 'FASE 4: Marketing', calc: '7 dias', result: 'R$ 8.500'},
      { label: 'INVESTIMENTO TOTAL', calc: '60 dias', result: 'R$ 274.000', highlight: true },
      { label: '— RECEITA OPENING —', calc: '—', result: '—'},
      { label: 'Soft Opening (3 dias)', calc: 'R$ 38k - R$ 14.5k', result: '+R$ 23.500'},
      { label: 'Grand Opening (3 dias)', calc: 'R$ 67k - R$ 7k', result: '+R$ 60.000'},
      { label: 'TOTAL RECUPERADO', calc: '7 dias operação', result: '+R$ 83.500', highlight: true },
      { label: '= AINDA INVESTIDO', calc: 'R$ 274k - R$ 83.5k', result: 'R$ 190.500', highlight: true }
    ]
  },

  // SLIDE 22: RESPONSABILIDADES
  {
    id: 22,
    type: 'roles-4partners',
    title: 'RESPONSABILIDADES: QUEM FAZ O QUÊ',
    partners: [
      {
        name: 'LEONARDO',
        percent: 'Operacional',
        role: 'Execução Diária',
        tasks: [
          'Gestão da reforma diária',
          'Compra de equipamentos',
          'Criação de cardápio',
          'Treinamento de equipe',
          'Marketing e conteúdo',
          'Operação soft/grand opening'],
        dedicacao: 'Full-time 60 dias'},
      {
        name: 'RODRIGO',
        percent: 'Estratégico',
        role: 'Aprovações + Network',
        tasks: [
          'Aprovações >R$ 5k',
          'Networking (influencers, imprensa)',
          'Validação decisões grandes',
          'Estar presente nos eventos',
          'Reuniões semanais de status'],
        dedicacao: 'Reunião semanal + eventos'},
      {
        name: 'CONTADOR',
        percent: 'Legal',
        role: 'Documentação',
        tasks: [
          'Toda documentação legal',
          'Acompanhar licenças',
          'Vistorias e protocolos',
          'Regularização fiscal'],
        dedicacao: 'Contratado externo'},
      {
        name: 'EMPREITEIRO',
        percent: 'Construção',
        role: 'Execução Reforma',
        tasks: [
          'Execução reforma',
          'Gestão de mão de obra',
          'Cumprimento de prazos',
          'Entrega turn-key'],
        dedicacao: 'Contratado com multa atraso'}
    ],
    juntos: {
      title: 'REUNIÕES DE CHECKPOINT',
      items: [
        'SEMANAL: Toda Segunda, 11h',
        'DIÁRIO: Leonardo visita obra',
        'WhatsApp: Updates constantes',
        'FINAL: 02/dez Briefing pré-opening']
    }
  },

  // SLIDE 23: RISCOS E MITIGAÇÕES
  {
    id: 23,
    type: 'risks',
    title: 'PONTOS DE ATENÇÃO CRÍTICOS',
    list: [
      { icon: 'alert-circle', risco: 'Reforma sem licenças', protecao: 'ALTO: Licenças em paralelo + buffer'},
      { icon: 'clock', risco: 'Equipamentos atrasarem', protecao: 'ALTO: Encomendar HOJE (07/out)'},
      { icon: 'hammer', risco: 'Empreiteiro atrasar', protecao: 'ALTO: Contrato com multa por atraso'},
      { icon: 'shield', risco: 'Não conseguir AVCB', protecao: 'ALTO: Engenheiro experiente'},
      { icon: 'users', risco: 'Equipe não aprender', protecao: 'MÉDIO: 4 dias treinamento intensivo'},
      { icon: 'package', risco: 'Fornecedores falharem', protecao: 'MÉDIO: Plano B para tudo'},
      { icon: 'star', risco: 'Influencers não irem', protecao: 'MÉDIO: Confirmação antecipada'}
    ],
    footer: [
      'Riscos ALTOS mitigados com ação imediata',
      'Riscos MÉDIOS com plano B preparado',
      'Buffer de 3 dias antes do opening']
  },

  // SLIDE 24: GESTÃO E REUNIÕES
  {
    id: 24,
    type: 'management',
    title: 'GESTÃO E CONTROLE',
    controls: [
      { icon: 'calendar', title: 'REUNIÕES', items: ['Semanal: Toda Segunda 11h', 'Daily: Durante reforma', 'Final: 02/dez pré-opening'] },
      { icon: 'check-circle', title: 'CHECKPOINTS', items: ['Semana 1: Contratos assinados', 'Semana 3: CNPJ + AVCB', 'Semana 8: Tudo pronto'] },
      { icon: 'smartphone', title: 'COMUNICAÇÃO', items: ['WhatsApp diário', 'Fotos da obra', 'Decisões rápidas'] }
    ],
    kpis: {
      title: 'MARCOS DE VALIDAÇÃO:',
      items: [
        { label: 'Semana 1', target: 'Docs OK'},
        { label: 'Semana 3', target: 'Licenças'},
        { label: 'Semana 6', target: 'Obra 80%'},
        { label: 'Semana 8', target: 'Pronto'},
        { label: 'Semana 9', target: 'Opening'}
      ]
    }
  },

  // SLIDE 25: CHECKLIST FINAL PRÉ-OPENING
  {
    id: 25,
    type: 'decisions-table',
    title: 'CHECKLIST FINAL: 02/DEZ - 18h',
    categories: [
      {
        tipo: 'FÍSICO',
        items: [
          'Reforma 100% concluída',
          'Limpeza profunda feita',
          'Todos equipamentos funcionando',
          'Estoque completo',
          'Som + Iluminação + Climatização OK',
          'Banheiros impecáveis']
      },
      {
        tipo: 'LEGAL',
        items: [
          'CNPJ ativo',
          'AVCB emitido',
          'Alvará Sanitário OK',
          'Licenças de som OK',
          'Seguros ativos']
      },
      {
        tipo: 'OPERACIONAL',
        highlight: true,
        items: [
          'Sistema PDV funcionando',
          'Cardápio finalizado',
          'Preços definidos',
          'Equipe uniformizada',
          'Processos treinados']
      },
      {
        tipo: 'MARKETING',
        highlight: true,
        items: [
          'Lista VIP 200+',
          'Influencers confirmados',
          'Imprensa engajada',
          'Stories ativos',
          'Buzz criado']
      }
    ]
  },

  // SLIDE 26: SUCESSO
  {
    id: 26,
    type: 'decision',
    title: 'SUCESSO = EXECUÇÃO PERFEITA',
    pergunta: 'Este cronograma de 60 dias é viável?',
    contexto: 'LEMA: "60 dias para mudar nossas vidas"',
    sim: [
      'Começarmos HOJE (07/out)',
      'Trabalharmos em PARALELO',
      'Não houver grandes imprevistos',
      'Equipe executar sem falhas',
      'Fornecedores entregarem no prazo',
      'Decisões rápidas e assertivas',
      'Foco total nos próximos 60 dias'],
    nao: [
      'VELOCIDADE: Não perder tempo',
      'PARALELO: Múltiplas frentes simultâneas',
      'COMUNICAÇÃO: Alinhamento diário',
      'FLEXIBILIDADE: Resolver problemas rápido',
      'COMPROMETIMENTO: 60 dias intensos',
      'NETWORK: Rodrigo traz influencers/imprensa',
      'EXECUÇÃO: Leonardo 100% dedicado']
  },

  // SLIDE 27: CONTATO
  {
    id: 27,
    type: 'questions',
    title: 'DÚVIDAS?',
    mainText: 'VAMOS EXECUTAR',
    subText: 'Começamos na Segunda 07/out\nGrand Opening: 06/dez',
    contact: {
      whatsapp: '(21) 98765-4321',
      email: 'leonardo@redlight.bar',
      location: 'FLAME | Arnaldo Quintela, Botafogo, RJ'}
  }
];

export default roadmapData;


