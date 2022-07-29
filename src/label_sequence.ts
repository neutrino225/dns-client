import { DNSBuffer } from './dns_buffer';

export class LabelSequence {
  static readonly NULL_BYTE = 0;
  static readonly JMP_BYTE: number = 0xc0;
  static readonly JMP_MASK: number = 0xc000;

  private constructor(readonly domain: string, readonly packed: Buffer) {}

  static create(domain: string): LabelSequence {
    const parts: string[] = domain.split('.');
    const buff = new DNSBuffer(domain.length + 2);

    for (const part of parts) {
      buff.writeByte(part.length);
      buff.writeStr(part);
    }
    buff.writeByte(LabelSequence.NULL_BYTE);

    return new LabelSequence(domain, buff.data);
  }

  get length(): number {
    return this.packed.length;
  }

  static parse(buff: DNSBuffer): LabelSequence {
    const init_pos = buff.offset;

    if (buff.peek === LabelSequence.JMP_BYTE) {
      let jmp_idx = buff.readShort();
      jmp_idx ^= LabelSequence.JMP_MASK;

      // sanity check
      return LabelSequence.parse(DNSBuffer.from(buff.data.subarray(jmp_idx)));
    }

    const parts = [];
    while (buff.peek !== 0) {
      const part_length = buff.readByte();
      const part = buff.readString(part_length);
      parts.push(part);
    }

    buff.readByte();

    const domain = parts.join('.');

    return new LabelSequence(domain, buff.slice(init_pos, buff.offset));
  }
}
