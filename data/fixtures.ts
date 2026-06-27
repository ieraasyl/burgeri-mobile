import type {
  Employee,
  PointOfSale,
  Product,
  ProductCategory,
  WriteOffCategory,
  WriteOffRequest
} from "@/types/domain";

export const employees: Employee[] = [
  { id: "emp-1", employeeId: "EMP-1001", name: "Алия Нурбекова", role: "Кассир" },
  { id: "emp-2", employeeId: "EMP-1002", name: "Данияр Садыков", role: "Повар" },
  { id: "emp-3", employeeId: "EMP-1003", name: "Мадина Омарова", role: "Старший смены" },
  { id: "emp-4", employeeId: "EMP-1004", name: "Руслан Ахметов", role: "Кассир" },
  { id: "emp-5", employeeId: "EMP-1005", name: "Жанна Каримова", role: "Повар" }
];

export const productCategories: ProductCategory[] = [
  { id: "cat-buns", name: "Булочки" },
  { id: "cat-meat", name: "Мясо" },
  { id: "cat-veg", name: "Овощи" },
  { id: "cat-sauce", name: "Соусы" },
  { id: "cat-drinks", name: "Напитки" }
];

export const products: Product[] = [
  { id: "prod-1", categoryId: "cat-buns", name: "Булочка бриошь", sku: "BR-001", unit: "шт" },
  { id: "prod-2", categoryId: "cat-buns", name: "Булочка кунжутная", sku: "BR-002", unit: "шт" },
  { id: "prod-3", categoryId: "cat-meat", name: "Котлета говяжья", sku: "MT-011", unit: "шт" },
  { id: "prod-4", categoryId: "cat-meat", name: "Куриное филе", sku: "MT-012", unit: "кг" },
  { id: "prod-5", categoryId: "cat-veg", name: "Томат свежий", sku: "VG-021", unit: "кг" },
  { id: "prod-6", categoryId: "cat-veg", name: "Салат айсберг", sku: "VG-022", unit: "кг" },
  { id: "prod-7", categoryId: "cat-sauce", name: "Соус бургерный", sku: "SC-031", unit: "л" },
  { id: "prod-8", categoryId: "cat-sauce", name: "Сырный соус", sku: "SC-032", unit: "л" },
  { id: "prod-9", categoryId: "cat-drinks", name: "Лимонад фирменный", sku: "DR-041", unit: "л" },
  { id: "prod-10", categoryId: "cat-drinks", name: "Морс ягодный", sku: "DR-042", unit: "л" }
];

export const pointsOfSale: PointOfSale[] = [
  { id: "pos-1", name: "Burgeri Абая", address: "пр. Абая, 17" },
  { id: "pos-2", name: "Burgeri Mega", address: "ТРЦ Mega Alma-Ata" },
  { id: "pos-3", name: "Burgeri Dostyk", address: "пр. Достык, 85" },
  { id: "pos-4", name: "Burgeri Forum", address: "ТРЦ Forum Almaty" }
];

export const writeOffCategories: WriteOffCategory[] = [
  { id: "woff-1", name: "Истек срок годности" },
  { id: "woff-2", name: "Повреждена упаковка" },
  { id: "woff-3", name: "Ошибка приготовления" },
  { id: "woff-4", name: "Порча при хранении" },
  { id: "woff-5", name: "Возврат от гостя" }
];

export const seededRequests: WriteOffRequest[] = [
  {
    id: "req-seed-3",
    requestNumber: "WR-00003",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    createdByEmployeeId: "emp-1",
    productId: "prod-3",
    quantity: 4,
    pointOfSaleId: "pos-1",
    deductionMode: "none",
    deductionEmployeeId: null,
    writeOffCategoryId: "woff-3",
    comment: "Котлеты пересушены после ошибки приготовления."
  },
  {
    id: "req-seed-2",
    requestNumber: "WR-00002",
    status: "approved",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    createdByEmployeeId: "emp-1",
    productId: "prod-6",
    quantity: 1.5,
    pointOfSaleId: "pos-2",
    deductionMode: "none",
    deductionEmployeeId: null,
    writeOffCategoryId: "woff-4",
    comment: "Салат потерял товарный вид после ночного хранения."
  },
  {
    id: "req-seed-1",
    requestNumber: "WR-00001",
    status: "rejected",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    createdByEmployeeId: "emp-1",
    productId: "prod-7",
    quantity: 0.7,
    pointOfSaleId: "pos-1",
    deductionMode: "employee",
    deductionEmployeeId: "emp-2",
    writeOffCategoryId: "woff-2",
    comment: "Упаковка была повреждена при приемке смены."
  }
];

