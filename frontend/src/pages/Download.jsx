import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { filesAPI } from '../utils/api';

function Download() {
  const { shortUrl } = useParams();
  const [fileInfo, setFileInfo] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadFileInfo();
  }, [shortUrl]);

  const loadFileInfo = async () => {
    try {
      const response = await filesAPI.getFileInfo(shortUrl);
      setFileInfo(response.data.file);
    } catch (err) {
      setError(err.response?.data?.message || 'File not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (fileInfo.requiresPin && !pin) {
      setError('Please enter the security PIN');
      return;
    }

    setDownloading(true);
    setError('');

    try {
      const response = await filesAPI.downloadFile(shortUrl, pin);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileInfo.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.response?.data?.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem 0' }}>
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error && !fileInfo) {
    return (
      <div style={{ padding: '3rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--text-black)' }}>File Not Found</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{error}</p>
            <a href="/" className="btn btn-primary">Go Home</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-black)' }}>
              {fileInfo.originalName}
            </h2>
            <p style={{ color: '#6b7280' }}>
              {(fileInfo.fileSize / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          {/* Share link & QR code */}
          {fileInfo.shareUrl && (
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Share Link:</strong></p>
              <input
                type="text"
                value={fileInfo.shareUrl}
                readOnly
                className="form-input"
                onClick={(e) => e.target.select()}
                style={{ marginBottom: '0.75rem' }}
              />
            </div>
          )}

          {fileInfo.qrCode && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p><strong>QR Code:</strong></p>
              <img src={fileInfo.qrCode} alt="QR Code" style={{ maxWidth: '200px', margin: '0.5rem auto' }} />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
              <strong>Downloads:</strong> {fileInfo.downloadCount}
            </p>
            <p style={{ color: '#6b7280' }}>
              <strong>Expires:</strong> {new Date(fileInfo.expiresAt).toLocaleDateString()}
            </p>
          </div>

          {fileInfo.requiresPin && (
            <div className="form-group">
              <label className="form-label">Security PIN</label>
              <input
                type="text"
                className="form-input"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN"
                maxLength="6"
              />
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={handleDownload}
            disabled={downloading}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {downloading ? 'Downloading...' : '⬇️ Download File'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Download;
