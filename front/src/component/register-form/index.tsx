import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import FormInput from '../form-input';
import Button from "../button";
import "./index.css";

interface RegisterFormProps {
  onError: (message: string) => void;
  onSuccess?: (email: string, password: string) => void;
  children?: React.ReactNode;
  mode: 'register' | 'login'; 
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onError, children, mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  // Перевірка, чи заповнені всі поля
  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      let response;
      if (mode === 'login') {
        response = await fetch('http://localhost:4000/user-enter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(errorResult.message || 'Login failed');
        }

        const result = await response.json();
        console.log(result.message);

        if (authContext && authContext.dispatch) {
          authContext.dispatch({
            type: 'LOGIN',
            payload: {
              token: result.token,
              user: { email },
            },
          });
          navigate('/balance');

        } else {
          throw new Error("Authentication context is unavailable.");
        }

      } else if (mode === 'register') {
        response = await fetch('http://localhost:4000/user-create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(errorResult.message || 'Registration failed');
        }

        const result = await response.json();
        console.log(result.message);

        // Перенаправляємо на сторінку верифікації
        navigate('/verify-email', { state: { email } });
      }
    } catch (error) {
      onError((error as Error).message);
    }
  };

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-container">
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-container">
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="form__button" disabled={!isFormValid}>Continue</Button>
        {error && <p className="error">{error}</p>}
      </form>
      {children}
    </div>
  );
};

export default RegisterForm;
