import {
  mockBuscarLogin,
  mockObterContaPorNumero,
  mockObterSaldo,
  mockObterTransacoes,
  mockRealizarTransferencia,
} from '@/mock/bancoMock';
import { Conta, Transacao, FormularioLogin, FormularioTransferencia } from '@/types';

export const api = {
  async fazerLogin(dados: FormularioLogin) {
    const sessao = mockBuscarLogin(dados.email, dados.senha);
    if (!sessao) throw new Error('Email ou senha inválidos');
    return sessao;
  },

  async obterSaldo(contaId: string): Promise<number> {
    return mockObterSaldo(contaId);
  },

  async obterTransacoes(contaId: string): Promise<Transacao[]> {
    return mockObterTransacoes(contaId);
  },

  async realizarTransferencia(
    contaOrigemId: string,
    dados: FormularioTransferencia
  ) {
    return mockRealizarTransferencia(
      contaOrigemId,
      dados.conta_destino,
      dados.valor,
      dados.descricao
    );
  },

  async obterContaPorNumero(numeroConta: string): Promise<Conta | null> {
    return mockObterContaPorNumero(numeroConta);
  },
};
