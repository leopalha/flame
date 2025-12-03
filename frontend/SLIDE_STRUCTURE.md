# 📊 ESTRUTURA DOS SLIDES - FLAME (ATUALIZADA)

> Sistema de apresentação completo para pitch de investidores
> Navegação: Setas (←/→), Teclado numérico (1-27), Toque (mobile)
> Modo automático com controles interativos

---

## 🎯 SLIDES PRINCIPAIS (1-8)

### SLIDE 1: CAPA
**Tipo:** `cover`
```javascript
{
  type: 'cover',
  title: 'FLAME',
  subtitle: 'LOUNGE BAR',
  tagline: 'Onde Amsterdam encontra Botafogo',
  location: 'Botafogo, Rio de Janeiro'
}
```
**Layout:**
- Logo FLAME com efeito glow (vermelho #E30613)
- Título principal com gradiente animado
- Subtítulo com tipografia elegante
- Tagline em destaque
- Localização com ícone (Lucide: MapPin)

---

### SLIDE 2: CONCEITO
**Tipo:** `concept`
```javascript
{
  type: 'concept',
  title: 'O CONCEITO',
  items: [
    { icon: Wine, title: 'DRINKS AUTORAIS', description: 'Receitas exclusivas inspiradas em Amsterdam' },
    { icon: Music, title: 'MÚSICA AO VIVO', description: 'Jazz, Blues e Soul toda semana' },
    { icon: Sparkles, title: 'AMBIENTE EXCLUSIVO', description: 'Design inspirado no FLAME District' },
    { icon: Users, title: 'EXPERIÊNCIA VIP', description: 'Atendimento premium e personalizado' }
  ]
}
```
**Ícones:**
- Drinks: Wine (Lucide)
- Música: Music (Lucide)
- Ambiente: Sparkles (Lucide)
- Experiência: Users (Lucide)

---

### SLIDE 3: PÚBLICO-ALVO
**Tipo:** `target`
```javascript
{
  type: 'target',
  title: 'PÚBLICO-ALVO',
  segments: [
    {
      icon: Briefcase,
      title: 'PROFISSIONAIS 30-45',
      percentage: '40%',
      description: 'Alto poder aquisitivo, buscam ambiente sofisticado'
    },
    {
      icon: HeartHandshake,
      title: 'CASAIS 25-40',
      percentage: '35%',
      description: 'Encontros românticos em ambiente exclusivo'
    },
    {
      icon: UserCheck,
      title: 'APRECIADORES DE CULTURA',
      percentage: '25%',
      description: 'Interessados em música ao vivo e drinks especiais'
    }
  ]
}
```
**Ícones:**
- Profissionais: Briefcase (Lucide)
- Casais: HeartHandshake (Lucide)
- Apreciadores: UserCheck (Lucide)

---

### SLIDE 4: LOCALIZAÇÃO
**Tipo:** `location`
```javascript
{
  type: 'location',
  title: 'LOCALIZAÇÃO ESTRATÉGICA',
  address: 'Rua Voluntários da Pátria, 446 - Botafogo',
  maps: 'https://maps.google.com/?q=Botafogo+RJ',
  advantages: [
    { icon: MapPin, text: 'Coração de Botafogo, bairro nobre do Rio' },
    { icon: Car, text: 'Fácil acesso por metrô e principais vias' },
    { icon: Store, text: 'Próximo a teatros, cinemas e vida noturna' },
    { icon: Users, text: 'Público classe A/B concentrado na região' }
  ]
}
```
**Ícones:**
- Localização: MapPin (Lucide)
- Acesso: Car (Lucide)
- Comércio: Store (Lucide)
- Público: Users (Lucide)

---

### SLIDE 5: DIFERENCIAIS
**Tipo:** `differentials`
```javascript
{
  type: 'differentials',
  title: 'DIFERENCIAIS COMPETITIVOS',
  items: [
    {
      icon: Award,
      title: 'CONCEITO ÚNICO',
      description: 'Primeiro lounge bar temático Amsterdam no RJ',
      highlight: true
    },
    {
      icon: Wine,
      title: 'CARTA EXCLUSIVA',
      description: '50+ drinks autorais + cervejas importadas',
      highlight: false
    },
    {
      icon: Music,
      title: 'PROGRAMAÇÃO CULTURAL',
      description: 'Shows ao vivo 4x por semana',
      highlight: false
    },
    {
      icon: Shield,
      title: 'AMBIENTE SEGURO',
      description: 'Segurança privada e controle de acesso',
      highlight: false
    }
  ]
}
```
**Ícones:**
- Conceito: Award (Lucide)
- Carta: Wine (Lucide)
- Programação: Music (Lucide)
- Segurança: Shield (Lucide)

---

### SLIDE 6: MERCADO
**Tipo:** `market`
```javascript
{
  type: 'market',
  title: 'ANÁLISE DE MERCADO',
  stats: [
    {
      icon: TrendingUp,
      value: 'R$ 15 bi',
      label: 'Mercado de bares premium no Brasil (2024)',
      growth: '+12% a.a.'
    },
    {
      icon: Users,
      value: '2.4M',
      label: 'Pessoas classe A/B no Rio de Janeiro',
      growth: '+8% a.a.'
    },
    {
      icon: Building,
      value: '180K',
      label: 'Moradores em Botafogo',
      growth: 'Estável'
    }
  ],
  competitors: [
    'Concorrência fragmentada',
    'Nenhum bar temático Amsterdam na região',
    'Público carente de experiências diferenciadas'
  ]
}
```
**Ícones:**
- Crescimento: TrendingUp (Lucide)
- Pessoas: Users (Lucide)
- Região: Building (Lucide)

---

### SLIDE 7: CARDÁPIO DESTACADO
**Tipo:** `menu-highlight`
```javascript
{
  type: 'menu-highlight',
  title: 'DESTAQUES DO CARDÁPIO',
  categories: [
    {
      icon: Wine,
      name: 'DRINKS AUTORAIS',
      items: ['Amsterdam Nights', 'Tulip Martini', 'Canal Sunset'],
      price_range: 'R$ 32-48'
    },
    {
      icon: Beer,
      name: 'CERVEJAS IMPORTADAS',
      items: ['Heineken', 'Amstel', 'Grolsch'],
      price_range: 'R$ 18-28'
    },
    {
      icon: UtensilsCrossed,
      name: 'PETISCOS GOURMET',
      items: ['Tábua de Queijos', 'Bruschetta', 'Carpaccio'],
      price_range: 'R$ 38-68'
    }
  ]
}
```
**Ícones:**
- Drinks: Wine (Lucide)
- Cervejas: Beer (Lucide)
- Comida: UtensilsCrossed (Lucide)

---

### SLIDE 8: INVESTIMENTO
**Tipo:** `investment`
```javascript
{
  type: 'investment',
  title: 'INVESTIMENTO NECESSÁRIO',
  breakdown: [
    { icon: Building, category: 'REFORMA E INFRAESTRUTURA', value: 'R$ 180.000', percent: '36%' },
    { icon: Sofa, category: 'MOBILIÁRIO E DECORAÇÃO', value: 'R$ 90.000', percent: '18%' },
    { icon: Wrench, category: 'EQUIPAMENTOS (Bar/Cozinha/Som)', value: 'R$ 110.000', percent: '22%' },
    { icon: Package, category: 'ESTOQUE INICIAL', value: 'R$ 40.000', percent: '8%' },
    { icon: FileText, category: 'LEGALIZAÇÃO E MARKETING', value: 'R$ 30.000', percent: '6%' },
    { icon: PiggyBank, category: 'RESERVA DE CAPITAL DE GIRO', value: 'R$ 50.000', percent: '10%' }
  ],
  total: 'R$ 500.000'
}
```
**Ícones:**
- Reforma: Building (Lucide)
- Mobiliário: Sofa (Lucide)
- Equipamentos: Wrench (Lucide)
- Estoque: Package (Lucide)
- Legalização: FileText (Lucide)
- Reserva: PiggyBank (Lucide)

---

## 💰 SLIDES FINANCEIROS (9-12)

### SLIDE 9: RETORNO MENSAL
**Tipo:** `return`
```javascript
{
  type: 'return',
  title: 'RETORNO MENSAL PROJETADO',
  mainValue: 'R$ 21.000/mês',
  breakdown: [
    { icon: DollarSign, title: 'FATURAMENTO', value: 'R$ 180.000', subtitle: 'Receita bruta mensal' },
    { icon: TrendingUp, title: 'SUA PARTE (50%)', value: 'R$ 21.000', subtitle: 'Lucro líquido mensal' }
  ],
  scenarios: [
    { emoji: TrendingUp, label: 'Otimista (80% ocupação)', value: 'R$ 28.000' },
    { emoji: Minus, label: 'Realista (60% ocupação)', value: 'R$ 21.000' },
    { emoji: TrendingDown, label: 'Conservador (40% ocupação)', value: 'R$ 14.000' }
  ]
}
```
**Ícones:**
- Faturamento: DollarSign (Lucide)
- Crescimento: TrendingUp (Lucide)
- Estável: Minus (Lucide)
- Queda: TrendingDown (Lucide)

---

### SLIDE 10: PAYBACK E ROI
**Tipo:** `payback-roi`
```javascript
{
  type: 'payback-roi',
  title: 'PAYBACK E RETORNO SOBRE INVESTIMENTO',
  payback: {
    title: 'PAYBACK',
    investimento: 'R$ 250.000',
    recebeMes: 'R$ 21.000',
    recuperaEm: '12 meses',
    timeline: [
      { mes: 'Mês 6', valor: '-R$ 124.000' },
      { mes: 'Mês 12', valor: 'R$ 0 (break-even)' },
      { mes: 'Mês 18', valor: '+R$ 126.000' }
    ]
  },
  roi: {
    title: 'ROI',
    ano1: {
      investimento: 'R$ 250.000',
      recebe: 'R$ 252.000',
      lucro: 'R$ 2.000 (+0,8%)'
    },
    ano2: {
      recebe: 'R$ 252.000',
      lucro: 'R$ 252.000 (+100,8%)'
    },
    doisAnos: {
      totalRecebido: 'R$ 504.000',
      lucroReal: 'R$ 254.000 (+101,6%)'
    }
  }
}
```

---

### SLIDE 11: TABELA DE CENÁRIOS
**Tipo:** `scenarios-table`
```javascript
{
  type: 'scenarios-table',
  title: 'CENÁRIOS DE RETORNO - ANÁLISE COMPARATIVA',
  table: {
    headers: ['CENÁRIO', 'OCUPAÇÃO', 'FAT. MENSAL', 'VOCÊ RECEBE', 'ROI 2 ANOS'],
    rows: [
      { emoji: TrendingUp, label: 'EXPLOSIVO', ocupacao: '100%', fat: 'R$ 220K', recebe: 'R$ 35K', roi: '168%', highlight: true },
      { emoji: TrendingUp, label: 'OTIMISTA', ocupacao: '80%', fat: 'R$ 200K', recebe: 'R$ 28K', roi: '134%', highlight: false },
      { emoji: Minus, label: 'REALISTA', ocupacao: '60%', fat: 'R$ 180K', recebe: 'R$ 21K', roi: '101%', highlight: false },
      { emoji: TrendingDown, label: 'CONSERVADOR', ocupacao: '40%', fat: 'R$ 160K', recebe: 'R$ 14K', roi: '67%', highlight: false }
    ]
  },
  footer: [
    'Base: Ticket médio R$ 85, capacidade 120 pessoas',
    'Custos fixos: R$ 95K/mês (folha, aluguel, insumos)'
  ],
  detail: {
    title: 'PREMISSAS',
    items: [
      'Funcionamento: Qua-Sáb (20h-2h)',
      'Capacidade: 120 pessoas',
      'Ticket médio: R$ 85'
    ]
  }
}
```
**Ícones:**
- Explosivo: TrendingUp (Lucide) com cor verde destacada
- Otimista: TrendingUp (Lucide)
- Realista: Minus (Lucide)
- Conservador: TrendingDown (Lucide)

---

### SLIDE 12: DIAGRAMA DAS 5 ENGRENAGENS
**Tipo:** `diagram`
```javascript
{
  type: 'diagram',
  title: 'AS 5 ENGRENAGENS DO NEGÓCIO',
  diagram: [
    { icon: Settings, label: 'PRODUTO' },
    { icon: Users, label: 'PESSOAS' },
    { icon: DollarSign, label: 'CASHFLOW' },
    { icon: Target, label: 'GESTÃO' },
    { icon: TrendingUp, label: 'MARKETING' }
  ],
  explanation: 'Cada engrenagem funciona de forma integrada.\nSe uma falha, todas são impactadas.\nGestão profissional é essencial para o sucesso.'
}
```
**Ícones:**
- Produto: Settings (Lucide)
- Pessoas: Users (Lucide)
- Cashflow: DollarSign (Lucide)
- Gestão: Target (Lucide)
- Marketing: TrendingUp (Lucide)

---

## ⚙️ SLIDES DAS ENGRENAGENS (13-17)

### SLIDE 13: ENGRENAGEM 1 - PRODUTO
**Tipo:** `gear-product`
```javascript
{
  type: 'gear-product',
  title: 'ENGRENAGEM 1: PRODUTO',
  sections: [
    {
      title: 'O QUE VENDEMOS?',
      items: [
        'Experiência inspirada em Amsterdam',
        'Drinks autorais + cervejas importadas',
        'Música ao vivo (Jazz, Blues, Soul)',
        'Ambiente sofisticado e exclusivo'
      ],
      highlight: false
    },
    {
      title: 'NOSSO PRODUTO É:',
      items: [
        'Único na região (temática Amsterdam)',
        'Premium e exclusivo',
        'Experiência completa (bebidas + música + ambiente)'
      ],
      highlight: true
    },
    {
      title: 'DESENVOLVIMENTO CONTÍNUO',
      items: [
        'Menu atualizado a cada 3 meses',
        'Eventos temáticos mensais',
        'Parceria com artistas locais',
        'Feedback constante dos clientes'
      ],
      highlight: false
    }
  ]
}
```

---

### SLIDE 14: ENGRENAGEM 2 - ORGANOGRAMA
**Tipo:** `organogram`
```javascript
{
  type: 'organogram',
  title: 'ENGRENAGEM 2: PESSOAS (ORGANOGRAMA)',
  organogram: {
    gestor: 'GESTOR GERAL',
    areas: [
      { nome: 'OPERAÇÕES', pessoas: '1 gerente + 2 bartenders', custo: 'R$ 18K' },
      { nome: 'COZINHA', pessoas: '1 chef + 1 auxiliar', custo: 'R$ 12K' },
      { nome: 'ATENDIMENTO', pessoas: '4 garçons + 1 host', custo: 'R$ 20K' }
    ],
    extras: 'Seguranças (terceirizado): R$ 6K\nLimpeza (terceirizado): R$ 3K',
    total: {
      folha: 'R$ 50K',
      encargos: 'R$ 9K',
      total: 'R$ 59K'
    }
  },
  decisoes: [
    'Contratação via CLT com treinamento inicial de 2 semanas',
    'Política de gorjetas (10% opcional)',
    'Bonificação por performance (meta de vendas)',
    'Uniforme temático fornecido pela casa'
  ]
}
```

---

### SLIDE 15: ENGRENAGEM 3 - CASHFLOW
**Tipo:** `cashflow`
```javascript
{
  type: 'cashflow',
  title: 'ENGRENAGEM 3: CASHFLOW',
  entrada: {
    title: 'ENTRADA',
    items: [
      'Venda de bebidas (70% da receita)',
      'Venda de alimentos (25%)',
      'Eventos privados (5%)'
    ]
  },
  saida: {
    title: 'SAÍDA',
    items: [
      'Folha de pagamento: R$ 59K',
      'Aluguel + condomínio: R$ 15K',
      'Insumos (bebidas/comida): R$ 32K',
      'Marketing e eventos: R$ 8K',
      'Utilities (luz, água, gás): R$ 6K',
      'Outros (manutenção, imprevistos): R$ 5K',
      'TOTAL CUSTOS: R$ 125K'
    ]
  },
  controle: {
    title: 'CONTROLE',
    items: [
      'Sistema de PDV integrado',
      'Relatórios diários de caixa',
      'Controle de estoque semanal',
      'Auditoria mensal por contador'
    ]
  },
  alcadas: {
    title: 'ALÇADAS',
    items: [
      'Até R$ 500: Gerente operacional',
      'R$ 500 - R$ 2.000: Aprovação sócios',
      'Acima R$ 2.000: Reunião + votação'
    ]
  }
}
```

---

### SLIDE 16: ENGRENAGEM 4 - GESTÃO
**Tipo:** `management`
```javascript
{
  type: 'management',
  title: 'ENGRENAGEM 4: GESTÃO E CONTROLE',
  controls: [
    {
      icon: BarChart3,
      title: 'INDICADORES',
      items: [
        'Faturamento diário',
        'Ticket médio',
        'Taxa de ocupação',
        'CMV (Custo Mercadoria Vendida)'
      ]
    },
    {
      icon: DollarSign,
      title: 'FINANCEIRO',
      items: [
        'Fluxo de caixa semanal',
        'DRE mensal',
        'Contas a pagar/receber',
        'Margem de lucro'
      ]
    },
    {
      icon: Settings,
      title: 'OPERACIONAL',
      items: [
        'Satisfação do cliente (NPS)',
        'Turnover de funcionários',
        'Desperdício de insumos',
        'Tempo médio de atendimento'
      ]
    }
  ],
  kpis: {
    title: 'METAS (KPIs) MENSAIS',
    items: [
      { label: 'Faturamento', target: 'R$ 180K' },
      { label: 'Ticket Médio', target: 'R$ 85' },
      { label: 'Ocupação', target: '60%' },
      { label: 'CMV', target: '≤35%' },
      { label: 'NPS', target: '≥70' }
    ]
  }
}
```
**Ícones:**
- Indicadores: BarChart3 (Lucide)
- Financeiro: DollarSign (Lucide)
- Operacional: Settings (Lucide)

---

### SLIDE 17: ENGRENAGEM 5 - MARKETING
**Tipo:** `marketing`
```javascript
{
  type: 'marketing',
  title: 'ENGRENAGEM 5: MARKETING E VENDAS',
  digital: {
    title: 'DIGITAL',
    items: [
      'Instagram e TikTok (conteúdo diário)',
      'Google Ads (busca local)',
      'Parcerias com influenciadores',
      'Site otimizado para reservas'
    ]
  },
  offline: {
    title: 'OFFLINE',
    items: [
      'Eventos de inauguração (3 dias)',
      'Parcerias com hotéis da região',
      'Assessoria de imprensa',
      'Programação cultural semanal'
    ]
  },
  investimento: {
    value: 'R$ 8.000/mês',
    note: '(incluído nos custos fixos)'
  },
  retorno: 'ROI previsto: 3:1',
  patrocinios: {
    title: 'PATROCÍNIOS',
    items: [
      'Marcas de cerveja (Heineken, Amstel)',
      'Destilados premium',
      'Eventos culturais locais'
    ]
  },
  papelSocios: {
    title: 'PAPEL DOS SÓCIOS',
    items: [
      'Leonardo: Gestão de mídias sociais e eventos',
      'Rodrigo: Relacionamento com fornecedores e artistas'
    ]
  }
}
```

---

## 🏗️ SLIDES DE ESTRUTURA E OPERAÇÃO (18-21)

### SLIDE 18: PAPÉIS DOS SÓCIOS
**Tipo:** `roles`
```javascript
{
  type: 'roles',
  title: 'PAPÉIS E RESPONSABILIDADES',
  leonardo: {
    title: 'LEONARDO VIDAL',
    tasks: [
      'Gestão Operacional (dia a dia do bar)',
      'Supervisão de equipe e treinamentos',
      'Controle de qualidade (produtos e atendimento)',
      'Relacionamento com clientes VIP'
    ],
    dedicacao: 'DEDICAÇÃO:\n20h/semana\n(Qua-Sáb, noites)'
  },
  rodrigo: {
    title: 'RODRIGO SILVA',
    tasks: [
      'Gestão Financeira e Administrativa',
      'Negociação com fornecedores',
      'Marketing e comunicação',
      'Planejamento estratégico'
    ],
    dedicacao: 'DEDICAÇÃO:\n15h/semana\n(Gestão remota + reuniões)'
  },
  juntos: {
    title: 'DECISÕES CONJUNTAS',
    items: [
      'Investimentos acima de R$ 2.000',
      'Contratações e demissões',
      'Mudanças no cardápio principal',
      'Estratégia de marketing e eventos'
    ]
  }
}
```
**Ícones:**
- Dedicação: Clock (Lucide)

---

### SLIDE 19: ESTRUTURA SOCIETÁRIA
**Tipo:** `society`
```javascript
{
  type: 'society',
  title: 'ESTRUTURA SOCIETÁRIA',
  participacao: [
    { socio: 'LEONARDO VIDAL', percent: '50%', valor: 'R$ 250.000' },
    { socio: 'RODRIGO SILVA', percent: '50%', valor: 'R$ 250.000' }
  ],
  proLabore: {
    items: [
      { socio: 'Leonardo', valor: 'R$ 6.000' },
      { socio: 'Rodrigo', valor: 'R$ 4.000' }
    ],
    total: 'R$ 10.000'
  },
  lucro: [
    'Distribuição proporcional (50/50)',
    'Pagamento trimestral',
    'Após reserva de capital de giro (R$ 50K)'
  ],
  marca: {
    title: 'MARCA E PROPRIEDADE INTELECTUAL',
    items: [
      'Marca "FLAME" registrada no INPI',
      'Receitas autorais protegidas',
      'Identidade visual exclusiva (logo, design)'
    ]
  }
}
```

---

### SLIDE 20: ALÇADAS DE DECISÃO
**Tipo:** `decisions-table`
```javascript
{
  type: 'decisions-table',
  title: 'ALÇADAS DE DECISÃO',
  table: {
    headers: ['DECISÃO', 'QUEM DECIDE', 'LIMITE/REGRA'],
    rows: [
      { decisao: 'Compras operacionais', quem: 'Gerente', limite: 'Até R$ 500', highlight: false },
      { decisao: 'Contratação de freelancer', quem: 'Sócio responsável', limite: 'Até R$ 1.000', highlight: false },
      { decisao: 'Investimento em marketing', quem: 'Rodrigo', limite: 'Até R$ 2.000', highlight: false },
      { decisao: 'Compra de equipamento', quem: 'Leonardo', limite: 'Até R$ 2.000', highlight: false },
      { decisao: 'Contratação CLT', quem: 'Ambos sócios', limite: 'Votação conjunta', highlight: true },
      { decisao: 'Mudança de fornecedor principal', quem: 'Ambos sócios', limite: 'Votação conjunta', highlight: true },
      { decisao: 'Investimento > R$ 5K', quem: 'Ambos sócios', limite: 'Votação conjunta', highlight: true }
    ]
  },
  conflito: {
    title: 'RESOLUÇÃO DE CONFLITOS',
    steps: [
      '1. Diálogo entre sócios',
      '2. Mediação por contador/advogado',
      '3. Arbitragem (cláusula no contrato social)'
    ]
  }
}
```

---

### SLIDE 21: TIMELINE DO PROJETO
**Tipo:** `project-timeline`
```javascript
{
  type: 'project-timeline',
  title: 'CRONOGRAMA DE IMPLANTAÇÃO',
  timeline: [
    { mes: 'MÊS 1', icon: Wrench, fase: 'PLANEJAMENTO', custo: 'R$ 30K', detalhe: 'Projeto, licenças, contratos' },
    { mes: 'MÊS 2-3', icon: Package, fase: 'REFORMA', custo: 'R$ 180K', detalhe: 'Obras civis e decoração' },
    { mes: 'MÊS 4', icon: Rocket, fase: 'MONTAGEM', custo: 'R$ 200K', detalhe: 'Equipamentos + estoque' },
    { mes: 'MÊS 5', icon: TrendingUp, fase: 'PRÉ-ABERTURA', custo: 'R$ 40K', detalhe: 'Contratações + treinamento' },
    { mes: 'MÊS 6', icon: CheckCircle, fase: 'INAUGURAÇÃO', custo: 'R$ 50K', detalhe: 'Eventos de lançamento' },
    { mes: 'MÊS 7+', icon: CheckCircle, fase: 'OPERAÇÃO', custo: '-', detalhe: 'Negócio em funcionamento' }
  ],
  highlight: [
    'Previsão de inauguração: 6 meses após aporte',
    'Break-even: 12 meses de operação',
    'Retorno do investimento: 24 meses'
  ]
}
```
**Ícones:**
- Planejamento: Wrench (Lucide)
- Reforma: Package (Lucide)
- Montagem: Rocket (Lucide)
- Pré-abertura: TrendingUp (Lucide)
- Inauguração: CheckCircle (Lucide)
- Operação: CheckCircle (Lucide)

---

## 📅 SLIDES DE FASES E RISCOS (22-24)

### SLIDE 22: FASE 1 - PLANEJAMENTO (MÊS 1)
**Tipo:** `phases-1`
```javascript
{
  type: 'phases-1',
  title: 'FASE 1: PLANEJAMENTO (MÊS 1)',
  activities: [
    { icon: FileText, title: 'JURÍDICO', items: ['Contrato social', 'Registro CNPJ', 'Alvarás e licenças'] },
    { icon: FileText, title: 'PROJETO', items: ['Arquitetura de interiores', 'Layout operacional', 'Identidade visual'] },
    { icon: DollarSign, title: 'FINANCEIRO', items: ['Abertura de conta PJ', 'Planejamento orçamentário', 'Contratos com fornecedores'] }
  ],
  investimento: 'R$ 30.000',
  responsavel: 'Rodrigo (coordenação) + Leonardo (validação operacional)'
}
```
**Ícones:**
- Jurídico: FileText (Lucide)
- Projeto: FileText (Lucide)
- Financeiro: DollarSign (Lucide)

---

### SLIDE 23: FASE 2-4 - EXECUÇÃO (MÊS 2-5)
**Tipo:** `phases-2`
```javascript
{
  type: 'phases-2',
  title: 'FASES 2-4: EXECUÇÃO (MÊS 2-5)',
  phases: [
    {
      title: 'MÊS 2-3: REFORMA',
      icon: Wrench,
      items: ['Obras civis', 'Instalações elétricas/hidráulicas', 'Decoração temática'],
      budget: 'R$ 180.000'
    },
    {
      title: 'MÊS 4: MONTAGEM',
      icon: Package,
      items: ['Instalação de equipamentos', 'Compra de mobiliário', 'Montagem de bar e cozinha'],
      budget: 'R$ 200.000'
    },
    {
      title: 'MÊS 5: PRÉ-ABERTURA',
      icon: Users,
      items: ['Recrutamento e seleção', 'Treinamento de equipe', 'Compra de estoque inicial'],
      budget: 'R$ 40.000'
    }
  ],
  checkpoint: 'Auditoria pré-inauguração + ajustes finais'
}
```
**Ícones:**
- Reforma: Wrench (Lucide)
- Montagem: Package (Lucide)
- Pré-abertura: Users (Lucide)

---

### SLIDE 24: ANÁLISE DE RISCOS
**Tipo:** `risks`
```javascript
{
  type: 'risks',
  title: 'ANÁLISE DE RISCOS E MITIGAÇÃO',
  risks: [
    {
      icon: AlertCircle,
      risk: 'BAIXA OCUPAÇÃO INICIAL',
      probability: 'MÉDIA',
      impact: 'ALTO',
      mitigation: 'Eventos de inauguração + marketing agressivo nos 3 primeiros meses'
    },
    {
      icon: AlertCircle,
      risk: 'ATRASO NA REFORMA',
      probability: 'MÉDIA',
      impact: 'MÉDIO',
      mitigation: 'Contrato com multa + cronograma conservador (buffer de 15 dias)'
    },
    {
      icon: AlertCircle,
      risk: 'DIFICULDADE DE CONTRATAÇÃO',
      probability: 'BAIXA',
      impact: 'MÉDIO',
      mitigation: 'Parceria com escolas de bartender + oferta competitiva de salários'
    },
    {
      icon: AlertCircle,
      risk: 'MUDANÇA NA LEGISLAÇÃO',
      probability: 'BAIXA',
      impact: 'ALTO',
      mitigation: 'Assessoria jurídica mensal + compliance rigoroso'
    }
  ],
  contingency: {
    title: 'PLANO DE CONTINGÊNCIA',
    items: [
      'Reserva de capital de giro (R$ 50K)',
      'Linha de crédito pré-aprovada (R$ 100K)',
      'Seguro empresarial (incêndio, roubo, responsabilidade civil)'
    ]
  }
}
```
**Ícones:**
- Risco: AlertCircle (Lucide)
- Proteção: Shield (Lucide) - usado na seção de contingência

---

## 🎯 SLIDES DE FECHAMENTO (25-27)

### SLIDE 25: DECISÃO DE INVESTIMENTO
**Tipo:** `decision`
```javascript
{
  type: 'decision',
  title: 'POR QUE INVESTIR NO FLAME?',
  reasons: [
    {
      icon: TrendingUp,
      title: 'MERCADO AQUECIDO',
      description: 'Crescimento de 12% a.a. no segmento de bares premium'
    },
    {
      icon: Award,
      title: 'CONCEITO ÚNICO',
      description: 'Primeiro lounge bar temático Amsterdam no Rio de Janeiro'
    },
    {
      icon: MapPin,
      title: 'LOCALIZAÇÃO PRIME',
      description: 'Botafogo, região nobre com público de alto poder aquisitivo'
    },
    {
      icon: Users,
      title: 'SÓCIOS DEDICADOS',
      description: 'Leonardo (operacional) + Rodrigo (estratégico) = combinação ideal'
    },
    {
      icon: DollarSign,
      title: 'RETORNO ATRATIVO',
      description: 'ROI de 101% em 2 anos (cenário realista) + fluxo mensal de R$ 21K'
    }
  ],
  cta: {
    title: 'OPORTUNIDADE LIMITADA',
    subtitle: 'Investimento: R$ 250.000 por sócio',
    action: 'Prazo para decisão: 30 dias'
  }
}
```
**Ícones:**
- Mercado: TrendingUp (Lucide)
- Conceito: Award (Lucide)
- Localização: MapPin (Lucide)
- Sócios: Users (Lucide)
- Retorno: DollarSign (Lucide)

---

### SLIDE 26: PRÓXIMOS PASSOS
**Tipo:** `next-steps`
```javascript
{
  type: 'next-steps',
  title: 'PRÓXIMOS PASSOS',
  steps: [
    {
      number: '1',
      icon: Handshake,
      title: 'REUNIÃO DE ALINHAMENTO',
      description: 'Discussão de dúvidas e detalhamento do plano de negócios',
      deadline: 'Próxima semana'
    },
    {
      number: '2',
      icon: FileText,
      title: 'DUE DILIGENCE',
      description: 'Análise de documentos, contratos e projeções financeiras',
      deadline: '15 dias'
    },
    {
      number: '3',
      icon: DollarSign,
      title: 'ASSINATURA E APORTE',
      description: 'Formalização do contrato social e transferência do investimento',
      deadline: '30 dias'
    },
    {
      number: '4',
      icon: Rocket,
      title: 'INÍCIO DA FASE 1',
      description: 'Planejamento, legalização e início das obras',
      deadline: 'Imediato após aporte'
    }
  ]
}
```
**Ícones:**
- Reunião: Handshake (Lucide)
- Due Diligence: FileText (Lucide)
- Aporte: DollarSign (Lucide)
- Início: Rocket (Lucide)

---

### SLIDE 27: PERGUNTAS E CONTATO
**Tipo:** `questions`
```javascript
{
  type: 'questions',
  title: 'PERGUNTAS?',
  subtitle: 'Estamos à disposição para esclarecer qualquer dúvida',
  contacts: [
    {
      icon: User,
      name: 'LEONARDO VIDAL',
      role: 'Sócio-Operacional',
      details: [
        { icon: Phone, text: '(21) 98765-4321' },
        { icon: Mail, text: 'leonardo@FLAME.bar' }
      ]
    },
    {
      icon: User,
      name: 'RODRIGO SILVA',
      role: 'Sócio-Estratégico',
      details: [
        { icon: Phone, text: '(21) 91234-5678' },
        { icon: Mail, text: 'rodrigo@FLAME.bar' }
      ]
    }
  ],
  footer: {
    icon: MapPin,
    text: 'FLAME Lounge Bar - Rua Voluntários da Pátria, 446 - Botafogo, Rio de Janeiro'
  },
  thanks: 'OBRIGADO PELA ATENÇÃO!'
}
```
**Ícones:**
- Pessoa: User (Lucide)
- Telefone: Phone (Lucide)
- Email: Mail (Lucide)
- Endereço: MapPin (Lucide)

---

## 🎨 DESIGN SYSTEM

### Paleta de Cores
```javascript
const colors = {
  primary: '#E30613',           // Vermelho FLAME
  primaryDark: '#B30510',       // Vermelho escuro
  primaryLight: '#FF1F2F',      // Vermelho claro
  primaryGlow: 'rgba(227, 6, 19, 0.3)',

  background: '#000000',        // Preto puro
  surface: '#0a0a0a',          // Preto levemente mais claro
  surfaceElevated: '#1a1a1a',  // Cinza muito escuro

  textPrimary: '#ffffff',      // Branco
  textSecondary: '#a1a1a1',    // Cinza claro
  textTertiary: '#737373',     // Cinza médio

  success: '#10b981',          // Verde
  warning: '#f59e0b',          // Amarelo
  error: '#ef4444',            // Vermelho erro
  info: '#3b82f6'              // Azul
}
```

### Tipografia
```javascript
const typography = {
  h1: 'text-6xl font-bold',        // Títulos principais
  h2: 'text-4xl font-bold',        // Subtítulos
  h3: 'text-3xl font-bold',        // Seções
  h4: 'text-2xl font-bold',        // Sub-seções
  body: 'text-lg',                 // Texto normal
  small: 'text-base',              // Texto pequeno
  tiny: 'text-sm'                  // Legendas
}
```

### Animações
```javascript
const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0.2 }
  },
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0.2 }
  }
}
```

---

## 📱 RECURSOS INTERATIVOS

### Controles de Navegação
- **Teclado:** ← (anterior) / → (próximo) / números 1-27 (direto)
- **Mouse:** Clique nas setas laterais ou na barra de progresso
- **Touch:** Swipe horizontal (mobile/tablet)
- **Barra de progresso:** Mostra slide atual / total de slides

### Modo Automático
- **Ativação:** Botão "Auto" nos controles
- **Intervalo:** 8 segundos por slide
- **Pause:** Automático ao interagir com os controles

### Responsividade
- **Desktop:** Layout completo com animações suaves
- **Tablet:** Adaptação de grid e tamanho de fonte
- **Mobile:** Layout vertical, navegação por toque

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Slides Principais (1-8) ✅
- [x] Cover
- [x] Conceito
- [x] Público-alvo
- [x] Localização
- [x] Diferenciais
- [x] Mercado
- [x] Cardápio
- [x] Investimento

### Slides Financeiros (9-12) ✅
- [x] Retorno Mensal
- [x] Payback e ROI
- [x] Cenários
- [x] Diagrama 5 Engrenagens

### Slides Engrenagens (13-17) ✅
- [x] Produto
- [x] Pessoas (Organograma)
- [x] Cashflow
- [x] Gestão
- [x] Marketing

### Slides Estrutura (18-21) ✅
- [x] Papéis
- [x] Estrutura Societária
- [x] Alçadas
- [x] Timeline

### Slides Fases e Riscos (22-24) ✅
- [x] Fase 1
- [x] Fases 2-4
- [x] Riscos

### Slides Fechamento (25-27) ✅
- [x] Decisão
- [x] Próximos Passos
- [x] Perguntas

---

## 🚀 OBSERVAÇÕES TÉCNICAS

### Estrutura de Arquivos
```
frontend/
├── src/
│   ├── components/
│   │   ├── Slide.js               # Slides 1-8
│   │   ├── SlideExtensions.js     # Slides 9-12
│   │   ├── SlideExtensions2.js    # Slides 13-17
│   │   ├── SlideExtensions3.js    # Slides 18-21
│   │   └── SlideExtensions4.js    # Slides 22-27
│   ├── data/
│   │   └── presentationData.js    # Conteúdo dos 27 slides
│   ├── pages/
│   │   └── apresentacao.js        # Página principal
│   └── styles/
│       └── globals.css            # Estilos globais + scrollbar
```

### Ícones Lucide React Utilizados
```javascript
import {
  // Navegação e UI
  ChevronLeft, ChevronRight, Play, Pause, X,

  // Negócios e Finanças
  DollarSign, TrendingUp, TrendingDown, Minus, BarChart3, PiggyBank,

  // Pessoas e Usuários
  User, Users, UserCheck, Briefcase, HeartHandshake,

  // Locais e Mapas
  MapPin, Building, Store, Car,

  // Comida e Bebida
  Wine, Beer, UtensilsCrossed, ChefHat,

  // Comunicação
  Phone, Mail, MessageCircle,

  // Documentos e Arquivos
  FileText, Package, Settings,

  // Ações e Status
  CheckCircle, AlertCircle, Shield, Award, Target,

  // Outros
  Music, Sparkles, Wrench, Rocket, Calendar, Handshake,
  Presentation, QrCode, Truck, Sofa, Clock, Share2, Globe, Percent
} from 'lucide-react';
```

### Performance
- **Lazy Loading:** Componentes de slides carregados sob demanda
- **Animações otimizadas:** Uso de Framer Motion com GPU acceleration
- **Scroll suave:** CSS `overflow-y: auto` com `scrollbar-hide`
- **Imagens otimizadas:** WebP com fallback para PNG

### Acessibilidade
- **Navegação por teclado:** Completa
- **ARIA labels:** Em todos os botões interativos
- **Contraste de cores:** WCAG AA compliant
- **Focus indicators:** Visíveis e bem definidos

---

**VERSÃO:** 2.0 - Atualizada com ícones Lucide React
**DATA:** Junho 2024
**AUTORES:** Leonardo Vidal & Rodrigo Silva
