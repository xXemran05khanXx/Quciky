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
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-black)' }}>
            Fast & Secure File Sharing
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>
            Share files, images, and documents through short URLs and QR codes
          </p>
        </div>

        {/* Tier Information */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '3rem' 
        }}>
          <div className="card">
            <h3 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>Anonymous</h3>
            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Free</p>
            <ul style={{ listStyle: 'none', color: '#374151' }}>
              <li>✓ Up to 5MB</li>
              <li>✓ 1 day validity</li>
              <li>✓ Basic sharing</li>
            </ul>
          </div>
          <div className="card" style={{ borderColor: 'var(--primary-blue)', borderWidth: '2px' }}>
            <h3 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>Signed (Free)</h3>
            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Free</p>
            <ul style={{ listStyle: 'none', color: '#374151' }}>
              <li>✓ Up to 50MB</li>
              <li>✓ 7 days validity</li>
              <li>✓ File history</li>
              <li>✓ Security PIN</li>
            </ul>
          </div>
          <div className="card" style={{ borderColor: 'var(--primary-green)', borderWidth: '2px', backgroundColor: '#f0fdf4' }}>
            <h3 style={{ color: 'var(--primary-green)', marginBottom: '0.5rem' }}>Premium</h3>
            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>₹ 99/month</p>
            <ul style={{ listStyle: 'none', color: '#374151' }}>
              <li>✓ Up to 500MB</li>
              <li>✓ 30 days validity</li>
              <li>✓ Analytics</li>
              <li>✓ Priority support</li>
            </ul>
          </div>
        </div>

        {/* Upload Section */}
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-black)' }}>Upload File</h2>
          
          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          {uploadResult ? (
            <div>
              <div className="alert alert-success">
                File uploaded successfully!
              </div>
              <div style={{ marginTop: '1rem' }}>
                <p><strong>File:</strong> {uploadResult.originalName}</p>
                <p><strong>Short URL:</strong> {uploadResult.shortUrl}</p>
                <p><strong>Share Link:</strong></p>
                <input 
                  type="text" 
                  value={uploadResult.shareUrl} 
                  readOnly 
                  className="form-input"
                  style={{ marginBottom: '1rem' }}
                  onClick={(e) => e.target.select()}
                />
                {uploadResult.qrCode && (
                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <p><strong>QR Code:</strong></p>
                    <img src={uploadResult.qrCode} alt="QR Code" style={{ maxWidth: '200px', margin: '1rem auto' }} />
                  </div>
                )}
                <button 
                  className="btn btn-primary" 
                  onClick={() => setUploadResult(null)}
                  style={{ width: '100%' }}
                >
                  Upload Another File
                </button>
              </div>
            </div>
          ) : (
            <>
              <div 
                {...getRootProps()} 
                className={`upload-area ${isDragActive ? 'active' : ''}`}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div>
                    <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>📄 {file.name}</p>
                    <p style={{ color: '#6b7280' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                      {isDragActive ? '📥 Drop file here' : '📤 Drag & drop or click to select'}
                    </p>
                    <p style={{ color: '#6b7280' }}>Max file size depends on your tier</p>
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label">Security PIN (optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter a PIN to protect your file"
                  maxLength="6"
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={!file || uploading}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                {uploading ? 'Uploading...' : 'Upload File'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
