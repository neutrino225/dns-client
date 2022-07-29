export class InvalidRecordTypeValueError extends Error {
  constructor(val: number) {
    super(`Invalid value for RecordType: ${val}`);
  }
}

export default class RecordType {
  static readonly A = new RecordType(1);
  static readonly CNAME = new RecordType(5);

  private static readonly rTypeVals: Map<number, RecordType> = new Map([
    [RecordType.A.val, RecordType.A],
    [RecordType.CNAME.val, RecordType.CNAME],
  ]);

  private constructor(private readonly val: number) {}

  static fromNum(num: number): RecordType {
    const rtype = RecordType.rTypeVals.get(num);

    if (!rtype) throw new InvalidRecordTypeValueError(num);

    return rtype;
  }

  get value(): number {
    return this.val;
  }
}
