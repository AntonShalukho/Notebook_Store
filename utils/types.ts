import { ItemTypes } from './enums'

export type MyStorageState = {
  cookies: {
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'Strict' | 'Lax' | 'None';
  }[];
  origins: {
    origin: string;
    localStorage: { name: string; value: string }[];
  }[];
  csrfToken: string;
};

export type ItemDataType = {
  title: string;
  price: number;
}

export type ItemStuffDataType = {
  list: Array<ItemDataType>;
  itemType?: keyof typeof ItemTypes
}