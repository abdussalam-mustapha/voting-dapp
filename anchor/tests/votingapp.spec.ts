import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Votingapp} from '../target/types/votingapp'
import { BankrunProvider } from "anchor-bankrun";
import { startAnchor } from 'solana-bankrun';


const IDL = require('../target/idl/votingapp.json')

const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF")

describe('votingapp', () => {
  // Configure the client to use the local cluster.
 

  it ('Initialize Poll', async() => {
    const context = await startAnchor("", [{ name : "votingapp", programId: votingAddress}], []);

    const provider = new BankrunProvider(context);

    const votingProgram = new Program<Votingapp>(
      IDL,
      provider
  )

  await votingProgram.methods.initializePoll(
    new anchor.BN(1),
    "who is your favorite solana candidate",
    new anchor.BN(0),
    new anchor.BN(1735310341),
  ).rpc();

  const [pollAddress] = PublicKey.findProgramAddressSync(
    [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],  //grab buffer from u64
    votingAddress
  )

  const poll = await votingProgram.account.poll.fetch(pollAddress)
  console.log(poll)

  expect(poll.pollId.toNumber()).toEqual(1)
  expect(poll.description).toEqual("who is your favorite solana candidate")
  expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber())

  })
})
