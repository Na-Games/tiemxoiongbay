/* Bản đồ chương: lộ trình có đường đi, mỗi chương một màu riêng, số ngày trả nợ tăng dần */
UI.register('chapters', {
  enter(root, p) {
    const diff = p.diff, d = DATA.DIFF[diff], open = Save.root.chap[diff], list = DATA.chapters(diff), total = list.length;
    const fresh = Save.root.newChap && Save.root.newChap.diff === diff ? Save.root.newChap.n : 0;
    const maxDays = list[total - 1].days, minDays = list[0].days;
    const doneN = Math.min(total, open - 1);
    root.innerHTML = `<canvas class="pix scene-full dim"></canvas>
      <div class="chap cmap diff-${diff}">
        <div class="chap-top">
          <button class="btn mini gray chap-back">◀</button>
          <div class="chap-title"><b>Hành trình xôi Ông Bảy</b><small>Độ khó <i class="cm-diff">${d.name}</i> · ${total} chương · ${minDays} → ${maxDays} ngày trả nợ</small></div>
        </div>
        <div class="cm-prog"><div class="cm-bar"><i style="width:${(doneN / total) * 100}%"></i></div><span>${doneN}/${total} chương hoàn thành</span></div>
        <div class="chap-list cm-list"></div>
      </div>`;
    const cv = $('canvas', root), sc = Scenes.title(cv), tick = Loop.add((dt) => sc.update(dt));
    $('.chap-back', root).onclick = () => UI.go('title');
    const box = $('.cm-list', root);
    list.forEach((ch, i) => {
      const locked = ch.id > open, now = ch.id === open, done = ch.id < open;
      const debt = Math.round((d.debt * ch.debt) / 50000) * 50000;
      const row = el('div', 'cm-row ' + (locked ? 'locked' : now ? 'now' : 'done') + (ch.id === fresh ? ' fresh' : ''));
      row.style.setProperty('--c1', ch.pal[0]); row.style.setProperty('--c2', ch.pal[1]);
      row.style.animationDelay = Math.min(i, 8) * 0.07 + 's';
      const pct = Math.round(((ch.days - minDays + 1) / (maxDays - minDays + 1)) * 100);
      row.innerHTML = `<div class="cm-rail"><span class="cm-dot">${locked ? '🔒' : done ? '✔' : ch.id}</span></div>
        <div class="cm-card">
          <div class="cm-art"><span>${locked ? '❔' : ch.icon}</span><i class="s1"></i><i class="s2"></i><i class="s3"></i></div>
          <div class="cm-info">
            <div class="cm-top"><small>Chương ${ch.id}</small><em>${ch.venue === 'shop' ? '🏪 Cửa hàng' : '🛺 Bán chợ'}</em></div>
            <b>${locked ? 'Chưa mở khóa' : ch.name}</b>
            ${locked ? `<span class="cm-lock">Hoàn thành chương ${ch.id - 1} để mở khóa</span>` : `<div class="cm-stats"><span class="d">⏳ ${ch.days} ngày</span><span class="m">💰 Nợ ${fmtK(debt)}</span><span class="v">🏦 Vốn ${fmtK(ch.seed)}</span><span class="c">👥 ×${ch.cust}</span></div>
            <div class="cm-days"><i style="width:${pct}%"></i></div><div class="cm-scn">${ch.scn.icon} ${ch.scn.name}</div>`}
          </div>
          <div class="cm-go">${locked ? '' : done ? '★' : '▶'}</div>
          ${ch.id === fresh ? '<div class="cn-new">MỚI</div>' : ''}
        </div>`;
      if (!locked) {
        $('.cm-card', row).onclick = () => {
          const body = el('div', 'howto');
          body.innerHTML = `<p style="text-align:center;font-size:2.4em;margin:0">${ch.icon}</p><p>${ch.desc}</p>
            <p>📅 <b>${ch.days} ngày</b> · 💰 Nợ <b>${fmt(debt)}</b> · 👥 Khách <b>×${ch.cust}</b></p>
            <p>🏦 Vốn ông cấp mỗi sáng: <b>${fmt(ch.seed)}</b></p>
            <p>${ch.scn.icon} Kịch bản: <b>${ch.scn.name}</b>. ${ch.scn.desc}</p>
            <p>${Campaign.venueNote(ch)}</p>
            ${DATA.STAFF.filter((s) => s.ch === ch.id).map((s) => '<p>👥 Mở khóa nhân viên: <b>' + s.name + '</b> (' + s.role + ')</p>').join('')}
            ${ch.id > 1 && Save.root.carry[diff] ? '<p>🎒 Giữ lại <b>nâng cấp, nhân viên và công thức</b> từ chương trước.</p>' : ''}
            <p>🎁 Hoàn thành: <b>${ch.reward}</b></p>`;
          UI.modal({ title: 'Chương ' + ch.id + ': ' + ch.name, body, dismiss: true, buttons: [{ label: 'Quay lại', cls: 'gray' }, { label: 'Bắt đầu ➜', cls: 'red', onClick: () => { Campaign.start(diff, ch.id); } }] });
        };
      }
      box.appendChild(row);
    });
    if (fresh) { Save.root.newChap = null; Save.save(); Sound.sfx('level'); setTimeout(() => UI.burst(240, 260, 'confetti', 34), 500); }
    Sound.ambient('night'); if (Sound.ctx) Sound.playMusic();
    const cur = $('.cm-row.now, .cm-row.fresh', box); if (cur) setTimeout(() => cur.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300);
    return () => Loop.remove(tick);
  },
});
