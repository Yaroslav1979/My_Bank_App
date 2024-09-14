import React, { useState } from 'react';
import FormInput from "../../component/form-input";
import Page from "../../component/page";
import Button from "../../component/button";
import ButtonLogout from "../../component/button-logout";
import Success from "../../component/success"; 
// import { useNavigate } from 'react-router-dom';
import './index.css';

const Settings: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Додайте стан для успішного повідомлення
  // const navigate = useNavigate();

  const handleEmailChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email) {
      setError("Введіть новий email");
      return;
    }

    if (!password) {
      setError("Введіть свій пароль");
      return;
    }

    try {
      const response = await fetch('/settings-email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Response data:', data); 

      if (response.ok) {
        setSuccessMessage("Email успішно змінено!"); 
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Щось пішло не так");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!oldPassword) {
      setError("Введіть старий пароль");
      return;
    }

    if (!newPassword) {
      setError("Введіть новий пароль");
      return;
    }

    try {
      const response = await fetch('/settings-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();
      console.log('Response data:', data); 

      if (response.ok) {
        setSuccessMessage("Пароль успішно змінено!"); 
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Щось пішло не так");
    }
  };

  return (
    <Page pageTitle="Settings">
      <div>
        <form className="form" onSubmit={handleEmailChange}>
          <p className='recieve-subtitle'>Change email</p>
          <div className="form-container">
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormInput
              label="Old Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className='setting-btn'>Save Email</Button>
          </div>
          {error && <p className="error">{error}</p>}
        </form>

        <form className="form" onSubmit={handlePasswordChange}>
          <p className='recieve-subtitle'>Change password</p>
          <div className="form-container">
            <FormInput
              label="Old Password"
              type="password"
              name="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <FormInput
              label="New Password"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Button type="submit" className='setting-btn'>Save Password</Button>
          </div>
          {error && <p className="error">{error}</p>}
        </form>

        <ButtonLogout />           

        {successMessage && <Success message={successMessage} />} {/* Додайте модалку для успішного повідомлення */}
      </div>
    </Page>
  );
};

export default Settings;