import { useState, useEffect } from "react";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@100;200;300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0e1c1f;
    --ink-60: rgba(14,28,31,0.6);
    --ink-30: rgba(14,28,31,0.3);
    --ink-10: rgba(14,28,31,0.1);
    --cream: #f6f1ea;
    --gold: #b89a6a;
    --gold-light: #d4b98a;
    --white: #ffffff;
  }

  html { scroll-behavior: smooth; }
  body { font-family: 'Jost', sans-serif; background: var(--cream); color: var(--ink); overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--cream); }
  ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

  /* NAV */
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; transition: all 0.5s; padding: 1.5rem 0; }
  .nav.scrolled { background: rgba(246,241,234,0.96); backdrop-filter: blur(20px); padding: 0.9rem 0; border-bottom: 1px solid var(--ink-10); box-shadow: 0 2px 24px rgba(14,28,31,0.06); }
  .nav-inner { max-width: 1400px; margin: 0 auto; padding: 0 clamp(1.25rem,5vw,4rem); display: flex; align-items: center; justify-content: space-between; }
  .logo { font-family: 'Cormorant Garamond', serif; font-size: clamp(1rem,2.2vw,1.4rem); font-weight: 400; letter-spacing: 0.28em; color: var(--ink); cursor: pointer; white-space: nowrap; }
  .logo span { color: var(--gold); }
  .nav-links { display: flex; align-items: center; gap: clamp(1.25rem,2.5vw,2.25rem); list-style: none; }
  .nav-btn { font-size: 0.62rem; letter-spacing: 0.22em; font-weight: 500; text-transform: uppercase; color: var(--ink); background: none; border: none; cursor: pointer; opacity: 0.45; transition: opacity 0.3s; padding: 0; font-family: 'Jost', sans-serif; }
  .nav-btn.active, .nav-btn:hover { opacity: 1; }
  .nav-cta { background: var(--ink) !important; color: var(--cream) !important; opacity: 1 !important; padding: 0.55rem 1.4rem !important; font-size: 0.6rem !important; letter-spacing: 0.2em !important; transition: background 0.3s !important; }
  .nav-cta:hover { background: var(--gold) !important; }
  .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
  .hamburger span { display: block; width: 22px; height: 1.5px; background: var(--ink); transition: all 0.3s; }
  .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; }
  .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
  .mobile-menu { display: none; position: fixed; inset: 0; background: var(--cream); z-index: 99; flex-direction: column; align-items: center; justify-content: center; gap: 2.25rem; opacity: 0; pointer-events: none; transition: opacity 0.4s; }
  .mobile-menu.open { opacity: 1; pointer-events: all; }
  .mobile-menu button { font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; font-weight: 300; font-style: italic; color: var(--ink); background: none; border: none; cursor: pointer; opacity: 0.45; transition: opacity 0.3s; letter-spacing: 0.08em; }
  .mobile-menu button:hover, .mobile-menu button.active { opacity: 1; }

  /* LAYOUT */
  .page { min-height: 100vh; }
  .section { padding: clamp(3.5rem,8vw,7rem) clamp(1.25rem,5vw,4rem); max-width: 1400px; margin: 0 auto; }
  .section-full { padding: clamp(3.5rem,8vw,7rem) 0; }
  .section-inner { max-width: 1400px; margin: 0 auto; padding: 0 clamp(1.25rem,5vw,4rem); }
  .eyebrow { font-size: 0.58rem; letter-spacing: 0.45em; text-transform: uppercase; color: var(--gold); font-weight: 500; margin-bottom: 0.75rem; display: block; }
  .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem,5.5vw,4.5rem); font-weight: 300; line-height: 1.05; color: var(--ink); letter-spacing: -0.01em; }
  .section-title em { font-style: italic; color: var(--gold); }
  .section-desc { font-size: clamp(0.78rem,1.4vw,0.9rem); line-height: 1.95; color: var(--ink-60); font-weight: 300; max-width: 500px; letter-spacing: 0.02em; }
  .gold-line { width: 36px; height: 1px; background: var(--gold); margin: 1.25rem 0; }
  .gold-line.c { margin-left: auto; margin-right: auto; }

  /* HERO */
  .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 7rem 1.25rem 4rem; background: linear-gradient(160deg,#ede8de 0%,#e0d8cc 60%,#d4c9b8 100%); }
  .hero-orb { position: absolute; width: clamp(280px,50vw,650px); height: clamp(280px,50vw,650px); border-radius: 50%; background: radial-gradient(circle,rgba(184,154,106,0.14) 0%,transparent 70%); top: 50%; left: 55%; transform: translate(-50%,-50%); pointer-events: none; }
  .hero-content { position: relative; z-index: 2; text-align: center; max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 1.75rem; }
  .hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(3.8rem,11vw,9.5rem); font-weight: 300; line-height: 0.88; color: var(--ink); letter-spacing: -0.01em; }
  .hero-title em { font-style: italic; color: var(--gold); opacity: 0.75; }
  .hero-sub { font-size: clamp(0.68rem,1.3vw,0.82rem); letter-spacing: 0.3em; text-transform: uppercase; color: var(--ink-60); font-weight: 300; max-width: 360px; line-height: 1.9; }
  .hero-vline { width: 1px; height: 52px; background: linear-gradient(to bottom, var(--gold),transparent); }
  .hero-cta { display: inline-flex; align-items: center; gap: 0.65rem; background: var(--ink); color: var(--cream); padding: 0.8rem 2.25rem; font-size: 0.62rem; letter-spacing: 0.3em; text-transform: uppercase; font-weight: 500; cursor: pointer; border: none; font-family: 'Jost',sans-serif; position: relative; overflow: hidden; transition: color 0.3s; }
  .hero-cta::after { content: ''; position: absolute; inset: 0; background: var(--gold); transform: translateX(-100%); transition: transform 0.4s; z-index: 0; }
  .hero-cta:hover::after { transform: translateX(0); }
  .hero-cta span { position: relative; z-index: 1; }

  /* PHILOSOPHY STRIP */
  .philo { background: var(--ink); padding: clamp(3.5rem,8vw,7rem) 0; position: relative; overflow: hidden; }
  .philo::before { content: '"'; font-family: 'Cormorant Garamond',serif; font-size: 28vw; position: absolute; top: -10%; left: -2%; opacity: 0.025; line-height: 1; pointer-events: none; color: var(--cream); }
  .philo-inner { max-width: 1400px; margin: 0 auto; padding: 0 clamp(1.25rem,5vw,4rem); display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: center; }
  @media(min-width:900px){ .philo-inner { grid-template-columns:1fr 1fr; gap:5rem; } }
  .philo-quote { font-family: 'Cormorant Garamond',serif; font-size: clamp(1.6rem,3.5vw,2.9rem); font-weight: 300; font-style: italic; line-height: 1.4; color: var(--cream); }
  .philo-quote span { color: var(--gold-light); }
  .philo-text { font-size: clamp(0.78rem,1.3vw,0.88rem); line-height: 2.1; color: rgba(246,241,234,0.45); font-weight: 300; letter-spacing: 0.03em; }
  .philo-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; padding-top: 2rem; border-top: 1px solid rgba(246,241,234,0.08); margin-top: 1.5rem; }
  .stat-n { font-family: 'Cormorant Garamond',serif; font-size: 2.4rem; font-weight: 300; color: var(--gold-light); line-height: 1; }
  .stat-l { font-size: 0.55rem; letter-spacing: 0.28em; text-transform: uppercase; color: rgba(246,241,234,0.3); margin-top: 0.35rem; }

  /* VALUES GRID */
  .val-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(210px,1fr)); border: 1px solid var(--ink-10); }
  .val-card { padding: clamp(1.75rem,3.5vw,2.75rem); border-right: 1px solid var(--ink-10); border-bottom: 1px solid var(--ink-10); position: relative; overflow: hidden; transition: background 0.45s; }
  .val-card:last-child { border-right: none; }
  .val-card:hover { background: var(--white); }
  .val-n { font-family: 'Cormorant Garamond',serif; font-size: 3.5rem; font-weight: 300; color: var(--ink-10); line-height: 1; margin-bottom: 1.25rem; transition: color 0.45s; }
  .val-card:hover .val-n { color: rgba(184,154,106,0.12); }
  .val-icon { width: 34px; height: 34px; border-radius: 50%; background: var(--ink-10); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; transition: background 0.4s; }
  .val-icon svg { width: 15px; height: 15px; stroke: var(--ink-60); transition: stroke 0.4s; }
  .val-card:hover .val-icon { background: var(--gold); }
  .val-card:hover .val-icon svg { stroke: white; }
  .val-title { font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase; font-weight: 600; color: var(--ink); margin-bottom: 0.6rem; }
  .val-text { font-size: 0.79rem; line-height: 1.85; color: var(--ink-60); font-weight: 300; }

  /* FEATURED */
  .feat { background: linear-gradient(135deg,#18292d 0%,#0e1c1f 100%); padding: clamp(3.5rem,8vw,7rem) 0; position: relative; overflow: hidden; }
  .feat::before { content: ''; position: absolute; width: 560px; height: 560px; border-radius: 50%; background: radial-gradient(circle,rgba(184,154,106,0.07) 0%,transparent 70%); top: 50%; left: 30%; transform: translate(-50%,-50%); pointer-events: none; }
  .feat-inner { max-width: 1400px; margin: 0 auto; padding: 0 clamp(1.25rem,5vw,4rem); display: grid; grid-template-columns: 1fr; gap: 3.5rem; align-items: center; }
  @media(min-width:900px){ .feat-inner { grid-template-columns: 1fr 1fr; } }
  .feat-bottle-wrap { display: flex; align-items: center; justify-content: center; position: relative; }
  .feat-bottle { display: flex; flex-direction: column; align-items: center; position: relative; z-index: 2; }
  .fb-cap { width: 28px; height: 38px; background: linear-gradient(to bottom,#d4b98a,#7a5830); border-radius: 4px 4px 0 0; box-shadow: inset 2px 0 4px rgba(255,255,255,0.2); }
  .fb-neck { width: 40px; height: 46px; background: linear-gradient(90deg,rgba(255,255,255,0.4),rgba(190,170,140,0.5),rgba(170,145,110,0.3)); border: 1px solid rgba(184,154,106,0.2); }
  .fb-body { width: 130px; height: 210px; background: linear-gradient(145deg,rgba(255,255,255,0.45) 0%,rgba(205,190,160,0.55) 40%,rgba(165,140,105,0.35) 100%); border: 1px solid rgba(184,154,106,0.2); border-radius: 5px; display: flex; align-items: center; justify-content: center; box-shadow: 18px 18px 50px rgba(0,0,0,0.4),-5px -5px 18px rgba(255,255,255,0.04),inset 10px 0 28px rgba(255,255,255,0.1); position: relative; overflow: hidden; }
  .fb-body::before { content: ''; position: absolute; top: 0; left: 18%; width: 14%; height: 100%; background: linear-gradient(to bottom,rgba(255,255,255,0.22),transparent); border-radius: 50%; }
  .fb-label { text-align: center; z-index: 1; padding: 1.5rem; }
  .fb-brand { font-size: 0.42rem; letter-spacing: 0.38em; text-transform: uppercase; color: rgba(184,154,106,0.75); display: block; margin-bottom: 0.4rem; }
  .fb-name { font-family: 'Cormorant Garamond',serif; font-size: 1.05rem; font-style: italic; color: rgba(184,154,106,0.85); }
  .fb-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(184,154,106,0.1); top: 50%; left: 50%; transform: translate(-50%,-50%); }
  .feat-content { color: var(--cream); }
  .feat-title { font-family: 'Cormorant Garamond',serif; font-size: clamp(2rem,4.5vw,3.6rem); font-weight: 300; line-height: 1.1; color: var(--cream); margin: 0.8rem 0 1.25rem; }
  .feat-title em { font-style: italic; color: var(--gold-light); }
  .feat-desc { font-size: clamp(0.78rem,1.3vw,0.88rem); line-height: 2.05; color: rgba(246,241,234,0.5); font-weight: 300; letter-spacing: 0.025em; margin-bottom: 2rem; max-width: 420px; }
  .notes-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25rem; margin-bottom: 2.25rem; padding: 1.75rem 0; border-top: 1px solid rgba(246,241,234,0.07); }
  .note-l { font-size: 0.52rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(246,241,234,0.28); margin-bottom: 0.4rem; }
  .note-v { font-family: 'Cormorant Garamond',serif; font-size: 1rem; color: var(--gold-light); font-style: italic; }
  .feat-btn { display: inline-flex; align-items: center; gap: 0.65rem; border: 1px solid rgba(246,241,234,0.18); color: var(--cream); padding: 0.78rem 1.85rem; font-size: 0.6rem; letter-spacing: 0.28em; text-transform: uppercase; background: none; cursor: pointer; font-family: 'Jost',sans-serif; transition: all 0.35s; }
  .feat-btn:hover { background: var(--gold); border-color: var(--gold); }
  .feat-btn svg { width: 13px; height: 13px; transition: transform 0.3s; }
  .feat-btn:hover svg { transform: translateX(4px); }

  /* PROCESS */
  .proc-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(190px,1fr)); position: relative; }
  .proc-step { padding: clamp(1.5rem,3vw,2.5rem) clamp(1rem,2vw,1.75rem); text-align: center; }
  .proc-num { width: 52px; height: 52px; border-radius: 50%; border: 1px solid var(--ink-10); background: var(--cream); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-family: 'Cormorant Garamond',serif; font-size: 1.1rem; color: var(--gold); transition: all 0.3s; }
  .proc-step:hover .proc-num { background: var(--gold); color: var(--cream); border-color: var(--gold); }
  .proc-title { font-size: 0.62rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 600; color: var(--ink); margin-bottom: 0.6rem; }
  .proc-text { font-size: 0.78rem; line-height: 1.75; color: var(--ink-60); font-weight: 300; }

  /* TESTIMONIALS */
  .testi-bg { background: linear-gradient(160deg,#ede8dd 0%,#e4dccf 100%); padding: clamp(3.5rem,8vw,7rem) 0; }
  .testi-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); gap: clamp(0.75rem,1.5vw,1.25rem); }
  .testi-card { background: var(--white); padding: clamp(1.5rem,3vw,2.25rem); border: 1px solid var(--ink-10); transition: box-shadow 0.4s; }
  .testi-card:hover { box-shadow: 0 8px 36px rgba(14,28,31,0.07); }
  .testi-q { font-family: 'Cormorant Garamond',serif; font-size: 3.5rem; color: var(--gold); opacity: 0.18; line-height: 1; }
  .testi-stars { display: flex; gap: 2px; margin: 0.25rem 0 0.85rem; }
  .testi-stars span { color: var(--gold); font-size: 0.65rem; }
  .testi-text { font-family: 'Cormorant Garamond',serif; font-size: 1.08rem; font-style: italic; line-height: 1.65; color: var(--ink); margin-bottom: 1.25rem; }
  .testi-author { font-size: 0.58rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--ink-30); }
  .testi-scent { font-size: 0.56rem; color: var(--gold); letter-spacing: 0.14em; text-transform: uppercase; }

  /* NEWSLETTER */
  .nl { background: var(--ink); padding: clamp(3rem,7vw,5.5rem) 0; text-align: center; position: relative; overflow: hidden; }
  .nl::after { content: 'PARFUMÉ'; font-family: 'Cormorant Garamond',serif; font-size: 18vw; position: absolute; bottom: -5%; left: 50%; transform: translateX(-50%); opacity: 0.025; color: var(--cream); pointer-events: none; white-space: nowrap; line-height: 1; }
  .nl-inner { max-width: 540px; margin: 0 auto; padding: 0 clamp(1.25rem,5vw,4rem); position: relative; z-index: 1; }
  .nl-title { font-family: 'Cormorant Garamond',serif; font-size: clamp(1.8rem,3.5vw,2.75rem); font-weight: 300; color: var(--cream); margin: 0.75rem 0 0.75rem; }
  .nl-desc { font-size: 0.8rem; color: rgba(246,241,234,0.4); line-height: 1.85; font-weight: 300; margin-bottom: 2rem; }
  .nl-form { display: flex; max-width: 420px; margin: 0 auto; border: 1px solid rgba(246,241,234,0.12); }
  .nl-input { flex: 1; padding: 0.78rem 1.1rem; background: transparent; border: none; outline: none; color: var(--cream); font-size: 0.75rem; font-family: 'Jost',sans-serif; font-weight: 300; }
  .nl-input::placeholder { color: rgba(246,241,234,0.22); }
  .nl-submit { padding: 0.78rem 1.35rem; background: var(--gold); border: none; color: var(--cream); font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase; cursor: pointer; font-family: 'Jost',sans-serif; font-weight: 500; transition: background 0.3s; white-space: nowrap; }
  .nl-submit:hover { background: var(--gold-light); }

  /* COLLECTION PAGE */
  .tabs { display: flex; border: 1px solid var(--ink-10); width: fit-content; margin-bottom: clamp(2rem,4vw,3rem); }
  .tab { padding: 0.6rem 1.6rem; font-size: 0.58rem; letter-spacing: 0.28em; text-transform: uppercase; font-weight: 500; cursor: pointer; border: none; background: transparent; font-family: 'Jost',sans-serif; color: var(--ink-60); transition: all 0.3s; border-right: 1px solid var(--ink-10); }
  .tab:last-child { border-right: none; }
  .tab.active { background: var(--ink); color: var(--cream); }
  .prod-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(220px,1fr)); gap: clamp(0.85rem,1.75vw,1.35rem); }
  .prod-card { cursor: pointer; }
  .prod-img { aspect-ratio: 3/4; background: #e5e0d7; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; transition: all 0.4s; }
  .prod-img::before { content: ''; position: absolute; inset: 0; background: var(--ink); opacity: 0; transition: opacity 0.45s; z-index: 1; }
  .prod-card:hover .prod-img::before { opacity: 0.91; }
  .prod-hover { position: absolute; inset: 0; z-index: 2; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 1.75rem; text-align: center; opacity: 0; transition: opacity 0.38s; }
  .prod-card:hover .prod-hover { opacity: 1; }
  .ph-label { font-size: 0.52rem; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold-light); margin-bottom: 0.6rem; }
  .ph-desc { font-size: 0.74rem; line-height: 1.7; color: rgba(246,241,234,0.7); font-weight: 300; }
  .ph-price { margin-top: 1.25rem; font-family: 'Cormorant Garamond',serif; font-size: 1.4rem; color: var(--cream); font-weight: 300; }
  .ph-add { margin-top: 0.85rem; padding: 0.45rem 1.35rem; border: 1px solid rgba(184,154,106,0.45); color: var(--gold-light); font-size: 0.52rem; letter-spacing: 0.28em; text-transform: uppercase; background: none; cursor: pointer; font-family: 'Jost',sans-serif; transition: all 0.28s; }
  .ph-add:hover { background: var(--gold); color: var(--cream); border-color: var(--gold); }
  .bottle-illo { display: flex; flex-direction: column; align-items: center; }
  .bi-cap { background: linear-gradient(to bottom,#d4b98a,#7a5830); border-radius: 2px 2px 0 0; }
  .bi-neck { background: linear-gradient(90deg,rgba(255,255,255,0.45),rgba(195,180,155,0.5)); border: 1px solid rgba(184,154,106,0.18); }
  .bi-body { background: linear-gradient(135deg,rgba(255,255,255,0.5) 0%,rgba(200,185,158,0.45) 50%,rgba(165,140,108,0.3) 100%); border: 1px solid rgba(184,154,106,0.2); border-radius: 3px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  .bi-body::after { content: ''; position: absolute; top: 10%; left: 16%; width: 14%; height: 60%; background: rgba(255,255,255,0.28); border-radius: 2px; }
  .bi-lbl { font-size: 0.44rem; letter-spacing: 0.28em; text-transform: uppercase; text-align: center; line-height: 1.6; position: relative; z-index: 1; }
  .bi-lbl span { font-family: 'Cormorant Garamond',serif; font-style: italic; font-size: 0.82rem; color: rgba(184,154,106,0.82); display: block; }
  .prod-info { padding: 1.1rem 0 0; }
  .prod-name { font-family: 'Cormorant Garamond',serif; font-size: 1.22rem; font-weight: 400; color: var(--ink); }
  .prod-tag { font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-top: 0.2rem; font-weight: 400; }
  .prod-price { font-size: 0.72rem; color: var(--ink-30); margin-top: 0.3rem; letter-spacing: 0.08em; font-weight: 300; }
  .sub-head { display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1.75rem; }
  .sub-head-line { width: 28px; height: 1px; background: var(--gold); }
  .sub-head-label { font-size: 0.6rem; letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold); font-weight: 500; }

  /* ABOUT PAGE */
  .about-hero { min-height: 52vh; display: flex; align-items: flex-end; padding: 8rem clamp(1.25rem,5vw,4rem) 3.5rem; background: linear-gradient(155deg,#ede8de,#ddd0be); position: relative; overflow: hidden; }
  .about-hero::after { content: 'ABOUT'; font-family: 'Cormorant Garamond',serif; font-size: 22vw; position: absolute; bottom: -4%; right: -1%; opacity: 0.04; color: var(--ink); pointer-events: none; line-height: 1; }
  .about-hero-inner { max-width: 1400px; margin: 0 auto; width: 100%; position: relative; z-index: 1; }
  .about-grid { display: grid; grid-template-columns: 1fr; gap: clamp(2rem,5vw,4rem); }
  @media(min-width:900px){ .about-grid { grid-template-columns:1fr 1fr; gap:4.5rem; align-items:start; } }
  .about-img { aspect-ratio: 4/5; background: var(--ink-10); display: flex; align-items: center; justify-content: center; position: relative; overflow: visible; }
  .about-badge { position: absolute; bottom: -1rem; right: -1rem; background: var(--gold); color: var(--cream); padding: 1.35rem 1.6rem; text-align: center; }
  .badge-n { font-family: 'Cormorant Garamond',serif; font-size: 2.2rem; font-weight: 300; line-height: 1; display: block; }
  .badge-t { font-size: 0.48rem; letter-spacing: 0.28em; text-transform: uppercase; display: block; margin-top: 0.28rem; opacity: 0.82; }
  .loc-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); border: 1px solid var(--ink-10); }
  .loc-card { padding: clamp(1.75rem,3.5vw,2.75rem); border-right: 1px solid var(--ink-10); }
  .loc-card:last-child { border-right: none; }
  .loc-card.dk { background: var(--ink); color: var(--cream); }
  .loc-city { font-family: 'Cormorant Garamond',serif; font-size: 2.25rem; font-weight: 300; margin: 0.6rem 0 1.25rem; }
  .loc-addr { font-size: 0.78rem; line-height: 2; font-weight: 300; color: var(--ink-60); }
  .loc-card.dk .loc-addr { color: rgba(246,241,234,0.4); }
  .loc-email { font-size: 0.62rem; letter-spacing: 0.08em; color: var(--gold); margin-top: 1.25rem; display: block; text-decoration: none; transition: opacity 0.3s; }
  .loc-email:hover { opacity: 0.65; }
  .journal-wrap { max-width: 640px; margin: 0 auto; }
  .journal-box { background: var(--white); border: 1px solid var(--ink-10); padding: clamp(1.75rem,4vw,3rem); }
  .j-textarea { width: 100%; background: transparent; border: none; border-bottom: 1px solid var(--ink-10); outline: none; font-family: 'Jost',sans-serif; font-size: 0.82rem; color: var(--ink); padding: 0.85rem 0; resize: none; height: 112px; letter-spacing: 0.02em; font-weight: 300; transition: border-color 0.3s; }
  .j-textarea::placeholder { color: var(--ink-30); text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.7rem; }
  .j-textarea:focus { border-bottom-color: var(--gold); }
  .j-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 1.35rem; flex-wrap: wrap; gap: 0.85rem; }
  .j-hint { font-size: 0.52rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--ink-30); }
  .j-btn { display: flex; align-items: center; gap: 0.55rem; background: var(--ink); color: var(--cream); padding: 0.55rem 1.35rem; border: none; cursor: pointer; font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase; font-family: 'Jost',sans-serif; transition: background 0.3s; }
  .j-btn:hover { background: var(--gold); }
  .j-btn svg { width: 11px; height: 11px; }
  .j-ok { padding: 2.5rem; text-align: center; font-size: 0.68rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); }
  .review-list { margin-top: 2.5rem; display: flex; flex-direction: column; gap: 1.75rem; }
  .review-item { border-left: 2px solid rgba(184,154,106,0.35); padding-left: 1.35rem; }

  /* WHATS NEXT */
  .launch-list { display: flex; flex-direction: column; }
  .launch-item { display: grid; grid-template-columns: 1fr; gap: 1.75rem; padding: clamp(1.75rem,3.5vw,2.75rem); border: 1px solid var(--ink-10); margin-bottom: -1px; transition: background 0.4s; }
  @media(min-width:700px){ .launch-item { grid-template-columns: auto 1fr; gap: 3rem; align-items: start; } }
  .launch-item:hover { background: var(--white); }
  .launch-n { font-family: 'Cormorant Garamond',serif; font-size: clamp(3.5rem,7vw,5.5rem); font-weight: 300; color: var(--ink-10); line-height: 1; white-space: nowrap; transition: color 0.4s; }
  .launch-item:hover .launch-n { color: rgba(184,154,106,0.12); }
  .launch-cat { font-size: 0.54rem; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.45rem; }
  .launch-title { font-family: 'Cormorant Garamond',serif; font-size: clamp(1.5rem,2.8vw,2.2rem); font-weight: 300; color: var(--ink); margin-bottom: 0.85rem; }
  .launch-desc { font-size: 0.8rem; line-height: 1.85; color: var(--ink-60); font-weight: 300; max-width: 480px; margin-bottom: 1.25rem; }
  .launch-badge { display: inline-block; padding: 0.28rem 0.9rem; border: 1px solid var(--ink-10); font-size: 0.52rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--ink-60); }
  .scent-tags { display: flex; flex-wrap: wrap; gap: 0.45rem; margin-top: 1rem; }
  .scent-tag { padding: 0.35rem 0.9rem; background: var(--ink-10); font-size: 0.58rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-60); }

  /* SHOP */
  .shop-pg { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 8rem 1.5rem 4rem; background: linear-gradient(160deg,#ede8de,#ddd0be); position: relative; overflow: hidden; }
  .shop-pg::before { content: 'SHOP'; font-family: 'Cormorant Garamond',serif; font-size: 22vw; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); opacity: 0.04; color: var(--ink); pointer-events: none; white-space: nowrap; }
  .shop-inner { position: relative; z-index: 1; max-width: 460px; }
  .shop-title { font-family: 'Cormorant Garamond',serif; font-size: clamp(2.8rem,6vw,4.5rem); font-weight: 300; color: var(--ink); margin: 0.75rem 0; }
  .shop-desc { font-size: 0.84rem; line-height: 1.9; color: var(--ink-60); font-weight: 300; margin-bottom: 2.25rem; }
  .back-btn { background: none; border: none; cursor: pointer; font-size: 0.62rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--ink-60); font-family: 'Jost',sans-serif; margin-top: 1.75rem; transition: color 0.3s; display: block; margin-left: auto; margin-right: auto; }
  .back-btn:hover { color: var(--gold); }

  /* FOOTER */
  footer { background: var(--ink); color: rgba(246,241,234,0.32); padding: clamp(3rem,6vw,5rem) 0 1.75rem; }
  .ft-inner { max-width: 1400px; margin: 0 auto; padding: 0 clamp(1.25rem,5vw,4rem); }
  .ft-top { display: grid; grid-template-columns: 1fr; gap: 2.5rem; margin-bottom: 2.5rem; padding-bottom: 2.5rem; border-bottom: 1px solid rgba(246,241,234,0.055); }
  @media(min-width:600px){ .ft-top { grid-template-columns: 2fr 1fr 1fr 1fr; } }
  .ft-brand { font-family: 'Cormorant Garamond',serif; font-size: 1.3rem; font-weight: 300; letter-spacing: 0.22em; color: var(--cream); margin-bottom: 0.7rem; }
  .ft-tagline { font-size: 0.7rem; line-height: 1.85; font-weight: 300; letter-spacing: 0.03em; max-width: 200px; }
  .ft-col-title { font-size: 0.56rem; letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold); margin-bottom: 1.1rem; font-weight: 500; }
  .ft-links { display: flex; flex-direction: column; gap: 0.52rem; }
  .ft-link { font-size: 0.72rem; font-weight: 300; letter-spacing: 0.04em; color: rgba(246,241,234,0.32); text-decoration: none; cursor: pointer; background: none; border: none; text-align: left; font-family: 'Jost',sans-serif; transition: color 0.3s; padding: 0; }
  .ft-link:hover { color: var(--gold-light); }
  .ft-bottom { display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.6rem; letter-spacing: 0.1em; }
  @media(min-width:600px){ .ft-bottom { flex-direction: row; justify-content: space-between; align-items: center; } }
  .ft-socials { display: flex; gap: 1.25rem; }
  .ft-social { font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(246,241,234,0.28); text-decoration: none; transition: color 0.3s; }
  .ft-social:hover { color: var(--gold-light); }

  @media(max-width:768px){
    .nav-links { display: none; }
    .hamburger { display: flex; }
    .mobile-menu { display: flex; }
    .tabs { width: 100%; }
    .tab { flex: 1; text-align: center; }
    .ft-top { grid-template-columns: 1fr 1fr; }
    .about-badge { position: static !important; margin-top: 1.25rem; display: inline-block; }
  }
  @media(max-width:480px){
    .nl-form { flex-direction: column; border: none; gap: 0; }
    .nl-input { border: 1px solid rgba(246,241,234,0.12); border-bottom: none; }
    .nl-submit { border: 1px solid var(--gold); text-align: center; }
    .ft-top { grid-template-columns: 1fr; }
  }
`;

// ── DATA ────────────────────────────────────────────────────────
const femme = [
  { name: "Serena", tag: "Luminous & Sensual", price: "€210", desc: "Bright bergamot blooms into white jasmine with a warm sandalwood close. A radiant intensity that captures a sun-drenched morning.", notes: ["Bergamot","Jasmine","Sandalwood"] },
  { name: "Rosane", tag: "Floral Embrace", price: "€195", desc: "A modern tribute to the rose — delicate, fresh, and undeniably romantic. Dew-kissed petals at their most luminous.", notes: ["Rose","Peony","White Musk"] },
  { name: "Amour", tag: "Confident Romance", price: "€225", desc: "A bold celebration of love. Rare oud from Assam meets warm amber and cool iris — intense, magnetic, and sophisticated.", notes: ["Oud","Amber","Iris"] },
  { name: "Lara", tag: "Freedom & Strength", price: "€210", desc: "Refined freedom. A composition that speaks of wide-open spaces and unwritten journeys ahead.", notes: ["Vetiver","Cedar","Neroli"] }
];
const homme = [
  { name: "Bran", tag: "Mystic Woods", price: "€220", desc: "Deep, ancient forest notes meeting cold Atlantic air. Grounding and meditative with lasting complexity.", notes: ["Oakmoss","Pine","Leather"] },
  { name: "Thor", tag: "Aromatic Power", price: "€230", desc: "Bold raw energy. Designed for the magnetic, resilient soul who leaves a lasting impression.", notes: ["Black Pepper","Tobacco","Amber"] },
  { name: "Ferro", tag: "Distinguished Strength", price: "€210", desc: "A sophisticated blend of mineral freshness and woody resilience for the discerning modern man.", notes: ["Vetiver","Cardamom","Cedar"] },
  { name: "Rock", tag: "Mineral Edge", price: "€205", desc: "The scent of salt-sprayed stone and coastal herb gardens at the edge of the open sea.", notes: ["Sea Salt","Herbs","Driftwood"] }
];
const reviews = [
  { text: "Serena transported me to a rain-kissed morning in Grasse I hadn't thought of in years. Absolute precision in a bottle.", author: "Elena K., Zürich", scent: "Serena" },
  { text: "The architectural bottle sits on my shelf like a sculpture. Ferro is exactly that — pure, silent, and essential.", author: "Marcus T., Dubai", scent: "Ferro" },
  { text: "Amour is unlike anything I've worn before. Rich without being heavy. Compliments every single day.", author: "Sophie R., Paris", scent: "Amour" },
  { text: "Thor captures something ineffable about confidence. I put it on and feel more present, more powerful instantly.", author: "James A., London", scent: "Thor" }
];
const steps = [
  { n: "01", title: "Ingredient Selection", text: "Our master perfumers source only the rarest raw ingredients from their place of origin — rose from Grasse, oud from Assam, vetiver from Haiti." },
  { n: "02", title: "Composition", text: "Each fragrance is composed over weeks of iteration, balancing top, heart, and base notes in perfect harmony and proportion." },
  { n: "03", title: "Maceration", text: "The raw concentrate macerates for a minimum of six weeks, allowing the aromatic molecules to bind, bloom, and fully mature." },
  { n: "04", title: "Hand Bottling", text: "Hand-filled into our signature architectural flacons, each bottle is individually sealed and inspected by our artisans in Grasse." }
];
const launches = [
  { n: "01", cat: "Retro Vibes Series", title: "Playful Nostalgia, Reimagined", desc: "A modern interpretation of bold, expressive perfumery — where vibrant contrasts and vintage inspiration meet contemporary refinement.", badge: "Launching Q2 2025", scents: ["Velours Électrique","Ambre Chromatique","Noir Cassette"] },
  { n: "02", cat: "Moderne Collection", title: "Timeless Minimalism", desc: "An exploration of purity and precision — compositions reduced to their most essential, elegant form. Quiet luxury made olfactory.", badge: "Launching Q3 2025", scents: ["Ligne Pure","Blanc Silencieux","Essence Calme"] },
  { n: "03", cat: "Urban Series", title: "Modern Energy, In Motion", desc: "Inspired by the rhythm and sensuality of contemporary cities — dynamic, textured, and globally influenced compositions.", badge: "Launching Q4 2025", scents: ["Nuit Métropole","Flux Santal","Cuir Urbain"] }
];

// ── ICONS ────────────────────────────────────────────────────────
const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const Droplet = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>;
const Sparkle = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const Leaf = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;
const Shield = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const Pin = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;

// ── BOTTLE ────────────────────────────────────────────────────────
function Bottle({ name, w = 72, h = 108, neckH = 26, capW = 16, capH = 20 }) {
  return (
    <div className="bottle-illo">
      <div className="bi-cap" style={{ width: capW, height: capH }} />
      <div className="bi-neck" style={{ width: capW + 8, height: neckH }} />
      <div className="bi-body" style={{ width: w, height: h }}>
        <div className="bi-lbl">
          <div style={{ fontSize: "0.38rem", letterSpacing: "0.3em", color: "var(--gold)", opacity: 0.7, textTransform: "uppercase" }}>Maison</div>
          <span>{name}</span>
        </div>
      </div>
    </div>
  );
}

// ── PRODUCT CARD ────────────────────────────────────────────────────────
function ProdCard({ item }) {
  return (
    <div className="prod-card">
      <div className="prod-img">
        <Bottle name={item.name} />
        <div className="prod-hover">
          <div className="ph-label">Discovery</div>
          <p className="ph-desc">{item.desc}</p>
          <div className="ph-price">{item.price}</div>
          <button className="ph-add">Add to Cart</button>
        </div>
      </div>
      <div className="prod-info">
        <div className="prod-name">{item.name}</div>
        <div className="prod-tag">{item.tag}</div>
        <div className="prod-price">{item.price} · {item.notes.slice(0,2).join(" · ")}</div>
      </div>
    </div>
  );
}

// ── NEWSLETTER BLOCK ────────────────────────────────────────────────────────
function NewsletterBlock({ title, desc }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const sub = () => { if (!email.trim()) return; setDone(true); setTimeout(() => { setEmail(""); setDone(false); }, 3000); };
  return (
    <div className="nl">
      <div className="nl-inner">
        <span className="eyebrow" style={{ color: "var(--gold)" }}>Stay Close</span>
        <h2 className="nl-title">{title}</h2>
        <p className="nl-desc">{desc}</p>
        {done ? (
          <p style={{ color: "var(--gold-light)", fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>Thank you for joining us.</p>
        ) : (
          <div className="nl-form">
            <input className="nl-input" type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && sub()} />
            <button className="nl-submit" onClick={sub}>Subscribe</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState("femme");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (p) => { setPage(p); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const handleSubmit = () => {
    if (!comment.trim()) return;
    setSubmitted(true);
    setTimeout(() => { setComment(""); setSubmitted(false); }, 3500);
  };

  const navItems = [["home","Origin"],["collection","Collection"],["whats-next","What's Next"],["about-us","About Us"]];

  return (
    <div>
      <style>{globalStyles}</style>

      {/* NAV */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="logo" onClick={() => go("home")}>MAISON <span>PARFUMÉ</span></div>
          <ul className="nav-links">
            {navItems.map(([p,l]) => (
              <li key={p}><button className={`nav-btn${page===p?" active":""}`} onClick={() => go(p)}>{l}</button></li>
            ))}
            <li><button className="nav-btn nav-cta" onClick={() => go("shop")}>Shop Now</button></li>
          </ul>
          <button className={`hamburger${menuOpen?" open":""}`} onClick={() => setMenuOpen(o=>!o)} aria-label="Menu">
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu${menuOpen?" open":""}`}>
        {navItems.map(([p,l]) => (
          <button key={p} className={page===p?"active":""} onClick={() => go(p)}>{l}</button>
        ))}
        <button style={{ color: "var(--gold)", opacity: 1 }} onClick={() => go("shop")}>Shop Now</button>
      </div>

      {/* ══════════ HOME ══════════ */}
      {page === "home" && (
        <div className="page">
          {/* Hero */}
          <section className="hero">
            <div className="hero-orb"/>
            <div className="hero-content">
              <span className="eyebrow">Paris · Dubai · Est. 1984</span>
              <h1 className="hero-title">MAISON<br/><em>Parfumé</em></h1>
              <p className="hero-sub">Sculpting invisible architecture. Each fragrance a silent dialogue between wearer and world.</p>
              <div className="hero-vline"/>
              <button className="hero-cta" onClick={() => go("collection")}>
                <span>Explore the Collection</span>
                <span><Arrow/></span>
              </button>
            </div>
          </section>

          {/* Philosophy */}
          <div className="philo">
            <div className="philo-inner">
              <blockquote className="philo-quote">
                "Scent is the most <span>intimate form</span> of communication — a silent dialogue written on skin."
              </blockquote>
              <div>
                <span className="eyebrow">Our Philosophy</span>
                <p className="philo-text">
                  Maison Parfumé was founded in 1984 on the belief that true luxury lies in restraint. We strip away the excess — no loud marketing, no artificial complexity. Just the raw emotion of essence, captured in hand-blown glass from our atelier in Grasse, France.
                </p>
                <div className="philo-stats">
                  {[["40+","Years of Craft"],["18","Fragrances"],["60+","Countries"]].map(([n,l]) => (
                    <div key={l}><div className="stat-n">{n}</div><div className="stat-l">{l}</div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <section className="section">
            <span className="eyebrow">The House</span>
            <h2 className="section-title" style={{ marginBottom: "2.5rem" }}>Core <em>Values</em></h2>
            <div className="val-grid">
              {[
                { icon: <Droplet/>, title: "Simplicity", text: "Removing the noise to find the soul — structural clarity and purposeful restraint in every single composition we create." },
                { icon: <Sparkle/>, title: "Elegance", text: "Timeless restraint that never shouts, but always resonates. Beauty that deepens with familiarity and time." },
                { icon: <Leaf/>, title: "Naturality", text: "Capturing fleeting moments within a liquid frame, sourcing from nature's most generous and authentic regions." },
                { icon: <Shield/>, title: "Authenticity", text: "Honest craftsmanship from Grasse, the world's cradle of essence. No shortcuts, no imitations, no compromise — ever." }
              ].map((v,i) => (
                <div className="val-card" key={i}>
                  <div className="val-n">0{i+1}</div>
                  <div className="val-icon">{v.icon}</div>
                  <div className="val-title">{v.title}</div>
                  <p className="val-text">{v.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Featured */}
          <div className="feat">
            <div className="feat-inner">
              <div className="feat-bottle-wrap">
                <div className="fb-ring" style={{width:280,height:280}}/>
                <div className="fb-ring" style={{width:420,height:420}}/>
                <div className="feat-bottle">
                  <div className="fb-cap"/>
                  <div className="fb-neck"/>
                  <div className="fb-body">
                    <div className="fb-label">
                      <span className="fb-brand">Maison Parfumé</span>
                      <div className="fb-name">Amour</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="feat-content">
                <span className="eyebrow" style={{ color: "var(--gold)" }}>Signature Scent · 2024</span>
                <h2 className="feat-title">The Scent of<br/><em>Bold Romance</em></h2>
                <p className="feat-desc">
                  Amour is a bold celebration of love — intense, magnetic, and deeply sophisticated. A rich accord of rare oud from Assam meets the warmth of amber and the cool elegance of iris. Designed for those who understand that the most powerful statements are made in silence.
                </p>
                <div className="notes-row">
                  {[["Top Note","Bergamot & Saffron"],["Heart Note","Oud & Rose"],["Base Note","Amber & Musk"]].map(([l,v]) => (
                    <div key={l}><div className="note-l">{l}</div><div className="note-v">{v}</div></div>
                  ))}
                </div>
                <button className="feat-btn" onClick={() => go("collection")}>
                  <span>View Full Collection</span>
                  <Arrow/>
                </button>
              </div>
            </div>
          </div>

          {/* Process */}
          <section className="section">
            <div style={{ textAlign:"center", marginBottom:"3rem" }}>
              <span className="eyebrow">The Craft</span>
              <h2 className="section-title">How We <em>Create</em></h2>
              <div className="gold-line c"/>
            </div>
            <div className="proc-grid">
              {steps.map((s,i) => (
                <div className="proc-step" key={i}>
                  <div className="proc-num">{s.n}</div>
                  <div className="proc-title">{s.title}</div>
                  <p className="proc-text">{s.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <div className="testi-bg">
            <div className="section-inner" style={{ paddingTop:"clamp(3.5rem,8vw,7rem)", paddingBottom:"clamp(3.5rem,8vw,7rem)" }}>
              <span className="eyebrow">Voices</span>
              <h2 className="section-title" style={{ marginBottom:"0.5rem" }}>Journal of <em>Sentiments</em></h2>
              <div className="gold-line" style={{ marginBottom:"2.5rem" }}/>
              <div className="testi-grid">
                {reviews.map((r,i) => (
                  <div className="testi-card" key={i}>
                    <div className="testi-q">"</div>
                    <div className="testi-stars">{[...Array(5)].map((_,j) => <span key={j}>★</span>)}</div>
                    <p className="testi-text">"{r.text}"</p>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span className="testi-author">— {r.author}</span>
                      <span className="testi-scent">{r.scent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <NewsletterBlock
            title="First Access to New Launches"
            desc="Join our private list for early access to new collections, exclusive events, and invitations to the quiet world of Maison Parfumé."
          />
        </div>
      )}

      {/* ══════════ COLLECTION ══════════ */}
      {page === "collection" && (
        <div className="page">
          <section className="section" style={{ paddingTop:"8rem" }}>
            <span className="eyebrow">Archives 2025</span>
            <h1 className="section-title" style={{ marginBottom:"0.5rem" }}>Liquid <em>Sentiments</em></h1>
            <div className="gold-line"/>
            <p className="section-desc" style={{ marginBottom:"2.5rem" }}>
              Each fragrance is an architecture of emotion — built from rare ingredients, composed with restraint, and designed to leave a quiet, lasting impression on the skin and in the memory.
            </p>
            <div className="tabs">
              {[["femme","Pour Femme"],["homme","Pour Homme"],["all","All Fragrances"]].map(([k,l]) => (
                <button key={k} className={`tab${tab===k?" active":""}`} onClick={() => setTab(k)}>{l}</button>
              ))}
            </div>

            {(tab==="femme"||tab==="all") && (
              <div style={{ marginBottom: tab==="all"?"4rem":0 }}>
                {tab==="all" && <div className="sub-head"><div className="sub-head-line"/><div className="sub-head-label">Pour Femme</div></div>}
                <div className="prod-grid">
                  {femme.map(item => <ProdCard key={item.name} item={item}/>)}
                </div>
              </div>
            )}
            {(tab==="homme"||tab==="all") && (
              <div>
                {tab==="all" && <div className="sub-head"><div className="sub-head-line"/><div className="sub-head-label">Pour Homme</div></div>}
                <div className="prod-grid">
                  {homme.map(item => <ProdCard key={item.name} item={item}/>)}
                </div>
              </div>
            )}
          </section>
          <NewsletterBlock title="Be the First to Know" desc="New arrivals, exclusive editions, and invitations to private launch events in Paris and Dubai." />
        </div>
      )}

      {/* ══════════ WHAT'S NEXT ══════════ */}
      {page === "whats-next" && (
        <div className="page">
          <section className="section" style={{ paddingTop:"8rem" }}>
            <span className="eyebrow">Future Directions</span>
            <h1 className="section-title" style={{ marginBottom:"0.5rem" }}>New <em>Launches</em></h1>
            <div className="gold-line"/>
            <p className="section-desc" style={{ marginBottom:"3.5rem" }}>
              Three distinct expressions of our evolving philosophy. Each series explores a different emotional register — playful, pure, or urban — all rooted in our commitment to restraint and craft.
            </p>
            <div className="launch-list">
              {launches.map((l,i) => (
                <div className="launch-item" key={i}>
                  <div className="launch-n">{l.n}</div>
                  <div>
                    <div className="launch-cat">{l.cat}</div>
                    <h3 className="launch-title">{l.title}</h3>
                    <p className="launch-desc">{l.desc}</p>
                    <span className="launch-badge">{l.badge}</span>
                    <div className="scent-tags">
                      {l.scents.map(s => <span className="scent-tag" key={s}>{s}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="philo">
            <div className="philo-inner">
              <blockquote className="philo-quote">
                "A study in contrast. Three expressions. <span>One philosophy</span> of restraint."
              </blockquote>
              <div>
                <span className="eyebrow">Join the Waitlist</span>
                <p className="philo-text" style={{ marginBottom:"1.5rem" }}>
                  Be among the first to experience our upcoming collections. Our private list members receive early access, exclusive samples, and invitations to launch events in Paris and Dubai.
                </p>
                <NewsletterBlock title="" desc=""/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ ABOUT US ══════════ */}
      {page === "about-us" && (
        <div className="page">
          <div className="about-hero">
            <div className="about-hero-inner">
              <span className="eyebrow">Maison Presence</span>
              <h1 className="section-title" style={{ fontSize:"clamp(2.8rem,7vw,6.5rem)" }}>Global <em>Ateliers</em></h1>
            </div>
          </div>

          {/* Story */}
          <section className="section">
            <div className="about-grid">
              <div style={{ position:"relative" }}>
                <div className="about-img">
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"2rem", padding:"2.5rem" }}>
                    <div style={{ display:"flex", gap:"1.25rem", alignItems:"flex-end" }}>
                      {[{n:"Serena",w:46,h:68},{n:"Amour",w:56,h:85},{n:"Ferro",w:46,h:68}].map((b,i) => (
                        <Bottle key={b.n} name={b.n} w={b.w} h={b.h} neckH={20} capW={12} capH={16}/>
                      ))}
                    </div>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"1rem", color:"var(--gold)", opacity:0.7 }}>Est. Grasse, 1984</p>
                  </div>
                </div>
                <div className="about-badge">
                  <span className="badge-n">40</span>
                  <span className="badge-t">Years of Mastery</span>
                </div>
              </div>
              <div>
                <span className="eyebrow">Our Story</span>
                <h2 className="section-title" style={{ marginBottom:"0.75rem" }}>Born from <em>Grasse</em></h2>
                <div className="gold-line"/>
                <p className="section-desc" style={{ marginBottom:"1.25rem", maxWidth:"100%" }}>
                  Maison Parfumé was founded in 1984 in the hillside town of Grasse, France — the cradle of the world's finest perfumery. Our founder, drawn to the belief that scent is the most intimate form of human expression, set out to create fragrances that whispered rather than shouted.
                </p>
                <p className="section-desc" style={{ marginBottom:"2rem", maxWidth:"100%" }}>
                  Today, from our laboratory in Paris and our atelier in Dubai, we continue that same quiet pursuit: compositions stripped of excess, built on rare natural materials, designed to become a second skin for those who understand that true luxury needs no announcement.
                </p>
                <div style={{ display:"flex", gap:"2.5rem", paddingTop:"1.75rem", borderTop:"1px solid var(--ink-10)" }}>
                  {[["1984","Founded"],["18","Fragrances"],["60+","Countries"]].map(([n,l]) => (
                    <div key={l}>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", color:"var(--gold)", fontWeight:300, lineHeight:1 }}>{n}</div>
                      <div style={{ fontSize:"0.54rem", letterSpacing:"0.28em", textTransform:"uppercase", color:"var(--ink-30)", marginTop:"0.35rem" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Locations */}
          <section className="section" style={{ paddingTop:0 }}>
            <span className="eyebrow">Find Us</span>
            <h2 className="section-title" style={{ marginBottom:"2rem" }}>Our <em>Locations</em></h2>
            <div className="loc-grid">
              <div className="loc-card">
                <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", color:"var(--gold)" }}><Pin/><span style={{ fontSize:"0.58rem", letterSpacing:"0.3em", textTransform:"uppercase", fontWeight:600, color:"var(--ink)" }}>Middle East HQ</span></div>
                <div className="loc-city">Dubai</div>
                <p className="loc-addr">Unit 402, Building 5<br/>Dubai Design District (d3)<br/>Dubai, United Arab Emirates</p>
                <a className="loc-email" href="mailto:contact.dxb@maisonparfume.com">contact.dxb@maisonparfume.com</a>
              </div>
              <div className="loc-card dk">
                <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", color:"var(--gold)" }}><Pin/><span style={{ fontSize:"0.58rem", letterSpacing:"0.3em", textTransform:"uppercase", fontWeight:500, color:"rgba(246,241,234,0.5)" }}>European Heritage</span></div>
                <div className="loc-city">Paris</div>
                <p className="loc-addr">18 Rue du Faubourg Saint-Honoré<br/>75008 Paris<br/>France</p>
                <a className="loc-email" href="mailto:ateliers.paris@maisonparfume.fr">ateliers.paris@maisonparfume.fr</a>
              </div>
              <div className="loc-card">
                <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", color:"var(--gold)" }}><Pin/><span style={{ fontSize:"0.58rem", letterSpacing:"0.3em", textTransform:"uppercase", fontWeight:600, color:"var(--ink)" }}>Origin Atelier</span></div>
                <div className="loc-city">Grasse</div>
                <p className="loc-addr">Les Ateliers du Parfum<br/>Route de Cannes<br/>06130 Grasse, France</p>
                <a className="loc-email" href="mailto:atelier@maisonparfume.fr">atelier@maisonparfume.fr</a>
              </div>
            </div>
          </section>

          {/* Journal */}
          <section className="section" style={{ paddingTop:0 }}>
            <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
              <span className="eyebrow">Your Voice</span>
              <h2 className="section-title">Journal of <em>Sentiments</em></h2>
              <div className="gold-line c"/>
              <p className="section-desc" style={{ margin:"0 auto" }}>Share your olfactory memory with us. How did Maison Parfumé make you feel?</p>
            </div>
            <div className="journal-wrap">
              <div className="journal-box">
                {submitted ? (
                  <div className="j-ok">Thank you for your reflection. ✦</div>
                ) : (
                  <>
                    <textarea className="j-textarea" placeholder="What is your memory of Maison Parfumé?" value={comment} onChange={e => setComment(e.target.value)}/>
                    <div className="j-footer">
                      <span className="j-hint">Confidential journal entry</span>
                      <button className="j-btn" onClick={handleSubmit}><span>Submit Reflection</span><Arrow/></button>
                    </div>
                  </>
                )}
              </div>
              <div className="review-list">
                {reviews.slice(0,2).map((r,i) => (
                  <div className="review-item" key={i}>
                    <div className="testi-stars" style={{ marginBottom:"0.4rem" }}>{[...Array(5)].map((_,j) => <span key={j} style={{ color:"var(--gold)", fontSize:"0.62rem" }}>★</span>)}</div>
                    <p className="testi-text" style={{ marginBottom:"0.45rem" }}>"{r.text}"</p>
                    <span className="testi-author">— {r.author}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ══════════ SHOP ══════════ */}
      {page === "shop" && (
        <div className="shop-pg">
          <div className="shop-inner">
            <span className="eyebrow">Coming Soon</span>
            <h1 className="shop-title">Online <em>Boutique</em></h1>
            <div className="gold-line c"/>
            <p className="shop-desc">
              Our online boutique is being carefully crafted with the same precision as our fragrances. Visit us in Paris, Dubai, or Grasse — or join our list for first access when we launch.
            </p>
            <NewsletterBlock title="" desc=""/>
            <button className="back-btn" onClick={() => go("collection")}>← Browse Collection</button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer>
        <div className="ft-inner">
          <div className="ft-top">
            <div>
              <div className="ft-brand">MAISON PARFUMÉ</div>
              <p className="ft-tagline">Sculpting invisible architecture since 1984. Grasse · Paris · Dubai.</p>
            </div>
            <div>
              <div className="ft-col-title">Navigate</div>
              <div className="ft-links">
                {navItems.map(([p,l]) => <button key={p} className="ft-link" onClick={() => go(p)}>{l}</button>)}
                <button className="ft-link" onClick={() => go("shop")}>Shop</button>
              </div>
            </div>
            <div>
              <div className="ft-col-title">Collection</div>
              <div className="ft-links">
                {["Pour Femme","Pour Homme","Gift Sets","New Arrivals","Best Sellers"].map(l => <span key={l} className="ft-link">{l}</span>)}
              </div>
            </div>
            <div>
              <div className="ft-col-title">Contact</div>
              <div className="ft-links">
                {["Paris Atelier","Dubai Studio","Grasse Origin","Press & Media","Stockists"].map(l => <span key={l} className="ft-link">{l}</span>)}
              </div>
            </div>
          </div>
          <div className="ft-bottom">
            <span>© 2025 Maison Parfumé. All rights reserved.</span>
            <div className="ft-socials">
              {["Instagram","Pinterest","LinkedIn"].map(s => <a key={s} className="ft-social" href="#">{s}</a>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
