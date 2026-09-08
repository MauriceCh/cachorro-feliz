import React, { useState } from 'react';
import { Client, Pet } from '../types';
import { 
  Users, 
  Dog, 
  Cake, 
  Plus, 
  Search, 
  MessageSquare, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  X,
  Edit2,
  Trash2,
  AlertTriangle,
  Save,
  CheckCircle2
} from 'lucide-react';

interface ClientsPetsViewProps {
  clients: Client[];
  onAddClient: (client: Omit<Client, 'id' | 'totalPurchases'>) => void;
  onUpdateClient?: (client: Client) => void;
  onDeleteClient?: (clientId: string) => void;
  onAddPetToClient: (clientId: string, pet: Omit<Pet, 'id'>) => void;
  onDeletePetFromClient?: (clientId: string, petId: string) => void;
  selectedPetForGreeting?: { client: Client; petName: string } | null;
  onOpenAiAssistant: () => void;
}

export const ClientsPetsView: React.FC<ClientsPetsViewProps> = ({
  clients,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  onAddPetToClient,
  onDeletePetFromClient,
  selectedPetForGreeting,
  onOpenAiAssistant
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState<boolean>(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isNewPetModalOpen, setIsNewPetModalOpen] = useState<boolean>(false);
  const [activeClientForPet, setActiveClientForPet] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // New Client Form
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientAddress, setClientAddress] = useState<string>('');
  const [clientCity, setClientCity] = useState<string>('Bogotá');
  const [clientNotes, setClientNotes] = useState<string>('');

  // Initial Pet in New Client
  const [petName, setPetName] = useState<string>('');
  const [petType, setPetType] = useState<'Perro' | 'Gato' | 'Otro'>('Perro');
  const [petBreed, setPetBreed] = useState<string>('');
  const [petBirthday, setPetBirthday] = useState<string>('2022-08-20');
  const [petWeight, setPetWeight] = useState<number>(12);
  const [petAllergies, setPetAllergies] = useState<string>('');

  // Edit Client Form State
  const [editName, setEditName] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editAddress, setEditAddress] = useState<string>('');
  const [editCity, setEditCity] = useState<string>('Bogotá');
  const [editNotes, setEditNotes] = useState<string>('');

  // Filter clients
  const filteredClients = (clients || []).filter(c => 
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone || '').includes(searchTerm) ||
    (c.pets || []).some(p => (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter upcoming birthdays (Current/Next Month)
  const currentMonth = new Date().getMonth() + 1;
  const birthdayPets = (clients || []).flatMap(c => 
    (c.pets || []).map(p => ({
      client: c,
      pet: p,
      month: p.birthday ? new Date(p.birthday).getMonth() + 1 : 0
    }))
  ).filter(item => item.month === currentMonth || (item.pet.birthday && (item.pet.birthday.includes('-08-') || item.pet.birthday.includes('-09-'))));

  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert('Nombre del cliente y teléfono son requeridos.');
      return;
    }

    const initialPets: Pet[] = [];
    if (petName) {
      initialPets.push({
        id: `pet-${Date.now()}`,
        name: petName,
        type: petType,
        breed: petBreed,
        birthday: petBirthday,
        weightKg: Number(petWeight),
        allergiesOrNotes: petAllergies
      });
    }

    onAddClient({
      name: clientName,
      phone: clientPhone,
      email: clientEmail,
      address: clientAddress,
      city: clientCity,
      notes: clientNotes,
      pets: initialPets
    });

    // Reset Form
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setClientAddress('');
    setClientNotes('');
    setPetName('');
    setIsNewClientModalOpen(false);
  };

  const handleOpenEditClient = (client: Client) => {
    setEditingClient(client);
    setEditName(client.name);
    setEditPhone(client.phone);
    setEditEmail(client.email || '');
    setEditAddress(client.address || '');
    setEditCity(client.city || 'Bogotá');
    setEditNotes(client.notes || '');
    setIsEditClientModalOpen(true);
  };

  const handleSaveEditClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    if (onUpdateClient) {
      onUpdateClient({
        ...editingClient,
        name: editName,
        phone: editPhone,
        email: editEmail,
        address: editAddress,
        city: editCity,
        notes: editNotes
      });
    }

    setIsEditClientModalOpen(false);
    setEditingClient(null);
  };

  const confirmDeleteClient = () => {
    if (!clientToDelete) return;
    if (onDeleteClient) {
      onDeleteClient(clientToDelete.id);
    }
    setClientToDelete(null);
  };

  const handleAddPetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClientForPet || !petName) return;

    onAddPetToClient(activeClientForPet.id, {
      name: petName,
      type: petType,
      breed: petBreed,
      birthday: petBirthday,
      weightKg: Number(petWeight),
      allergiesOrNotes: petAllergies
    });

    setPetName('');
    setPetBreed('');
    setPetAllergies('');
    setIsNewPetModalOpen(false);
    setActiveClientForPet(null);
  };

  const generateWhatsAppGreeting = (client: Client, pet: Pet) => {
    const message = encodeURIComponent(
      `¡Hola ${client.name}! 🐾 En *Cachorro Feliz* no se nos olvida una fecha tan especial: ¡Hoy queremos desearle un muy feliz cumpleaños a ${pet.name}! 🎂🐶\n\nComo regalo del Chef Javier, en tu próximo pedido te enviaremos una muestra especial de galletas artesanales de avena y mantequilla de maní 100% natural. ❤️\n\n¿Deseas programar un regalito saludable para su día especial?`
    );
    return `https://api.whatsapp.com/send?phone=${client.phone.replace(/[^0-9]/g, '')}&text=${message}`;
  };

  const generateWhatsAppRepurchaseMessage = (client: Client) => {
    const petNames = client.pets.map(p => p.name).join(' y ');
    const message = encodeURIComponent(
      `¡Hola ${client.name}! 🐾 Te saluda el Chef Javier de *Cachorro Feliz*. ¿Cómo están ${petNames || 'tus peludos'}?\n\nTe escribo para saber si se les están terminando sus snacks saludables o deshidratados favoritos. Esta semana tenemos horneados frescos listos para despacho.\n\n¿Te gustaría que te reservemos su paquete habitual?`
    );
    return `https://api.whatsapp.com/send?phone=${client.phone.replace(/[^0-9]/g, '')}&text=${message}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-[#E0D7C6] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-[#2D463E] font-display flex items-center space-x-2">
            <Users className="w-6 h-6 text-[#2D463E]" />
            <span>Directorio de Clientes y Ficha de Mascotas</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Registro detallado de mascotas, tipo, cumpleaños, pesos y preferencias de alimento
          </p>
        </div>

        <button
          onClick={() => setIsNewClientModalOpen(true)}
          className="bg-[#2D463E] hover:bg-[#233831] text-white px-4 py-2.5 rounded-lg font-bold text-xs shadow-xs flex items-center space-x-2 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#D4A373]" />
          <span>+ Registrar Nuevo Cliente</span>
        </button>
      </div>

      {/* Birthday Highlights Banner */}
      {birthdayPets.length > 0 && (
        <div className="bg-[#2D463E] text-white p-5 rounded-xl shadow-xs space-y-3 border border-[#2D463E]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cake className="w-6 h-6 text-[#D4A373]" />
              <h3 className="text-lg font-bold font-display tracking-wide">
                Mascotas Cumpleañeras de la Temporada ({birthdayPets.length})
              </h3>
            </div>
            <button
              onClick={onOpenAiAssistant}
              className="bg-[#D4A373] hover:bg-[#c29263] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Redactar Saludos con IA</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {birthdayPets.map(({ client, pet }) => (
              <div key={pet.id} className="bg-white/95 text-slate-800 p-3.5 rounded-xl border border-white/40 shadow-xs flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-[#EF8828] flex items-center justify-center font-bold text-lg">
                    🐶
                  </div>
                  <div>
                    <div className="font-extrabold text-sm">{pet.name}</div>
                    <div className="text-[11px] text-slate-600">
                      Dueño: <b>{client.name}</b>
                    </div>
                    <div className="text-[10px] text-amber-700 font-bold">
                      🎂 Cumple: {pet.birthday}
                    </div>
                  </div>
                </div>

                <a
                  href={generateWhatsAppGreeting(client, pet)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 transition-all cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Saludar</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Buscar por cliente, teléfono o nombre de mascota..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#EF8828] focus:outline-none"
        />
      </div>

      {/* Clients Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
          <div key={client.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow relative">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-base font-display">{client.name}</h3>
                <div className="flex items-center space-x-1 text-slate-500 text-xs mt-0.5">
                  <Phone className="w-3 h-3 text-[#EF8828]" />
                  <span>{client.phone}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="bg-emerald-50 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                  ${(client.totalPurchases || 0).toLocaleString('es-CO')}
                </span>
                <button
                  onClick={() => handleOpenEditClient(client)}
                  className="text-slate-400 hover:text-[#2D463E] p-1 rounded-md hover:bg-slate-100 transition-colors"
                  title="Editar datos del cliente"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setClientToDelete(client)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                  title="Eliminar cliente"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{client.address || 'Sin dirección'} ({client.city || 'Bogotá'})</span>
              </div>
              {client.email && (
                <div className="flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
              )}
              {client.notes && (
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg italic">
                  "{client.notes}"
                </div>
              )}
            </div>

            {/* Pets Section */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center space-x-1">
                  <Dog className="w-4 h-4 text-[#EF8828]" />
                  <span>Mascotas Registradas ({(client.pets || []).length})</span>
                </span>

                <button
                  onClick={() => {
                    setActiveClientForPet(client);
                    setIsNewPetModalOpen(true);
                  }}
                  className="text-[11px] text-[#EF8828] hover:underline cursor-pointer font-bold"
                >
                  + Agregar Mascota
                </button>
              </div>

              {(!client.pets || client.pets.length === 0) ? (
                <p className="text-[11px] text-slate-400 italic">Sin mascotas asociadas aún.</p>
              ) : (
                <div className="space-y-2">
                  {client.pets.map(pet => (
                    <div key={pet.id} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs space-y-1 relative group">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>🐶 {pet.name} ({pet.breed || pet.type})</span>
                        <div className="flex items-center space-x-1">
                          <a
                            href={generateWhatsAppGreeting(client, pet)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#EF8828] hover:text-[#d6761f] text-[10px] font-bold inline-flex items-center space-x-0.5 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200"
                            title="Enviar felicitación y regalo de cumpleaños por WhatsApp"
                          >
                            <span>🎂 {pet.birthday}</span>
                          </a>
                          {onDeletePetFromClient && (
                            <button
                              onClick={() => {
                                if (confirm(`¿Retirar la mascota ${pet.name} de este cliente?`)) {
                                  onDeletePetFromClient(client.id, pet.id);
                                }
                              }}
                              className="text-slate-300 hover:text-rose-500 p-0.5 rounded transition-colors"
                              title="Retirar mascota"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 flex justify-between">
                        <span>Peso: {pet.weightKg ? `${pet.weightKg} kg` : 'N/A'}</span>
                      </div>
                      {pet.allergiesOrNotes && (
                        <div className="text-[10px] text-amber-800 bg-amber-50 p-1 rounded font-medium">
                          Nota: {pet.allergiesOrNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Action Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <a
                href={generateWhatsAppRepurchaseMessage(client)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                title="Enviar mensaje amable recordando si se le están acabando los snacks a sus mascotas"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Recordatorio de Recompra WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Nuevo Cliente */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setIsNewClientModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-display text-slate-800 mb-4">Registrar Nuevo Cliente</h3>

            <form onSubmit={handleAddClientSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    placeholder="Ej: Laura Gómez"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono WhatsApp *</label>
                  <input
                    type="tel"
                    placeholder="Ej: 3101234567"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Dirección de Entrega</label>
                  <input
                    type="text"
                    placeholder="Ej: Cra 15 # 85-30 Apto 402"
                    value={clientAddress}
                    onChange={e => setClientAddress(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Zona / Ciudad</label>
                  <input
                    type="text"
                    value={clientCity}
                    onChange={e => setClientCity(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Correo Electrónico (Opcional)</label>
                <input
                  type="email"
                  placeholder="cliente@gmail.com"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Pet Card inside Client creation */}
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-3">
                <h4 className="font-bold text-amber-900 flex items-center space-x-1.5">
                  <Dog className="w-4 h-4 text-[#EF8828]" />
                  <span>Datos de la Mascota Principal (Opcional)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      placeholder="Ej: Max"
                      value={petName}
                      onChange={e => setPetName(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tipo</label>
                    <select
                      value={petType}
                      onChange={e => setPetType(e.target.value as any)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                    >
                      <option value="Perro">Perro</option>
                      <option value="Gato">Gato</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Raza</label>
                    <input
                      type="text"
                      placeholder="Ej: Golden Retriever"
                      value={petBreed}
                      onChange={e => setPetBreed(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fecha de Cumpleaños</label>
                    <input
                      type="date"
                      value={petBirthday}
                      onChange={e => setPetBirthday(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Peso (kg)</label>
                    <input
                      type="number"
                      value={petWeight}
                      onChange={e => setPetWeight(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alergias o Notas Nutricionales</label>
                  <input
                    type="text"
                    placeholder="Ej: Intolerancia al pollo, le encantan las galletas de res"
                    value={petAllergies}
                    onChange={e => setPetAllergies(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observaciones Generales del Cliente</label>
                <textarea
                  rows={2}
                  placeholder="Horarios de entrega preferidos, referencias, etc."
                  value={clientNotes}
                  onChange={e => setClientNotes(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewClientModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-[#2D463E] text-white rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Editar Cliente */}
      {isEditClientModalOpen && editingClient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => {
                setIsEditClientModalOpen(false);
                setEditingClient(null);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-display text-slate-800 mb-1">
              Editar Datos de {editingClient.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Actualiza la información de contacto y entrega</p>

            <form onSubmit={handleSaveEditClient} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teléfono WhatsApp *</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={e => setEditAddress(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Zona / Ciudad</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={e => setEditCity(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observaciones</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditClientModalOpen(false);
                    setEditingClient(null);
                  }}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-[#2D463E] text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4 text-emerald-400" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Confirmar Eliminación de Cliente */}
      {clientToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-bold text-slate-800 text-base">¿Eliminar este cliente?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Se eliminará a <b>{clientToDelete.name}</b> y sus {clientToDelete.pets?.length || 0} mascotas registradas. Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setClientToDelete(null)}
                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteClient}
                className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Nueva Mascota */}
      {isNewPetModalOpen && activeClientForPet && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsNewPetModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-display text-slate-800 mb-4">
              Agregar Mascota a {activeClientForPet.name}
            </h3>

            <form onSubmit={handleAddPetSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Mascota *</label>
                <input
                  type="text"
                  placeholder="Ej: Toby"
                  value={petName}
                  onChange={e => setPetName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo</label>
                  <select
                    value={petType}
                    onChange={e => setPetType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  >
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Raza</label>
                  <input
                    type="text"
                    placeholder="Ej: Poodle"
                    value={petBreed}
                    onChange={e => setPetBreed(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fecha de Cumpleaños *</label>
                <input
                  type="date"
                  value={petBirthday}
                  onChange={e => setPetBirthday(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-[#EF8828]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Peso en Kg (Opcional)</label>
                <input
                  type="number"
                  placeholder="Ej: 14"
                  value={petWeight || ''}
                  onChange={e => setPetWeight(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alergias o Preferencias</label>
                <input
                  type="text"
                  placeholder="Ej: Alergia al pollo, le encantan las galletas"
                  value={petAllergies}
                  onChange={e => setPetAllergies(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewPetModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-[#EF8828] text-white rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Agregar Mascota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
