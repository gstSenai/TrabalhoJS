class Maquina {
    constructor(id, chartDiv, outputTemp, outputVelo, outputConsumo, statusDiv) {
        this.id = id; // Identificador da máquina
        this.chartDiv = chartDiv; // Elemento onde o gráfico será renderizado
        this.outputTemp = outputTemp; // Elemento para exibir a temperatura
        this.outputVelo = outputVelo; // Elemento para exibir a velocidade
        this.outputConsumo = outputConsumo; // Elemento para exibir o consumo de energia
        this.statusDiv = statusDiv; // Elemento para exibir o status da máquina
        this.observers = []; // Array para armazenar observadores
        this.chart = new JSC.Chart(this.chartDiv, { // Inicializa o gráfico
            xAxis: { scale_type: "time" }, // Define o eixo x como tipo tempo
            series: [ // Define as séries do gráfico
                { name: "Temperatura", points: [], color: "red" },
                { name: "Velocidade", points: [], color: "blue" },
                { name: "Consumo de Energia", points: [], color: "green" }
            ]
        });
        this.idInterval = null; // Armazena o ID do intervalo para atualizações
    }

    adicionarObservador(observer) {
        this.observers.push(observer); // Adiciona um observador à lista
    }

    notificarObservadores() {
        this.observers.forEach(observer => observer.atualizar(this)); // Notifica todos os observadores com a instância atual
    }

    atualizarTemperatura() {
        // Gera valores aleatórios para temperatura, velocidade e consumo de energia
        this.temperatura = getRandomValor(40, 60);
        this.velocidade = getRandomValor(40, 60);
        this.consumoEnergia = getRandomValor(40, 60);

        // Atualiza os pontos do gráfico com os novos valores
        this.chart.series(0).points.add({ x: new Date(), y: this.temperatura });
        this.chart.series(1).points.add({ x: new Date(), y: this.velocidade });
        this.chart.series(2).points.add({ x: new Date(), y: this.consumoEnergia });

        // Atualiza a exibição dos valores nos elementos de saída
        this.outputTemp.innerHTML = Math.ceil(this.temperatura) + "ºC";
        this.outputVelo.innerHTML = Math.ceil(this.velocidade) + " RPM";
        this.outputConsumo.innerHTML = Math.ceil(this.consumoEnergia) + " kW";

        // Altera o estilo de fundo e texto com base nos limites
        this.outputTemp.style.backgroundColor = this.temperatura > 58 ? "Red" : "White";
        this.outputTemp.style.color = this.temperatura > 58 ? "White" : "Black";
        if (this.temperatura > 58) {
            this.pararAtualizacao(); // Para a atualização se a temperatura exceder o limite
        }

        this.outputVelo.style.backgroundColor = this.velocidade > 58 ? "Red" : "White";
        this.outputVelo.style.color = this.velocidade > 58 ? "White" : "Black";
        if (this.velocidade > 58) {
            this.pararAtualizacao(); // Para a atualização se a velocidade exceder o limite
        }

        this.outputConsumo.style.backgroundColor = this.consumoEnergia > 58 ? "Red" : "White";
        this.outputConsumo.style.color = this.consumoEnergia > 58 ? "White" : "Black";
        if (this.consumoEnergia > 58) {
            this.pararAtualizacao(); // Para a atualização se o consumo de energia exceder o limite
        }

        this.atualizarStatus(); // Atualiza o status da máquina
        this.notificarObservadores(); // Notifica apenas os funcionários
    }

    iniciarAtualizacao() {
        // Inicia a atualização se ainda não estiver em andamento
        if (this.idInterval === null) {
            this.idInterval = setInterval(() => this.atualizarTemperatura(), 500); // Atualiza a cada 500 ms
            this.atualizarStatus(); // Atualiza o status da máquina
        }
    }

    pararAtualizacao() {
        // Para a atualização se estiver em andamento
        if (this.idInterval) {
            clearInterval(this.idInterval); // Limpa o intervalo
            this.idInterval = null; // Reseta o ID do intervalo
            this.atualizarStatus(); // Atualiza o status da máquina
        }
    }

    atualizarStatus() {
        // Atualiza a exibição do status da máquina
        this.statusDiv.innerHTML = this.idInterval ? "Máquina está ligada" : "Máquina está desligada";
        this.statusDiv.style.color = this.idInterval ? "green" : "red"; // Muda a cor do status
    }
}


class Funcionario {
    constructor(nome) {
        this.nome = nome;
        this.notificacaoEnviada = {
            temperatura: false,
            velocidade: false,
            consumoEnergia: false
        };
    }

    receberNotificacao(maquina) {
        const notificationContainer = document.getElementById('notificationContainer');
        let notificationMessage = '';

        // Verifica se a temperatura está elevada
        if (maquina.temperatura > 58 && !this.notificacaoEnviada.temperatura) {
            notificationMessage += `⚠️${this.nome} Atenção: Consumo de Temperatura elevada na Máquina ${maquina.id}: ${Math.ceil(maquina.temperatura)} ºC<br>`;
            this.notificacaoEnviada.temperatura = true; // Marcar como notificado
        } else if (maquina.temperatura <= 58) {
            this.notificacaoEnviada.temperatura = false; // Resetar notificação
        }

        // Verifica se a velocidade está elevada
        if (maquina.velocidade > 58 && !this.notificacaoEnviada.velocidade) {
            notificationMessage += `⚠️${this.nome} Atenção: Velocidade acima do normal na Máquina ${maquina.id}: ${Math.ceil(maquina.velocidade)} RPM<br>`;
            this.notificacaoEnviada.velocidade = true; // Marcar como notificado
        } else if (maquina.velocidade <= 58) {
            this.notificacaoEnviada.velocidade = false; // Resetar notificação
        }

        // Verifica se o consumo de energia está elevado
        if (maquina.consumoEnergia > 58 && !this.notificacaoEnviada.consumoEnergia) {
            notificationMessage += `⚠️${this.nome} Atenção: Consumo de Energia elevado na Máquina ${maquina.id}: ${Math.ceil(maquina.consumoEnergia)} kW<br>`;
            this.notificacaoEnviada.consumoEnergia = true; // Marcar como notificado
        } else if (maquina.consumoEnergia <= 58) {
            this.notificacaoEnviada.consumoEnergia = false; // Resetar notificação
        }
        // Adiciona a notificação ao container apenas se houver mensagens
        if (notificationMessage) {
            const notificationElement = document.createElement('div');
            notificationElement.innerHTML = notificationMessage;
            notificationElement.id = "notification"; // Adicionando um ID ao elemento
            notificationElement.style.backgroundColor = "white"; // Se necessário, você pode mover isso para o CSS
            notificationContainer.appendChild(notificationElement);
        }
    }
    atualizar(maquina) {
        this.receberNotificacao(maquina);
    }
}

// Função para gerar valores aleatórios
function getRandomValor(min, max) {
    return Math.random() * (max - min) + min;
}

// Lista de funcionários
const funcionarios = [
    new Funcionario('Funcionario1'),
    new Funcionario('Funcionario2'),
    new Funcionario('Funcionario3')
];

// Função para adicionar máquinas
function adicionarMaquina() {
    const template = document.querySelector('#machineTemplate').content;
    const container = document.querySelector('#machinesContainer');
    const clone = template.cloneNode(true);
    const id = `00${document.querySelectorAll('.machine-id').length + 1}`;

    clone.querySelector('.machine-id').textContent = id;

    const statusDiv = clone.querySelector('.machine-status');
    const outputTemp = clone.querySelector('.machine-temp');
    const outputVelo = clone.querySelector('.machine-vel');
    const outputConsumo = clone.querySelector('.machine-energia');
    const chartDiv = clone.querySelector('.machine-chart');
    const startBtn = clone.querySelector('.start-btn');

    container.appendChild(clone);

    const maquina = new Maquina(id, chartDiv, outputTemp, outputVelo, outputConsumo, statusDiv);

    // Selecionar funcionário com base no dropdown
    const selectFuncionario = document.getElementById('funcionario-select');
    const funcionarioResponsavel = funcionarios.find(f => f.nome === selectFuncionario.value);

    // Adicionar apenas o funcionário como observador
    if (funcionarioResponsavel) {
        maquina.adicionarObservador(funcionarioResponsavel);
    }

    startBtn.addEventListener('click', () => {
        maquina.iniciarAtualizacao();
    });
}
// Associar a função ao botão de adicionar máquina
document.getElementById('addMachineBtn').addEventListener('click', adicionarMaquina);
