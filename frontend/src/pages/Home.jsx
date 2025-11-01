import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { filesAPI } from '../utils/api';

function Home() {
  const [file, setFile] = useState(null);
  const [pin, setPin] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setError('');
      }
    },
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (pin) {
        formData.append('securityPin', pin);
      }

      const response = await filesAPI.upload(formData);
      setUploadResult(response.data.file);
      setFile(null);
      setPin('');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 50%, #10d876 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 20px rgba(0, 255, 136, 0.3))' }}>
            ⚡ Lightning Fast File Sharing
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#a1a1aa' }}>
            Share files instantly with military-grade encryption & QR codes ✨
          </p>
        </div>

        {/* Tier Information */}
        <div className="tier-cards-container">
          <div className="tier-card tier-card-anonymous">
            <div className="tier-card-header">
              <div className="tier-icon tier-icon-anonymous">
                🕶
              </div>
              <div>
                <h3 className="tier-card-title tier-card-title-anonymous">Guest </h3>
                <span className="tier-badge tier-badge-basic">Limited Access</span>
              </div>
            </div>
            <div className="tier-card-price">
              <span className="tier-card-price-main">Free</span>
            </div>
            <ul className="tier-card-features">
              <li className="tier-card-feature">
                <span className="tier-card-feature-icon tier-card-feature-icon-anonymous">⚠️</span>
                Only 5MB file size
              </li>
              <li className="tier-card-feature">
                <span className="tier-card-feature-icon tier-card-feature-icon-anonymous">⏰</span>
                Expires in 24 hours
              </li>
              <li className="tier-card-feature">
                <span className="tier-card-feature-icon tier-card-feature-icon-anonymous">📤</span>
                Basic sharing only
              </li>
              <li className="tier-card-feature tier-feature-disabled">
                <span className="tier-card-feature-icon tier-card-feature-icon-disabled">❌</span>
                No file history
              </li>
              <li className="tier-card-feature tier-feature-disabled">
                <span className="tier-card-feature-icon tier-card-feature-icon-disabled">❌</span>
                No security features
              </li>
            </ul>
          </div>

          <div className="tier-card tier-card-signed">
            <div className="tier-card-header">
              <div className="tier-icon tier-icon-signed">
                ✪
              </div>
              <div>
                <h3 className="tier-card-title tier-card-title-signed">Pro</h3>
                <span className="tier-badge tier-badge-pro">Good Value</span>
              </div>
            </div>
            <div className="tier-card-price">
              <span className="tier-card-price-main">Free</span>
              <span className="tier-card-price-period">with signup</span>
            </div>
            <ul className="tier-card-features">
              <li className="tier-card-feature">
                <span className="tier-card-feature-icon tier-card-feature-icon-signed">✅</span>
                Up to 50MB files
              </li>
              <li className="tier-card-feature">
                <span className="tier-card-feature-icon tier-card-feature-icon-signed">📅</span>
                7 days storage
              </li>
              <li className="tier-card-feature">
                <span className="tier-card-feature-icon tier-card-feature-icon-signed">📋</span>
                Basic file history
              </li>
              <li className="tier-card-feature">
                <span className="tier-card-feature-icon tier-card-feature-icon-signed">🔒</span>
                PIN protection
              </li>
              <li className="tier-card-feature tier-feature-disabled">
                <span className="tier-card-feature-icon tier-card-feature-icon-disabled">❌</span>
                No analytics
              </li>
            </ul>
            <button 
              className="tier-card-cta tier-card-cta-signed"
              onClick={() => navigate('/register')}
            >
              Sign-up
            </button>
          </div>

          <div className="tier-card tier-card-premium tier-card-spotlight">
            <div className="tier-card-header">
              <div className="tier-icon tier-icon-premium">
                🜲
              </div>
              <div>
                <h3 className="tier-card-title tier-card-title-premium">Premium</h3>
                <span className="tier-badge tier-badge-premium">Best Value</span>
              </div>
            </div>
            <div className="tier-card-price">
              <span className="tier-card-price-main">₹99</span>
              <span className="tier-card-price-period">/month</span>
              <div className="price-comparison">
                <span className="original-price">₹299</span>
                <span className="discount-badge">67% OFF</span>
              </div>
            </div>
            <ul className="tier-card-features">
              <li className="tier-card-feature">
                <span className="tier-card-feature-icon tier-card-feature-icon-premium">🚀</span>
                Up to 500MB files
              </li>
              <li className="tier-card-feature">
                <span className="tier-card-feature-icon tier-card-feature-icon-premium">⏳</span>
                30 days storage
              </li>
              <li className="tier-card-feature">
                <span className="tier-card-feature-icon tier-card-feature-icon-premium">📊</span>
                Advanced analytics
              </li>
              <li className="tier-card-feature">
                <span className="tier-card-feature-icon tier-card-feature-icon-premium">🛡️</span>
                Military-grade security
              </li>
              <li className="tier-card-feature">
                <span className="tier-card-feature-icon tier-card-feature-icon-premium">⚡</span>
                Priority support 24/7
              </li>
              <li className="tier-card-feature premium-exclusive">
                <span className="tier-card-feature-icon tier-card-feature-icon-premium">💎</span>
                Custom branding
              </li>
              <li className="tier-card-feature premium-exclusive">
                <span className="tier-card-feature-icon tier-card-feature-icon-premium">📈</span>
                Detailed analytics
              </li>
            </ul>
            <button className="tier-card-cta tier-card-cta-premium">
              🔥 Upgrade
            </button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="upload-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="upload-header">
            <h2 className="upload-title">Upload Your File</h2>
            <p className="upload-subtitle">Drag, drop, and share in seconds ⚡</p>
          </div>
          
          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          {uploadResult ? (
            <div className="upload-success">
              <div className="success-icon">
                ✓
              </div>
              <h3 style={{ color: 'var(--primary-green)', marginBottom: '1rem', fontSize: '1.5rem' }}>
                🎉 Upload Successful!
              </h3>
              
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ 
                  background: 'white', 
                  padding: '1.5rem', 
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="file-icon">📄</div>
                    <div>
                      <h4 style={{ margin: 0, color: 'var(--text-black)' }}>{uploadResult.originalName}</h4>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                        Short URL: <strong>{uploadResult.shortUrl}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="share-link-container">
                  <input 
                    type="text" 
                    value={uploadResult.shareUrl} 
                    readOnly 
                    className="share-link-input"
                    onClick={(e) => e.target.select()}
                  />
                  <button 
                    className="copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(uploadResult.shareUrl);
                      // You could add a toast notification here
                    }}
                  >
                    📋 Copy
                  </button>
                </div>

                {uploadResult.qrCode && (
                  <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <p style={{ fontWeight: '600', marginBottom: '1rem', color: 'var(--text-black)' }}>
                      📱 Scan QR Code to Share
                    </p>
                    <div className="qr-code-container">
                      <img 
                        src={uploadResult.qrCode} 
                        alt="QR Code" 
                        style={{ maxWidth: '150px', height: 'auto', borderRadius: '8px' }} 
                      />
                    </div>
                  </div>
                )}
              </div>

              <button 
                className="modern-upload-btn" 
                onClick={() => setUploadResult(null)}
                style={{ 
                  background: 'linear-gradient(135deg, var(--primary-green), var(--hover-green))',
                  maxWidth: '300px',
                  margin: '0 auto'
                }}
              >
                🚀 Upload Another File
              </button>
            </div>
          ) : (
            <>
              <div 
                {...getRootProps()} 
                className={`modern-upload-area ${isDragActive ? 'active' : ''}`}
              >
                <input {...getInputProps()} />
                
                {file ? (
                  <div className="file-preview">
                    <div className="file-info">
                      <div className="file-icon">
                        {file.type.startsWith('image/') ? '🖼️' : 
                         file.type.includes('pdf') ? '📄' : 
                         file.type.includes('video') ? '🎥' : 
                         file.type.includes('audio') ? '🎵' : '📁'}
                      </div>
                      <div className="file-details">
                        <h4>{file.name}</h4>
                        <p>{(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Unknown type'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="upload-icon-container">
                      <span className="upload-icon">
                        {isDragActive ? '✚' : '📄'}
                      </span>
                    </div>
                    <h3 className="upload-text">
                      {isDragActive ? 'Drop your file here!' : 'Choose file or drag & drop'}
                    </h3>
                    <p className="upload-subtext">
                      {isDragActive ? 'Release to upload' : '• Supports all file types • '}
                    </p>
                    {!isDragActive && (
                      <div style={{ marginTop: '1rem' }}>
                        <span style={{ 
                          display: 'inline-block',
                          padding: '0.5rem 1rem',
                          background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                          borderRadius: '20px',
                          fontSize: '0.875rem',
                          color: '#475569',
                          fontWeight: '500'
                        }}>
                          
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="modern-form-group">
                <label className="modern-form-label">⛊ Security PIN </label>
                <div className="pin-input-container">
                  <input
                    type="text"
                    className="modern-form-input pin-input"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter PIN  🗝"
                    maxLength="6"
                  />
                </div>
                <small style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem', display: 'block' }}>
                  Add an 6 digit PIN to secure your file
                </small>
              </div>

              <button
                className="modern-upload-btn"
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                {uploading ? (
                  <>
                    <span style={{ display: 'inline-block', marginRight: '0.5rem', animation: 'spin 1s linear infinite' }}>
                      ⏳
                    </span>
                    Uploading Your File...
                  </>
                ) : (
                  <>
                     Upload  ⌯⌲
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
