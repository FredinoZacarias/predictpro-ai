// =============================================
// PREDICTPRO AI — Frontend App
// Troca esta URL pela URL do teu Render depois
// =============================================

const API_URL = "https://predictpro-api-nnre.onrender.com"; // ← MUDAR para teu backend Render

// ---------- Estado ----------
let isLoading = false;

// ---------- Elementos ----------
const loadBtn       = document.getElementById("loadBtn");
const loadingState  = document.getElementById("loadingState");
const errorState    = document.getElementById("errorState");
const gamesSection  = document.getElementById("gamesSection");
const gamesGrid     = document.getElementById("gamesGrid");
const statGames     = document.getElementById("statGames");

// ---------- Carregar jogos ----------
async function loadGames() {
  if (isLoading) return;
  isLoading = true;

  // Reset UI
  loadBtn.disabled = true;
  loadBtn.textContent = "A carregar…";
  loadingState.style.display = "block";
  errorState.style.display = "none";
  gamesSection.style.display = "none";
  gamesGrid.innerHTML = "";

  try {
    const res = await fetch(`${API_URL}/games`);

    if (!res.ok) {
      throw new Error(`Erro ${res.status}: ${res.statusText}`);
    }

    const games = await res.json();

    renderGames(games);
    statGames.textContent = games.length;

  } catch (err) {
    showError(err.message || "Não foi possível ligar ao servidor.");
  } finally {
    isLoading = false;
    loadBtn.disabled = false;
    loadBtn.textContent = "Ver previsões de hoje";
    loadingState.style.display = "none";
  }
}

// ---------- Renderizar cards ----------
function renderGames(games) {
  gamesSection.style.display = "block";

  if (!games || games.length === 0) {
    gamesGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <p>Sem jogos disponíveis para hoje.<br/>Tenta mais tarde.</p>
      </div>
    `;
    return;
  }

  gamesGrid.innerHTML = games.map(game => buildCard(game)).join("");
}

// ---------- Construir card ----------
function buildCard(game) {
  const { homeTeam, awayTeam, competition, utcDate, prediction } = game;

  // Formatar hora
  const date = utcDate ? new Date(utcDate) : null;
  const timeStr = date
    ? date.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }) + " (UTC)"
    : "—";

  // Nível de confiança a partir da previsão da IA
  const conf = extractConfidence(prediction);
  const confClass = conf.level;
  const confLabel = { high: "Alta confiança", medium: "Confiança média", low: "Baixa confiança" }[conf.level];

  // Formatar texto da previsão
  const formattedPrediction = formatPrediction(prediction);

  return `
    <div class="game-card conf-${confClass}">
      <div class="card-competition">${escapeHtml(competition || "Competição desconhecida")}</div>

      <div class="card-teams">
        <div class="team-name">${escapeHtml(homeTeam)}</div>
        <div class="vs-badge">VS</div>
        <div class="team-name">${escapeHtml(awayTeam)}</div>
      </div>

      <div class="card-divider"></div>

      <div class="card-prediction">${formattedPrediction}</div>

      <div class="card-footer">
        <span class="conf-badge ${confClass}">${confLabel}</span>
        <span class="card-time">⏱ ${timeStr}</span>
      </div>
    </div>
  `;
}

// ---------- Extrair nível de confiança ----------
function extractConfidence(text) {
  if (!text) return { level: "medium" };

  const lower = text.toLowerCase();

  // Palavras que indicam alta confiança
  if (
    lower.includes("clara vantagem") ||
    lower.includes("forte favorito") ||
    lower.includes("muito provável") ||
    lower.includes("alta probabilidade")
  ) {
    return { level: "high" };
  }

  // Palavras que indicam baixa confiança
  if (
    lower.includes("imprevisível") ||
    lower.includes("incerto") ||
    lower.includes("difícil prever") ||
    lower.includes("equilibrado")
  ) {
    return { level: "low" };
  }

  return { level: "medium" };
}

// ---------- Formatar texto da IA ----------
function formatPrediction(text) {
  if (!text) return "<em>Sem previsão disponível.</em>";

  // Negrito em palavras-chave
  return escapeHtml(text)
    .replace(/(vitória|empate|derrota|golos|favorito|vantagem|probabilidade)/gi,
      "<strong>$1</strong>"
    )
    .replace(/\n/g, "<br/>");
}

// ---------- Mostrar erro ----------
function showError(msg) {
  errorState.style.display = "block";
  document.getElementById("errorMsg").textContent = msg;
}

// ---------- Utilitário ----------
function escapeHtml(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}
