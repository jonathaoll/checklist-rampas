(function(){
  // bad = resposta que indica não conformidade
  const itens = [
    { id:"alca",   txt:"Alça lateral",                     bad:"N" },
    { id:"param",  txt:"Parafusos devidamente apertados",  bad:"N" },
    { id:"rlat",   txt:"Rachaduras na lateral",            bad:"S" },
    { id:"rest",   txt:"Rachaduras na estrutura",          bad:"S" },
    { id:"comp",   txt:"Estrutura física comprometida",    bad:"S" }
  ];
  const $ = id => document.getElementById(id);
  const box = $('items');
  itens.forEach(it => {
    const d = document.createElement('div');
    d.className = 'item';
    d.innerHTML = `<span>${it.txt}</span><div class="sn">
      <input type="radio" name="${it.id}" id="${it.id}S" value="S"><label for="${it.id}S">S</label>
      <input type="radio" name="${it.id}" id="${it.id}N" value="N"><label for="${it.id}N">N</label></div>`;
    box.appendChild(d);
  });

  const hoje = new Date();
  $('date').value = hoje.getFullYear() + '-' + String(hoje.getMonth()+1).padStart(2,'0') + '-' + String(hoje.getDate()).padStart(2,'0');

  function gerar() {
    const msg = $('msg'); msg.textContent = '';
    const tag = $('tag').value.trim();
    if (!tag) { msg.textContent = 'Informe a Tag/Numeração da rampa.'; return; }
    const resp = {};
    for (const it of itens) {
      const sel = document.querySelector(`input[name="${it.id}"]:checked`);
      if (!sel) { msg.textContent = 'Responda S ou N em: ' + it.txt + '.'; return; }
      resp[it.id] = sel.value;
    }
    const data = $('date').value.split('-').reverse().join('/');
    const nota = $('note').value.trim();
    const falhas = itens.filter(it => resp[it.id] === it.bad).map(it => it.txt);

    let t = `*🛠️ Checklist Rampa Móvel Dobrável*\n\nData: ${data}\nTag/Nº da rampa: ${tag.toUpperCase()}\n\n`;
    itens.forEach(it => { t += `- ${it.txt}: ${resp[it.id]}\n`; });
    t += `\n*📝 Algo para sinalizar:* ${nota || 'Nada a sinalizar'}\n`;
    t += falhas.length
      ? `\n*⚠️ Não conformidades:*\n${falhas.map(f => '• ' + f).join('\n')}`
      : `\n*✅ Rampa sem não conformidades*`;
    $('output').value = t;
    $('copy').disabled = false;
  }

  $('generate').addEventListener('click', gerar);
  $('copy').addEventListener('click', function(){
    const out = $('output');
    const ok = () => { $('msg').textContent = ''; alert('Texto copiado!'); };
    const fallback = () => { out.select(); try { document.execCommand('copy'); ok(); } catch(e) { $('msg').textContent = 'Selecione o texto e copie manualmente.'; } };
    try { navigator.clipboard.writeText(out.value).then(ok, fallback); } catch(e) { fallback(); }
  });
})();
