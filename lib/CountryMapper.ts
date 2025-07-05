export type CountryTableDto = {
  iso2: string;
  name: string;
  language: string;
};

export type CountryTable = {
  code: string;
  label: string;
  locale: string;
};

export const CountryMapper = {
  toCountryTableEntities(dtos: CountryTableDto[]): CountryTable[] {
    return dtos.map((dto) => ({
      code: dto.iso2,
      label: dto.name,
      locale: dto.language,
    }));
  }
};
