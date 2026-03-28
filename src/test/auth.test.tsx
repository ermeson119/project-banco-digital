import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Login } from '@/pages/Login';
import { useAuthStore } from '@/store/useAuthStore';

function renderComProviders(component: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
}

describe('Fluxo de Autenticação', () => {
  beforeEach(() => {
    useAuthStore.getState().limparSessao();
    queryClient.clear();
  });

  it('deve renderizar o formulário de login', () => {
    renderComProviders(<Login />);

    expect(screen.getByText('Banco Digital')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('seu@gmail.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('deve validar campos obrigatórios', async () => {
    const user = userEvent.setup();
    renderComProviders(<Login />);

    const botaoEntrar = screen.getByRole('button', { name: /entrar/i });
    await user.click(botaoEntrar);

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });

  it('deve validar formato de email', async () => {
    const user = userEvent.setup();
    renderComProviders(<Login />);

    const inputEmail = screen.getByPlaceholderText('seu@gmail.com');
    await user.type(inputEmail, 'email-invalido');

    const botaoEntrar = screen.getByRole('button', { name: /entrar/i });
    await user.click(botaoEntrar);

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });

  it('deve validar tamanho mínimo da senha', async () => {
    const user = userEvent.setup();
    renderComProviders(<Login />);

    const inputEmail = screen.getByPlaceholderText('seu@gmail.com');
    const inputSenha = screen.getByPlaceholderText('••••••');

    await user.type(inputEmail, 'teste@email.com');
    await user.type(inputSenha, '123');

    const botaoEntrar = screen.getByRole('button', { name: /entrar/i });
    await user.click(botaoEntrar);

    await waitFor(() => {
      expect(
        screen.getByText(/a senha deve ter no mínimo 6 caracteres/i)
      ).toBeInTheDocument();
    });
  });

  it('deve exibir informações de usuários de teste', () => {
    renderComProviders(<Login />);

    expect(screen.getByText('ermeson@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('lorrany@gmail.com')).toBeInTheDocument();
    expect(screen.getByText(/senha: 123456/i)).toBeInTheDocument();
  });

  it('deve permitir digitar no formulário', async () => {
    const user = userEvent.setup();
    renderComProviders(<Login />);

    const inputEmail = screen.getByPlaceholderText('seu@gmail.com') as HTMLInputElement;
    const inputSenha = screen.getByPlaceholderText('••••••') as HTMLInputElement;

    await user.type(inputEmail, 'teste@email.com');
    await user.type(inputSenha, 'senha123');

    expect(inputEmail.value).toBe('teste@email.com');
    expect(inputSenha.value).toBe('senha123');
  });
});
