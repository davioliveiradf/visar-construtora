import { BudgetInput, BudgetResult, MaterialItem, CategorySummary } from '../types';
import { COEFFICIENTS, PRICES, STANDARD_MULTIPLIERS, COMPANY_INFO } from '../data/sinapi';

export function calculateBudget(input: BudgetInput): BudgetResult {
  const { 
    area, standard, foundation, wall, roof, roofStructure, 
    finish, door, window, bedrooms, suites, bathrooms, 
    kitchens, serviceAreas, halls, internalPaintFinish, 
    externalPaintFinish, externalCoating, countertopStone, 
    wallPaintColor, ceilingPaintColor, externalPaintColor,
    externalPaintBrand, countertopType, floor
  } = input;
  
  const multiplier = STANDARD_MULTIPLIERS[standard] || 1.0;
  const effectiveFinish = finish || (standard === 'baixo' ? 'simples' : standard === 'medio' ? 'medio' : 'completo');
  
  const materials: MaterialItem[] = [];

  // Helper to add material with labor
  const addMaterial = (name: string, unit: string, quantity: number, materialUnitPrice: number, category: string, laborRatio: number = 0) => {
    const materialPrice = quantity * materialUnitPrice;
    // If laborRatio is provided, we calculate labor as a percentage of material or as a separate component
    // But we have a global labor_m2, so let's use that instead for more accuracy
    materials.push({
      name,
      unit,
      quantity,
      unitPrice: materialUnitPrice,
      totalPrice: materialPrice,
      category,
      materialPrice: materialPrice,
      laborPrice: 0, // We will add labor separately per category
    });
  };

  // 1. Foundation
  const cementQty = area * COEFFICIENTS.cement * (foundation === 'sapata' ? 1.2 : 1.0);
  addMaterial('Cimento (Sacos 50kg)', 'Saco', Math.ceil(cementQty), PRICES.cement, 'Fundação');

  const sandQty = area * COEFFICIENTS.sand;
  addMaterial('Areia Lavada', 'm³', Number(sandQty.toFixed(2)), PRICES.sand, 'Fundação');

  const gravelQty = area * COEFFICIENTS.gravel;
  addMaterial('Brita nº 1', 'm³', Number(gravelQty.toFixed(2)), PRICES.gravel, 'Fundação');

  const steelQty = area * COEFFICIENTS.steel * (foundation === 'sapata' ? 1.3 : 1.0);
  addMaterial('Aço CA-50/60', 'kg', Math.ceil(steelQty), PRICES.steel, 'Estrutura');

  // 2. Masonry & Plaster (Reboco)
  const brickQty = area * COEFFICIENTS.bricks * (wall === 'eps' ? 0.2 : 1.0);
  addMaterial(wall === 'eps' ? 'Painéis EPS' : 'Blocos Cerâmicos', wall === 'eps' ? 'm²' : 'Unid', Math.ceil(brickQty), wall === 'eps' ? 150.0 : PRICES.bricks, 'Alvenaria');

  addMaterial('Argamassa para Reboco (Paredes e Teto)', 'Saco', Math.ceil(area * 0.8), PRICES.mortar, 'Alvenaria');

  // 3. Roof & Structure
  const tileQty = roof === 'ceramica' ? area * COEFFICIENTS.tiles : area;
  const tilePrice = roof === 'ceramica' ? PRICES.tiles_ceramic : roof === 'metalica' ? PRICES.tiles_metalic : PRICES.tiles_fibrocimento;
  addMaterial(roof === 'ceramica' ? 'Telha Cerâmica' : roof === 'metalica' ? 'Telha Metálica' : 'Telha Fibrocimento', roof === 'ceramica' ? 'Unid' : 'm²', Math.ceil(tileQty), tilePrice, 'Cobertura');

  const structurePrice = roofStructure === 'madeira' ? PRICES.roof_wood : roofStructure === 'metalica' ? PRICES.roof_metal : PRICES.roof_profile;
  addMaterial(`Estrutura de Cobertura (${roofStructure})`, 'm²', area, structurePrice, 'Cobertura');

  // 4. Floors & Finish
  const floorPrice = effectiveFinish === 'simples' ? PRICES.floor_simple : effectiveFinish === 'medio' ? PRICES.floor_medium : PRICES.floor_complete;
  addMaterial(`Piso (${floor})`, 'm²', Math.ceil(area * COEFFICIENTS.floor), floorPrice, 'Pisos');

  // 5. Painting
  const intPaintPrice = internalPaintFinish === 'fosca' ? PRICES.paint_matte : 
                        internalPaintFinish === 'acetinada' ? PRICES.paint_semi * 1.1 :
                        internalPaintFinish === 'semi-brilho' ? PRICES.paint_semi :
                        PRICES.paint_semi * 1.2; // brilhante
  
  // Walls
  addMaterial(`Tinta para Paredes (${internalPaintFinish} - ${wallPaintColor})`, 'Litro', Math.ceil(area * 0.25), intPaintPrice, 'Pintura');
  
  // Ceiling
  addMaterial(`Tinta para Teto (${internalPaintFinish} - ${ceilingPaintColor})`, 'Litro', Math.ceil(area * 0.1), intPaintPrice, 'Pintura');

  const extPaintPrice = externalPaintFinish === 'fosca' ? PRICES.paint_matte : PRICES.paint_semi;
  const extCoatingPrice = externalCoating === 'pintura' ? extPaintPrice : 
                          externalCoating === 'textura' ? PRICES.texture : 
                          externalCoating === 'grafiato' ? PRICES.grafiato :
                          externalCoating === 'projetada' ? PRICES.projetada :
                          PRICES.fuge;
  addMaterial(`Revestimento Externo (${externalCoating} - ${externalPaintColor} - ${externalPaintBrand})`, 'm²', Math.ceil(area * 0.5), extCoatingPrice, 'Pintura');

  // 6. Countertops
  const stonePrice = countertopStone === 'granito' ? PRICES.countertop_granite : countertopStone === 'marmore' ? PRICES.countertop_marble : countertopStone === 'quartzo' ? PRICES.countertop_quartz : PRICES.countertop_inox;
  addMaterial(`Bancada (${countertopType} - ${countertopStone})`, 'm', kitchens * 2 + bathrooms * 1, stonePrice, 'Acabamento');

  // 7. Electrical & Plumbing (Detailed by rooms)
  const roomCount = bedrooms + suites + bathrooms + kitchens + serviceAreas + halls;
  addMaterial('Fiação e Dispositivos Elétricos (Detalhado)', 'Conjunto', roomCount, 150.0 * multiplier, 'Elétrica');

  // 8. Doors & Windows
  const doorQty = bedrooms + suites + bathrooms + kitchens + serviceAreas + 1; // +1 for main door
  addMaterial(`Portas (${door === 'madeira' ? 'Madeira' : 'Vidro'})`, 'Unid', doorQty, door === 'madeira' ? PRICES.door_wood : PRICES.door_glass, 'Portas e Janelas');

  const windowQty = bedrooms + suites + bathrooms + kitchens + 1;
  addMaterial(`Janelas (${window === 'aluminio' ? 'Alumínio' : 'Simples'})`, 'Unid', windowQty, window === 'aluminio' ? PRICES.window_aluminum : PRICES.window_simple, 'Portas e Janelas');

  // 9. Labor (Mão de obra) - Distributed by categories
  const totalLaborCost = area * PRICES.labor_m2 * multiplier;
  
  const laborWeights: Record<string, number> = {
    'Fundação': 0.15,
    'Estrutura': 0.20,
    'Alvenaria': 0.20,
    'Cobertura': 0.10,
    'Pisos': 0.10,
    'Pintura': 0.10,
    'Acabamento': 0.05,
    'Elétrica': 0.05,
    'Portas e Janelas': 0.05,
  };

  Object.entries(laborWeights).forEach(([category, weight]) => {
    const categoryLabor = totalLaborCost * weight;
    materials.push({
      name: `Mão de Obra - ${category}`,
      unit: 'Global',
      quantity: 1,
      unitPrice: categoryLabor,
      totalPrice: categoryLabor,
      category,
      materialPrice: 0,
      laborPrice: categoryLabor,
    });
  });

  // Calculate totals
  const totalMaterialCost = materials.reduce((acc, item) => acc + item.materialPrice, 0);
  const totalCost = totalMaterialCost + totalLaborCost;
  const costPerM2 = totalCost / area;

  // Group by category for chart
  const categoryMap = new Map<string, number>();
  materials.forEach(item => {
    categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + item.totalPrice);
  });

  const categories: CategorySummary[] = Array.from(categoryMap.entries()).map(([name, total]) => ({
    name,
    total,
    percentage: (total / totalCost) * 100,
  }));

  const months = Math.ceil(area / 20);
  const estimatedDeadline = `${months} a ${months + 2} meses`;

  return {
    input,
    materials,
    categories,
    totalCost,
    totalMaterialCost,
    totalLaborCost,
    costPerM2,
    estimatedDeadline,
  };
}

export function saveBudget(budget: BudgetResult) {
  const history = getHistory();
  const updatedHistory = [budget, ...history];
  localStorage.setItem('budget_history', JSON.stringify(updatedHistory));
}

export function getHistory(): BudgetResult[] {
  const data = localStorage.getItem('budget_history');
  return data ? JSON.parse(data) : [];
}

export function generateProposalText(result: BudgetResult): string {
  const { input, totalCost, totalMaterialCost, totalLaborCost, costPerM2, estimatedDeadline, materials } = result;
  
  return `
*PROPOSTA TÉCNICA DE CONSTRUÇÃO - VISAR CONSTRUTORA*
--------------------------------------------------
EMPRESA: ${COMPANY_INFO.name}
CNPJ: ${COMPANY_INFO.cnpj}
CONTATO: ${COMPANY_INFO.email} | ${COMPANY_INFO.website}

CLIENTE: ${input.clientName}
LOCAL: ${input.city} - ${input.state}
DATA: ${new Date(input.createdAt).toLocaleDateString('pt-BR')}

RESUMO DO PROJETO:
- Área Total: ${input.area} m²
- Padrão de Acabamento: ${input.standard.toUpperCase()}
- Composição: ${input.bedrooms} Quartos, ${input.suites} Suítes, ${input.bathrooms} Banheiros, ${input.kitchens} Cozinha(s)
- Tipo de Fundação: ${input.foundation.toUpperCase()}
- Cobertura: ${input.roof.toUpperCase()} com estrutura em ${input.roofStructure.toUpperCase()}
- Pintura Interna: ${input.internalPaintFinish.toUpperCase()}
- Cor das Paredes: ${input.wallPaintColor}
- Cor do Teto: ${input.ceilingPaintColor}
- Revestimento Externo: ${input.externalCoating.toUpperCase()} (${input.externalPaintColor})
- Marca da Tinta (Externa): ${input.externalPaintBrand}
- Bancadas: ${input.countertopType} em ${input.countertopStone.toUpperCase()}

VALORES ESTIMADOS:
- Custo por m²: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(costPerM2)}
- TOTAL EM MATERIAIS: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalMaterialCost)}
- TOTAL EM MÃO DE OBRA: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalLaborCost)}
- VALOR TOTAL DA OBRA: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCost)}
- Prazo Estimado: ${estimatedDeadline}

DESCRIÇÃO DOS SERVIÇOS E MATERIAIS:
A presente proposta contempla a execução completa da obra pela ${COMPANY_INFO.name}, seguindo rigorosamente os padrões de engenharia e tecnologia de ponta.

PRINCIPAIS MATERIAIS E ACABAMENTOS:
${materials.filter(m => m.materialPrice > 0).slice(0, 12).map(m => `- ${m.name}: ${m.quantity} ${m.unit}`).join('\n')}
... (lista completa anexa ao orçamento detalhado)

OBSERVAÇÕES:
1. Os valores são baseados em índices médios do SINAPI e tecnologia digital de orçamentação.
2. Inclui reboco e pintura completa (paredes e teto) conforme especificações técnicas.
3. Bancadas em ${input.countertopStone.toUpperCase()} inclusas para cozinha e banheiros.
4. A validade deste orçamento é de 15 dias.

--------------------------------------------------
VISAR CONSTRUTORA
"Construindo sonhos com inteligência e tecnologia."
--------------------------------------------------
  `.trim();
}
