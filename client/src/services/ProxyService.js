import axios from 'axios';

export async function invoke(props) {
    const response = await axios.post("http://localhost:5001/invoke", props);
    return response.data;
}

export async function getHistory() {
    const response = await axios.get("http://localhost:5001/history");
    return response.data;
}