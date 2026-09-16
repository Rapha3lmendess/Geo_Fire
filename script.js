/* ==================================================
   GEO FIRE
   CARREGAMENTO DOS DADOS
================================================== */

fetch("incendios.csv")

    .then(resposta => resposta.text())

    .then(dados => {


        /* ==================================================
           TRANSFORMA O CSV EM LINHAS
        ================================================== */

        const linhas =
            dados.trim().split("\n");


        const registros =
            linhas.slice(1);


        /* ==================================================
           TRANSFORMA CADA LINHA EM OBJETO
        ================================================== */

        const incendios =
            registros.map(linha => {


                const colunas =
                    linha.split(",");


                return {

                    ano:
                        colunas[0].trim(),

                    estado:
                        colunas[1]
                            .trim()
                            .replace(/"/g, ""),

                    mes:
                        colunas[2]
                            .trim()
                            .replace(/"/g, ""),

                    quantidade:
                        Number(
                            colunas[3].trim()
                        ),

                    data:
                        colunas[4].trim()

                };

            });


        /* ==================================================
           ELEMENTOS DO HTML
        ================================================== */

        const tabela =
            document.getElementById(
                "tabelaIncendios"
            );


        const filtroEstado =
            document.getElementById(
                "filtroEstado"
            );


        const filtroAno =
            document.getElementById(
                "filtroAno"
            );


        /* ==================================================
           PAGINAÇÃO
        ================================================== */

        const registrosPorPagina = 20;

        let paginaAtual = 1;

        let dadosAtuais = incendios;


        /* ==================================================
           ESTADOS
        ================================================== */

        const estados = [
            ...new Set(
                incendios.map(
                    incendio =>
                        incendio.estado
                )
            )
        ];


        estados.sort();


        estados.forEach(estado => {


            const opcao =
                document.createElement(
                    "option"
                );


            opcao.value = estado;

            opcao.textContent = estado;


            filtroEstado.appendChild(
                opcao
            );

        });


        /* ==================================================
           ANOS
        ================================================== */

        const anos = [
            ...new Set(
                incendios.map(
                    incendio =>
                        incendio.ano
                )
            )
        ];


        anos.sort(
            (a, b) =>
                Number(a) -
                Number(b)
        );


        anos.forEach(ano => {


            const opcao =
                document.createElement(
                    "option"
                );


            opcao.value = ano;

            opcao.textContent = ano;


            filtroAno.appendChild(
                opcao
            );

        });


        /* ==================================================
           MOSTRAR TABELA
        ================================================== */

        function mostrarTabela() {


            tabela.innerHTML = "";


            const inicio =
                (paginaAtual - 1) *
                registrosPorPagina;


            const fim =
                inicio +
                registrosPorPagina;


            const registrosPagina =
                dadosAtuais.slice(
                    inicio,
                    fim
                );


            registrosPagina.forEach(
                incendio => {


                    const linha =
                        document.createElement(
                            "tr"
                        );


                    linha.innerHTML = `

                        <td>
                            ${incendio.ano}
                        </td>

                        <td>
                            ${incendio.estado}
                        </td>

                        <td>
                            ${incendio.mes}
                        </td>

                        <td>
                            ${incendio.quantidade.toLocaleString("pt-BR")}
                        </td>

                        <td>
                            ${incendio.data}
                        </td>

                    `;


                    tabela.appendChild(
                        linha
                    );

                }
            );


            atualizarPaginacao();

        }


        /* ==================================================
           PAGINAÇÃO
        ================================================== */

        function atualizarPaginacao() {


            let paginacao =
                document.getElementById(
                    "paginacao"
                );


            if (!paginacao) {


                paginacao =
                    document.createElement(
                        "div"
                    );


                paginacao.id =
                    "paginacao";


                document
                    .querySelector(
                        ".tabela-container"
                    )
                    .after(paginacao);

            }


            paginacao.innerHTML = "";


            const totalPaginas =
                Math.ceil(
                    dadosAtuais.length /
                    registrosPorPagina
                );


            if (totalPaginas <= 1) {

                return;

            }


            /* ==================================================
               BOTÃO ANTERIOR
            ================================================== */

            const botaoAnterior =
                document.createElement(
                    "button"
                );


            botaoAnterior.textContent =
                "← Anterior";


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


            /* ==================================================
               CRIAR BOTÃO DE PÁGINA
            ================================================== */

            function criarBotaoPagina(
                numero
            ) {


                const botao =
                    document.createElement(
                        "button"
                    );


                botao.textContent =
                    numero;


                if (
                    numero ===
                    paginaAtual
                ) {

                    botao.classList.add(
                        "pagina-atual"
                    );

                }


                botao.addEventListener(
                    "click",
                    function () {


                        paginaAtual =
                            numero;


                        mostrarTabela();

                    }
                );


                paginacao.appendChild(
                    botao
                );

            }


            criarBotaoPagina(1);


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


            if (inicio > 2) {


                const pontos =
                    document.createElement(
                        "span"
                    );


                pontos.textContent =
                    "...";


                pontos.classList.add(
                    "pontos"
                );


                paginacao.appendChild(
                    pontos
                );

            }


            for (
                let pagina = inicio;
                pagina <= fim;
                pagina++
            ) {

                criarBotaoPagina(
                    pagina
                );

            }


            if (
                fim <
                totalPaginas - 1
            ) {


                const pontos =
                    document.createElement(
                        "span"
                    );


                pontos.textContent =
                    "...";


                pontos.classList.add(
                    "pontos"
                );


                paginacao.appendChild(
                    pontos
                );

            }


            if (totalPaginas > 1) {

                criarBotaoPagina(
                    totalPaginas
                );

            }


            /* ==================================================
               BOTÃO PRÓXIMA
            ================================================== */

            const botaoProxima =
                document.createElement(
                    "button"
                );


            botaoProxima.textContent =
                "Próxima →";


            botaoProxima.disabled =
                paginaAtual ===
                totalPaginas;


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


        /* ==================================================
           ATUALIZAR CARDS
        ================================================== */

        function atualizarCards(
            dados
        ) {


            const total =
                dados.reduce(
                    (soma, incendio) => {

                        return soma +
                            incendio.quantidade;

                    },
                    0
                );


            const media =
                dados.length > 0
                    ? total / dados.length
                    : 0;


            const ocorrenciasPorEstado =
                {};


            dados.forEach(
                incendio => {


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
                    ] +=
                        incendio.quantidade;

                }
            );


            let estadoMaior = "-";

            let maiorQuantidade = 0;


            for (
                const estado
                in ocorrenciasPorEstado
            ) {


                if (
                    ocorrenciasPorEstado[
                        estado
                    ] >
                    maiorQuantidade
                ) {


                    maiorQuantidade =
                        ocorrenciasPorEstado[
                            estado
                        ];


                    estadoMaior =
                        estado;

                }

            }


            document.getElementById(
                "totalIncendios"
            ).textContent =
                total.toLocaleString(
                    "pt-BR"
                );


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


        /* ==================================================
           APLICAR FILTROS
        ================================================== */

        function aplicarFiltros() {


            const estadoSelecionado =
                filtroEstado.value;


            const anoSelecionado =
                filtroAno.value;


            dadosAtuais =
                incendios.filter(
                    incendio => {


                        const correspondeEstado =
                            estadoSelecionado ===
                            "todos" ||
                            incendio.estado ===
                            estadoSelecionado;


                        const correspondeAno =
                            anoSelecionado ===
                            "todos" ||
                            incendio.ano ===
                            anoSelecionado;


                        return (
                            correspondeEstado &&
                            correspondeAno
                        );

                    }
                );


            paginaAtual = 1;


            mostrarTabela();


            atualizarCards(
                dadosAtuais
            );

        }


        /* ==================================================
           INICIALIZAÇÃO
        ================================================== */

        aplicarFiltros();


        filtroEstado.addEventListener(
            "change",
            aplicarFiltros
        );


        filtroAno.addEventListener(
            "change",
            aplicarFiltros
        );


        console.log(
            "Dados carregados:",
            incendios
        );


        console.log(
            "Quantidade de registros:",
            incendios.length
        );


    })


    /* ==================================================
       ERRO NO CSV
    ================================================== */

    .catch(erro => {


        console.error(
            "Erro ao carregar o arquivo:",
            erro
        );

    });



/* ==================================================
   MODO CLARO / MODO ESCURO
================================================== */


/* Botão */

const botaoTema =
    document.getElementById(
        "botaoTema"
    );


/* Imagem */

const imagemTema =
    document.getElementById(
        "imagemTema"
    );


/* ==================================================
   LINKS DAS IMAGENS
================================================== */


/* Imagem do MODO CLARO */

const imagemClara =
    "https://images.pexels.com/photos/37812265/pexels-photo-37812265.jpeg";


/* Imagem do MODO ESCURO */

const imagemEscura =
    "https://oeco.org.br/wp-content/uploads/2024/09/Oeco_incendio-Pantanal_MS_Foto-Lalo-de-Almeida-Folhapress-1-1920x1280.jpg";


/* ==================================================
   VERIFICA TEMA SALVO
================================================== */

const temaSalvo =
    localStorage.getItem(
        "temaGeoFire"
    );


/* ==================================================
   TEMA ESCURO SALVO
================================================== */

if (
    temaSalvo ===
    "escuro"
) {


    document.body.classList.add(
        "modo-escuro"
    );


    botaoTema.textContent =
        "☀️";


    botaoTema.setAttribute(
        "aria-label",
        "Ativar modo claro"
    );


    imagemTema.src =
        imagemEscura;


    imagemTema.alt =
        "Incêndio no Pantanal";


}


/* ==================================================
   TEMA CLARO
================================================== */

else {


    imagemTema.src =
        imagemClara;


    imagemTema.alt =
        "Floresta";

}


/* ==================================================
   CLIQUE NO BOTÃO
================================================== */

botaoTema.addEventListener(
    "click",
    function () {


        /* Alterna o modo */

        document.body.classList.toggle(
            "modo-escuro"
        );


        /* ==================================================
           MODO ESCURO
        ================================================== */

        if (
            document.body.classList.contains(
                "modo-escuro"
            )
        ) {


            /* Ícone */

            botaoTema.textContent =
                "☀️";


            botaoTema.setAttribute(
                "aria-label",
                "Ativar modo claro"
            );


            /* IMAGEM DA QUEIMADA */

            imagemTema.src =
                imagemEscura;


            imagemTema.alt =
                "Incêndio no Pantanal";


            /* Salva */

            localStorage.setItem(
                "temaGeoFire",
                "escuro"
            );

        }


        /* ==================================================
           MODO CLARO
        ================================================== */

        else {


            /* Ícone */

            botaoTema.textContent =
                "🌙";


            botaoTema.setAttribute(
                "aria-label",
                "Ativar modo escuro"
            );


            /* IMAGEM DA MATA */

            imagemTema.src =
                imagemClara;


            imagemTema.alt =
                "Floresta";


            /* Salva */

            localStorage.setItem(
                "temaGeoFire",
                "claro"
            );

        }

    }
);