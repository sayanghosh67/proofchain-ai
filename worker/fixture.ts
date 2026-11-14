export interface FixtureState {
  docsPatched: boolean;
  paymentPort: number; // 9042 (broken) or 4319 (fixed)
}

export const fixtureState: FixtureState = {
  docsPatched: false,
  paymentPort: 9042,
};

export function resetFixtureState(): void {
  fixtureState.docsPatched = false;
  fixtureState.paymentPort = 9042;
}

export function applyDocsPatch(): void {
  fixtureState.docsPatched = true;
}

export function revertDocsPatch(): void {
  fixtureState.docsPatched = false;
}

export function applyPaymentPatch(): void {
  fixtureState.paymentPort = 4319;
}

export function revertPaymentPatch(): void {
  fixtureState.paymentPort = 9042;
}
