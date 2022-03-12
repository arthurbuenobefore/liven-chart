export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: {
    rate: number;
    count: number;
  };
  amount: number;
}

export interface Stock {
  id: number;
  amount: number;
}
