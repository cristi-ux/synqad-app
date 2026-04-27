// Fișier: netlify/functions/sync.js

exports.handler = async function(event, context) {
  // Permitem cererile din frontend-ul tău
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' } };
  }

  try {
    // 1. Luăm datele trimise din dashboard.html
    const { storeUrl, token } = JSON.parse(event.body);

    // 2. Batem la ușa Shopify-ului pentru a cere produsele (cerem maxim 50 deocamdată)
    const shopifyResponse = await fetch(`https://${storeUrl}/admin/api/2024-01/products.json?limit=50`, {
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