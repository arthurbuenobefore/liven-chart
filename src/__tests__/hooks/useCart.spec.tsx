import { renderHook, act } from '@testing-library/react-hooks';
import AxiosMock from 'axios-mock-adapter';
import React  from 'react';
import { toast } from 'react-toastify';
import { api } from '../../services/api';
import { useCart, CartProvider } from '../../hooks/useCart';

const apiMock = new AxiosMock(api);

jest.mock('react-toastify');

const mockedToastError = toast.error as jest.Mock;
const mockedSetItemLocalStorage = jest.spyOn(Storage.prototype, 'setItem');
const initialStoragedData = [
  {
    id: 1,
    amount: 2,
    title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    price: 109.95,
    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    rating: {
      rate: 3.9,
      count: 120,
    },
  },
  {
    id: 2,
    amount: 1,
    title: 'Mens Casual Premium Slim Fit T-Shirts ',
    price: 22.3,
    description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
    category: "men's clothing",
    image:
        'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    rating: {
      rate: 4.1,
      count: 259,
    },
  },
];

describe('useCart Hook', () => {
  beforeEach(() => {
    apiMock.reset();

    jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValueOnce(JSON.stringify(initialStoragedData));
  });

  it('should be able to initialize cart with localStorage value', () => {
    const { result } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    expect(result.current.cart).toEqual(
      expect.arrayContaining([
        {
          id: 1,
          amount: 2,
          title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
          price: 109.95,
          description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
          category: "men's clothing",
          image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
          rating: {
            rate: 3.9,
            count: 120,
          },
        },
        {
          id: 2,
          amount: 1,
          title: 'Mens Casual Premium Slim Fit T-Shirts ',
          price: 22.3,
          description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
          category: "men's clothing",
          image:
              'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
          rating: {
            rate: 4.1,
            count: 259,
          },
        },
      ])
    );
  });

  it('should be able to add a new product', async () => {
    const productId = 3;

    apiMock.onGet(`products/${productId}`).reply(200, {
      id: 3,
      title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
      category: "men's clothing",
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      rating: {
        rate: 3.9,
        count: 120,
      },
    });

    const { result, waitForNextUpdate } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addProduct(productId);
    });

    await waitForNextUpdate({ timeout: 200 });

    expect(result.current.cart).toEqual(
      expect.arrayContaining([
        {
          id: 1,
          amount: 2,
          title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
          price: 109.95,
          description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
          category: "men's clothing",
          image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
          rating: {
            rate: 3.9,
            count: 120,
          },
        },
        {
          id: 2,
          amount: 1,
          title: 'Mens Casual Premium Slim Fit T-Shirts ',
          price: 22.3,
          description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
          category: "men's clothing",
          image:
              'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
          rating: {
            rate: 4.1,
            count: 259,
          },
        },
        {
          id: 3,
          title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
          price: 109.95,
          description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
          category: "men's clothing",
          image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
          rating: {
            rate: 3.9,
            count: 120,
          },
        },
      ])
    );
    expect(mockedSetItemLocalStorage).toHaveBeenCalledWith(
      '@LivenChart:cart',
      JSON.stringify(result.current.cart)
    );
  });

  it('should be able to increase a product amount when adding a product that already exists on cart', async () => {
    const productId = 1;

    apiMock.onGet(`stock/${productId}`).reply(200, {
      id: 1,
      amount: 3,
    });
    apiMock.onGet(`products/${productId}`).reply(200, {
      id: 1,
      image:
        'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
      price: 179.9,
      title: 'Tênis de Caminhada Leve Confortável',
    });

    const { result, waitForNextUpdate } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addProduct(productId);
    });

    await waitForNextUpdate({ timeout: 200 });

    expect(result.current.cart).toEqual(
      expect.arrayContaining([
        {
          id: 1,
          amount: 3,
          image:
            'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
          price: 179.9,
          title: 'Tênis de Caminhada Leve Confortável',
        },
        {
          id: 2,
          amount: 1,
          image:
            'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg',
          price: 139.9,
          title: 'Tênis VR Caminhada Confortável Detalhes Couro Masculino',
        },
      ])
    );
    expect(mockedSetItemLocalStorage).toHaveBeenCalledWith(
      '@LivenChart:cart',
      JSON.stringify(result.current.cart)
    );
  });

  it('should not be able to increase a product amount when running out of stock', async () => {
    const productId = 2;

    apiMock.onGet(`stock/${productId}`).reply(200, {
      id: 1,
      amount: 1,
    });

    const { result, waitFor } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addProduct(productId);
    });

    await waitFor(
      () => {
        expect(mockedToastError).toHaveBeenCalledWith(
          'Quantidade solicitada fora de estoque'
        );
        expect(result.current.cart).toEqual(
          expect.arrayContaining(initialStoragedData)
        );
        expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
      },
      {
        timeout: 200,
      }
    );
  });

  it('should be able to remove a product', () => {
    const productId = 2;

    const { result } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.removeProduct(productId);
    });

    expect(result.current.cart).toEqual(
      expect.arrayContaining([
        {
          amount: 2,
          id: 1,
          image:
            'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
          price: 179.9,
          title: 'Tênis de Caminhada Leve Confortável',
        },
      ])
    );
    expect(mockedSetItemLocalStorage).toHaveBeenCalledWith(
      '@LivenChart:cart',
      JSON.stringify(result.current.cart)
    );
  });

  it('should not be able to remove a product that does not exist', () => {
    const productId = 3;

    const { result } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.removeProduct(productId);
    });

    expect(mockedToastError).toHaveBeenCalledWith('Erro na remoção do produto');
    expect(result.current.cart).toEqual(
      expect.arrayContaining(initialStoragedData)
    );
    expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
  });

  it('should be able to update a product amount', async () => {
    const productId = 2;

    apiMock.onGet(`stock/${productId}`).reply(200, {
      id: 2,
      amount: 5,
    });

    const { result, waitForNextUpdate } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.updateProductAmount({ amount: 2, productId });
    });

    await waitForNextUpdate({ timeout: 200 });

    expect(result.current.cart).toEqual(
      expect.arrayContaining([
        {
          id: 1,
          amount: 2,
          image:
            'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
          price: 179.9,
          title: 'Tênis de Caminhada Leve Confortável',
        },
        {
          id: 2,
          amount: 2,
          image:
            'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg',
          price: 139.9,
          title: 'Tênis VR Caminhada Confortável Detalhes Couro Masculino',
        },
      ])
    );
    expect(mockedSetItemLocalStorage).toHaveBeenCalledWith(
      '@LivenChart:cart',
      JSON.stringify(result.current.cart)
    );
  });

  it('should not be able to update a product that does not exist', async () => {
    const productId = 4;

    apiMock.onGet(`stock/${productId}`).reply(404);

    const { result, waitFor } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.updateProductAmount({ amount: 3, productId });
    });

    await waitFor(
      () => {
        expect(mockedToastError).toHaveBeenCalledWith(
          'Erro na alteração de quantidade do produto'
        );
        expect(result.current.cart).toEqual(
          expect.arrayContaining(initialStoragedData)
        );
        expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
      },
      { timeout: 200 }
    );
  });

  it('should not be able to update a product amount when running out of stock', async () => {
    const productId = 2;

    apiMock.onGet(`stock/${productId}`).reply(200, {
      id: 2,
      amount: 1,
    });

    const { result, waitFor } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.updateProductAmount({ amount: 2, productId });
    });

    await waitFor(
      () => {
        expect(mockedToastError).toHaveBeenCalledWith(
          'Quantidade solicitada fora de estoque'
        );
        expect(result.current.cart).toEqual(
          expect.arrayContaining(initialStoragedData)
        );
        expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
      },
      { timeout: 200 }
    );
  });

  it('should not be able to update a product amount to a value smaller than 1', async () => {
    const productId = 2;

    apiMock.onGet(`stock/${productId}`).reply(200, {
      id: 2,
      amount: 1,
    });

    const { result, waitForValueToChange } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.updateProductAmount({ amount: 0, productId });
    });

    try {
      await waitForValueToChange(
        () => {
          return result.current.cart;
        },
        { timeout: 50 }
      );
      expect(result.current.cart).toEqual(
        expect.arrayContaining(initialStoragedData)
      );
      expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
    } catch {
      expect(result.current.cart).toEqual(
        expect.arrayContaining(initialStoragedData)
      );
      expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
    }
  });
});
