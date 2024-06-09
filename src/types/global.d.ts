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

interface DatabaseContext {
  db: WebsqlDatabase | null;
  readings: Reading[];
  quantity: Quantity[];
  userTable: User[];
  setDb: React.Dispatch<React.SetStateAction<WebsqlDatabase | null>>;
  setReadings: React.Dispatch<React.SetStateAction<Reading[]>>;
  setQuantity: React.Dispatch<React.SetStateAction<Quantity[]>>;
  setUserTable: React.Dispatch<React.SetStateAction<User[]>>;
}
