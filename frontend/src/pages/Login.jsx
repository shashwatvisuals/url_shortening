import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './pagesCssFiles/Login.module.css';

function Login() {
  const navigate = useNavigate();
  const initialFormData = {
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  };

  const [formType, setFormType] = useState('login');
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  // ✅ Redirect logged-in users away from login page
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard'); // ✅ Redirect to dashboard if already logged in
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    if (formType === 'signUp') {
      if (!formData.name.trim()) tempErrors.name = 'Name is required';
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) tempErrors.email = 'Invalid email';
      if (!/^[0-9]{10}$/.test(formData.mobile)) tempErrors.mobile = 'Invalid mobile number';
      if (formData.password.length < 6) tempErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';
    } else {
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) tempErrors.email = 'Invalid email';
      if (!formData.password) tempErrors.password = 'Password is required';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const requestData =
        formType === 'signUp'
          ? { ...formData, phone: formData.mobile }
          : { email: formData.email, password: formData.password };

      const url =
        formType === 'signUp'
          ? 'http://localhost:4000/api/user/register'
          : 'http://localhost:4000/api/user/login';

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        });

        const data = await response.json();

        if (response.ok) {
          if (formType === 'login') {
            localStorage.setItem('token', data.token); // ✅ Save token
            setMessage('Login successful!');
            navigate('/dashboard'); // ✅ Redirect to dashboard
          } else {
            setMessage('Registration successful! Please login.');
          }
        } else {
          setMessage(data.message || 'Something went wrong!');
        }
      } catch (error) {
        setMessage('Network error. Please try again later.');
      }
    }
  };

  const handleFormSwitch = (type) => {
    setFormType(type);
    setFormData(initialFormData);
    setErrors({});
    setMessage('');
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftContainer}></div>

      <div className={styles.rightContainer}>
        <div>
          <button onClick={() => handleFormSwitch('login')} disabled={formType === 'login'}>
            Login
          </button>
          <button onClick={() => handleFormSwitch('signUp')} disabled={formType === 'signUp'}>
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {formType === 'signUp' && (
            <>
              <div>
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
                {errors.name && <p>{errors.name}</p>}
              </div>
              <div>
                <label>Mobile</label>
                <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
                {errors.mobile && <p>{errors.mobile}</p>}
              </div>
            </>
          )}

          <div>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <p>{errors.email}</p>}
          </div>

          <div>
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
            {errors.password && <p>{errors.password}</p>}
          </div>

          {formType === 'signUp' && (
            <div>
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
              {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
            </div>
          )}

          <button type="submit">{formType === 'signUp' ? 'Sign Up' : 'Login'}</button>
        </form>

        {message && <p>{message}</p>}

        <p>
          {formType === 'signUp' ? (
            <span>
              Already have an account? <button onClick={() => handleFormSwitch('login')}>Login</button>
            </span>
          ) : (
            <span>
              Don't have an account? <button onClick={() => handleFormSwitch('signUp')}>Sign Up</button>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default Login;
