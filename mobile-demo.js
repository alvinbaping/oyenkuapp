(() => {
  const root = document.querySelector('#mobile-demo');
  const screen = root.querySelector('#md-screen');
  const fan = root.querySelector('#md-fan');
  const cat = root.querySelector('#md-cat');
  const money = n => 'Rp ' + n.toLocaleString('id-ID');
  const wallets = { BCA: 950000, GoPay: 145000, Tunai: 200000 };
  const rows = [
    {name:'Naik ojek', amount:15000, wallet:'GoPay', category:'Transportasi', icon:'transport'},
    {name:'Makan siang', amount:35000, wallet:'Tunai', category:'Makanan & Minuman', icon:'food'},
    {name:'Belanja bulanan', amount:120000, wallet:'BCA', category:'Belanja', icon:'shopping'},
  ];
  const expense = [['Belanja','shopping'],['Hiburan','entertainment'],['Kesehatan','health'],['Lainnya','other'],['Makanan & Minuman','food'],['Pendidikan','education'],['Transportasi','transport']];
  const income = [['Gaji','salary'],['Bisnis','business'],['Hadiah','gift'],['Lainnya','other']];
  const icons = {
    home:'m3 10 9-7 9 7 M5 9v12h14V9 M10 21v-7h4v7',wallet:'M3 6h17v14H3z M3 6l13-3v3 M15 11h6v5h-6z',
    history:'M3 10a9 9 0 1 1 2 8 M3 5v5h5 M12 7v5l4 2',more:'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z',
    manual:'m4 16-1 5 5-1L21 7l-4-4z M14 6l4 4',voice:'M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0z M5 10v1a7 7 0 0 0 14 0v-1 M12 18v4 M8 22h8',
    chat:'M21 11a9 8 0 0 1-9 8H9l-5 3 1-5a9 8 0 1 1 16-6z'
  };
  const labels = {home:'Beranda',wallet:'Dompet',history:'Riwayat',more:'Lainnya',manual:'Manual',voice:'Suara',chat:'Ngobrol'};
  for (const button of root.querySelectorAll('nav [data-page], dialog [data-page]')) {
    const page = button.dataset.page;
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[page]}"/></svg><span>${labels[page]}</span>`;
  }
  const total = () => Object.values(wallets).reduce((sum, n) => sum+n, 0);
  const asset = key => `<img class="md-icon" alt="" src="assets/demo/${key}.webp">`;
  const txList = list => {
    const card = document.createElement('div');
    card.className = 'md-card';
    for (const tx of list) {
      const row = document.createElement('div');
      row.className = 'md-row';
      row.innerHTML = `${asset(tx.icon)}<div><strong></strong><small></small></div><b></b>`;
      row.querySelector('strong').textContent = tx.name;
      row.querySelector('small').textContent = tx.category + ' · ' + tx.wallet;
      const value = row.querySelector('b');
      value.className = tx.income ? 'md-in' : 'md-out';
      value.textContent = (tx.income ? '+' : '−') + money(tx.amount);
      card.append(row);
    }
    return card;
  };
  const add = tx => { rows.unshift(tx); wallets[tx.wallet] += tx.amount * (tx.income ? 1 : -1); };
  const apk = () => '<a class="button md-download" href="#unduh" data-md-download>Unduh Beta Android (.apk) ↓</a>';
  let previousTab = 'home';
  const back = title => `<h2 class="md-title"><button data-page="${previousTab}" aria-label="Kembali">←</button>${title}</h2>`;
  let amount = '';
  let mode = 'expense';
  let chosen = expense[0];


  function render(page, focus = true) {
    if (fan.open) fan.close();
    if (['home','wallet','history','more'].includes(page)) previousTab = page;
    for (const button of root.querySelectorAll('.md-nav [data-page]')) {
      if (button.dataset.page === previousTab) button.setAttribute('aria-current','page');
      else button.removeAttribute('aria-current');
    }
    if (page === 'home') {
      screen.innerHTML = `<div class="md-hero"><small>Total saldo demo</small><strong>${money(total())}</strong></div>
        <div class="md-welcome"><h1>Yuk, coba catat di Oyenku!</h1><button data-open-fan aria-label="Sentuh kepala Oyen"><img src="assets/oyen.png" alt=""></button><p>Pat pat kepalaku, ya!</p></div><h2>Transaksi terbaru</h2>`;
      screen.append(txList(rows.slice(0,3)));
    } else if (page === 'wallet') {
      screen.innerHTML = `<h2>Dompet</h2><div class="md-hero"><small>Total saldo semua dompet</small><strong>${money(total())}</strong></div><h2>Daftar akun & rekening</h2><div class="md-card">${Object.entries(wallets).map(([name, value]) => `<div class="md-row">${asset(name === 'Tunai' ? 'cash' : 'bank')}<div><strong>${name}</strong><small>${name === 'BCA' ? 'Rekening utama' : name === 'GoPay' ? 'E-wallet' : 'Uang tunai'}</small></div><b>${money(value)}</b></div>`).join('')}</div>`;
    } else if (page === 'history') {
      screen.innerHTML = '<h2>Riwayat</h2><label class="md-label">Cari transaksi<input type="search" placeholder="Misalnya, naik ojek"></label><div id="md-history"></div>';
      const results = screen.querySelector('#md-history');
      const search = screen.querySelector('input');
      const filter = () => {
        const found = rows.filter(tx => [tx.name,tx.category,tx.wallet].join(' ').toLowerCase().includes(search.value.trim().toLowerCase()));
        results.replaceChildren(found.length ? txList(found) : document.createTextNode('Transaksi tidak ditemukan.'));
      };
      search.addEventListener('input', filter);
      filter();
    } else if (page === 'more') {
      screen.innerHTML = `<h2>Lainnya</h2>
        <section class="md-card md-more-section"><h3>Tema Oyenku</h3><div class="md-chips" aria-label="Pilih tema">
        ${[['classic','Klasik'],['winter','Winter'],['sakura','Sakura'],['matcha','Matcha'],['senja','Senja']].map(([key,label]) => `<button data-theme-name="${key}" aria-pressed="${(root.dataset.theme || 'classic') === key}">${label}</button>`).join('')}
        </div></section>
        <section class="md-card md-more-section"><h3>Cadangkan &amp; pulihkan</h3><p>Tenang, catatanmu bisa dicadangkan. Simpan ke Google Drive atau ekspor file cadangan lokal di aplikasi.</p></section>
        <section class="md-card md-more-section"><h3>Notifikasi</h3><p>Sebelum jatuh tempo, aku ingetin!</p></section>
        <div class="md-card md-links"><button data-page="voice">Unduh Oyenku <span>›</span></button><a href="privacy.html">Kebijakan privasi <span>›</span></a><a href="terms.html">Ketentuan beta <span>›</span></a></div>`;
    } else if (page === 'voice') {
      screen.innerHTML = `${back('Catat lewat suara')}<div class="md-welcome"><img src="assets/oyen.png" alt=""><h1>Yuk, bisikin Oyen!</h1><p>Coba catat pengeluaran pakai suara di aplikasi Oyenku.</p>${apk()}</div>`;
    } else if (page === 'manual') {
      amount = ''; mode = 'expense'; chosen = expense[0];
      screen.innerHTML = `${back('Catat transaksi')}<form id="md-form"><div class="md-segment"><button type="button" data-mode="expense" aria-pressed="true">Pengeluaran</button><button type="button" data-mode="income" aria-pressed="false">Pemasukan</button></div>
        <div class="md-categories"></div><div class="md-amount"><small>Nominal</small><strong aria-live="polite">Rp 0</strong></div>
        <div class="md-fields"><label class="md-label">Dompet<select name="wallet">${Object.keys(wallets).map(w=>`<option>${w}</option>`).join('')}</select></label>
        <label class="md-label">Nama transaksi<input name="name" placeholder="Misalnya, parkir" maxlength="50" required></label></div>
        <div class="md-keypad">${['1','2','3','4','5','6','7','8','9','000','0','⌫'].map(n=>`<button type="button" data-digit="${n}" ${n==='⌫'?'aria-label="Hapus angka"':''}>${n}</button>`).join('')}</div><p class="md-error" role="alert"></p><button class="button" type="submit">Simpan transaksi demo</button></form>`;
      categories();
    } else if (page === 'chat') {
      screen.innerHTML = `${back('Ngobrol sama Oyen')}<div class="md-thread" aria-live="polite"><p class="md-bubble">Mau catat atau tanya pengeluaranmu?</p></div><div class="md-prompts"><button data-prompt="coffee">Kopi 25 ribu pakai BCA</button><button data-prompt="insight">Aku paling boros buat apa?</button></div>`;
    }
    if (focus) { window.scrollTo(0,0); screen.focus({preventScroll:true}); }
  }
  function categories() {
    screen.querySelector('.md-categories').innerHTML = (mode === 'expense' ? expense : income)
      .map(([name, icon])=>`<button type="button" data-category="${icon}" aria-pressed="${chosen[1]===icon}">${asset(icon)}${name}</button>`).join('');
  }
  function chat(prompt) {
    const thread = screen.querySelector('.md-thread');
    const bubble = document.createElement('p');
    bubble.className = 'md-bubble md-user';
    bubble.textContent = prompt.textContent;
    thread.append(bubble);
    const reply = document.createElement('div');
    reply.className = 'md-bubble';
    if (prompt.dataset.prompt === 'coffee') {
      reply.innerHTML = '<strong>Kopi · Rp 25.000</strong><small>Makanan &amp; Minuman · BCA</small><button class="button" data-save-coffee>Simpan draf</button>';
    } else {
      const groups = new Map();
      for (const tx of rows.filter(tx=>!tx.income)) groups.set(tx.category, (groups.get(tx.category) || 0) + tx.amount);
      const ranking = [...groups].sort((a,b)=>b[1]-a[1]);
      const sum = ranking.reduce((n, entry)=>n+entry[1],0);
      const [name, value] = ranking[0];
      const title = document.createElement('strong');
      title.textContent = name + ' paling besar';
      const detail = document.createElement('p');
      detail.textContent = money(value) + ' dari ' + money(sum) + ' pengeluaran demo (' + Math.round(value/sum*100) + '%).';
      reply.append(title, detail);
      for (const [category, cost] of ranking.slice(0,3)) {
        const label = document.createElement('small');
        label.textContent = category + ' · ' + money(cost);
        const bar = document.createElement('progress');
        bar.max = sum; bar.value = cost; bar.setAttribute('aria-label', label.textContent);
        reply.append(label, bar);
      }
    }
    thread.append(reply);
    reply.scrollIntoView({block:'nearest'});
  }
  root.addEventListener('click', event => {
    const button = event.target.closest('button, [data-md-download]');
    if (event.target === fan) fan.close();
    if (!button) return;
    if (button === cat || button.hasAttribute('data-open-fan')) {
      if (!fan.open) { fan.showModal(); cat.setAttribute('aria-expanded','true'); }
    } else if (button.dataset.page) render(button.dataset.page);
    else if (button.dataset.themeName) {
      root.dataset.theme = button.dataset.themeName;
      for (const option of screen.querySelectorAll('[data-theme-name]')) {
        option.setAttribute('aria-pressed', String(option === button));
      }
    } else if (button.dataset.mode) {
      mode = button.dataset.mode; chosen = (mode === 'expense' ? expense : income)[0];
      for (const option of screen.querySelectorAll('[data-mode]')) option.setAttribute('aria-pressed', String(option===button));
      categories();
    } else if (button.dataset.category) {
      chosen = (mode === 'expense' ? expense : income).find(item=>item[1]===button.dataset.category);
      for (const option of screen.querySelectorAll('[data-category]')) option.setAttribute('aria-pressed',String(option===button));
    } else if (button.dataset.digit) {
      const digit = button.dataset.digit;
      amount = digit === '⌫' ? amount.slice(0,-1) : (amount+digit).replace(/^0+/,'').slice(0,9);
      screen.querySelector('.md-amount strong').textContent = money(Number(amount));
      screen.querySelector('.md-error').textContent = '';
    } else if (button.dataset.prompt) chat(button);
    else if (button.hasAttribute('data-save-coffee')) {
      add({name:'Kopi',amount:25000,wallet:'BCA',category:'Makanan & Minuman',icon:'food'});
      button.replaceWith(document.createTextNode('Tersimpan di Riwayat.'));
    }
  });
  fan.addEventListener('close', () => cat.setAttribute('aria-expanded','false'));
  root.addEventListener('submit', event => {
    if (event.target.id !== 'md-form') return;
    event.preventDefault();
    const form = new FormData(event.target);
    const name = form.get('name').trim();
    if (!Number(amount) || !name) {
      screen.querySelector('.md-error').textContent = 'Isi nama transaksi dan nominal lebih dari nol.';
      return;
    }
    add({name, amount:Number(amount), wallet:form.get('wallet'), category:chosen[0], icon:chosen[1], income:mode==='income'});
    render('history');
  });
  function applyDownload() {
    const url = document.querySelector('#release-link')?.getAttribute('href');
    for (const link of root.querySelectorAll('[data-md-download]')) {
      link.href = url || 'https://github.com/alvinbaping/oyenkuapp/releases';
    }
  }
  new MutationObserver(applyDownload).observe(document.querySelector('#release-link'), {attributes:true, attributeFilter:['href']});
  const open = () => { render(location.hash === '#unduh' ? 'voice' : 'home', false); applyDownload(); };
  root.addEventListener('click', applyDownload);
  open();
})();
