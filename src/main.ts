import { Question } from './question';
import { DNSQuery } from './query';
import { Header } from './header';
import * as dgram from 'node:dgram';
import process from 'node:process';
import { Response } from './response';
import { DNSBuffer } from './dns_buffer';
import * as fs from 'node:fs';

const client = dgram.createSocket('udp4');
let open = true;
const HOST = '8.8.8.8';
const PORT = 53;

const query = DNSQuery.ipv4('api.carbonteq-livestream.ml');

client.on('message', (msg) => {
  // fs.writeFileSync('test', msg);
  const buff = DNSBuffer.from(msg);
  // fs.writeFileSync("./testdata", msg, "utf8");
  // const path = "./testdata";
  // const buffer = Buffer.from(msg);
  // fs.createWriteStream(path).write(buffer);
  const header = Header.parse(buff);

  for (let i = 0; i < header.qd_count; i++) {
    const q = Question.parse(buff);

    console.log(q);
  }
  for (let j = 0; j < header.an_count; j++) {
    const ans = Response.parse(buff);

    console.log(ans);
  }
});

client.on('error', (err) => {
  console.error(err || 'Closed the client');
});

client.connect(PORT, HOST, () => {
  console.log('Connected');
  console.log('Sending data...');

  client.send(query);

  console.log('Data sent...');
});

const cleanupHandler = () => {
  if (open) {
    open = false;

    console.log('Closing client...');
    client.close();

    console.log('Bye Bye!!');
  }
};

// normal close
process.on('exit', cleanupHandler);

// ctrl + c
process.on('SIGINT', cleanupHandler);

// "kill pid" events - like nodemon restart
process.on('SIGUSR1', cleanupHandler);
process.on('SIGUSR2', cleanupHandler);

process.on('uncaughtException', (err) => {
  console.error(err);

  cleanupHandler();
});
