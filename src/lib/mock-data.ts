import { Bid, LineItem } from './supabase'

export function generateBidId(): string {
  return `BID-${Date.now().toString(36).toUpperCase()}`
}

export function generateLineItemId(): string {
  return `LI-${Math.random().toString(36).substring(2, 9)}`
}

const equipmentBySystem: Record<string, { description: string; price: number }[]> = {
  'Central AC': [
    { description: '14 SEER2 Central Air Conditioner Unit', price: 3200 },
    { description: 'Evaporator Coil', price: 850 },
    { description: 'Refrigerant Line Set (30ft)', price: 280 },
    { description: 'Condensate Drain Kit', price: 65 },
    { description: 'Thermostat (Programmable)', price: 175 },
  ],
  'Heat Pump': [
    { description: '15 SEER2 Heat Pump System', price: 4100 },
    { description: 'Air Handler Unit', price: 1800 },
    { description: 'Refrigerant Line Set (30ft)', price: 280 },
    { description: 'Backup Heat Strip Kit (10kW)', price: 320 },
    { description: 'Smart Thermostat', price: 250 },
  ],
  'Furnace': [
    { description: '96% AFUE Gas Furnace', price: 2800 },
    { description: 'Vent Pipe Kit (Category IV)', price: 340 },
    { description: 'Gas Line Connection Kit', price: 120 },
    { description: 'Air Filter Assembly', price: 85 },
    { description: 'Programmable Thermostat', price: 175 },
  ],
  'Mini Split': [
    { description: 'Ductless Mini Split System (18,000 BTU)', price: 2400 },
    { description: 'Wall Mount Bracket Kit', price: 85 },
    { description: 'Refrigerant Line Set (25ft)', price: 220 },
    { description: 'Condensate Pump', price: 95 },
    { description: 'Wireless Remote Control', price: 45 },
  ],
  'Boiler': [
    { description: 'High-Efficiency Condensing Boiler', price: 5200 },
    { description: 'Expansion Tank', price: 180 },
    { description: 'Circulator Pump', price: 320 },
    { description: 'Zone Valve Kit', price: 275 },
    { description: 'Vent/Air Separator', price: 140 },
  ],
  'Package Unit': [
    { description: '14 SEER Package Unit (3.5 Ton)', price: 4800 },
    { description: 'Roof Curb Adapter', price: 450 },
    { description: 'Supply/Return Duct Transition', price: 280 },
    { description: 'Thermostat (Commercial)', price: 320 },
    { description: 'Disconnect Box & Whip', price: 95 },
  ],
}

const materialsByService: Record<string, { description: string; price: number; qty: number }[]> = {
  'install': [
    { description: 'Copper Fittings & Brazing Materials', qty: 1, price: 180 },
    { description: 'Electrical Wire & Disconnect', qty: 1, price: 220 },
    { description: 'Concrete Pad / Mounting Hardware', qty: 1, price: 150 },
    { description: 'Duct Sealing / Insulation Materials', qty: 1, price: 120 },
    { description: 'Permits & Inspection Fees', qty: 1, price: 350 },
  ],
  'repair': [
    { description: 'Replacement Parts (as needed)', qty: 1, price: 280 },
    { description: 'Refrigerant Recharge (R-410A)', qty: 1, price: 185 },
    { description: 'Electrical Components', qty: 1, price: 120 },
  ],
  'maintenance': [
    { description: 'Filter Replacement (2-pack)', qty: 1, price: 45 },
    { description: 'Coil Cleaner Solution', qty: 1, price: 25 },
    { description: 'Drain Treatment Tablets', qty: 1, price: 15 },
  ],
  'ductwork': [
    { description: 'Sheet Metal Ductwork (per linear ft)', qty: 40, price: 18 },
    { description: 'Flex Duct (per linear ft)', qty: 20, price: 8 },
    { description: 'Duct Insulation (R-8)', qty: 60, price: 4 },
    { description: 'Register Boots & Grilles', qty: 8, price: 35 },
    { description: 'Duct Mastic & Tape', qty: 1, price: 65 },
  ],
}

const laborRates: Record<string, { hours: number; rate: number }> = {
  'install': { hours: 12, rate: 95 },
  'repair': { hours: 3, rate: 110 },
  'maintenance': { hours: 1.5, rate: 85 },
  'ductwork': { hours: 16, rate: 90 },
}

export function generateMockBid(input: {
  clientName: string
  clientAddress: string
  clientPhone: string
  clientEmail: string
  jobType: 'residential' | 'commercial'
  serviceTypes: string[]
  systemType: string
  squareFootage: number
  location: string
  notes: string
}): Bid {
  const lineItems: LineItem[] = []
  let totalLabor = 0
  let totalLaborHours = 0

  // Commercial multiplier
  const commercialMult = input.jobType === 'commercial' ? 1.4 : 1
  // Size multiplier
  const sizeMult = input.squareFootage > 3000 ? 1.2 : input.squareFootage > 2000 ? 1.1 : 1

  // Equipment
  const equipment = equipmentBySystem[input.systemType] || equipmentBySystem['Central AC']
  if (input.serviceTypes.includes('install')) {
    equipment.forEach(item => {
      const price = Math.round(item.price * commercialMult * sizeMult)
      lineItems.push({
        id: generateLineItemId(),
        category: 'equipment',
        description: item.description,
        quantity: 1,
        unit_price: price,
        total: price,
      })
    })
  }

  // Materials per service
  input.serviceTypes.forEach(service => {
    const materials = materialsByService[service] || []
    materials.forEach(mat => {
      const price = Math.round(mat.price * commercialMult)
      lineItems.push({
        id: generateLineItemId(),
        category: 'materials',
        description: mat.description,
        quantity: mat.qty,
        unit_price: price,
        total: Math.round(price * mat.qty),
      })
    })
  })

  // Labor per service
  input.serviceTypes.forEach(service => {
    const labor = laborRates[service] || laborRates['repair']
    const hours = Math.round(labor.hours * commercialMult * sizeMult * 10) / 10
    const rate = Math.round(labor.rate * commercialMult)
    const laborCost = Math.round(hours * rate)
    totalLaborHours += hours
    totalLabor += laborCost
    lineItems.push({
      id: generateLineItemId(),
      category: 'labor',
      description: `${service.charAt(0).toUpperCase() + service.slice(1)} Labor (${hours} hrs @ $${rate}/hr)`,
      quantity: 1,
      unit_price: laborCost,
      total: laborCost,
    })
  })

  const totalAmount = lineItems.reduce((sum, item) => sum + item.total, 0)

  const validDate = new Date()
  validDate.setDate(validDate.getDate() + 30)

  return {
    id: generateBidId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'demo-user',
    client_name: input.clientName,
    client_address: input.clientAddress,
    client_phone: input.clientPhone,
    client_email: input.clientEmail,
    job_type: input.jobType,
    service_type: input.serviceTypes,
    system_type: input.systemType,
    square_footage: input.squareFootage,
    location: input.location,
    notes: input.notes,
    status: 'draft',
    total_amount: Math.round(totalAmount),
    line_items: lineItems,
    labor_hours: totalLaborHours,
    labor_rate: input.jobType === 'commercial' ? 133 : 95,
    company_name: '',
    company_phone: '',
    company_email: '',
    company_license: '',
    valid_until: validDate.toISOString().split('T')[0],
    terms: 'Payment due within 30 days of project completion. 1-year warranty on all labor. Equipment warranty per manufacturer terms. Price valid for 30 days from bid date. Any changes to scope of work may result in additional charges. Customer responsible for obtaining HOA approval if required.',
  }
}

export const sampleBids: Bid[] = [
  {
    id: 'BID-SAMPLE1',
    created_at: '2026-03-15T10:00:00Z',
    updated_at: '2026-03-15T10:00:00Z',
    user_id: 'demo-user',
    client_name: 'Johnson Residence',
    client_address: '1234 Oak Street, Austin, TX 78701',
    client_phone: '(512) 555-0142',
    client_email: 'mike.johnson@email.com',
    job_type: 'residential',
    service_type: ['install'],
    system_type: 'Central AC',
    square_footage: 2200,
    location: 'Austin, TX',
    notes: 'Replacing old R-22 system. Prefer high efficiency.',
    status: 'sent',
    total_amount: 7850,
    line_items: [],
    labor_hours: 12,
    labor_rate: 95,
    company_name: '',
    company_phone: '',
    company_email: '',
    company_license: '',
    valid_until: '2026-04-15',
    terms: '',
  },
  {
    id: 'BID-SAMPLE2',
    created_at: '2026-03-20T14:30:00Z',
    updated_at: '2026-03-22T09:00:00Z',
    user_id: 'demo-user',
    client_name: 'Riverside Office Park',
    client_address: '500 Commerce Blvd, Suite 200, Dallas, TX 75201',
    client_phone: '(214) 555-0198',
    client_email: 'facilities@riverside.com',
    job_type: 'commercial',
    service_type: ['install', 'ductwork'],
    system_type: 'Package Unit',
    square_footage: 8500,
    location: 'Dallas, TX',
    notes: 'New tenant buildout. Need package unit on roof with full duct system.',
    status: 'accepted',
    total_amount: 18400,
    line_items: [],
    labor_hours: 32,
    labor_rate: 133,
    company_name: '',
    company_phone: '',
    company_email: '',
    company_license: '',
    valid_until: '2026-04-20',
    terms: '',
  },
  {
    id: 'BID-SAMPLE3',
    created_at: '2026-03-25T08:15:00Z',
    updated_at: '2026-03-25T08:15:00Z',
    user_id: 'demo-user',
    client_name: 'Garcia Family',
    client_address: '789 Elm Drive, San Antonio, TX 78205',
    client_phone: '(210) 555-0167',
    client_email: 'maria.garcia@email.com',
    job_type: 'residential',
    service_type: ['repair'],
    system_type: 'Heat Pump',
    square_footage: 1800,
    location: 'San Antonio, TX',
    notes: 'System not cooling. Compressor making noise.',
    status: 'draft',
    total_amount: 1250,
    line_items: [],
    labor_hours: 3,
    labor_rate: 110,
    company_name: '',
    company_phone: '',
    company_email: '',
    company_license: '',
    valid_until: '2026-04-25',
    terms: '',
  },
]
