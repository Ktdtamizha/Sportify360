import axios from 'axios';

const API_URL = 'http://10.16.52.209:5000';

const sendEmail = async (to, subject, text) => {
  try {
    const response = await axios.post(`${API_URL}/send-email`, { to, subject, text });
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};


export default sendEmail;
