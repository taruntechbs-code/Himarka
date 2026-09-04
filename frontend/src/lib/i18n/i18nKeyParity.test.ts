import { describe, it, expect } from 'vitest';
import en from './locales/en.json';
import as from './locales/as.json';
import bn from './locales/bn.json';
import hi from './locales/hi.json';
import ne from './locales/ne.json';
import mni from './locales/mni.json';
import brx from './locales/brx.json';
import lus from './locales/lus.json';
import kha from './locales/kha.json';

type JsonObj = Record<string, unknown>;

function getNestedKeys(obj: JsonObj, prefix = ''): string[] {
  let keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(getNestedKeys(value as JsonObj, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function getEmptyKeys(obj: JsonObj, prefix = ''): string[] {
  let emptyKeys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      emptyKeys = emptyKeys.concat(getEmptyKeys(value as JsonObj, fullKey));
    } else if (value === '' || value === null || value === undefined) {
      emptyKeys.push(fullKey);
    }
  }
  return emptyKeys;
}

describe('Internationalization (i18n) Key Parity & Completeness', () => {
  const locales = {
    as,
    bn,
    hi,
    ne,
    mni,
    brx,
    lus,
    kha,
  };

  const enKeys = new Set(getNestedKeys(en));

  it('en.json should have a comprehensive non-empty set of keys', () => {
    expect(enKeys.size).toBeGreaterThan(150);
    const emptyKeys = getEmptyKeys(en);
    expect(emptyKeys).toEqual([]);
  });

  for (const [langCode, localeData] of Object.entries(locales)) {
    it(`locale [${langCode}] must have 100% key parity with en.json`, () => {
      const currentKeys = new Set(getNestedKeys(localeData));

      const missingKeys = [...enKeys].filter((k) => !currentKeys.has(k));
      const extraKeys = [...currentKeys].filter((k) => !enKeys.has(k));

      expect(missingKeys, `Missing keys in [${langCode}]: ${missingKeys.join(', ')}`).toEqual([]);
      expect(extraKeys, `Extra keys in [${langCode}]: ${extraKeys.join(', ')}`).toEqual([]);

      const emptyKeys = getEmptyKeys(localeData);
      expect(emptyKeys, `Empty or undefined keys in [${langCode}]: ${emptyKeys.join(', ')}`).toEqual([]);
    });
  }
});
