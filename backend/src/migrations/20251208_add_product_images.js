/**
 * Migration para adicionar imagens aos produtos
 * Baseado nos arquivos existentes em frontend/public/images/cardapio/
 */

const { sequelize } = require('../config/database');

// Mapeamento de nomes de produtos para imagens
const productImageMap = {
  // Drinks Clássicos
  'Aperol Spritz': '/images/cardapio/Aperol Spritz Drink.png',
  'Bourbon Sour': '/images/cardapio/Bourbon Sour Copo.png',
  'Mojito Clássico': '/images/cardapio/Mojito Clássico Drink.png',
  'Moscow Mule': '/images/cardapio/Moscow Mule Premium Drink.png',
  'Moscow Mule Premium': '/images/cardapio/Moscow Mule Premium Drink.png',
  'Negroni Clássico': '/images/cardapio/Negroni Clássico Drink.png',
  'Old Fashioned': '/images/cardapio/Old Fashioned Drink.png',
  'Caipirinha Clássica': '/images/cardapio/Caipirinha de Cachaça Artesanal.png',
  'Caipirinha de Cachaça Artesanal': '/images/cardapio/Caipirinha de Cachaça Artesanal.png',
  'Gin Tônica': '/images/cardapio/Gin Tônica Premium.png',
  'Gin Tônica Premium': '/images/cardapio/Gin Tônica Premium.png',
  'Mojito': '/images/cardapio/Mojito Clássico Drink.png',

  // Drinks Especiais/Autorais
  'Crimson Kiss': '/images/cardapio/Crimson Kiss Drink.png',
  'Crimson Spritz Zero': '/images/cardapio/Crimson Spritz Zero Drink.png',
  'Midnight Smoke': '/images/cardapio/Midnight Smoke Drink.png',
  'Neon Nights': '/images/cardapio/Neon Nights Drink.png',
  'Ruby Passion': '/images/cardapio/Ruby Passion Drink.png',
  'Tropical Sunset': '/images/cardapio/Tropical Sunset Drink.png',
  'Dark Paradise': '/images/cardapio/Dark Paradise.png',
  'Lemon Drop': '/images/cardapio/Lemon Drop.png',
  'Red Light Signature': '/images/cardapio/Red Light Signature.png',
  'Red Light Bomb': '/images/cardapio/Red Light Bomb.png',

  // Não alcoólicos
  'Virgin Mojito': '/images/cardapio/Virgin Mojito Drink.png',
  'Limonada Suíça': '/images/cardapio/Limonada Suíça Premium.png',
  'Limonada Suíça Premium': '/images/cardapio/Limonada Suíça Premium.png',

  // Cervejas
  'APA Tropical': '/images/cardapio/APA Tropical Copo.png',
  'IPA': '/images/cardapio/IPA Exxquema Copo.png',
  'IPA Exxquema': '/images/cardapio/IPA Exxquema Copo.png',
  'Lager Pilsen': '/images/cardapio/Lager Pilsen Copo.png',
  'Porter Imperial': '/images/cardapio/Porter Imperial Taça.png',
  'Witbier': '/images/cardapio/Witbier Copo.png',

  // Vinhos
  'Cabernet Sauvignon': '/images/cardapio/Cabernet Sauvignon Reserva.png',
  'Cabernet Sauvignon Reserva': '/images/cardapio/Cabernet Sauvignon Reserva.png',
  'Malbec': '/images/cardapio/Malbec Taça.png',
  'Rosé Provence': '/images/cardapio/Rosé Provence Taça.png',
  'Prosecco': '/images/cardapio/Prosecco Taça.png',
  'Chandon Brut': '/images/cardapio/Chandon Brut Taça.png',

  // Destilados/Garrafas
  'Gin Tanqueray': '/images/cardapio/Gin Tanqueray 1L.png',
  'Grey Goose': '/images/cardapio/Grey Goose 750ml.png',
  'Hendricks': '/images/cardapio/Hendrick\'s.png',
  "Hendrick's": '/images/cardapio/Hendrick\'s.png',
  'Bombay Sapphire': '/images/cardapio/Bombay Sapphire.png',
  'Jack Daniels': '/images/cardapio/Jack Daniel\'s 1L.png',
  "Jack Daniel's": '/images/cardapio/Jack Daniel\'s 1L.png',
  'Johnnie Walker Black': '/images/cardapio/Johnnie Walker Black Label 1L.png',
  'Johnnie Walker Black Label': '/images/cardapio/Johnnie Walker Black Label 1L.png',
  'Chivas Regal': '/images/cardapio/Chivas Regal.png',
  'Vodka Absolut': '/images/cardapio/Vodka Absolut 1L.png',
  'Absolut': '/images/cardapio/Vodka Absolut 1L.png',
  'Vodka Ciroc': '/images/cardapio/Vodka Ciroc 750ml.png',
  'Ciroc': '/images/cardapio/Vodka Ciroc 750ml.png',
  'Bacardi Ouro': '/images/cardapio/Bacardi Ouro.png',
  'Patrón Silver': '/images/cardapio/Patrón Silver.png',
  'Tequila José Cuervo': '/images/cardapio/Tequila José Cuervo Gold 750ml.png',
  'José Cuervo Gold': '/images/cardapio/Tequila José Cuervo Gold 750ml.png',
  'Jägermeister': '/images/cardapio/Jägermeister Shot.png',
  'Saquê': '/images/cardapio/Saquê Quente.png',
  'Saquê Quente': '/images/cardapio/Saquê Quente.png',

  // Shots
  'Tequila Shot': '/images/cardapio/Tequila Shot Premium.png',
  'B-52': '/images/cardapio/B-52 Flamejado.png',
  'B-52 Flamejado': '/images/cardapio/B-52 Flamejado.png',

  // Red Bull
  'Red Bull': '/images/cardapio/Red Bull Original.png',
  'Red Bull Original': '/images/cardapio/Red Bull Original.png',
  'Red Bull Açaí': '/images/cardapio/Red Bull Açaí.png',
  'Red Bull Tropical': '/images/cardapio/Red Bull Tropical.png',

  // Petiscos
  'Batata Rústica': '/images/cardapio/Batata Rústica com Molhos Especiais.png',
  'Batata Rústica com Molhos': '/images/cardapio/Batata Rústica com Molhos Especiais.png',
  'Bolinhos de Bacalhau': '/images/cardapio/Bolinhos de Bacalhau.png',
  'Bruschetta': '/images/cardapio/Bruschetta Mix Premium.png',
  'Bruschetta Mix': '/images/cardapio/Bruschetta Mix Premium.png',
  'Bruschetta Mix Premium': '/images/cardapio/Bruschetta Mix Premium.png',
  'Burrata': '/images/cardapio/Burrata com Tomate Confit.png',
  'Burrata com Tomate Confit': '/images/cardapio/Burrata com Tomate Confit.png',
  'Coxinha de Frango': '/images/cardapio/Coxinha de Frango com Catupiry.png',
  'Coxinha de Frango com Catupiry': '/images/cardapio/Coxinha de Frango com Catupiry.png',
  'Nachos': '/images/cardapio/Nachos Exxquema.png',
  'Nachos Exxquema': '/images/cardapio/Nachos Exxquema.png',
  'Tábua de Frios': '/images/cardapio/Tábua de Frios Especiais.png',
  'Tábua de Frios Especiais': '/images/cardapio/Tábua de Frios Especiais.png',

  // Pratos Principais
  'Hambúrguer': '/images/cardapio/Exxquema Burger Premium.png',
  'Hambúrguer FLAME': '/images/cardapio/Exxquema Burger Premium.png',
  'Exxquema Burger': '/images/cardapio/Exxquema Burger Premium.png',
  'Exxquema Burger Premium': '/images/cardapio/Exxquema Burger Premium.png',
  'Picanha': '/images/cardapio/Picanha na Brasa.png',
  'Picanha na Brasa': '/images/cardapio/Picanha na Brasa.png',
  'Picanha na Chapa': '/images/cardapio/Picanha na Brasa.png',
  'Risoto de Cogumelos': '/images/cardapio/Risoto de Cogumelos.png',

  // Sobremesas
  'Brownie': '/images/cardapio/Brownie Premium com Sorvete.png',
  'Brownie Premium': '/images/cardapio/Brownie Premium com Sorvete.png',
  'Brownie com Sorvete': '/images/cardapio/Brownie Premium com Sorvete.png',
  'Cheesecake': '/images/cardapio/Cheesecake de Frutas Vermelhas.png',
  'Cheesecake de Frutas Vermelhas': '/images/cardapio/Cheesecake de Frutas Vermelhas.png',
  'Petit Gateau': '/images/cardapio/Petit Gateau Exxquema.png',
  'Petit Gateau Exxquema': '/images/cardapio/Petit Gateau Exxquema.png',
};

async function run() {
  console.log('🖼️ Iniciando atualização de imagens dos produtos...\n');

  let updated = 0;
  let notFound = [];

  for (const [productName, imagePath] of Object.entries(productImageMap)) {
    try {
      // Buscar produto com nome exato ou similar
      const [result] = await sequelize.query(
        `UPDATE products SET image = :imagePath WHERE LOWER(name) = LOWER(:productName) AND (image IS NULL OR image = '')`,
        {
          replacements: { imagePath, productName },
          type: sequelize.QueryTypes.UPDATE
        }
      );

      if (result > 0) {
        console.log(`✅ ${productName} → ${imagePath}`);
        updated++;
      }
    } catch (error) {
      console.error(`❌ Erro ao atualizar ${productName}:`, error.message);
    }
  }

  // Também tentar match parcial para produtos que não foram encontrados
  console.log('\n🔍 Tentando match parcial...\n');

  for (const [productName, imagePath] of Object.entries(productImageMap)) {
    try {
      const [result] = await sequelize.query(
        `UPDATE products SET image = :imagePath WHERE LOWER(name) LIKE LOWER(:searchTerm) AND (image IS NULL OR image = '')`,
        {
          replacements: {
            imagePath,
            searchTerm: `%${productName.split(' ')[0]}%`
          },
          type: sequelize.QueryTypes.UPDATE
        }
      );

      if (result > 0) {
        console.log(`✅ (parcial) ${productName} → ${imagePath}`);
        updated++;
      }
    } catch (error) {
      // Ignora erros de match parcial
    }
  }

  console.log(`\n✨ ${updated} produtos atualizados com imagens!`);
}

module.exports = { run, productImageMap };

// Executar se chamado diretamente
if (require.main === module) {
  run()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
