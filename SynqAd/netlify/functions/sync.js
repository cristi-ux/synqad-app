exports.handler = async function(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' } };
  }

  try {
    const { storeUrl, token } = JSON.parse(event.body);

    // Reparația magică: Curățăm URL-ul ca să nu avem "https://" de două ori
    const cleanUrl = storeUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

    const shopifyResponse = await fetch(`https://${cleanUrl}/admin/api/2024-01/products.json?limit=50`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      }
    });

    const data = await shopifyResponse.json();

    if (!shopifyResponse.ok) {
      throw new Error(data.errors || "Eroare la Shopify");
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, products: data.products })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};

    if (!shopifyResponse.ok) {
      throw new Error(data.errors || "Eroare la Shopify");
    }

    // 3. Trimitem produsele înapoi către dashboard-ul tău cu succes!
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, products: data.products })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
