const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile');

const web3 = new Web3(ganache.provider());
const messages = {
  default: 'binod',
  updated: 'mario'
};

let accounts;
let inbox;
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [ messages.default ] })
    .send({ from: accounts[0], gas: 1_000_000 });
});

describe('Inbox', () => {
  it('deploys contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, messages.default);
  });

  it('can change the message', async () => {
    await inbox.methods.setMessage(messages.updated).send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, messages.updated);
  });
});
