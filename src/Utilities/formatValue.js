export const unitLookupKey = unit => {
    const lookup = unit ? unit.toLowerCase() : '';
    return lookup;
};

export const formatCurrency = (
    value,
    unit,
    { fractionDigits = 2 } = {}
) => {
    let fValue = value;
    if (!value) {
        fValue = 0;
    }

    return fValue.toLocaleString('en', {
        style: 'currency',
        currency: unit || 'USD',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
    });
};

const unknownTypeFormatter = (
    value,
    _unit,
    { fractionDigits } = {}
) => {
    return value.toFixed(fractionDigits);
};

export const formatUsageGb = (
    value,
    _unit,
    { fractionDigits = 2 } = {}
) => {
    return value.toFixed(fractionDigits);
};

export const formatUsageHrs = (
    value,
    _unit,
    { fractionDigits } = {}
) => {
    return value.toFixed(fractionDigits);
};

export const formatValue = (
    value,
    unit,
    options = {}
) => {
    const lookup = unitLookupKey(unit);
    const fValue = value || 0;

    switch (lookup) {
        case 'usd':
            return formatCurrency(fValue, lookup, options);
        case 'gb':
        case 'gb-hours':
        case 'gb-mo':
            return formatUsageGb(fValue, lookup, options);
        case 'core-hours':
        case 'hrs':
            return formatUsageHrs(fValue, lookup, options);
        default:
            return unknownTypeFormatter(fValue, lookup, options);
    }
};
