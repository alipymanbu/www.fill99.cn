/* MagicLight.ai 第三方介绍站交互脚本 */
(function () {
  'use strict';

  /* ---------- 跳转链接统一取自 links.js（唯一一处） ---------- */
  var LINKS = window.SITE_LINKS || {};
  document.querySelectorAll('[data-link]').forEach(function (el) {
    var key = el.getAttribute('data-link');
    if (LINKS[key]) el.setAttribute('href', LINKS[key]);
  });

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 导航：滚动状态 ---------- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 移动端菜单 ---------- */
  var burger = document.querySelector('.nav-burger');
  if (burger && nav) {
    burger.addEventListener('click', function () { nav.classList.toggle('open'); });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  /* ---------- 当前页导航高亮 ---------- */
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[href]').forEach(function (a) {
    var href = a.getAttribute('href').split('#')[0];
    if (href && href === path) a.classList.add('active');
  });

  /* ---------- 滚动渐显 ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 数字计数 ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (reducedMotion) { el.textContent = target + suffix; return; }
    var start = null, dur = 1600;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCount(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Hero 打字机 ---------- */
  var promptEl = document.getElementById('promptText');
  if (promptEl && !reducedMotion) {
    var prompts = [
      '一只想当宇航员的小猫，离开了云朵上的家，去寻找传说中的星星灯塔……',
      '校园奇幻物语：转学生随身带着一本会自己翻页的魔法笔记。',
      '给孩子的睡前故事：怕黑的小萤火虫，如何点亮整片森林？',
      '科技寓言：2077 年，最后一座人类图书馆由一群机器人守护着。'
    ];
    var pi = 0, ci = 0, deleting = false;
    function typeLoop() {
      var text = prompts[pi];
      if (!deleting) {
        ci++;
        promptEl.textContent = text.slice(0, ci);
        if (ci === text.length) {
          deleting = true;
          setTimeout(typeLoop, 2200);
          return;
        }
        setTimeout(typeLoop, 65 + Math.random() * 55);
      } else {
        ci -= 3;
        if (ci <= 0) {
          ci = 0;
          deleting = false;
          pi = (pi + 1) % prompts.length;
        }
        promptEl.textContent = text.slice(0, Math.max(ci, 0));
        setTimeout(typeLoop, 26);
      }
    }
    typeLoop();
  } else if (promptEl) {
    promptEl.textContent = '一只想当宇航员的小猫，离开了云朵上的家，去寻找传说中的星星灯塔……';
  }

  /* ---------- 演示视频：滚入视口静音自动播放，离屏暂停 ---------- */
  var demo = document.querySelector('.demo-video');
  if (demo && 'IntersectionObserver' in window) {
    var dio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.play().catch(function () {});
        else e.target.pause();
      });
    }, { threshold: 0.35 });
    dio.observe(demo);
  }

  /* ---------- 人群标签页 ---------- */
  document.querySelectorAll('.tabs').forEach(function (tabs) {
    var btns = tabs.querySelectorAll('.tab-btn');
    var panels = document.querySelectorAll('.tab-panel');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-tab');
        btns.forEach(function (b) { b.classList.toggle('on', b === btn); });
        panels.forEach(function (p) { p.classList.toggle('on', p.id === 'panel-' + key); });
      });
    });
  });

  /* ---------- FAQ 手风琴 ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
})();
