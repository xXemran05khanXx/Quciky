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
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-black)' }}>Your Plan</h3>
              <span className={`tier-badge tier-${user?.tier}`}>
                {user?.tier?.toUpperCase()}
              </span>
            </div>
            {user?.tier !== 'paid' && (
              <button className="btn btn-success" onClick={handleUpgrade}>
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem', 
            marginBottom: '2rem' 
          }}>
            <div className="card">
              <h4 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Total Uploads</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-blue)' }}>
                {analytics.totalUploads}
              </p>
            </div>
            <div className="card">
              <h4 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Total Downloads</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                {analytics.totalDownloads}
              </p>
            </div>
            <div className="card">
              <h4 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Active Files</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-black)' }}>
                {analytics.activeFiles}
              </p>
            </div>
            <div className="card">
              <h4 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Total Size</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6b7280' }}>
                {(analytics.totalSize / 1024 / 1024).toFixed(2)} MB
              </p>
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
        <div className="card">
          {files.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
              No files uploaded yet. Go to <a href="/" style={{ color: 'var(--primary-blue)' }}>home</a> to upload your first file!
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>File Name</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Size</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Downloads</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Expires</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Short URL</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem' }}>{file.originalName}</td>
                      <td style={{ padding: '0.75rem' }}>
                        {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                      </td>
                      <td style={{ padding: '0.75rem' }}>{file.downloadCount}</td>
                      <td style={{ padding: '0.75rem' }}>
                        {new Date(file.expiresAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <code style={{ 
                          backgroundColor: '#f3f4f6', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '4px',
                          fontSize: '0.875rem'
                        }}>
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
  );
}

export default Dashboard;
