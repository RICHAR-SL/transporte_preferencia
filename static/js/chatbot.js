const root = document.getElementById('chatbot-root');
root.innerHTML = `
<div class="input-row"><input id="nombre" placeholder="Nombre" required></div>
<div class="input-row"><input id="apellido" placeholder="Apellido" required></div>
<div class="input-row"><select id="escuela"><option value="">-- Escuela --</option><option value="UN">Universidad Nacional</option><option value="PUCP">PUCP</option><option value="Senati">Senati</option></select></div>
<div class="input-row">
<label>Medio de transporte</label>
<select id="transporte">
<option value="Bus">Bus</option>
<option value="Bicicleta">Bicicleta</option>
<option value="Auto">Auto</option>
<option value="Caminando">Caminando</option>
<option value="Otro">Otro</option>
</select>
</div>
<div class="input-row"><textarea id="comentario" placeholder="Comentario (opcional)"></textarea></div>
<div><button id="btn-send">Enviar</button></div>
<div id="chat-status" style="margin-top:0.5rem"></div>
`;


document.getElementById('btn-send').addEventListener('click', async ()=>{
const payload = {
nombre: document.getElementById('nombre').value,
apellido: document.getElementById('apellido').value,
escuela: document.getElementById('escuela').value,
transporte: document.getElementById('transporte').value,
comentario: document.getElementById('comentario').value
};
const status = document.getElementById('chat-status');
status.textContent = 'Enviando...';
const res = await fetch('/api/submit', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
const j = await res.json();
if(j.status === 'ok'){
status.textContent = 'Gracias — respuesta guardada';
// refrescar gráficos
const ev = new Event('click');
document.getElementById('btn-refresh').dispatchEvent(ev);
} else {
status.textContent = 'Error al enviar';
}
});