import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Loader as Loader2, Lock, Mail } from 'lucide-react';

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const esquemaLogin = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type FormularioLoginDados = z.infer<typeof esquemaLogin>;

export function Login() {
  const navigate = useNavigate();
  const { definirSessao } = useAuthStore();
  const { toast } = useToast();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const formulario = useForm<FormularioLoginDados>({
    resolver: zodResolver(esquemaLogin),
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  async function aoSubmeter(dados: FormularioLoginDados) {
    try {
      setCarregando(true);
      setErro('');
      const sessao = await api.fazerLogin(dados);
      definirSessao(sessao);
      toast({
        title: 'Login realizado com sucesso!',
        description: `Bem-vindo, ${sessao.usuario.nome_completo}`,
      });
      navigate('/dashboard');
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : 'Erro ao fazer login';
      setErro(mensagem);
      toast({
        title: 'Erro ao fazer login',
        description: mensagem,
        variant: 'destructive',
      });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Card className="w-full max-w-md lg:max-w-lg xl:max-w-xl shadow-xl lg:shadow-2xl border-border/60">
        <CardHeader className="space-y-3 text-center px-6 pt-8 sm:px-8 lg:px-10 lg:pt-10">
          <div className="mx-auto w-16 h-16 lg:w-20 lg:h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Banco Digital
          </CardTitle>
          <CardDescription className="text-sm sm:text-base lg:text-lg max-w-md mx-auto">
            Entre com suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-8 sm:px-8 lg:px-10 lg:pb-10">
          <Form {...formulario}>
            <form
              onSubmit={formulario.handleSubmit(aoSubmeter)}
              className="space-y-6"
            >
              {erro && (
                <Alert variant="destructive">
                  <AlertDescription>{erro}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={formulario.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="seu@gmail.com"
                          {...field}
                          className="pl-10 h-10 lg:h-11 lg:text-base"
                          disabled={carregando}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formulario.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type="password"
                          placeholder="••••••"
                          {...field}
                          className="pl-10 h-10 lg:h-11 lg:text-base"
                          disabled={carregando}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 lg:h-12 text-base lg:text-lg font-semibold"
                disabled={carregando}
              >
                {carregando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm lg:text-base text-center text-slate-600 dark:text-slate-400">
              <strong>Usuários de teste:</strong>
            </p>
            <div className="mt-3 space-y-2 text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-400">
              <p className="text-center">ermeson@gmail.com</p>
              <p className="text-center">lorrany@gmail.com</p>
              <p className="text-center font-semibold">Senha: 123456</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
