// src/components/Auth.js

import React, { useState } from 'react';
import './Auth.css'; // Asegúrate de crear este archivo para estilos específicos si lo deseas

const Auth = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(true); // Toggle entre registro e inicio de sesión
  const [formData, setFormData] = useState({
    nombre: '',
    fechaNacimiento: '',
    fechaFallecimiento: '',
    email: '',
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [message, setMessage] = useState('');

  // Manejar cambios en los campos de registro
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejar cambios en el campo de inicio de sesión
  const handleLoginChange = (e) => {
    setLoginEmail(e.target.value);
  };

  // Manejar el envío del formulario de registro
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validar los campos requeridos
    if (!formData.nombre || !formData.fechaNacimiento || !formData.email) {
      setMessage('Por favor, completa todos los campos requeridos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          fechaNacimiento: formData.fechaNacimiento,
          fechaFallecimiento: formData.fechaFallecimiento || null,
          email: formData.email,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Registro exitoso. Puedes iniciar sesión ahora.');
        // Limpiar los campos de registro
        setFormData({
          nombre: '',
          fechaNacimiento: '',
          fechaFallecimiento: '',
          email: '',
        });
        setIsRegister(false);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Error en el registro.');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      setMessage('Hubo un error en el registro. Por favor, intenta nuevamente.');
    }
  };

  // Manejar el envío del formulario de inicio de sesión
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!loginEmail) {
      setMessage('Por favor, ingresa tu email.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users');
      if (response.ok) {
        const users = await response.json();
        const user = users.find((u) => u.email.toLowerCase() === loginEmail.toLowerCase());

        if (user) {
          setMessage(`Bienvenido, ${user.nombre}!`);
          if (onLogin) {
            onLogin(user); // Pasar el usuario al componente padre si es necesario
          }
        } else {
          setMessage('Email no encontrado. Por favor, regístrate primero.');
        }
      } else {
        setMessage('Error al obtener los usuarios.');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      setMessage('Hubo un error en el inicio de sesión. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <button
          className={`toggle-btn ${isRegister ? 'active' : ''}`}
          onClick={() => setIsRegister(true)}
        >
          Registro
        </button>
        <button
          className={`toggle-btn ${!isRegister ? 'active' : ''}`}
          onClick={() => setIsRegister(false)}
        >
          Iniciar Sesión
        </button>
      </div>

      {isRegister ? (
        <form className="auth-form" onSubmit={handleRegisterSubmit}>
          <h2>Registro</h2>
          {message && <p className="message">{message}</p>}
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleRegisterChange}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleRegisterChange}
            required
          />

          <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="fechaNacimiento"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleRegisterChange}
            required
          />

          <label htmlFor="fechaFallecimiento">Fecha de Fallecimiento:</label>
          <input
            type="date"
            id="fechaFallecimiento"
            name="fechaFallecimiento"
            value={formData.fechaFallecimiento}
            onChange={handleRegisterChange}
          />

          <button type="submit">Registrar</button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleLoginSubmit}>
          <h2>Iniciar Sesión</h2>
          {message && <p className="message">{message}</p>}
          <label htmlFor="loginEmail">Email:</label>
          <input
            type="email"
            id="loginEmail"
            value={loginEmail}
            onChange={handleLoginChange}
            required
          />

          <button type="submit">Entrar</button>
        </form>
      )}
    </div>
  );
};

export default Auth;
