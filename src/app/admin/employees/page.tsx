'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth';

export default function ViewEmployeePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [timeRecords, setTimeRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Datos de ejemplo para los empleados
  const sampleEmployees = [
    {
      id: 'EMP001',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@magneticplace.com',
      phone: '+34 612 345 678',
      department: 'Desarrollo',
      position: 'Desarrollador Senior',
      status: 'Activo',
      joinDate: '2022-03-15',
      location: 'Madrid',
      tags: ['Proyecto A', 'Frontend'],
      address: 'Calle Principal 123, Madrid',
      emergencyContact: 'Ana Rodríguez - +34 612 345 679',
      birthDate: '1985-06-15',
      documentId: '12345678A',
      bankAccount: 'ES12 1234 5678 9012 3456 7890',
      salary: 45000,
      contractType: 'Indefinido',
      workSchedule: 'Lunes a Viernes, 9:00 - 18:00',
      vacationDays: 22,
      sickDays: 15,
      manager: 'Javier López',
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'HTML/CSS'],
      education: [
        {
          degree: 'Ingeniería Informática',
          institution: 'Universidad Politécnica de Madrid',
          year: '2010'
        }
      ],
      certifications: [
        {
          name: 'React Developer Certification',
          institution: 'React Training',
          year: '2020'
        }
      ]
    },
    {
      id: 'EMP002',
      name: 'Ana Martínez',
      email: 'ana.martinez@magneticplace.com',
      phone: '+34 623 456 789',
      department: 'Diseño',
      position: 'Diseñadora UX/UI',
      status: 'Activo',
      joinDate: '2022-05-20',
      location: 'Barcelona',
      tags: ['Proyecto B', 'Diseño'],
      address: 'Avenida Diagonal 456, Barcelona',
      emergencyContact: 'Pedro Martínez - +34 623 456 780',
      birthDate: '1990-08-25',
      documentId: '87654321B',
      bankAccount: 'ES98 8765 4321 0987 6543 2109',
      salary: 42000,
      contractType: 'Indefinido',
      workSchedule: 'Lunes a Viernes, 9:30 - 18:30',
      vacationDays: 22,
      sickDays: 15,
      manager: 'Carmen Ruiz',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Illustrator', 'Photoshop'],
      education: [
        {
          degree: 'Diseño Gráfico',
          institution: 'Escuela de Diseño de Barcelona',
          year: '2015'
        }
      ],
      certifications: [
        {
          name: 'UX/UI Design Certification',
          institution: 'Interaction Design Foundation',
          year: '2021'
        }
      ]
    }
  ];

  // Datos de ejemplo para los registros de tiempo
  const sampleTimeRecords = [
    {
      id: 'TR001',
      employeeId: 'EMP001',
      date: '2024-04-20',
      checkIn: '08:30',
      checkOut: '17:45',
      totalHours: 8.25,
      status: 'Completado',
      location: 'Oficina Madrid',
      notes: ''
    },
    {
      id: 'TR002',
      employeeId: 'EMP001',
      date: '2024-04-19',
      checkIn: '08:15',
      checkOut: '17:30',
      totalHours: 8.25,
      status: 'Completado',
      location: 'Oficina Madrid',
      notes: ''
    },
    {
      id: 'TR003',
      employeeId: 'EMP001',
      date: '2024-04-18',
      checkIn: '08:45',
      checkOut: '18:00',
      totalHours: 8.25,
      status: 'Completado',
      location: 'Remoto',
      notes: 'Trabajo desde casa'
    },
    {
      id: 'TR004',
      employeeId: 'EMP002',
      date: '2024-04-20',
      checkIn: '09:00',
      checkOut: '18:00',
      totalHours: 8,
      status: 'Completado',
      location: 'Oficina Barcelona',
      notes: ''
    }
  ];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    // Obtener el ID del empleado de la URL
    const searchParams = new URLSearchParams(window.location.search);
    const employeeId = searchParams.get('id');
    
    if (employeeId) {
      // Simulación de carga de datos
      const foundEmployee = sampleEmployees.find(emp => emp.id === employeeId);
      const employeeTimeRecords = sampleTimeRecords.filter(record => record.employeeId === employeeId);
      
      setEmployee(foundEmployee || null);
      setTimeRecords(employeeTimeRecords || []);
      setIsLoading(false);
    } else {
      router.push('/admin/employees');
    }
  }, [router]);

  const handleEditEmployee = () => {
    if (employee) {
      router.push(`/admin/employees/edit-employee?id=${employee.id}`);
    }
  };

  const handleBackToList = () => {
    router.push('/admin/employees');
  };

  const formatDate = (dateString) => {
    // Corregido para usar valores válidos para DateTimeFormatOptions
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Detalles del Empleado</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleBackToList}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Volver a la Lista
            </button>
            <button
              onClick={handleEditEmployee}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Editar Empleado
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando...</p>
            </div>
          </div>
        ) : employee ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información Personal */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                <div className="bg-blue-500 px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-24 w-24 bg-white rounded-full flex items-center justify-center">
                      <span className="text-blue-500 text-4xl font-bold">{employee.name.charAt(0)}</span>
                    </div>
                    <div className="ml-4 text-white">
                      <h2 className="text-xl font-bold">{employee.name}</h2>
                      <p className="text-blue-100">{employee.position}</p>
                      <span className={`mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        employee.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{employee.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="text-gray-900">{employee.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dirección</p>
                      <p className="text-gray-900">{employee.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contacto de Emergencia</p>
                      <p className="text-gray-900">{employee.emergencyContact}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Etiquetas</h3>
                  <div className="flex flex-wrap gap-2">
                    {employee.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Información Laboral y Estadísticas */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Laboral</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Departamento</p>
                      <p className="text-gray-900">{employee.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Posición</p>
                      <p className="text-gray-900">{employee.position}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha de Incorporación</p>
                      <p className="text-gray-900">{formatDate(employee.joinDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ubicación</p>
                      <p className="text-gray-900">{employee.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tipo de Contrato</p>
                      <p className="text-gray-900">{employee.contractType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Horario de Trabajo</p>
                      <p className="text-gray-900">{employee.workSchedule}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Salario Anual</p>
                      <p className="text-gray-900">{employee.salary.toLocaleString('es-ES')} €</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Manager</p>
                      <p className="text-gray-900">{employee.manager}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium">Días de Vacaciones</p>
                      <p className="text-2xl font-bold text-blue-600">{employee.vacationDays}</p>
                      <p className="text-xs text-blue-500">Disponibles</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">Días de Enfermedad</p>
                      <p className="text-2xl font-bold text-green-600">{employee.sickDays}</p>
                      <p className="text-xs text-green-500">Disponibles</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-800 font-medium">Horas Trabajadas</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {timeRecords.reduce((total, record) => total + record.totalHours, 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-purple-500">Este mes</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Habilidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Registros</h3>
                  {timeRecords.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fecha
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Entrada
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Salida
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ubicación
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {timeRecords.map((record) => (
                            <tr key={record.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDate(record.date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {record.checkIn}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {record.checkOut}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {record.totalHours.toFixed(2)} h
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {record.location}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No hay registros disponibles.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-500">No se encontró información del empleado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
