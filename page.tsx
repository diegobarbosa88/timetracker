'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { sampleTimeRecords, getUniqueClients } from '@/lib/sample-data';
import { TimeRecord } from '@/lib/time-tracking-models';

export default function ReportsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [filteredRecords, setFilteredRecords] = useState<TimeRecord[]>([]);
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedClientTag, setSelectedClientTag] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [uniqueClients, setUniqueClients] = useState<string[]>([]);
  const [showDaySelector, setShowDaySelector] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    // Configurar fechas predeterminadas
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    setStartDate(firstDayOfMonth.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
    
    if (user) {
      setSelectedUserId(user.id);
    }

    // Cargar clientes únicos
    setUniqueClients(getUniqueClients());
  }, [user]);

  useEffect(() => {
    if (startDate && endDate) {
      // Obtener todos los días disponibles en el rango de fechas
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days: string[] = [];
      
      for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
        days.push(day.toISOString().split('T')[0]);
      }
      
      setAvailableDays(days);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (startDate && endDate && selectedUserId) {
      filterRecords();
    }
  }, [startDate, endDate, selectedUserId, period, selectedClientTag, selectedDays]);

  const filterRecords = () => {
    let filtered = [...sampleTimeRecords];
    
    // Filtrar por usuario
    if (selectedUserId) {
      filtered = filtered.filter(record => record.userId === selectedUserId);
    }
    
    // Filtrar por cliente
    if (selectedClientTag) {
      filtered = filtered.filter(record => record.clientTag === selectedClientTag);
    }
    
    // Filtrar por fechas o días seleccionados
    if (selectedDays.length > 0) {
      // Si hay días específicos seleccionados, filtrar solo por esos días
      filtered = filtered.filter(record => selectedDays.includes(record.date));
    } else {
      // Si no hay días específicos, filtrar por rango de fechas
      if (startDate && endDate) {
        filtered = filtered.filter(record => {
          return record.date >= startDate && record.date <= endDate;
        });
      }
    }
    
    // Ordenar por fecha (más reciente primero)
    filtered.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    setFilteredRecords(filtered);
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = e.target.value;
    setPeriod(newPeriod);
    
    // Resetear días seleccionados al cambiar el período
    setSelectedDays([]);
    setShowDaySelector(newPeriod === 'custom');
    
    const today = new Date();
    let newStartDate = new Date();
    
    switch (newPeriod) {
      case 'day':
        newStartDate = today;
        break;
      case 'week':
        newStartDate = new Date(today);
        newStartDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        newStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'custom':
        // No cambiar las fechas, dejar que el usuario las seleccione
        return;
    }
    
    setStartDate(newStartDate.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const handleClientTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClientTag(e.target.value);
  };

  const calculateSummary = () => {
    if (filteredRecords.length === 0) {
      return {
        totalHours: '0h 00m',
        daysWorked: 0,
        totalDays: 0,
        punctuality: '100%',
        lateArrivals: 0,
        extraHours: '0h 00m'
      };
    }
    
    // Calcular días únicos trabajados
    const uniqueDays = new Set(filteredRecords.map(record => record.date)).size;
    
    // Calcular días laborables en el período
    let totalWorkDays = 0;
    
    if (selectedDays.length > 0) {
      // Si hay días específicos seleccionados, contar esos días
      totalWorkDays = selectedDays.length;
    } else {
      // Si no hay días específicos, calcular días laborables en el rango
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
        const dayOfWeek = day.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Lunes a viernes
          totalWorkDays++;
        }
      }
    }
    
    // Calcular horas totales
    let totalMinutes = 0;
    filteredRecords.forEach(record => {
      if (record.totalWorkTime) {
        totalMinutes += record.totalWorkTime;
      }
    });
    
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    
    // Calcular llegadas tarde
    const lateArrivals = filteredRecords.filter(record => record.usedEntryTolerance).length;
    
    // Calcular puntualidad
    const punctuality = uniqueDays > 0 
      ? Math.round(((uniqueDays - lateArrivals) / uniqueDays) * 100) 
      : 100;
    
    // Calcular horas extra (asumiendo 8 horas por día)
    const standardMinutes = uniqueDays * 8 * 60;
    const extraMinutes = Math.max(0, totalMinutes - standardMinutes);
    const extraHours = Math.floor(extraMinutes / 60);
    const extraRemainingMinutes = extraMinutes % 60;
    
    return {
      totalHours: `${totalHours}h ${remainingMinutes.toString().padStart(2, '0')}m`,
      daysWorked: uniqueDays,
      totalDays: totalWorkDays,
      punctuality: `${punctuality}%`,
      lateArrivals,
      extraHours: `${extraHours}h ${extraRemainingMinutes.toString().padStart(2, '0')}m`
    };
  };

  const summary = calculateSummary();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'short'
    });
  };

  const handleDownloadReport = (format: string) => {
    if (filteredRecords.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Crear contenido del informe
    let content = '';
    const title = `Informe de Tiempo - ${new Date().toLocaleDateString('es-ES')}\n\n`;
    
    // Información de filtros
    const filterInfo = `Período: ${period === 'custom' ? 'Personalizado' : period === 'day' ? 'Día' : period === 'week' ? 'Semana' : 'Mes'}\n`;
    const dateRange = `Fechas: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}\n`;
    const userInfo = `Usuario: ${user?.name || 'Todos'}\n`;
    const clientInfo = selectedClientTag ? `Cliente: ${selectedClientTag}\n` : '';
    
    // Resumen
    const summaryInfo = `
Resumen:
- Horas Trabajadas: ${summary.totalHours}
- Días Trabajados: ${summary.daysWorked} / ${summary.totalDays}
- Puntualidad: ${summary.punctuality}
- Horas Extra: ${summary.extraHours}
\n`;
    
    // Detalles de registros
    let detailsInfo = 'Detalles de Registros:\n';
    detailsInfo += 'Fecha | Entrada | Salida | Total | Cliente | Estado\n';
    detailsInfo += '------|---------|--------|-------|---------|-------\n';
    
    filteredRecords.forEach(record => {
      const hours = Math.floor((record.totalWorkTime || 0) / 60);
      const minutes = (record.totalWorkTime || 0) % 60;
      const totalTime = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
      
      let status = 'Completado';
      if (record.usedEntryTolerance) {
        status = 'Llegada tarde';
      } else if (record.usedExitTolerance) {
        status = 'Salida anticipada';
      }
      
      detailsInfo += `${formatDate(record.date)} | ${record.startTime} | ${record.endTime || '-'} | ${totalTime} | ${record.clientTag || '-'} | ${status}\n`;
    });
    
    content = title + filterInfo + dateRange + userInfo + clientInfo + summaryInfo + detailsInfo;
    
    // Crear blob y descargar
    let mimeType = 'text/plain;charset=utf-8';
    const extension = format;
    
    if (format === 'csv') {
      mimeType = 'text/csv;charset=utf-8';
      
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timetracker_report_${new Date().toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // Para PDF, usamos un enfoque diferente
      // Creamos un elemento temporal para mostrar un mensaje mientras se genera el PDF
      const loadingMessage = document.createElement('div');
      loadingMessage.style.position = 'fixed';
      loadingMessage.style.top = '50%';
      loadingMessage.style.left = '50%';
      loadingMessage.style.transform = 'translate(-50%, -50%)';
      loadingMessage.style.padding = '20px';
      loadingMessage.style.background = 'rgba(0,0,0,0.7)';
      loadingMessage.style.color = 'white';
      loadingMessage.style.borderRadius = '5px';
      loadingMessage.style.zIndex = '9999';
      loadingMessage.textContent = 'Generando PDF...';
      document.body.appendChild(loadingMessage);
      
      // Crear un elemento iframe oculto para generar el PDF
      const iframe = document.createElement('iframe');
      iframe.style.visibility = 'hidden';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
      
      // Crear el contenido HTML para el PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Informe de Tiempo</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2563eb; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .summary { margin: 20px 0; }
            .summary div { margin-bottom: 10px; }
            .header { margin-bottom: 20px; }
          </style>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
          <script>
            window.onload = function() {
              // Configuración de html2pdf
              const opt = {
                margin: 10,
                filename: 'timetracker_report_${new Date().toISOString().split('T')[0]}.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
              };
              
              // Generar el PDF
              html2pdf().set(opt).from(document.body).save().then(() => {
                // Notificar a la ventana principal que el PDF se ha generado
                window.parent.postMessage('pdf-generated', '*');
              });
            };
          </script>
        </head>
        <body>
          <div class="header">
            <h1>Informe de Tiempo - ${new Date().toLocaleDateString('es-ES')}</h1>
            <div>Período: ${period === 'custom' ? 'Personalizado' : period === 'day' ? 'Día' : period === 'week' ? 'Semana' : 'Mes'}</div>
            <div>Fechas: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}</div>
            <div>Usuario: ${user?.name || 'Todos'}</div>
            ${selectedClientTag ? `<div>Cliente: ${selectedClientTag}</div>` : ''}
          </div>
          
          <div class="summary">
            <h2>Resumen</h2>
            <div>Horas Trabajadas: ${summary.totalHours}</div>
            <div>Días Trabajados: ${summary.daysWorked} / ${summary.totalDays}</div>
            <div>Puntualidad: ${summary.punctuality}</div>
            <div>Horas Extra: ${summary.extraHours}</div>
          </div>
          
          <h2>Detalles de Registros</h2>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Total</th>
                <th>Cliente</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRecords.map(record => {
                const hours = Math.floor((record.totalWorkTime || 0) / 60);
                const minutes = (record.totalWorkTime || 0) % 60;
                const totalTime = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
                
                let status = 'Completado';
                if (record.usedEntryTolerance) {
                  status = 'Llegada tarde';
                } else if (record.usedExitTolerance) {
                  status = 'Salida anticipada';
                }
                
                return `
                  <tr>
                    <td>${formatDate(record.date)}</td>
                    <td>${record.startTime}</td>
                    <td>${record.endTime || '-'}</td>
                    <td>${totalTime}</td>
                    <td>${record.clientTag || '-'}</td>
                    <td>${status}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;
      
      // Escuchar el mensaje del iframe cuando el PDF se haya generado
      window.addEventListener('message', function(event) {
        if (event.data === 'pdf-generated') {
          // Eliminar el iframe y el mensaje de carga
          document.body.removeChild(iframe);
          document.body.removeChild(loadingMessage);
        }
      }, { once: true });
      
      // Escribir el contenido HTML en el iframe
      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDocument) {
        iframeDocument.open();
        iframeDocument.write(htmlContent);
        iframeDocument.close();
      }
    } else {
      // Para otros formatos (txt)
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timetracker_report_${new Date().toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirigiendo a login
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Informes y Estadísticas</h1>
        
        {/* Filtros */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <select
                id="period"
                name="period"
                className="form-input"
                value={period}
                onChange={handlePeriodChange}
              >
                <option value="day">Día</option>
                <option value="week">Semana</option>
                <option value="month">Mes</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha inicio
              </label>
              <input
                type="date"
                id="start-date"
                name="start-date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha fin
              </label>
              <input
                type="date"
                id="end-date"
                name="end-date"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-1">
                Empleado
              </label>
              <select
                id="employee"
                name="employee"
                className="form-input"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="admin">Administrador</option>
                <option value="employee">Empleado</option>
              </select>
            </div>
            <div>
              <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <select
                id="client"
                name="client"
                className="form-input"
                value={selectedClientTag}
                onChange={handleClientTagChange}
              >
                <option value="">Todos</option>
                {uniqueClients.map((client, index) => (
                  <option key={index} value={client}>{client}</option>
                ))}
              </select>
            </div>
          </div>
          
          {showDaySelector && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar días específicos
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {availableDays.map((day) => {
                  const date = new Date(day);
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const isSelected = selectedDays.includes(day);
                  
                  return (
                    <button
                      key={day}
                      type="button"
                      className={`py-1 px-2 text-sm rounded ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : isWeekend
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                      onClick={() => handleDayToggle(day)}
                    >
                      {date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Resumen */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-1">Horas Trabajadas</h3>
              <p className="text-2xl font-bold text-blue-900">{summary.totalHours}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800 mb-1">Días Trabajados</h3>
              <p className="text-2xl font-bold text-green-900">{summary.daysWorked} / {summary.totalDays}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800 mb-1">Puntualidad</h3>
              <p className="text-2xl font-bold text-yellow-900">{summary.punctuality}</p>
              <p className="text-xs text-yellow-700 mt-1">{summary.lateArrivals} llegadas tarde</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-800 mb-1">Horas Extra</h3>
              <p className="text-2xl font-bold text-purple-900">{summary.extraHours}</p>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              className="btn-secondary flex items-center"
              onClick={() => handleDownloadReport('txt')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar TXT
            </button>
            <button
              className="btn-secondary flex items-center"
              onClick={() => handleDownloadReport('csv')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar CSV
            </button>
            <button
              className="btn-primary flex items-center"
              onClick={() => handleDownloadReport('pdf')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar PDF
            </button>
          </div>
        </div>
        
        {/* Registros */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Registros de Tiempo</h2>
          
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-gray-500">No hay registros para los filtros seleccionados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salida</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record, index) => {
                    const hours = Math.floor((record.totalWorkTime || 0) / 60);
                    const minutes = (record.totalWorkTime || 0) % 60;
                    const totalTime = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
                    
                    let statusClass = 'bg-green-100 text-green-800';
                    let statusText = 'Completado';
                    
                    if (record.usedEntryTolerance) {
                      statusClass = 'bg-yellow-100 text-yellow-800';
                      statusText = 'Llegada tarde';
                    } else if (record.usedExitTolerance) {
                      statusClass = 'bg-orange-100 text-orange-800';
                      statusText = 'Salida anticipada';
                    }
                    
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.startTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.endTime || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {totalTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.clientTag || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
                            {statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
