export type DeductionMode = "none" | "employee";

export type WriteOffStatus = "pending" | "approved" | "rejected";

export type MobilePermission =
  | "writeoff.catalog.read"
  | "writeoff.photo.upload"
  | "writeoff.request.create"
  | "writeoff.request.read.own";

export type Employee = {
  id: string;
  employeeId: string;
  name: string;
  role: string;
};

export type UserSession = {
  employee: Employee;
  permissions: MobilePermission[];
  issuedAt: string;
};

export type ProductCategory = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  sku: string;
  unit: string;
};

export type PointOfSale = {
  id: string;
  name: string;
  address: string;
  city?: string;
};

export type WriteOffCategory = {
  id: string;
  name: string;
};

export type RequestDraft = {
  photoUri: string;
  productId?: string;
  quantity?: number;
  pointOfSaleId?: string;
  deductionMode?: DeductionMode;
  deductionEmployeeId?: string | null;
  writeOffCategoryId?: string;
  comment?: string;
};

export type WriteOffRequest = {
  id: string;
  requestNumber: string;
  status: WriteOffStatus;
  createdAt: string;
  createdByEmployeeId: string;
  productId: string;
  quantity: number;
  pointOfSaleId: string;
  deductionMode: DeductionMode;
  deductionEmployeeId: string | null;
  writeOffCategoryId: string;
  comment: string;
  photoFileId?: string;
  photoUrl?: string;
  photoUri?: string;
};
