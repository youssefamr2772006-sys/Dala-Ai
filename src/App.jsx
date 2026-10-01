import { useMemo, useState } from 'react';

const hemispherePath =
  'M300 63 C280 38 249 34 224 49 C202 23 164 25 145 54 C115 36 79 54 77 86 C43 80 26 111 42 139 C13 155 18 193 43 211 C20 235 34 270 59 282 C40 310 60 344 91 346 C92 380 126 397 155 378 C177 406 218 397 238 371 C266 385 291 366 300 341 Z';
const brainColors = ['#8052ff', '#a16aff', '#ffb829', '#38bd9a', '#d85cff', '#7b9cff'];

function createParticles() {
  let seed = 2026;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  return Array.from({ length: 540 }, (_, index) => {
    const x = 34 + random() * 532;
    const y = 30 + random() * 378;
    const size = 2.4 + random() * 3.5;
    const points = `${x},${y - size} ${x + size * 0.86},${y + size * 0.6} ${x - size * 0.86},${y + size * 0.6}`;

    return {
      id: index,
      points,
      color: brainColors[Math.floor(random() * brainColors.length)],
      opacity: 0.36 + random() * 0.64,
      delay: `${(random() * -5).toFixed(2)}s`,
    };
  });
}

function BrainIllustration() {
  const particles = useMemo(createParticles, []);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    setRotation({
      x: (mouseY - centerY) / centerY * 8,
      y: (mouseX - centerX) / centerX * 12,
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      className="brain-visual"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="brain-halo" />
      <div className="brain-perspective-container">
        <svg
          className="brain-svg"
          viewBox="0 0 600 440"
          role="img"
          aria-labelledby="brain-title brain-description"
          style={{
            transform: `perspective(1400px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(0deg)`,
            transition: rotation.x === 0 && rotation.y === 0 ? 'transform 0.6s ease-out' : 'none',
          }}
        >
          <title id="brain-title">A 3D brain formed from a constellation of ideas</title>
          <desc id="brain-description">
            Hundreds of colorful, softly glowing triangular particles form two connected brain hemispheres in 3D space.
          </desc>
          <defs>
            <clipPath id="brain-shape">
              <path d={hemispherePath} />
              <path d={hemispherePath} transform="translate(600 0) scale(-1 1)" />
            </clipPath>
            <radialGradient id="brain-wash">
              <stop offset="0%" stopColor="#8052ff" stopOpacity=".22" />
              <stop offset="100%" stopColor="#8052ff" stopOpacity="0" />
            </radialGradient>
            <filter id="brain-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="brain-stroke" x1="0" x2="1" y1="0" y2="1">
              <stop stopColor="#8052ff" stopOpacity=".62" />
              <stop offset=".48" stopColor="#ffb829" stopOpacity=".38" />
              <stop offset="1" stopColor="#38bd9a" stopOpacity=".55" />
            </linearGradient>
          </defs>
          <ellipse cx="300" cy="215" rx="244" ry="190" fill="url(#brain-wash)" />
          <g clipPath="url(#brain-shape)" filter="url(#brain-glow)">
            {particles.map((particle) => (
              <polygon
                className="brain-particle"
                key={particle.id}
                points={particle.points}
                fill={particle.color}
                opacity={particle.opacity}
                style={{
                  '--twinkle-delay': particle.delay,
                  filter: `drop-shadow(0 0 ${2 + Math.random() * 3}px ${particle.color})`,
                }}
              />
            ))}
          </g>
          <g className="brain-outlines" style={{ filter: 'drop-shadow(0 0 8px rgba(128,82,255,.4))' }}>
            <path d={hemispherePath} fill="none" stroke="url(#brain-stroke)" strokeWidth="1.4" />
            <path d={hemispherePath} fill="none" stroke="url(#brain-stroke)" strokeWidth="1.4" transform="translate(600 0) scale(-1 1)" />
          </g>
          <path
            className="brain-fold"
            d="M300 68 C282 93 310 112 294 137 C279 160 311 179 293 204 C278 228 310 250 294 274 C281 296 306 318 300 341"
            fill="none"
          />
          <g className="brain-detail" style={{ filter: 'drop-shadow(0 0 4px rgba(255,184,41,.5))' }}>
            <path d="M98 119 C128 126 129 151 111 168 M172 77 C196 94 183 116 165 127 M83 248 C112 230 129 249 120 271 M187 331 C207 309 229 321 231 342 M502 119 C472 126 471 151 489 168 M428 77 C404 94 417 116 435 127 M517 248 C488 230 471 249 480 271 M413 331 C393 309 371 321 369 342" />
          </g>
          <g className="brain-depth-layers" opacity="0.15" style={{ filter: 'blur(3px)' }}>
            <path d={hemispherePath} fill="none" stroke="#8052ff" strokeWidth="2" transform="translate(-8 -8)" />
            <path d={hemispherePath} fill="none" stroke="#8052ff" strokeWidth="2" transform="translate(-8 -8) translate(600 0) scale(-1 1)" />
          </g>
        </svg>
      </div>
      <div className="brain-caption">
        <span className="caption-pulse" />
        <span>One shared intelligence</span>
      </div>
    </div>
  );
}

const answerExamples = [
  {
    keywords: ['customer', 'interview', 'feedback', 'user'],
    title: 'Customers want fewer handoffs, not more features.',
    source: 'Customer interviews · Product research · 8 sources',
  },
  {
    keywords: ['launch', 'campaign', 'brand', 'marketing'],
    title: 'The strongest launch story starts with the problem we solve.',
    source: 'Brand workshop · Launch brief · 6 sources',
  },
  {
    keywords: ['decision', 'why', 'context', 'project'],
    title: 'The team chose speed-to-learning over scope for this quarter.',
    source: 'Planning notes · Team discussion · 5 sources',
  },
];

function KnowledgeDemo() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = (event) => {
    event.preventDefault();
    if (!query.trim()) return;

    const example = answerExamples.find((item) =>
      item.keywords.some((keyword) => query.toLowerCase().includes(keyword)),
    );

    setResult({
      title: example?.title ?? 'The answer is taking shape across your team’s shared knowledge.',
      source: example?.source ?? 'Team knowledge · Related notes · 4 sources',
    });
  };

  return (
    <div className="knowledge-demo">
      <div className="demo-topline">
        <span className="demo-status"><i /> Dala knowledge</span>
        <span className="demo-shortcut">A better question changes everything</span>
      </div>
      <form className="search-form" onSubmit={handleSearch}>
        <span className="search-glyph" aria-hidden="true">⌕</span>
        <input
          aria-label="Ask your team's knowledge"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask what your team already knows..."
          value={query}
        />
        <button type="submit" aria-label="Search knowledge">↗</button>
      </form>
      {result ? (
        <div className="search-result" aria-live="polite">
          <span className="result-label">A signal from your team</span>
          <p>{result.title}</p>
          <span className="result-source">{result.source}</span>
        </div>
      ) : (
        <div className="suggested-questions">
          <span>Try asking</span>
          {['What did customers ask for?', 'Why did we choose this direction?'].map((suggestion) => (
            <button key={suggestion} type="button" onClick={() => setQuery(suggestion)}>
              {suggestion} <span>↗</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Dala home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>Dala</span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>

        <nav id="primary-navigation" className={menuOpen ? 'primary-nav is-open' : 'primary-nav'}>
          <a href="#manifesto" onClick={closeMenu}>Manifesto</a>
          <a href="#product" onClick={closeMenu}>Product</a>
          <a href="#approach" onClick={closeMenu}>Approach</a>
          <a href="#journal" onClick={closeMenu}>Journal</a>
          <a className="button button-small" href="mailto:hello@dala.ai?subject=Request%20early%20access">Request access <span>↗</span></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-wrap">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> The intelligence between us</p>
            <h1>Good ideas<br />don&apos;t work<br /><em>alone.</em></h1>
            <p className="hero-description">
              Your team already has the answers. Dala connects the dots between
              people, ideas, and decisions — so the next great one can find you.
            </p>
            <div className="hero-actions">
              <a className="button" href="#product">Meet your team&apos;s second brain <span>↘</span></a>
              <a className="text-link" href="#manifesto">Get to know Dala <span>↓</span></a>
            </div>
            <p className="hero-footnote"><span>✳</span> Made for teams that think together.</p>
          </div>
          <div className="hero-art">
            <BrainIllustration />
            <p className="art-note">Many minds.<br /><span>One living memory.</span></p>
          </div>
          <a className="scroll-cue" href="#manifesto" aria-label="Scroll to discover Dala"><span /> Scroll to discover</a>
        </section>

        <section className="manifesto section-wrap" id="manifesto">
          <p className="section-index">01 <span>/</span> The idea</p>
          <div className="manifesto-content">
            <h2>Knowledge is<br />better <span>when it<br />finds its people.</span></h2>
            <div className="manifesto-copy">
              <p>
                The best thinking is already happening — in a meeting note,
                a customer call, a message sent six months ago. Dala makes
                those fragments add up to something bigger.
              </p>
              <a className="text-link" href="#product">See how it comes together <span>↘</span></a>
            </div>
          </div>
          <div className="manifesto-signoff">
            <span>Not another place to put things.</span>
            <span>A new way to find meaning in them. <b>✳</b></span>
          </div>
        </section>

        <section className="product section-wrap" id="product">
          <div className="section-heading">
            <p className="section-index">02 <span>/</span> The product</p>
            <div>
              <h2>Ask a better<br /><span>question.</span></h2>
              <p className="section-intro">
                Dala listens across the conversations, documents, and decisions
                that make your team yours. Start anywhere.
              </p>
            </div>
          </div>
          <KnowledgeDemo />
          <div className="product-footnote">
            <span>Connected context, not just search.</span>
            <span>Every answer knows where it came from. <b>↗</b></span>
          </div>
        </section>

        <section className="approach section-wrap" id="approach">
          <div className="approach-heading">
            <p className="section-index">03 <span>/</span> The difference</p>
            <h2>From scattered<br />to <span>in sync.</span></h2>
          </div>
          <div className="flow-illustration" aria-label="Dala connects people, ideas, and decisions">
            <div className="flow-source">
              <span className="flow-orbit orbit-one">People</span>
              <span className="flow-orbit orbit-two">Ideas</span>
              <span className="flow-orbit orbit-three">Decisions</span>
              <span className="flow-center">Your team</span>
            </div>
            <span className="flow-arrow" aria-hidden="true">⟶</span>
            <div className="flow-dala">
              <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
              <span>Dala</span>
              <small>Connects the dots</small>
            </div>
            <span className="flow-arrow" aria-hidden="true">⟶</span>
            <div className="flow-outcome">
              <span className="outcome-spark">✳</span>
              <strong>Clarity</strong>
              <small>that moves you forward</small>
            </div>
          </div>
          <div className="principles">
            <article>
              <span className="principle-number">01</span>
              <h3>Context, connected.</h3>
              <p>See how conversations, customer needs, and decisions relate — not just where they live.</p>
            </article>
            <article>
              <span className="principle-number">02</span>
              <h3>Answers with roots.</h3>
              <p>Follow every useful signal back to its source, and bring the right people into view.</p>
            </article>
            <article>
              <span className="principle-number">03</span>
              <h3>Room for what&apos;s next.</h3>
              <p>Spend less time retracing old ground and more time making a new kind of progress.</p>
            </article>
          </div>
        </section>

        <section className="journal section-wrap" id="journal">
          <div>
            <p className="section-index">04 <span>/</span> A thought to keep</p>
            <h2>Good work is<br /><span>a group project.</span></h2>
          </div>
          <div className="journal-aside">
            <p>And the best teams don&apos;t just share a goal. They share the thinking that gets them there.</p>
            <a className="text-link" href="mailto:hello@dala.ai?subject=Let%27s%20talk%20about%20Dala">Let&apos;s think together <span>↗</span></a>
          </div>
          <span className="journal-watermark" aria-hidden="true">✳</span>
        </section>

        <section className="closing section-wrap">
          <div className="closing-orb" aria-hidden="true"><span /><span /><span /></div>
          <p className="section-index">The next idea is already here.</p>
          <h2>Let&apos;s find it<br /><span>together.</span></h2>
          <a className="button" href="mailto:hello@dala.ai?subject=I%27m%20curious%20about%20Dala">Say hello to Dala <span>↗</span></a>
        </section>
      </main>

      <footer className="site-footer section-wrap">
        <a className="brand" href="#top" aria-label="Dala home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>Dala</span>
        </a>
        <p>© 2026 Dala intelligence</p>
        <a href="mailto:hello@dala.ai">hello@dala.ai <span>↗</span></a>
        <a href="https://github.com/youssefamr2772006-sys" target="_blank" rel="noopener noreferrer">GitHub · youssefamr2772006-sys</a>
        <div className="human-badge">Handcrafted by humans — no generative AI used</div>
        <a href="#top" className="back-to-top">Back to the top ↑</a>
      </footer>
    </div>
  );
}

export default App;
