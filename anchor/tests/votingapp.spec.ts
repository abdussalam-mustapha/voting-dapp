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
  let context
  let provider
  let votingProgram

  beforeAll(async() => {
    context = await startAnchor("", [{ name : "votingapp", programId: votingAddress}], []);

    provider = new BankrunProvider(context);

    votingProgram = new Program<Votingapp>(
      IDL,
      provider
  )

  })
 

  it ('Initialize Poll', async() => {
 

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

  it ('Initialize Candidate', async () => {
    await votingProgram.methods.initializeCandidate(
      "Jack",
      new anchor.BN(1)
    ).rpc()

    await votingProgram.methods.initializeCandidate(
      "Josh",
      new anchor.BN(1)
    ).rpc()

    const [JackAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Jack")],
      votingAddress,
    )
  
    const candidateOne = await votingProgram.account.candidate.fetch(JackAddress)
    console.log(candidateOne) 
    expect(candidateOne.candidateVotes.toNumber()).toEqual(0);
    
    const [JoshAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Josh")],
      votingAddress,
    )
  
    const candidateTwo = await votingProgram.account.candidate.fetch(JoshAddress)
    console.log(candidateTwo)
    expect(candidateTwo.candidateVotes.toNumber()).toEqual(0);
  })
  

  it ('vote', async () => {
    await votingProgram.methods.vote(
      "Jack",
      new anchor.BN(1),
    ).rpc()

    const [JackAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Jack")],
      votingAddress,
    )
  
    const candidateOne = await votingProgram.account.candidate.fetch(JackAddress)
    console.log(candidateOne) 
    expect(candidateOne.candidateVotes.toNumber()).toEqual(1);
    
    // const [JoshAddress] = PublicKey.findProgramAddressSync(
    //   [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Josh")],
    //   votingAddress,
    // )
  
    // const candidateTwo = await votingProgram.account.candidate.fetch(JoshAddress)
    // console.log(candidateTwo)
    // expect(candidateTwo.candidateVotes.toNumber()).toEqual(0);
  })
})
