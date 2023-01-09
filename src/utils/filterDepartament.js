
const Astrakhan = ['астрахань', 'карагали', 'началово', 'икряное', 'камызяк', 'нартовский', 'новоначаловский',
  'красный яр', 'старокучергановка', 'чаган', 'яксатово', 'осыпной бугор', 'солянка']

const Elista = ['элиста', 'яшкуль', 'троицкое', 'дербеты', 'царын', 'аршан', 'кетченеры', 'городовиковск',
  'светлоград', 'садовое', 'приютное', 'цаган аман', 'лагань']

const Liman = ['лиман', 'заречное', 'михайловна', 'зензели', 'яндыки', 'промысловка', 'лесное', 'оля']
const Volodarsky = ['володарский', 'володаровка']
const Akhtubinsk = ['ахтубинск', 'баскунчак', 'успенка', 'батаевка', 'ново-николаевка', 'болхуны', 'сокрутовка',
  'пироговка', 'золотуха', 'удачное', 'харабали', 'покровка', 'пологое займище', 'садовое']

const Znamensk = ['знаменск', 'капустин яр']
const BlackYar = []

const CityByDep = { 5: Astrakhan, 25: Akhtubinsk, 37: Liman, 41: Volodarsky, 43: Znamensk, 45: BlackYar, 51: Elista }

export const filterDep = (address, dep) => {
  let isAdd = false;
  const city = CityByDep[dep];
  if (city === undefined) return true;

  city.forEach(c => {
    if (address.toLowerCase().indexOf(c) !== -1)
      isAdd = true;
  });

  return isAdd;
}