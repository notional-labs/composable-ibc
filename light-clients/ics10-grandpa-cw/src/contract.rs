use crate::{
	context::Context,
	error::ContractError,
	msg::{
		CheckForMisbehaviourMsg, ExecuteMsg, InstantiateMsg, QueryMsg, UpdateStateMsg,
		UpdateStateOnMisbehaviourMsg, VerifyClientMessage, VerifyMembershipMsg,
		VerifyNonMembershipMsg, VerifyUpgradeAndUpdateStateMsg,
	},
	Bytes,
};
#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw_storage_plus::{Item, Map};
use ibc::core::ics02_client::client_def::ClientDef;
use ics10_grandpa::{client_def::GrandpaClient, consensus_state::ConsensusState};
use light_client_common::{verify_membership, verify_non_membership, LocalHeight};
use sp_runtime::traits::BlakeTwo256;
use std::collections::BTreeSet;

/*
// version info for migration info
const CONTRACT_NAME: &str = "crates.io:ics10-grandpa-cw";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");
*/

pub const CHANNELS_CONNECTION: Map<Bytes, Vec<(Bytes, Bytes)>> = Map::new("channels_connection");
pub const CLIENT_UPDATE_TIME: Map<(Bytes, Bytes), u64> = Map::new("client_update_time");
pub const CLIENT_UPDATE_HEIGHT: Map<(Bytes, Bytes), Bytes> = Map::new("client_update_height");
pub const CHANNEL_COUNTER: Item<u32> = Item::new("channel_counter");
pub const EXPECTED_BLOCK_TIME: Item<u64> = Item::new("expected_block_time");
pub const CONNECTION_PREFIX: Item<Vec<u8>> = Item::new("connection_prefix");
pub const CONNECTION_COUNTER: Item<u32> = Item::new("connection_counter");
pub const CLIENT_COUNTER: Item<u32> = Item::new("client_counter");
pub const HOST_CONSENSUS_STATE: Map<u64, ConsensusState> = Map::new("host_consensus_state");
pub const CONSENSUS_STATES_HEIGHTS: Map<Bytes, BTreeSet<LocalHeight>> =
	Map::new("consensus_states_heights");

#[derive(Clone, Copy, Debug, PartialEq, Default, Eq)]
pub struct HostFunctions;

impl light_client_common::HostFunctions for HostFunctions {
	type BlakeTwo256 = BlakeTwo256;
}

impl grandpa_light_client_primitives::HostFunctions for HostFunctions {
	fn ed25519_verify(
		_sig: &sp_core::ed25519::Signature,
		_msg: &[u8],
		_pub_key: &sp_core::ed25519::Public,
	) -> bool {
		todo!()
	}
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
	_deps: DepsMut,
	_env: Env,
	_info: MessageInfo,
	_msg: InstantiateMsg,
) -> Result<Response, ContractError> {
	Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
	deps: DepsMut,
	env: Env,
	_info: MessageInfo,
	msg: ExecuteMsg,
) -> Result<Response, ContractError> {
	let client = GrandpaClient::<HostFunctions>::default();
	let ctx = Context::<HostFunctions>::new(deps, env);
	match msg {
		ExecuteMsg::ValidateMsg(_) => todo!(),
		ExecuteMsg::StatusMsg(_) => todo!(),
		ExecuteMsg::ExportedMetadataMsg(_) => todo!(),
		ExecuteMsg::ZeroCustomFieldsMsg(_) => todo!(),
		ExecuteMsg::GetTimestampAtHeightMsg(_) => todo!(),
		ExecuteMsg::InitializeMsg(_) => todo!(),
		ExecuteMsg::VerifyMembershipMsg(msg) => {
			let msg = VerifyMembershipMsg::try_from(msg)?;
			verify_membership::<BlakeTwo256, _>(
				&msg.prefix,
				&msg.proof,
				&msg.root,
				msg.path,
				msg.value,
			)
			.map_err(|e| ContractError::Grandpa(e.to_string()))?;
		},
		ExecuteMsg::VerifyNonMembershipMsg(msg) => {
			let msg = VerifyNonMembershipMsg::try_from(msg)?;
			verify_non_membership::<BlakeTwo256, _>(&msg.prefix, &msg.proof, &msg.root, msg.path)
				.map_err(|e| ContractError::Grandpa(e.to_string()))?;
		},
		ExecuteMsg::VerifyClientMessage(msg) => {
			let msg = VerifyClientMessage::try_from(msg)?;
			client
				.verify_client_message(&ctx, msg.client_id, msg.client_state, msg.client_message)
				.map_err(|e| ContractError::Grandpa(e.to_string()))?;
		},
		ExecuteMsg::CheckForMisbehaviourMsg(msg) => {
			let msg = CheckForMisbehaviourMsg::try_from(msg)?;
			client
				.check_for_misbehaviour(&ctx, msg.client_id, msg.client_state, msg.client_message)
				.map_err(|e| ContractError::Grandpa(e.to_string()))?;
		},
		ExecuteMsg::UpdateStateOnMisbehaviourMsg(msg) => {
			let msg = UpdateStateOnMisbehaviourMsg::try_from(msg)?;
			client
				.update_state_on_misbehaviour(msg.client_state, msg.client_message)
				.map_err(|e| ContractError::Grandpa(e.to_string()))?;
		},
		ExecuteMsg::UpdateStateMsg(msg) => {
			let msg = UpdateStateMsg::try_from(msg)?;
			client
				.update_state(&ctx, msg.client_id, msg.client_state, msg.client_message)
				.map_err(|e| ContractError::Grandpa(e.to_string()))?;
		},
		ExecuteMsg::CheckSubstituteAndUpdateStateMsg(_msg) => {
			todo!("check substitute and update state")
		},
		ExecuteMsg::VerifyUpgradeAndUpdateStateMsg(msg) => {
			let msg = VerifyUpgradeAndUpdateStateMsg::try_from(msg)?;
			client
				.verify_upgrade_and_update_state(
					&ctx,
					msg.client_id,
					&msg.old_client_state,
					&msg.upgrade_client_state,
					&msg.upgrade_consensus_state,
					msg.proof_upgrade_client,
					msg.proof_upgrade_consensus_state,
				)
				.map_err(|e| ContractError::Grandpa(e.to_string()))?;
		},
	}
	Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(_deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
	match msg {
		QueryMsg::ClientTypeMsg(_) => todo!(),
		QueryMsg::GetLatestHeightsMsg(_) => todo!(),
	}
}

#[cfg(test)]
mod tests {
	use super::*;
	use cosmwasm_std::{
		attr, coins,
		testing::{mock_dependencies, mock_env, mock_info, MOCK_CONTRACT_ADDR},
		CosmosMsg,
	};

	#[test]
	fn proper_initialization() {
		let mut deps = mock_dependencies();

		let msg = InstantiateMsg {};
		let info = mock_info("creator", &coins(1, "BTC"));

		// we can just call .unwrap() to assert this was a success
		let res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
		assert_eq!(0, res.messages.len());

		// it worked, let's query the state
		// let res = query_config(deps.as_ref()).unwrap();
		// assert_eq!(100_000, res.expires);
		// assert_eq!("creator", res.owner.as_str());
		// assert_eq!("creator", res.creator.as_str());
		// assert_eq!(coins(1, "BTC"), res.collateral);
		// assert_eq!(coins(40, "ETH"), res.counter_offer);
	}
}