import {
  OwnershipTransferred as OwnershipTransferredEvent,
  TradeApproved as TradeApprovedEvent,
  TradeRejected as TradeRejectedEvent,
  TradeSettled as TradeSettledEvent,
  TradeSubmitted as TradeSubmittedEvent
} from "../generated/WasteSettlement/WasteSettlement"
import {
  OwnershipTransferred,
  Trade,
  TradeApproved,
  TradeRejected,
  TradeSettled,
  TradeSubmitted
} from "../generated/schema"

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTradeApproved(event: TradeApprovedEvent): void {
  let entity = new TradeApproved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tradeId = event.params.tradeId
  entity.socialNode = event.params.socialNode

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // get trade entity by tradeId if not exist create new one
  let trade = Trade.load(event.params.tradeId.toString())
  if (trade == null) {
    trade = new Trade(event.params.tradeId.toString())
  }

  // update trade entity
  trade.socialNode = event.params.socialNode
  trade.approvedAt = event.block.timestamp
  trade.status = "Approved"
  trade.save()
}

export function handleTradeRejected(event: TradeRejectedEvent): void {
  let entity = new TradeRejected(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tradeId = event.params.tradeId
  entity.socialNode = event.params.socialNode

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTradeSettled(event: TradeSettledEvent): void {
  let entity = new TradeSettled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tradeId = event.params.tradeId
  entity.user = event.params.user
  entity.wasteTokenAmount = event.params.wasteTokenAmount
  entity.usdcAmount = event.params.usdcAmount
  entity.totalEmission = event.params.totalEmission

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // get trade entity by tradeId if not exist create new one
  let trade = Trade.load(event.params.tradeId.toString())
  if (trade == null) {
    trade = new Trade(event.params.tradeId.toString())
  }

  // update trade entity
  trade.wasteTokenAmount = event.params.wasteTokenAmount
  trade.usdcAmount = event.params.usdcAmount
  trade.totalEmission = event.params.totalEmission
  trade.status = "Settled"
  trade.save()
}

export function handleTradeSubmitted(event: TradeSubmittedEvent): void {
  let entity = new TradeSubmitted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tradeId = event.params.tradeId
  entity.user = event.params.user

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // get trade entity by tradeId if not exist create new one
  let trade = Trade.load(event.params.tradeId.toString())
  if (trade == null) {
    trade = new Trade(event.params.tradeId.toString())
  }

  // update trade entity
  trade.blockNumber = event.block.number
  trade.blockTimestamp = event.block.timestamp
  trade.user = event.params.user
  trade.status = "Pending"
  trade.submitedAt = event.block.timestamp
  trade.save()
}
