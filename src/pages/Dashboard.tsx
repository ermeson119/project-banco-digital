import { useNavigate } from 'react-router-dom';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  LogOut,
  Send,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuthStore } from '@/store/useAuthStore';
import { useSaldo, useTransacoes } from '@/hooks/useTransacoes';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
export function Dashboard() {
  const navigate = useNavigate();
  const { sessao, limparSessao } = useAuthStore();
  const { data: saldo, isLoading: carregandoSaldo } = useSaldo();
  const { data: transacoes, isLoading: carregandoTransacoes } = useTransacoes();
  const [mostrarSaldo, setMostrarSaldo] = useState(true);

  function fazerLogout() {
    limparSessao();
    navigate('/');
  }

  function formatarMoeda(valor: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  }

  function formatarData(data: string) {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(data));
  }

  return (
    <div className="min-h-svh flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="shrink-0 bg-white dark:bg-slate-950 border-b shadow-sm">
        <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 min-w-0 justify-center sm:justify-start">
              <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-blue-600 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-center sm:text-left min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                  Banco Digital
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-400 truncate">
                  Olá, {sessao?.usuario.nome_completo}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fazerLogout}
              className="gap-2 w-full sm:w-auto shrink-0 lg:h-10 lg:px-4"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 lg:py-10 overflow-y-auto">
        <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto flex flex-col gap-6 lg:gap-8">
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          <Card className="shadow-lg border-2 lg:col-span-2 lg:min-h-[200px]">
            <CardHeader className="lg:pb-2 lg:pt-6 lg:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-center sm:text-left min-w-0">
                  <CardTitle className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400">
                    Saldo disponível
                  </CardTitle>
                  {carregandoSaldo ? (
                    <Skeleton className="h-10 w-48 mt-2 mx-auto sm:mx-0 lg:h-12 lg:w-56" />
                  ) : (
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 tabular-nums tracking-tight">
                      {mostrarSaldo ? formatarMoeda(saldo || 0) : '••••••'}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setMostrarSaldo(!mostrarSaldo)}
                  aria-label={
                    mostrarSaldo ? 'Ocultar saldo' : 'Mostrar saldo'
                  }
                  title={mostrarSaldo ? 'Ocultar saldo' : 'Mostrar saldo'}
                  className="h-10 w-10 shrink-0 self-center sm:self-start lg:h-11 lg:w-11 rounded-full border-2 border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-100 hover:text-slate-900 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white dark:hover:border-slate-500"
                >
                  {mostrarSaldo ? (
                    <EyeOff
                      className="h-5 w-5 lg:h-6 lg:w-6 stroke-[2.25]"
                      aria-hidden
                    />
                  ) : (
                    <Eye
                      className="h-5 w-5 lg:h-6 lg:w-6 stroke-[2.25]"
                      aria-hidden
                    />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="lg:px-8 lg:pb-6">
              <div className="grid grid-cols-2 gap-4 lg:gap-8 pt-4 border-t text-center sm:text-left">
                <div className="text-sm">
                  <p className="text-slate-600 dark:text-slate-400">Agência</p>
                  <p className="font-semibold mt-1 text-base lg:text-lg">
                    {sessao?.conta.agencia}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-slate-600 dark:text-slate-400">Conta</p>
                  <p className="font-semibold mt-1 text-base lg:text-lg break-all">
                    {sessao?.conta.numero_conta}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer lg:col-span-1 lg:self-start">
            <CardHeader className="lg:pt-6 lg:px-6">
              <CardTitle className="text-base lg:text-lg">Ações rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 lg:px-6 lg:pb-6">
              <Button
                className="w-full justify-start gap-3 h-12 lg:h-14 lg:text-base"
                onClick={() => navigate('/transferencia')}
              >
                <Send className="w-5 h-5 lg:w-6 lg:h-6" />
                Nova transferência
              </Button>
            </CardContent>
          </Card>
          </div>

          <Card className="shadow-lg lg:shadow-xl">
            <CardHeader className="text-center sm:text-left lg:px-8 lg:pt-8">
              <CardTitle className="flex items-center justify-center sm:justify-start gap-2 text-lg lg:text-xl">
                Últimas transações
              </CardTitle>
              <CardDescription className="text-sm lg:text-base lg:mt-1">
                Histórico das suas movimentações recentes
              </CardDescription>
            </CardHeader>
            <CardContent className="lg:px-8 lg:pb-8">
              {carregandoTransacoes ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 lg:h-[4.5rem] w-full" />
                  ))}
                </div>
              ) : transacoes && transacoes.length > 0 ? (
                <div className="divide-y divide-border">
                  {transacoes.map((transacao) => {
                    const ehEntrada =
                      transacao.conta_destino_id === sessao?.conta.id;
                    return (
                      <div key={transacao.id} className="py-3 lg:py-4 first:pt-0">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:gap-6">
                          <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                            <div
                              className={`shrink-0 w-10 h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center ${
                                ehEntrada
                                  ? 'bg-green-100 dark:bg-green-950'
                                  : 'bg-red-100 dark:bg-red-950'
                              }`}
                            >
                              {ehEntrada ? (
                                <ArrowDownLeft className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
                              ) : (
                                <ArrowUpRight className="w-5 h-5 lg:w-6 lg:h-6 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                            <div className="min-w-0 text-left">
                              <p className="font-medium break-words lg:text-base">
                                {transacao.descricao ||
                                  (ehEntrada
                                    ? 'Transferência recebida'
                                    : 'Transferência enviada')}
                              </p>
                              <p className="text-sm lg:text-base text-slate-600 dark:text-slate-400">
                                {formatarData(transacao.criado_em)}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-row items-center justify-end gap-3 sm:flex-col sm:items-end sm:justify-center sm:gap-2 lg:flex-row lg:items-center lg:gap-4 shrink-0 sm:min-w-[140px] lg:min-w-[200px]">
                            <p
                              className={`font-bold text-base sm:text-lg lg:text-xl tabular-nums ${
                                ehEntrada
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {ehEntrada ? '+' : '-'}{' '}
                              {formatarMoeda(transacao.valor)}
                            </p>
                            <Badge
                              variant={ehEntrada ? 'default' : 'secondary'}
                              className="shrink-0 lg:px-3 lg:py-0.5"
                            >
                              {transacao.tipo}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 lg:py-16">
                  <p className="text-slate-600 dark:text-slate-400 lg:text-lg">
                    Nenhuma transação encontrada
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
