import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page which now handles both login and register
    navigate('/login');
  }, [navigate]);

  return null; // Component doesn't render anything as it redirects immediately
}

export default Register;
