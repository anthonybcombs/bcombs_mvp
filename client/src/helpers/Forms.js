export const getPageQrCode = async () => {
    const response = await fetch(`${process.env.API_HOST}/api/qr/assessmentform`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    });
    return response.json();
  }
  