import { BuildTier, ComponentType, PCComponent } from './types';

// Mock Component Data
const COMPONENTS: Record<string, PCComponent> = {
  // CPUs
  cpu_i3: { 
    id: 'cpu_i3', 
    type: ComponentType.CPU, 
    name: 'Intel Core i3-12100F', 
    price: 8500, 
    isLocked: true, 
    specs: '4 Cores, 4.3 GHz',
    image: 'https://m.media-amazon.com/images/I/5103Xi7yQgL._AC_SL1000_.jpg'
  },
  cpu_i5: { 
    id: 'cpu_i5', 
    type: ComponentType.CPU, 
    name: 'Intel Core i5-12400F', 
    price: 12500, 
    isLocked: true, 
    specs: '6 Cores, 4.4 GHz',
    image: 'https://m.media-amazon.com/images/I/5103Xi7yQgL._AC_SL1000_.jpg'
  },
  cpu_i7: { 
    id: 'cpu_i7', 
    type: ComponentType.CPU, 
    name: 'Intel Core i7-12700F', 
    price: 24000, 
    isLocked: true, 
    specs: '12 Cores, 4.9 GHz',
    image: 'https://m.media-amazon.com/images/I/5103Xi7yQgL._AC_SL1000_.jpg'
  },

  // Motherboards (High quality mandated)
  mobo_h610: { 
    id: 'mobo_h610', 
    type: ComponentType.MOTHERBOARD, 
    name: 'MSI PRO H610M-E DDR4', 
    price: 6500, 
    isLocked: true, 
    specs: 'Reliable VRMs, PCIe 4.0',
    image: 'https://m.media-amazon.com/images/I/81d6-e+cDrL._AC_SL1500_.jpg'
  },
  mobo_b660: { 
    id: 'mobo_b660', 
    type: ComponentType.MOTHERBOARD, 
    name: 'ASUS Prime B660M-A WiFi', 
    price: 11500, 
    isLocked: true, 
    specs: 'Heavy Duty, WiFi 6',
    image: 'https://m.media-amazon.com/images/I/81fC9h+0FdL._AC_SL1500_.jpg'
  },

  // GPUs
  gpu_arc380: { 
    id: 'gpu_arc380', 
    type: ComponentType.GPU, 
    name: 'Intel Arc A380 6GB', 
    price: 10500, 
    isLocked: true, 
    specs: 'Great for AV1 Encoding',
    image: 'https://m.media-amazon.com/images/I/71X-x+j+V+L._AC_SL1500_.jpg'
  },
  gpu_rx6600: { 
    id: 'gpu_rx6600', 
    type: ComponentType.GPU, 
    name: 'AMD Radeon RX 6600 8GB', 
    price: 19500, 
    isLocked: true, 
    specs: '1080p Gaming King',
    image: 'https://m.media-amazon.com/images/I/81u6E5c+-ZL._AC_SL1500_.jpg'
  },
  gpu_rtx3060: { 
    id: 'gpu_rtx3060', 
    type: ComponentType.GPU, 
    name: 'NVIDIA RTX 3060 12GB', 
    price: 25000, 
    isLocked: true, 
    specs: 'Ray Tracing, DLSS',
    image: 'https://m.media-amazon.com/images/I/71518+-2xML._AC_SL1500_.jpg'
  },

  // RAM (Configurable)
  ram_8gb: { 
    id: 'ram_8gb', 
    type: ComponentType.RAM, 
    name: '8GB Adata XPG Gammix D30', 
    price: 1800, 
    isLocked: false, 
    specs: '3200MHz CL16',
    image: 'https://m.media-amazon.com/images/I/61+-3e+4-CL._AC_SL1000_.jpg'
  },
  ram_16gb: { 
    id: 'ram_16gb', 
    type: ComponentType.RAM, 
    name: '16GB (8x2) Adata XPG Gammix D30', 
    price: 3400, 
    isLocked: false, 
    specs: '3200MHz CL16 Dual Channel',
    image: 'https://m.media-amazon.com/images/I/61+-3e+4-CL._AC_SL1000_.jpg'
  },
  ram_32gb: { 
    id: 'ram_32gb', 
    type: ComponentType.RAM, 
    name: '32GB (16x2) Corsair Vengeance LPX', 
    price: 6500, 
    isLocked: false, 
    specs: '3200MHz CL16 Dual Channel',
    image: 'https://m.media-amazon.com/images/I/71c6wP+xTdL._AC_SL1500_.jpg'
  },

  // Storage (Configurable)
  ssd_500gb: { 
    id: 'ssd_500gb', 
    type: ComponentType.STORAGE, 
    name: '500GB WD Blue SN570 NVMe', 
    price: 3200, 
    isLocked: false, 
    specs: '3500MB/s Read',
    image: 'https://m.media-amazon.com/images/I/71F7X2B2jFL._AC_SL1500_.jpg'
  },
  ssd_1tb: { 
    id: 'ssd_1tb', 
    type: ComponentType.STORAGE, 
    name: '1TB WD Blue SN570 NVMe', 
    price: 5500, 
    isLocked: false, 
    specs: '3500MB/s Read',
    image: 'https://m.media-amazon.com/images/I/71F7X2B2jFL._AC_SL1500_.jpg'
  },
  ssd_2tb: { 
    id: 'ssd_2tb', 
    type: ComponentType.STORAGE, 
    name: '2TB Samsung 970 EVO Plus', 
    price: 11000, 
    isLocked: false, 
    specs: 'Top Reliability',
    image: 'https://m.media-amazon.com/images/I/81A+M+2+RzL._AC_SL1500_.jpg'
  },

  // PSUs (Tier A/B mandated)
  psu_550w: { 
    id: 'psu_550w', 
    type: ComponentType.PSU, 
    name: 'Deepcool PK550D 550W', 
    price: 3200, 
    isLocked: true, 
    specs: '80+ Bronze, Flat Cables',
    image: 'https://m.media-amazon.com/images/I/61kM2z+iQVL._AC_SL1000_.jpg'
  },
  psu_650w: { 
    id: 'psu_650w', 
    type: ComponentType.PSU, 
    name: 'Corsair CX650M', 
    price: 5200, 
    isLocked: true, 
    specs: '80+ Bronze, Semi-Modular',
    image: 'https://m.media-amazon.com/images/I/71u9+5q8G+L._AC_SL1500_.jpg'
  },

  // Case
  case_basic: { 
    id: 'case_basic', 
    type: ComponentType.CASE, 
    name: 'Ant Esports ICE-110', 
    price: 2800, 
    isLocked: true, 
    specs: 'High Airflow Mesh',
    image: 'https://m.media-amazon.com/images/I/718X+1+tJdL._AC_SL1500_.jpg'
  },
  case_prem: { 
    id: 'case_prem', 
    type: ComponentType.CASE, 
    name: 'Lian Li Lancool 215', 
    price: 6500, 
    isLocked: true, 
    specs: '2x200mm ARGB Fans',
    image: 'https://m.media-amazon.com/images/I/81e5b10+OEL._AC_SL1500_.jpg'
  },

  // Cooler
  cool_stock: { 
    id: 'cool_stock', 
    type: ComponentType.COOLER, 
    name: 'Intel Stock Laminar RM1', 
    price: 0, 
    isLocked: true, 
    specs: 'Basic Cooling',
    image: 'https://m.media-amazon.com/images/I/51D37+zXwGL._AC_SL1000_.jpg'
  },
  cool_air: { 
    id: 'cool_air', 
    type: ComponentType.COOLER, 
    name: 'Deepcool AK400', 
    price: 2400, 
    isLocked: true, 
    specs: 'High Performance Air',
    image: 'https://m.media-amazon.com/images/I/61t-y7QW8CL._AC_SL1000_.jpg'
  },
};

export const BUILD_TIERS: BuildTier[] = [
  {
    id: 'entry_student',
    name: 'Student Essentials',
    rangeLabel: 'Under ₹40,000',
    minBudget: 0,
    maxBudget: 40000,
    description: 'Perfect for coding, web browsing, online classes, and light media editing.',
    baseBuild: [
      COMPONENTS.cpu_i3,
      COMPONENTS.mobo_h610,
      COMPONENTS.ram_8gb,
      COMPONENTS.ssd_500gb,
      COMPONENTS.gpu_arc380,
      COMPONENTS.psu_550w,
      COMPONENTS.case_basic,
      COMPONENTS.cool_stock
    ],
    upgrades: {
      [ComponentType.RAM]: [COMPONENTS.ram_8gb, COMPONENTS.ram_16gb],
      [ComponentType.STORAGE]: [COMPONENTS.ssd_500gb, COMPONENTS.ssd_1tb]
    }
  },
  {
    id: 'mid_gamer',
    name: 'Balanced Gamer',
    rangeLabel: '₹40k - ₹70k',
    minBudget: 40000,
    maxBudget: 70000,
    description: 'High-FPS 1080p gaming, moderate video editing, and heavy multitasking.',
    baseBuild: [
      COMPONENTS.cpu_i5,
      COMPONENTS.mobo_h610,
      COMPONENTS.ram_16gb,
      COMPONENTS.ssd_1tb,
      COMPONENTS.gpu_rx6600,
      COMPONENTS.psu_550w,
      COMPONENTS.case_basic,
      COMPONENTS.cool_air
    ],
    upgrades: {
      [ComponentType.RAM]: [COMPONENTS.ram_16gb, COMPONENTS.ram_32gb],
      [ComponentType.STORAGE]: [COMPONENTS.ssd_500gb, COMPONENTS.ssd_1tb, COMPONENTS.ssd_2tb]
    }
  },
  {
    id: 'pro_creator',
    name: 'Pro Workstation',
    rangeLabel: '₹70k+',
    minBudget: 70000,
    maxBudget: 200000,
    description: '4K video editing, 3D rendering, and AAA gaming at high settings.',
    baseBuild: [
      COMPONENTS.cpu_i7,
      COMPONENTS.mobo_b660,
      COMPONENTS.ram_32gb,
      COMPONENTS.ssd_1tb,
      COMPONENTS.gpu_rtx3060,
      COMPONENTS.psu_650w,
      COMPONENTS.case_prem,
      COMPONENTS.cool_air
    ],
    upgrades: {
      [ComponentType.RAM]: [COMPONENTS.ram_32gb],
      [ComponentType.STORAGE]: [COMPONENTS.ssd_1tb, COMPONENTS.ssd_2tb]
    }
  }
];

export const ASSEMBLY_FEE = 999;
export const TAX_RATE = 0.18;