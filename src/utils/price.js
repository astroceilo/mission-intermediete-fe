// export const formatPrice = (value) => {
//   if (!value || isNaN(value)) return "Rp 0";

//   if (value >= 1_000_000) {
//     return `Rp ${(value / 1_000_000)
//       .toFixed(1)
//       .replace(/\.0$/, "")}JT`;
//   }

//   if (value >= 1_000) {
//     return `Rp ${(value / 1_000).toFixed(0)}K`;
//   }

//   return `Rp ${value}`;
// };

// Compact (Home, Card, Listing)
export const formatPriceCompact = (value) => {
  if (!value || isNaN(value)) return "Rp 0";

  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000)
      .toFixed(1)
      .replace(/\.0$/, "")}JT`;
  }

  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)}K`;
  }

  return `Rp ${value}`;
};

// Full (Form, Detail, Checkout)
export const formatPriceFull = (value) => {
  if (!value || isNaN(value)) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export function getFinalPrice(price, formatter = formatPriceCompact) {
  // fallback aman
  if (!price) {
    return {
      final: 0,
      hasDiscount: false,
      formatted: {
        original: formatter(0),
        final: formatter(0),
      },
    };
  }

  const original = price.original ?? 0;
  const discount = price.discount ?? 0;
  const final = price.final ?? original;

  const hasDiscount = discount > 0 && final < original;

  return {
    final,
    hasDiscount,
    formatted: {
      original: formatter(original),
      final: formatter(final),
    },
  };
}
