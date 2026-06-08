export function sanitizeMoneyInput(value) {
  return String(value ?? "").replace(/[^0-9.,-]/g, "");
}

export function parseMoneyInput(value) {
  if (value === null || value === undefined) {
    return NaN;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : NaN;
  }

  const raw = sanitizeMoneyInput(value).trim();
  if (!raw) {
    return NaN;
  }

  const negative = raw.startsWith("-");
  const unsigned = negative ? raw.slice(1) : raw;
  const lastComma = unsigned.lastIndexOf(",");
  const lastDot = unsigned.lastIndexOf(".");
  const decimalSeparator =
    lastComma > lastDot ? "," : lastDot > lastComma ? "." : null;

  let wholePart = unsigned;
  let fractionPart = "";

  if (decimalSeparator) {
    const separatorIndex = unsigned.lastIndexOf(decimalSeparator);
    wholePart = unsigned.slice(0, separatorIndex);
    fractionPart = unsigned.slice(separatorIndex + 1);
  }

  wholePart = wholePart.replace(/[.,]/g, "");
  fractionPart = fractionPart.replace(/[.,]/g, "");

  const numericText = fractionPart ? `${wholePart}.${fractionPart}` : wholePart;
  const parsed = Number(`${negative ? "-" : ""}${numericText}`);

  return Number.isFinite(parsed) ? parsed : NaN;
}

export function formatMoneyBRL(value) {
  const parsed = parseMoneyInput(value);
  const safeValue = Number.isFinite(parsed) ? parsed : 0;

  return safeValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function moneyValue(value) {
  const parsed = parseMoneyInput(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
