import axios from 'axios';

export async function invoke(props) {
    const response = await axios.post("http://localhost:5001/invoke", props);
    return response.data;
}