import re

# Mapeamento de correções (nome no mockData -> nome correto da imagem)
corrections = {
    "Moscow Mule.png": "Moscow Mule Premium Drink.png",
    "Mojito Clássico.png": "Mojito Clássico Drink.png",
    "Negroni Clássico.png": "Negroni Clássico Drink.png",
    "Old Fashioned.png": "Old Fashioned Drink.png",
    "Crimson Kiss.png": "Crimson Kiss Drink.png",
    "Midnight Smoke.png": "Midnight Smoke Drink.png",
    "Neon Nights.png": "Neon Nights Drink.png",
    "Ruby Passion.png": "Ruby Passion Drink.png",
    "Tequila Shot.png": "Tequila Shot Premium.png",
    "Jägermeister.png": "Jägermeister Shot.png",
    "Tropical Sunset.png": "Tropical Sunset Drink.png",
    "Virgin Mojito Drink.png": "Virgin Mojito Drink.png",  # OK
    "Lager Pilsen Artesanal.png": "Lager Pilsen Copo.png",
    "Rosé Francês Provence.png": "Rosé Provence Taça.png",
    "Jack Daniel\\'s 1L.png": "Jack Daniel's 1L.png",  # Corrigir escape
    "Hendrick\\'s.png": "Hendrick's.png",  # Corrigir escape
    "Polenta Frita Trufada.png": "Polenta Trufada.png",
    "Tábua de Frios Premium.png": "Tábua de Frios Especiais.png",
    "Mini Pastéis Artesanais.png": "Mini Pastéis Variados.png",
    "Refrigerante.png": "Refrigerantes.png",
    "Água Perrier.png": "Perrier.png",
    "Água Tônica Fever-Tree.png": "Tônica Fever-Tree.png",
    "Água Tônica Schweppes.png": "Tônica Schweppes.png",
    "Balde LED.png": "Balde de Gelo LED.png",
    "Kit Frutas.png": "Kit Frutas Premium.png",
    "Narguilé.png": "Narguilé Premium.png",
    "Salmão ao Molho de Maracujá.png": "Salmão ao Maracujá.png",
}

# Ler arquivo mockData.js
mockdata_path = r"d:\exxquema\frontend\src\data\mockData.js"
with open(mockdata_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Aplicar correções
changes_made = 0
for old_name, new_name in corrections.items():
    old_pattern = f"imagem: '/images/cardapio/{old_name}'"
    new_pattern = f"imagem: '/images/cardapio/{new_name}'"

    if old_pattern in content:
        content = content.replace(old_pattern, new_pattern)
        changes_made += 1
        print(f"OK Corrigido: {old_name} -> {new_name}")

# Salvar arquivo atualizado
with open(mockdata_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\nTotal de {changes_made} imagens corrigidas!")
print("Arquivo mockData.js atualizado com sucesso.")
