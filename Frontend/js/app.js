import axios from 'axios';

export const fetchData = async() => {
    let response = await axios.get(process.env.TASK_GET_URL);
    console.log("fetch data", response);
}

