import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Transferencia } from '@/pages/Transferencia';
import { useAuthStore } from '@/store/useAuthStore';
import {
  MOCK_CONTA_ERMESON_ID,
  MOCK_USER_ERMESON,
  resetBancoMock,
} from '@/mock/bancoMock';

function renderComProviders(component: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
}

describe('Fluxo de Transferência', () => {
  beforeEach(() => {
    queryClient.clear();
    resetBancoMock();
    useAuthStore.setState({
      sessao: {
        usuario: { ...MOCK_USER_ERMESON },
        conta: {
          id: MOCK_CONTA_ERMESON_ID,
          usuario_id: MOCK_USER_ERMESON.id,
          numero_conta: '12345-6',
          agencia: '0001',
          saldo: 8450.75,
          criado_em: MOCK_USER_ERMESON.criado_em,
          atualizado_em: MOCK_USER_ERMESON.atualizado_em,
        },
      },
      estaAutenticado: true,
      definirSessao: () => {},
      limparSessao: () => {},
    });
  });

  it('deve renderizar o formulário de transferência', () => {
    renderComProviders(<Transferencia />);

    expect(screen.getByText('Nova Transferência')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('12345-6')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex: Pagamento de aluguel')).toBeInTheDocument();
  });

  it('deve validar campos obrigatórios', async () => {
    const user = userEvent.setup();
    renderComProviders(<Transferencia />);

    const botaoConfirmar = screen.getByRole('button', {
      name: /confirmar transferência/i,
    });
    await user.click(botaoConfirmar);

    await waitFor(() => {
      expect(
        screen.getByText(/número da conta é obrigatório/i)
      ).toBeInTheDocument();
    });
  });

  it('deve validar formato da conta de destino', async () => {
    const user = userEvent.setup();
    renderComProviders(<Transferencia />);

    const inputConta = screen.getByPlaceholderText('12345-6');
    await user.type(inputConta, '123');

    const botaoConfirmar = screen.getByRole('button', {
      name: /confirmar transferência/i,
    });
    await user.click(botaoConfirmar);

    await waitFor(() => {
      expect(
        screen.getByText(/Informe 5 números e o dígito verificador/i)
      ).toBeInTheDocument();
    });
  });

  it('deve validar valor mínimo', async () => {
    const user = userEvent.setup();
    renderComProviders(<Transferencia />);

    const inputConta = screen.getByPlaceholderText('12345-6');
    const inputValor = screen.getByPlaceholderText('0.00');
    const inputDescricao = screen.getByPlaceholderText('Ex: Pagamento de aluguel');

    await user.type(inputConta, '98765-4');
    await user.type(inputValor, '0');
    await user.type(inputDescricao, 'Teste');

    const botaoConfirmar = screen.getByRole('button', {
      name: /confirmar transferência/i,
    });
    await user.click(botaoConfirmar);

    await waitFor(() => {
      expect(
        screen.getByText(/valor deve ser maior que zero/i)
      ).toBeInTheDocument();
    });
  });

  it('deve validar tamanho mínimo da descrição', async () => {
    const user = userEvent.setup();
    renderComProviders(<Transferencia />);

    const inputConta = screen.getByPlaceholderText('12345-6');
    const inputValor = screen.getByPlaceholderText('0.00');
    const inputDescricao = screen.getByPlaceholderText('Ex: Pagamento de aluguel');

    await user.type(inputConta, '98765-4');
    await user.type(inputValor, '100');
    await user.type(inputDescricao, 'ab');

    const botaoConfirmar = screen.getByRole('button', {
      name: /confirmar transferência/i,
    });
    await user.click(botaoConfirmar);

    await waitFor(() => {
      expect(
        screen.getByText(/descrição deve ter no mínimo 3 caracteres/i)
      ).toBeInTheDocument();
    });
  });

  it('deve permitir preencher o formulário corretamente', async () => {
    const user = userEvent.setup();
    renderComProviders(<Transferencia />);

    const inputConta = screen.getByPlaceholderText('12345-6') as HTMLInputElement;
    const inputValor = screen.getByPlaceholderText('0.00') as HTMLInputElement;
    const inputDescricao = screen.getByPlaceholderText('Ex: Pagamento de aluguel') as HTMLTextAreaElement;

    await user.type(inputConta, '98765-4');
    await user.type(inputValor, '150.50');
    await user.type(inputDescricao, 'Pagamento de teste');

    expect(inputConta.value).toBe('98765-4');
    expect(inputValor.value).toBe('150.5');
    expect(inputDescricao.value).toBe('Pagamento de teste');
  });

  it('deve exibir valor formatado em reais', async () => {
    const user = userEvent.setup();
    renderComProviders(<Transferencia />);

    const inputValor = screen.getByPlaceholderText('0.00');
    await user.type(inputValor, '1500.50');

    await waitFor(() => {
      expect(screen.getByText(/R\$ 1\.500,50/)).toBeInTheDocument();
    });
  });
});
