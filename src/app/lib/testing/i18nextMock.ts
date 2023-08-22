/**
 * This mock makes sure any components using the translate hook can use it without a warning being
 * shown.
 *
 * From https://react.i18next.com/misc/testing
 *
 * NOTE: In test files, run `jest.mock` for this module before importing any modules that will use
 * this mock module.
 */
const i18nextMock = {
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  Trans: ({ children }: { children: React.ReactNode}) => children,
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  }
};

export default i18nextMock;
