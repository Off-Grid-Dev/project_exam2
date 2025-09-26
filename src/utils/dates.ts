export const expandRangeToISODates = (
  fromISO: string,
  toISO: string,
): string[] => {
  const from = new Date(fromISO);
  const to = new Date(toISO);
  const out: string[] = [];
  for (
    let d = new Date(
      Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()),
    );
    d <=
    new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()));
    d.setUTCDate(d.getUTCDate() + 1)
  ) {
    out.push(
      new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
      ).toISOString(),
    );
  }
  return out;
};

export const isoDateAtUtcMidnight = (iso: string) => {
  const d = new Date(iso);
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  ).toISOString();
};
