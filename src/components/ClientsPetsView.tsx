import React, { useState } from 'react';
import { 
  Users, 
  Heart, 
  Cake, 
  Phone, 
  MessageCircle, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Sparkles
} from 'lucide-react';

interface PetProfile {
  id: string;
  petName: string;
  petBreed: string;
  petAge: string;
  petBirthday: string; // MM-DD
  allergies: string;
  favoriteProtein: 'Galletas' | 'Res' | 'Pollo' | 'Cerdo';
  ownerName: string;
  ownerPhone: string;
  zone: string;
  totalOrders: number;
  totalSpentCOP: number;
  lastOrderDate: string;
}

const INITIAL_PETS: PetProfile[] = [
  {
    id: 'p-1',
    petName: 'Bruno',
    petBreed: 'Golden Retriever',
    petAge: '3 años',
    petBirthday: '10-28', // Cumpleaños en octubre (cercano)
    allergies: 'Sensible al trigo / Ninguna proteína',
    favoriteProtein: 'Res',
    ownerName: 'Carolina Mendoza',
    ownerPhone: '+57 312 458 9012',
    zone: 'Chapinero',
    totalOrders: 6,
    totalSpentCOP: 420000,
    lastOrderDate: '2024-10-20'
  },
  {
    id: 'p-2',
    petName: 'Kira',
    petBreed: 'Beagle',
    petAge: '2 años',
    petBirthday: '11-14',
    allergies: 'Ninguna conocida',
    favoriteProtein: 'Pollo',
    ownerName: 'Alejandro Restrepo',
    ownerPhone: '+57 320 891 4455',
    zone: 'Norte (Usaquén)',
    totalOrders: 4,
    totalSpentCOP: 260000,
    lastOrderDate: '2024-10-22'
  },
  {
    id: 'p-3',
    petName: 'Simba',
    petBreed: 'Criollo rescatado',
    petAge: '4 años',
    petBirthday: '10-30', // Cumpleaños este mes
    allergies: 'Intolerancia a colorantes y conservantes',
    favoriteProtein: 'Galletas',
    ownerName: 'Valeria Gómez',
    ownerPhone: '+57 310 776 2200',
    zone: 'Normandía / Engativá',
    totalOrders: 8,
    totalSpentCOP: 510000,
    lastOrderDate: '2024-10-24'
  },
  {
    id: 'p-4',
    petName: 'Max',
    petBreed: 'Bulldog Francés',
    petAge: '1 año',
    petBirthday: '12-05',
    allergies: 'Piel delicada, dieta 100% natural',
    favoriteProtein: 'Cerdo',
    ownerName: 'Felipe Duarte',
    ownerPhone: '+57 315 620 9911',
    zone: 'Chapinero Alto',
    totalOrders: 3,
    totalSpentCOP: 285000,
    lastOrderDate: '2024-10-18'
  }
];

export const ClientsPetsView: React.FC = () => {
  const [pets, setPets] = useState<PetProfile[]>(INITIAL_PETS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProtein, setFilterProtein] = useState<string>('Todas');

  // Filtrar cumpleaños de este mes (Octubre = mes 10)
  const currentMonth = '10';
  const birthdayPets = pets.filter(p => p.petBirthday.startsWith(currentMonth));

  const filteredPets = pets.filter(pet => {
    const matchesSearch = 
      pet.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.petBreed.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProtein = 
      filterProtein === 'Todas' || pet.favoriteProtein === filterProtein;

    return matchesSearch && matchesProtein;
  });

  const sendBirthdayWhatsApp = (pet: PetProfile) => {
    const message = `¡Hola ${pet.ownerName}! 🐾🎂 Te saluda el Chef Javier y Oreo de Cachorro Feliz.\n` +
      `Nos dimos cuenta de que muy pronto es el cumpleaños de ${pet.petName} 🐶🎈.\n` +
      `¡Queremos consentirlo como se merece! Tienes un 15% de descuento y una porción de galletas artesanales de obsequio en su próximo pedido del taller.\n` +
      `¿Deseas que te apartemos su proteína favorita (${pet.favoriteProtein})?`;

    const phoneClean = pet.ownerPhone.replace(/\D/g, '');
    const url = `https://api.whatsapp.com/send?phone=${phoneClean}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Encabezado */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#f8b46b] bg-[#334c5c] px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
            <Users className="w-3.5 h-3.5" /> CRM Canino & Directorio de Clientes
          </span>
          <h2 className="text-2xl font-black text-[#334c5c]">
            Ficha de Mascotas & Tutores Fieles
          </h2>
          <p className="text-xs text-gray-500">
            Control de requerimientos nutricionales, historial de compras y fidelización por WhatsApp.
          </p>
        </div>

        <div className="bg-[#fbf9f6] p-4 rounded-xl border border-gray-200 flex items-center gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Peludos Registrados</span>
            <span className="text-2xl font-black text-[#334c5c]">{pets.length} Mascotas</span>
          </div>
          <div className="border-l pl-4">
            <span className="text-[10px] uppercase font-bold text-[#ff7043] block">Cumpleaños este Mes</span>
            <span className="text-2xl font-black text-[#ff7043]">{birthdayPets.length} 🎂</span>
          </div>
        </div>
      </div>

      {/* Banner de Alerta de Cumpleaños del Mes */}
      {birthdayPets.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-[#f8b46b] p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#f8b46b] text-[#334c5c] flex items-center justify-center flex-shrink-0 text-xl font-bold shadow-md">
              🎂
            </div>
            <div>
              <h3 className="text-sm font-black text-[#334c5c]">
                ¡Hay {birthdayPets.length} peludos celebrando cumpleaños este mes!
              </h3>
              <p className="text-xs text-gray-600">
                {birthdayPets.map(p => `${p.petName} (${p.ownerName})`).join(', ')}. Envíales una felicitación con obsequio del taller.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por mascota, tutor o raza..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#334c5c] focus:outline-none bg-white shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {['Todas', 'Res', 'Pollo', 'Cerdo', 'Galletas'].map((prot) => (
            <button
              key={prot}
              type="button"
              onClick={() => setFilterProtein(prot)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                filterProtein === prot
                  ? 'bg-[#334c5c] text-[#f8b46b] border border-[#f8b46b]'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {prot}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Fichas de Mascotas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPets.map((pet) => {
          const isBirthday = pet.petBirthday.startsWith(currentMonth);
          return (
            <div
              key={pet.id}
              className={`bg-white p-5 rounded-2xl shadow-sm border transition flex flex-col justify-between space-y-4 ${
                isBirthday ? 'border-2 border-[#f8b46b]' : 'border-gray-200 hover:border-[#334c5c]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#334c5c] text-[#f8b46b] flex items-center justify-center font-black text-lg shadow-sm">
                      🐶
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-lg text-[#334c5c]">{pet.petName}</h4>
                        {isBirthday && (
                          <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Cake className="w-3 h-3" /> ¡Cumpleaños!
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-medium">{pet.petBreed} • {pet.petAge}</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold bg-[#f5f3f0] text-[#334c5c] px-2.5 py-1 rounded-lg">
                    {pet.favoriteProtein}
                  </span>
                </div>

                {/* Info Tutor */}
                <div className="bg-[#fbf9f6] p-3 rounded-xl border border-gray-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tutor:</span>
                    <span className="font-bold text-gray-800">{pet.ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Zona Bogotá:</span>
                    <span className="font-medium text-gray-700">{pet.zone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sensibilidad/Alergias:</span>
                    <span className="font-semibold text-[#ff7043]">{pet.allergies}</span>
                  </div>
                </div>

                {/* Métricas Cliente */}
                <div className="grid grid-cols-2 gap-2 text-xs text-center">
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Pedidos Taller</span>
                    <span className="font-black text-[#334c5c]">{pet.totalOrders} pedidos</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Histórico Consumido</span>
                    <span className="font-black text-green-700">${pet.totalSpentCOP.toLocaleString('es-CO')}</span>
                  </div>
                </div>
              </div>

              {/* Botón WhatsApp */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">
                  Última compra: {pet.lastOrderDate}
                </span>

                <button
                  type="button"
                  onClick={() => sendBirthdayWhatsApp(pet)}
                  className="flex items-center gap-1.5 bg-[#25d366] hover:bg-[#20ba59] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  {isBirthday ? 'Saludar por Cumpleaños' : 'Contactar Tutor'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientsPetsView;
