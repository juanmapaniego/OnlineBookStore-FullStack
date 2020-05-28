import { Component, OnInit } from "@angular/core";
import { Book } from "../../common/book";
import { BookService } from "src/app/services/book.service";
import { ActivatedRoute } from "@angular/router";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { CartItem } from "src/app/common/cart-item";
import { CartService } from "src/app/services/cart.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-book-list",
  //templateUrl: './book-list.component.html',
  templateUrl: "./book-grid.component.html",
  styleUrls: ["./book-list.component.css"],
})
export class BookListComponent implements OnInit {
  books: Book[];
  currentCategoryId: number;
  searchMode: boolean;

  //new properties for server side paging
  currentPage: number = 1;
  pageSize: number = 5;
  totalRecords: number = 0;
  previousCategoryId: number = 1;

  constructor(
    private _bookservice: BookService,
    private _activatedRoute: ActivatedRoute,
    private _config: NgbPaginationConfig,
    private _cartService: CartService,
    private _spinnerService: NgxSpinnerService
  ) {
    _config.maxSize = 3;
    _config.boundaryLinks = true;
  }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe(() => this.listBooks());
  }

  listBooks() {
    this._spinnerService.show();
    this.searchMode = this._activatedRoute.snapshot.paramMap.has("keyword");

    if (this.searchMode) {
      this.handleSearchBooks();
    } else {
      this.handleListBooks();
    }
  }

  handleSearchBooks() {
    const keyword: string = this._activatedRoute.snapshot.paramMap.get(
      "keyword"
    );
    this._bookservice
      .searchBooks(keyword, this.currentPage - 1, this.pageSize)
      .subscribe(this.processPaginate());
  }

  handleListBooks() {
    const hasCategory: boolean = this._activatedRoute.snapshot.paramMap.has(
      "id"
    );

    if (hasCategory) {
      this.currentCategoryId = +this._activatedRoute.snapshot.paramMap.get(
        "id"
      );
    } else {
      this.currentCategoryId = 1;
    }

    //setting the page number to one
    if (this.currentCategoryId != this.previousCategoryId) {
      this.currentPage = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    this._bookservice
      .getBooks(this.currentCategoryId, this.currentPage - 1, this.pageSize)
      .subscribe(this.processPaginate());
  }

  processPaginate() {
    return (data) => {
      this._spinnerService.hide();
      this.books = data._embedded.books;
      this.currentPage = data.page.number + 1;
      this.totalRecords = data.page.totalElements;
      this.pageSize = data.page.size;
    };
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.listBooks();
  }

  addToCart(book: Book) {
    console.log(book);
    const cartItem = new CartItem(book);
    this._cartService.addToCart(cartItem);
  }
}
