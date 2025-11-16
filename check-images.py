import os
import re

# Ler imagens da pasta
images_folder = r"D:\exxquema\Imagens do Cardápio"
images_in_folder = set(os.listdir(images_folder))

# Ler mockData.js
mockdata_path = r"d:\exxquema\frontend\src\data\mockData.js"
with open(mockdata_path, 'r', encoding='utf-8') as f:
    mockdata_content = f.read()

# Extrair imagens usadas no mockData
pattern = r"imagem: '/images/cardapio/([^']+)'"
images_in_mockdata = set(re.findall(pattern, mockdata_content))

# Comparar
unused_images = images_in_folder - images_in_mockdata
missing_images = images_in_mockdata - images_in_folder

print("=" * 80)
print(f"TOTAL DE IMAGENS NA PASTA: {len(images_in_folder)}")
print(f"TOTAL DE IMAGENS NO MOCKDATA: {len(images_in_mockdata)}")
print("=" * 80)

if unused_images:
    print(f"\nIMAGENS NAO USADAS ({len(unused_images)}):")
    print("-" * 80)
    for img in sorted(unused_images):
        print(f"  - {img}")
else:
    print("\nTodas as imagens da pasta estao sendo usadas!")

if missing_images:
    print(f"\nIMAGENS FALTANDO NA PASTA ({len(missing_images)}):")
    print("-" * 80)
    for img in sorted(missing_images):
        print(f"  - {img}")
else:
    print("\nTodas as imagens do mockData existem na pasta!")

print("\n" + "=" * 80)
