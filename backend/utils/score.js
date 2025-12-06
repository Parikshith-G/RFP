exports.scoreProposal = (p, constraints) => {
  const MIN_WARRANTY_YEARS = constraints?.warranty_min_years || 0;
  const REQUIRED_PAYMENT_TERM =
    constraints?.payment_terms_required?.toLowerCase() || "";
  const NON_COMPLIANCE_PENALTY = 500;

  const PRICE_WEIGHT = 0.65;
  const DELIVERY_WEIGHT = 0.35;

  const { totalPrice, deliveryDays, parsed } = p;

  const vendorWarrantyYears = parsed?.warranty_years || 0;
  const vendorPaymentTerm = parsed?.payment_terms?.toLowerCase() || "";

  let compliancePenalty = 0;

  if (vendorWarrantyYears < MIN_WARRANTY_YEARS) {
    return 0;
  }

  if (!vendorPaymentTerm.includes(REQUIRED_PAYMENT_TERM.replace(" ", ""))) {
    compliancePenalty = NON_COMPLIANCE_PENALTY;
  }

  const priceScore = 100000 / Number(totalPrice);
  const deliveryScore = 150 / deliveryDays;

  let finalScore = priceScore * PRICE_WEIGHT + deliveryScore * DELIVERY_WEIGHT;
  finalScore = finalScore - compliancePenalty;

  if (finalScore < 0) {
    return 0.01;
  }

  return finalScore;
};
