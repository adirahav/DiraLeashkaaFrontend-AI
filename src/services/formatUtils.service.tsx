import React from 'react';

export const parseNumber = (val: string | number | undefined): number => {
  if (val === undefined || val === null || val === '') return 0;
  const str = typeof val === 'number' ? val.toString() : val;
  return Number(str.replace(/,/g, '')) || 0;
};

export const formatNumber = (val: number | string | undefined, hideZero: boolean = false) => {
  if (val === undefined || val === '') return '';
  const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
  if (isNaN(num)) return '';
  if (hideZero && num === 0) return '';
  return num.toLocaleString('en-US');
};

export const formatInputNumber = (val: string, formatWithCommas: boolean = true) => {
  const digits = val.replace(/\D/g, '');
  if (!formatWithCommas) return digits;
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatCompact = (val: number) => {
  const isNegative = val < 0;
  const abs = Math.abs(val);
  let res = '';
  if (abs >= 1000000) {
    res = (abs / 1000000).toFixed(1) + 'M';
  } else if (abs >= 1000) {
    res = Math.round(abs / 1000) + 'K';
  } else {
    res = abs.toString();
  }
  return (isNegative ? '-' : '') + res;
};

export const formatCurrency = (val: number) => {
  const isNegative = val < 0;
  const absoluteVal = Math.round(Math.abs(val));
  const formatted = absoluteVal.toLocaleString('en-US');
  return (
    <span className="inline-flex flex-row-reverse items-center gap-1">
      <span>₪</span>
      <span dir="ltr">{isNegative ? '-' : ''}{formatted}</span>
    </span>
  );
};

export const formatPercent = (val: number) => {
  const isNegative = val < 0;
  const absoluteVal = Math.abs(val);
  const formatted = Math.round(absoluteVal * 10) / 10;
  return (
    <span dir="ltr">{isNegative ? '-' : ''}{formatted}%</span>
  );
};
