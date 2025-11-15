// CARDÁPIO COMPLETO EXXQUEMA BAR
// Categorias: Drinks, Petiscos, Pratos Principais, Sobremesas

export const cardapioCompleto = {
  drinks: [
    {
      id: 1,
      nome: 'Caipirinha de Cachaça Artesanal',
      descricao: 'Cachaça premium, limão tahiti fresco, açúcar demerara e gelo',
      preco: 28.00,
      destaque: true,
      imagem: '/images/cardapio/caipirinha.jpg',
      categoria: 'drinks',
      subcategoria: 'Clássicos Brasileiros'
    },
    {
      id: 2,
      nome: 'Moscow Mule Premium',
      descricao: 'Vodka russa, ginger beer artesanal, limão siciliano e hortelã',
      preco: 32.00,
      destaque: true,
      imagem: '/images/cardapio/moscow-mule.jpg',
      categoria: 'drinks',
      subcategoria: 'Clássicos Internacionais'
    },
    {
      id: 3,
      nome: 'Negroni Clássico',
      descricao: 'Gin London Dry, Campari, vermute rosso e casca de laranja',
      preco: 35.00,
      destaque: false,
      imagem: '/images/cardapio/negroni.jpg',
      categoria: 'drinks',
      subcategoria: 'Clássicos Internacionais'
    },
    {
      id: 4,
      nome: 'Aperol Spritz',
      descricao: 'Aperol, prosecco italiano, água com gás e laranja',
      preco: 30.00,
      destaque: true,
      imagem: '/images/cardapio/aperol-spritz.jpg',
      categoria: 'drinks',
      subcategoria: 'Clássicos Internacionais'
    },
    {
      id: 5,
      nome: 'Old Fashioned',
      descricao: 'Bourbon premium, angostura, açúcar e casca de laranja',
      preco: 38.00,
      destaque: false,
      imagem: '/images/cardapio/old-fashioned.jpg',
      categoria: 'drinks',
      subcategoria: 'Clássicos Internacionais'
    },
    {
      id: 6,
      nome: 'Gin Tônica Especial',
      descricao: 'Gin premium, tônica premium, zimbro, alecrim e frutas vermelhas',
      preco: 34.00,
      destaque: true,
      imagem: '/images/cardapio/gin-tonica.jpg',
      categoria: 'drinks',
      subcategoria: 'Gin & Tônica'
    },
    {
      id: 7,
      nome: 'Mojito Cubano',
      descricao: 'Rum branco, hortelã fresca, limão, açúcar e soda',
      preco: 29.00,
      destaque: false,
      imagem: '/images/cardapio/mojito.jpg',
      categoria: 'drinks',
      subcategoria: 'Clássicos Internacionais'
    },
    {
      id: 8,
      nome: 'Margarita Tradicional',
      descricao: 'Tequila prata, triple sec, limão e borda de sal',
      preco: 31.00,
      destaque: false,
      imagem: '/images/cardapio/margarita.jpg',
      categoria: 'drinks',
      subcategoria: 'Clássicos Internacionais'
    },
    {
      id: 9,
      nome: 'Whisky Sour',
      descricao: 'Whisky, limão siciliano, clara de ovo e angostura',
      preco: 36.00,
      destaque: false,
      imagem: '/images/cardapio/whisky-sour.jpg',
      categoria: 'drinks',
      subcategoria: 'Clássicos Internacionais'
    },
    {
      id: 10,
      nome: 'Espresso Martini',
      descricao: 'Vodka, licor de café, expresso fresco e grãos de café',
      preco: 33.00,
      destaque: true,
      imagem: '/images/cardapio/espresso-martini.jpg',
      categoria: 'drinks',
      subcategoria: 'Autorais'
    }
  ],

  petiscos: [
    {
      id: 11,
      nome: 'Tábua de Frios Especiais',
      descricao: 'Seleção de frios artesanais, queijos especiais, azeitonas, geleias e pães',
      preco: 68.00,
      destaque: true,
      imagem: '/images/cardapio/tabua-frios.jpg',
      categoria: 'petiscos',
      subcategoria: 'Entradas Frias',
      porcao: 'Serve 2-3 pessoas'
    },
    {
      id: 12,
      nome: 'Bolinhos de Bacalhau',
      descricao: '8 unidades de bolinhos crocantes com bacalhau desfiado e aioli de limão',
      preco: 42.00,
      destaque: true,
      imagem: '/images/cardapio/bolinhos-bacalhau.jpg',
      categoria: 'petiscos',
      subcategoria: 'Entradas Quentes'
    },
    {
      id: 13,
      nome: 'Burrata com Tomate Confit',
      descricao: 'Burrata cremosa, tomates confitados, pesto de manjericão e pão italiano',
      preco: 45.00,
      destaque: true,
      imagem: '/images/cardapio/burrata.jpg',
      categoria: 'petiscos',
      subcategoria: 'Entradas Frias'
    },
    {
      id: 14,
      nome: 'Bruschetta Trio',
      descricao: 'Três sabores: tomate e manjericão, cogumelos e alho, ricota e mel',
      preco: 38.00,
      destaque: false,
      imagem: '/images/cardapio/bruschetta.jpg',
      categoria: 'petiscos',
      subcategoria: 'Entradas Frias'
    },
    {
      id: 15,
      nome: 'Camarão ao Alho',
      descricao: 'Camarões grandes salteados no alho, azeite, vinho branco e pimenta',
      preco: 52.00,
      destaque: false,
      imagem: '/images/cardapio/camarao-alho.jpg',
      categoria: 'petiscos',
      subcategoria: 'Entradas Quentes'
    },
    {
      id: 16,
      nome: 'Polenta Cremosa com Ragu',
      descricao: 'Polenta artesanal com ragu de costela e queijo parmesão',
      preco: 46.00,
      destaque: false,
      imagem: '/images/cardapio/polenta-ragu.jpg',
      categoria: 'petiscos',
      subcategoria: 'Entradas Quentes'
    },
    {
      id: 17,
      nome: 'Ceviche de Peixe Branco',
      descricao: 'Peixe fresco marinado em limão, cebola roxa, coentro e leite de tigre',
      preco: 48.00,
      destaque: true,
      imagem: '/images/cardapio/ceviche.jpg',
      categoria: 'petiscos',
      subcategoria: 'Entradas Frias'
    },
    {
      id: 18,
      nome: 'Mini Hambúrgueres Gourmet',
      descricao: '4 mini burgers com blend especial, queijo cheddar e bacon',
      preco: 44.00,
      destaque: false,
      imagem: '/images/cardapio/mini-burgers.jpg',
      categoria: 'petiscos',
      subcategoria: 'Entradas Quentes'
    }
  ],

  pratosPrincipais: [
    {
      id: 19,
      nome: 'Risoto de Cogumelos',
      descricao: 'Arroz arbóreo, mix de cogumelos frescos, parmesão e trufa',
      preco: 72.00,
      destaque: true,
      imagem: '/images/cardapio/risoto.jpg',
      categoria: 'pratos',
      subcategoria: 'Massas e Risotos'
    },
    {
      id: 20,
      nome: 'Picanha na Brasa',
      descricao: 'Picanha premium grelhada (350g), chimichurri, farofa e vinagrete',
      preco: 89.00,
      destaque: true,
      imagem: '/images/cardapio/picanha.jpg',
      categoria: 'pratos',
      subcategoria: 'Carnes'
    },
    {
      id: 21,
      nome: 'Salmão Grelhado',
      descricao: 'Filé de salmão com crosta de ervas, purê de batata-doce e legumes',
      preco: 78.00,
      destaque: true,
      imagem: '/images/cardapio/salmao.jpg',
      categoria: 'pratos',
      subcategoria: 'Peixes'
    },
    {
      id: 22,
      nome: 'Ravioli de Queijo Brie',
      descricao: 'Massa artesanal recheada com brie, molho de tomate especial e rúcula',
      preco: 68.00,
      destaque: false,
      imagem: '/images/cardapio/ravioli.jpg',
      categoria: 'pratos',
      subcategoria: 'Massas e Risotos'
    },
    {
      id: 23,
      nome: 'Cordeiro ao Molho de Hortelã',
      descricao: 'Carré de cordeiro assado, molho de hortelã, batatas rústicas',
      preco: 95.00,
      destaque: false,
      imagem: '/images/cardapio/cordeiro.jpg',
      categoria: 'pratos',
      subcategoria: 'Carnes'
    },
    {
      id: 24,
      nome: 'Parmegiana de Filé Mignon',
      descricao: 'Filé mignon empanado, molho de tomate, mussarela e batatas fritas',
      preco: 82.00,
      destaque: false,
      imagem: '/images/cardapio/parmegiana.jpg',
      categoria: 'pratos',
      subcategoria: 'Carnes'
    }
  ],

  sobremesas: [
    {
      id: 25,
      nome: 'Petit Gateau',
      descricao: 'Bolo quente de chocolate com sorvete de baunilha',
      preco: 28.00,
      destaque: true,
      imagem: '/images/cardapio/petit-gateau.jpg',
      categoria: 'sobremesas',
      subcategoria: 'Quentes'
    },
    {
      id: 26,
      nome: 'Tiramisù Clássico',
      descricao: 'Sobremesa italiana com café, mascarpone e cacau',
      preco: 26.00,
      destaque: true,
      imagem: '/images/cardapio/tiramisu.jpg',
      categoria: 'sobremesas',
      subcategoria: 'Frias'
    },
    {
      id: 27,
      nome: 'Brownie com Sorvete',
      descricao: 'Brownie de chocolate belga com sorvete e calda quente',
      preco: 24.00,
      destaque: false,
      imagem: '/images/cardapio/brownie.jpg',
      categoria: 'sobremesas',
      subcategoria: 'Quentes'
    },
    {
      id: 28,
      nome: 'Cheesecake de Frutas Vermelhas',
      descricao: 'Cheesecake cremoso com calda de frutas vermelhas',
      preco: 25.00,
      destaque: false,
      imagem: '/images/cardapio/cheesecake.jpg',
      categoria: 'sobremesas',
      subcategoria: 'Frias'
    }
  ]
};

// Função helper para pegar todos os itens
export const getAllItems = () => {
  return [
    ...cardapioCompleto.drinks,
    ...cardapioCompleto.petiscos,
    ...cardapioCompleto.pratosPrincipais,
    ...cardapioCompleto.sobremesas
  ];
};

// Função helper para pegar itens por categoria
export const getItemsByCategory = (categoria) => {
  switch(categoria) {
    case 'drinks':
      return cardapioCompleto.drinks;
    case 'petiscos':
      return cardapioCompleto.petiscos;
    case 'pratos':
      return cardapioCompleto.pratosPrincipais;
    case 'sobremesas':
      return cardapioCompleto.sobremesas;
    default:
      return getAllItems();
  }
};

// Função helper para pegar itens em destaque
export const getFeaturedItems = () => {
  return getAllItems().filter(item => item.destaque);
};

export default cardapioCompleto;
