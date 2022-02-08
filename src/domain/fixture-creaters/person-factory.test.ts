import {defaultPersonFactoryConfig} from './default-factory-configs';
import {PersonFactory} from './person-factory';

describe('PersonFactory class', () => {
  const sut = new PersonFactory(defaultPersonFactoryConfig);

  describe('получение следующего порядкового номера', () => {
    test('порядковый числовой номер последовательно увеличивается', async () => {
      let i = 1;
      for (i; i < 100; i += 1) {
        expect((await sut.getPerson()).numID).toBe(i);
      }
    });
  });

  describe('получение псевдогосударственного номера', () => {
    test('govID соответствует строке с 12 цифрами', async () => {
      let i = 0;
      for (i; i < 100; i += 1) {
        const govID = (await sut.getPerson()).govID;
        expect(govID).toMatch(RegExp(/^[0-9]{12}$/));
      }
    });
  });

  describe('получение id номера', () => {
    test('соответствует hex формату длиной 24 символов (12 byte)', async () => {
      let i = 0;
      for (i; i < 10; i += 1) {
        const objID = (await sut.getPerson()).objID;
        expect(objID).toMatch(RegExp(/^[0-9a-f]{24}$/));
      }
    });
  });

  describe('получение псевдоимени и фамилии', () => {
    test('длина-50. Только числа-латиница-кириллица', async () => {
      // в редких случаях тест может не сработать,
      // какой то символ не выпасть (например числа)
      // особенно если количество символов небольшая.
      // перезапустите тест, при увеличьте количество символов
      // в атрибуте personConfig.lastNameCharacters (firstNameCharacters)
      // должно помочь.
      let i = 0;
      for (i; i < 10; i += 1) {
        const fName = (await sut.getPerson()).firstName;
        expect(fName).toMatch(RegExp(/^[0-9A-Za-zА-Яа-я]{50}$/));
        const lName = (await sut.getPerson()).lastName;
        expect(lName).toMatch(RegExp(/^[0-9A-Za-zА-Яа-я]{50}$/));
      }
    });
  });

  describe('получение возраста', () => {
    test('число между 12 и 60', async () => {
      let i = 0;
      for (i; i < 100; i += 1) {
        const age = (await sut.getPerson()).age;
        expect(age >= 12 && age <= 60).toBe(true);
      }
    });
  });

  describe('получение семейного статуса', () => {
    test('булевый тип. Имеет значения true и false', async () => {
      let i = 0;
      const arr = [];
      for (i; i < 100; i += 1) {
        arr.push((await sut.getPerson()).familyStatus);
      }
      expect(arr.every(item => typeof item === 'boolean')).toBe(true);
      expect(arr.every(item => item === true)).toBe(false);
      expect(arr.every(item => item === false)).toBe(false);
    });
  });

  describe('получение ссылки компании', () => {
    test('всегда undefine', async () => {
      let i = 0;
      for (i; i < 100; i += 1) {
        expect((await sut.getPerson()).companyID).toBeUndefined();
      }
    });
  });
});
