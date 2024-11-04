const timeStep = 0.01; // Incremento de tiempo para la señal
const carrierFrequency = 2 * Math.PI; // Frecuencia de la onda portadora

// Función para convertir el texto a una cadena binaria
function textToBinary(text) {
  return text
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");
}

// Función para inicializar un gráfico en el canvas especificado
function inicializarCanvas(idCanvas) {
  const canvas = document.getElementById(idCanvas);
  return new Chart(canvas, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Signal 1",
          data: [],
          borderColor: "rgba(255, 51, 54, 1)",
          borderWidth: 2,
          pointRadius: 0, // Elimina los puntos en el gráfico
          fill: false,
        },
        {
          label: "Signal 2",
          data: [],
          borderColor: "rgba(0, 251, 251, 1)",
          borderWidth: 2,
          fill: false,
          pointRadius: 0, // Elimina los puntos en el gráfico
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          ticks: {
            color: "#ffffff", // Color blanco para las etiquetas de la escala x
          },
          grid: {
            color: "rgba(255, 255, 255, 0.2)", // Líneas de cuadrícula en blanco semitransparente
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "#ffffff", // Color blanco para las etiquetas de la escala y
          },
          grid: {
            color: "rgba(255, 255, 255, 0.2)", // Líneas de cuadrícula en blanco semitransparente
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#ffffff", // Color blanco para los valores de las etiquetas Signal 1 y Signal 2
          },
        },
      },
    },
  });
}

// Funciones de generación de onda
function generateCarrierWave(timeData) {
  let carrierWave = [];
  for (let t = 0; t <= timeData.length * 0.25; t += timeStep) {
    carrierWave.push(1 + Math.sin(carrierFrequency * t));
  }
  return carrierWave;
}

function generatePSKWave(binaryString, timeData) {
  let pskWave = [];
  for (let t = 0; t <= timeData.length * 0.25; t += timeStep) {
    let bitIndex = Math.floor(t / 0.25);
    let bit =
      bitIndex < binaryString.length ? parseInt(binaryString[bitIndex]) : 0;
    let phaseShift = bit === 1 ? Math.PI : 0;
    pskWave.push(1 + Math.sin(carrierFrequency * t + phaseShift));
  }
  return pskWave;
}

function generate4PSKWave(binaryString, timeData) {
  let psk4Wave = [];
  for (let t = 0; t <= timeData.length * 0.25; t += timeStep) {
    let bitIndex = Math.floor(t / 0.25);
    if (bitIndex < binaryString.length) {
      let symbol = parseInt(binaryString.substr(bitIndex * 2, 2), 2);
      let phaseShift = (symbol * Math.PI) / 2;
      psk4Wave.push(1 + Math.sin(carrierFrequency * t + phaseShift));
    } else {
      psk4Wave.push(0);
    }
  }
  return psk4Wave;
}

function generate8PSKWave(binaryString, timeData) {
  let psk8Wave = [];
  for (let t = 0; t <= timeData.length * 0.25; t += timeStep) {
    let bitIndex = Math.floor(t / 0.25);
    if (bitIndex < binaryString.length) {
      let symbol = parseInt(binaryString.substr(bitIndex * 3, 3), 2);
      let phaseShift = (symbol * Math.PI) / 4;
      psk8Wave.push(1 + Math.sin(carrierFrequency * t + phaseShift));
    } else {
      psk8Wave.push(0);
    }
  }
  return psk8Wave;
}

function generateBinaryWave(binaryString) {
  let binaryWave = [];
  for (let i = 0; i < binaryString.length; i++) {
    const bit = parseInt(binaryString[i]);
    binaryWave.push(bit);
  }
  return binaryWave;
}

// Función para graficar datos en un gráfico específico
function graficarDatos(chart, carrierWave, modulatedWave) {
  const labels = Array.from(
    { length: carrierWave.length },
    (_, i) => i * timeStep
  );
  chart.data.labels = labels;
  chart.data.datasets[0].data = carrierWave; // Onda portadora
  chart.data.datasets[1].data = modulatedWave; // Onda modulada
  chart.update();
}

// Inicializar gráficos
document.addEventListener("DOMContentLoaded", () => {
  const binaryChart = inicializarCanvas("binaryChart");
  const pskChart = inicializarCanvas("pskChart");
  const psk4Chart = inicializarCanvas("psk4Chart");
  const psk8Chart = inicializarCanvas("psk8Chart");

  // Asignar eventos a los botones
  document
    .getElementById("btnPSK")
    .addEventListener("click", () => handlePSKButton(pskChart));
  document
    .getElementById("btn4PSK")
    .addEventListener("click", () => handle4PSKButton(psk4Chart));
  document
    .getElementById("btn8PSK")
    .addEventListener("click", () => handle8PSKButton(psk8Chart));
  document
    .getElementById("btnBinary")
    .addEventListener("click", () => handleBinaryButton(binaryChart));
});

// Función para manejar el botón PSK
function handlePSKButton(pskChart) {
  const binaryString = textToBinary(
    document.getElementById("inputTexto").value
  );
  const timeData = Array(binaryString.length).fill(0);
  const carrierWave = generateCarrierWave(timeData); // Genera la onda portadora
  const pskWave = generatePSKWave(binaryString, timeData);
  const tiempoPSK = calcularTiempoModulacion(binaryString, "PSK");
  graficarDatos(pskChart, carrierWave, pskWave); // Grafica tanto la onda portadora como la PSK
  // Actualiza el contenido del div con id "psk-tiempo"
document.getElementById(
  "psk-tiempo"
).innerHTML = `Tiempo de transmisión PSK: ${tiempoPSK.toFixed(
  2
)} segundos <br> Mensaje: ${binaryString}`;

  // Mostrar el gráfico PSK y ocultar los demás
  toggleVisibility("pskChartWrapper");
}

// Función para manejar el botón 4PSK
function handle4PSKButton(psk4Chart) {
  const binaryString = textToBinary(
    document.getElementById("inputTexto").value
  );
  const timeData = Array(binaryString.length).fill(0);
  const carrierWave = generateCarrierWave(timeData); // Genera la onda portadora
  const psk4Wave = generate4PSKWave(binaryString, timeData);
  const tiempo4PSK = calcularTiempoModulacion(binaryString, "4PSK");
  graficarDatos(psk4Chart, carrierWave, psk4Wave); // Grafica tanto la onda portadora como la 4PSK
  // Actualiza el contenido del div con id "psk-tiempo"
document.getElementById(
  "psk4-tiempo"
).innerHTML = `Tiempo de transmisión 4PSK: ${tiempo4PSK.toFixed(
  2
)} segundos <br> Mensaje: ${binaryString}`;


  // Mostrar el gráfico 4PSK y ocultar los demás
  toggleVisibility("psk4ChartWrapper");
}

// Función para manejar el botón 8PSK
function handle8PSKButton(psk8Chart) {
  const binaryString = textToBinary(
    document.getElementById("inputTexto").value
  );
  const timeData = Array(binaryString.length).fill(0);
  const carrierWave = generateCarrierWave(timeData); // Genera la onda portadora
  const psk8Wave = generate8PSKWave(binaryString, timeData);
  const tiempo8PSK = calcularTiempoModulacion(binaryString, "8PSK");
  graficarDatos(psk8Chart, carrierWave, psk8Wave); // Grafica tanto la onda portadora como la 8PSK
  // Actualiza el contenido del div con id "psk-tiempo"
  document.getElementById(
    "psk8-tiempo"
  ).innerHTML = `Tiempo de transmisión 8PSK: ${tiempo8PSK.toFixed(
    2
  )} segundos <br> Mensaje: ${binaryString}`;

  // Mostrar el gráfico 8PSK y ocultar los demás
  toggleVisibility("psk8ChartWrapper");
}

// Función para manejar el botón de la señal binaria
function handleBinaryButton(binaryChart) {
  const binaryString = textToBinary(
    document.getElementById("inputTexto").value
  );
  const binaryWave = generateBinaryWave(binaryString);
  graficarDatos(binaryChart, binaryWave, []); // Solo grafica la señal binaria
  calcularTiempoModulacion(binaryString, "PSK");
  calcularTiempoModulacion(binaryString, "4PSK");
  calcularTiempoModulacion(binaryString, "8PSK");
  // Mostrar el gráfico binario y ocultar los demás
  toggleVisibility("binaryChartWrapper");
}

// Función para mostrar y ocultar gráficos
function toggleVisibility(chartWrapperId) {
  const wrappers = [
    "binaryChartWrapper",
    "pskChartWrapper",
    "psk4ChartWrapper",
    "psk8ChartWrapper",
  ];
  wrappers.forEach((id) => {
    const wrapper = document.getElementById(id);
    if (id === chartWrapperId) {
      wrapper.classList.remove("hidden"); // Mostrar el gráfico correspondiente
    } else {
      wrapper.classList.add("hidden"); // Ocultar los demás
    }
  });
}

function calcularTiempoModulacion(binaryString, tipoModulacion) {
  const bitsPorSimbolo = {
    PSK: 1,
    "4PSK": 2,
    "8PSK": 3,
  };

  const tiempoPorBit = 0.25; // Tiempo que toma cada bit (ajusta si es necesario)

  if (!bitsPorSimbolo[tipoModulacion]) {
    throw new Error("Tipo de modulación no válido");
  }
  console.log(
    (binaryString.length / bitsPorSimbolo[tipoModulacion]) * tiempoPorBit
  );
  return (binaryString.length / bitsPorSimbolo[tipoModulacion]) * tiempoPorBit;
}
