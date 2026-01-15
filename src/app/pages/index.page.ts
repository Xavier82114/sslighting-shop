import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProductItem {
    readonly id: string;
    readonly name: string;
    readonly price: number;
    readonly tagline: string;
    readonly category: string;
    readonly highlight: string;
    readonly isNew: boolean;
    readonly features: readonly string[];
}

interface CartEntry {
    product: ProductItem;
    quantity: number;
}

interface MemberProfile {
    firstName: string;
    email: string;
    membershipLevel: 'basic' | 'pro' | 'vip';
    favouriteStyle: string;
    wantsStudioVisit: boolean;
}

@Component({
    standalone: true,
    selector: 'app-home',
    imports: [CommonModule, FormsModule],
    template: `
        <main class="page-shell">
            <header class="hero">
                <div class="hero-copy">
                    <p class="eyebrow">欣欣燈飾｜ONE PAGE SHOWROOM</p>
                    <h1>用光影講述家的故事</h1>
                    <p class="intro">
                        從桌燈、吊燈到戶外照明，一站式展現每組燭光下的細膩工藝與色溫，
                        再透過會員與購物車系統，保持與客戶的步調一致。
                    </p>
                    <div class="hero-ctas">
                        <button type="button" class="primary" (click)="ScrollToSection('products')">探索新品</button>
                        <button type="button" class="ghost" (click)="ScrollToSection('cart')">檢視購物車</button>
                    </div>
                    <div class="stats">
                        <span>10+ 年專業設計</span>
                        <span>100% 手工測試</span>
                        <span>全天候即時客服</span>
                    </div>
                </div>
                <div class="hero-panel">
                    <p class="panel-label">本季焦點</p>
                    <p class="panel-title">星辰系列</p>
                    <p class="panel-description">
                        以極光為靈感的鍍銀銅與柔霧玻璃，讓吊燈在客廳或庭院都成為對話中心。
                    </p>
                    <button type="button" class="primary" (click)="SetProductCategory('outdoor')">
                        查看戶外款式
                    </button>
                </div>
            </header>

            <section id="products" class="section panel cards">
                <div class="section-heading">
                    <div>
                        <p class="eyebrow">商品展示</p>
                        <h2>燈具細節與風格</h2>
                    </div>
                    <div class="category-pills">
                        <button type="button" [class.active]="selectedCategory === 'all'" (click)="SetProductCategory('all')">全部</button>
                        <button type="button" [class.active]="selectedCategory === 'table'" (click)="SetProductCategory('table')">桌燈</button>
                        <button type="button" [class.active]="selectedCategory === 'pendant'" (click)="SetProductCategory('pendant')">吊燈</button>
                        <button type="button" [class.active]="selectedCategory === 'outdoor'" (click)="SetProductCategory('outdoor')">戶外</button>
                    </div>
                </div>
                <div class="product-grid">
                    <article class="product-card" *ngFor="let product of visibleProducts">
                        <header class="product-card-header">
                            <p class="eyebrow">{{ product.category | titlecase }}</p>
                            <span class="badge" *ngIf="product.isNew">新品</span>
                        </header>
                        <h3>{{ product.name }}</h3>
                        <p class="tagline">{{ product.tagline }}</p>
                        <p class="price">{{ product.price | currency : 'TWD':'symbol':'1.0-0' }}</p>
                        <ul>
                            <li *ngFor="let feature of product.features">{{ feature }}</li>
                        </ul>
                        <button type="button" class="secondary" (click)="AddToCart(product)">
                            加入購物車
                        </button>
                    </article>
                </div>
            </section>

            <section class="section panel member">
                <div class="section-heading">
                    <div>
                        <p class="eyebrow">會員系統</p>
                        <h2>與你同步的會員旅程</h2>
                    </div>
                </div>
                <form class="member-form" (ngSubmit)="HandleMemberSubmit()">
                    <label>
                        姓名
                        <input name="firstName" [(ngModel)]="memberProfile.firstName" type="text" placeholder="例如：林欣怡" required />
                    </label>
                    <label>
                        Email
                        <input name="email" [(ngModel)]="memberProfile.email" type="email" placeholder="member@example.com" required />
                    </label>
                    <label>
                        喜愛風格
                        <input name="favouriteStyle" [(ngModel)]="memberProfile.favouriteStyle" type="text" placeholder="暖色/極簡/復古" />
                    </label>
                    <label>
                        會員等級
                        <select name="membershipLevel" [(ngModel)]="memberProfile.membershipLevel">
                            <option value="basic">光織會員</option>
                            <option value="pro">流光會員</option>
                            <option value="vip">璀璨會員</option>
                        </select>
                    </label>
                    <label class="checkbox-field">
                        <input name="wantsStudioVisit" type="checkbox" [(ngModel)]="memberProfile.wantsStudioVisit" />
                        預約體驗工作室
                    </label>
                    <button type="submit" class="primary">更新會員資料</button>
                </form>
                <div class="member-summary" *ngIf="memberMessage">
                    <p>{{ memberMessage }}</p>
                </div>
            </section>

            <section id="cart" class="section panel cart">
                <div class="section-heading">
                    <div>
                        <p class="eyebrow">購物車</p>
                        <h2>準備結帳的光束</h2>
                    </div>
                </div>
                <div *ngIf="cartItems.length === 0" class="empty-cart">
                    購物車目前沒有品項，快去挑選最喜歡的燈吧！
                </div>
                <div *ngIf="cartItems.length > 0" class="cart-grid">
                    <article *ngFor="let entry of cartItems" class="cart-entry">
                        <div>
                            <p class="eyebrow">{{ entry.product.category | titlecase }}</p>
                            <h3>{{ entry.product.name }}</h3>
                            <p class="tagline">{{ entry.product.tagline }}</p>
                        </div>
                        <div class="cart-entry-meta">
                            <p>數量：{{ entry.quantity }}</p>
                            <p>小計：{{ (entry.product.price * entry.quantity) | currency : 'TWD':'symbol':'1.0-0' }}</p>
                            <button type="button" class="ghost" (click)="RemoveFromCart(entry)">移除</button>
                        </div>
                    </article>
                </div>
                <div *ngIf="cartItems.length > 0" class="cart-footer">
                    <p>共 {{ cartQuantity }} 件</p>
                    <p class="highlight">總計 {{ cartTotal | currency : 'TWD':'symbol':'1.0-0' }}</p>
                </div>
            </section>
        </main>
    `,
    styles: `
        :host {
            display: block;
            background-color: #0e0d12;
            color: #f5f3ee;
            font-family: 'Noto Sans TC', 'Inter', system-ui, sans-serif;
        }

        .page-shell {
            padding: 2.5rem 1.25rem 4rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .hero {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
            padding: 2.5rem;
            border-radius: 28px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(9, 7, 14, 0.9));
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45);
        }

        .hero-copy h1 {
            font-size: clamp(2.5rem, 4vw, 3.3rem);
            margin-bottom: 1rem;
        }

        .eyebrow {
            text-transform: uppercase;
            letter-spacing: 0.24em;
            font-size: 0.75rem;
            color: #ffc976;
            margin: 0 0 0.5rem;
        }

        .intro {
            max-width: 36rem;
            color: rgba(245, 243, 238, 0.8);
        }

        .hero-ctas {
            display: flex;
            gap: 0.75rem;
            margin-top: 1.25rem;
        }

        button {
            border: none;
            padding: 0.85rem 1.25rem;
            border-radius: 999px;
            font-size: 0.95rem;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        button.primary {
            background: #ff8c42;
            color: #1f1000;
            font-weight: 600;
            box-shadow: 0 8px 24px rgba(255, 140, 66, 0.35);
        }

        button.ghost {
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.6);
            color: #f5f3ee;
        }

        button.secondary {
            width: 100%;
            margin-top: 1.5rem;
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.25);
        }

        button:hover {
            transform: translateY(-1px);
        }

        .hero-panel {
            padding: 2rem;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .panel-label {
            font-size: 0.85rem;
            color: rgba(245, 243, 238, 0.6);
            margin-bottom: 0.35rem;
        }

        .panel-title {
            font-size: 1.55rem;
            margin: 0;
        }

        .panel-description {
            color: rgba(245, 243, 238, 0.68);
            margin-top: 0.75rem;
            line-height: 1.6;
        }

        .stats {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            margin-top: 1.5rem;
            font-size: 0.9rem;
        }

        .section {
            margin-bottom: 2.5rem;
        }

        .panel {
            padding: 2rem;
            border-radius: 24px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.09);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
        }

        .section-heading {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            gap: 1rem;
        }

        .category-pills button {
            background: transparent;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 0.35rem 0.75rem;
            color: rgba(245, 243, 238, 0.8);
            margin-left: 0.4rem;
        }

        .category-pills button.active {
            border-color: #ff8c42;
            color: #ff8c42;
        }

        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.25rem;
        }

        .product-card {
            padding: 1.5rem;
            border-radius: 20px;
            background: radial-gradient(circle at top, rgba(255, 140, 66, 0.12), transparent 65%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            min-height: 320px;
        }

        .product-card h3 {
            margin: 0;
            font-size: 1.35rem;
            letter-spacing: 0.01em;
        }

        .tagline {
            margin: 0;
            color: rgba(245, 243, 238, 0.65);
        }

        .price {
            font-size: 1.25rem;
            font-weight: 600;
        }

        ul {
            padding-left: 1.25rem;
            margin: 0;
            color: rgba(245, 243, 238, 0.7);
            flex: 1;
        }

        .badge {
            background: #ff8c42;
            color: #1f1000;
            border-radius: 999px;
            padding: 0.15rem 0.65rem;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .member-form {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1rem;
        }

        label {
            display: flex;
            flex-direction: column;
            font-size: 0.95rem;
            gap: 0.35rem;
        }

        input,
        select {
            padding: 0.65rem 0.85rem;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(15, 14, 20, 0.9);
            color: #f5f3ee;
            font-size: 0.95rem;
        }

        .checkbox-field {
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
        }

        .member-summary {
            margin-top: 1rem;
            padding: 1rem 1.25rem;
            border-radius: 16px;
            border: 1px dashed rgba(255, 255, 255, 0.4);
            background: rgba(255, 255, 255, 0.04);
        }

        .cart-grid {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .cart-entry {
            padding: 1.25rem;
            border-radius: 18px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            background: rgba(255, 255, 255, 0.02);
        }

        .cart-entry-meta {
            text-align: right;
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
            justify-content: center;
        }

        .cart-footer {
            margin-top: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
        }

        .highlight {
            font-size: 1.4rem;
            font-weight: 600;
            color: #ff8c42;
        }

        .empty-cart {
            padding: 1.5rem;
            border-radius: 16px;
            border: 1px dashed rgba(255, 255, 255, 0.4);
            background: rgba(255, 255, 255, 0.02);
        }
    `,
})
export default class Home {
    readonly productCatalog: readonly ProductItem[] = [
        {
            id: 'aurora-table',
            name: '極光柔紗桌燈',
            price: 4980,
            tagline: '雙層乳白玻璃，暖光與霧亮質感兼得。',
            category: 'table',
            highlight: '可調色溫',
            isNew: true,
            features: ['無眩光面罩', '內建鋁合金底座', '搭配香氛功能'],
        },
        {
            id: 'nebula-pendant',
            name: '星雲雕塑吊燈',
            price: 16800,
            tagline: '懸浮在空中的曲線光影，適合客廳或階梯間。',
            category: 'pendant',
            highlight: '多點光源設計',
            isNew: false,
            features: ['可調高度懸吊', '銅金屬烤漆', '支援語音開關'],
        },
        {
            id: 'harbor-outdoor',
            name: '港灣戶外壁燈',
            price: 8200,
            tagline: '經典銅鏽色，耐鹽霧與自動光感電路。',
            category: 'outdoor',
            highlight: '感光自動開啟',
            isNew: true,
            features: ['IP65 防水', '含遮雨罩', '搭配夜間暖白光'],
        },
        {
            id: 'luna-pendant',
            name: '露娜雲石吊燈',
            price: 13800,
            tagline: '雲石與細線勾勒的月光弧度。',
            category: 'pendant',
            highlight: '雕刻工藝',
            isNew: false,
            features: ['天然雲石罩', '可拆洗版型', '磁吸更換飾片'],
        },
        {
            id: 'studio-floor',
            name: '工坊機能落地燈',
            price: 7600,
            tagline: '可調雙臂與USB快充插座，讓角落成為創作延伸。',
            category: 'table',
            highlight: '多段角度',
            isNew: false,
            features: ['鋼絲結構支撐', '柔光罩護眼', '金屬珩面質地'],
        },
        {
            id: 'marina-outdoor',
            name: '海灣軒陽台燈',
            price: 9200,
            tagline: '霧面玻璃與鋼化蓋板，打造親膚夜色氛圍。',
            category: 'outdoor',
            highlight: '節能模組',
            isNew: false,
            features: ['腳踩感應開關', '60,000 小時壽命', '含場景切換'],
        },
    ];

    cartItems: CartEntry[] = [];

    selectedCategory = 'all';

    memberProfile: MemberProfile = {
        firstName: '',
        email: '',
        membershipLevel: 'basic',
        favouriteStyle: '',
        wantsStudioVisit: false,
    };

    memberMessage = '';

    get visibleProducts(): readonly ProductItem[] {
        if (this.selectedCategory === 'all') {
            return this.productCatalog;
        }

        return this.productCatalog.filter(
            (product) => product.category === this.selectedCategory
        );
    }

    get cartQuantity(): number {
        return this.cartItems.reduce((total, entry) => total + entry.quantity, 0);
    }

    get cartTotal(): number {
        return this.cartItems.reduce(
            (total, entry) => total + entry.quantity * entry.product.price,
            0
        );
    }

    AddToCart(product: ProductItem): void {
        const existingEntry = this.cartItems.find((entry) => entry.product.id === product.id);
        if (existingEntry) {
            existingEntry.quantity += 1;
        } else {
            this.cartItems = [...this.cartItems, { product, quantity: 1 }];
        }
    }

    RemoveFromCart(entry: CartEntry): void {
        this.cartItems = this.cartItems.filter((item) => item.product.id !== entry.product.id);
    }

    SetProductCategory(category: string): void {
        this.selectedCategory = category;
    }

    HandleMemberSubmit(): void {
        const levelName =
            this.memberProfile.membershipLevel === 'pro'
                ? '流光會員'
                : this.memberProfile.membershipLevel === 'vip'
                ? '璀璨會員'
                : '光織會員';

        this.memberMessage = `${this.memberProfile.firstName || '朋友'}，已設定為 ${levelName}，我們會以 ${this.memberProfile.favouriteStyle || '專屬風格'} 為你帶來推薦。`;

        if (this.memberProfile.wantsStudioVisit) {
            this.memberMessage += ' 工作室訪談班次將另行通知。';
        }
    }

    ScrollToSection(sectionId: string): void {
        if (typeof document === 'undefined') {
            return;
        }

        const target = document.getElementById(sectionId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}
