
// Criação da classe Maquina
class Maquina {
    // Criação do método construtor com os atributos que vão ser exibidos
    constructor(id, chartDivId, outputDivId, infoDivId, outputVelo, infoVelo, outputConsu, infoConsu) {
        this.id = id;
        this.chartDivId = chartDivId;
        this.outputDivId = outputDivId;
        this.infoDivId = infoDivId;
        this.outputVelo = outputVelo;
        this.outputConsu = outputConsu;
        this.infoVelo = infoVelo;
        this.infoConsu = infoConsu;
        this.statusDivId = `status-${id}`;
        // Criação do Grafico para verificação do histórico
        this.chart = new JSC.Chart(this.chartDivId, {
            xAxis: { scale_type: "time" },
            series: [
                { name: "Temperatura", points: [], color: "red" },
                { name: "Velocidade", points: [], color: "blue" },
                { name: "Consumo de Energia", points: [], color: "green" }
            ]
        });
        this.idInterval = null;
        // Armazenamento dos incritos para receber as notificações
        this.servers = [];
    }

    // Adicionar um incrito para receber as notificações da maquina
    adicionarServers(server) {
        this.servers.push(server);
    }

    // Remover o incrito para deixar de receber as notificaçõe, por posição especifica
    removerServers(server) {
        this.servers = this.servers.filter(obs => obs !== server);
    }

    // Notifica os incritos da maquina
    notificarServers(temperatura, velocidade, consumoEnergia) {
        this.servers.forEach(server => server.informacaoTemperatura(
            temperatura, this.infoDivId, 
            velocidade, this.infoVelo, 
            consumoEnergia, this.infoConsu
        ));
    }

    // Aqui é feito a Atualização da temperatura
    atualizarTemperatura() {
        let temperatura = getRandomValor(40, 60);// Criação do Atributo em que gera uma temperatura
        let velocidade = getRandomValor(40, 60);// Criação do Atributo em que gera uma Velocidade
        let consumoEnergia = getRandomValor(40, 60);// Criação do Atributo em que gera um Consumo de enegia

        this.chart.series(0).points.add({ x: new Date(), y: temperatura }); // Criação dos intens que vão ter dento do meu grafico que é Temperatura e data que foi gerada essa temperatura
        this.chart.series(1).points.add({ x: new Date(), y: velocidade }); // Criação dos intens que vão ter dento do meu grafico que é Velocidade e data que foi gerada essa temperatura
        this.chart.series(2).points.add({ x: new Date(), y: consumoEnergia }); // Criação dos intens que vão ter dento do meu grafico que é Consumo de Energia e data que foi gerada essa temperatura

        // Criação dos atributos no HTMl(Velocidade, Velocidade, Consumo de Energia)
        const outputDiv = document.getElementById(this.outputDivId);
        outputDiv.innerHTML = Math.ceil(temperatura) + "ºC";
        const outputVel = document.getElementById(this.outputVelo);
        outputVel.innerHTML = Math.ceil(velocidade) + " RPM";
        const outputConsu = document.getElementById(this.outputConsu);
        outputConsu.innerHTML = Math.ceil(consumoEnergia) + " kW";

        // Condições para parar a operação da Maquina 
        if (temperatura > 58) {
            outputDiv.style.backgroundColor = "Red";
            outputDiv.style.color = "White";
            this.pararAtualizacao();
        } else {
            outputDiv.style.color = "Black";
            outputDiv.style.backgroundColor = "White";
        }

        if (velocidade > 58) {
            outputVel.style.backgroundColor = "Red";
            outputVel.style.color = "White";
            this.pararAtualizacao();
        } else {
            outputVel.style.color = "Black";
            outputVel.style.backgroundColor = "White";
        }

        if (consumoEnergia > 58) {
            outputConsu.style.backgroundColor = "Red";
            outputConsu.style.color = "White";
            this.pararAtualizacao();
        } else {
            outputConsu.style.color = "Black";
            outputConsu.style.backgroundColor = "White";
        }

        // Atualizar a notificação para os servidores
        this.notificarServers(temperatura, velocidade, consumoEnergia);
        // Atualizar o status da maquina se está desligada ou ligada
        this.atualizarStatus();
    }

    // Método para atualizar os status das maquinas
    atualizarStatus() {
        const statusDiv = document.getElementById(this.statusDivId);
        // Condição para exir a mensagem no html de ligada ou desligada  
        if (statusDiv) {
            if (this.idInterval) {
                statusDiv.innerHTML = "Máquina está ligada";
                statusDiv.style.color = "green";
            } else {
                statusDiv.innerHTML = "Máquina está desligada";
                statusDiv.style.color = "red";
            }
        }
    }

    // Um método para definir o tempo que vai demorar para atualizar a temperatura e começar a atualizar
    iniciarAtualizacao() {
        if (this.idInterval === null) {
            this.idInterval = setInterval(() => this.atualizarTemperatura(), 2000);
            this.atualizarStatus();
        }
    }

    // Método para quando der algum erro ele ativar este Método
    pararAtualizacao() {
        if (this.idInterval) {
            clearInterval(this.idInterval);
            this.idInterval = null;
            this.atualizarStatus();
        }
    }
}

// Classe que representa um servidor que monitora condições de temperatura, velocidade e consumo de energia
class Servidor {
    // Método que recebe dados de temperatura, velocidade e consumo de energia, e atualiza a interface do usuário
    informacaoTemperatura(temperatura, infoDivId, velocidade, infoVelo, consumoEnergia, infoConsu) {
        // Obtém elementos HTML pelos IDs fornecidos
        const infoDiv = document.getElementById(infoDivId);
        const infoVel = document.getElementById(infoVelo);
        const infoCons = document.getElementById(infoConsu);

        // Verifica se a temperatura está acima do limite
        if (temperatura > 58) {
            infoDiv.innerHTML = "⚠️ ERRO: TEMPERATURA ACIMA DO NORMAL"; // Exibe mensagem de erro
        } else {
            infoDiv.innerHTML = ""; // Limpa a mensagem de erro se a temperatura estiver normal
        }

        // Verifica se a velocidade está acima do limite
        if (velocidade > 58) {
            infoVel.innerHTML = "⚠️ ERRO: VELOCIDADE ACIMA DO NORMAL"; // Exibe mensagem de erro
        } else {
            infoVel.innerHTML = ""; // Limpa a mensagem de erro se a velocidade estiver normal
        }

        // Verifica se o consumo de energia está acima do limite
        if (consumoEnergia > 58) {
            infoCons.innerHTML = "⚠️ ERRO: CONSUMO DE ENERGIA ACIMA DO NORMAL"; // Exibe mensagem de erro
        } else {
            infoCons.innerHTML = ""; // Limpa a mensagem de erro se o consumo de energia estiver normal
        }
    }
}

// Função que gera um valor aleatório entre um mínimo e um máximo especificados
function getRandomValor(min, max) {
    return Math.random() * (max - min) + min; // Retorna um valor aleatório
}

// Cria duas instâncias da classe Servidor
const servidor1 = new Servidor();
const servidor2 = new Servidor();

// Cria uma instância da classe Maquina chamada 'maquina1' com IDs para os elementos da interface
const maquina1 = new Maquina('maquina1', 'chartDiv1', 'outputDiv1', 'infoDiv1', 'outputVelo1', 'infoVelo1', 'outputConsu1', 'infoConsu1');

// Adiciona os servidores à máquina 1
maquina1.adicionarServers(servidor1);
maquina1.adicionarServers(servidor2);

// Seleciona o botão com ID 'button1' e adiciona um evento de clique para iniciar a atualização da máquina 1
const btn1 = document.querySelector("#button1");
btn1.addEventListener("click", function () {
    maquina1.iniciarAtualizacao(); // Inicia a atualização da máquina 1 quando o botão é clicado
});

// Cria uma instância da classe Maquina chamada 'maquina2' com IDs para os elementos da interface
const maquina2 = new Maquina('maquina2', 'chartDiv2', 'outputDiv2', 'infoDiv2', 'outputVelo2', 'infoVelo2', 'outputConsu2', 'infoConsu2');

// Adiciona o servidor 1 à máquina 2
maquina2.adicionarServers(servidor1);

// Seleciona o botão com ID 'button2' e adiciona um evento de clique para iniciar a atualização da máquina 2
const btn2 = document.querySelector("#button2");
btn2.addEventListener("click", function () {
    maquina2.iniciarAtualizacao(); // Inicia a atualização da máquina 2 quando o botão é clicado
});

