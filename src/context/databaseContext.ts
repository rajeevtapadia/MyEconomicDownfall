import {createContext} from 'react';

const databaseContext = createContext<DatabaseContext | null>(null);

export {databaseContext};
