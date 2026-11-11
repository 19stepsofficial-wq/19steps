// 19 Steps · หน้าแรก: ท้องฟ้าเปลี่ยนตามเวลา · หนึ่งวันแบบปักหน้าจอ · แถบแบบฝึกเลื่อนแนวนอน · ลงชื่อรอเปิดตัว
// ไม่พึ่งไลบรารีภายนอก: ใช้ position:sticky + คำนวณจากตำแหน่งการเลื่อน
(function () {
  var SB_URL = 'https://hghszllcnswhhfsezhhe.supabase.co';
  var SB_KEY = 'sb_publishable_ug1kF7jw9LI42IqKEJfYUQ_fpIzppnp'; // publishable key เปิดเผยได้ (หน้าเว็บเรียกได้แค่ join_waitlist)
  var root = document.documentElement;
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var th = function () { return root.lang !== 'en'; };

  // ---------- ลงชื่อรอเปิดตัว ----------
  var form = $('.wl'), input = $('#wl-email'), msg = $('.wl-msg');
  var ph = function () { input.placeholder = th() ? 'อีเมลของคุณ' : 'Your email'; };
  ph();
  var TXT = {
    ok: ['ลงชื่อแล้ว เราจะส่งข่าวไปที่อีเมลนี้วันเปิดตัว', "You're on the list. We'll email you on launch day."],
    already: ['อีเมลนี้ลงชื่อไว้แล้ว รอรับข่าวได้เลย', 'This email is already on the list.'],
    bad: ['รูปแบบอีเมลไม่ถูกต้อง ลองตรวจอีกครั้ง', "That email doesn't look right. Please check it."],
    busy: ['ตอนนี้มีคนลงชื่อพร้อมกันเยอะ ลองใหม่ในอีกไม่กี่นาที', 'Lots of sign-ups right now. Please try again in a few minutes.'],
    fail: ['ส่งไม่สำเร็จ ตรวจอินเทอร์เน็ตแล้วลองใหม่', "Couldn't send. Check your connection and try again."],
  };
  var say = function (k) { msg.textContent = TXT[k][th() ? 0 : 1]; msg.className = 'wl-msg' + (k === 'ok' || k === 'already' ? '' : ' err'); };
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return say('bad');
    var btn = form.querySelector('button');
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

  // ---------- การเคลื่อนไหว ----------
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { root.classList.add('still'); return; }

  // ท้องฟ้า: สีบน · สีล่าง · ดวงอาทิตย์/จันทร์ (ตำแหน่ง %จอ) · ดาว
  var SKY = {
    dawn: ['#F3C9A9', '#FCEBDD', '#FFE3A3', 14, 64, 0],
    morning: ['#A6D9F1', '#EEF7F6', '#FFF4CF', 26, 26, 0],
    bright: ['#8DCFEF', '#E2F3F7', '#FFF8DE', 40, 16, 0],
    noon: ['#76C2EA', '#D8EFF6', '#FFFBEA', 56, 12, 0],
    gold: ['#F6CF98', '#FDF0DD', '#FFD77E', 72, 30, 0],
    sunset: ['#9C86C6', '#F4B08E', '#FF9F6E', 86, 58, 0],
    night: ['#121C36', '#283A69', '#F4F1E4', 80, 18, 1],
  };
  var bar = $('.bar'), meta = $('meta[name=theme-color]'), orb = $('.orb');
  var cur = '';
  var setSky = function (k) {
    if (k === cur) return;
    var s = SKY[k], prev = cur;
    cur = k;
    var apply = function () {
      root.style.setProperty('--sky1', s[0]);
      root.style.setProperty('--sky2', s[1]);
      root.style.setProperty('--orb', s[2]);
      root.style.setProperty('--orbx', s[3] + 'vw');
      root.style.setProperty('--orby', s[4] + 'vh');
      root.style.setProperty('--stars', s[5]);
    };
    // พระอาทิตย์ตก ↔ กลางคืน: ซ่อนดวงก่อนย้าย (จะได้ไม่วิ่งข้ามฟ้า)
    if ((prev === 'night') !== (k === 'night') && prev) {
      orb.style.opacity = 0;
      setTimeout(function () { if (cur !== k) return; apply(); orb.style.opacity = 1; }, 700);
      root.style.setProperty('--sky1', s[0]);
      root.style.setProperty('--sky2', s[1]);
      root.style.setProperty('--stars', s[5]);
    } else apply();
    bar.classList.toggle('dark', k === 'night');
    meta.setAttribute('content', s[0]);
  };
  setSky('dawn');

  var day = $('.day'), stage = $('.stage'), phone = $('.phone'), roll = $('.clock-roll');
  var scr = $$('.scr'), notes = $$('.note'), dots = $$('.dots i');
  var times = ['morning', 'bright', 'noon', 'sunset', 'night'];
  var build = $('.build'), track = $('.track');
  var home = $('.home'), bg = $('.home-bg'), scene = $('.home-scene'), jon = $('.actor.jon'), jonS = jon.querySelector('.sprite');
  var tog = $('.together'), whos = $$('.who'), cnt = $('.count .n'), ring = $('.ring');
  var clock = $('.hero-clock');
  var sections = [['.hero', 'dawn'], ['.build', 'morning'], ['.home', 'gold'], ['.together', 'gold'], ['.plans', 'sunset'], ['.join', 'night'], ['.faq', 'night']]
    .map(function (x) { return [$(x[0]), x[1]]; });

  var H = 0, ps = 1, dist = 0, at = -1, lastY = window.scrollY, nap;
  var layout = function () {
    H = window.innerHeight;
    dist = Math.max(0, track.scrollWidth - window.innerWidth);
    build.style.height = H + dist + 'px';
    // จอมือถือ: ย่อทั้งเครื่องให้พอดีพื้นที่ (เนื้อหาในจอยังเป็นสัดส่วนเดิม)
    phone.style.marginBottom = '';
    ps = 1;
    if (window.innerWidth < 820) {
      ps = Math.min(1, (H * 0.58) / phone.offsetHeight);
      phone.style.marginBottom = -phone.offsetHeight * (1 - ps) + 'px';
    }
  };
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var top = function (el) { return el.getBoundingClientRect().top; };

  var show = function (i) {
    if (i === at) return;
    at = i;
    [scr, notes, dots].forEach(function (list) { list.forEach(function (el, k) { el.classList.toggle('on', k === i); }); });
    roll.style.transform = 'translateY(' + -i + 'em)';
    stage.classList.toggle('is-night', i === 4);
  };

  var frame = function () {
    var y = window.scrollY, dir = y < lastY ? -1 : 1;
    lastY = y;
    // เปิดฉาก
    clock.style.transform = 'translateY(calc(-58% + ' + y * 0.35 + 'px))';
    // หนึ่งวัน
    var dt = top(day), dlen = day.offsetHeight - H;
    var dp = clamp(-dt / dlen);
    var inDay = dt <= H * 0.5 && dt > -dlen - H * 0.5;
    show(Math.min(4, Math.floor(dp * 5)));
    var amp = window.innerWidth < 820 ? 0.3 : 1;
    phone.style.transform = 'scale(' + ps.toFixed(3) + ') rotate(' + ((-3 + dp * 6) * amp).toFixed(2) + 'deg) translateY(' + ((30 - dp * 50) * amp).toFixed(1) + 'px)';
    // แบบฝึก 9 แบบ
    var bp = clamp(-top(build) / Math.max(1, dist));
    track.style.transform = 'translateX(' + (-bp * dist).toFixed(1) + 'px)';
    // บ้าน
    var hr = home.getBoundingClientRect();
    var hp = clamp((H - hr.top) / (H + hr.height));
    bg.style.transform = 'translateY(' + (-5 + hp * 10).toFixed(2) + '%)';
    var sr = scene.getBoundingClientRect();
    var sp = clamp((H * 0.85 - sr.top) / (sr.height + H * 0.7));
    if (sr.top < H && sr.bottom > 0) {
      var w = scene.clientWidth - jonS.offsetWidth;
      jon.style.transform = 'translateX(' + (sp * w * 0.62).toFixed(1) + 'px) scaleX(' + dir + ')';
      if (jonS.className.indexOf('jon-walk') < 0) jonS.className = 'sprite jon-walk';
      clearTimeout(nap);
      nap = setTimeout(function () { jonS.className = 'sprite jon-roll'; nap = setTimeout(function () { jonS.className = 'sprite jon-sleep'; }, 2800); }, 600);
    }
    // ฝึกร่วมกัน: เพื่อนเข้าวงทีละคน
    var tr = tog.getBoundingClientRect();
    var tp = clamp((H * 0.75 - tr.top) / (tr.height * 0.6));
    var k = Math.round(tp * whos.length);
    whos.forEach(function (w, i) { w.classList.toggle('in', i < k); });
    cnt.textContent = Math.max(1, k);
    ring.style.transform = 'rotate(' + (tp * 120).toFixed(1) + 'deg)';
    // ท้องฟ้า
    if (inDay && dt <= 0) setSky(times[at]);
    else {
      var mid = H * 0.5, pick = null;
      sections.forEach(function (s) { var r = s[0].getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) pick = s[1]; });
      if (!pick && dt > 0) pick = 'dawn';
      if (pick) setSky(pick);
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
