import React, { useState } from 'react'
import {
  Tag,
  Printer,
  RefreshCw,
  FileText,
  Award,
  Sparkles
} from 'lucide-react'
interface RecipeLabelConfig {
  id: string
  name: string
  category: 'Galletas' | 'Res' | 'Pollo' | 'Cerdo'
  badgeColor: string
  badgeBg: string
  logoUrl: string
  ingredients: string
  proteinMin: string
  fatMax: string
  moistureMax: string
  fiberMax: string
  shelfLifeDays: number
}
const RECIPES_DATA: Record<string, RecipeLabelConfig> = {
  res: {
    id: 'res',
    name: 'Deshidratados Premium de Res',
    category: 'Res',
    badgeColor: '#ffffff',
    badgeBg: '#e64a19',
    logoUrl: '/brand/LOGO%20DEFINITVO%20DESHIDRATADOS%20RES.png',
    ingredients:
      'Carne magra de res seleccionada 100% colombiana (Corte pulpa negra sin grasa visible), micro-aspersión de extracto de romero botánico como antioxidante natural.',
    proteinMin: '68.5%',
    fatMax: '8.2%',
    moistureMax: '9.4%',
    fiberMax: '1.2%',
    shelfLifeDays: 90
  },
  pollo: {
    id: 'pollo',
    name: 'Deshidratados Premium de Pollo',
    category: 'Pollo',
    badgeColor: '#334c5c',
    badgeBg: '#f8b46b',
    logoUrl: '/brand/LOGO%20DEFINITVO%20DESHIDRATADOS%20pollo.png',
    ingredients:
      'Pechuga magra de pollo fresco 100% colombiano sin piel ni cartílagos, deshidratada a baja temperatura con toque aromático de cúrcuma y romero fresco.',
    proteinMin: '72.0%',
    fatMax: '5.8%',
    moistureMax: '8.5%',
    fiberMax: '0.8%',
    shelfLifeDays: 90
  },
  cerdo: {
    id: 'cerdo',
    name: 'Deshidratados Premium de Cerdo',
    category: 'Cerdo',
    badgeColor: '#ffffff',
    badgeBg: '#7e57c2',
    logoUrl: '/brand/LOGO%20DEFINITVO%20DESHIDRATADOS%20CERDO.png',
    ingredients:
      'Lomo magro de cerdo seleccionado desgrasado, rebanado en lonjas finas y horneado/deshidratado en calor seco sin conservantes ni sales agregadas.',
    proteinMin: '65.0%',
    fatMax: '9.0%',
    moistureMax: '9.0%',
    fiberMax: '1.0%',
    shelfLifeDays: 90
  },
  galletas: {
    id: 'galletas',
    name: 'Galletas Artesanales Orgánicas',
    category: 'Galletas',
    badgeColor: '#f8b46b',
    badgeBg: '#334c5c',
    logoUrl: '/brand/LOGO%20DEFINITVO%20GALLETAS.jpg',
    ingredients:
      'Avena integral en hojuelas, hígado de res magro fresco, harina de linaza dorada, zanahoria orgánica rallada y aceite de coco virgen.',
    proteinMin: '22.4%',
    fatMax: '7.5%',
    moistureMax: '11.0%',
    fiberMax: '3.8%',
    shelfLifeDays: 60
  }
}
export const LabelDesignerStickyView: React.FC = () => {
  const [selectedProtein, setSelectedProtein] = useState<string>('res')
  const [gramaje, setGramaje] = useState<string>('250 g')
  const [batchCode, setBatchCode] = useState<string>('LT-RES-241028-04')
  const [elaborationDate, setElaborationDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [customIngredients, setCustomIngredients] = useState<string>('')
  const recipe = RECIPES_DATA[selectedProtein] || RECIPES_DATA.res
  const getExpirationDate = (baseDate: string, days: number) => {
    try {
      const date = new Date(baseDate)
      date.setDate(date.getDate() + days)
      return date.toISOString().split('T')[0]
    } catch {
      return '2025-01-26'
    }
  }
  const expirationDate = getExpirationDate(
    elaborationDate,
    recipe.shelfLifeDays
  )
  const handleRegenerateBatch = () => {
    const todayStr = elaborationDate.replace(/-/g, '').slice(2)
    const prefix = recipe.category.toUpperCase().slice(0, 3)
    const randomNum = Math.floor(Math.random() * 89 + 10)
    setBatchCode(`LT-${prefix}-${todayStr}-${randomNum}`)
  }
  return (
    <div className='space-y-6 font-sans'>
      {' '}
      {/* Encabezado */}{' '}
      <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        {' '}
        <div>
          {' '}
          <div className='flex items-center gap-2 mb-2'>
            {' '}
            <span className='text-[11px] font-bold uppercase tracking-wider text-[#f8b46b] bg-[#334c5c] px-3 py-1 rounded-full inline-flex items-center gap-1.5'>
              {' '}
              <Tag className='w-3.5 h-3.5' /> Módulo de Packaging & Trazabilidad{' '}
            </span>{' '}
            <span className='text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full flex items-center gap-1'>
              {' '}
              <Sparkles className='w-3 h-3' /> Vectorial 300 DPI Activo{' '}
            </span>{' '}
          </div>{' '}
          <h2 className='text-2xl font-black text-[#334c5c]'>
            {' '}
            Diseñador de Etiquetas & Stickers Artesanales{' '}
          </h2>{' '}
          <p className='text-xs text-gray-500'>
            {' '}
            Lotes, pesaje, tabla bromatológica y código QR dinámico de empaque.{' '}
          </p>{' '}
        </div>{' '}
        <button
          type='button'
          onClick={() => window.print()}
          className='flex items-center gap-2 bg-[#334c5c] hover:bg-[#273a46] text-[#f8b46b] font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer'
        >
          {' '}
          <Printer className='w-4 h-4 text-[#f8b46b]' /> Imprimir Rótulos{' '}
        </button>{' '}
      </div>{' '}
      {/* Grid Principal */}{' '}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
        {' '}
        {/* Panel Izquierdo: Controles */}{' '}
        <div className='lg:col-span-5 space-y-4'>
          {' '}
          {/* 1. Selección de Receta */}{' '}
          <div className='bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-3'>
            {' '}
            <span className='text-xs font-black text-[#334c5c] uppercase tracking-wider block'>
              {' '}
              1. Receta & Presentación{' '}
            </span>{' '}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1'>
              {' '}
              {Object.values(RECIPES_DATA).map(item => (
                <button
                  key={item.id}
                  type='button'
                  onClick={() => {
                    setSelectedProtein(item.id)
                    setCustomIngredients('')
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition text-center ${
                    selectedProtein === item.id
                      ? 'border-2 border-[#334c5c] bg-amber-50/40 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  {' '}
                  <div
                    className='w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-xs'
                    style={{
                      backgroundColor: item.badgeBg,
                      color: item.badgeColor
                    }}
                  >
                    {' '}
                    {item.category.slice(0, 3).toUpperCase()}{' '}
                  </div>{' '}
                  <span className='text-[11px] font-black text-[#334c5c] leading-tight'>
                    {' '}
                    {item.category}{' '}
                  </span>{' '}
                </button>
              ))}{' '}
            </div>{' '}
            <div className='pt-2 border-t border-gray-100'>
              {' '}
              <label className='text-[11px] font-bold text-gray-600 block mb-1.5'>
                {' '}
                Gramaje de Bolsa{' '}
              </label>{' '}
              <div className='grid grid-cols-3 gap-2'>
                {' '}
                {['100 g', '250 g', '500 g'].map(g => (
                  <button
                    key={g}
                    type='button'
                    onClick={() => setGramaje(g)}
                    className={`py-2 rounded-xl text-xs font-black transition ${
                      gramaje === g
                        ? 'bg-[#334c5c] text-[#f8b46b] shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {' '}
                    {g}{' '}
                  </button>
                ))}{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
          {/* 2. Lote & Fechas */}{' '}
          <div className='bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-3'>
            {' '}
            <div className='flex items-center justify-between'>
              {' '}
              <span className='text-xs font-black text-[#334c5c] uppercase tracking-wider'>
                {' '}
                2. Trazabilidad & Lote{' '}
              </span>{' '}
              <button
                type='button'
                onClick={handleRegenerateBatch}
                className='text-[11px] font-extrabold text-[#334c5c] hover:text-[#f8b46b] flex items-center gap-1'
              >
                {' '}
                <RefreshCw className='w-3 h-3' /> Auto-Lote{' '}
              </button>{' '}
            </div>{' '}
            <div className='space-y-3'>
              {' '}
              <div>
                {' '}
                <label className='text-[11px] font-bold text-gray-600 block mb-1'>
                  Identificador de Lote
                </label>{' '}
                <input
                  type='text'
                  value={batchCode}
                  onChange={e => setBatchCode(e.target.value)}
                  className='w-full text-xs font-black p-2.5 rounded-xl border border-gray-300 bg-[#fbf9f6]'
                />{' '}
              </div>{' '}
              <div className='grid grid-cols-2 gap-2'>
                {' '}
                <div>
                  {' '}
                  <label className='text-[11px] font-bold text-gray-600 block mb-1'>
                    Elaboración
                  </label>{' '}
                  <input
                    type='date'
                    value={elaborationDate}
                    onChange={e => setElaborationDate(e.target.value)}
                    className='w-full text-xs font-medium p-2 rounded-xl border border-gray-300'
                  />{' '}
                </div>{' '}
                <div>
                  {' '}
                  <label className='text-[11px] font-bold text-gray-600 block mb-1'>
                    Vencimiento
                  </label>{' '}
                  <div className='w-full text-xs font-black p-2 rounded-xl bg-gray-100 border border-gray-200 text-[#334c5c]'>
                    {' '}
                    {expirationDate}{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
          {/* 3. Bromatología */}{' '}
          <div className='bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-3'>
            {' '}
            <span className='text-xs font-black text-[#334c5c] uppercase tracking-wider block'>
              {' '}
              3. Composición Bromatológica{' '}
            </span>{' '}
            <textarea
              rows={3}
              value={customIngredients || recipe.ingredients}
              onChange={e => setCustomIngredients(e.target.value)}
              className='w-full text-xs p-2.5 rounded-xl border border-gray-300'
            />{' '}
            <div className='grid grid-cols-4 gap-1.5 text-center bg-[#fbf9f6] p-2.5 rounded-xl border border-gray-100'>
              {' '}
              <div>
                {' '}
                <span className='text-[9px] uppercase text-gray-400 font-bold block'>
                  Proteína Mín
                </span>{' '}
                <span className='text-xs font-black text-[#334c5c]'>
                  {recipe.proteinMin}
                </span>{' '}
              </div>{' '}
              <div>
                {' '}
                <span className='text-[9px] uppercase text-gray-400 font-bold block'>
                  Grasa Máx
                </span>{' '}
                <span className='text-xs font-black text-[#334c5c]'>
                  {recipe.fatMax}
                </span>{' '}
              </div>{' '}
              <div>
                {' '}
                <span className='text-[9px] uppercase text-gray-400 font-bold block'>
                  Humedad Máx
                </span>{' '}
                <span className='text-xs font-black text-[#334c5c]'>
                  {recipe.moistureMax}
                </span>{' '}
              </div>{' '}
              <div>
                {' '}
                <span className='text-[9px] uppercase text-gray-400 font-bold block'>
                  Fibra Máx
                </span>{' '}
                <span className='text-xs font-black text-[#334c5c]'>
                  {recipe.fiberMax}
                </span>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
        {/* Panel Derecho: Previsualización de Etiquetas */}{' '}
        <div className='lg:col-span-7 space-y-5'>
          {' '}
          {/* Etiqueta Frontal Circular */}{' '}
          <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col items-center space-y-4'>
            {' '}
            <div className='flex items-center justify-between w-full border-b pb-2 text-xs'>
              {' '}
              <span className='font-black text-[#334c5c] flex items-center gap-1.5'>
                {' '}
                <Award className='w-4 h-4 text-[#f8b46b]' /> 1. Etiqueta Frontal
                Circular Oficial (Ø 90 mm){' '}
              </span>{' '}
              <span className='text-gray-400 font-medium'>Vinilo Adhesivo</span>{' '}
            </div>{' '}
            <div className='relative w-64 h-64 sm:w-72 sm:h-72 rounded-full shadow-xl border-4 border-dashed border-gray-300 p-2 flex items-center justify-center bg-gray-50'>
              {' '}
              <div
                className='w-full h-full rounded-full flex flex-col items-center justify-between p-4 text-center text-white relative overflow-hidden shadow-md'
                style={{ backgroundColor: recipe.badgeBg }}
              >
                {' '}
                <div className='pt-2 z-10'>
                  {' '}
                  <span className='text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#f8b46b] block'>
                    {' '}
                    CACHORRO FELIZ{' '}
                  </span>{' '}
                  <span className='text-[9px] uppercase tracking-widest text-white/90 font-medium block'>
                    {' '}
                    Snacks Artesanales 100% Naturales{' '}
                  </span>{' '}
                </div>{' '}
                <div className='w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-white/80 p-0.5 overflow-hidden bg-white shadow-inner z-10 my-auto'>
                  {' '}
                  <img
                    src={recipe.logoUrl}
                    alt={recipe.name}
                    className='w-full h-full object-cover rounded-full'
                    onError={e => {
                      ;(e.target as HTMLImageElement).src =
                        '/brand/LOGO%20DEFINITVO%20CACHORRO.png'
                    }}
                  />{' '}
                </div>{' '}
                <div className='pb-1 z-10 space-y-0.5'>
                  {' '}
                  <span className='text-[11px] sm:text-xs font-black uppercase tracking-wider block bg-black/30 px-3 py-0.5 rounded-full'>
                    {' '}
                    {recipe.name}{' '}
                  </span>{' '}
                  <div className='flex items-center justify-center gap-2 text-[9px] text-white/80 font-bold'>
                    {' '}
                    <span>NETO: {gramaje}</span> • <span>BOGOTÁ, COLOMBIA</span>{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
          {/* Rótulo Dorsal */}{' '}
          <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-200 space-y-4'>
            {' '}
            <div className='flex items-center justify-between border-b pb-2 text-xs'>
              {' '}
              <span className='font-black text-[#334c5c] flex items-center gap-1.5'>
                {' '}
                <FileText className='w-4 h-4 text-[#334c5c]' /> 2. Rótulo Dorsal
                Técnico & Nutricional{' '}
              </span>{' '}
              <span className='font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full'>
                {' '}
                {batchCode}{' '}
              </span>{' '}
            </div>{' '}
            <div className='bg-[#fbf9f6] p-5 rounded-2xl border-2 border-gray-300 text-xs space-y-3 font-sans'>
              {' '}
              <div className='flex justify-between items-start border-b border-gray-200 pb-2.5'>
                {' '}
                <div>
                  {' '}
                  <h4 className='font-black text-sm text-[#334c5c] uppercase'>
                    {' '}
                    {recipe.name} — {gramaje}{' '}
                  </h4>{' '}
                  <span className='text-[10px] text-gray-500'>
                    {' '}
                    Alimento complementario para perros y gatos.{' '}
                  </span>{' '}
                </div>{' '}
                <div className='text-right'>
                  {' '}
                  <span className='text-[10px] font-bold text-gray-400 block'>
                    LOTE:
                  </span>{' '}
                  <span className='font-mono font-black text-xs text-[#334c5c]'>
                    {batchCode}
                  </span>{' '}
                </div>{' '}
              </div>{' '}
              <div>
                {' '}
                <span className='text-[10px] font-black uppercase text-gray-500 block mb-0.5'>
                  {' '}
                  Ingredientes:{' '}
                </span>{' '}
                <p className='text-[11px] text-gray-700 leading-relaxed'>
                  {' '}
                  {customIngredients || recipe.ingredients}{' '}
                </p>{' '}
              </div>{' '}
              <div className='border border-gray-200 rounded-xl overflow-hidden bg-white'>
                {' '}
                <div className='bg-[#334c5c] text-white text-[10px] font-black px-3 py-1 uppercase tracking-wider flex justify-between'>
                  {' '}
                  <span>Análisis Bromatológico Garantizado</span>{' '}
                  <span>Norma ICA</span>{' '}
                </div>{' '}
                <div className='grid grid-cols-4 text-center divide-x divide-gray-100 py-1.5 text-[11px]'>
                  {' '}
                  <div>
                    {' '}
                    <span className='text-[9px] text-gray-400 block'>
                      Proteína Mín
                    </span>{' '}
                    <strong className='text-[#334c5c]'>
                      {recipe.proteinMin}
                    </strong>{' '}
                  </div>{' '}
                  <div>
                    {' '}
                    <span className='text-[9px] text-gray-400 block'>
                      Grasa Máx
                    </span>{' '}
                    <strong className='text-[#334c5c]'>{recipe.fatMax}</strong>{' '}
                  </div>{' '}
                  <div>
                    {' '}
                    <span className='text-[9px] text-gray-400 block'>
                      Humedad Máx
                    </span>{' '}
                    <strong className='text-[#334c5c]'>
                      {recipe.moistureMax}
                    </strong>{' '}
                  </div>{' '}
                  <div>
                    {' '}
                    <span className='text-[9px] text-gray-400 block'>
                      Fibra Máx
                    </span>{' '}
                    <strong className='text-[#334c5c]'>
                      {recipe.fiberMax}
                    </strong>{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
              <div className='flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 border-t border-gray-200'>
                {' '}
                <div className='space-y-1 text-[11px] text-gray-600'>
                  {' '}
                  <p>
                    <strong>Elaborado:</strong> {elaborationDate}
                  </p>{' '}
                  <p>
                    <strong>Vence:</strong>{' '}
                    <span className='font-black text-red-600'>
                      {expirationDate}
                    </span>
                  </p>{' '}
                  <p className='text-[10px] text-gray-400'>
                    {' '}
                    Chef Javier Mauricio Rodríguez • Normandía, Bogotá.{' '}
                  </p>{' '}
                </div>{' '}
                <div className='flex items-center gap-2.5 bg-white p-2 rounded-xl border border-gray-200'>
                  {' '}
                  <img
                    src='/brand/INSTAGRAM%20CACHORRO.jpeg'
                    alt='QR Instagram'
                    className='w-14 h-14 object-contain rounded'
                    onError={e => {
                      ;(e.target as HTMLImageElement).src =
                        '/brand/LOGO%20DEFINITVO%20CACHORRO.png'
                    }}
                  />{' '}
                  <div className='text-[10px] leading-tight'>
                    {' '}
                    <span className='font-black text-[#334c5c] block'>
                      @snacks_cachorro_feliz
                    </span>{' '}
                    <span className='text-gray-400 block'>
                      Tips de nutrición
                    </span>{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
      </div>{' '}
    </div>
  )
}
export default LabelDesignerStickyView
