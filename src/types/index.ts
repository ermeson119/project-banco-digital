export interface Usuario {
  id: string;
  email: string;
  nome_completo: string;
  cpf: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Conta {
  id: string;
  usuario_id: string;
  numero_conta: string;
  agencia: string;
  saldo: number;
  criado_em: string;
  atualizado_em: string;
}

export interface Transacao {
  id: string;
  conta_origem_id: string;
  conta_destino_id: string | null;
  tipo: 'transferencia' | 'deposito' | 'saque';
  valor: number;
  descricao: string | null;
  criado_em: string;
}

export interface SessaoUsuario {
  usuario: Usuario;
  conta: Conta;
}

export interface FormularioLogin {
  email: string;
  senha: string;
}

export interface FormularioTransferencia {
  conta_destino: string;
  valor: number;
  descricao: string;
}
