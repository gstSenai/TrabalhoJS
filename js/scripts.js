class Maquina {
    constructor(id, chartDivId, outputDivId, infoDivId, servidor, max, min) {
        this.id = id;
        this.chartDivId = chartDivId;
        this.outputDivId = outputDivId;
        this.infoDivId = infoDivId;
        this.servidor = servidor;
        this.max = max;
        this.min = min;
        this.chart = new JSC.Chart(this.chartDivId, {
            xAxis: { scale_type: "time" },
            series: [
                {
                    name: "Temperatura",
                    points: []
                }
            ]
        });
        this.idInterval = null;
    }

    atualizarTemperatura() {
        let temperatura = getRandomTemperatura(40,60);
        let velocidade = getRandomTemperatura(40,60);
        let consumoEnergia = getRandomTemperatura(40,60);

        this.chart.series(0).points.add({
            x: new Date(),
            y: temperatura
        });

        const myText = document.createTextNode(Math.ceil(temperatura) + "ºC");

        const p = document.createElement("p");
        p.appendChild(myText);

        const outputDiv = document.getElementById(this.outputDivId);
        outputDiv.innerHTML = '';
        outputDiv.appendChild(p);

        if (temperatura > 57) {
            outputDiv.style.backgroundColor = "Red";
            outputDiv.style.color = "White";
            this.pararAtualizacao();
        } else {
            outputDiv.style.color = "Black";
            outputDiv.style.backgroundColor = "White";
        }

        this.servidor.informacaoTemperatura(temperatura, this.infoDivId);
    }

    iniciarAtualizacao() {
        if (this.idInterval === null) {
            this.idInterval = setInterval(() => this.atualizarTemperatura(), 1000);
        }
    }

    pararAtualizacao() {
        if (this.idInterval) {
            clearInterval(this.idInterval);
            this.idInterval = null;
        }
    }
}

function getRandomTemperatura(min, max){
    return Math.random() * (max - min) + min;
}

const btn1 = document.querySelector("#button1");
btn1.addEventListener("click", function () {
    maquina1.iniciarAtualizacao();
});

const btn2 = document.querySelector("#button2");
btn2.addEventListener("click", function () {
    maquina2.iniciarAtualizacao();
});


class Servidor {
    constructor() {
        this.erroMostrado = {};
    }
    informacaoTemperatura(temperatura, infoDivId) {
        if (temperatura > 57 && !this.erroMostrado[infoDivId]) {
            const myText2 = document.createTextNode("⚠️ERRO: TEMPERATURA ACIMA DO NORMAL");

            const p = document.createElement("p");
            p.appendChild(myText2);

            const infoDiv = document.getElementById(infoDivId);
            infoDiv.innerHTML = '';
            infoDiv.appendChild(p);

            this.erroMostrado[infoDivId] = true;
        }else{
            const myText2 = document.createTextNode("");

            const p = document.createElement("p");
            p.appendChild(myText2);

            const infoDiv = document.getElementById(infoDivId);
            infoDiv.innerHTML = '';
            infoDiv.appendChild(p);

            this.erroMostrado[infoDivId] = false;
        }
    }
}


const servidor = new Servidor();

const maquina1 = new Maquina('maquina1', 'chartDiv1', 'outputDiv1', 'infoDiv1', servidor);
const maquina2 = new Maquina('maquina2', 'chartDiv2', 'outputDiv2', 'infoDiv2', servidor);