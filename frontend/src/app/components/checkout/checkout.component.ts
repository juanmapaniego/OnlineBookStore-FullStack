import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  cartItems : CartItem[] = [];
  totalPrice : number = 0;


  constructor(private formBuilder: FormBuilder,
              private _cartService: CartService) { }

  ngOnInit() {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [""],
        lastName: [""],
        email: [""]
      })
    })
    this.cartDetails();
  }

  cartDetails(){
    this.cartItems = this._cartService.cartItems;

    this._cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this._cartService.calculateTotalPrice();
  }

  onSubmit(){
    console.log("Purchase the books");
    console.log(this.checkoutFormGroup.get("customer").value);
    console.log("Email is ", this.checkoutFormGroup.get("customer").value.email);
  }

}
