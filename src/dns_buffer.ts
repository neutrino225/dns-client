import { Buffer } from 'node:buffer';

export class DNSBuffer {
  private _offset: number;
  private _data: Buffer;

  constructor(capacity = 512) {
    this._offset = 0;
    this._data = Buffer.alloc(capacity);
  }

  get offset(): number {
    return this._offset;
  }

  get data() {
    return this._data;
  }

  private copyFrom(buff: Buffer) {
    // todo: check if buf len is equal
    buff.copy(this._data);
  }

  static from(otherBuff: Buffer) {
    const buff = new DNSBuffer(otherBuff.length);
    buff.copyFrom(otherBuff);

    return buff;
  }

  writeStr(str: string) {
    this._data.write(str, this._offset);
    this._offset += str.length;
  }

  writeByte(val: number) {
    // todo: check if val is byte
    this._data.writeUInt8(val, this._offset);
    this._offset++;
  }

  writeShort(val: number) {
    //write
    this._data.writeUInt16BE(val, this._offset);
    this._offset += 2;
  }

  writeInt4(val: number) {
    //write
    this._data.writeUint32BE(val);
    this._offset += 4;
  }
  length(): number {
    return this._data.length;
  }

  readByte(): number {
    const val = this._data.readUint8(this._offset);
    this._offset++;
    return val;
  }

  readShort(): number {
    const val = this._data.readUint16BE(this._offset);
    this._offset += 2;
    return val;
  }

  readInt4(): number {
    const val = this._data.readUint32BE(this._offset);
    this._offset += 4;
    return val;
  }

  slice(start?: number | undefined, end?: number | undefined): Buffer {
    return this._data.subarray(start, end);
  }

  readString(string_length: number): string {
    const str = this._data
      .subarray(this.offset, this.offset + string_length)
      .toString();
    this._offset += string_length;

    return str;
  }

  get remaining() {
    return this._data.length - this._offset;
  }

  get peek() {
    return this._data[this._offset];
  }
}
