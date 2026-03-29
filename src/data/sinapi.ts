import { StandardType, FoundationType, WallType, RoofType, FinishType } from '../types';

// Mocked coefficients based on SINAPI/CUB averages for medium standard
// Values are per m² of built area
export const COEFFICIENTS = {
  cement: 0.5, // bags per m²
  sand: 0.1, // m³ per m²
  gravel: 0.08, // m³ per m²
  steel: 5.0, // kg per m²
  bricks: 25, // units per m²
  mortar: 0.02, // m³ per m²
  tiles: 15, // units per m² (ceramic)
  wood: 0.05, // m³ per m² (roof structure)
  floor: 1.1, // m² per m² (includes waste)
  paint: 0.4, // liters per m²
  plumbing: 1.0, // generic unit per m²
  electrical: 1.0, // generic unit per m²
};

// Mocked prices (average SINAPI 2024/2025)
export const PRICES = {
  cement: 35.0, // per bag
  sand: 120.0, // per m³
  gravel: 110.0, // per m³
  steel: 8.5, // per kg
  bricks: 0.9, // per unit
  mortar: 25.0, // per bag (pre-mixed)
  tiles_ceramic: 2.5, // per unit
  tiles_metalic: 45.0, // per m²
  tiles_fibrocimento: 25.0, // per m²
  roof_wood: 120.0, // structure per m²
  roof_metal: 150.0, // structure per m²
  roof_profile: 180.0, // structure per m²
  wood: 2500.0, // per m³
  floor_simple: 35.0, // per m²
  floor_medium: 65.0, // per m²
  floor_complete: 120.0, // per m²
  paint_matte: 45.0, // per liter
  paint_semi: 75.0, // per liter
  texture: 35.0, // per m²
  fuge: 120.0, // per m²
  grafiato: 52.0, // per m²
  projetada: 65.0, // per m²
  door_wood: 450.0, // per unit
  door_glass: 1200.0, // per unit
  window_simple: 250.0, // per unit
  window_aluminum: 650.0, // per unit
  countertop_granite: 450.0, // per linear meter
  countertop_marble: 850.0, // per linear meter
  countertop_quartz: 1200.0, // per linear meter
  countertop_inox: 600.0, // per linear meter
  ceiling_gesso_cola: 45.0, // per m²
  ceiling_gesso_drywall: 65.0, // per m²
  ceiling_pvc: 35.0, // per m²
  labor_m2: 850.0, // average labor cost per m²
};

export const COMPANY_INFO = {
  name: "Visar Construtora",
  cnpj: "15.402.649/0001-06",
  website: "www.visarconstrutora.com.br",
  email: "contato@visarconstrutora.com.br",
  description: "A Visar Construtora é referência em construção civil de alto padrão. Nossa missão é transformar projetos em realidade com máxima eficiência, transparência e inovação tecnológica. Utilizamos os melhores insumos e profissionais qualificados para garantir que cada obra seja um marco de qualidade e durabilidade.",
};

// Multipliers based on standard
export const STANDARD_MULTIPLIERS: Record<StandardType, number> = {
  baixo: 0.85,
  medio: 1.0,
  alto: 1.35,
};

// Category weight distribution (average %)
export const CATEGORY_WEIGHTS = {
  fundacao: 0.10,
  estrutura: 0.15,
  alvenaria: 0.15,
  cobertura: 0.10,
  eletrica: 0.08,
  hidraulica: 0.07,
  acabamento: 0.20,
  pintura: 0.05,
  pisos: 0.10,
};
