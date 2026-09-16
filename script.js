fetch("incendios.csv")
    .then(resposta => resposta.text())
    .then(dados => {

        // Separa o CSV em linhas
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


        // Elementos do HTML
        const tabela = document.getElementById("tabelaIncendios");
        const filtroEstado = document.getElementById("filtroEstado");


        // ==================================================
        // CRIAR LISTA DE ESTADOS
        // ==================================================

        const estados = [...new Set(
            incendios.map(incendio => incendio.estado)
        )];

        estados.sort();

        estados.forEach(estado => {

            const opcao = document.createElement("option");

            opcao.value = estado;
            opcao.textContent = estado;

            filtroEstado.appendChild(opcao);

        });


        // ==================================================
        // ATUALIZAR OS CARDS
        // ==================================================

        function atualizarCards(dados) {

            // Soma as ocorrências
            const total = dados.reduce((soma, incendio) => {
                return soma + incendio.quantidade;
            }, 0);


            // Calcula a média
            const media = dados.length > 0
                ? total / dados.length
                : 0;


            // Encontra o estado com mais ocorrências
            const ocorrenciasPorEstado = {};

            dados.forEach(incendio => {

                if (!ocorrenciasPorEstado[incendio.estado]) {
                    ocorrenciasPorEstado[incendio.estado] = 0;
                }

                ocorrenciasPorEstado[incendio.estado] += incendio.quantidade;

            });


            let estadoMaior = "-";
            let maiorQuantidade = 0;

            for (const estado in ocorrenciasPorEstado) {

                if (ocorrenciasPorEstado[estado] > maiorQuantidade) {

                    maiorQuantidade =
                        ocorrenciasPorEstado[estado];

                    estadoMaior = estado;

                }

            }


            // Coloca os valores nos cards
            document.getElementById("totalIncendios").textContent =
                total.toLocaleString("pt-BR");

            document.getElementById("estadoMaior").textContent =
                estadoMaior;

            document.getElementById("mediaIncendios").textContent =
                media.toLocaleString("pt-BR", {
                    maximumFractionDigits: 2
                });

        }


        // ==================================================
        // MOSTRAR DADOS NA TABELA
        // ==================================================

        function mostrarTabela(dados) {

            tabela.innerHTML = "";

            dados.forEach(incendio => {

                const linha = document.createElement("tr");

                linha.innerHTML = `
                    <td>${incendio.ano}</td>
                    <td>${incendio.estado}</td>
                    <td>${incendio.mes}</td>
                    <td>${incendio.quantidade.toLocaleString("pt-BR")}</td>
                    <td>${incendio.data}</td>
                `;

                tabela.appendChild(linha);

            });

        }


        // ==================================================
        // ESTADO INICIAL
        // ==================================================

        mostrarTabela(incendios);
        atualizarCards(incendios);


        // ==================================================
        // FILTRO POR ESTADO
        // ==================================================

        filtroEstado.addEventListener("change", function () {

            const estadoSelecionado = filtroEstado.value;


            if (estadoSelecionado === "todos") {

                mostrarTabela(incendios);
                atualizarCards(incendios);

            } else {

                const dadosFiltrados = incendios.filter(incendio => {
                    return incendio.estado === estadoSelecionado;
                });

                mostrarTabela(dadosFiltrados);
                atualizarCards(dadosFiltrados);

            }

        });


        console.log("Dados carregados:", incendios);

    })
    .catch(erro => {

        console.error("Erro ao carregar o arquivo:", erro);

    });