import React from 'react';
import { fraudService, type FraudReport } from '@/api/services';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Card, CardContent} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

const ListaReportes = () => {
  const [reportes, setReportes] = React.useState<FraudReport[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const cargarReportes = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fraudService.getAll();
      // Ordenar por ID descendente (asumiendo que los más nuevos tienen ID mayor)
      setReportes(data.sort((a, b) => (b.id || 0) - (a.id || 0)));
    } catch (err) {
      console.error('Error al cargar reportes:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    cargarReportes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Historial de Reportes</h1>
            <p className="text-gray-600">Visualización de fraudes registrados en el sistema.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={cargarReportes}
            disabled={loading}
            className="flex gap-2"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6 text-center text-red-700">
              No se pudieron cargar los reportes. Verifique la conexión con el servidor.
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-red-200 rounded-full mb-4"></div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : reportes.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              No hay reportes registrados actualmente.
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-hidden bg-white shadow sm:rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles del Impostor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportes.map((reporte) => (
                  <tr key={reporte.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{reporte.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="font-semibold">{reporte.impostorDetails}</div>
                      <div className="text-xs text-gray-400 mt-1 line-clamp-1">{reporte.comments}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{reporte.contactInfo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reporte.createdAt ? new Date(reporte.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ListaReportes;
