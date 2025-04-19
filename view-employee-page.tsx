'use client';

import React, { useEffect, useState } from 'react';

export default function ViewEmployeePage() {
  const [employeeId, setEmployeeId] = useState('');
  const [employeeData, setEmployeeData] = useState({
    id: '',
    name: '',
    email: '',
    department: '',
    position: '',
    startDate: '',
    status: '',
    statusClass: ''
  });

  // Obtener el ID del empleado de la URL al cargar la página
  useEffect(() => {
    // Función para obtener parámetros de la URL
    const getQueryParam = (param) => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    };

    const id = getQueryParam('id');
    if (id) {
      setEmployeeId(id);
      
      // Simulación de carga de datos del empleado según el ID
      // En una aplicación real, esto sería una llamada a una API o base de datos
      const employeeMap = {
        'EMP001': {
          id: 'EMP001',
          name: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@magneticplace.com',
          department: 'Operaciones',
          position: 'Técnico Senior',
          startDate: '15 de mayo de 2023',
          status: 'Registrado (08:30)',
          statusClass: 'bg-green-100 text-green-800',
          stats: {
            horasTrabajadas: '160 horas',
            diasTrabajados: '20 días',
            puntualidad: '98%',
            horasExtra: '5 horas',
            clientesPrincipales: 'MAGNETIC PLACE, Empresa ABC'
          }
        },
        'EMP002': {
          id: 'EMP002',
          name: 'Ana Martínez',
          email: 'ana.martinez@magneticplace.com',
          department: 'Administración',
          position: 'Gerente Administrativa',
          startDate: '10 de noviembre de 2022',
          status: 'Registrada (08:15)',
          statusClass: 'bg-green-100 text-green-800',
          stats: {
            horasTrabajadas: '155 horas',
            diasTrabajados: '19 días',
            puntualidad: '95%',
            horasExtra: '3 horas',
            clientesPrincipales: 'MAGNETIC PLACE, Empresa XYZ'
          }
        },
        'EMP003': {
          id: 'EMP003',
          name: 'Miguel Sánchez',
          email: 'miguel.sanchez@magneticplace.com',
          department: 'Ventas',
          position: 'Representante de Ventas',
          startDate: '20 de enero de 2024',
          status: 'No registrado',
          statusClass: 'bg-red-100 text-red-800',
          stats: {
            horasTrabajadas: '145 horas',
            diasTrabajados: '18 días',
            puntualidad: '90%',
            horasExtra: '2 horas',
            clientesPrincipales: 'Empresa ABC, Cliente Internacional'
          }
        }
      };
      
      if (employeeMap[id]) {
        setEmployeeData(employeeMap[id]);
      }
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Detalles del Empleado</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">ID de Empleado</p>
              <p className="text-lg">{employeeData.id}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
              <p className="text-lg">{employeeData.name}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg">{employeeData.email}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Departamento</p>
              <p className="text-lg">{employeeData.department}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Cargo</p>
              <p className="text-lg">{employeeData.position}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Fecha de Inicio</p>
              <p className="text-lg">{employeeData.startDate}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Estadísticas Laborales</h2>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Estado Actual</p>
              <p className="text-lg">
                <span className={`px-2 py-1 rounded-full text-sm font-semibold ${employeeData.statusClass}`}>
                  {employeeData.status}
                </span>
              </p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Horas Trabajadas (Mes Actual)</p>
              <p className="text-lg">{employeeData.stats?.horasTrabajadas || '0 horas'}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Días Trabajados (Mes Actual)</p>
              <p className="text-lg">{employeeData.stats?.diasTrabajados || '0 días'}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Puntualidad</p>
              <p className="text-lg">{employeeData.stats?.puntualidad || '0%'}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Horas Extra (Mes Actual)</p>
              <p className="text-lg">{employeeData.stats?.horasExtra || '0 horas'}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Clientes Principales</p>
              <p className="text-lg">{employeeData.stats?.clientesPrincipales || 'Sin clientes asignados'}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Historial de Registros Recientes</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Entrada
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Salida
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cliente
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-200">19/04/2025</td>
                  <td className="py-2 px-4 border-b border-gray-200">08:30</td>
                  <td className="py-2 px-4 border-b border-gray-200">--:--</td>
                  <td className="py-2 px-4 border-b border-gray-200">En curso</td>
                  <td className="py-2 px-4 border-b border-gray-200">MAGNETIC PLACE</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-200">18/04/2025</td>
                  <td className="py-2 px-4 border-b border-gray-200">08:30</td>
                  <td className="py-2 px-4 border-b border-gray-200">17:30</td>
                  <td className="py-2 px-4 border-b border-gray-200">9h 00m</td>
                  <td className="py-2 px-4 border-b border-gray-200">MAGNETIC PLACE</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-200">17/04/2025</td>
                  <td className="py-2 px-4 border-b border-gray-200">08:30</td>
                  <td className="py-2 px-4 border-b border-gray-200">17:30</td>
                  <td className="py-2 px-4 border-b border-gray-200">9h 00m</td>
                  <td className="py-2 px-4 border-b border-gray-200">Empresa ABC</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-200">16/04/2025</td>
                  <td className="py-2 px-4 border-b border-gray-200">08:15</td>
                  <td className="py-2 px-4 border-b border-gray-200">17:00</td>
                  <td className="py-2 px-4 border-b border-gray-200">8h 45m</td>
                  <td className="py-2 px-4 border-b border-gray-200">MAGNETIC PLACE</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-200">15/04/2025</td>
                  <td className="py-2 px-4 border-b border-gray-200">08:45</td>
                  <td className="py-2 px-4 border-b border-gray-200">17:45</td>
                  <td className="py-2 px-4 border-b border-gray-200">9h 00m</td>
                  <td className="py-2 px-4 border-b border-gray-200">MAGNETIC PLACE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-8">
          <a 
            href="/admin/employees" 
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Volver a la Lista
          </a>
          <a 
            href={`/admin/employees/edit-employee?id=${employeeId}`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Editar Empleado
          </a>
        </div>
      </div>
      
      <script dangerouslySetInnerHTML={{ __html: `
        // Función para obtener parámetros de la URL
        function getQueryParam(param) {
          const urlParams = new URLSearchParams(window.location.search);
          return urlParams.get(param);
        }
        
        // Obtener el ID del empleado de la URL
        const employeeId = getQueryParam('id');
        
        // Si no hay ID, redirigir a la lista de empleados
        if (!employeeId) {
          window.location.href = '/admin/employees';
        }
      `}} />
    </div>
  );
}
