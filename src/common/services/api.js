import axios from 'axios';

const api = axios.create({
    baseURL: 'https://orion.apiseeds.com/api/music/lyric'
});

const request = (method, url, params) => {
    return new Promise((resolve, reject) => {
        api.request({
            url,
            method,
            params
        })
            .then(({data}) => {
                resolve(data);
            })
            .catch((e) => {
                reject(e)
            })
    });
}

export const get = (url, params) => request('get', url, params);