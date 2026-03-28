import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader as Loader2, CircleCheck as CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRealizarTransferencia } from '@/hooks/useTransacoes';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/store/useAuthStore';


function aplicarMascaraConta(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 6);
  if (digitos.length <= 5) return digitos;
  return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
}

const esquemaTransferencia = z.object({
  conta_destino: z
    .string()
    .min(1, 'Número da conta é obrigatório')
    .regex(
      /^\d{5}-\d$/,
      'Informe 5 números e o dígito verificador (6 números no total). O hífen é colocado automaticamente.'
    ),
  valor: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Valor deve ser maior que zero',
    })
    .refine((val) => Number(val) <= 100000, {
      message: 'Valor máximo por transferência: R$ 100.000,00',
    }),
  descricao: z
    .string()
    .min(3, 'Descrição deve ter no mínimo 3 caracteres')
    .max(100, 'Descrição deve ter no máximo 100 caracteres'),
});

type FormularioTransferenciaDados = z.infer<typeof esquemaTransferencia>;

export function Transferencia() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sessao } = useAuthStore();
  const { mutateAsync: realizarTransferencia, isPending } =
    useRealizarTransferencia();
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  const formulario = useForm<FormularioTransferenciaDados>({
    resolver: zodResolver(esquemaTransferencia),
    defaultValues: {
      conta_destino: '',
      valor: '',
      descricao: '',
    },
  });

  async function aoSubmeter(dados: FormularioTransferenciaDados) {
    try {
      setErro('');
      setSucesso(false);

      if (dados.conta_destino === sessao?.conta.numero_conta) {
        setErro('Não é possível transferir para sua própria conta');
        return;
      }

      await realizarTransferencia({
        conta_destino: dados.conta_destino,
        valor: Number(dados.valor),
        descricao: dados.descricao,
      });

      setSucesso(true);
      toast({
        title: 'Transferência realizada!',
        description: `R$ ${Number(dados.valor).toFixed(2)} transferidos com sucesso`,
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : 'Erro ao realizar transferência';
      setErro(mensagem);
      toast({
        title: 'Erro na transferência',
        description: mensagem,
        variant: 'destructive',
      });
    }
  }

  function formatarMoeda(valor: string) {
    const numero = Number(valor);
    if (isNaN(numero)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numero);
  }

  if (sucesso) {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-8 sm:px-6 lg:px-8">
        <Card className="w-full max-w-[min(100%,24rem)] lg:max-w-md xl:max-w-lg shadow-xl lg:shadow-2xl text-center mx-auto">
          <CardContent className="pt-12 pb-8 lg:pt-14 lg:pb-10 px-6 lg:px-10">
            <div className="mx-auto w-20 h-20 lg:w-24 lg:h-24 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 lg:w-14 lg:h-14 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">
              Transferência realizada!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 lg:text-lg">
              Sua transferência foi processada com sucesso
            </p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full h-11 lg:h-12 lg:text-base"
            >
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 xl:px-10">
      <div className="w-full max-w-[min(100%,42rem)] lg:max-w-3xl xl:max-w-4xl mx-auto flex flex-col items-stretch">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/dashboard')}
          aria-label="Voltar ao painel principal"
          className="mb-4 sm:mb-6 gap-2 pl-3 pr-4 h-10 self-center lg:self-start lg:mb-6 lg:-ml-0 rounded-lg border-2 border-slate-300 bg-white font-semibold text-slate-800 shadow-sm hover:bg-slate-100 hover:text-slate-900 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:border-slate-500"
        >
          <ArrowLeft className="h-4 w-4 shrink-0 stroke-[2.5]" aria-hidden />
          Voltar
        </Button>

        <Card className="shadow-xl lg:shadow-2xl w-full border-border/60">
          <CardHeader className="px-6 pt-6 sm:px-8 lg:px-10 lg:pt-8">
            <div className="flex flex-col items-center text-center gap-3 sm:flex-row sm:items-center sm:text-left">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                <Send className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl">
                  Nova Transferência
                </CardTitle>
                <CardDescription className="text-sm sm:text-base lg:text-lg mt-1">
                  Preencha os dados para realizar a transferência
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 sm:px-8 lg:px-10 lg:pb-10">
            <Form {...formulario}>
              <form
                onSubmit={formulario.handleSubmit(aoSubmeter)}
                className="space-y-6 lg:space-y-8"
              >
                {erro && (
                  <Alert variant="destructive">
                    <AlertDescription>{erro}</AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 lg:items-start">
                  <FormField
                    control={formulario.control}
                    name="conta_destino"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="lg:text-base">Conta de destino</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="12345-6"
                            inputMode="numeric"
                            autoComplete="off"
                            disabled={isPending}
                            maxLength={7}
                            className="h-10 lg:h-11 lg:text-base tabular-nums"
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(aplicarMascaraConta(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription className="lg:text-sm">
                              ex.: 12345-6.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formulario.control}
                    name="valor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="lg:text-base">Valor</FormLabel>
                        <FormControl>
                          <div>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              disabled={isPending}
                              className="h-10 lg:h-11 lg:text-base"
                            />
                            {field.value && !isNaN(Number(field.value)) && (
                              <p className="text-sm lg:text-base text-slate-600 dark:text-slate-400 mt-2">
                                {formatarMoeda(field.value)}
                              </p>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription className="lg:text-sm">
                          Valor máximo: R$ 100.000,00
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={formulario.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="lg:text-base">Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Pagamento de aluguel"
                          {...field}
                          disabled={isPending}
                          rows={3}
                          className="min-h-[5rem] lg:min-h-[6rem] lg:text-base resize-y"
                        />
                      </FormControl>
                      <FormDescription className="lg:text-sm">
                        Máximo de 100 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2 lg:pt-4 flex flex-col sm:flex-row gap-3 lg:gap-4">
                  <Button
                    type="submit"
                    className="w-full sm:flex-1 h-12 lg:h-14 text-base lg:text-lg font-semibold order-1 sm:order-none"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Confirmar Transferência
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto sm:min-w-[140px] lg:min-w-[160px] h-12 lg:h-14 lg:text-base order-2 sm:order-none"
                    onClick={() => navigate('/dashboard')}
                    disabled={isPending}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
