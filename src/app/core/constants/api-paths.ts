const BASE_PATHS = {
 AUTH: 'auth',

} 

export const API_PATHS = {
  AUTH : {
    LOGIN: `${BASE_PATHS.AUTH}/login`,
    REGISTER: `${BASE_PATHS.AUTH}/register`,
    ME: `${BASE_PATHS.AUTH}/me`,
    REFRESH_TOKEN: `${BASE_PATHS.AUTH}/refresh`,
  },
}