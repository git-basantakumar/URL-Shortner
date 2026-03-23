'use client';

import { useState } from 'react';

export default function Home() {
  const [targetUrl, setTargetUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');
    setCopied(false);

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUrl, alias: alias.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setShortUrl(data.shortUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="container">
      <div className="header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* <img src="/ziplink-logo.png" alt="ZipLink Logo" style={{ width: '120px', height: '120px', objectFit: 'contain', mixBlendMode: 'screen', marginBottom: '1rem' }} /> */}
        <h1 className="title" style={{ marginTop: 0 }}>ZipLink</h1>
        <p className="subtitle">Shorten your links with a premium touch.</p>
      </div>

      <div className="glass-panel">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="targetUrl">Destination URL</label>
            <input
              id="targetUrl"
              type="url"
              className="form-input"
              placeholder="https://example.com/very/long/url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="alias">Custom Alias (Optional)</label>
            <input
              id="alias"
              type="text"
              className="form-input"
              placeholder="my-custom-link"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              pattern="[A-Za-z0-9\-_]+"
              title="Only letters, numbers, hyphens, and underscores allowed"
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? <div className="spinner"></div> : 'Shorten URL'}
          </button>
        </form>

        {error && <div className="message error">{error}</div>}

        {shortUrl && (
          <div className="result-container">
            <div className="result-title">Success! Here is your short URL:</div>
            <div className="short-url-box">
              <div className="short-url-text">{shortUrl}</div>
              <button
                type="button"
                className="btn-copy"
                onClick={handleCopy}
                aria-label="Copy to clipboard"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="footer" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', textAlign: 'center', padding: '1.5rem', color: '#888', background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)' }}>
        Made with ❤️ by <a href="https://instagram.com/basantakumar_mahanta" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'underline', fontWeight: 600 }}>BasantaKumar</a>
      </footer>
    </main>
  );
}
