# Sistema de Dados Mockados - FLAME

Este documento explica como funciona o sistema de dados mockados implementado no projeto FLAME para facilitar o desenvolvimento e testes.

## Visão Geral

O sistema permite alternar entre dados reais da API e dados mockados locais, facilitando o desenvolvimento quando a API ainda não está disponível ou para testes com dados controlados.

## Como Funciona

### Ativação Automática

- **Em desenvolvimento**: Os dados mockados são ativados automaticamente por padrão
- **Em produção**: Só usa dados mockados se não houver API configurada

### Controle Manual

Durante o desenvolvimento, você verá um botão flutuante no canto inferior direito que permite alternar entre:
- 🗄️ **Mock Data**: Usando dados simulados locais
- 🌐 **API Real**: Usando a API backend

## Dados Disponíveis

### Produtos do Cardápio (20 produtos)
- **Drinks Clássicos**: Caipirinha, Mojito, Whisky Sour, FLAME Signature
- **Drinks Especiais**: Dark Paradise, Neon Nights
- **Petiscos**: Batata Rústica, Coxinha Gourmet, Tábua de Frios
- **Pratos Principais**: Hambúrguer FLAME, Salmão Grelhado
- **Sobremesas**: Petit Gateau, Cheesecake
- **Bebidas sem Álcool**: Sucos e Limonadas
- **Vinhos**: Tintos e Espumantes
- **Cervejas Artesanais**: IPA, Witbier, Porter

### Categorias
- 8 categorias diferentes com produtos variados

### Usuários
- Usuários clientes e administradores para teste

### Mesas
- 8 mesas com diferentes status e capacidades

### Pedidos
- Pedidos simulados com diferentes status

## Estrutura dos Dados

### Produto Mockado
```javascript
{
  id: '1',
  nome: 'FLAME Signature',
  descricao: 'Drink exclusivo da casa...',
  preco: 28.90,
  categoria: 'Drinks Clássicos',
  imagem: 'https://images.unsplash.com/...',
  disponivel: true,
  destaque: true,
  estoque: 50,
  ingredientes: 'Vodka premium, licor...',
  alergenos: 'Contém sulfitos',
  tempoPreparo: 5,
  calorias: 180,
  tags: ['signature', 'vodka', 'framboesa']
}
```

## Funcionalidades Disponíveis

### Filtragem e Busca
- ✅ Filtro por categoria
- ✅ Busca por nome e descrição
- ✅ Filtro por preço (mín/máx)
- ✅ Filtro por produtos em destaque
- ✅ Filtro por disponibilidade

### Paginação
- ✅ Paginação simulada
- ✅ Configuração de itens por página
- ✅ Total de produtos e páginas

### Operações CRUD
- ✅ Criação simulada de novos itens
- ✅ Atualização de dados
- ✅ Remoção de itens
- ✅ Operações em lote

## Hooks Disponíveis

### `useMockData(type, options)`
Hook genérico para qualquer tipo de dado mockado:
```javascript
const { data, loading, error } = useMockData('products', {
  category: 'Drinks Clássicos',
  featured: true,
  page: 1,
  limit: 12
});
```

### `useMockProducts(options)`
Hook específico para produtos:
```javascript
const { data, loading, error } = useMockProducts({
  search: 'drink',
  available: true
});
```

### `useMockCRUD(type)`
Hook para operações CRUD simuladas:
```javascript
const { data, loading, create, update, remove } = useMockCRUD('products');
```

## Integração com Stores

O sistema está integrado ao `productStore` do Zustand. O store automaticamente detecta se deve usar dados mockados e adapta as chamadas accordingly.

### Verificação Automática
```javascript
const shouldUseMockData = () => {
  if (process.env.NODE_ENV === 'development') {
    const mockDataSetting = localStorage.getItem('useMockData');
    return mockDataSetting === null || mockDataSetting === 'true';
  }
  return !process.env.NEXT_PUBLIC_API_URL || localStorage.getItem('useMockData') === 'true';
};
```

## Componentes Integrados

### MockDataToggle
Componente que aparece apenas em desenvolvimento para alternar entre modos:
- Posição: Canto inferior direito
- Só visível em `NODE_ENV=development`
- Salva preferência no localStorage

### ProductCard
Totalmente compatível com dados mockados, exibindo:
- Imagens do Unsplash
- Informações completas do produto
- Status de estoque
- Badges de destaque
- Tempo de preparo
- Informações nutricionais

## Configuração de Desenvolvimento

### Para Usar Dados Mockados (Padrão)
Não precisa fazer nada - já está ativo por padrão em desenvolvimento.

### Para Usar API Real
1. Configure a variável `NEXT_PUBLIC_API_URL` no `.env.local`
2. Ou use o botão toggle para alternar manualmente

### Para Forçar Mock Data em Produção
```javascript
localStorage.setItem('useMockData', 'true');
```

## Vantagens do Sistema

1. **Desenvolvimento Independente**: Não precisa esperar a API estar pronta
2. **Dados Controlados**: Teste com dados conhecidos e consistentes
3. **Performance**: Carregamento mais rápido durante desenvolvimento
4. **Demonstração**: Mostra todas as funcionalidades mesmo sem backend
5. **Testes**: Facilita testes automatizados com dados previsíveis

## Imagens

As imagens dos produtos usam o Unsplash com URLs específicas para cada tipo de produto, garantindo imagens de qualidade e temáticas apropriadas.

## Próximos Passos

Quando a API backend estiver disponível:
1. Configure `NEXT_PUBLIC_API_URL`
2. Use o toggle para alternar para API real
3. Teste a transição entre os dois modos
4. Em produção, remova o `MockDataToggle` ou deixe-o (só aparece em dev)

---

**Nota**: Este sistema é uma ferramenta de desenvolvimento. Em produção, sempre que possível, use dados reais da API para melhor experiência do usuário.
