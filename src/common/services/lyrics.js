import {get } from './api';

export const getLyrics = (band, song) => {
    return get(`/lyrics/${band}/${song}`);
}