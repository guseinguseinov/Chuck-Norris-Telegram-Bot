import axios from "axios";

export function getData(url) {
    return new Promise((res) => {
        res(axios.get(url));
    });
} 

