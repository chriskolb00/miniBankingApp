import { CurrencyFormatPipe } from './currency-format-pipe';

describe('CurrencyFormatPipe', () => {
  let pipe: CurrencyFormatPipe;

  beforeEach(() => {
    pipe = new CurrencyFormatPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format number with thousand separators', () => {
    expect(pipe.transform(100000)).toBe('$100,000.00');
  });

  it('should format number with decimal places', () => {
    expect(pipe.transform(1234.56)).toBe('$1,234.56');
  });

  it('should format zero correctly', () => {
    expect(pipe.transform(0)).toBe('$0.00');
  });

  it('should handle null and undefined', () => {
    expect(pipe.transform(null)).toBe('$0.00');
    expect(pipe.transform(undefined)).toBe('$0.00');
  });

  it('should format large numbers with multiple thousand separators', () => {
    expect(pipe.transform(1000000)).toBe('$1,000,000.00');
  });

  it('should support custom currency symbol', () => {
    expect(pipe.transform(100, '€')).toBe('€100.00');
  });

  it('should support custom decimal places', () => {
    expect(pipe.transform(100.5, '$', 0)).toBe('$101');
  });
});
