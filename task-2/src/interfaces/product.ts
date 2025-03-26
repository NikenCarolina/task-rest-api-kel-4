interface IProduct {
  id?: number;
  name: string;
  price: number;
  description: string;
  image: File | string | null;
  created_at?: Date;
  updated_at?: Date;
}

interface IProductWithslide extends IProduct {
  prev: string;
  next: string;
}

export type { IProduct, IProductWithslide };
