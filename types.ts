export enum ComponentType {
  CPU = 'CPU',
  GPU = 'GPU',
  MOTHERBOARD = 'Motherboard',
  RAM = 'RAM',
  STORAGE = 'Storage',
  PSU = 'Power Supply',
  CASE = 'Case',
  COOLER = 'Cooling',
  OS = 'Operating System'
}

export interface PCComponent {
  id: string;
  type: ComponentType;
  name: string;
  price: number;
  image?: string;
  isLocked: boolean; // MVP: Core parts are locked
  specs?: string;
}

export interface BuildTier {
  id: string;
  name: string;
  rangeLabel: string;
  minBudget: number;
  maxBudget: number;
  description: string;
  baseBuild: PCComponent[];
  upgrades: {
    [key in ComponentType]?: PCComponent[];
  };
}

export interface UserConfiguration {
  ram: PCComponent;
  storage: PCComponent;
}

export type AppStep = 'home' | 'budget' | 'config' | 'checkout' | 'success';