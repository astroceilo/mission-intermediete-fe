export const formatPrice = (value) => {
    if (!value || isNaN(value)) return "Rp 0";

    if (value >= 1_000_000) {
        return `Rp ${(value / 1_000_000)
            .toFixed(1)
            .replace(/\.0$/, "")}JT`;
    } else if (value >= 1_000) {
        return `Rp ${(value / 1_000)
            .toFixed(0)}K`;
    } else {
        return `Rp ${value}`;
    }
};

export function getFinalPrice(price) {
    // Jika null → return default
    if (price === null) {
        return {
            final: 0,
            hasDiscount: false,
            original: 0,
            formatted: {
                original: formatPrice(0),
                final: formatPrice(0),
            },
        };
    }

    // Jika number → simple price tanpa diskon
    if (typeof price === "number") {
        return {
            final: price,
            hasDiscount: false,
            original: price,
            formatted: {
                original: formatPrice(price),
                final: formatPrice(price),
            },
        };
    }

    // Jika object dengan original & discounted
    const original = price.original ?? 0;
    const discounted = price.discounted ?? null;

    const hasDiscount = discounted !== null && discounted < original;
    const final = hasDiscount ? discounted : original;

    return {
        final,
        hasDiscount,
        original,
        formatted: {
            original: formatPrice(original),
            final: formatPrice(final),
        },
    };
}

