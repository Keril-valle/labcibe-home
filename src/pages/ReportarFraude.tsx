import React from 'react';
import { useForm } from '@tanstack/react-form';
import { fraudService, type CreateFraudDto} from '@/api/services';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ReportarFraude = () => {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState('');

  const form = useForm({
    defaultValues: {
      impostorDetails: '',
      contactInfo: '',
      comments: '',
    },
    onSubmit: async ({ value }) => {
      setStatus('loading');
      try {
        await fraudService.create(value);
        setStatus('success');
        form.reset();
      } catch (error) {
        setStatus('error');
        setErrorMessage('Hubo un error al enviar el reporte. Por favor, intente de nuevo.');
        console.error(error);
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-red-600">Reportar Fraude</CardTitle>
            <CardDescription>
              Utilice este formulario para reportar cualquier actividad sospechosa o impostores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
                ¡Reporte enviado con éxito! Gracias por su colaboración.
                <Button 
                  variant="link" 
                  onClick={() => setStatus('idle')}
                  className="ml-2"
                >
                  Enviar otro reporte
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                {errorMessage}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              <div>
                <form.Field
                  name="impostorDetails"
                  validators={{
                    onChange: ({ value }) => 
                      !value ? 'Los detalles del impostor son obligatorios' : undefined,
                  }}
                  children={(field) => (
                    <div className="flex flex-col gap-2">
                      <label htmlFor={field.name} className="font-semibold text-gray-700">
                        Detalles del impostor *
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Nombre, alias o descripción del impostor"
                        className="p-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                      />
                      {field.state.meta.errors ? (
                        <em className="text-red-500 text-sm">{field.state.meta.errors.join(', ')}</em>
                      ) : null}
                    </div>
                  )}
                />
              </div>

              <div>
                <form.Field
                  name="contactInfo"
                  validators={{
                    onChange: ({ value }) => 
                      !value ? 'La información de contacto es obligatoria' : undefined,
                  }}
                  children={(field) => (
                    <div className="flex flex-col gap-2">
                      <label htmlFor={field.name} className="font-semibold text-gray-700">
                        Número / Correo / Usuario de contacto *
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Ej: +506 8888-8888 o usuario@email.com"
                        className="p-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                      />
                      {field.state.meta.errors ? (
                        <em className="text-red-500 text-sm">{field.state.meta.errors.join(', ')}</em>
                      ) : null}
                    </div>
                  )}
                />
              </div>

              <div>
                <form.Field
                  name="comments"
                  children={(field) => (
                    <div className="flex flex-col gap-2">
                      <label htmlFor={field.name} className="font-semibold text-gray-700">
                        Comentarios del caso
                      </label>
                      <textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Describa brevemente lo ocurrido..."
                        className="p-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none min-h-[100px]"
                      />
                    </div>
                  )}
                />
              </div>

              <div className="pt-4">
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button 
                      type="submit" 
                      disabled={!canSubmit || status === 'loading'}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg"
                    >
                      {status === 'loading' ? 'Enviando...' : 'Enviar Reporte'}
                    </Button>
                  )}
                />
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ReportarFraude;
