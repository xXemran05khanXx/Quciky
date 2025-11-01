import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../utils/api';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('files');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [profileRes, filesRes, analyticsRes] = await Promise.all([
        usersAPI.getProfile(),
        usersAPI.getFiles(),
        usersAPI.getAnalytics()
      ]);

      setUser(profileRes.data.user);
      setFiles(filesRes.data.files);
      setAnalytics(analyticsRes.data.analytics);
    } catch (err) {
      console.error('Error loading data:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      const response = await usersAPI.upgrade();
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      alert('Upgraded to Premium tier successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Upgrade failed');
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

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem', color: 'var(--text-black)' }}>Dashboard</h1>
          <p style={{ color: '#6b7280' }}>Welcome back, {user?.email}</p>
        </div>

        {/* User Tier Card */}
        <div className="user-plan-card" style={{ marginBottom: '2rem' }}>
          <div className="plan-content">
            <div className="plan-info">
              <div className="plan-header">
                <div>
                  <h3>Your Plan</h3>
                 
                </div>
              </div>
              <div className="plan-details">

              </div>
            </div>
            <div className="plan-upgrade-section">
              {user?.tier !== 'paid' && (
                <button className="btn btn-success" onClick={handleUpgrade}>
                  <span>🚀</span>
                  Upgrade to Premium
                </button>
              )}
              {user?.tier === 'paid' && (
                <div className="premium-badge">
                  <span>✨</span>
                  Premium Active
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="analytics-grid">
            <div className="analytics-card uploads">
              <div className="analytics-card-header">
                <div className="analytics-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15L17 10H14V3H10V10H7L12 15Z" fill="currentColor"/>
                    <path d="M20 18H4V20H20V18Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="analytics-card-info">
                  <h4 className="analytics-card-title">Total Uploads</h4>
                  <p className="analytics-card-subtitle">Files uploaded to date</p>
                </div>
              </div>
              <div className="analytics-card-value">
                {analytics.totalUploads}
              </div>
            </div>
            
            <div className="analytics-card active">
              <div className="analytics-card-header">
                <div className="analytics-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="analytics-card-info">
                  <h4 className="analytics-card-title">Active Files</h4>
                  <p className="analytics-card-subtitle">Currently available files</p>
                </div>
              </div>
              <div className="analytics-card-value">
                {analytics.activeFiles}
              </div>
            </div>
            
            <div className="analytics-card size">
              <div className="analytics-card-header">
                <div className="analytics-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2H6ZM6 4H13V9H18V20H6V4Z" fill="currentColor"/>
                    <circle cx="10" cy="16" r="2" fill="currentColor"/>
                    <circle cx="14" cy="12" r="1" fill="currentColor"/>
                  </svg>
                </div>
                <div className="analytics-card-info">
                  <h4 className="analytics-card-title">Total Size</h4>
                  <p className="analytics-card-subtitle">Storage space used</p>
                </div>
              </div>
              <div className="analytics-card-value">
                {(analytics.totalSize / 1024 / 1024).toFixed(1)}
                <span className="analytics-unit">MB</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ marginBottom: '1rem', borderBottom: '2px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('files')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === 'files' ? '2px solid var(--primary-blue)' : 'none',
              color: activeTab === 'files' ? 'var(--primary-blue)' : '#6b7280',
              fontWeight: activeTab === 'files' ? 'bold' : 'normal',
              marginBottom: '-2px'
            }}
          >
            File History
          </button>
        </div>

        {/* Files List */}
        <div className="files-table-card">
          <div className="files-table-header">
            <h3>File History</h3>
          </div>
          
          <div className="files-table-content">
            {files.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-content">
                  <h4>No Files Yet</h4>
                  <p>No files uploaded yet. Upload your first file to get started!</p>
                  <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Upload Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="files-table">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Size</th>
                      <th>Downloads</th>
                      <th>Expires</th>
                      <th>Short URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr key={file._id}>
                        <td>
                          <div className="file-info">
                            <span className="file-name">{file.originalName}</span>
                          </div>
                        </td>
                        <td>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</td>
                        <td>
                          <span className="download-count">{file.downloadCount}</span>
                        </td>
                        <td>{new Date(file.expiresAt).toLocaleDateString()}</td>
                        <td>
                          <code className="short-url-code">
                            {file.shortUrl}
                          </code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
