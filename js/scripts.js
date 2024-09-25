class Servidor {
    informacaoTemperatura(temperatura, infoDiv, velocidade, infoVel, consumoEnergia, infoCons) {
        // Verificação e exibição de erros
        if (infoDiv) {
            if (temperatura > 58) {
                infoDiv.innerHTML = "⚠️ ERRO: TEMPERATURA ACIMA DO NORMAL";
                infoDiv.style.color = "red"; 
            } else {
                infoDiv.innerHTML = "";  
            }
        }

        if (infoVel) {
            if (velocidade > 58) {
                infoVel.innerHTML = "⚠️ ERRO: VELOCIDADE ACIMA DO NORMAL";
                infoVel.style.color = "red";
            } else {
                infoVel.innerHTML = "";
            }
        }

        if (infoCons) {
            if (consumoEnergia > 58) {
                infoCons.innerHTML = "⚠️ ERRO: CONSUMO DE ENERGIA ACIMA DO NORMAL";
                infoCons.style.color = "red";
            } else {
                infoCons.innerHTML = "";
            }
        }
    }

    verificarEstado(maquinas) {
        let algumaFalha = false;
        for (let maquina of maquinas) {
            if (maquina.temperatura > 58) {
                algumaFalha = true;
                
            }if(maquina.velocidade > 58){
                algumaFalha = true;
            }if(maquina.consumoEnergia > 58){
                algumaFalha = true;
            }
        }
        if (algumaFalha == true) {
            maquinas.forEach(m => m.pararAtualizacao());
        }
    }

    atualizar(maquina, maquinas) {
        this.informacaoTemperatura(
            maquina.temperatura,
            maquina.infoTemp,
            maquina.velocidade,
            maquina.infoVelo,
            maquina.consumoEnergia,
            maquina.infoConsumo
        );
        this.verificarEstado(maquinas);
    }
}

class Maquina {
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

        this.chart = new JSC.Chart(this.chartDiv, {
            xAxis: { scale_type: "time" },
            series: [
                { name: "Temperatura", points: [], color: "red" },
                { name: "Velocidade", points: [], color: "blue" },
                { name: "Consumo de Energia", points: [], color: "green" }
            ]
        });

        this.idInterval = null;
        this.temperatura = 0;
        this.velocidade = 0;
        this.consumoEnergia = 0;
    }

    adicionarObservador(observer) {
        this.observers.push(observer);
    }

    notificarObservadores() {
        this.observers.forEach(observer => observer.atualizar(this, this.observers));
    }

    atualizarTemperatura() {
        this.temperatura = getRandomValor(40, 60);
        this.velocidade = getRandomValor(40, 60);
        this.consumoEnergia = getRandomValor(40, 60);

        this.chart.series(0).points.add({ x: new Date(), y: this.temperatura });
        this.chart.series(1).points.add({ x: new Date(), y: this.velocidade });
        this.chart.series(2).points.add({ x: new Date(), y: this.consumoEnergia });

        this.outputTemp.innerHTML = Math.ceil(this.temperatura) + "ºC";
        this.outputVelo.innerHTML = Math.ceil(this.velocidade) + " RPM";
        this.outputConsumo.innerHTML = Math.ceil(this.consumoEnergia) + " kW";

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

        this.atualizarStatus();
        this.notificarObservadores();
    }

    iniciarAtualizacao() {
        if (this.idInterval === null) {
            this.idInterval = setInterval(() => this.atualizarTemperatura(), 2000);
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
    const infoTemp = clone.querySelector('.machine-temp-erro');
    const infoVelo = clone.querySelector('.machine-vel-erro');
    const infoConsumo = clone.querySelector('.machine-energia-erro');
    const chartDiv = clone.querySelector('.machine-chart');
    const startBtn = clone.querySelector('.start-btn');

    container.appendChild(clone);

    const maquina = new Maquina(
        id, chartDiv, outputTemp, outputVelo, outputConsumo, infoTemp, infoVelo, infoConsumo, statusDiv
    );

    maquina.adicionarObservador(servidor);

    startBtn.addEventListener('click', () => {
        maquina.iniciarAtualizacao();
    });
}

document.querySelector('#addMachineBtn').addEventListener('click', adicionarMaquina);

function getRandomValor(min, max) {
    return Math.random() * (max - min) + min;
}

const servidor = new Servidor();
