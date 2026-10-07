'use client';

import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '../hooks/use-auth';

interface FieldErrors {
  email?: string;
  password?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const { signIn, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors: FieldErrors = {};
    if (!email.trim()) {
      errors.email = 'Ingresa tu correo electrónico';
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = 'Ingresa un correo electrónico válido';
    }
    if (!password) {
      errors.password = 'Ingresa tu contraseña';
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    await signIn({ email: email.trim(), password });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-xs font-bold uppercase tracking-wide text-[#1B2632]"
        >
          Correo electrónico
        </label>
        <div className="flex items-center gap-3 rounded-lg bg-[#EEE9DF] px-3 focus-within:ring-2 focus-within:ring-[#FFB162]">
          <Mail size={17} aria-hidden="true" className="text-[#66717C]" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tu.correo@umss.edu.bo"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            className="w-full bg-transparent py-3 text-sm text-[#1B2632] outline-none placeholder:text-gray-400"
          />
        </div>
        {fieldErrors.email ? (
          <p id="email-error" className="text-xs text-[#A35139]">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-xs font-bold uppercase tracking-wide text-[#1B2632]"
        >
          Contraseña
        </label>
        <div className="flex items-center gap-3 rounded-lg bg-[#EEE9DF] px-3 focus-within:ring-2 focus-within:ring-[#FFB162]">
          <LockKeyhole size={17} aria-hidden="true" className="text-[#66717C]" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            className="w-full bg-transparent py-3 text-sm text-[#1B2632] outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="text-[#66717C] hover:text-[#1B2632]"
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {fieldErrors.password ? (
          <p id="password-error" className="text-xs text-[#A35139]">
            {fieldErrors.password}
          </p>
        ) : null}
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg bg-[#A35139]/10 px-3 py-2 text-sm text-[#A35139]"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-[#FFB162] px-4 py-3 text-sm font-bold text-[#1B2632] shadow-sm transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
      >
        {isLoading ? 'Verificando acceso...' : 'Ingresar al portal'}
      </button>
    </form>
  );
}
