import { Conta, Transacao, Usuario } from '@/types';

function clonar<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

const agora = new Date().toISOString();

export const MOCK_USER_ERMESON: Usuario = {
  id: 'mock-user-joao',
  email: 'ermeson@gmail.com',
  nome_completo: 'Ermeson Balbinot',
  cpf: '123.456.789-00',
  criado_em: '2026-01-15T10:00:00.000Z',
  atualizado_em: agora,
};

export const MOCK_USER_LORRANY: Usuario = {
  id: 'mock-user-maria',
  email: 'lorrany@gmail.com',
  nome_completo: 'Lorrany Balbinot',
  cpf: '987.654.321-00',
  criado_em: '2026-02-20T14:30:00.000Z',
  atualizado_em: agora,
};

export const MOCK_CONTA_ERMESON_ID = 'mock-conta-joao';
export const MOCK_CONTA_LORRANY_ID = 'mock-conta-maria';

const contaJoaoInicial: Conta = {
  id: MOCK_CONTA_ERMESON_ID,
  usuario_id: MOCK_USER_ERMESON.id,
  numero_conta: '12345-6',
  agencia: '0001',
  saldo: 8450.75,
  criado_em: '2024-01-15T10:00:00.000Z',
  atualizado_em: agora,
};

const contaMariaInicial: Conta = {
  id: MOCK_CONTA_LORRANY_ID,
  usuario_id: MOCK_USER_LORRANY.id,
  numero_conta: '98765-4',
  agencia: '0001',
  saldo: 3210.4,
  criado_em: '2024-02-20T14:30:00.000Z',
  atualizado_em: agora,
};

const transacoesInicial: Transacao[] = [
  {
    id: 'mock-tx-1',
    conta_origem_id: MOCK_CONTA_ERMESON_ID,
    conta_destino_id: MOCK_CONTA_LORRANY_ID,
    tipo: 'transferencia',
    valor: 150.0,
    descricao: 'Pagamento de aluguel',
    criado_em: '2025-03-26T14:22:00.000Z',
  },
  {
    id: 'mock-tx-2',
    conta_origem_id: MOCK_CONTA_LORRANY_ID,
    conta_destino_id: MOCK_CONTA_ERMESON_ID,
    tipo: 'transferencia',
    valor: 80.5,
    descricao: 'Reembolso jantar',
    criado_em: '2025-03-25T09:15:00.000Z',
  },
  {
    id: 'mock-tx-3',
    conta_origem_id: MOCK_CONTA_ERMESON_ID,
    conta_destino_id: MOCK_CONTA_LORRANY_ID,
    tipo: 'transferencia',
    valor: 45.9,
    descricao: 'PIX presente',
    criado_em: '2025-03-24T18:40:00.000Z',
  },
  {
    id: 'mock-tx-4',
    conta_origem_id: MOCK_CONTA_ERMESON_ID,
    conta_destino_id: null,
    tipo: 'saque',
    valor: 200.0,
    descricao: 'Saque caixa eletrônico',
    criado_em: '2025-03-23T11:05:00.000Z',
  },
  {
    id: 'mock-tx-5',
    conta_origem_id: MOCK_CONTA_LORRANY_ID,
    conta_destino_id: MOCK_CONTA_ERMESON_ID,
    tipo: 'transferencia',
    valor: 1200.0,
    descricao: 'Freelance projeto web',
    criado_em: '2025-03-20T16:00:00.000Z',
  },
];

type Credencial = { email: string; senha: string; usuario: Usuario };

const credenciais: Credencial[] = [
  { email: 'ermeson@gmail.com', senha: '123456', usuario: MOCK_USER_ERMESON },
  { email: 'lorrany@gmail.com', senha: '123456', usuario: MOCK_USER_LORRANY },
];

let usuariosPorEmail = new Map(
  credenciais.map((c) => [c.email.toLowerCase(), c] as const)
);

let contasPorId = new Map<string, Conta>([
  [contaJoaoInicial.id, clonar(contaJoaoInicial)],
  [contaMariaInicial.id, clonar(contaMariaInicial)],
]);

let contasPorNumero = new Map<string, Conta>(
  [...contasPorId.values()].map((c) => [c.numero_conta, c])
);

let transacoes: Transacao[] = clonar(transacoesInicial);

export function resetBancoMock() {
  usuariosPorEmail = new Map(
    credenciais.map((c) => [c.email.toLowerCase(), c] as const)
  );
  contasPorId = new Map([
    [contaJoaoInicial.id, clonar(contaJoaoInicial)],
    [contaMariaInicial.id, clonar(contaMariaInicial)],
  ]);
  contasPorNumero = new Map(
    [...contasPorId.values()].map((c) => [c.numero_conta, c])
  );
  transacoes = clonar(transacoesInicial);
}

export function mockBuscarLogin(email: string, senha: string) {
  const cred = usuariosPorEmail.get(email.toLowerCase());
  if (!cred || cred.senha !== senha) return null;
  const conta = [...contasPorId.values()].find((c) => c.usuario_id === cred.usuario.id);
  if (!conta) return null;
  return { usuario: clonar(cred.usuario), conta: clonar(conta) };
}

export function mockObterSaldo(contaId: string): number {
  return contasPorId.get(contaId)?.saldo ?? 0;
}

export function mockObterTransacoes(contaId: string): Transacao[] {
  return transacoes
    .filter(
      (t) => t.conta_origem_id === contaId || t.conta_destino_id === contaId
    )
    .sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime())
    .slice(0, 20);
}

export function mockObterContaPorNumero(numeroConta: string): Conta | null {
  const c = contasPorNumero.get(numeroConta);
  return c ? clonar(c) : null;
}

export function mockRealizarTransferencia(
  contaOrigemId: string,
  contaDestinoNumero: string,
  valor: number,
  descricao: string
): Transacao {
  const destino = contasPorNumero.get(contaDestinoNumero);
  if (!destino) throw new Error('Conta de destino não encontrada');

  const origem = contasPorId.get(contaOrigemId);
  if (!origem) throw new Error('Conta de origem não encontrada');

  if (origem.saldo < valor) throw new Error('Saldo insuficiente');

  const ts = new Date().toISOString();
  origem.saldo -= valor;
  origem.atualizado_em = ts;
  destino.saldo += valor;
  destino.atualizado_em = ts;

  const nova: Transacao = {
    id: crypto.randomUUID(),
    conta_origem_id: contaOrigemId,
    conta_destino_id: destino.id,
    tipo: 'transferencia',
    valor,
    descricao,
    criado_em: ts,
  };
  transacoes.unshift(nova);
  return clonar(nova);
}
