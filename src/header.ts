import { Flags } from './flags';
import { DNSBuffer } from './dns_buffer';
import * as utils from './utils';

export class Header {
  id: number; // 2 bytes
  flags: Flags;

  z: number; // 3 bits
  rcode: number; // 4 bits

  qd_count: number; // 2 bytes - short
  an_count: number; // 2 bytes
  ns_count: number; // 2 bytes
  ar_count: number; // 2 bytes

  private static z_mask = 0x0070;
  private static rcode_mask = 0x000f;
  private static Z_DEFAULT = 2;

  constructor(
    id: number,
    flags: Flags,
    z: number,
    rcode: number,
    qd_count: number,
    an_count: number,
    ns_count: number,
    ar_count: number,
  ) {
    this.id = id;
    this.flags = flags;
    this.qd_count = qd_count;
    this.an_count = an_count;
    this.ns_count = ns_count;
    this.ar_count = ar_count;
    this.z = z;
    this.rcode = rcode;
  }

  static create(flags: Flags, questions: number, answers: number): Header {
    const id = utils.random();

    return new Header(id, flags, Header.Z_DEFAULT, 0, questions, answers, 0, 0);
  }

  static query_header(questions: number): Header {
    return this.create(Flags.queryFlags(), questions, 0);
  }

  pack() {
    const buf = new DNSBuffer(12);

    this.packInto(buf);

    return buf;
  }

  packInto(buff: DNSBuffer) {
    buff.writeShort(this.id);
    let flags_container = this.flags.to_int();

    flags_container |= this.z << 4;
    flags_container += this.rcode;

    buff.writeShort(flags_container);
    buff.writeShort(this.qd_count);
    buff.writeShort(this.an_count);
    buff.writeShort(this.ns_count);
    buff.writeShort(this.ar_count);
  }

  static parse(buff: DNSBuffer) {
    const id = buff.readShort();
    const flags_container = buff.readShort();

    const rcode = flags_container & Header.rcode_mask;
    const z = flags_container & (Header.z_mask << 4);

    const flags = Flags.parse(flags_container);

    const qd_count = buff.readShort();
    const an_count = buff.readShort();
    const ns_count = buff.readShort();
    const ar_count = buff.readShort();

    return new Header(
      id,
      flags,
      z,
      rcode,
      qd_count,
      an_count,
      ns_count,
      ar_count,
    );
  }
}
