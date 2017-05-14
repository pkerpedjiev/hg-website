import {text} from 'd3-request';

export function hitServer(token) {
    console.log('token:', token);

    let request = text('http://localhost:8077/api/v1/which_user/');

    if (token)
        request.header('Authorization', 'JWT ' + token)

    request.get((text) => {
        console.log('text:', text);
    })
}
