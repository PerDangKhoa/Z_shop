
import Cookies from 'js-cookie';

export const getAccessToken = (): string | null => {
    return Cookies.get('accessToken') || null;
};

export const getRefreshToken = (): string | null => {
    return Cookies.get('refreshToken') || null;
};

export const setAccessToken = (token: string) => {
    Cookies.set('accessToken', token, {expires: 1});
}

export const setRefreshToken = (token: string) => {
    Cookies.set('refreshToken', token, { expires: 7, secure: true });
};

export const clearTokens = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
}
