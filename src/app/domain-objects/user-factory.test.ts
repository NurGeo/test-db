import { defaultUserFactoryConfig } from "./default-factory-configs";
import { UserFactory } from "./user-factory";

describe('UserFactory class', () => {
  const sut = new UserFactory(defaultUserFactoryConfig);

  describe('получение следующего порядкового номера', () => {
    test('порядковый числовой номер последовательно увеличивается', () => {
      let i = 1;
      for(i; i < 100; i += 1) {
        expect(sut.getUser().numID).toBe(i);
      }
    });
  });

  describe('получение псевдогосударственного номера', () => {
    test('govID соответствует строке с 12 цифрами', () => {
      let i = 0;
      for(i; i < 100; i += 1) {
        const govID = sut.getUser().govID;
        expect(govID).toMatch(RegExp(/^[0-9]{12}$/));
      }
    });
  });

  describe('получение id номера', () => {
    test('соответствует hex формату длиной 24 символов (12 byte)', () => {
      let i = 0;
      for(i; i < 10; i += 1) {
        const objID = sut.getUser().objID;
        expect(objID).toMatch(RegExp(/^[0-9a-f]{24}$/));
      }
    });
  });

  describe('получение псевдоимени и фамилии', () => {
    test('длина-50. Только числа-латиница-кириллица', () => {
      // в редких случаях тест может не сработать,
      // какой то символ не выпасть (например числа)
      // особенно если количество символов небольшая.
      // перезапустите тест, при увеличьте количество символов
      // в атрибуте userConfig.lastNameCharacters (firstNameCharacters)
      // должно помочь.
      let i = 0;
      for(i; i < 10; i += 1) {
        const fName = sut.getUser().fName;
        expect(fName).toMatch(RegExp(/^[0-9A-Za-zА-Яа-я]{50}$/));
        const lName = sut.getUser().lName;
        expect(lName).toMatch(RegExp(/^[0-9A-Za-zА-Яа-я]{50}$/));
      }
    });
  });

  describe('получение возраста', () => {
    test('число между 12 и 60', () => {
      let i = 0;
      for(i; i < 100; i += 1) {
        const age = sut.getUser().age;
        expect(age >= 12 && age <= 60).toBe(true);
      }
    });
  });

  describe('получение семейного статуса', () => {
    test('булевый тип. Имеет значения true и false', () => {
      let i = 0;
      const arr = [];
      for(i; i < 100; i += 1) {
        arr.push(sut.getUser().familyStatus);
      }
      expect(arr.every((item) => typeof item === 'boolean')).toBe(true);
      expect(arr.every((item) => item === true)).toBe(false);
      expect(arr.every((item) => item === false)).toBe(false);
    });
  });

  describe('получение ссылки компании', () => {
    test('всегда пустое значение', () => {
      let i = 0;
      for(i; i < 100; i += 1) {
        expect(sut.getUser().companyID).toBe('');
      }
    });
  });
});
