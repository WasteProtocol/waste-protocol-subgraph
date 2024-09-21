import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred,
  TradeApproved,
  TradeRejected,
  TradeSettled,
  TradeSubmitted
} from "../generated/WasteSettlement/WasteSettlement"

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createTradeApprovedEvent(
  tradeId: BigInt,
  socialNode: Address
): TradeApproved {
  let tradeApprovedEvent = changetype<TradeApproved>(newMockEvent())

  tradeApprovedEvent.parameters = new Array()

  tradeApprovedEvent.parameters.push(
    new ethereum.EventParam(
      "tradeId",
      ethereum.Value.fromUnsignedBigInt(tradeId)
    )
  )
  tradeApprovedEvent.parameters.push(
    new ethereum.EventParam(
      "socialNode",
      ethereum.Value.fromAddress(socialNode)
    )
  )

  return tradeApprovedEvent
}

export function createTradeRejectedEvent(
  tradeId: BigInt,
  socialNode: Address
): TradeRejected {
  let tradeRejectedEvent = changetype<TradeRejected>(newMockEvent())

  tradeRejectedEvent.parameters = new Array()

  tradeRejectedEvent.parameters.push(
    new ethereum.EventParam(
      "tradeId",
      ethereum.Value.fromUnsignedBigInt(tradeId)
    )
  )
  tradeRejectedEvent.parameters.push(
    new ethereum.EventParam(
      "socialNode",
      ethereum.Value.fromAddress(socialNode)
    )
  )

  return tradeRejectedEvent
}

export function createTradeSettledEvent(
  tradeId: BigInt,
  user: Address,
  wasteTokenAmount: BigInt,
  usdcAmount: BigInt,
  totalEmission: BigInt
): TradeSettled {
  let tradeSettledEvent = changetype<TradeSettled>(newMockEvent())

  tradeSettledEvent.parameters = new Array()

  tradeSettledEvent.parameters.push(
    new ethereum.EventParam(
      "tradeId",
      ethereum.Value.fromUnsignedBigInt(tradeId)
    )
  )
  tradeSettledEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  tradeSettledEvent.parameters.push(
    new ethereum.EventParam(
      "wasteTokenAmount",
      ethereum.Value.fromUnsignedBigInt(wasteTokenAmount)
    )
  )
  tradeSettledEvent.parameters.push(
    new ethereum.EventParam(
      "usdcAmount",
      ethereum.Value.fromUnsignedBigInt(usdcAmount)
    )
  )
  tradeSettledEvent.parameters.push(
    new ethereum.EventParam(
      "totalEmission",
      ethereum.Value.fromUnsignedBigInt(totalEmission)
    )
  )

  return tradeSettledEvent
}

export function createTradeSubmittedEvent(
  tradeId: BigInt,
  user: Address
): TradeSubmitted {
  let tradeSubmittedEvent = changetype<TradeSubmitted>(newMockEvent())

  tradeSubmittedEvent.parameters = new Array()

  tradeSubmittedEvent.parameters.push(
    new ethereum.EventParam(
      "tradeId",
      ethereum.Value.fromUnsignedBigInt(tradeId)
    )
  )
  tradeSubmittedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )

  return tradeSubmittedEvent
}
