import { ParamMap } from '@angular/router';

export function getRouteParam(params: ParamMap, key: 'companyId' | 'vacancyId'): string | null {
  return params.get(key) ?? null;
}

export function areRouteParamsEqual(
  previous: ParamMap | null,
  current: ParamMap,
  keys: Array<'companyId' | 'vacancyId'>,
): boolean {
  return keys.every((key) => previous?.get(key) === current.get(key));
}
