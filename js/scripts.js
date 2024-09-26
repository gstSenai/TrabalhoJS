
class Maquina {
    // Construtor da classe Máquina, inicializando seus componentes e observadores
    constructor(id, chartDiv, outputTemp, outputVelo, outputConsumo, infoTemp, infoVelo, infoConsumo, statusDiv) {
        this.id = id;
        this.chartDiv = chartDiv;
        this.outputTemp = outputTemp;
        this.outputVelo = outputVelo;
        this.outputConsumo = outputConsumo;
        this.infoTemp = infoTemp;
        this.infoVelo = infoVelo;
        this.infoConsumo = infoConsumo;
        this.statusDiv = statusDiv;
        this.observers = [];
        // Configura o gráfico para exibir os dados da máquina
        this.chart = new JSC.Chart(this.chartDiv, {
            xAxis: { scale_type: "time" },
            series: [
                { name: "Temperatura", points: [], color: "red" },
                { name: "Velocidade", points: [], color: "blue" },
                { name: "Consumo de Energia", points: [], color: "green" }
            ]
        });
        this.idInterval = null;
    }

    // Método para adicionar observadores (servidor, por exemplo) à máquina
    adicionarObservador(observer) {
        this.observers.push(observer);
    }

    // Método para notificar todos os observadores sobre as atualizações da máquina
    notificarObservadores() {
        this.observers.forEach(observer => observer.atualizar(this, this.observers));
    }

    // Método que atualiza a temperatura, velocidade e consumo de energia da máquina
    atualizarTemperatura() {
        // Gera valores aleatórios para temperatura, velocidade e consumo
        this.temperatura = getRandomValor(40, 60);
        this.velocidade = getRandomValor(40, 60);
        this.consumoEnergia = getRandomValor(40, 60);

        // Atualiza o gráfico com os novos valores
        this.chart.series(0).points.add({ x: new Date(), y: this.temperatura });
        this.chart.series(1).points.add({ x: new Date(), y: this.velocidade });
        this.chart.series(2).points.add({ x: new Date(), y: this.consumoEnergia });

        // Exibe os valores atualizados na interface
        this.outputTemp.innerHTML = Math.ceil(this.temperatura) + "ºC";
        this.outputVelo.innerHTML = Math.ceil(this.velocidade) + " RPM";
        this.outputConsumo.innerHTML = Math.ceil(this.consumoEnergia) + " kW";

        // Verifica se algum valor está acima do limite e altera a cor da interface
        this.outputTemp.style.backgroundColor = this.temperatura > 58 ? "Red" : "White";
        this.outputTemp.style.color = this.temperatura > 58 ? "White" : "Black";
        if (this.temperatura > 58) {
            this.pararAtualizacao();
        }

        this.outputVelo.style.backgroundColor = this.velocidade > 58 ? "Red" : "White";
        this.outputVelo.style.color = this.velocidade > 58 ? "White" : "Black";
        if (this.velocidade > 58) {
            this.pararAtualizacao();
        }

        this.outputConsumo.style.backgroundColor = this.consumoEnergia > 58 ? "Red" : "White";
        this.outputConsumo.style.color = this.consumoEnergia > 58 ? "White" : "Black";
        if (this.consumoEnergia > 58) {
            this.pararAtualizacao();
        }

        // Atualiza o status da máquina e notifica os observadores
        this.atualizarStatus();
        this.notificarObservadores();
    }

    // Método que inicia o processo de atualização da máquina
    iniciarAtualizacao() {
        if (this.idInterval === null) {
            this.idInterval = setInterval(() => this.atualizarTemperatura(), 500);
            this.atualizarStatus();
        }
    }

    // Método que para o processo de atualização da máquina
    pararAtualizacao() {
        if (this.idInterval) {
            clearInterval(this.idInterval);
            this.idInterval = null;
            this.atualizarStatus();
        }
    }

    // Método que atualiza o status da máquina (ligada ou desligada)
    atualizarStatus() {
        this.statusDiv.innerHTML = this.idInterval ? "Máquina está ligada" : "Máquina está desligada";
        this.statusDiv.style.color = this.idInterval ? "green" : "red";
    }
}

class Servidor {
    // Método responsável por verificar e exibir erros de temperatura, velocidade e consumo de energia
    informacaoTemperatura(temperatura, infoDiv, velocidade, infoVel, consumoEnergia, infoCons) {
        // Verifica se a temperatura está acima do limite e exibe o erro
        if (infoDiv) {
            if (temperatura > 58) {
                infoDiv.innerHTML = "⚠️ ERRO: TEMPERATURA ACIMA DO NORMAL";
                infoDiv.style.color = "red"; 
            } else {
                infoDiv.innerHTML = "";  
            }
        }

        // Verifica se a velocidade está acima do limite e exibe o erro
        if (infoVel) {
            if (velocidade > 58) {
                infoVel.innerHTML = "⚠️ ERRO: VELOCIDADE ACIMA DO NORMAL";
                infoVel.style.color = "red";
            } else {
                infoVel.innerHTML = "";
            }
        }

        // Verifica se o consumo de energia está acima do limite e exibe o erro
        if (infoCons) {
            if (consumoEnergia > 58) {
                infoCons.innerHTML = "⚠️ ERRO: CONSUMO DE ENERGIA ACIMA DO NORMAL";
                infoCons.style.color = "red";
            } else {
                infoCons.innerHTML = "";
            }
        }
    }
    // Método para atualizar os valores da máquina e verificar o estado das outras máquinas
    atualizar(maquina) {
        // Atualiza a exibição de temperatura, velocidade e consumo
        this.informacaoTemperatura(
            maquina.temperatura,
            maquina.infoTemp,
            maquina.velocidade,
            maquina.infoVelo,
            maquina.consumoEnergia,
            maquina.infoConsumo
        );
        // Verifica o estado geral das máquinas
    }
}

// Função para adicionar uma nova máquina ao sistema
function adicionarMaquina() {
    // Obtém o template e o container de máquinas
    const template = document.querySelector('#machineTemplate').content;
    const container = document.querySelector('#machinesContainer');
    const clone = template.cloneNode(true);
    const id = `00${document.querySelectorAll('.machine-id').length + 1}`;

    // Atualiza o ID da máquina clonada
    clone.querySelector('.machine-id').textContent = id;

    // Obtém os elementos de status e exibição de dados
    const statusDiv = clone.querySelector('.machine-status');
    const outputTemp = clone.querySelector('.machine-temp');
    const outputVelo = clone.querySelector('.machine-vel');
    const outputConsumo = clone.querySelector('.machine-energia');
    const infoTemp = clone.querySelector('.machine-temp-erro');
    const infoVelo = clone.querySelector('.machine-vel-erro');
    const infoConsumo = clone.querySelector('.machine-energia-erro');
    const chartDiv = clone.querySelector('.machine-chart');
    const startBtn = clone.querySelector('.start-btn');

    // Adiciona o clone ao container
    container.appendChild(clone);

    // Cria uma nova instância da máquina
    const maquina = new Maquina(id, chartDiv, outputTemp, outputVelo, outputConsumo, infoTemp, infoVelo, infoConsumo, statusDiv);

    // Adiciona o servidor como observador da máquina
    maquina.adicionarObservador(servidor);

    // Inicia a atualização da máquina ao clicar no botão
    startBtn.addEventListener('click', () => {
        maquina.iniciarAtualizacao();
    });
}

// Função para gerar valores aleatórios
function getRandomValor(min, max) {
    return Math.random() * (max - min) + min;
}

// Instancia o servidor
const servidor = new Servidor();

// Adiciona um evento ao botão de adicionar máquina
document.querySelector('#addMachineBtn').addEventListener('click', adicionarMaquina);
            