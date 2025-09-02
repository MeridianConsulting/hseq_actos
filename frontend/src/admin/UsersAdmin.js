import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { isAdmin, logout } from '../utils/auth';
import { userService } from '../services/api';

const emptyForm = {
  nombre: '',
  correo: '',
  cedula: '',
  rol: 'colaborador',
  estado: 'activo',
  proyecto: ''
};

const roleOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'soporte', label: 'Soporte' },
  { value: 'colaborador', label: 'Colaborador' }
];

const UsersAdmin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
      return;
    }
    loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await userService.fetchUsers();
      if (resp.success) {
        setUsers(resp.data || []);
      } else {
        setError(resp.message || 'Error al cargar usuarios');
      }
    } catch (e) {
      setError(e.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(u => (
      (u.nombre || '').toLowerCase().includes(q) ||
      (u.correo || '').toLowerCase().includes(q) ||
      (u.cedula || '').toLowerCase().includes(q) ||
      (u.rol || '').toLowerCase().includes(q)
    ));
  }, [users, search]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditingId(u.id);
    setForm({
      nombre: u.nombre || '',
      correo: u.correo || '',
      cedula: u.cedula || '',
      rol: u.rol || 'colaborador',
      estado: u.estado || 'activo',
      proyecto: u.Proyecto || ''
    });
    setModalOpen(true);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const payload = { ...form };
      let resp;
      if (editingId) {
        resp = await userService.updateUser(editingId, payload);
      } else {
        resp = await userService.createUser(payload);
      }
      if (!resp.success) throw new Error(resp.message || 'Operación fallida');
      setModalOpen(false);
      await loadUsers();
    } catch (ex) {
      setError(ex.message || 'Error guardando usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return;
    try {
      setSubmitting(true);
      const resp = await userService.deleteUser(id);
      if (!resp.success) throw new Error(resp.message || 'No se pudo eliminar');
      await loadUsers();
    } catch (ex) {
      alert(ex.message || 'Error eliminando');
    } finally {
      setSubmitting(false);
    }
  };

  const onResetPassword = async (id) => {
    if (!window.confirm('¿Reiniciar contraseña de este usuario?')) return;
    try {
      setSubmitting(true);
      const resp = await userService.resetPassword(id);
      if (!resp.success) throw new Error(resp.message || 'No se pudo reiniciar');
      alert('Contraseña reiniciada correctamente');
    } catch (ex) {
      alert(ex.message || 'Error reiniciando contraseña');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen" style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 35%, var(--color-tertiary-dark) 100%)'
      }}>
        <div className="container mx-auto px-4 pt-8 pb-10">
          {/* Header Section */}
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--color-secondary)' }}>
                Administración de Usuarios
              </h1>
              <p className="text-sm" style={{ color: 'rgba(252, 247, 255, 0.75)' }}>
                Gestiona usuarios, roles y estados
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre, correo, rol..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 rounded-xl bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                  style={{ color: 'var(--color-secondary)' }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-200/60">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* New User Button */}
              <button
                onClick={openCreate}
                className="group relative font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(45deg, var(--color-tertiary), var(--color-tertiary-light))',
                  color: 'var(--color-dark)',
                }}
              >
                <span className="relative flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Nuevo Usuario</span>
                </span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="backdrop-blur-2xl rounded-3xl border overflow-hidden shadow-xl"
               style={{ backgroundColor: 'rgba(252, 247, 255, 0.12)', borderColor: 'rgba(252, 247, 255, 0.25)' }}>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Correo</th>
                    <th className="px-4 py-3">Documento</th>
                    <th className="px-4 py-3">Rol</th>
                    <th className="px-4 py-3">Proyecto</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td className="px-4 py-6 text-center" colSpan="7" style={{ color: 'var(--color-secondary)' }}>
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
                          <span>Cargando...</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  {error && !loading && (
                    <tr>
                      <td className="px-4 py-6 text-center" colSpan="7">
                        <div className="bg-red-400/10 rounded-lg p-3 border border-red-400/20">
                          {error}
                        </div>
                      </td>
                    </tr>
                  )}
                  {!loading && !error && filteredUsers.length === 0 && (
                    <tr>
                      <td className="px-4 py-8 text-center" colSpan="7" style={{ color: 'var(--color-secondary)' }}>
                        <div className="text-center">
                          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <p className="text-lg font-medium">Sin resultados</p>
                          <p className="text-sm mt-1">Intenta ajustar los filtros de búsqueda</p>
                        </div>
                      </td>
                    </tr>
                  )}
                  {!loading && !error && filteredUsers.map(u => (
                    <tr key={u.id} className="border-t border-white border-opacity-10 hover:bg-white/5 transition-all duration-200">
                      <td className="px-4 py-4" style={{ color: 'var(--color-secondary)' }}>{u.nombre}</td>
                      <td className="px-4 py-4" style={{ color: 'var(--color-secondary)' }}>{u.correo}</td>
                      <td className="px-4 py-4" style={{ color: 'var(--color-secondary)' }}>{u.cedula}</td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold capitalize" style={{
                          backgroundColor: u.rol === 'admin' ? 'rgba(220, 38, 38, 0.2)' : u.rol === 'soporte' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                          color: u.rol === 'admin' ? '#fca5a5' : u.rol === 'soporte' ? '#93c5fd' : '#86efac',
                          border: '1px solid rgba(252, 247, 255, 0.2)'
                        }}>{u.rol}</span>
                      </td>
                      <td className="px-4 py-4" style={{ color: 'var(--color-secondary)' }}>
                        {u.Proyecto || '-'}
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold capitalize" style={{
                          backgroundColor: u.estado === 'activo' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: u.estado === 'activo' ? '#86efac' : '#fca5a5',
                          border: '1px solid rgba(252, 247, 255, 0.2)'
                        }}>{u.estado}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => openEdit(u)} 
                            className="px-2 py-1 rounded-lg text-xs transition-all duration-200 hover:scale-105"
                            style={{ backgroundColor: 'rgba(252, 247, 255, 0.15)', color: 'var(--color-secondary)', border: '1px solid rgba(252, 247, 255, 0.3)' }}
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => onResetPassword(u.id)} 
                            className="px-2 py-1 rounded-lg text-xs transition-all duration-200 hover:scale-105"
                            style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)' }}
                          >
                            Reset
                          </button>
                          <button 
                            onClick={() => onDelete(u.id)} 
                            className="px-2 py-1 rounded-lg text-xs transition-all duration-200 hover:scale-105"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                        >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Crear/Editar */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
            <div className="relative z-10 w-full max-w-lg">
              <div className="backdrop-blur-2xl rounded-3xl p-6 border shadow-2xl"
                   style={{ backgroundColor: 'rgba(252, 247, 255, 0.12)', borderColor: 'rgba(252, 247, 255, 0.25)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-secondary)' }}>
                    {editingId ? 'Editar Usuario' : 'Nuevo Usuario'}
                  </h3>
                  <button 
                    onClick={() => setModalOpen(false)} 
                    className="text-sm hover:bg-white/10 p-1 rounded transition-all duration-200"
                    style={{ color: 'rgba(252, 247, 255, 0.7)' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Nombre</label>
                    <input 
                      name="nombre" 
                      value={form.nombre} 
                      onChange={onChange}
                      className="w-full px-4 py-2 rounded-xl bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                      style={{ color: 'var(--color-secondary)' }}
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Correo</label>
                    <input 
                      type="email" 
                      name="correo" 
                      value={form.correo} 
                      onChange={onChange}
                      className="w-full px-4 py-2 rounded-xl bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                      style={{ color: 'var(--color-secondary)' }}
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Documento</label>
                      <input 
                        name="cedula" 
                        value={form.cedula} 
                        onChange={onChange}
                        className="w-full px-4 py-2 rounded-xl bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                        style={{ color: 'var(--color-secondary)' }}
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Rol</label>
                      <div className="relative">
                        <select
                          name="rol"
                          value={form.rol}
                          onChange={onChange}
                          className="w-full appearance-none px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                          style={{
                            backgroundColor: 'rgba(252, 247, 255, 0.95)',
                            color: 'var(--color-primary-dark)',
                            borderColor: 'rgba(252, 247, 255, 0.6)'
                          }}
                        >
                          {roleOptions.map(r => (
                            <option key={r.value} value={r.value} style={{ color: '#0b1220' }}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--color-primary-dark)' }}>
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Estado</label>
                    <div className="relative">
                      <select
                        name="estado"
                        value={form.estado}
                        onChange={onChange}
                        className="w-full appearance-none px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                        style={{
                          backgroundColor: 'rgba(252, 247, 255, 0.95)',
                          color: 'var(--color-primary-dark)',
                          borderColor: 'rgba(252, 247, 255, 0.6)'
                        }}
                      >
                        <option value="activo" style={{ color: '#0b1220' }}>Activo</option>
                        <option value="inactivo" style={{ color: '#0b1220' }}>Inactivo</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--color-primary-dark)' }}>
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'rgba(252, 247, 255, 0.7)' }}>Proyecto</label>
                    <input 
                      name="proyecto" 
                      value={form.proyecto} 
                      onChange={onChange}
                      placeholder="Nombre del proyecto"
                      className="w-full px-4 py-2 rounded-xl bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                      style={{ color: 'var(--color-secondary)' }}
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
                      style={{ backgroundColor: 'rgba(252, 247, 255, 0.15)', color: 'var(--color-secondary)', border: '1px solid rgba(252, 247, 255, 0.3)' }}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(45deg, var(--color-tertiary), var(--color-tertiary-light))', color: 'var(--color-dark)' }}
                    >
                      {submitting ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
          <button 
            onClick={goBack}
            className="group relative p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
            style={{
              backgroundColor: 'rgba(252, 247, 255, 0.9)',
              color: 'var(--color-primary-dark)',
              border: '2px solid rgba(252, 247, 255, 0.3)'
            }}
            title="Volver"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <div className="absolute right-full mr-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Volver
            </div>
          </button>

          <button 
            onClick={handleLogout}
            className="group relative p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
            style={{
              background: 'linear-gradient(45deg, #dc2626, #ef4444)',
              color: 'white',
              border: '2px solid rgba(220, 38, 38, 0.3)',
              boxShadow: '0 8px 25px -5px rgba(220, 38, 38, 0.4)'
            }}
            title="Cerrar Sesión"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <div className="absolute right-full mr-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Cerrar Sesión
            </div>
          </button>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default UsersAdmin;
