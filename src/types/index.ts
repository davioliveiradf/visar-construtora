export type FoundationType = 'radier' | 'sapata';
export type WallType = 'alvenaria' | 'eps';
export type RoofType = 'ceramica' | 'metalica' | 'fibrocimento';
export type RoofStructure = 'madeira' | 'metalica' | 'perfil_aco';
export type FinishType = 'simples' | 'medio' | 'completo';
export type StandardType = 'baixo' | 'medio' | 'alto';
export type DoorType = 'madeira' | 'vidro';
export type WindowType = 'aluminio' | 'simples';
export type PaintFinish = 'fosca' | 'semi-brilho' | 'acetinada' | 'brilhante';
export type CountertopStone = 'granito' | 'marmore' | 'quartzo' | 'inox';
export type ExternalCoating = 'pintura' | 'textura' | 'fuge_pedrisco' | 'grafiato' | 'projetada';

export interface BudgetInput {
  id: string;
  clientName: string;
  area: number;
  city: string;
  state: string;
  standard: StandardType;
  foundation: FoundationType;
  wall: WallType;
  roof: RoofType;
  roofStructure: RoofStructure;
  finish: FinishType;
  floor: string;
  door: DoorType;
  window: WindowType;
  
  // New detailed fields
  bedrooms: number;
  suites: number;
  bathrooms: number;
  kitchens: number;
  serviceAreas: number;
  halls: number;
  
  internalPaintFinish: PaintFinish;
  externalPaintFinish: PaintFinish;
  wallPaintColor: string;
  ceilingPaintColor: string;
  externalPaintColor: string;
  externalCoating: ExternalCoating;
  externalPaintBrand: string;
  
  countertopType: string;
  countertopStone: CountertopStone;
  
  createdAt: string;
}

export interface MaterialItem {
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
  materialPrice: number;
  laborPrice: number;
}

export interface CategorySummary {
  name: string;
  total: number;
  percentage: number;
}

export interface BudgetResult {
  input: BudgetInput;
  materials: MaterialItem[];
  categories: CategorySummary[];
  totalCost: number;
  totalMaterialCost: number;
  totalLaborCost: number;
  costPerM2: number;
  estimatedDeadline: string;
}
