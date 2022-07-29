import * as utils from './utils';

export class Flags {
  // properties
  qr: boolean;
  aa: boolean;
  tc: boolean;
  rd: boolean;
  ra: boolean;

  private static qr_mask = 0x8000;
  private static aa_mask = 0x0400;
  private static tc_mask = 0x0200;
  private static rd_mask = 0x0100;
  private static ra_mask = 0x0080;

  public constructor(
    qr: boolean,
    aa: boolean,
    tc: boolean,
    rd: boolean,
    ra: boolean,
  ) {
    this.qr = qr;
    this.aa = aa;
    this.tc = tc;
    this.rd = rd;
    this.ra = ra;
  }

  static default(): Flags {
    return new Flags(false, false, false, false, false);
  }

  static queryFlags(): Flags {
    return new Flags(false, false, false, true, false);
  }

  to_int(): number {
    let b = 0;

    if (this.qr) b |= Flags.qr_mask;
    if (this.aa) b |= Flags.aa_mask;
    if (this.tc) b |= Flags.tc_mask;
    if (this.rd) b |= Flags.rd_mask;
    if (this.ra) b |= Flags.ra_mask;

    return b;
  }

  static parse(flags_container: number): Flags {
    const qr = utils.is_set(flags_container, Flags.qr_mask);
    const rd = utils.is_set(flags_container, Flags.rd_mask);
    const ra = utils.is_set(flags_container, Flags.ra_mask);
    const tc = utils.is_set(flags_container, Flags.tc_mask);
    const aa = utils.is_set(flags_container, Flags.aa_mask);

    return new Flags(qr, aa, tc, rd, ra);
  }

  is_query(): boolean {
    return !this.qr;
  }

  is_response(): boolean {
    return this.qr;
  }
}
