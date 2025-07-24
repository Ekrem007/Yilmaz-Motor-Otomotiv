import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductService } from '../../Services/product.service';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, NavbarComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  searchTerm: string = '';
  
  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  onSearch(event: Event): void {
    event.preventDefault();
    
    if (this.searchTerm.trim()) {
      // URL'de arama parametresiyle customer-product-page'e yönlendir
      this.router.navigate(['/products'], { 
        queryParams: { search: this.searchTerm.trim() } 
      });
    }
  }
}