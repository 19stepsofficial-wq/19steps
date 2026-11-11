// 19 Steps · หน้าแรก: ท้องฟ้าเปลี่ยนตามเวลา · หนึ่งวัน · แบบฝึก 9 แบบ · หมู่บ้าน · มุมพักใจ (เล่นได้จริง) · ลงชื่อรอเปิดตัว
// ไม่พึ่งไลบรารีภายนอก: ใช้ position:sticky + คำนวณจากตำแหน่งการเลื่อน
(function () {
  var SB_URL = 'https://hghszllcnswhhfsezhhe.supabase.co';
  var SB_KEY = 'sb_publishable_ug1kF7jw9LI42IqKEJfYUQ_fpIzppnp'; // publishable key เปิดเผยได้ (หน้าเว็บเรียกได้แค่ join_waitlist)
  var root = document.documentElement;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var th = function () { return root.lang !== 'en'; };
  var T = function (a, b) { return th() ? a : b; };

  // ---------- ลงชื่อรอเปิดตัว ----------
  var form = $('.wl'), input = $('#wl-email'), msg = $('.wl-msg');
  var TXT = {
    ok: ['ลงชื่อแล้ว เราจะส่งข่าวไปที่อีเมลนี้วันเปิดตัว', "You're on the list. We'll email you on launch day."],
    already: ['อีเมลนี้ลงชื่อไว้แล้ว รอรับข่าวได้เลย', 'This email is already on the list.'],
    bad: ['รูปแบบอีเมลไม่ถูกต้อง ลองตรวจอีกครั้ง', "That email doesn't look right. Please check it."],
    busy: ['ตอนนี้มีคนลงชื่อพร้อมกันเยอะ ลองใหม่ในอีกไม่กี่นาที', 'Lots of sign-ups right now. Please try again in a few minutes.'],
    fail: ['ส่งไม่สำเร็จ ตรวจอินเทอร์เน็ตแล้วลองใหม่', "Couldn't send. Check your connection and try again."],
  };
  var say = function (k) { msg.textContent = T(TXT[k][0], TXT[k][1]); msg.className = 'wl-msg' + (k === 'ok' || k === 'already' ? '' : ' err'); };
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return say('bad');
    var btn = $('button', form);
    btn.disabled = true;
    fetch(SB_URL + '/rest/v1/rpc/join_waitlist', {
      method: 'POST',
      headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_email: email, p_lang: th() ? 'th' : 'en', p_hp: form.website.value }),
    })
      .then(function (r) { return r.ok ? r.json() : 'fail'; })
      .then(function (r) { say(TXT[r] ? r : 'fail'); if (r === 'ok' || r === 'already') input.value = ''; })
      .catch(function () { say('fail'); })
      .then(function () { btn.disabled = false; });
  });

  // ---------- มุมพักใจ: ลองเล่นได้จริง (ไม่บันทึกที่ไหน) ----------
  var tabs = $$('.tabs button'), panes = $$('.pane');
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      tabs.forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
      panes.forEach(function (p) { p.classList.toggle('on', p.dataset.p === b.dataset.t); });
    });
  });
  var chipText = function (c) { return $('[data-l=' + (th() ? 'th' : 'en') + ']', c).textContent; };
  // ลำธาร: ใบไม้พาเรื่องที่ค้างใจไหลไปตามน้ำ
  var stream = $('[data-p=stream]'), leaves = $('.leaves', stream), sIn = $('input', stream);
  var floatAway = function (t) {
    if (!t) return;
    var l = document.createElement('div');
    l.className = 'leaf';
    l.textContent = '🍃 ' + t;
    l.style.left = 38 + Math.random() * 24 + '%';
    leaves.appendChild(l);
    setTimeout(function () { l.remove(); }, 8200);
  };
  $$('.chip', stream).forEach(function (c) { c.addEventListener('click', function () { floatAway(chipText(c)); }); });
  $('form', stream).addEventListener('submit', function (e) { e.preventDefault(); floatAway(sIn.value.trim()); sIn.value = ''; });
  // เตาย่าง: วางเรื่องบนเตาได้เรื่อย ๆ แล้วกด "ย่างเลย"
  var grill = $('[data-p=grill]'), pile = $('.pile', grill), smoke = $('.smoke', grill), gMsg = $('.pane-msg', grill), gIn = $('input', grill), fire = $('.fire', grill);
  var put = function (t) {
    if (!t || pile.children.length >= 8) return;
    gMsg.textContent = '';
    var g = document.createElement('span');
    g.className = 'tag';
    g.textContent = t;
    g.style.transform = 'rotate(' + (Math.random() * 10 - 5).toFixed(1) + 'deg)';
    pile.appendChild(g);
  };
  $$('.chip', grill).forEach(function (c) { c.addEventListener('click', function () { put(chipText(c)); }); });
  $('form', grill).addEventListener('submit', function (e) { e.preventDefault(); put(gIn.value.trim()); gIn.value = ''; });
  fire.addEventListener('click', function () {
    var tags = $$('.tag', pile);
    if (!tags.length) { gMsg.textContent = T('วางเรื่องที่ค้างใจบนเตาก่อน', 'Put something on the grill first'); return; }
    fire.disabled = true;
    gMsg.textContent = T('หายใจออกยาว ๆ … มองมันมอดไหม้ไป', 'Breathe out slowly… watch it burn away');
    tags.forEach(function (g, i) { setTimeout(function () { g.classList.add('burn'); }, 300 + i * 350); });
    for (var i = 0; i < 18; i++) {
      (function (i) {
        setTimeout(function () {
          var p = document.createElement('span');
          p.className = 'puff' + (i % 3 === 0 ? ' f' : '');
          if (i % 3 === 0) p.textContent = '🔥';
          p.style.setProperty('--dx', (Math.random() * 80 - 40).toFixed(0) + 'px');
          p.style.left = (Math.random() * 60 - 30).toFixed(0) + 'px';
          smoke.appendChild(p);
          setTimeout(function () { p.remove(); }, 2700);
        }, i * 180);
      })(i);
    }
    setTimeout(function () {
      pile.innerHTML = '';
      fire.disabled = false;
      gMsg.textContent = T('ย่างจนมอดหมดแล้ว ปล่อยวางได้แล้วนะ', "It's all burned away. You can let it go now.");
    }, 300 + tags.length * 350 + 2500);
  });
  // ดาวขอบคุณ: แตะท้องฟ้าเพื่อจุดดาว
  var starsP = $('[data-p=stars]'), tap = $('.sky-tap', starsP), stIn = $('input', starsP), stN = $('.star-n', starsP), nStars = 0;
  var light = function (x, y, t) {
    var s = document.createElement('div');
    s.className = 'star';
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    if (t) { var l = document.createElement('span'); l.textContent = t; s.appendChild(l); if (x > tap.clientWidth * 0.55) { l.style.left = 'auto'; l.style.right = '14px'; } }
    tap.appendChild(s);
    nStars++;
    stN.textContent = '✨ ' + nStars;
  };
  tap.addEventListener('click', function (e) {
    var r = tap.getBoundingClientRect();
    light(e.clientX - r.left, e.clientY - r.top, stIn.value.trim() || T('ขอบคุณ', 'Thank you'));
    stIn.value = '';
  });
  $('form', starsP).addEventListener('submit', function (e) { e.preventDefault(); light(tap.clientWidth * (0.2 + Math.random() * 0.6), tap.clientHeight * (0.15 + Math.random() * 0.5), stIn.value.trim() || T('ขอบคุณ', 'Thank you')); stIn.value = ''; });

  var ph = function () {
    input.placeholder = T('อีเมลของคุณ', 'Your email');
    sIn.placeholder = T('เขียนเรื่องที่ค้างใจ…', "What's weighing on you…");
    gIn.placeholder = T('เขียนเรื่องที่ค้างใจ…', "What's weighing on you…");
    stIn.placeholder = T('วันนี้ขอบคุณเรื่องอะไร…', 'Grateful today for…');
  };
  ph();

  // ---------- การเคลื่อนไหวตามการเลื่อน ----------
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('still');
    new MutationObserver(ph).observe(root, { attributes: true, attributeFilter: ['lang'] });
    return;
  }

  // ท้องฟ้า: สีบน · สีล่าง · ดวงอาทิตย์/จันทร์ (ตำแหน่ง %จอ) · ดาว
  var SKY = {
    dawn: ['#F6D7B4', '#FDF1E1', '#FFE3A3', 14, 64, 0],
    morning: ['#BFE3F2', '#F3F7EA', '#FFF4CF', 26, 26, 0],
    bright: ['#A7D8F0', '#EEF6E6', '#FFF8DE', 40, 16, 0],
    noon: ['#93CDEB', '#E8F3E2', '#FFFBEA', 56, 12, 0],
    gold: ['#F7D9A3', '#FDF3E0', '#FFD77E', 72, 30, 0],
    sunset: ['#A592C9', '#F4B994', '#FF9F6E', 86, 58, 0],
    night: ['#16213F', '#2B3C6B', '#F4F1E4', 80, 18, 1],
  };
  var bar = $('.bar'), meta = $('meta[name=theme-color]'), orb = $('.orb');
  var cur = '';
  var setSky = function (k) {
    if (k === cur) return;
    var s = SKY[k], prev = cur;
    cur = k;
    var colorsOnly = function () {
      root.style.setProperty('--sky1', s[0]);
      root.style.setProperty('--sky2', s[1]);
      root.style.setProperty('--orb', s[2]);
      root.style.setProperty('--stars', s[5]);
    };
    var move = function () { root.style.setProperty('--orbx', s[3] + 'vw'); root.style.setProperty('--orby', s[4] + 'vh'); };
    colorsOnly();
    // พระอาทิตย์ตก ↔ กลางคืน: ซ่อนดวงก่อนย้าย (จะได้ไม่วิ่งข้ามฟ้า)
    if (prev && (prev === 'night') !== (k === 'night')) {
      orb.style.opacity = 0;
      setTimeout(function () { if (cur !== k) return; move(); setTimeout(function () { orb.style.opacity = 1; }, 400); }, 700);
    } else move();
    bar.classList.toggle('dark', k === 'night');
    meta.setAttribute('content', s[0]);
  };
  setSky('dawn');

  var day = $('.day'), stage = $('.stage'), phone = $('.phone');
  var scr = $$('.scr'), notes = $$('.note'), tl = $$('.timeline li');
  var times = ['morning', 'bright', 'noon', 'sunset', 'night'];
  var build = $('.build'), track = $('.track');
  var vil = $('.village'), vbg = $$('.v-bg'), vcard = $$('.v-card'), vdot = $$('.v-dots li'), vpts = $('.v-pts');
  var home = $('.home'), bg = $('.home-bg'), scene = $('.home-scene'), jon = $('.actor.jon'), jonS = $('.sprite', jon);
  var tog = $('.together'), whos = $$('.who'), cnt = $('.count .n'), ring = $('.ring');
  var sections = [['.hero', 'dawn'], ['.build', 'morning'], ['.village', 'noon'], ['.home', 'gold'], ['.calm', 'sunset'], ['.together', 'sunset'], ['.plans', 'sunset'], ['.join', 'night'], ['.faq', 'night']]
    .map(function (x) { return [$(x[0]), x[1]]; });

  var H = 0, ps = 1, dist = 0, at = -1, vat = -1, lastY = window.scrollY, nap;
  var layout = function () {
    H = window.innerHeight;
    dist = Math.max(0, track.scrollWidth - window.innerWidth);
    build.style.height = H + dist + 'px';
    // จอมือถือ: ย่อทั้งเครื่องให้พอดีพื้นที่ (เนื้อหาในจอยังเป็นสัดส่วนเดิม)
    phone.style.marginBottom = '';
    ps = 1;
    if (window.innerWidth < 820) {
      ps = Math.min(1, (H * 0.56) / phone.offsetHeight);
      phone.style.marginBottom = -phone.offsetHeight * (1 - ps) + 'px';
    }
  };
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var pick = function (lists, i) { lists.forEach(function (list) { list.forEach(function (el, k) { el.classList.toggle('on', k === i); }); }); };
  var countUp = function (to) {
    var from = Number(vpts.textContent) || 0, t0 = performance.now();
    var step = function (t) { var p = Math.min(1, (t - t0) / 900); vpts.textContent = Math.round(from + (to - from) * p); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  var PTS = [120, 114, 34, 0];

  var frame = function () {
    var y = window.scrollY, dir = y < lastY ? -1 : 1;
    lastY = y;
    // หนึ่งวัน
    var dt = day.getBoundingClientRect().top, dlen = day.offsetHeight - H;
    var dp = clamp(-dt / dlen);
    var i = Math.min(4, Math.floor(dp * 5));
    if (i !== at) { at = i; pick([scr, notes, tl], i); stage.classList.toggle('is-night', i === 4); }
    var amp = window.innerWidth < 820 ? 0.3 : 1;
    phone.style.transform = 'scale(' + ps.toFixed(3) + ') rotate(' + ((-3 + dp * 6) * amp).toFixed(2) + 'deg) translateY(' + ((30 - dp * 50) * amp).toFixed(1) + 'px)';
    // แบบฝึก 9 แบบ
    var bp = clamp(-build.getBoundingClientRect().top / Math.max(1, dist));
    track.style.transform = 'translateX(' + (-bp * dist).toFixed(1) + 'px)';
    // หมู่บ้าน: 4 ฉาก
    var vt = vil.getBoundingClientRect().top, vp = clamp(-vt / (vil.offsetHeight - H));
    var vi = Math.min(3, Math.floor(vp * 4));
    if (vi !== vat && vt < H * 0.6) { vat = vi; pick([vbg, vcard, vdot], vi); countUp(PTS[vi]); }
    // บ้าน: ฉากเลื่อนช้ากว่า · ไอจอนเดินตามการเลื่อน หยุดแล้วนอน
    var hr = home.getBoundingClientRect();
    bg.style.transform = 'translateY(' + (-5 + clamp((H - hr.top) / (H + hr.height)) * 10).toFixed(2) + '%)';
    var sr = scene.getBoundingClientRect();
    if (sr.top < H && sr.bottom > 0) {
      var sp = clamp((H * 0.85 - sr.top) / (sr.height + H * 0.7));
      jon.style.transform = 'translateX(' + (sp * (scene.clientWidth - jonS.offsetWidth) * 0.62).toFixed(1) + 'px) scaleX(' + dir + ')';
      if (jonS.className.indexOf('jon-walk') < 0) jonS.className = 'sprite jon-walk';
      clearTimeout(nap);
      nap = setTimeout(function () { jonS.className = 'sprite jon-roll'; nap = setTimeout(function () { jonS.className = 'sprite jon-sleep'; }, 2800); }, 600);
    }
    // ฝึกร่วมกัน: เพื่อนเข้าวงทีละคน
    var tr = tog.getBoundingClientRect();
    var tp = clamp((H * 0.75 - tr.top) / (tr.height * 0.6));
    var k = Math.round(tp * whos.length);
    whos.forEach(function (w, j) { w.classList.toggle('in', j < k); });
    cnt.textContent = Math.max(1, k);
    ring.style.transform = 'rotate(' + (tp * 120).toFixed(1) + 'deg)';
    // ท้องฟ้า
    if (dt <= 0 && dt > -dlen) setSky(times[at]);
    else {
      var mid = H * 0.5, s = null;
      sections.forEach(function (x) { var r = x[0].getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) s = x[1]; });
      if (!s && dt > 0) s = 'dawn';
      if (s) setSky(s);
    }
  };
  var ticking = false;
  var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; frame(); }); } };
  layout();
  frame();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { layout(); frame(); });
  window.addEventListener('load', function () { layout(); frame(); });
  new MutationObserver(function () { ph(); layout(); frame(); }).observe(root, { attributes: true, attributeFilter: ['lang'] });
})();
