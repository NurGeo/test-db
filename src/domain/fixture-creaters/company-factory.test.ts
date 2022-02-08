import {CompanyFactory} from './company-factory';
import {defaultCompanyFactoryConfig} from './default-factory-configs';

describe('CompanyFactory class', () => {
  const sut = new CompanyFactory(defaultCompanyFactoryConfig);

  describe('получение следующего порядкового номера', () => {
    test('порядковый числовой номер последовательно увеличивается', async () => {
      let i = 1;
      for (i; i < 100; i += 1) {
        expect((await sut.getCompany()).numID).toBe(i);
      }
    });
  });

  describe('получение псевдогосударственного номера', () => {
    test('govID соответствует строке с 12 цифрами', async () => {
      let i = 0;
      for (i; i < 100; i += 1) {
        const govID = (await sut.getCompany()).govID;
        expect(govID).toMatch(RegExp(/^[0-9]{12}$/));
      }
    });
  });

  describe('получение имени компании', () => {
    test('длина-50. Только числа-латиница-кириллица', async () => {
      // в редких случаях тест может не сработать,
      // какой то символ не выпасть (например числа)
      // особенно если количество символов небольшая
      // перезапустите тест, при увеличьте количество символов
      // в атрибуте companyConfig.nameCharacters должно помочь.
      let i = 0;
      for (i; i < 10; i += 1) {
        const name = (await sut.getCompany()).name;
        expect(name).toMatch(RegExp(/^[0-9A-Za-zА-Яа-я]{50}$/));
      }
    });
  });
});
