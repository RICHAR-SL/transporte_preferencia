let pieChart, barChart;

async function fetchData(){
  const res = await fetch('/api/data');
  const json = await res.json();
  return json;
}

function buildCharts(counts){
  const labels = Object.keys(counts);
  const values = labels.map(l => counts[l]);

  // Pie
  const pieCtx = document.getElementById('pieChart').getContext('2d');
  if(pieChart) pieChart.destroy();
  pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: { labels, datasets: [{ data: values, backgroundColor: ['#3b82f6','#10b981','#f97316','#ef4444','#8b5cf6'] }] }
  });

  // Bar
  const barCtx = document.getElementById('barChart').getContext('2d');
  if(barChart) barChart.destroy();
  barChart = new Chart(barCtx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Conteo', data: values, backgroundColor: '#3b82f6' }] },
    options: { scales:{ y:{ beginAtZero:true } } }
  });
}

async function refresh(){
  const {total, counts} = await fetchData();
  document.getElementById('total-participantes').textContent = total;

  // métricas de ejemplo
  document.getElementById('respuestas-web').textContent = 4;
  document.getElementById('respuestas-chatbot').textContent = 2;
  document.getElementById('tiempo-promedio').textContent = "36 min";

  buildCharts(counts);

  // Simulación de tabla (luego puedes cargar de tu Excel)
  const tabla = document.getElementById('tabla-respuestas');
  tabla.innerHTML = `
    <tr><td>Ana García</td><td>Huancayo</td><td>Bus</td><td>45 min</td><td>Web</td></tr>
    <tr><td>Carlos López</td><td>Jauja</td><td>Auto</td><td>30 min</td><td>Chatbot</td></tr>
    <tr><td>María Quispe</td><td>Chupaca</td><td>Bus</td><td>60 min</td><td>Web</td></tr>
    <tr><td>José Mendoza</td><td>Sicaya</td><td>Bicicleta</td><td>25 min</td><td>Web</td></tr>
    <tr><td>Rosa Flores</td><td>Orcotuna</td><td>Caminata</td><td>20 min</td><td>Chatbot</td></tr>
  `;
}

window.addEventListener('load', refresh);
