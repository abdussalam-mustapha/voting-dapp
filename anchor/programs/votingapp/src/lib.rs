#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod votingapp {
    use super::*;

    pub fn initializePoll(ctx: Context<initializePoll>, _poll_id: u64) -> ProgramResult {
      Ok(());
    }
  }



