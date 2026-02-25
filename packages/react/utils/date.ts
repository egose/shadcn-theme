import { isEqual } from 'date-fns/isEqual';
import _isNil from 'lodash-es/isNil';

export function isEqualDate(dt1: Date | undefined, dt2: Date | undefined) {
  const nildt1 = _isNil(dt1);
  const nildt2 = _isNil(dt2);

  if (nildt1) dt1 = undefined;
  if (nildt2) dt2 = undefined;

  if (nildt1 || nildt2) {
    return nildt1 === nildt2;
  }

  return isEqual(dt1 as Date, dt2 as Date);
}

export function isEqualDates(dts1: [Date | undefined, Date | undefined], dts2: [Date | undefined, Date | undefined]) {
  const dts11 = dts1[0];
  const dts12 = dts1[1];
  const dts21 = dts2[0];
  const dts22 = dts2[1];

  return isEqualDate(dts11, dts21) && isEqualDate(dts12, dts22);
}
