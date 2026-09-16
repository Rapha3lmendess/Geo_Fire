fetch("incendios.csv")
    .then(resposta => resposta.text())
    .then(dados => {

        // ==================================================
        // LER O CSV
        // ==================================================

        const linhas = dados.trim().split("\n");

        // Remove o cabeçalho
        const registros = linhas.slice(1);

        // Transforma cada linha em objeto
        const incendios = registros.map(linha => {

            const colunas = linha.split(",");

            return {
                ano: colunas[0].trim(),
                estado: colunas[1].trim().replace(/"/g, ""),
                mes: colunas[2].trim().replace(/"/g, ""),
                quantidade: Number(colunas[3].trim()),
                data: colunas[4].trim()
            };

        });


        // ==================================================
        // ELEMENTOS DO HTML
        // ==================================================

        const tabela =
            document.getElementById("tabelaIncendios");

        const filtroEstado =
            document.getElementById("filtroEstado");

        const filtroAno =
            document.getElementById("filtroAno");


        // ==================================================
        // CONFIGURAÇÃO DA PAGINAÇÃO
        // ==================================================

        // Quantidade de registros por página
        const registrosPorPagina = 20;

        // Página atual
        let paginaAtual = 1;

        // Dados atualmente filtrados
        let dadosAtuais = incendios;


        // ==================================================
        // CRIAR LISTA DE ESTADOS
        // ==================================================

        const estados = [...new Set(
            incendios.map(incendio => incendio.estado)
        )];

        estados.sort();

        estados.forEach(estado => {

            const opcao =
                document.createElement("option");

            opcao.value = estado;

            opcao.textContent = estado;

            filtroEstado.appendChild(opcao);

        });


        // ==================================================
        // CRIAR LISTA DE ANOS
        // ==================================================

        const anos = [...new Set(
            incendios.map(incendio => incendio.ano)
        )];

        // Ordena do menor para o maior
        anos.sort((a, b) => Number(a) - Number(b));

        anos.forEach(ano => {

            const opcao =
                document.createElement("option");

            opcao.value = ano;

            opcao.textContent = ano;

            filtroAno.appendChild(opcao);

        });


        // ==================================================
        // MOSTRAR TABELA
        // ==================================================

        function mostrarTabela() {

            // Limpa a tabela
            tabela.innerHTML = "";


            // Calcula onde começa a página
            const inicio =
                (paginaAtual - 1) *
                registrosPorPagina;


            // Calcula onde termina a página
            const fim =
                inicio + registrosPorPagina;


            // Pega somente os registros da página atual
            const registrosPagina =
                dadosAtuais.slice(inicio, fim);


            // Mostra os registros
            registrosPagina.forEach(incendio => {

                const linha =
                    document.createElement("tr");

                linha.innerHTML = `
                    <td>${incendio.ano}</td>
                    <td>${incendio.estado}</td>
                    <td>${incendio.mes}</td>
                    <td>${incendio.quantidade.toLocaleString("pt-BR")}</td>
                    <td>${incendio.data}</td>
                `;

                tabela.appendChild(linha);

            });


            // Atualiza a paginação
            atualizarPaginacao();

        }


        // ==================================================
        // PAGINAÇÃO
        // ==================================================

        function atualizarPaginacao() {

            // Procura a área de paginação
            let paginacao =
                document.getElementById("paginacao");


            // Se não existir, cria
            if (!paginacao) {

                paginacao =
                    document.createElement("div");

                paginacao.id = "paginacao";


                // Coloca depois da tabela
                document
                    .querySelector(".tabela-container")
                    .after(paginacao);

            }


            // Limpa a paginação
            paginacao.innerHTML = "";


            // Calcula quantidade total de páginas
            const totalPaginas =
                Math.ceil(
                    dadosAtuais.length /
                    registrosPorPagina
                );


            // Se tiver somente uma página,
            // não precisa mostrar paginação
            if (totalPaginas <= 1) {

                return;

            }


            // ==================================================
            // BOTÃO ANTERIOR
            // ==================================================

            const botaoAnterior =
                document.createElement("button");

            botaoAnterior.textContent =
                "← Anterior";


            // Desabilita na primeira página
            botaoAnterior.disabled =
                paginaAtual === 1;


            botaoAnterior.addEventListener(
                "click",
                function () {

                    if (paginaAtual > 1) {

                        paginaAtual--;

                        mostrarTabela();

                    }

                }
            );


            paginacao.appendChild(
                botaoAnterior
            );


            // ==================================================
            // FUNÇÃO PARA CRIAR BOTÃO
            // ==================================================

            function criarBotaoPagina(numero) {

                const botao =
                    document.createElement("button");


                botao.textContent = numero;


                // Destaca a página atual
                if (numero === paginaAtual) {

                    botao.classList.add(
                        "pagina-atual"
                    );

                }


                botao.addEventListener(
                    "click",
                    function () {

                        paginaAtual = numero;

                        mostrarTabela();

                    }
                );


                paginacao.appendChild(botao);

            }


            // ==================================================
            // PRIMEIRA PÁGINA
            // ==================================================

            criarBotaoPagina(1);


            // ==================================================
            // DEFINIR PÁGINAS PRÓXIMAS
            // ==================================================

            let inicio =
                Math.max(
                    2,
                    paginaAtual - 2
                );


            let fim =
                Math.min(
                    totalPaginas - 1,
                    paginaAtual + 2
                );


            // ==================================================
            // RETICÊNCIAS INICIAIS
            // ==================================================

            if (inicio > 2) {

                const pontos =
                    document.createElement("span");

                pontos.textContent = "...";

                pontos.classList.add("pontos");

                paginacao.appendChild(
                    pontos
                );

            }


            // ==================================================
            // PÁGINAS PRÓXIMAS
            // ==================================================

            for (
                let pagina = inicio;
                pagina <= fim;
                pagina++
            ) {

                criarBotaoPagina(pagina);

            }


            // ==================================================
            // RETICÊNCIAS FINAIS
            // ==================================================

            if (
                fim <
                totalPaginas - 1
            ) {

                const pontos =
                    document.createElement("span");

                pontos.textContent = "...";

                pontos.classList.add("pontos");

                paginacao.appendChild(
                    pontos
                );

            }


            // ==================================================
            // ÚLTIMA PÁGINA
            // ==================================================

            if (totalPaginas > 1) {

                criarBotaoPagina(
                    totalPaginas
                );

            }


            // ==================================================
            // BOTÃO PRÓXIMA
            // ==================================================

            const botaoProxima =
                document.createElement("button");

            botaoProxima.textContent =
                "Próxima →";


            // Desabilita na última página
            botaoProxima.disabled =
                paginaAtual === totalPaginas;


            botaoProxima.addEventListener(
                "click",
                function () {

                    if (
                        paginaAtual <
                        totalPaginas
                    ) {

                        paginaAtual++;

                        mostrarTabela();

                    }

                }
            );


            paginacao.appendChild(
                botaoProxima
            );

        }


        // ==================================================
        // ATUALIZAR CARDS
        // ==================================================

        function atualizarCards(dados) {

            // Soma todas as ocorrências
            const total =
                dados.reduce(
                    (soma, incendio) => {

                        return soma +
                            incendio.quantidade;

                    },
                    0
                );


            // Calcula a média
            const media =
                dados.length > 0
                    ? total / dados.length
                    : 0;


            // ==================================================
            // OCORRÊNCIAS POR ESTADO
            // ==================================================

            const ocorrenciasPorEstado = {};


            dados.forEach(incendio => {

                if (
                    !ocorrenciasPorEstado[
                        incendio.estado
                    ]
                ) {

                    ocorrenciasPorEstado[
                        incendio.estado
                    ] = 0;

                }


                ocorrenciasPorEstado[
                    incendio.estado
                ] += incendio.quantidade;

            });


            // ==================================================
            // ESTADO COM MAIS OCORRÊNCIAS
            // ==================================================

            let estadoMaior = "-";

            let maiorQuantidade = 0;


            for (
                const estado in ocorrenciasPorEstado
            ) {

                if (
                    ocorrenciasPorEstado[estado] >
                    maiorQuantidade
                ) {

                    maiorQuantidade =
                        ocorrenciasPorEstado[estado];

                    estadoMaior =
                        estado;

                }

            }


            // ==================================================
            // ATUALIZAR OS CARDS
            // ==================================================

            document.getElementById(
                "totalIncendios"
            ).textContent =
                total.toLocaleString("pt-BR");


            document.getElementById(
                "estadoMaior"
            ).textContent =
                estadoMaior;


            document.getElementById(
                "mediaIncendios"
            ).textContent =
                media.toLocaleString(
                    "pt-BR",
                    {
                        maximumFractionDigits: 2
                    }
                );

        }


        // ==================================================
        // APLICAR FILTROS
        // ==================================================

        function aplicarFiltros() {

            // Estado selecionado
            const estadoSelecionado =
                filtroEstado.value;


            // Ano selecionado
            const anoSelecionado =
                filtroAno.value;


            // Filtra os dados
            dadosAtuais =
                incendios.filter(incendio => {


                    // Verifica estado
                    const correspondeEstado =
                        estadoSelecionado === "todos" ||
                        incendio.estado ===
                        estadoSelecionado;


                    // Verifica ano
                    const correspondeAno =
                        anoSelecionado === "todos" ||
                        incendio.ano ===
                        anoSelecionado;


                    // Precisa corresponder aos dois
                    return (
                        correspondeEstado &&
                        correspondeAno
                    );

                });


            // Volta para a primeira página
            paginaAtual = 1;


            // Atualiza tabela
            mostrarTabela();


            // Atualiza os cards
            atualizarCards(
                dadosAtuais
            );

        }


        // ==================================================
        // INICIAR PROJETO
        // ==================================================

        aplicarFiltros();


        // ==================================================
        // EVENTO DO FILTRO DE ESTADO
        // ==================================================

        filtroEstado.addEventListener(
            "change",
            aplicarFiltros
        );


        // ==================================================
        // EVENTO DO FILTRO DE ANO
        // ==================================================

        filtroAno.addEventListener(
            "change",
            aplicarFiltros
        );


        // ==================================================
        // INFORMAÇÕES NO CONSOLE
        // ==================================================

        console.log(
            "Dados carregados:",
            incendios
        );

        console.log(
            "Quantidade de registros:",
            incendios.length
        );

    })


    // ==================================================
    // CASO OCORRA ALGUM ERRO
    // ==================================================

    .catch(erro => {

        console.error(
            "Erro ao carregar o arquivo:",
            erro
        );

    });