// Sponsor landing — Seguros vertical
// Expects window.VERTICAL = { key, label, preTitle, tierLabel, tierNames, tiers }

const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ---------- Scroll-reveal hook ----------
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ---------- Animated counter hook ----------
function useCounter(target, active, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = Date.now();
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

// ---------- Icons ----------
const IconCheck = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
const IconX = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
const IconArrow = ({ size = 14 }) => (
  <svg className="arrow" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const IconGlobe = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

// ---------- Nav ----------
function Nav({ vertical }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <>
      <div className="urgency-strip">
        Plazas de participación muy limitadas · <strong>Edición inaugural · 16 de junio</strong> · Auditorio Beatriz, Madrid
      </div>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`} aria-label="Navegación principal">
        <div className="nav-inner">
          <a href="#" className="brand">
            <span className="brand-dot"></span>
            <span>IA Agéntica</span>
            <span className="brand-vertical">Sponsors · {vertical.label}</span>
          </a>
          <div className="nav-links">
            <a href="#foro">El Foro</a>
            <a href="#verticales">Verticales</a>
            <a href="#agenda">Agenda</a>
            <a href="#paquetes">Paquetes</a>
            <a href="#reservar" className="btn btn-ghost btn-sm">Hablar con el equipo <IconArrow /></a>
          </div>
        </div>
      </nav>
    </>
  );
}

// ---------- Hero ----------
function Hero({ vertical }) {
  const diff = useCountdown('2026-06-16T09:00:00+02:00');
  return (
    <section className="hero" id="top">
      <div className="hero-grid"></div>
      <div className="hero-glow g1"></div>
      <div className="hero-glow g2"></div>
      <div className="container">
        <div className="hero-inner">
          <div className="fade-up">
            <span className="hero-mono">{vertical.preTitle}</span>
            <h1 className="hero-title">
              {vertical.heroTitle}
            </h1>
            <p className="lead" style={{ marginTop: 28, maxWidth: 560 }}>
              {vertical.heroSub}
            </p>
            <div className="hero-meta">
              <div>
                <span className="label">Fecha</span>
                <span className="value">16 Junio 2026</span>
              </div>
              <div>
                <span className="label">Lugar</span>
                <span className="value">Auditorio Beatriz · Madrid</span>
              </div>
              <div>
                <span className="label">Aforo</span>
                <span className="value">150 C-level</span>
              </div>
              <div>
                <span className="label">Formato</span>
                <span className="value">Presencial · Chatham House</span>
              </div>
              <div>
                <span className="label">Mercado</span>
                <span className="value">~57.000 M€ primas sector 2024</span>
              </div>
            </div>
            <div className="hero-cta">
              <a href="#reservar" className="btn btn-primary">
                Hablar con el equipo <IconArrow />
              </a>
              <a href="#paquetes" className="btn btn-ghost">Ver paquetes</a>
            </div>
          </div>

          <div className="ticker fade-up fade-up-2">
            <div className="ticker-header">
              <span className="ticker-status"><span className="live-dot"></span> Disponibilidad en vivo</span>
              <span className="mono">{vertical.tierLabel.toUpperCase()}</span>
            </div>
            {vertical.tiers.map((t, i) => (
              <div className={`ticker-row ${t.remaining <= 2 ? 'low' : ''}`} key={i}>
                <span className="name">{t.name}</span>
                <span className="remaining">
                  <strong>{t.remaining}</strong> / {t.total} plaza{t.total !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
            <div className="countdown">
              <Cell num={diff.d} unit="Días" />
              <Cell num={diff.h} unit="Horas" />
              <Cell num={diff.m} unit="Min" />
              <Cell num={diff.s} unit="Seg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function Cell({ num, unit }) {
  return (
    <div className="countdown-cell">
      <div className="num">{String(num).padStart(2, '0')}</div>
      <span className="unit">{unit}</span>
    </div>
  );
}
function useCountdown(isoTarget) {
  const target = useMemo(() => new Date(isoTarget).getTime(), [isoTarget]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const delta = Math.max(0, target - now);
  return {
    d: Math.floor(delta / 86400000),
    h: Math.floor((delta % 86400000) / 3600000),
    m: Math.floor((delta % 3600000) / 60000),
    s: Math.floor((delta % 60000) / 1000),
  };
}

// ---------- Stats ----------
function Stats() {
  const [ref, inView] = useInView(0.4);
  const c150 = useCounter(150, inView, 1200);
  const c3000 = useCounter(3000, inView, 1600);
  return (
    <div className="stats-bar" ref={ref}>
      <div className="stats-bar-item">
        <div className="stats-bar-num">{inView ? c150 : 0}</div>
        <div className="stats-bar-label">Directivos C-Level</div>
      </div>
      <div className="stats-bar-item">
        <div className="stats-bar-num">+7%</div>
        <div className="stats-bar-label">Crecimiento anual del sector</div>
      </div>
      <div className="stats-bar-item">
        <div className="stats-bar-num">{inView ? c3000.toLocaleString('es-ES') : 0}+</div>
        <div className="stats-bar-label">Alumni IIA</div>
      </div>
      <div className="stats-bar-item">
        <div className="stats-bar-num">1ª</div>
        <div className="stats-bar-label">Edición en España</div>
      </div>
    </div>
  );
}

// ---------- Sobre el Foro ----------
function AboutForo() {
  const [ref, inView] = useInView();
  return (
    <section className="section" id="foro" ref={ref}>
      <div className={`container reveal ${inView ? 'in-view' : ''}`}>
        <div className="section-header">
          <span className="eyebrow">El Foro</span>
          <h2>El primer foro en España dedicado a la <em style={{ fontStyle: 'italic' }}>IA Agéntica</em> para el sector asegurador.</h2>
          <p className="lead">Un encuentro único diseñado para reunir a los máximos responsables de compañías aseguradoras en un espacio de diálogo estratégico de alto nivel. Sin intermediarios, sin comerciales.</p>
        </div>

        <div className="reasons-grid">
          {[
            ['01', 'Liderazgo sectorial', 'Posicionarse como una de las compañías que impulsa la conversación seria sobre IA Agéntica en seguros. No asistir al debate: liderarlo.'],
            ['02', 'Posicionamiento institucional', 'Los agentes de IA están transformando suscripción, siniestros y distribución. Las compañías que encabecen esa conversación ahora determinarán los estándares del sector antes de que otros lo hagan.'],
            ['03', 'Contribución editorial real', 'Un directivo de vuestra compañía participa en una mesa de alto nivel junto a pares del sector. El programa es curado: sin charlas comerciales, sin feria de proveedores.'],
            ['04', 'Scouting cualificado', 'Acceso privado a soluciones específicas para aseguradoras: underwriting automation, FNOL y liquidación de siniestros con IA, detección de fraude, modelos predictivos de churn y pricing dinámico. Sin ferias masivas.'],
            ['05', 'Activo interno para el comité', 'Post-evento: informe ejecutivo con benchmark del sector asegurador, mapa de proveedores, casos de uso en producción y riesgos detectados. Material directo para vuestro comité de dirección.'],
            ['06', 'Marco regulatorio integrado', 'AI Act (sistemas de alto riesgo en Vida/Salud), Solvency II, DORA, IDD y supervisión DGSFP forman parte del programa desde el diseño, no son un añadido. Avalado por AEPD y DGSFP en el Sandbox Financiero.'],
          ].map(([num, title, desc], i) => (
            <div className={`reason reveal reveal-delay-${i + 1} ${inView ? 'in-view' : ''}`} key={num}>
              <div className="reason-num">{num}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Quiénes Somos ----------
function About() {
  const [ref, inView] = useInView();
  return (
    <section className="section" id="quienes-somos" ref={ref}>
      <div className={`container reveal ${inView ? 'in-view' : ''}`}>
        <div className="section-header">
          <span className="eyebrow">Quiénes Somos</span>
          <h2>Organizado por SegurosIA en colaboración con el <em style={{ fontStyle: 'italic' }}>IIA</em>.</h2>
        </div>
        <div className="about-grid">
          <div className="about-card">
            <div className="role">Organizador</div>
            <h3>SegurosIA</h3>
            <p>Consultora tecnológica especializada en IA aplicada al sector asegurador y financiero. Nacida del ecosistema insurtech español, actúa como puente entre innovación tecnológica y necesidades reales de la industria.</p>
            <p>Promueve el único proyecto con luz verde en 2025/26 por parte de AEPD, DGSFP y resto de organismos reguladores del Sandbox Financiero Español.</p>
            <div className="about-badges">
              <span className="about-badge">AEPD</span>
              <span className="about-badge">DGSFP</span>
              <span className="about-badge">Sandbox Financiero</span>
            </div>
          </div>
          <div className="about-card">
            <div className="role">Partner Estratégico</div>
            <h3>Instituto de Inteligencia Artificial</h3>
            <p>Institución académica de referencia en IA en España, con una red de más de 3.000 alumni formados en programas especializados.</p>
            <p>El IIA co-diseña el programa, propone ponentes de primer nivel y moviliza su red de directivos formados en IA, garantizando una audiencia cualificada y un enfoque técnico riguroso.</p>
            <div className="about-badges">
              <span className="about-badge">3.000+ Alumni</span>
              <span className="about-badge">Rigor académico</span>
              <span className="about-badge">Red C-Level</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- El Momento ----------
function Moment() {
  const [ref, inView] = useInView();
  return (
    <section className="section" ref={ref}>
      <div className={`container-narrow reveal ${inView ? 'in-view' : ''}`}>
        <div className="moment-block">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>2026 · Punto de inflexión</span>
          <h2 style={{ marginTop: 24 }}>El momento de la <em style={{ fontStyle: 'italic' }}>IA Agéntica</em>.</h2>
          <p>Las aseguradoras que adopten agentes autónomos en suscripción, siniestros y distribución antes de 2027 fijarán los márgenes de referencia del sector. Las que esperen, competirán con las condiciones que otras hayan establecido.</p>
          <div className="highlight">Participar ahora es liderar la conversación antes de que otros lo hagan</div>
        </div>
      </div>
    </section>
  );
}

// ---------- Verticales ----------
function Verticals() {
  const [ref, inView] = useInView();
  const items = [
    ['Estado del Arte de la IA Agéntica', 'Panorama global de los agentes de IA: dónde estamos, hacia dónde vamos y qué impacto real están teniendo en seguros. Casos en producción, benchmarks y lecciones aprendidas.'],
    ['Guardrails, Compliance y Regulación', 'Cómo diseñar sistemas de IA Agéntica que cumplan con DORA, AI Act y normativa sectorial. Frameworks de gobernanza, auditoría algorítmica y control humano.'],
    ['Federated Learning y Privacidad', 'Entrenamiento colaborativo de modelos sin compartir datos sensibles de pólizas o siniestros. IA Agéntica respetando privacidad y protección de datos.'],
    ['Arquitecturas del Conocimiento', 'RAG, grafos de conocimiento y sistemas multiagente: las arquitecturas técnicas detrás de los agentes más avanzados del sector asegurador.'],
    ['Futuro de los Servicios de Software', 'Cómo la IA Agéntica redefine los modelos de negocio SaaS, la relación proveedor-aseguradora y la cadena de valor tecnológica.'],
    ['Ciberseguridad e IA Agéntica', 'Nuevos vectores de amenaza que introducen los agentes autónomos y estrategias de defensa. Seguridad ofensiva y defensiva en el contexto asegurador.'],
  ];
  return (
    <section className="section" id="verticales" ref={ref}>
      <div className={`container reveal ${inView ? 'in-view' : ''}`}>
        <div className="section-header">
          <span className="eyebrow">Programa</span>
          <h2>Seis verticales temáticas.</h2>
          <p className="lead">El programa cubre los retos más críticos de la IA Agéntica aplicada al sector asegurador: suscripción, siniestros, fraude y compliance. Las entidades participantes pueden proponer retos sectoriales al comité de programa.</p>
        </div>
        <div className="verticals-grid">
          {items.map(([title, desc], i) => (
            <div className="vertical-card" key={i}>
              <div className="vertical-num">0{i + 1}</div>
              <div className="vertical-content">
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Agenda ----------
function Agenda() {
  const [ref, inView] = useInView();
  const rows = [
    ['09:00', 'Registro y acreditación', 'Networking'],
    ['09:30', 'Apertura institucional', 'Apertura'],
    ['09:45', 'Keynote: Estado del Arte de la IA Agéntica', 'Keynote', true],
    ['10:30', 'Guardrails, Compliance y Regulación', 'Sesión'],
    ['11:15', 'Networking Coffee', 'Pausa'],
    ['11:45', 'Federated Learning y Privacidad de Datos', 'Sesión'],
    ['12:30', 'Arquitecturas del Conocimiento', 'Sesión'],
    ['13:15', 'Panel: Futuro del Software y Ciberseguridad', 'Panel'],
    ['14:00', 'Cóctel y Networking', 'Networking', true],
  ];
  return (
    <section className="section" id="agenda" ref={ref}>
      <div className={`container reveal ${inView ? 'in-view' : ''}`}>
        <div className="section-header">
          <span className="eyebrow">Agenda · 16 de junio</span>
          <h2>Una jornada de alto nivel diseñada para la acción.</h2>
          <p className="lead">Ponencias de 30 minutos con Q&amp;A abierto, diseñadas para los retos reales de las compañías aseguradoras. El programa recoge retos sectoriales propuestos por las entidades participantes.</p>
        </div>
        <div className="agenda-table">
          {rows.map(([time, title, tag, highlight], i) => (
            <div className={`agenda-row ${highlight ? 'highlight' : ''}`} key={i}>
              <div className="agenda-time">{time}</div>
              <div className="agenda-title">{title}</div>
              <div className="agenda-tag">{tag}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Audiencia ----------
function Audience() {
  const [ref, inView] = useInView();
  return (
    <section className="section" id="audiencia" ref={ref}>
      <div className={`container reveal ${inView ? 'in-view' : ''}`}>
        <div className="section-header">
          <span className="eyebrow">Perfil de la Audiencia</span>
          <h2>150 decisores. Cada inscripción, validada.</h2>
          <p className="lead">Diseñado para los máximos responsables de compañías aseguradoras: vida y no vida, mutuas, reaseguradoras y grupos con presencia en distribución digital. Aforo limitado para garantizar networking real.</p>
        </div>
        <div className="audience-grid">
          <div className="audience-card">
            <h3>Perfil de los asistentes</h3>
            <ul className="audience-list" role="list">
              <li>CEOs y Directores Generales</li>
              <li>CIOs, CTOs y Chief AI Officers</li>
              <li>Directores de Suscripción y Actuariales</li>
              <li>Directores de Siniestros y Operaciones</li>
              <li>Directores de Innovación y Transformación Digital</li>
              <li>Responsables de Compliance y Regulación</li>
              <li>Directores de Distribución y Canales Digitales</li>
            </ul>
          </div>
          <div className="audience-card">
            <h3>Entidades representadas</h3>
            <ul className="audience-list" role="list">
              <li>Compañías aseguradoras de vida y salud</li>
              <li>Aseguradoras de no vida (automóvil, hogar, multirriesgo, RC)</li>
              <li>Mutuas y mutualidades de previsión social</li>
              <li>Grupos aseguradores con actividad en distribución digital</li>
              <li>Reaseguradoras con actividad en el mercado español</li>
              <li>Reguladores e instituciones públicas (DGSFP, CNSS)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Paquetes ----------
function Packages({ vertical }) {
  const tierNames = vertical.tierNames;
  const [ref, inView] = useInView(0.05);
  return (
    <section className="section" id="paquetes" ref={ref}>
      <div className={`container reveal ${inView ? 'in-view' : ''}`}>
        <div className="section-header">
          <span className="eyebrow">Modalidades de Participación · {vertical.tierLabel}</span>
          <h2>Tres formas de contribuir. Plazas limitadas.</h2>
          <p className="lead">Cada modalidad define el nivel de contribución institucional, acceso editorial y participación en el programa. Sin stands, sin ferias, sin intervenciones comerciales.</p>
        </div>

        <div className="tiers-intro">
          {vertical.tiers.map((t, i) => (
            <div className={`tier-headcard ${['gold','silver','bronze'][i]}`} key={i}>
              <div className="tier-seats">{t.total} plaza{t.total !== 1 ? 's' : ''} · quedan {t.remaining}</div>
              <div className="tier-name">{tierNames[i]}</div>
              <div className="tier-availability">
                <div className="dots">
                  {Array.from({ length: t.total }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`dot ${idx < t.remaining ? ['gold-full','silver-full','bronze-full'][i] : ''}`}
                    ></span>
                  ))}
                </div>
              </div>
              <div className="tier-price">
                {t.price > 0 ? (
                  <>
                    <span className="amount">{t.price.toLocaleString('es-ES')}</span>
                    <span className="cur">€</span>
                    <span className="vat">+ IVA</span>
                  </>
                ) : (
                  <span className="amount" style={{ fontSize: 22, color: 'var(--ink-2)', fontFamily: 'var(--ff-body)' }}>Por invitación</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="compare-table-wrap">
          <CompareTable tierNames={tierNames} tiers={vertical.tiers} />
        </div>

        {vertical.tiers.map((t, i) => (
          <TierDetail key={i} tier={t} name={tierNames[i]} level={['gold','silver','bronze'][i]} />
        ))}
      </div>
    </section>
  );
}

function CompareTable({ tierNames, tiers }) {
  const yes = <span className="check"><IconCheck size={16} /></span>;
  const no = <span className="cross"><IconX size={14} /></span>;
  return (
    <table className="compare-table">
      <thead>
        <tr>
          <th style={{ textAlign: 'left' }}>Prestación</th>
          <th className="tier-gold">{tierNames[0]}</th>
          <th className="tier-silver">{tierNames[1]}</th>
          <th className="tier-bronze">{tierNames[2]}</th>
        </tr>
      </thead>
      <tbody>
        <tr className="section-row"><td colSpan="4">Contribución al Programa</td></tr>
        <tr><td className="feature">Directivo en mesa editorial principal</td><td>{yes}</td><td className="highlight">Opcional</td><td>{no}</td></tr>
        <tr><td className="feature">Propuesta de reto sectorial al programa</td><td>{yes}</td><td>{no}</td><td>{no}</td></tr>
        <tr><td className="feature">Mención institucional en apertura y cierre</td><td>{yes}</td><td>{yes}</td><td>{no}</td></tr>
        <tr><td className="feature">Roundtable privada (8–12 directivos pares)</td><td>{yes}</td><td>{no}</td><td>{no}</td></tr>

        <tr className="section-row"><td colSpan="4">Visibilidad Institucional</td></tr>
        <tr><td className="feature">Logo en materiales del foro</td><td className="highlight">Impulsora</td><td>Colaboradora</td><td>{no}</td></tr>
        <tr><td className="feature">Presencia en acreditaciones</td><td>{yes}</td><td>{yes}</td><td>{no}</td></tr>
        <tr><td className="feature">Cobranding en informe post-evento</td><td>{yes}</td><td>{no}</td><td>{no}</td></tr>
        <tr><td className="feature">Menciones en RRSS + Newsletter IIA</td><td className="highlight">Periódica + destacada</td><td>{yes}</td><td>{no}</td></tr>
        <tr><td className="feature">Nota de prensa oficial</td><td>{yes}</td><td>{yes}</td><td>{no}</td></tr>

        <tr className="section-row"><td colSpan="4">Acceso y Networking</td></tr>
        <tr><td className="feature">Invitaciones VIP incluidas</td><td className="highlight">12</td><td>6</td><td>1–3</td></tr>
        <tr><td className="feature">Sesión privada de scouting con proveedores</td><td>{yes}</td><td>{no}</td><td>{no}</td></tr>
        <tr><td className="feature">Mesa reservada en networking y cóctel</td><td>{yes}</td><td>{no}</td><td>{no}</td></tr>
        <tr><td className="feature">Introducciones 1:1 opt-in facilitadas</td><td>{yes}</td><td>{no}</td><td>{no}</td></tr>

        <tr className="section-row"><td colSpan="4">Activos Post-Evento</td></tr>
        <tr><td className="feature">Informe ejecutivo para comité de dirección</td><td className="highlight">Personalizado</td><td>Estándar</td><td>{no}</td></tr>
        <tr><td className="feature">Benchmark cualitativo del sector</td><td>{yes}</td><td>{yes}</td><td>{no}</td></tr>
        <tr><td className="feature">Mapa de proveedores filtrados</td><td>{yes}</td><td>{yes}</td><td>{no}</td></tr>
        <tr><td className="feature">Acceso a grabaciones de sesiones</td><td>{yes}</td><td>{yes}</td><td>{no}</td></tr>

        <tr className="section-row"><td colSpan="4">Participación</td></tr>
        <tr>
          <td className="feature">Inversión (+ IVA)</td>
          <td className="highlight">{tiers[0].price.toLocaleString('es-ES')} €</td>
          <td className="highlight">{tiers[1].price.toLocaleString('es-ES')} €</td>
          <td className="highlight">Por invitación</td>
        </tr>
      </tbody>
    </table>
  );
}

function TierDetail({ tier, name, level }) {
  const areas = [
    {
      title: 'Contribución al Programa',
      items: level === 'gold'
        ? [['Mesa editorial principal', <><strong>Un directivo de vuestra compañía</strong> en mesa de alto nivel</>], ['Propuesta de reto sectorial al comité de programa', true], ['Mención institucional en apertura y cierre del foro', true], ['Roundtable privada con 8–12 directivos pares', true]]
        : level === 'silver'
        ? [['Mesa editorial', <>Participación <strong>opcional</strong> si aporta contenido real</>], ['Propuesta de reto sectorial', false], ['Mención en materiales del programa', true], ['Roundtable privada', false]]
        : [['Mesa editorial principal', false], ['Propuesta de reto sectorial', false], ['Mención institucional', false], ['Asistencia como entidad invitada', true]]
    },
    {
      title: 'Visibilidad Institucional',
      items: level === 'gold'
        ? [['Logo', <><strong>Entidad Impulsora</strong> — posición principal en materiales</>], ['Cobranding en informe post-evento', true], ['Menciones en RRSS', <><strong>Periódicas y destacadas</strong></>], ['Newsletter IIA (3.000+ alumni)', true], ['Nota de prensa oficial', true], ['Presencia en acreditaciones y señalización', true]]
        : level === 'silver'
        ? [['Logo', <><strong>Entidad Colaboradora</strong> en materiales del foro</>], ['Cobranding en informe post-evento', false], ['Menciones en RRSS', true], ['Newsletter IIA (3.000+ alumni)', true], ['Nota de prensa oficial', true], ['Presencia en acreditaciones', true]]
        : [['Logo en materiales', false], ['Cobranding', false], ['Menciones en RRSS', false], ['Newsletter IIA', false], ['Nota de prensa', false], ['Acreditaciones de entidad', false]]
    },
    {
      title: 'Acceso y Networking',
      items: level === 'gold'
        ? [['Invitaciones VIP', <><strong>12 invitaciones</strong> (comité, actuarial, siniestros, tecnología)</>], ['Sesión privada de scouting con proveedores de IA', true], ['Mesa reservada en networking y cóctel', true], ['Introducciones 1:1 opt-in facilitadas por el equipo', true]]
        : level === 'silver'
        ? [['Invitaciones VIP', <><strong>6 invitaciones</strong> incluidas</>], ['Sesión privada de scouting', false], ['Mesa reservada en networking', false], ['Introducciones 1:1', false]]
        : [['Invitaciones institucionales', <><strong>1–3 invitaciones</strong> por invitación</>], ['Sesión privada de scouting', false], ['Mesa reservada', false], ['Introducciones 1:1', false]]
    },
    {
      title: 'Activos Post-Evento',
      items: level === 'gold'
        ? [['Informe ejecutivo', <><strong>Personalizado</strong> para vuestro comité de dirección</>], ['Benchmark cualitativo del sector asegurador', true], ['Mapa de proveedores filtrados y casos de uso', true], ['Acceso completo a grabaciones de sesiones', true]]
        : level === 'silver'
        ? [['Informe ejecutivo', <>Edición <strong>estándar</strong> del sector</>], ['Benchmark cualitativo del sector', true], ['Mapa de proveedores', true], ['Acceso a grabaciones de sesiones', true]]
        : [['Informe ejecutivo', false], ['Benchmark sectorial', false], ['Mapa de proveedores', false], ['Acceso a grabaciones', false]]
    }
  ];

  return (
    <div className={`tier-detail ${level}`}>
      <div className="tier-detail-aside">
        <div className="tag">Desglose · {tier.total} plaza{tier.total !== 1 ? 's' : ''}</div>
        <h3>{name}</h3>
        <div className="price-line">
          {tier.price > 0
            ? <>Inversión: <strong>{tier.price.toLocaleString('es-ES')} €</strong> + IVA<br />Quedan <strong>{tier.remaining}</strong> de {tier.total}</>
            : <>Acceso <strong>por invitación institucional</strong><br />{tier.remaining} plazas disponibles</>
          }
        </div>
        <a href="#reservar" className="btn btn-ghost btn-sm">Solicitar información <IconArrow /></a>
      </div>
      <div className="tier-detail-areas">
        {areas.map((area, i) => (
          <div className="tier-area" key={i}>
            <h4>{area.title}</h4>
            <ul>
              {area.items.map(([label, val], j) => {
                const active = val !== false;
                return (
                  <li key={j} className={active ? '' : 'off'}>
                    <span className="ic">{active ? <IconCheck /> : <IconX />}</span>
                    <span>
                      {label}
                      {typeof val !== 'boolean' && val !== undefined && <>: {val}</>}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Reservar llamada (Cal.com embed) ----------
function BookCall({ vertical }) {
  const [ref, inView] = useInView();
  return (
    <section className="section" id="reservar" ref={ref}>
      <div className={`container reveal ${inView ? 'in-view' : ''}`}>
        <div className="section-header center">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Próximo paso</span>
          <h2>Habla con el equipo antes de decidir.</h2>
          <p className="lead" style={{ margin: '0 auto' }}>60 minutos para entender los detalles, resolver dudas y diseñar la modalidad que mejor encaja con vuestros objetivos. Sin compromiso.</p>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', background: 'var(--bg-1)', border: '1px solid var(--line)', borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
          <iframe
            src="https://cal.com/segurosia/prioritaria?duration=60"
            title="Reservar llamada"
            style={{ width: '100%', height: 780, border: 0, display: 'block', background: 'transparent' }}
            loading="lazy"
          />
        </div>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--ink-3)' }}>
          ¿Prefieres escribir? <a href="mailto:hola@inteligenciaartificialagentica.com" style={{ color: 'var(--accent)' }}>hola@inteligenciaartificialagentica.com</a>
        </p>
      </div>
    </section>
  );
}

// ---------- Formulario de adhesión (Tally embed) ----------
function Adhesion({ vertical }) {
  const iframeRef = useRef(null);
  useEffect(() => {
    const onMsg = (e) => {
      if (e.origin !== 'https://tally.so') return;
      try {
        const d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (d && d.event === 'Tally.FormHeightChanged' && iframeRef.current) {
          iframeRef.current.style.height = d.payload.height + 'px';
        }
      } catch (_) {}
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);
  return (
    <section className="section" id="adhesion">
      <div className="container">
        <div className="section-header center">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Formulario de Adhesión</span>
          <h2>¿Ya tenéis claro lo que queréis? Formalizadlo aquí.</h2>
          <p className="lead" style={{ margin: '0 auto' }}>Rellena el formulario y nuestro equipo os enviará el acuerdo de participación y la factura en menos de 24 horas.</p>
        </div>
        <div style={{ maxWidth: 780, margin: '0 auto', background: 'var(--bg-1)', border: '1px solid var(--line)', borderRadius: 'var(--r-xl)', padding: 32 }}>
          <iframe
            ref={iframeRef}
            src="https://tally.so/embed/obVl7N?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            width="100%"
            height="480"
            frameBorder="0"
            title="Formulario de Adhesión"
            style={{ border: 0, display: 'block', background: 'transparent' }}
          />
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center', marginTop: 20, marginBottom: 0 }}>
          Forma de pago: envío de factura a la firma del acuerdo. A todos los precios se suma IVA.
        </p>
      </div>
    </section>
  );
}

// ---------- Footer ----------
function Footer({ vertical }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="#" className="brand">
              <span className="brand-dot"></span>
              <span>IA Agéntica</span>
            </a>
            <p style={{ fontSize: 13, color: 'var(--ink-3)', maxWidth: 320, marginTop: 16 }}>
              El primer foro de IA Agéntica para compañías aseguradoras en España. 16 de junio de 2026, Auditorio Beatriz Madrid.
            </p>
          </div>
          <div>
            <h5>Participación</h5>
            <ul>
              <li><a href="#paquetes">Modalidades</a></li>
              <li><a href="#reservar">Hablar con el equipo</a></li>
              <li><a href="#adhesion">Formulario</a></li>
            </ul>
          </div>
          <div>
            <h5>Foro</h5>
            <ul>
              <li><a href="#foro">El Foro</a></li>
              <li><a href="#agenda">Agenda</a></li>
              <li><a href="#verticales">Verticales</a></li>
            </ul>
          </div>
          <div>
            <h5>Contacto</h5>
            <ul>
              <li><a href="mailto:hola@inteligenciaartificialagentica.com">hola@inteligenciaartificialagentica.com</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 COBERIO, S.L. · SegurosIA · Todos los derechos reservados</div>
          <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
            Sponsorship {vertical.label} · Edición I · 2026
          </div>
        </div>
      </div>
    </footer>
  );
}

// ---------- Page ----------
function Page({ vertical }) {
  return (
    <>
      <Nav vertical={vertical} />
      <main id="main-content">
        <Hero vertical={vertical} />
        <Stats />
        <AboutForo />
        <Moment />
        <About />
        <Verticals />
        <Agenda />
        <Audience />
        <Packages vertical={vertical} />
        <BookCall vertical={vertical} />
        <Adhesion vertical={vertical} />
        <Footer vertical={vertical} />
      </main>
    </>
  );
}

// Expose globally
Object.assign(window, { Page });
