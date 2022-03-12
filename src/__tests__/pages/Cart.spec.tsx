import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { useCart } from '../../hooks/useCart';
import Cart from '../../pages/Cart';

const mockedRemoveProduct = jest.fn();
const mockedUpdateProductAmount = jest.fn();
const mockedUseCartHook = useCart as jest.Mock;

jest.mock('../../hooks/useCart');

describe('Cart Page', () => {
  beforeEach(() => {
    mockedUseCartHook.mockReturnValue({
      cart: [
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
          amount: 2,
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
      ],
      removeProduct: mockedRemoveProduct,
      updateProductAmount: mockedUpdateProductAmount,
    });
  });

  it('should be able to increase/decrease a product amount', () => {
    const { getAllByTestId, rerender } = render(<Cart />);

    const [incrementFirstProduct] = getAllByTestId('increment-product');
    const [, decrementSecondProduct] = getAllByTestId('decrement-product');
    const [firstProductAmount, secondProductAmount] = getAllByTestId(
      'product-amount'
    );

    fireEvent.click(incrementFirstProduct);
    fireEvent.click(decrementSecondProduct);

    expect(mockedUpdateProductAmount).toHaveBeenCalledWith({
      amount: 2,
      productId: 1,
    });
    expect(mockedUpdateProductAmount).toHaveBeenCalledWith({
      amount: 1,
      productId: 2,
    });

    mockedUseCartHook.mockReturnValueOnce({
      cart: [
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
      ],
    });

    rerender(<Cart />);

    console.log(firstProductAmount)

    expect(firstProductAmount.innerHTML).toBe('1');
    expect(secondProductAmount.innerHTML).toBe('2');
  });

  it('should not be able to decrease a product amount when value is 1', () => {
    const { getAllByTestId } = render(<Cart />);

    const [decrementFirstProduct] = getAllByTestId('decrement-product');
    const [firstProductAmount] = getAllByTestId('product-amount');

    expect(firstProductAmount).toHaveDisplayValue('1');

    fireEvent.click(decrementFirstProduct);

    expect(decrementFirstProduct).toHaveProperty('disabled');
    expect(mockedUpdateProductAmount).not.toHaveBeenCalled();
  });
});
