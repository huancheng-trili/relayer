use anchor_lang::prelude::*;

declare_id!("AcsdpNsoggiK1PkpWNk2PJwd4Gq4Ph2JGbfe6Tbequ1V");

#[program]
pub mod gateway {
    use super::*;

    pub fn submit_intent(
        ctx: Context<SubmitIntent>,
        action: Action,
        asset: String,
        network: String,
        dest_addr: String,
    ) -> Result<()> {
        emit!(IntentSubmissionEvent {
            action,
            asset,
            network,
            dest_addr
        });

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub enum Action {
    Transfer,
}

#[derive(Accounts)]
pub struct SubmitIntent<'info> {
    #[account(signer)]
    pub user: AccountInfo<'info>,
}

#[event]
pub struct IntentSubmissionEvent {
    pub action: Action,
    pub asset: String,
    pub network: String,
    pub dest_addr: String,
}
