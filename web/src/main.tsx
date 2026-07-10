import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function Stars() {
  const [rating, setRating] = useState(0);
  return <div className="stars">
    {[1,2,3,4,5].map(n =>
      <button key={n} className={n <= rating ? 'active' : ''}
        onClick={() => setRating(n)} aria-label={`${n} stars`}>★</button>
    )}
    <span>{rating ? `${rating}/5` : 'Not rated'}</span>
  </div>;
}

function App() {
  return <main>
    <header>
      <div><h1>StarTune</h1><p>Music ratings and smart playlists for Jellyfin</p></div>
      <button>Connect to Jellyfin</button>
    </header>
    <section className="panel"><input placeholder="Search tracks, artists, or albums…" /></section>
    <section className="layout">
      <aside className="panel">
        <h2>Library</h2>
        <nav><button>Recently added</button><button>Favorites</button><button>Most played</button><button>★★★★★</button></nav>
      </aside>
      <article className="panel"><h2>Prototype track</h2><p>Select a Jellyfin track here.</p><Stars /></article>
    </section>
  </main>;
}

createRoot(document.getElementById('root')!).render(<App />);
