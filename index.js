import axios from "axios";

const EXCHANGE_RATE_API_URL = "https://api.exchangerate-api.com/v4/latest/USD";

// Replace with your actual GA4 Measurement Protocol secret and property ID
const GA4_MEASUREMENT_ID = "GA4_MEASUREMENT_ID";
const GA4_API_SECRET = "GA4_API_SECRET";


async function getExchangeRate() {
  try {
    const response = await axios.get(EXCHANGE_RATE_API_URL);
    return response.data.rates.UAH;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
}


const sendEventToGA4 = async (exchangeRate) => {
  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`;
  const payload = {
    client_id: "exchange_rate_tracker",
    events: [{
      name: "exchange_rate_update",
      params: {
        uah_usd_rate: exchangeRate
      }
    }]
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(`Sent event to GA4: ${response.status} - ${response.statusText}`);
  } catch (error) {
    console.error('Error sending event to GA4:', error);
    throw error;
  }
}

const main = async () => {
    try {
        const exchangeRate = await getExchangeRate();
        await sendEventToGA4(exchangeRate);
    } catch (error) {
        console.error('Error in main loop:', error);
    }
    setTimeout(main, 3600 * 1000);
}

main().catch(error => console.error('Fatal error:', error));
