// -------------------- PARSING TABLE --------------------
const parsingTable = {
  S: {
    a: ["a", "A"]
  },

  A: {
    b: ["b", "B", "d"],
    c: ["c", "C"],
    d: ["d", "D"]
  },

  B: {
    a: ["a", "C"],
    b: ["b", "B"]
  },

  C: {
    c: ["c", "S"],
    d: ["ε"],
    $: ["ε"]
  },

  D: {
    a: ["a", "b"]
  }
};


function isNonTerminal(x){ return /^[A-Z]$/.test(x); }

// ====================== ANALISAR COMPLETO ======================
function analisarEntrada(input) {
  const entrada = input.split('').concat('$');
  const pilha = ['$', 'S'];
  const trace = [];

  while (true) {
    const topo = pilha[pilha.length - 1];
    const s = entrada[0];

    if (topo === s && topo === "$") {
      trace.push({ pilha:[...pilha], entrada:entrada.join(""), acao:"Aceito" });
      break;
    }
    else if (topo === s) {
      trace.push({ pilha:[...pilha], entrada:entrada.join(""), acao:`Ler '${s}'`});
      pilha.pop(); entrada.shift();
    }
    else if (isNonTerminal(topo)) {
      const prod = parsingTable[topo]?.[s];
      if (!prod) {
        trace.push({ pilha:[...pilha], entrada:entrada.join(""), acao:`Erro: não há produção para ${topo}`});
        break;
      }
      trace.push({ pilha:[...pilha], entrada:entrada.join(""), acao:`${topo} → ${prod.join("")}`});
      pilha.pop();
      if (!(prod.length === 1 && prod[0] === "ε")) {
        for (let i = prod.length - 1; i >= 0; i--) pilha.push(prod[i]);
      }
    }
    else {
      trace.push({ pilha:[...pilha], entrada:entrada.join(""), acao:`Produção rejeitada`});
      break;
    }
  }

  return {
    trace,
    aceita: /Aceito/.test(trace.at(-1).acao)
  };
}

// ======================== RENDERIZAR ========================
const entradaEl = document.getElementById("entradaUsuario");
const traceTbody = document.querySelector("#traceTable tbody");
const statusEl = document.getElementById("status");
const passCountEl = document.getElementById("passCount");

function renderTrace(list){
  traceTbody.innerHTML = "";
  list.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${row.pilha.join("")}</td><td>${row.entrada}</td><td>${row.acao}</td>`;
    traceTbody.appendChild(tr);
  });
}

// ========================= ANALISAR TUDO =========================
document.getElementById("btnAnalyze").onclick = () => {
  const entrada = entradaEl.value.trim();
  if (!entrada) return alert("Digite uma sentença");

  const result = analisarEntrada(entrada);
  renderTrace(result.trace);
  passCountEl.textContent = result.trace.length;

  if (result.aceita) {
    statusEl.textContent = `Sentença aceita em ${result.trace.length} passos.`;
    statusEl.className = "status accepted";
  } else {
    statusEl.textContent = `Sentença rejeitada após ${result.trace.length} passos.`;
    statusEl.className = "status rejected";
  }

  document.querySelector(".right").scrollIntoView({ behavior: "smooth" });
};

// ========================= REINICIAR =========================
document.getElementById("btnRestart").onclick = () => {
  entradaEl.value = "";
  statusEl.textContent = "";
  statusEl.className = "status";
  traceTbody.innerHTML = "";
  passCountEl.textContent = "0";
  limparDerivacao();
};

// ========================= PASSO A PASSO =========================
let stepState = null;

document.getElementById("btnStep").onclick = () => {
  const entrada = entradaEl.value.trim();
  if (!entrada) return alert("Digite uma sentença");

  if (!stepState || stepState.input !== entrada) {
    stepState = {
      input: entrada,
      entradaArr: entrada.split('').concat('$'),
      pilha: ['$', 'S'],
      trace: [],
      finished: false
    };

    traceTbody.innerHTML = "";
    statusEl.textContent = "";
    statusEl.className = "status";
  }

  if (stepState.finished) return alert("Análise concluída. Reinicie.");

  const topo = stepState.pilha.at(-1);
  const s = stepState.entradaArr[0];

  // Aceito
  if (topo === s && topo === "$") {
    const row = { pilha:[...stepState.pilha], entrada: stepState.entradaArr.join(""), acao:"Aceito" };
    stepState.trace.push(row);
    appendStep(row);
    finishStep(true);
    return;
  }

  // Ler terminal
  if (topo === s) {
    const row = { pilha:[...stepState.pilha], entrada:stepState.entradaArr.join(""), acao:`Ler '${s}'`};
    stepState.trace.push(row);
    appendStep(row);
    stepState.pilha.pop();
    stepState.entradaArr.shift();
  }

  // Aplicar produção
  else if (isNonTerminal(topo)) {
    const prod = parsingTable[topo]?.[s];
    if (!prod) {
      const row = { pilha:[...stepState.pilha], entrada: stepState.entradaArr.join(""), acao:`Erro: não há produção para ${topo}` };
      stepState.trace.push(row);
      appendStep(row);
      finishStep(false);
      return;
    }

    const row = { pilha:[...stepState.pilha], entrada:stepState.entradaArr.join(""), acao:`${topo} → ${prod.join("")}`};
    stepState.trace.push(row);
    appendStep(row);

    stepState.pilha.pop();
    if (!(prod.length === 1 && prod[0] === "ε")) {
      for (let i = prod.length - 1; i >= 0; i--) stepState.pilha.push(prod[i]);
    }
  }

  // Erro
  else {
    const row = { pilha:[...stepState.pilha], entrada: stepState.entradaArr.join(""), acao:`Erro: símbolo inesperado '${topo}'`};
    stepState.trace.push(row);
    appendStep(row);
    finishStep(false);
    return;
  }

  passCountEl.textContent = stepState.trace.length;

  function appendStep(r){
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${r.pilha.join("")}</td><td>${r.entrada}</td><td>${r.acao}</td>`;
    traceTbody.appendChild(tr);
  }

  function finishStep(aceita){
    stepState.finished = true;
    if (aceita) {
      statusEl.textContent = `Sentença aceita em ${stepState.trace.length} passos.`;
      statusEl.className = "status accepted";
    } else {
      statusEl.textContent = `Sentença rejeitada após ${stepState.trace.length} passos.`;
      statusEl.className = "status rejected";
    }
  }
};

// ===================== GERAÇÃO INTERATIVA =====================
let derivacaoAtual = ["S"];
const sentOut = document.getElementById("sentencaMontada");

document.querySelectorAll("#derivTable td[data-prod]").forEach(td => {
  td.addEventListener("click", () => {
    const prod = td.getAttribute("data-prod");
    const left = prod.split("→")[0];
    const right = prod.split("→")[1];

    const idx = derivacaoAtual.findIndex(x => isNonTerminal(x));
    const proximoNT = derivacaoAtual[idx];

    if (left !== proximoNT) {
      td.classList.add("blink-red");
      setTimeout(()=>td.classList.remove("blink-red"),300);
      return;
    }

    const newSymbols = right === "ε" ? [] : right.split("");
    derivacaoAtual.splice(idx,1,...newSymbols);

    atualizarDerivacao();
  });
});

document.getElementById("btnClear").onclick = () => limparDerivacao();

document.getElementById("btnSend").onclick = () => {
  const s = sentOut.value.replace(/\[|\]/g,"");
  entradaEl.value = s;

  document.querySelector(".right").scrollIntoView({ behavior: "smooth" });
  document.getElementById("btnAnalyze").focus();
};

function atualizarDerivacao(){
  const arr = [...derivacaoAtual];
  const idx = arr.findIndex(x => isNonTerminal(x));
  if (idx !== -1) arr[idx] = `[${arr[idx]}]`;
  sentOut.value = arr.join("");
}

function limparDerivacao(){
  derivacaoAtual = ["S"];
  atualizarDerivacao();
}

limparDerivacao();
