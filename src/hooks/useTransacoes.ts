import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { FormularioTransferencia } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';

export function useTransacoes() {
  const { sessao } = useAuthStore();

  return useQuery({
    queryKey: ['transacoes', sessao?.conta.id],
    queryFn: () => api.obterTransacoes(sessao!.conta.id),
    enabled: !!sessao?.conta.id,
  });
}

export function useSaldo() {
  const { sessao } = useAuthStore();

  return useQuery({
    queryKey: ['saldo', sessao?.conta.id],
    queryFn: () => api.obterSaldo(sessao!.conta.id),
    enabled: !!sessao?.conta.id,
  });
}

export function useRealizarTransferencia() {
  const queryClient = useQueryClient();
  const { sessao } = useAuthStore();

  return useMutation({
    mutationFn: (dados: FormularioTransferencia) =>
      api.realizarTransferencia(sessao!.conta.id, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transacoes'] });
      queryClient.invalidateQueries({ queryKey: ['saldo'] });
    },
  });
}
