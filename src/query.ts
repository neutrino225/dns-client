import { Question } from './question';
import { Header } from './header';
import RecordType from './record_type';

export class DNSQuery {
  header: Header;
  question: Question;

  constructor(domain: string, record_type: RecordType) {
    this.header = Header.query_header(1);
    this.question = Question.create(domain, record_type);
  }

  static ipv4(domain: string) {
    const headerbuf = Header.query_header(1).pack();
    const questionbuf = Question.create(domain, RecordType.A).packed;
    const query = [headerbuf.data, questionbuf.data];
    return Buffer.concat(query);
  }
}
