import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  calculateTotalPrice(){
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for(let currentCarItem of this.cartItems){
      totalPriceValue += currentCarItem.quantity * currentCarItem.unitPrice;
      totalQuantityValue += currentCarItem.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }

  addToCart(cartItem: CartItem){
    let alreadyExistInCart : boolean = false;
    let existingCartItem : CartItem = undefined;
    
    if(this.cartItems.length > 0){
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id == cartItem.id);
      alreadyExistInCart = (existingCartItem != undefined);
    }

    if(alreadyExistInCart){
      existingCartItem.quantity++;
    }else{
      this.cartItems.push(cartItem);
    }

    this.calculateTotalPrice();
  }

  remove(cartItem: CartItem){
    const itemIndex = this.cartItems.findIndex(
                          tempCartItem => 
                                tempCartItem.id == cartItem.id
                      );
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex,1);
      this.calculateTotalPrice();
    }
  }

  decrementQuantity(cartItem: CartItem){
    cartItem.quantity--;
    if(cartItem.quantity == 0){
      this.remove(cartItem);
    }else{
      this.calculateTotalPrice();
    }
  }

  incrementQuantity(cartItem: CartItem){
    cartItem.quantity++;
    this.calculateTotalPrice();
  }
}
