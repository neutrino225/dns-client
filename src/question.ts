import RecordType from './record_type';
import { DNSBuffer } from './dns_buffer';
import { LabelSequence } from './label_sequence';

export class Question {
  private constructor(
    readonly lbl: LabelSequence,
    readonly r_type: RecordType,
    readonly query_class: number,
    readonly packed: DNSBuffer,
  ) {}

  static create(domain: string, r_type: RecordType) {
    const lbl = LabelSequence.create(domain);
    const query_class = 1;
    const remaining_buf = new DNSBuffer(4); //4 is the bytes required after label_seq i.e.  for record type and class
    remaining_buf.writeShort(r_type.value); //write r_type
    remaining_buf.writeShort(query_class); //query class
    const buffers = [lbl.packed, remaining_buf.data];
    const question_buf = Buffer.concat(buffers);

    return new Question(lbl, r_type, query_class, DNSBuffer.from(question_buf));
  }

  static parse(buf: DNSBuffer) {
    const init_pos = buf.offset;
    const lbl = LabelSequence.parse(buf);
    const type = RecordType.fromNum(buf.readShort());
    const query_class = buf.readShort();

    return new Question(
      lbl,
      type,
      query_class,
      DNSBuffer.from(buf.slice(init_pos, buf.offset)),
    );
  }
}
