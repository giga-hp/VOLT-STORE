Volt Store - Server

Servidor Express simples para armazenar produtos em `products.json`.

Instalação e execução:

```bash
cd /home/ryan/Documents/jogos
npm install
npm start
```

A API roda por padrão em `http://localhost:3000`.

Endpoints:
- `GET /products` - lista todos os produtos
- `POST /products` - cria um produto. Body JSON: `{ name, price, category, description, image, status }`
- `PUT /products/:id` - atualiza produto
- `DELETE /products/:id` - remove produto

Observações:
- Armazenamento é feito em `products.json` no mesmo diretório.
- Habilitado CORS para uso direto de páginas estáticas.
