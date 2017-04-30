import {text} from 'd3-request';

export function hitServer(token) {
    text('http://localhost:8077/api/v1/which_user/')
    .header('Authorization', 'JWT ' + token)
    .get((text) => {
        console.log('text:', text);
    })
}
