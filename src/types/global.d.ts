interface Reading {
  id: number;
  meterReading: number;
  date: string;
}

interface Quantity {
  id: number;
  quantity: number;
  date: string;
}

interface User {
  id?: string;
  name?: string;
  initReading?: number;
  price?: number;
}
