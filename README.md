# ⚡ PredictPro AI

Previsões de jogos de futebol com IA. Frontend no GitHub Pages, backend no Render.

---

## 🗂 Estrutura

```
predictpro-ai/
├── frontend/       → GitHub Pages (HTML + CSS + JS)
│   ├── index.html
│   ├── style.css
│   └── app.js
│
└── backend/        → Render (Node.js + Express)
    ├── server.js
    ├── routes/games.js
    └── services/
        ├── footballApi.js
        └── aiService.js
```

---

## 🚀 Deploy em 4 passos

### 1. APIs necessárias

| Serviço | Link | Plano |
|---|---|---|
| Football-Data.org | https://www.football-data.org/ | Grátis |
| OpenAI | https://platform.openai.com/ | Pago por uso |

### 2. Backend no Render

1. Cria repositório no GitHub com a pasta `backend/`
2. No Render → New Web Service → liga o repo
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. **Root Directory:** `backend`
6. Adiciona as variáveis de ambiente:
   - `FOOTBALL_API_KEY` = chave do football-data.org
   - `OPENAI_API_KEY` = chave da OpenAI
   - `FRONTEND_URL` = `https://teu-usuario.github.io`

### 3. Frontend no GitHub Pages

1. Copia a pasta `frontend/` para um repositório GitHub
2. Em `app.js`, linha 7, muda `API_URL` para a URL do teu Render
3. Settings → Pages → Source: **main branch / root**
4. Acede em `https://teu-usuario.github.io/predictpro-ai`

### 4. Testar localmente

```bash
# Backend
cd backend
cp .env.example .env
# preenche o .env com as tuas chaves
npm install
npm run dev

# Frontend — abre com Live Server ou:
cd frontend
npx serve .
```

---

## ⚠️ Custos estimados

- Football-Data.org: **grátis** (10 req/min no tier free)
- OpenAI gpt-4o-mini: ~**$0.0001 por previsão** (praticamente zero)
- Render free tier: **grátis** (dorme após 15min de inactividade)

---

Feito em Angola 🇦🇴
