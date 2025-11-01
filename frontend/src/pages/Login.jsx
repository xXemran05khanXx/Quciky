import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';

function Login() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(email, password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="auth-container">
      <div className={`auth-wrapper ${isRegisterMode ? 'register-mode' : ''}`}>
        {/* Info Panel - Hidden on mobile */}
        {!isMobile && (
          <div className="auth-info-panel">
            <div className="auth-info-content">
              <h1 className="auth-info-title">
                {isRegisterMode ? '🚀 Join Quicky' : '⚡ Welcome Back'}
              </h1>
              <p className="auth-info-subtitle">
                {isRegisterMode 
                  ? 'Start your journey with lightning-fast file sharing and premium features!'
                  : 'Sign in to access your secure file sharing dashboard with advanced features!'
                }
              </p>
              <ul className="auth-info-features">
                <li>⚡ Lightning uploads</li>
                <li>🔐 Military security</li>
                <li>📱 QR code sharing</li>
                <li>☁️ Cloud storage</li>
                <li>📊 Analytics</li>
                <li>🎯 Premium features</li>
              </ul>
              <button 
                className="auth-toggle-btn"
                onClick={toggleMode}
              >
                {isRegisterMode 
                  ? '🔓 Already have an account? Sign In' 
                  : '✨ New here? Create Account'
                }
              </button>
            </div>
          </div>
        )}

        {/* Form Panel */}
        <div className="auth-form-panel">
          <div className="auth-card">
            {/* Mobile Toggle - Only shown on mobile */}
            {isMobile && (
              <div className="mobile-auth-toggle">
                <div className="mobile-toggle-buttons">
                  <button 
                    className={`mobile-toggle-btn ${!isRegisterMode ? 'active' : ''}`}
                    onClick={() => !isRegisterMode || toggleMode()}
                  >
                    🔓 Sign In
                  </button>
                  <button 
                    className={`mobile-toggle-btn ${isRegisterMode ? 'active' : ''}`}
                    onClick={() => isRegisterMode || toggleMode()}
                  >
                    ✨ Register
                  </button>
                </div>
              </div>
            )}

            <h2 className="auth-title">
              {isRegisterMode ? '🚀 Create Account' : '⚡ Sign In'}
            </h2>
            <p className="auth-subtitle">
              {isRegisterMode 
                ? 'Fill in your details to get started'
                : 'Enter your credentials to continue'
              }
            </p>

            {error && (
              <div className="alert alert-error">
                🚨 {error}
              </div>
            )}

            <form onSubmit={isRegisterMode ? handleRegister : handleLogin}>
              <div className="form-group">
                <label className="form-label">
                  📧 Email Address
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  🔐 Password
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder={isRegisterMode ? "Create a strong password (min 6 chars)" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={isRegisterMode ? "6" : undefined}
                />
              </div>

              {isRegisterMode && (
                <div className="form-group">
                  <label className="form-label">
                    🔒 Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>
              )}

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span>
                      {isRegisterMode ? '🚀 Creating your account...' : '🚀 Signing you in...'}
                    </span>
                  </>
                ) : (
                  <>
                    {isRegisterMode ? '✨ Create Account' : '🔓 Sign In'}
                  </>
                )}
              </button>
            </form>

            {/* Desktop Auth Link - Hidden on mobile */}
            {!isMobile && (
              <div className="auth-link">
                {isRegisterMode 
                  ? 'Already have an account? '
                  : "Don't have an account? "
                }
                <button onClick={toggleMode}>
                  {isRegisterMode ? 'Sign in here 🔓' : 'Create one now 🚀'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
