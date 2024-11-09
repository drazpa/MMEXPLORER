export interface ServerInfo {
  status: string;
  version: string;
  uptime: number;
  currentLedger: {
    index: number;
    hash: string;
    closeTime: string;
  };
  load: {
    transactions: number;
    ledgerCloseTime: number;
  };
}