/* ============================================================
   CURSO DEV MODS FIVEM — Base de conteúdo (Roadmap gamificado)
   Fontes de referência: https://docs.fivem.net/docs/ + YouTube
   ------------------------------------------------------------
   Estrutura:
   COURSE.tracks[] -> trilhas do roadmap
     track.lessons[] -> aulas
       lesson.videos[] -> { label, query }  (abre busca no YouTube)
       lesson.docs[]   -> { label, url }    (documentação oficial)
       lesson.quiz[]   -> { q, options[], answer, explain }
   ============================================================ */

const COURSE = {
  meta: {
    title: "FiveM Dev Academy",
    subtitle: "Do zero ao desenvolvedor de mods completo",
    version: "1.0",
  },

  // XP necessário para subir de nível (índice = nível-1).
  // Calibrado para que concluir 100% das aulas (~1780 XP) alcance o nível 10.
  levelCurve: [0, 80, 180, 300, 450, 650, 900, 1200, 1500, 1780],

  tracks: [
    /* =====================================================
       TRILHA 0 — FUNDAMENTOS
       ===================================================== */
    {
      id: "fundamentos",
      title: "Fundamentos do FiveM",
      tag: "Iniciante",
      icon: "🧭",
      color: "#22d3ee",
      summary:
        "Entenda o que é o FiveM, como o CitizenFX (CFX) funciona, a arquitetura cliente/servidor e como montar seu ambiente de desenvolvimento.",
      lessons: [
        {
          id: "f1",
          title: "O que é FiveM e CitizenFX (CFX)",
          type: "Teoria",
          xp: 40,
          duration: "20 min",
          objectives: [
            "Entender a relação entre GTA V, FiveM e o CFX.re",
            "Conhecer a diferença entre cliente, servidor e recursos (resources)",
            "Saber o que é um servidor RP e por que ele precisa de mods",
          ],
          content:
            "FiveM é uma plataforma de modificação multiplayer para o GTA V mantida pela CFX.re. Ele permite rodar servidores próprios com regras, scripts e assets customizados. Tudo que você cria roda dentro de **recursos** (resources): pastas com um manifesto (`fxmanifest.lua`) que descrevem scripts de cliente, servidor e arquivos. Antes de programar, é essencial entender essa arquitetura: o **cliente** roda na máquina do jogador (renderização, input, NUI) e o **servidor** roda na máquina host (lógica autoritativa, banco de dados, segurança).",
          docs: [
            { label: "Introdução (docs oficiais)", url: "https://docs.fivem.net/docs/" },
            { label: "Server-side vs Client-side", url: "https://docs.fivem.net/docs/scripting-manual/introduction/" },
          ],
          videos: [
            { label: "O que é FiveM (explicação)", query: "o que é fivem explicação iniciantes" },
            { label: "Como funciona um servidor FiveM", query: "como funciona servidor fivem arquitetura" },
          ],
          quiz: [
            {
              q: "Onde roda a lógica que deve ser confiável e segura (ex: dar dinheiro a um jogador)?",
              options: ["No cliente", "No servidor", "Na NUI", "No fxmanifest"],
              answer: 1,
              explain: "O servidor é autoritativo. Lógica sensível NUNCA deve confiar no cliente, que pode ser manipulado por cheaters.",
            },
            {
              q: "O que descreve quais scripts e arquivos um recurso usa?",
              options: ["package.json", "fxmanifest.lua", "config.cfg", "index.html"],
              answer: 1,
              explain: "O fxmanifest.lua é o manifesto do recurso. Sem ele, o FiveM não sabe o que carregar.",
            },
          ],
        },
        {
          id: "f2",
          title: "Montando o ambiente de desenvolvimento",
          type: "Prática",
          xp: 50,
          duration: "35 min",
          objectives: [
            "Instalar VS Code e extensões para Lua",
            "Baixar e rodar um servidor FiveM local (artifacts)",
            "Configurar server.cfg e iniciar pela primeira vez",
          ],
          content:
            "Você vai precisar de: **VS Code** (editor), o **server artifacts** do FiveM (o executável do servidor), uma cópia do GTA V e o **txAdmin** (painel de gerenciamento embutido). O fluxo é: baixar os artifacts → criar a pasta do servidor → configurar o `server.cfg` (com sua license key do keymaster) → iniciar. O txAdmin facilita tudo com uma interface web.",
          docs: [
            { label: "Setting up a server", url: "https://docs.fivem.net/docs/server-manual/setting-up-a-server/" },
            { label: "txAdmin", url: "https://docs.fivem.net/docs/server-manual/setting-up-a-server-txadmin/" },
            { label: "Keymaster (license key)", url: "https://portal.cfx.re/" },
          ],
          videos: [
            { label: "Instalar servidor FiveM do zero", query: "instalar servidor fivem do zero txadmin 2024" },
            { label: "Configurar VS Code para FiveM Lua", query: "vscode configurar lua fivem extensões" },
          ],
          quiz: [
            {
              q: "Qual painel web vem embutido para gerenciar o servidor FiveM?",
              options: ["phpMyAdmin", "txAdmin", "cPanel", "Plesk"],
              answer: 1,
              explain: "O txAdmin é o painel oficial de gerenciamento, com console, recursos, players e mais.",
            },
            {
              q: "Onde você coloca a license key gerada no keymaster?",
              options: ["No fxmanifest.lua", "No server.cfg", "No client.lua", "No banco de dados"],
              answer: 1,
              explain: "A linha `sv_licenseKey` fica no server.cfg. Sem ela o servidor não inicia.",
            },
          ],
        },
        {
          id: "f3",
          title: "Anatomia de um recurso (resource)",
          type: "Prática",
          xp: 50,
          duration: "30 min",
          objectives: [
            "Criar seu primeiro recurso 'hello world'",
            "Entender fxmanifest.lua (client_script, server_script, ui_page)",
            "Usar ensure/start/restart no console",
          ],
          content:
            "Um recurso é uma pasta dentro de `resources/`. O `fxmanifest.lua` declara a `fx_version`, o `game 'gta5'`, e quais arquivos são `client_script`, `server_script`, `shared_script`, `ui_page`, `files`, etc. Para ativar, use `ensure nome_do_recurso` no server.cfg ou console. Esse é o bloco de construção de TUDO no FiveM.",
          docs: [
            { label: "Resource manifest", url: "https://docs.fivem.net/docs/scripting-reference/resource-manifest/resource-manifest/" },
            { label: "Creating your first script", url: "https://docs.fivem.net/docs/scripting-manual/introduction/creating-your-first-script/" },
          ],
          videos: [
            { label: "Primeiro script FiveM (hello world)", query: "primeiro script fivem lua fxmanifest tutorial" },
            { label: "Entendendo fxmanifest.lua", query: "fxmanifest.lua explicado fivem" },
          ],
          quiz: [
            {
              q: "Qual comando garante que um recurso esteja ativo (iniciando se necessário)?",
              options: ["run", "ensure", "load", "exec"],
              answer: 1,
              explain: "`ensure` inicia o recurso, ou reinicia se já estiver rodando. Mais seguro que `start`.",
            },
          ],
        },
      ],
    },

    /* =====================================================
       TRILHA 1 — LÓGICA E PROGRAMAÇÃO (LUA)
       ===================================================== */
    {
      id: "lua",
      title: "Programação com Lua",
      tag: "Iniciante",
      icon: "🌙",
      color: "#a78bfa",
      summary:
        "Lua é a linguagem principal do FiveM. Aqui você aprende a lógica de programação que vai usar em todos os scripts.",
      lessons: [
        {
          id: "l1",
          title: "Sintaxe básica de Lua",
          type: "Teoria",
          xp: 50,
          duration: "40 min",
          objectives: [
            "Variáveis, tipos e operadores",
            "Condicionais (if/elseif/else) e loops (for/while)",
            "Funções e escopo (local vs global)",
          ],
          content:
            "Lua é leve e simples. Pontos-chave: variáveis são **globais por padrão** (sempre use `local`!), strings com `..` para concatenar, `nil` para ausência de valor, e comparação com `==`/`~=` (diferente). Domine `if`, `for i=1,10 do`, `while`, e funções `function nome() end`.",
          docs: [
            { label: "Lua (referência scripting)", url: "https://docs.fivem.net/docs/scripting-manual/runtimes/lua/" },
            { label: "Programming in Lua (livro oficial)", url: "https://www.lua.org/pil/" },
          ],
          videos: [
            { label: "Lua do zero para FiveM", query: "lua básico do zero fivem programação" },
            { label: "Curso de Lua completo PT-BR", query: "curso lua completo português iniciantes" },
          ],
          quiz: [
            {
              q: "Como se declara uma variável de escopo local em Lua?",
              options: ["var x = 1", "let x = 1", "local x = 1", "x := 1"],
              answer: 2,
              explain: "`local x = 1`. Sem `local`, a variável vira global — má prática que causa bugs e conflitos.",
            },
            {
              q: "Qual operador significa 'diferente de' em Lua?",
              options: ["!=", "<>", "~=", "=/="],
              answer: 2,
              explain: "Lua usa `~=` para 'diferente'. O `!=` não existe em Lua.",
            },
          ],
        },
        {
          id: "l2",
          title: "Tables, loops e estruturas de dados",
          type: "Prática",
          xp: 60,
          duration: "45 min",
          objectives: [
            "Entender tables como arrays E dicionários",
            "Iterar com pairs/ipairs",
            "Estruturar dados de jogadores, itens, configs",
          ],
          content:
            "A **table** é a única estrutura de dados de Lua — e faz tudo: lista, dicionário, objeto. `local t = {1,2,3}` (array), `local p = {nome='João', vida=100}` (dicionário). Itere com `ipairs` (arrays ordenados) e `pairs` (qualquer chave). Você vai usar tables o tempo todo: configs, inventários, listas de players.",
          docs: [
            { label: "Lua tables (PIL)", url: "https://www.lua.org/pil/2.5.html" },
          ],
          videos: [
            { label: "Tables em Lua explicadas", query: "lua tables explicado pairs ipairs" },
            { label: "Estruturas de dados Lua FiveM", query: "lua estruturas de dados fivem inventário" },
          ],
          quiz: [
            {
              q: "Qual função itera sobre uma table com chaves de texto (dicionário)?",
              options: ["ipairs", "pairs", "next", "foreach"],
              answer: 1,
              explain: "`pairs` percorre qualquer chave. `ipairs` só funciona para índices numéricos sequenciais.",
            },
          ],
        },
        {
          id: "l3",
          title: "Funções, callbacks e boas práticas",
          type: "Prática",
          xp: 60,
          duration: "40 min",
          objectives: [
            "Funções com múltiplos retornos e parâmetros variádicos",
            "Callbacks e funções anônimas",
            "Organização de código e legibilidade",
          ],
          content:
            "Lua permite retornar vários valores (`return a, b`), funções anônimas (`function() ... end`) e passar funções como argumento (callbacks) — base de toda a programação assíncrona do FiveM. Boas práticas: nomes claros, funções pequenas, evite globais, comente o 'porquê'.",
          docs: [
            { label: "Lua functions (PIL)", url: "https://www.lua.org/pil/5.html" },
          ],
          videos: [
            { label: "Funções e callbacks em Lua", query: "lua funções callbacks anônimas tutorial" },
          ],
          quiz: [
            {
              q: "O que uma função em Lua pode fazer que muitas linguagens não permitem nativamente?",
              options: ["Retornar múltiplos valores", "Existir sem nome", "Receber outra função", "Todas as anteriores"],
              answer: 3,
              explain: "Lua suporta múltiplos retornos, funções anônimas E funções como argumento (first-class functions).",
            },
          ],
        },
      ],
    },

    /* =====================================================
       TRILHA 2 — PRÉ-CURSO: MODELAGEM 3D (BLENDER)
       ===================================================== */
    {
      id: "blender",
      title: "Pré-curso: Modelagem 3D (Blender)",
      tag: "Pré-requisito",
      icon: "🎨",
      color: "#f59e0b",
      summary:
        "Para criar carros, MLOs, roupas e props você precisa de modelagem 3D. O Blender é gratuito e poderoso. Esta trilha te dá a base.",
      lessons: [
        {
          id: "b1",
          title: "Interface e navegação no Blender",
          type: "Teoria",
          xp: 40,
          duration: "30 min",
          objectives: [
            "Navegar na viewport (orbit, pan, zoom)",
            "Entender objetos, mesh, edit mode",
            "Atalhos essenciais (G, R, S, Tab)",
          ],
          content:
            "Antes de modelar para GTA, domine o Blender. A navegação 3D, o modo objeto vs modo edição, e os atalhos de transformação (G=mover, R=rotacionar, S=escalar) são a base. Invista tempo aqui — vai economizar horas depois.",
          docs: [
            { label: "Blender Manual (oficial)", url: "https://docs.blender.org/manual/en/latest/" },
            { label: "Download Blender (grátis)", url: "https://www.blender.org/download/" },
          ],
          videos: [
            { label: "Blender para iniciantes PT-BR", query: "blender para iniciantes português completo" },
            { label: "Donut tutorial (clássico)", query: "blender donut tutorial beginner" },
          ],
          quiz: [
            {
              q: "Qual atalho ativa/desativa o modo de edição de malha?",
              options: ["Tab", "E", "Ctrl+E", "M"],
              answer: 0,
              explain: "`Tab` alterna entre Object Mode e Edit Mode — onde você edita vértices, arestas e faces.",
            },
          ],
        },
        {
          id: "b2",
          title: "Modelagem de props e objetos",
          type: "Prática",
          xp: 60,
          duration: "50 min",
          objectives: [
            "Modelagem básica (extrude, loop cut, bevel)",
            "Topologia limpa e contagem de polígonos",
            "Pensar em otimização para jogos",
          ],
          content:
            "Modelar para games é diferente de render cinematográfico: você precisa de **baixa contagem de polígonos** e topologia limpa. Aprenda extrude, loop cut, bevel e o conceito de 'game-ready asset'. Props (objetos como caixas, móveis, armas) são o melhor ponto de partida.",
          docs: [
            { label: "Modeling (Blender Manual)", url: "https://docs.blender.org/manual/en/latest/modeling/index.html" },
          ],
          videos: [
            { label: "Modelagem game-ready Blender", query: "blender modelagem game ready low poly props" },
            { label: "Criar prop para GTA V", query: "criar prop blender gta v fivem tutorial" },
          ],
          quiz: [
            {
              q: "Por que assets de jogo usam baixa contagem de polígonos?",
              options: ["Para ficar feio", "Para performance/FPS", "Exigência do Blender", "Não importa"],
              answer: 1,
              explain: "Menos polígonos = melhor performance. Servidores e clientes precisam renderizar tudo em tempo real.",
            },
          ],
        },
        {
          id: "b3",
          title: "UV mapping e texturização",
          type: "Prática",
          xp: 60,
          duration: "50 min",
          objectives: [
            "Criar seams e fazer UV unwrap",
            "Aplicar materiais e texturas",
            "Exportar texturas em formatos compatíveis",
          ],
          content:
            "**UV mapping** é 'desdobrar' o modelo 3D em 2D para aplicar texturas. Aprenda a marcar seams, fazer unwrap e pintar/aplicar texturas. Para GTA V as texturas geralmente viram arquivos `.ytd`. Texturização boa é o que separa um asset amador de um profissional.",
          docs: [
            { label: "UV editing (Blender Manual)", url: "https://docs.blender.org/manual/en/latest/modeling/meshes/uv/index.html" },
          ],
          videos: [
            { label: "UV mapping para iniciantes", query: "blender uv mapping unwrap iniciantes português" },
            { label: "Texturização para games", query: "blender texturização game asset tutorial" },
          ],
          quiz: [
            {
              q: "O que é uma 'seam' no UV mapping?",
              options: ["Um tipo de luz", "Uma costura onde o modelo é 'cortado' para desdobrar", "Um modificador", "Um shader"],
              answer: 1,
              explain: "Seams são as 'costuras' que definem onde o modelo é cortado para ser planificado em 2D.",
            },
          ],
        },
        {
          id: "b4",
          title: "Exportar para GTA V (OpenIV / CodeWalker)",
          type: "Projeto",
          xp: 80,
          duration: "60 min",
          objectives: [
            "Conhecer formatos do GTA V (.ydr, .ytd, .ymap)",
            "Usar Sollumz (addon Blender) para exportar",
            "Importar no jogo via OpenIV/CodeWalker",
          ],
          content:
            "O GTA V usa formatos próprios: **.ydr** (modelo), **.ytd** (texturas), **.ymap** (posicionamento no mapa). O addon **Sollumz** para Blender exporta direto para esses formatos. Ferramentas como **OpenIV** e **CodeWalker** permitem importar e posicionar no jogo. Este é o elo entre modelagem e FiveM.",
          docs: [
            { label: "Sollumz (addon GitHub)", url: "https://github.com/Sollumz/Sollumz" },
            { label: "CodeWalker", url: "https://github.com/dexyfex/CodeWalker" },
          ],
          videos: [
            { label: "Sollumz exportar para GTA V", query: "sollumz blender export gta v fivem tutorial" },
            { label: "CodeWalker para iniciantes", query: "codewalker tutorial iniciantes gta v map" },
          ],
          quiz: [
            {
              q: "Qual addon do Blender exporta modelos diretamente para o formato do GTA V?",
              options: ["GIMS Evo", "Sollumz", "ZModeler", "Substance"],
              answer: 1,
              explain: "Sollumz é o addon gratuito de Blender mais usado para criar .ydr/.ytd/.ymap. ZModeler é pago e separado.",
            },
          ],
        },
      ],
    },

    /* =====================================================
       TRILHA 3 — FIVEM CORE: SCRIPTING
       ===================================================== */
    {
      id: "core",
      title: "FiveM Core: Scripting",
      tag: "Intermediário",
      icon: "⚙️",
      color: "#34d399",
      summary:
        "O coração do desenvolvimento: natives, eventos, comunicação cliente-servidor, comandos e threads. Aqui você vira dev de verdade.",
      lessons: [
        {
          id: "c1",
          title: "Natives: a API do GTA V",
          type: "Teoria",
          xp: 60,
          duration: "45 min",
          objectives: [
            "Entender o que são natives e como achá-los",
            "Usar a documentação de natives (FiveM/native db)",
            "Exemplos: spawnar veículo, dar arma, teleportar",
          ],
          content:
            "**Natives** são funções do motor do GTA V que você chama via FiveM. Tudo no jogo (criar veículo, controlar clima, animar peds) é feito com natives. A documentação lista milhares delas. Aprenda a LER a doc: nome, parâmetros, retorno, e em qual contexto (client/server) rodam.",
          docs: [
            { label: "Native reference (FiveM)", url: "https://docs.fivem.net/natives/" },
            { label: "Scripting reference", url: "https://docs.fivem.net/docs/scripting-reference/" },
          ],
          videos: [
            { label: "O que são natives FiveM", query: "fivem natives explicado como usar tutorial" },
            { label: "Usando natives na prática", query: "fivem natives prática spawnar veículo lua" },
          ],
          quiz: [
            {
              q: "Natives são, essencialmente:",
              options: ["Plugins externos", "Funções do motor do GTA V expostas ao script", "Arquivos de textura", "Comandos de SQL"],
              answer: 1,
              explain: "Natives são as funções internas do engine do GTA V que o FiveM expõe para você usar nos scripts.",
            },
          ],
        },
        {
          id: "c2",
          title: "Eventos e comunicação cliente↔servidor",
          type: "Prática",
          xp: 80,
          duration: "60 min",
          objectives: [
            "RegisterNetEvent / AddEventHandler",
            "TriggerServerEvent / TriggerClientEvent",
            "Segurança: nunca confiar no cliente",
          ],
          content:
            "Eventos são como cliente e servidor conversam. O cliente dispara `TriggerServerEvent('meuEvento', dados)` e o servidor escuta com `RegisterNetEvent` + handler. O servidor responde com `TriggerClientEvent`. **REGRA DE OURO**: valide TUDO no servidor. Um cheater pode disparar qualquer evento com qualquer dado.",
          docs: [
            { label: "Events (scripting)", url: "https://docs.fivem.net/docs/scripting-manual/working-with-events/" },
            { label: "Server events", url: "https://docs.fivem.net/docs/scripting-reference/events/server-events/" },
          ],
          videos: [
            { label: "Eventos cliente servidor FiveM", query: "fivem eventos cliente servidor triggerserverevent tutorial" },
            { label: "Segurança de eventos (anti-cheat)", query: "fivem segurança eventos validação servidor anticheat" },
          ],
          quiz: [
            {
              q: "Um jogador malicioso dispara um evento de servidor 'darDinheiro' com valor 999999. O que evita o abuso?",
              options: ["Confiar no valor enviado", "Validar e calcular o valor no servidor", "Esconder o evento no cliente", "Usar nomes secretos de evento"],
              answer: 1,
              explain: "Toda lógica sensível e validação deve estar no servidor. Nomes 'secretos' são facilmente descobertos.",
            },
            {
              q: "Qual função registra um evento que pode ser chamado pela rede?",
              options: ["AddEventHandler", "RegisterNetEvent", "RegisterCommand", "CreateThread"],
              answer: 1,
              explain: "`RegisterNetEvent` registra um evento de rede. `AddEventHandler` só adiciona o handler (pode ser local).",
            },
          ],
        },
        {
          id: "c3",
          title: "Threads, loops e Citizen.Wait",
          type: "Prática",
          xp: 70,
          duration: "45 min",
          objectives: [
            "CreateThread e loops infinitos",
            "Citizen.Wait e impacto na performance",
            "Otimizar: evitar loops sem wait",
          ],
          content:
            "Muitas coisas no client precisam rodar a cada frame (ex: desenhar texto, checar distância). Use `CreateThread(function() while true do ... Wait(0) end end)`. O `Wait(ms)` é CRÍTICO para performance: um loop sem `Wait` (ou com `Wait(0)` desnecessário) derruba o FPS. Aprenda a usar `Wait` maior quando não precisa de precisão por frame.",
          docs: [
            { label: "Performance / threads", url: "https://docs.fivem.net/docs/scripting-manual/runtimes/lua/" },
          ],
          videos: [
            { label: "CreateThread e Wait FiveM", query: "fivem createthread citizen wait loop tutorial" },
            { label: "Otimização de scripts FiveM", query: "fivem otimização scripts performance resmon" },
          ],
          quiz: [
            {
              q: "Por que um `while true do ... end` sem `Wait` é perigoso?",
              options: ["Não compila", "Trava a thread e derruba o FPS/servidor", "Não faz nada", "Gera erro de sintaxe"],
              answer: 1,
              explain: "Sem Wait, o loop nunca cede tempo — congela a thread e mata a performance. Sempre inclua um Wait.",
            },
          ],
        },
        {
          id: "c4",
          title: "Comandos, chat e keybinds",
          type: "Prática",
          xp: 60,
          duration: "40 min",
          objectives: [
            "RegisterCommand e permissões (ACE)",
            "Mensagens de chat e notificações",
            "RegisterKeyMapping para teclas",
          ],
          content:
            "`RegisterCommand('curar', function() ... end)` cria comandos de chat/console. Para restringir, use o sistema de permissões **ACE**. `RegisterKeyMapping` permite que o jogador configure teclas. Notificações nativas dão feedback ao jogador. Esses são blocos práticos que você usará em quase todo script.",
          docs: [
            { label: "RegisterCommand", url: "https://docs.fivem.net/docs/scripting-reference/runtimes/lua/functions/RegisterCommand/" },
            { label: "ACE permissions", url: "https://docs.fivem.net/docs/server-manual/server-commands/" },
          ],
          videos: [
            { label: "Criar comandos FiveM", query: "fivem registercommand comandos chat tutorial" },
            { label: "Keybinds e ACE permissions", query: "fivem registerkeymapping ace permissions tutorial" },
          ],
          quiz: [
            {
              q: "Qual sistema controla permissões de comandos no FiveM?",
              options: ["JWT", "ACE", "OAuth", "RBAC nativo do Lua"],
              answer: 1,
              explain: "ACE (Access Control Entries) é o sistema de permissões nativo do FiveM para comandos e ações.",
            },
          ],
        },
      ],
    },

    /* =====================================================
       TRILHA 4 — INTERFACES (NUI)
       ===================================================== */
    {
      id: "nui",
      title: "Interfaces com NUI (HTML/CSS/JS)",
      tag: "Intermediário",
      icon: "🖥️",
      color: "#60a5fa",
      summary:
        "NUI é como o FiveM renderiza interfaces usando tecnologias web. HUDs, menus e telas customizadas são feitos com HTML, CSS e JavaScript.",
      lessons: [
        {
          id: "n1",
          title: "Fundamentos de NUI",
          type: "Teoria",
          xp: 60,
          duration: "40 min",
          objectives: [
            "Entender que NUI é um navegador (CEF) embutido",
            "ui_page no fxmanifest",
            "HTML/CSS/JS básico para interfaces",
          ],
          content:
            "**NUI** (New UI) é um navegador Chromium embutido no jogo. Toda HUD, menu de loja ou inventário visual é uma página web rodando por cima do jogo. Você declara a `ui_page 'html/index.html'` no manifesto e cria com HTML/CSS/JS normais. Se você sabe web, já tem meio caminho andado.",
          docs: [
            { label: "NUI (docs oficiais)", url: "https://docs.fivem.net/docs/scripting-manual/nui-development/" },
          ],
          videos: [
            { label: "NUI FiveM do zero", query: "fivem nui html css iniciantes tutorial" },
            { label: "Criar HUD com NUI", query: "fivem nui hud customizado tutorial" },
          ],
          quiz: [
            {
              q: "NUI no FiveM é basicamente:",
              options: ["Um motor de física", "Um navegador (Chromium/CEF) embutido", "Um banco de dados", "Um compilador Lua"],
              answer: 1,
              explain: "NUI é um CEF (Chromium Embedded Framework) — um navegador embutido que renderiza HTML/CSS/JS.",
            },
          ],
        },
        {
          id: "n2",
          title: "Comunicação Lua ↔ NUI",
          type: "Prática",
          xp: 80,
          duration: "55 min",
          objectives: [
            "SendNUIMessage (Lua → JS)",
            "fetch para callbacks (JS → Lua) com RegisterNUICallback",
            "SetNuiFocus (mouse/teclado)",
          ],
          content:
            "A mágica está na ponte: `SendNUIMessage({...})` envia dados do Lua para o JavaScript (que escuta com `window.addEventListener('message')`). De volta, o JS chama `fetch('https://recurso/acao', {...})` e o Lua responde com `RegisterNUICallback`. `SetNuiFocus(true, true)` libera mouse e teclado para a interface. Dominar isso = qualquer interface possível.",
          docs: [
            { label: "NUI callbacks", url: "https://docs.fivem.net/docs/scripting-manual/nui-development/nui-callbacks/" },
            { label: "SendNUIMessage", url: "https://docs.fivem.net/docs/scripting-reference/runtimes/lua/functions/SendNUIMessage/" },
          ],
          videos: [
            { label: "SendNUIMessage e callbacks", query: "fivem sendnuimessage registernuicallback tutorial" },
            { label: "NUI focus e fetch", query: "fivem nui setnuifocus fetch javascript tutorial" },
          ],
          quiz: [
            {
              q: "Como o JavaScript da NUI envia dados de volta para o Lua?",
              options: ["console.log", "fetch para um RegisterNUICallback", "TriggerServerEvent direto", "SendNUIMessage"],
              answer: 1,
              explain: "O JS usa fetch('https://recurso/acao') que é capturado por RegisterNUICallback no Lua.",
            },
            {
              q: "O que SetNuiFocus(true, true) faz?",
              options: ["Fecha a UI", "Libera mouse e teclado para a interface", "Recarrega a página", "Esconde a HUD"],
              answer: 1,
              explain: "Libera foco de mouse e teclado para a NUI — necessário para interfaces interativas como menus.",
            },
          ],
        },
        {
          id: "n3",
          title: "Projeto: menu interativo com NUI",
          type: "Projeto",
          xp: 100,
          duration: "90 min",
          objectives: [
            "Construir um menu completo (HTML/CSS/JS)",
            "Abrir/fechar com tecla e comunicar com Lua",
            "Aplicar ações no jogo a partir do menu",
          ],
          content:
            "Hora de juntar tudo: crie um menu (ex: painel de admin ou loja) que abre com uma tecla, exibe opções, e ao clicar dispara ações no jogo via callbacks. Você praticará layout responsivo, estados de UI, e a ponte Lua↔JS num projeto real e portfolio-worthy.",
          docs: [
            { label: "NUI development", url: "https://docs.fivem.net/docs/scripting-manual/nui-development/" },
          ],
          videos: [
            { label: "Menu NUI completo FiveM", query: "fivem menu nui completo projeto tutorial" },
            { label: "Loja/shop com NUI", query: "fivem loja shop nui html css js tutorial" },
          ],
          quiz: [
            {
              q: "Boa prática ao FECHAR um menu NUI:",
              options: ["Deixar o foco ativo", "Chamar SetNuiFocus(false, false)", "Reiniciar o recurso", "Nada"],
              answer: 1,
              explain: "Sempre devolva o foco com SetNuiFocus(false,false) ao fechar, senão o jogador 'trava' sem controle.",
            },
          ],
        },
      ],
    },

    /* =====================================================
       TRILHA 5 — BANCO DE DADOS E FRAMEWORKS
       ===================================================== */
    {
      id: "frameworks",
      title: "Banco de Dados e Frameworks (ESX/QBCore)",
      tag: "Intermediário",
      icon: "🗄️",
      color: "#f472b6",
      summary:
        "Servidores RP guardam dados persistentes (dinheiro, inventário, propriedades) em banco de dados, geralmente via frameworks como ESX e QBCore.",
      lessons: [
        {
          id: "fw1",
          title: "MySQL e oxmysql",
          type: "Prática",
          xp: 70,
          duration: "50 min",
          objectives: [
            "Instalar MySQL e configurar conexão",
            "Usar oxmysql para queries",
            "CRUD básico: salvar e carregar dados de jogador",
          ],
          content:
            "Para persistência você precisa de um banco — geralmente **MySQL/MariaDB**. O recurso **oxmysql** é o padrão atual para conectar e fazer queries assíncronas (`MySQL.query`, `MySQL.insert`, etc). Aprenda CRUD (Create, Read, Update, Delete) e cuidado com SQL injection usando parâmetros.",
          docs: [
            { label: "oxmysql (overextended)", url: "https://overextended.dev/oxmysql" },
            { label: "Database (server)", url: "https://docs.fivem.net/docs/server-manual/" },
          ],
          videos: [
            { label: "oxmysql tutorial FiveM", query: "fivem oxmysql mysql tutorial queries português" },
            { label: "Banco de dados FiveM iniciantes", query: "fivem banco de dados mysql heidisql iniciantes" },
          ],
          quiz: [
            {
              q: "Qual recurso é o padrão atual para acessar MySQL no FiveM?",
              options: ["mysql-async", "ghmattimysql", "oxmysql", "node-mysql"],
              answer: 2,
              explain: "oxmysql (da overextended) é o padrão moderno, sucessor de mysql-async e ghmattimysql.",
            },
            {
              q: "Como evitar SQL injection nas queries?",
              options: ["Concatenar strings", "Usar parâmetros/placeholders (?)", "Confiar no input", "Esconder a query"],
              answer: 1,
              explain: "Sempre use placeholders parametrizados. Nunca concatene input do jogador direto na query.",
            },
          ],
        },
        {
          id: "fw2",
          title: "ESX: estrutura e desenvolvimento",
          type: "Prática",
          xp: 80,
          duration: "60 min",
          objectives: [
            "Entender o que o ESX oferece (jobs, money, inventory)",
            "ESX.GetPlayerData e funções server/client",
            "Criar um script simples integrado ao ESX",
          ],
          content:
            "**ESX** é um dos frameworks RP mais populares. Ele fornece sistema de jobs, dinheiro, inventário, e funções helper. Você integra obtendo o objeto `ESX` e usando funções como `ESX.GetPlayerFromId`, `xPlayer.addMoney`, etc. Saber a estrutura do ESX abre as portas para milhares de scripts da comunidade.",
          docs: [
            { label: "esx_core (GitHub)", url: "https://github.com/esx-framework/esx_core" },
            { label: "ESX Documentation", url: "https://documentation.esx-framework.org/" },
          ],
          videos: [
            { label: "ESX do zero FiveM", query: "fivem esx framework do zero tutorial português" },
            { label: "Criar script ESX", query: "fivem esx criar script job dinheiro tutorial" },
          ],
          quiz: [
            {
              q: "O que o ESX fornece de forma pronta?",
              options: ["Apenas gráficos", "Jobs, dinheiro e inventário", "Modelagem 3D", "Hospedagem"],
              answer: 1,
              explain: "ESX é um framework RP: já vem com economia, empregos, inventário e estrutura de players.",
            },
          ],
        },
        {
          id: "fw3",
          title: "QBCore: estrutura e desenvolvimento",
          type: "Prática",
          xp: 80,
          duration: "60 min",
          objectives: [
            "Diferenças entre QBCore e ESX",
            "QBCore.Functions e metadata do player",
            "Criar um script integrado ao QBCore",
          ],
          content:
            "**QBCore** é o outro grande framework RP, conhecido por modularidade e metadata rica nos players. Você usa `QBCore.Functions.GetPlayer`, `Player.Functions.AddMoney`, etc. Muitos servidores escolhem entre ESX e QBCore — saber os dois te torna versátil e empregável.",
          docs: [
            { label: "QBCore Docs", url: "https://docs.qbcore.org/" },
            { label: "qb-core (GitHub)", url: "https://github.com/qbcore-framework/qb-core" },
          ],
          videos: [
            { label: "QBCore do zero FiveM", query: "fivem qbcore framework do zero tutorial português" },
            { label: "ESX vs QBCore comparação", query: "fivem esx vs qbcore diferenças comparação" },
          ],
          quiz: [
            {
              q: "QBCore é conhecido principalmente por:",
              options: ["Ser pago", "Modularidade e metadata de players", "Não usar banco de dados", "Ser só client-side"],
              answer: 1,
              explain: "QBCore é modular e usa metadata rica nos players, sendo muito flexível para RP.",
            },
          ],
        },
      ],
    },

    /* =====================================================
       TRILHA 6 — ASSETS: VEÍCULOS, MLO, ROUPAS
       ===================================================== */
    {
      id: "assets",
      title: "Assets: Veículos, MLOs e Roupas",
      tag: "Avançado",
      icon: "🚗",
      color: "#fb7185",
      summary:
        "Conteúdo visual que dá vida ao servidor: carros add-on, interiores (MLOs), roupas e peds customizados. Une modelagem 3D com integração FiveM.",
      lessons: [
        {
          id: "a1",
          title: "Veículos add-on (instalar e criar)",
          type: "Prática",
          xp: 80,
          duration: "60 min",
          objectives: [
            "Estrutura de um veículo add-on (.yft, .ytd, meta)",
            "vehicles.meta, handling.meta, carcols",
            "Instalar e configurar no FiveM",
          ],
          content:
            "Veículos add-on adicionam carros sem substituir os do jogo. Um veículo precisa de modelo (`.yft`), texturas (`.ytd`) e arquivos `.meta` (vehicles, handling, carvariations, carcols). Você aprende a empacotar como recurso, configurar o manifesto com `data_file` e ajustar o handling (física do carro).",
          docs: [
            { label: "Vehicle data files", url: "https://docs.fivem.net/docs/game-references/vehicle-models/" },
            { label: "Resource manifest (data_file)", url: "https://docs.fivem.net/docs/scripting-reference/resource-manifest/resource-manifest/" },
          ],
          videos: [
            { label: "Instalar carro add-on FiveM", query: "fivem instalar carro addon vehicles meta tutorial" },
            { label: "Configurar handling de veículo", query: "fivem handling.meta veículo configurar tutorial" },
          ],
          quiz: [
            {
              q: "Qual arquivo controla a física/dirigibilidade de um veículo?",
              options: ["vehicles.meta", "handling.meta", "carcols.meta", "fxmanifest.lua"],
              answer: 1,
              explain: "handling.meta define física: aceleração, frenagem, tração, massa, etc.",
            },
          ],
        },
        {
          id: "a2",
          title: "MLOs: interiores customizados",
          type: "Projeto",
          xp: 100,
          duration: "90 min",
          objectives: [
            "Entender o que é um MLO e como funciona",
            "Instalar MLO com CodeWalker / ymap",
            "Noções de criação de interiores",
          ],
          content:
            "**MLO** (Map Loader Object) são interiores customizados — delegacias, lojas, casas. Instalar envolve carregar `.ymap`/`.ytyp` via stream. Criar do zero é avançado (usa CodeWalker e modelagem), mas começar instalando e ajustando MLOs prontos é o caminho. Interiores ricos transformam a imersão de um servidor.",
          docs: [
            { label: "Map manifest / streaming", url: "https://docs.fivem.net/docs/scripting-reference/resource-manifest/resource-manifest/" },
            { label: "CodeWalker", url: "https://github.com/dexyfex/CodeWalker" },
          ],
          videos: [
            { label: "Instalar MLO FiveM", query: "fivem instalar mlo interior ymap stream tutorial" },
            { label: "Criar MLO com CodeWalker", query: "fivem criar mlo codewalker interior tutorial" },
          ],
          quiz: [
            {
              q: "O que é um MLO?",
              options: ["Um script de economia", "Um interior/local customizado", "Um framework", "Um anticheat"],
              answer: 1,
              explain: "MLO é um interior customizado (Map Loader Object) — locais que o jogador pode entrar.",
            },
          ],
        },
        {
          id: "a3",
          title: "Roupas, peds e acessórios",
          type: "Prática",
          xp: 70,
          duration: "55 min",
          objectives: [
            "Adicionar roupas (EUP / streamed clothing)",
            "Componentes e drawables de ped",
            "Integrar com sistemas de loja de roupas",
          ],
          content:
            "Roupas customizadas (incluindo **EUP** — uniformes de polícia/serviços) dão identidade ao servidor. Você aprende como peds têm componentes (torso, perna, calçado) e drawables/texturas, como fazer stream de roupas e integrar com lojas de roupa (clothing stores) dos frameworks.",
          docs: [
            { label: "Ped components", url: "https://docs.fivem.net/docs/game-references/ped-models/" },
          ],
          videos: [
            { label: "Adicionar roupas FiveM", query: "fivem adicionar roupas eup stream clothing tutorial" },
            { label: "Componentes de ped FiveM", query: "fivem ped components drawables roupas tutorial" },
          ],
          quiz: [
            {
              q: "EUP no contexto de FiveM refere-se a:",
              options: ["Um banco de dados", "Uniformes/roupas de serviços (polícia, etc)", "Um framework", "Um tipo de veículo"],
              answer: 1,
              explain: "EUP (Emergency Uniforms Pack) traz uniformes de serviços de emergência e roupas extras.",
            },
          ],
        },
      ],
    },

    /* =====================================================
       TRILHA 7 — SERVIDOR PROFISSIONAL
       ===================================================== */
    {
      id: "servidor",
      title: "Servidor Profissional: Otimização, Segurança e Deploy",
      tag: "Avançado",
      icon: "🚀",
      color: "#fbbf24",
      summary:
        "Levar tudo para produção: performance, anti-cheat, hospedagem, backups e organização de um servidor que aguenta jogadores reais.",
      lessons: [
        {
          id: "s1",
          title: "Otimização e profiling (resmon)",
          type: "Prática",
          xp: 80,
          duration: "55 min",
          objectives: [
            "Usar resmon para medir custo de scripts",
            "Identificar gargalos (loops, draws)",
            "Boas práticas de performance",
          ],
          content:
            "Servidor lento = jogadores frustrados. Use `resmon` (resource monitor) para ver quanto cada recurso consome (ms/tick). Aprenda a achar gargalos: loops sem Wait, draws desnecessários, queries pesadas. Otimização é o que separa um servidor amador de um profissional com 100+ players.",
          docs: [
            { label: "Performance / resmon", url: "https://docs.fivem.net/docs/scripting-manual/runtimes/lua/" },
          ],
          videos: [
            { label: "Otimizar servidor FiveM resmon", query: "fivem resmon otimização servidor performance tutorial" },
            { label: "Reduzir lag do servidor", query: "fivem reduzir lag otimização scripts tutorial" },
          ],
          quiz: [
            {
              q: "Qual ferramenta mostra o custo (ms) de cada recurso em tempo real?",
              options: ["resmon", "txAdmin logs", "console.log", "htop"],
              answer: 0,
              explain: "`resmon` (ou `resmon 1`) exibe o consumo de cada recurso, essencial para otimizar.",
            },
          ],
        },
        {
          id: "s2",
          title: "Segurança e anti-cheat",
          type: "Teoria",
          xp: 70,
          duration: "45 min",
          objectives: [
            "Mentalidade server-authoritative",
            "Validar eventos e proteger callbacks",
            "Boas práticas contra exploits comuns",
          ],
          content:
            "Cheaters vão tentar quebrar tudo. Princípios: o servidor é a fonte da verdade; valide TODO input; nunca dê itens/dinheiro só por um evento do cliente; limite rate de eventos; e não exponha lógica sensível no client. Anti-cheats ajudam, mas código bem escrito é a primeira defesa.",
          docs: [
            { label: "Server security", url: "https://docs.fivem.net/docs/scripting-manual/working-with-events/" },
          ],
          videos: [
            { label: "Segurança de servidor FiveM", query: "fivem segurança servidor anticheat exploits proteção" },
            { label: "Proteger eventos contra cheaters", query: "fivem proteger eventos validação cheaters tutorial" },
          ],
          quiz: [
            {
              q: "Qual é o princípio central de segurança no FiveM?",
              options: ["Confiar no cliente", "Server-authoritative (servidor decide tudo)", "Esconder o código", "Usar nomes longos de variável"],
              answer: 1,
              explain: "Server-authoritative: o servidor valida e decide. O cliente NUNCA é confiável.",
            },
          ],
        },
        {
          id: "s3",
          title: "Deploy, hospedagem e backups",
          type: "Projeto",
          xp: 90,
          duration: "60 min",
          objectives: [
            "Opções de hospedagem (VPS, dedicado, host gerenciado)",
            "Organização de recursos e server.cfg",
            "Backups de banco e versionamento (Git)",
          ],
          content:
            "Para ir ao ar você precisa de hospedagem (VPS Linux/Windows, dedicado, ou host gerenciado de FiveM). Organize `server.cfg`, separe recursos por categoria, automatize backups do MySQL e use **Git** para versionar seus scripts. Profissionalismo aqui = servidor estável e fácil de manter.",
          docs: [
            { label: "Setting up a server (deploy)", url: "https://docs.fivem.net/docs/server-manual/setting-up-a-server/" },
            { label: "Server commands / cfg", url: "https://docs.fivem.net/docs/server-manual/server-commands/" },
          ],
          videos: [
            { label: "Hospedar servidor FiveM VPS", query: "fivem hospedar servidor vps linux deploy tutorial" },
            { label: "Backup e Git para FiveM", query: "fivem backup banco git versionamento scripts tutorial" },
          ],
          quiz: [
            {
              q: "Boa prática para não perder dados do servidor:",
              options: ["Nunca reiniciar", "Backups automáticos do banco de dados", "Rodar sem banco", "Editar direto em produção"],
              answer: 1,
              explain: "Backups automáticos do MySQL evitam perda catastrófica de dados de jogadores.",
            },
            {
              q: "Qual ferramenta versiona seu código e facilita colaboração?",
              options: ["Git", "OpenIV", "CodeWalker", "resmon"],
              answer: 0,
              explain: "Git versiona código, permite rollback e colaboração em equipe — essencial para projetos sérios.",
            },
          ],
        },
      ],
    },
  ],
};

// Badges/conquistas (desbloqueados por marcos)
const BADGES = [
  { id: "first_step", icon: "👣", name: "Primeiro Passo", desc: "Complete sua primeira aula." },
  { id: "lua_master", icon: "🌙", name: "Domínio Lua", desc: "Conclua toda a trilha de Lua." },
  { id: "artist", icon: "🎨", name: "Artista 3D", desc: "Conclua o pré-curso de Blender." },
  { id: "core_dev", icon: "⚙️", name: "Dev de Núcleo", desc: "Conclua a trilha FiveM Core." },
  { id: "ui_wizard", icon: "🖥️", name: "Mago da UI", desc: "Conclua a trilha de NUI." },
  { id: "quiz_ace", icon: "🧠", name: "Gênio dos Quizzes", desc: "Acerte 20 perguntas de quiz." },
  { id: "streak_3", icon: "🔥", name: "Em Chamas", desc: "Mantenha uma sequência de 3 dias." },
  { id: "halfway", icon: "⭐", name: "Meio Caminho", desc: "Complete 50% do curso." },
  { id: "graduate", icon: "🎓", name: "Formado", desc: "Complete 100% do curso." },
];
