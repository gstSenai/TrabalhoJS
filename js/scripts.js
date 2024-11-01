class Maquina {
    constructor(id, chartDiv, outputTemp, outputVelo, outputConsumo, statusDiv, atributosSelecionados) {
        this.id = id;
        this.chartDiv = chartDiv;
        this.outputTemp = outputTemp;
        this.outputVelo = outputVelo;
        this.outputConsumo = outputConsumo;
        this.statusDiv = statusDiv;
        this.atributosSelecionados = atributosSelecionados;
        this.observers = [];
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

    adicionarObservador(observer) {
        this.observers.push(observer);
    }

    notificarObservadores() {
        this.observers.forEach(observer => observer.atualizar(this));
    }

    atualizarTemperatura() {
        const currentTime = new Date();
        if (this.atributosSelecionados.includes("Temperatura")) {
            this.temperatura = getRandomValor(40, 60);
            this.chart.series(0).points.add({ x: currentTime, y: this.temperatura });
            this.outputTemp.innerHTML = Math.ceil(this.temperatura) + "ºC";
            if (this.temperatura > 58) {
                this.outputTemp.style.backgroundColor = "Red";
                this.outputTemp.style.color = "White";
            } else if (this.temperatura > 55 && this.temperatura <= 58) {
                this.outputTemp.style.backgroundColor = "Yellow";
                this.outputTemp.style.color = "Black";
            } else {
                this.outputTemp.style.backgroundColor = "White";
                this.outputTemp.style.color = "Black";
            }
            if (this.temperatura > 58) {
                this.pararAtualizacao();
            }
        }

        if (this.atributosSelecionados.includes("Velocidade")) {
            this.velocidade = getRandomValor(40, 60);
            this.chart.series(1).points.add({ x: currentTime, y: this.velocidade });
            this.outputVelo.innerHTML = Math.ceil(this.velocidade) + " RPM";
            this.outputVelo.style.backgroundColor = this.velocidade > 58 ? "Red" : "White";
            this.outputVelo.style.color = this.velocidade > 58 ? "White" : "Black";
            if (this.velocidade > 58) {
                this.pararAtualizacao();
            }
        }

        if (this.atributosSelecionados.includes("Energia")) {
            this.consumoEnergia = getRandomValor(40, 60);
            this.chart.series(2).points.add({ x: currentTime, y: this.consumoEnergia });
            this.outputConsumo.innerHTML = Math.ceil(this.consumoEnergia) + " kW";
            this.outputConsumo.style.backgroundColor = this.consumoEnergia > 58 ? "Red" : "White";
            this.outputConsumo.style.color = this.consumoEnergia > 58 ? "White" : "Black";
            if (this.consumoEnergia > 58) {
                this.pararAtualizacao();
            }
        }

        this.atualizarStatus();
        this.notificarObservadores();
    }

    iniciarAtualizacao() {
        if (this.idInterval === null) {
            this.idInterval = setInterval(() => this.atualizarTemperatura(), 500);
            this.atualizarStatus();
        }
    }

    pararAtualizacao() {
        if (this.idInterval) {
            clearInterval(this.idInterval);
            this.idInterval = null;
            this.atualizarStatus();
        }
    }

    atualizarStatus() {
        this.statusDiv.innerHTML = this.idInterval ? "Máquina está ligada" : "Máquina está desligada";
        this.statusDiv.style.color = this.idInterval ? "green" : "red";
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

        if (maquina.temperatura > 58 && !this.notificacaoEnviada.temperatura) {
            notificationMessage += `⚠️${this.nome} Atenção: Consumo de Temperatura elevada na Máquina ${maquina.id}: ${Math.ceil(maquina.temperatura)} ºC<br>`;
            this.notificacaoEnviada.temperatura = true;
        } else if (maquina.temperatura <= 58) {
            this.notificacaoEnviada.temperatura = false;
        }

        if (maquina.velocidade > 58 && !this.notificacaoEnviada.velocidade) {
            notificationMessage += `⚠️${this.nome} Atenção: Velocidade acima do normal na Máquina ${maquina.id}: ${Math.ceil(maquina.velocidade)} RPM<br>`;
            this.notificacaoEnviada.velocidade = true;
        } else if (maquina.velocidade <= 58) {
            this.notificacaoEnviada.velocidade = false;
        }

        if (maquina.consumoEnergia > 58 && !this.notificacaoEnviada.consumoEnergia) {
            notificationMessage += `⚠️${this.nome} Atenção: Consumo de Energia elevado na Máquina ${maquina.id}: ${Math.ceil(maquina.consumoEnergia)} kW<br>`;
            this.notificacaoEnviada.consumoEnergia = true;
        } else if (maquina.consumoEnergia <= 58) {
            this.notificacaoEnviada.consumoEnergia = false;
        }

        if (notificationMessage) {
            const notificationElement = document.createElement('div');
            notificationElement.innerHTML = notificationMessage;
            notificationElement.id = "notification";
            notificationElement.style.backgroundColor = "white";
            notificationContainer.appendChild(notificationElement);
        }
    }

    atualizar(maquina) {
        this.receberNotificacao(maquina);
    }
}

class MaquinaFactory {
    static criarMaquina(id, chartDiv, outputTemp, outputVelo, outputConsumo, statusDiv, atributosSelecionados) {
        return new Maquina(id, chartDiv, outputTemp, outputVelo, outputConsumo, statusDiv, atributosSelecionados);
    }
}

function getRandomValor(min, max) {
    return Math.random() * (max - min) + min;
}

const funcionarios = [
    new Funcionario('Funcionario1'),
    new Funcionario('Funcionario2'),
    new Funcionario('Funcionario3')
];

function adicionarMaquina() {
    const template = document.querySelector('#machineTemplate').content;
    const container = document.querySelector('#machinesContainer');
    const clone = template.cloneNode(true);

    const machineNameInput = document.getElementById('machineName');
    const id = machineNameInput.value.trim();

    if (!id) {
        alert("Por favor, insira um nome para a máquina.");
        return;
    }

    const selectFuncionario = document.getElementById('funcionario-select');
    const funcionarioResponsavel = funcionarios.find(f => f.nome === selectFuncionario.value);

    const atributoSelect = document.getElementById('atributo-select');
    const atributosSelecionados = Array.from(atributoSelect.selectedOptions).map(option => option.value);

    if (atributosSelecionados.length === 0) {
        alert("Por favor, selecione pelo menos um atributo.");
        return;
    }

    clone.querySelector('.machine-id').textContent = id;

    const statusDiv = clone.querySelector('.machine-status');
    const outputTemp = clone.querySelector('.machine-temp');
    const outputVelo = clone.querySelector('.machine-vel');
    const outputConsumo = clone.querySelector('.machine-energia');
    const chartDiv = clone.querySelector('.machine-chart');
    const startBtn = clone.querySelector('.start-btn');

    container.appendChild(clone);

    const maquina = MaquinaFactory.criarMaquina(id, chartDiv, outputTemp, outputVelo, outputConsumo, statusDiv, atributosSelecionados);

    if (funcionarioResponsavel) {
        maquina.adicionarObservador(funcionarioResponsavel);
    }

    startBtn.addEventListener('click', () => {
        maquina.iniciarAtualizacao();
    });

    machineNameInput.value = '';
}

document.getElementById('addMachineBtn').addEventListener('click', adicionarMaquina);

