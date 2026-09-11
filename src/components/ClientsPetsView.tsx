import React, { useState } from 'react';
import { 
  Users, 
  Heart, 
  Cake, 
  Phone, 
  MessageCircle, 
  Search, 
  Plus, 
  Trash2, 
  MapPin, 
  AlertCircle,
  X,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  birthday: string; // Formato MM-DD
  allergies: string;
  favoriteProtein: 'Galletas' | 'Res' | 'Pollo' | 'Cerdo';
}

export interface ClientProfile {
  id: string;
  ownerName: string;
  ownerPhone: string;
  address: string;
  zone: string;
  totalOrders: number;
  totalSpentCOP: number;
  lastOrderDate: string;
  pets: Pet[];
}

const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: 'cli-1',
    ownerName: 'Carolina Mendoza',
    ownerPhone: '+57 312 458 9012',
    address: 'Calle 67 # 9-24 Apto 302',
    zone: 'Chapinero',
    totalOrders: 6,
    totalSpentCOP: 420000,
    lastOrderDate: '2024-10-20',
    pets: [
      {
        id: 'pet-1',
        name: 'Bruno',
        breed: 'Golden Retriever',
        age: '3 años',
        birthday: '10-28', // Cumpleaños en octubre
        allergies: 'Sensible al trigo',
        favoriteProtein: 'Res'
      },
      {
        id: 'pet-2',
        name: 'Luna',
        breed: 'Criolla rescatada',
        age: '1 año',
        birthday: '11-15',
        allergies: 'Ninguna',
        favoriteProtein: 'Galletas'
      }
    ]
  },
  {
    id: 'cli-2',
    ownerName: 'Alejandro Restrepo',
    ownerPhone: '+57 320 891 4455',
    address: 'Cra 15 # 134-18 Int 2',
    zone: 'Norte (Usaquén)',
    totalOrders: 4,
    totalSpentCOP: 260000,
    lastOrderDate: '2024-10-22',
    pets: [
      {
        id: 'pet-3',
        name: 'Kira',
        breed: 'Beagle',
        age: '2 años',
        birthday: '10-31', // Cumpleaños este mes
        allergies: 'Ninguna conocida',
        favoriteProtein: 'Pollo'
      }
    ]
  },
  {
    id: 'cli-3',
    ownerName: 'Valeria Gómez',
    ownerPhone: '+57 310 776 2200',
    address: 'Calle 53 # 71D-15 Casa 4',
    zone: 'Normandía / Engativá',
    totalOrders: 8,
    totalSpentCOP: 510000,
    lastOrderDate: '2024-10-24',
    pets: [
      {
        id: 'pet-4',
        name: 'Simba',
        breed: 'Criollo mestizo',
        age: '4 años',
        birthday: '10-30', // Cumpleaños este mes
        allergies: 'Intolerancia a conservantes químicos',
        favoriteProtein: 'Galletas'
      }
    ]
  }
];

export const ClientsPetsView: React.FC = () => {
  const [clients, setClients] = useState<ClientProfile[]>(INITIAL_CLIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para modal de Nuevo Cliente
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerPhone, setNewOwnerPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newZone, setNewZone] = useState('Normandía / Engativá');
  
  // Datos de la mascota en el nuevo cliente
  const [newPetName, setNewPetName] = useState('');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetBirthday, setNewPetBirthday] = useState('10-15');
  const [newPetAllergies, setNewPetAllergies] = useState('Ninguna');
  const [newPetProtein, setNewPetProtein] = useState<'Galletas' | 'Res' | 'Pollo' | 'Cerdo'>('Galletas');

  // Estado para modal de Agregar Mascota a cliente existente
  const [targetClientIdForPet, setTargetClientIdForPet] = useState<string | null>(null);

  const currentMonth = '10'; // Octubre

  // Calcular peludos cumpleañeros
  const allPetsWithOwners = clients.flatMap(c => 
    c.pets.map(p => ({ ...p, ownerName: c.ownerName, ownerPhone: c.ownerPhone }))
  );
  const birthdayPets = allPetsWithOwners.filter(p => p.birthday.startsWith(currentMonth));

  // Filtro de búsqueda por cliente o por mascota
  const filteredClients = clients.filter(client => {
    const term = searchTerm.toLowerCase();
    const matchClient = 
      client.ownerName.toLowerCase().includes(term) ||
      client.ownerPhone.includes(term) ||
      client.address.toLowerCase().includes(term);
    
    const matchPet = client.pets.some(p => 
      p.name.toLowerCase().includes(term) || 
      p.breed.toLowerCase().includes(term)
    );

    return matchClient || matchPet;
  });

  // 1. CREAR NUEVO CLIENTE
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOwnerName.trim() || !newOwnerPhone.trim()) return;

    const newClient: ClientProfile = {
      id: `cli-${Date.now()}`,
      ownerName: newOwnerName,
      ownerPhone: newOwnerPhone,
      address: newAddress || 'Dirección por confirmar',
      zone: newZone,
      totalOrders: 1,
      totalSpentCOP: 0,
      lastOrderDate: new Date().toISOString().split('T')[0],
      pets: newPetName.trim() ? [
        {
          id: `pet-${Date.now()}`,
          name: newPetName,
          breed: newPetBreed || 'Criollo / Mestizo',
          age: newPetAge || 'Adulto',
          birthday: newPetBirthday,
          allergies: newPetAllergies,
          favoriteProtein: newPetProtein
        }
      ] : []
    };

    setClients([newClient, ...clients]);
    setShowNewClientModal(false);
    // Limpiar formulario
    setNewOwnerName('');
    setNewOwnerPhone('');
    setNewAddress('');
    setNewPetName('');
    setNewPetBreed('');
  };

  // 2. AGREGAR OTRA MASCOTA A CLIENTE EXISTENTE
  const handleAddPetToClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetClientIdForPet || !newPetName.trim()) return;

    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name: newPetName,
      breed: newPetBreed || 'Mestizo',
      age: newPetAge || '2 años',
      birthday: newPetBirthday,
      allergies: newPetAllergies,
      favoriteProtein: newPetProtein
    };

    setClients(clients.map(c => {
      if (c.id === targetClientIdForPet) {
        return { ...c, pets: [...c.pets, newPet] };
      }
      return c;
    }));

    setTargetClientIdForPet(null);
    setNewPetName('');
    setNewPetBreed('');
  };

  // 3. ELIMINAR CLIENTE
  const handleDeleteClient = (clientId: string, clientName: string) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${clientName} y todas sus mascotas del CRM?`)) {
      setClients(clients.filter(c => c.id !== clientId));
    }
  };

  // 4. ELIMINAR UNA MASCOTA ESPECÍFICA
  const handleDeletePet = (clientId: string, petId: string, petName: string) => {
    if (window.confirm(`¿Deseas eliminar a ${petName} de este tutor?`)) {
      setClients(clients.map(c => {
        if (c.id === clientId) {
          return { ...c, pets: c.pets.filter(p => p.id !== petId) };
        }
        return c;
      }));
    }
  };

  // Enviar mensaje de cumpleaños por WhatsApp
  const sendWhatsAppBirthday = (petName: string, ownerName: string, phone: string, protein: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = `¡Hola ${ownerName}! 🐾🎂 Te saluda el Chef Javier y Oreo de Cachorro Feliz.\n` +
      `Nos dimos cuenta de que muy pronto es el cumpleaños de ${petName} 🐶🎈.\n` +
      `¡Queremos consentirlo como se merece! Tienes un 15% de descuento y una porción de galletas de obsequio en su próximo pedido del taller.\n` +
      `¿Deseas que le reservemos su snack favorito (${protein})?`;

    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Encabezado con Botón de Nuevo Cliente */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#f8b46b] bg-[#334c5c] px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
            <Users className="w-3.5 h-3.5" /> CRM Canino & Directorio de Clientes
          </span>
          <h2 className="text-2xl font-black text-[#334c5c]">
            Directorio de Tutores & Fichas de Mascotas
          </h2>
          <p className="text-xs text-gray-500">
            Manejo multi-mascota por cliente, datos de contacto completos y alertas de cumpleaños.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewClientModal(true)}
          className="flex items-center gap-2 bg-[#f8b46b] hover:bg-[#e29d53] text-[#334c5c] font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> + Nuevo Cliente / Tutor
        </button>
      </div>

      {/* Banner de Cumpleaños */}
      {birthdayPets.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-[#f8b46b] p-4 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f8b46b] text-[#334c5c] flex items-center justify-center font-bold text-lg shadow-sm">
              🎂
            </div>
            <div>
              <h3 className="text-sm font-black text-[#334c5c]">
                ¡Hay {birthdayPets.length} mascotas celebrando su cumpleaños este mes!
              </h3>
              <p className="text-xs text-gray-600">
                {birthdayPets.map(p => `${p.name} (Tutor: ${p.ownerName})`).join(' • ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente, teléfono, dirección o mascota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#334c5c] focus:outline-none bg-white shadow-sm"
          />
        </div>

        <span className="text-xs font-bold text-gray-500">
          Mostrando {filteredClients.length} tutores registrados
        </span>
      </div>

      {/* Lista de Tarjetas de Clientes (Soporta múltiples mascotas) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-[#334c5c] transition flex flex-col justify-between space-y-4"
          >
            {/* Header del Tutor */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-black text-[#334c5c] flex items-center gap-2">
                    {client.ownerName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 mt-1">
                    <span className="flex items-center gap-1 font-bold text-gray-800">
                      <Phone className="w-3.5 h-3.5 text-[#334c5c]" /> {client.ownerPhone}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-[#ff7043]" /> {client.address} ({client.zone})
                    </span>
                  </div>
                </div>

                {/* Botón Eliminar Cliente */}
                <button
                  type="button"
                  onClick={() => handleDeleteClient(client.id, client.ownerName)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Eliminar cliente"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Sección de Mascotas del Tutor */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
                    🐾 Mascotas Registradas ({client.pets.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setTargetClientIdForPet(client.id)}
                    className="text-[11px] font-extrabold text-[#334c5c] hover:text-[#f8b46b] flex items-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3" /> Agregar Mascota
                  </button>
                </div>

                {client.pets.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-2">
                    No hay mascotas asignadas a este tutor.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {client.pets.map((pet) => {
                      const isBirthday = pet.birthday.startsWith(currentMonth);
                      return (
                        <div
                          key={pet.id}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                            isBirthday 
                              ? 'bg-amber-50/70 border-[#f8b46b]' 
                              : 'bg-[#fbf9f6] border-gray-100'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-sm text-[#334c5c]">{pet.name}</span>
                              <span className="text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                                {pet.breed} • {pet.age}
                              </span>
                              {isBirthday && (
                                <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Cake className="w-3 h-3" /> Cumpleaños
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-600">
                              Favorito: <strong className="text-[#334c5c]">{pet.favoriteProtein}</strong> | Alergias: <span className="text-[#ff7043]">{pet.allergies}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {isBirthday && (
                              <button
                                type="button"
                                onClick={() => sendWhatsAppBirthday(pet.name, client.ownerName, client.ownerPhone, pet.favoriteProtein)}
                                className="bg-[#25d366] hover:bg-[#20ba59] text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1 transition"
                                title="Felicitar por WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" /> Felicitar
                              </button>
                            )}

                            {/* Eliminar Mascota */}
                            <button
                              type="button"
                              onClick={() => handleDeletePet(client.id, pet.id, pet.name)}
                              className="p-1 text-gray-300 hover:text-red-500 transition"
                              title="Eliminar mascota"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer de Métricas y Contacto */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <div className="text-gray-500">
                <span>{client.totalOrders} pedidos</span> • <strong className="text-green-700 font-bold">${client.totalSpentCOP.toLocaleString('es-CO')} COP</strong>
              </div>

              <a
                href={`https://api.whatsapp.com/send?phone=${client.ownerPhone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-[#f5f3f0] hover:bg-gray-200 text-[#334c5c] font-bold px-3 py-1.5 rounded-xl transition"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25d366]" /> Chat WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: CREAR NUEVO CLIENTE */}
      {showNewClientModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-[#334c5c] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-lg font-black text-[#334c5c] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#f8b46b]" /> Registrar Nuevo Tutor & Mascota
              </h3>
              <button type="button" onClick={() => setShowNewClientModal(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
                  1. Datos del Tutor
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Laura Martínez"
                      value={newOwnerName}
                      onChange={(e) => setNewOwnerName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">WhatsApp / Teléfono *</label>
                    <input
                      type="text"
                      required
                      placeholder="+57 300 123 4567"
                      value={newOwnerPhone}
                      onChange={(e) => setNewOwnerPhone(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Dirección de Entrega</label>
                    <input
                      type="text"
                      placeholder="Ej: Calle 140 # 11-20 Apto 401"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Zona Bogotá</label>
                    <select
                      value={newZone}
                      onChange={(e) => setNewZone(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] focus:outline-none bg-white"
                    >
                      <option value="Normandía / Engativá">Normandía / Engativá</option>
                      <option value="Chapinero">Chapinero</option>
                      <option value="Norte (Usaquén/Suba)">Norte (Usaquén/Suba)</option>
                      <option value="Centro / Sur">Centro / Sur</option>
                      <option value="Nacional">Nacional (Fuera de Bogotá)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t pt-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
                  2. Datos de su Mascota (Opcional)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Nombre Peludo</label>
                    <input
                      type="text"
                      placeholder="Ej: Toby"
                      value={newPetName}
                      onChange={(e) => setNewPetName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Raza</label>
                    <input
                      type="text"
                      placeholder="Ej: Schnauzer"
                      value={newPetBreed}
                      onChange={(e) => setNewPetBreed(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Edad</label>
                    <input
                      type="text"
                      placeholder="Ej: 3 años"
                      value={newPetAge}
                      onChange={(e) => setNewPetAge(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Proteína Preferida</label>
                    <select
                      value={newPetProtein}
                      onChange={(e) => setNewPetProtein(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] focus:outline-none bg-white"
                    >
                      <option value="Galletas">Galletas Horneadas</option>
                      <option value="Res">Deshidratado de Res</option>
                      <option value="Pollo">Deshidratado de Pollo</option>
                      <option value="Cerdo">Deshidratado de Cerdo</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Alergias o Cuidados</label>
                    <input
                      type="text"
                      placeholder="Ej: Intolerancia al pollo"
                      value={newPetAllergies}
                      onChange={(e) => setNewPetAllergies(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewClientModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#334c5c] text-[#f8b46b] hover:bg-[#273a46] shadow-md transition"
                >
                  Guardar Cliente en CRM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: AGREGAR MASCOTA A TUTOR EXISTENTE */}
      {targetClientIdForPet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-[#334c5c]">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-base font-black text-[#334c5c]">
                + Agregar Mascota
              </h3>
              <button type="button" onClick={() => setTargetClientIdForPet(null)}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAddPetToClient} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">Nombre de la Mascota *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Rocky"
                  value={newPetName}
                  onChange={(e) => setNewPetName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Raza</label>
                  <input
                    type="text"
                    placeholder="Ej: Pug"
                    value={newPetBreed}
                    onChange={(e) => setNewPetBreed(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Edad</label>
                  <input
                    type="text"
                    placeholder="Ej: 2 años"
                    value={newPetAge}
                    onChange={(e) => setNewPetAge(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">Proteína Favorita</label>
                <select
                  value={newPetProtein}
                  onChange={(e) => setNewPetProtein(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#334c5c] focus:outline-none bg-white"
                >
                  <option value="Galletas">Galletas Horneadas</option>
                  <option value="Res">Deshidratado de Res</option>
                  <option value="Pollo">Deshidratado de Pollo</option>
                  <option value="Cerdo">Deshidratado de Cerdo</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setTargetClientIdForPet(null)}
                  className="flex-1 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-[#334c5c] text-[#f8b46b] rounded-xl shadow"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPetsView;