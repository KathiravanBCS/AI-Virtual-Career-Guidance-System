// Mock Data Utility Functions

export function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let idCounter = 1000;

export function generateId(): number {
  return idCounter++;
}

export function resetIdCounter(startFrom: number = 1000): void {
  idCounter = startFrom;
}

// Name generators
const firstNames = [
  'Rajesh',
  'Priya',
  'Amit',
  'Sneha',
  'Arjun',
  'Divya',
  'Vikas',
  'Ananya',
  'Rohan',
  'Pooja',
  'Sanjay',
  'Kavya',
  'Nikhil',
  'Isha',
  'Adnan',
  'Zara',
  'Aditya',
  'Shruti',
  'Vikram',
  'Anushka',
  'Ashish',
  'Neha',
  'Varun',
  'Nisha',
];

const lastNames = [
  'Sharma',
  'Singh',
  'Kumar',
  'Patel',
  'Desai',
  'Verma',
  'Iyer',
  'Menon',
  'Rao',
  'Kulkarni',
  'Pandey',
  'Gupta',
  'Reddy',
  'Nair',
  'Khan',
  'Ahmed',
];

const companyNames = [
  'TechVision Solutions',
  'DataFlow Systems',
  'Cloud Nine Technologies',
  'Quantum Innovations',
  'Digital Forge',
  'Nexus Global',
  'Apex Tech',
  'Catalyst Industries',
  'Zenith Services',
  'Pioneer Analytics',
];

const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com'];

export function selectRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function selectMultipleRandom<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, items.length));
}

export function generatePersonName(): string {
  return `${selectRandom(firstNames)} ${selectRandom(lastNames)}`;
}

export function generateCompanyName(): string {
  return selectRandom(companyNames);
}

export function generateEmail(name?: string, domain?: string): string {
  const nameToUse = name || generatePersonName().toLowerCase().replace(/\s+/g, '.');
  const domainToUse = domain || selectRandom(domains);
  return `${nameToUse}@${domainToUse}`;
}

export function generatePhoneNumber(): string {
  const prefix = '+91';
  const number = Math.floor(Math.random() * 9000000000) + 1000000000;
  return `${prefix}${number}`;
}

// Financial utilities
export function generateAmount(min: number = 10000, max: number = 1000000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generatePercentage(min: number = 0, max: number = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Indian compliance data generators
export function generatePAN(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const pans = [];

  // First 5 letters
  for (let i = 0; i < 5; i++) {
    pans.push(letters.charAt(Math.floor(Math.random() * letters.length)));
  }

  // Year (2 digits)
  pans.push(
    Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, '0')
  );

  // Random character
  pans.push(letters.charAt(Math.floor(Math.random() * letters.length)));

  // Serial (4 digits)
  pans.push(
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')
  );

  return pans.join('');
}

export function generateGSTIN(): string {
  // GSTIN: 2-digit state, 10-digit PAN, entity type, register, checksum
  const stateCode = Math.floor(Math.random() * 37)
    .toString()
    .padStart(2, '0');
  const panPart = generatePAN();
  const entityType = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0');
  const register = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  const checksum = Math.floor(Math.random() * 10).toString();

  return `${stateCode}${panPart}${entityType}${register}${checksum}`;
}

export function generateTAN(): string {
  // TAN: 4 letters + 5 digits + 4 letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let tan = '';

  for (let i = 0; i < 4; i++) {
    tan += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  for (let i = 0; i < 5; i++) {
    tan += Math.floor(Math.random() * 10).toString();
  }

  for (let i = 0; i < 4; i++) {
    tan += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  return tan;
}

export function generateIFSC(): string {
  // IFSC: 4 letters + 0 + 6-digit code
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let ifsc = '';

  for (let i = 0; i < 4; i++) {
    ifsc += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  ifsc += '0';

  for (let i = 0; i < 6; i++) {
    ifsc += Math.floor(Math.random() * 10).toString();
  }

  return ifsc;
}

export function generateBankAccount(): string {
  const length = 16;
  let account = '';
  for (let i = 0; i < length; i++) {
    account += Math.floor(Math.random() * 10).toString();
  }
  return account;
}

// Date utilities
export function generateDateBetween(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function generatePastDate(daysAgo: number = 30): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
}

export function generateFutureDate(daysAhead: number = 30): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date;
}

// Address generators
export function generateAddress(): string {
  const streetNumbers = [101, 202, 303, 404, 505, 606, 707, 808, 909];
  const streets = ['Main Street', 'Business Avenue', 'Tech Park', 'Innovation Drive', 'Commerce Lane'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];
  const states = ['MH', 'DL', 'KA', 'TG', 'TN', 'MH', 'WB', 'GJ'];

  const street = `${selectRandom(streetNumbers)} ${selectRandom(streets)}`;
  const city = selectRandom(cities);
  const state = selectRandom(states);
  const postalCode = Math.floor(Math.random() * 900000) + 100000;

  return `${street}, ${city}, ${state} ${postalCode}`;
}
