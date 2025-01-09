export interface FormData {
  type: 'N' | 'C';
  id: string;
  companyCode: string;
  currency?: string;
  cardType?: string;
  glNumber: string;
  geo: string;
  career?: string;
}

export interface Entity extends FormData {
  entityId: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: 'success' | 'error' | 'info';
  read: boolean;
}