// Variável global para armazenar os dados da planilha
let sheetData = [];

// Função para carregar os dados da planilha do Google Sheets
function loadSheetData() {
    // URL da planilha em formato TSV (valores separados por tabulação)
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1N2QmLKcZ1QBLm3gbWoqrARCS8pklGUkMP4LJHCJP4Ek/export?format=tsv';

    // Faz uma requisição para a URL da planilha
    fetch(sheetUrl)
        .then(response => response.text()) // Converte a resposta para texto
        .then(tsvData => {
            const lines = tsvData.split('\n'); // Separa os dados em linhas
            const headers = lines[0].split('\t'); // A primeira linha contém os cabeçalhos
            sheetData = lines.slice(1).map(line => { // Percorre cada linha a partir da segunda
                const values = line.split('\t'); // Separa os valores de cada linha
                let entry = {}; // Cria um objeto para armazenar cada entrada
                headers.forEach((header, index) => {
                    // Atribui os valores ao objeto de entrada utilizando os cabeçalhos como chaves
                    entry[header.trim()] = values[index] ? values[index].trim() : '';
                });
                return entry; // Retorna o objeto de entrada
            });
            populateManifestacao(sheetData); // Chama a função para popular o dropdown de manifestações
        })
        .catch(error => console.error('Erro ao carregar a planilha:', error)); // Captura e exibe erros
}

// Função para popular o dropdown de manifestação desportiva
function populateManifestacao(data) {
    const manifestacaoDropdown = document.getElementById('manifestacao'); // Seleciona o elemento dropdown
    manifestacaoDropdown.addEventListener('change', function () {
        // Quando o usuário seleciona uma manifestação, chama a função para popular os projetos correspondentes
        populateProjetos(data, this.value);
    });
}

// Função para popular o dropdown de projetos com base na manifestação selecionada
function populateProjetos(data, manifestacao) {
    const projetoDropdown = document.getElementById('projeto'); // Seleciona o elemento dropdown de projetos
    projetoDropdown.innerHTML = '<option value="">Selecione</option>'; // Reseta o conteúdo do dropdown
    projetoDropdown.disabled = manifestacao === ''; // Desabilita o dropdown se nenhuma manifestação for selecionada

    data.forEach(row => {
        // Filtra os projetos de acordo com a manifestação desportiva selecionada
        if (row['Manifestação Desportiva'] === manifestacao) {
            const option = document.createElement('option'); // Cria uma nova opção
            option.value = row['Projeto']; // Define o valor da opção
            option.textContent = row['Projeto']; // Define o texto a ser exibido
            projetoDropdown.appendChild(option); // Adiciona a opção ao dropdown
        }
    });

    projetoDropdown.disabled = false; // Habilita o dropdown após adicionar as opções
}

// Evento para o botão "Pesquisar" que busca informações sobre o projeto selecionado
document.getElementById('obterDados').addEventListener('click', function () {
    const projetoSelecionado = document.getElementById('projeto').value; // Obtém o projeto selecionado
    const projetoInfo = sheetData.find(row => row['Projeto'] === projetoSelecionado); // Busca os dados do projeto selecionado

    if (projetoInfo) {
        const processo = projetoInfo['Processo']; // Obtém o número do processo do projeto
        const cnpj = projetoInfo['CNPJ']; // Obtém o CNPJ do projeto

        // Links para consulta de deliberação e CNPJ
        const deliberacaoLink = `https://www.in.gov.br/consulta/-/buscar/dou?q=%22${processo}%22&s=todos&exactDate=all&sortType=0&delta=20&orgPrin=Minist%C3%A9rio+do+Esporte&orgSub=Secretaria+Executiva&artType=Delibera%C3%A7%C3%A3o`;
        const cnpjLink = `https://casadosdados.com.br/solucao/cnpj?q=${cnpj}`;

        // Define o evento de clique para o botão de deliberação
        document.getElementById('consultarDeliberacao').onclick = function () {
            // Adiciona um atraso de 1,5 segundos antes de abrir a página de deliberação
            setTimeout(function () {
                window.open(deliberacaoLink, '_blank');
            }, 1500);
        };
        
        // Define o evento de clique para o botão de CNPJ
        document.getElementById('consultarCNPJ').onclick = function () {
            // Adiciona um atraso de 1,5 segundos antes de abrir a página do CNPJ
            setTimeout(function () {
                window.open(cnpjLink, '_blank');
            }, 1500);
        };

        document.getElementById('resultados').classList.remove('hidden'); // Exibe os botões de resultado
    }
});

// Evento para o botão "Limpar Consulta"
document.getElementById('reset').addEventListener('click', function () {
    document.getElementById('manifestacao').value = ''; // Reseta o valor do dropdown de manifestações
    document.getElementById('projeto').innerHTML = '<option value="">Selecione a Manifestação primeiro</option>'; // Reseta o conteúdo do dropdown de projetos
    document.getElementById('projeto').disabled = true; // Desabilita o dropdown de projetos
    document.getElementById('resultados').classList.add('hidden'); // Oculta os botões de resultado
    document.querySelectorAll('.accordion-content').forEach(item => item.style.display = 'none'); // Oculta todo o conteúdo do FAQ
});

// Função para controlar a lógica de abertura e fechamento dos itens do FAQ
document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', function () {
        const content = this.nextElementSibling; // Seleciona o próximo elemento (conteúdo do FAQ)
        if (content.style.display === 'block') {
            content.style.display = 'none'; // Oculta o conteúdo se já estiver visível
        } else {
            document.querySelectorAll('.accordion-content').forEach(item => item.style.display = 'none'); // Oculta todos os conteúdos do FAQ
            content.style.display = 'block'; // Exibe o conteúdo clicado
        }
    });
});

// Funções para mostrar o conteúdo de cada item do FAQ
document.getElementById('faq1').addEventListener('click', function () {
    showFaqContent('faqContent1', `
        <p>A Lei de Incentivo ao Esporte (Lei nº 11.438/2006) visa fomentar as atividades esportivas no Brasil, concedendo incentivos fiscais para pessoas físicas e jurídicas que apoiarem projetos esportivos e paradesportivos.</p>
        <p><strong>Principais pontos da Lei:</strong></p>
        <ul>
            <li>Dedução do Imposto de Renda: Pessoas físicas e jurídicas podem deduzir do imposto devido os valores investidos em patrocínio ou doação a projetos esportivos aprovados pelo Ministério do Esporte.</li>
            <li>Limites da Dedução: A dedução é limitada a 2% do imposto devido para pessoas jurídicas e 7% para pessoas físicas.</li>
            <li>Tipos de Projetos: Os projetos devem se enquadrar em pelo menos uma das seguintes categorias: desporto educacional, desporto de participação ou desporto de rendimento.</li>
            <li>Inclusão Social: A Lei incentiva projetos que promovam a inclusão social por meio do esporte, especialmente em comunidades em situação de vulnerabilidade.</li>
            <li>Proibição de Remuneração de Atletas Profissionais: Os recursos da Lei não podem ser utilizados para pagar salários de atletas profissionais.</li>
            <li>Aprovação dos Projetos: Os projetos são avaliados e aprovados por uma Comissão Técnica vinculada ao Ministério do Esporte.</li>
            <li>Prestação de Contas: Os proponentes dos projetos são responsáveis por prestar contas ao Ministério do Esporte sobre a utilização dos recursos.</li>
            <li>Fiscalização: A Secretaria da Receita Federal do Brasil (RFB) é responsável por fiscalizar os incentivos previstos na Lei.</li>
        </ul>
        <p>Em resumo, a Lei de Incentivo ao Esporte oferece um mecanismo para que pessoas físicas e jurídicas contribuam para o desenvolvimento do esporte no Brasil, obtendo benefícios fiscais em troca.</p>
        <p><a href="https://www.planalto.gov.br/ccivil_03/_Ato2004-2006/2006/Lei/L11438compilado.htm" target="_blank"><b>Confira a lei na íntegra aqui.</b></a></p>
    `);
});

document.getElementById('faq2').addEventListener('click', function () {
    showFaqContent('faqContent2', `
        <p>As manifestações desportivas englobam uma gama de atividades que envolvem o esporte, desde a prática recreativa até o alto rendimento. Cada tipo de manifestação possui características e objetivos próprios, que definem seu papel no contexto social e cultural.</p>
        <p><strong>Tipos de Manifestações Desportivas:</strong></p>
        <p><strong>1. Manifestação Desportiva Educacional:</strong></p>
        <ul>
            <li><strong>Objetivo:</strong> Desenvolver habilidades motoras, cognitivas e socioemocionais por meio do esporte, promovendo a inclusão, o respeito e a cidadania.</li>
            <li><strong>Características:</strong> Prioriza o aprendizado, a socialização e o desenvolvimento integral do indivíduo, sem foco em resultados competitivos.</li>
            <li><strong>Exemplos:</strong> Aulas de Educação Física escolar, programas esportivos em escolas e comunidades, atividades recreativas e lúdicas.</li>
        </ul>
        <p><strong>2. Manifestação Desportiva de Participação:</strong></p>
        <ul>
            <li><strong>Objetivo:</strong> Incentivar a prática esportiva de forma prazerosa e acessível, promovendo a saúde, o bem-estar e a integração social.</li>
            <li><strong>Características:</strong> Foco na participação, na diversão e na saúde, sem a necessidade de alto nível técnico ou competição formal.</li>
            <li><strong>Exemplos:</strong> Corridas populares, caminhadas, jogos recreativos em parques, campeonatos amadores e eventos esportivos para todos.</li>
        </ul>
        <p><strong>3. Manifestação Desportiva de Rendimento:</strong></p>
        <ul>
            <li><strong>Objetivo:</strong> Buscar o máximo desempenho e alcançar resultados competitivos de alto nível, com foco na excelência técnica e na busca por recordes.</li>
            <li><strong>Características:</strong> Treinamento intenso, profissionalismo, competição formal, busca por resultados e reconhecimento.</li>
            <li><strong>Exemplos:</strong> Jogos olímpicos, campeonatos profissionais, eventos esportivos de elite, seleções nacionais e clubes de alto nível.</li>
        </ul>
        <p>É importante ressaltar que as manifestações desportivas não são estanques e podem se interligar. Por exemplo, um atleta de alto rendimento pode ter iniciado sua trajetória em um programa esportivo educacional, e um evento de participação pode ter um caráter educativo, promovendo a inclusão social. A diversidade de manifestações desportivas garante que o esporte atenda às necessidades e interesses de diferentes públicos, contribuindo para uma sociedade mais saudável, justa e engajada.</p>
    `);
});

document.getElementById('faq3').addEventListener('click', function () {
    showFaqContent('faqContent3', `
        <p>Os selos da Lei de Incentivo ao Esporte (LIE) são um reconhecimento oficial concedido pelo Ministério do Esporte a proponentes, projetos e patrocinadores/doadores que contribuem para o desenvolvimento do esporte no Brasil.</p>
        <ul>
            <li>Demonstram a qualidade e o impacto dos projetos e iniciativas esportivas.</li>
            <li>Incentivam a participação e o investimento no esporte nacional.</li>
            <li>Fortalecem a imagem e a reputação das entidades e empresas que os recebem.</li>
        </ul>
        <p>Para obter mais informações sobre os selos da LIE, acesse: <a href="https://www.gov.br/esporte/pt-br/acoes-e-programas/lei-de-incentivo-ao-esporte/selo-lie/" target="_blank"><b>Selo LIE - Mais Informações</b></a>.</p>
    `);
});

document.getElementById('faq4').addEventListener('click', function () {
    showFaqContent('faqContent4', `
        <p>O valor que você pode doar para projetos esportivos depende do seu imposto de renda devido. A Lei de Incentivo ao Esporte permite que pessoas físicas abatam até 7% do imposto devido com doações para projetos esportivos.</p>
        <p>Para calcular o valor máximo que você pode abater, utilize o simulador da Receita Federal: <a href="https://www27.receita.fazenda.gov.br/simulador-irpf/" target="_blank"><b>Simulador IRPF</b></a>.</p>
        <p>Exemplo: Se você tiver 1000 reais de imposto devido, poderá abater 70 reais (7% de 1000), restando 930 reais a pagar no final da declaração.</p>
    `);
});

// Função para exibir o conteúdo de cada FAQ
function showFaqContent(contentId, content) {
    const faqContentDiv = document.getElementById(contentId); // Seleciona o elemento de conteúdo do FAQ
    faqContentDiv.innerHTML = content; // Adiciona o conteúdo HTML ao elemento
    faqContentDiv.style.display = 'block'; // Exibe o conteúdo
}

// Carrega os dados ao carregar a página
window.onload = loadSheetData;
