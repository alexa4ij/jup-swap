export async function searchTokens(query) {
  const res = await fetch(`https://lite-api.jup.ag/tokens/v2/search?query=${query}`);
  return res.json();
}

export async function getPrices(mints) {
  const ids = mints.join(',');
  const res = await fetch(`https://lite-api.jup.ag/price/v3?ids=${ids}`);
  return res.json();
}

export async function getQuote(inputMint, outputMint, amount) {
  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount: amount.toString(),
  });
  const res = await fetch(`https://lite-api.jup.ag/ultra/v1/order?${params}`);
  return res.json();
}
