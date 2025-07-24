import { CategoryService } from './../../Services/category.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Category } from '../../Models/category';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from '../../Models/responseModel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-admin-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './category-admin-page.component.html',
  styleUrl: './category-admin-page.component.css'
})
export class CategoryAdminPageComponent implements OnInit {
  categories: Category[] = [];
  isEditing: boolean = false;
  isAdding: boolean = false;
  selectedCategory: Category | null = null;
  newCategory: Category = {
    id: 0,
    name: '',
    description: ''
  };


  constructor(private categoryService: CategoryService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
  addCategory() {
    this.categoryService.addCategory(this.newCategory).subscribe({
      next: (response:ResponseModel) => {
        if (response.success) {
          this.getCategories(); 
          this.toastr.success('Category added successfully');
          this.resetForm();
        }
        this.toastr.success('Category added successfully');
        this.resetForm();
      },
      error: (error) => {
        console.error('Error adding category:', error);
        this.toastr.error('Failed to add category');
      }
    });
  }

  resetForm() {
    this.isEditing = false;
    this.isAdding = false;
    this.selectedCategory = null;
    this.newCategory = {
      id: 0,
      name: '',
      description: ''
    };
  }
  startAddCategory() {
    this.newCategory = {
      id: 0,
      name: '',
      description: ''
    };
    this.isAdding = true;
    this.isEditing = false;
  }
  cancelAdd() {
    this.isAdding = false;
    this.resetForm();
  }
  deleteCategory(categoryId: number) {
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: (response: ResponseModel) => {
        if (response.success) {
          this.getCategories();
          this.toastr.success('Category deleted successfully');
        } else {
          this.toastr.error('Failed to delete category');
        }
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.toastr.error('Failed to delete category');
      }
    });
  }
  editCategory(category: Category) {
    this.selectedCategory = { ...category };
    this.isEditing = true;
    this.isAdding = false;
  }
  updateCategory() {
    if (this.selectedCategory) {
      this.categoryService.updateCategory(this.selectedCategory, this.selectedCategory.id).subscribe({
        next: (response: ResponseModel) => {
          if (response.success) {
            this.getCategories();
            this.toastr.success('Category updated successfully');
            this.resetForm();
          } else {
            this.toastr.error('Failed to update category');
          }
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.toastr.error('Failed to update category');
        }
      });
    }
  }
  cancelEdit() {
    this.isEditing = false;
    this.selectedCategory = null;
    this.resetForm();
  }
  startEditCategory(category: Category) {
    this.selectedCategory = { ...category };
    this.isEditing = true;
    this.isAdding = false;
  }
  
}
