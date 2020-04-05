declare module "@salesforce/apex/CurrencyExchangeCMPController.getCurrencyList" {
  export default function getCurrencyList(): Promise<any>;
}
declare module "@salesforce/apex/CurrencyExchangeCMPController.getExchangeRate" {
  export default function getExchangeRate(param: {baseCurrencyCode: any, toCurrencyCode: any}): Promise<any>;
}
