import { Product } from './../../Models/product';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderServiceService } from '../../Services/order.service';
import { MostSellingProductDto } from '../../Models/mostSellingProductDto';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { TopRatedProductDto } from '../../Models/topRatedProductDto';
import { ProductReviewService } from '../../Services/product-review.service';
import { TicketService } from '../../Services/ticket.service';
import { ProductService } from '../../Services/product.service';
import { TurkishCurrencyPipe } from '../../pipes/turkish-currency.pipe';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PortalModule } from '@angular/cdk/portal';

@Component({
  selector: 'app-admin-dash-board',
  imports: [RouterModule, CommonModule, TurkishCurrencyPipe, NgxChartsModule, PortalModule],
  templateUrl: './admin-dash-board.component.html',
  styleUrls: ['./admin-dash-board.component.css'],
  providers: []
})
export class AdminDashBoardComponent implements OnInit {
  mostSellingProduct: MostSellingProductDto | null = null;
  isLoading = true;
  totalGainedMoney: number = 0;
  totalUsersCount: number = 0;
  totalOrdersCount: number = 0;
  totalPendingOrdersCount: number = 0;
  highestRatedProduct: TopRatedProductDto | null = null;
  answeredTicketsCount: number = 0;
  closedTicketsCount: number = 0;
  openedTicketsCount: number = 0;
  lastMonthEarnings: number = 0;
  averageOrderAmount: number = 0;
  totalProductsCount: number = 0;
  totalProductStocks: number = 0;
  lastWeekEarnings: number = 0;

  // Aylık satış verisi (ngx-charts için)
  monthlySalesData: any[] = [];
  salesChartColorScheme = 'vivid';
  weeklySalesData: any[] = [];
  weeklySalesDataChart: any[] = [];


  // Y ekseni için sayı formatlama fonksiyonu (ngx-charts)
  yAxisTickFormat = (value: any) => value.toLocaleString('tr-TR');


 

  constructor(private orderService: OrderServiceService, private authService : AuthService,
    private productReviewService: ProductReviewService, private ticketService : TicketService,
    private productService: ProductService) {}

  ngOnInit(): void {
    this.refreshDashboard();
    this.getMonthlySalesForLastYear();
    this.loadWeeklySalesData();
  }
  loadWeeklySalesData(): void {
  this.orderService.getWeeklySalesForLastWeek().subscribe({
    next: (response) => {
      if (response.success && Array.isArray(response.data)) {
        // Gün adını almak için opsiyonel fonksiyon
        const getDayName = (dateStr: string) => {
          const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
          const d = new Date(dateStr);
          return days[d.getDay()];
        };
        this.weeklySalesData = [
          {
            name: 'Satışlar',
            series: response.data.map((item: any) => ({
              name: getDayName(item.day),
              value: item.totalSales
            }))
          }
        ];
      } else {
        console.error('Haftalık satış verisi alınamadı:', response.message);
      }
    },
    error: (error) => {
      console.error('Haftalık satış verisi alınırken hata oluştu:', error);
    }
  });
}


  // Aylık satış verisini çek ve ngx-charts formatına dönüştür
  getMonthlySalesForLastYear(): void {
    this.orderService.getMonthlySalesForLastYear().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.monthlySalesData = response.data.map((item: any) => ({
            name: item.month,
            value: item.totalSales
          }));
        } else {
          console.error('Aylık satış verisi alınamadı:', response.message);
        }
      },
      error: (error) => {
        console.error('Aylık satış verisi alınırken hata oluştu:', error);
      }
    });
  }

  refreshDashboard(): void {
    this.isLoading = true;
    this.loadMostSellingProduct();
    this.loadTotalGainedMoney();
    this.getTotalUsersCount();
    this.getTotalOrdersCount();
    this.getPendingOrdersCount();
    this.getTopRatedProduct();
    this.getOpenedTickets();
    this.getClosedTickets();
    this.getAnsweredTickets();
    this.getLastMonthEarnings();
    this.getAverageOrderAmount();
    this.getTotalProductsCount();
    this.getTotalProductStocks();
    this.getLastWeekEarnings();
    
    // Yükleme durumunu 2 saniye sonra kapat
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
  loadTotalGainedMoney(): void {
    this.orderService.getTotalGainedMoney().subscribe({
      next: (response) => {
        if (response.success) {
         if (typeof response.data === 'number') { 
  this.totalGainedMoney = response.data;
} else {
  console.error('Veri sayısal değil veya tanımsız.');
}

        } else {
          console.error('Toplam kazanılan para alınamadı:', response.message);
        }
      },
      error: (error) => {
        console.error('Toplam kazanılan para verisi alınırken hata oluştu:', error);
      }
    });
  }

  loadMostSellingProduct(): void {
    this.orderService.getMostSellingProduct().subscribe({
      next: (response) => {
        if (response.success) {
          this.mostSellingProduct = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('En çok satan ürün verisi alınırken hata oluştu:', error);
        this.isLoading = false;
      }
    });
  }
  getTotalUsersCount(): void {
    this.authService.getTotalUsersCount().subscribe({
      next: (count) => {
        this.totalUsersCount = count;
      },
      error: (error) => {
        console.error('Kullanıcı sayısı alınırken hata oluştu:', error);
      }
    });
  }
  getTotalOrdersCount(): void {
    this.orderService.getAllOrdersCount().subscribe({
      next: (response) => {
        if (response.success) {
          if (typeof response.data === 'number') {
            this.totalOrdersCount = response.data;
          }
        } else {
          console.error('Toplam sipariş sayısı alınamadı:', response.message);
        }
      },
      error: (error) => {
        console.error('Toplam sipariş sayısı verisi alınırken hata oluştu:', error);
      }
    });
  }
  getPendingOrdersCount(): void {
    this.orderService.getPendingOrdersCount().subscribe({
      next: (response) => {
        if (response.success) {
          if (typeof response.data === 'number') {
            this.totalPendingOrdersCount = response.data;
          }
        } else {
          console.error('Bekleyen sipariş sayısı alınamadı:', response.message);
        }
      },
      error: (error) => {
        console.error('Bekleyen sipariş sayısı verisi alınırken hata oluştu:', error);
      }
    });
  }
  getTopRatedProduct(): void {
    this.productReviewService.getTopRatingProducts().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.highestRatedProduct = response.data;
        } else {
          console.error('En yüksek puanlı ürün alınamadı:', response.message);
        }
      },
      error: (error) => {
        console.error('En yüksek puanlı ürün verisi alınırken hata oluştu:', error);
      }
    });
  }
  getOpenedTickets(): void {
  this.ticketService.getOpenedTickets().subscribe({
    next: (response) => {
      if (response.success) {
        if (typeof response.data === 'number') {
          this.openedTicketsCount = response.data; 
        }
      } else {
        console.error('Açık biletler alınamadı:', response.message);
      }
    },
    error: (error) => {
      console.error('Açık biletler verisi alınırken hata oluştu:', error);
    }
  });
}
  getClosedTickets(): void {
    this.ticketService.getClosedTickets().subscribe({
      next: (response) => {
        if (response.success) {
          if (typeof response.data === 'number') {
            this.closedTicketsCount = response.data; 
          }
        } else {
          console.error('Kapalı biletler alınamadı:', response.message);
        }
      },
      error: (error) => {
        console.error('Kapalı biletler verisi alınırken hata oluştu:', error);
      }
    });
  }
  getAnsweredTickets(): void {
    this.ticketService.getAnsweredTickets().subscribe({
      next: (response) => {
        if (response.success) {
          if (typeof response.data === 'number') {
            this.answeredTicketsCount = response.data; 
          }
        } else {
          console.error('Cevaplanmış biletler alınamadı:', response.message);
        }
      },
      error: (error) => {
        console.error('Cevaplanmış biletler verisi alınırken hata oluştu:', error);
      }
    });
  }
  getLastMonthEarnings(): void {
    this.orderService.getLastMonthEarnings().subscribe({
      next: (response) => {
        if (response.success) {
          if (typeof response.data === 'number') {
            this.lastMonthEarnings = response.data; 
          }
        } else {
          console.error('Son ay kazançları alınamadı:', response.message);
        }
      },
      error: (error) => {
        console.error('Son ay kazançları verisi alınırken hata oluştu:', error);
      }
    });
  }
  getAverageOrderAmount(): void {
    this.orderService.getAverageOrderAmount().subscribe({
      next: (response) => {
        if (response.success) {
          if (typeof response.data === 'number') {
            this.averageOrderAmount = response.data; 
          }
        } else {
          console.error('Ortalama sipariş tutarı alınamadı:', response.message);
        }
      },
      error: (error) => {
        console.error('Ortalama sipariş tutarı verisi alınırken hata oluştu:', error);
      }
    });
  }
  getTotalProductsCount(): void {
    this.productService.getTotalProductsCount().subscribe({
      next: (response) => {
        if (response.success) {
          if (typeof response.data === 'number') {
            this.totalProductsCount = response.data; 
          }
        } else {
          console.error('Toplam ürün sayısı alınamadı:', response.message);
        }
      },
      error: (error) => {
        console.error('Toplam ürün sayısı verisi alınırken hata oluştu:', error);
      }
    });
  }
  getTotalProductStocks(): void {
    this.productService.getTotalProductStocks().subscribe({
      next: (response) => {
        if (response.success) {
          if (typeof response.data === 'number') {
            this.totalProductStocks = response.data; 
          }
        } else {
          console.error('Toplam ürün stokları alınamadı:', response.message);
        }
      },
      error: (error) => {
        console.error('Toplam ürün stokları verisi alınırken hata oluştu:', error);
      }
    });
  }
  getLastWeekEarnings(): void {
    this.orderService.getLastWeekEarnings().subscribe({
      next: (response) => {
        if (response.success) {
          if (typeof response.data === 'number') {
            this.lastWeekEarnings = response.data; 
          }
        } else {
          console.error('Son hafta kazançları alınamadı:', response.message);
        }
      },
      error: (error) => {
        console.error('Son hafta kazançları verisi alınırken hata oluştu:', error);
      }
    });
  }
}
