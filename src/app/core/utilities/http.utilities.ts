import { EXCLUDED_PATHS } from '../constants/http.constants';

export class HttpUtilities {
  static isExcluded(url: string): boolean {
    return EXCLUDED_PATHS.some(path => url.includes(path));
  }
}