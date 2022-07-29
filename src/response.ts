import { DNSBuffer } from './dns_buffer';
import { LabelSequence } from './label_sequence';
import RecordType from './record_type';

export class Response {
  private constructor(
    readonly label_seq: LabelSequence,
    readonly record_type: RecordType,
    readonly query_class: number,
    readonly ttl: number,
    readonly len: number,
    readonly rdata: string,
    readonly packed: Buffer,
  ) {}

  static parse(buff: DNSBuffer): Response {
    const init_pos = buff.offset;

    const lbl = LabelSequence.parse(buff);

    const rtype = RecordType.fromNum(buff.readShort());
    const query_class = buff.readShort();
    const ttl = buff.readInt4();
    const len = buff.readShort();

    let rdata = '';
    switch (rtype) {
      case RecordType.A:
        rdata = Response.parse_ipv4(buff);
        break;
      case RecordType.CNAME:
        rdata = Response.parse_cname(buff);
        break;
    }

    const packed = Buffer.alloc(buff.offset - init_pos);
    buff.slice(init_pos, buff.offset).copy(packed);

    return new Response(lbl, rtype, query_class, ttl, len, rdata, packed);
  }

  private static parse_ipv4(buf: DNSBuffer): string {
    const ip_parts: string[] = [];

    for (let i = 0; i < 4; i++) ip_parts.push(buf.readByte().toString());

    const ip = ip_parts.join('.');
    return ip;
  }

  private static parse_cname(buff: DNSBuffer): string {
    const lbl = LabelSequence.parse(buff);

    return lbl.domain;
  }
}
