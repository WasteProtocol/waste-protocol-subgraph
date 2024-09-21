import { BigInt } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred as OwnershipTransferredEvent,
  TradeApproved as TradeApprovedEvent,
  TradeRejected as TradeRejectedEvent,
  TradeSettled as TradeSettledEvent,
  TradeSubmitted as TradeSubmittedEvent,
  WasteSettlement
} from "../generated/WasteSettlement/WasteSettlement"
import {
  OwnershipTransferred,
  Trade,
  TradeApproved,
  TradeDay,
  TradeHour,
  TradeRejected,
  TradeSettled,
  TradeSubmitted,
  TradeTotal,
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

export function collectStat(event: TradeSettledEvent): void {
  // TradeContract
  // const tradeContract = WasteSettlement.bind(event.address)

  // get TradeItemTotal entity if not exist create new one
  let tradeItemTotal = TradeTotal.load("1")
  if (tradeItemTotal === null) {
    tradeItemTotal = new TradeTotal("1")
    tradeItemTotal.tradeCount = BigInt.fromI32(0)
    tradeItemTotal.carbonEmissionCount = BigInt.fromI32(1)
    tradeItemTotal.usdcCount = BigInt.fromI32(0)
  }

  tradeItemTotal.tradeCount = tradeItemTotal.tradeCount!.plus(BigInt.fromI32(1));
  tradeItemTotal.carbonEmissionCount = tradeItemTotal.carbonEmissionCount!.plus(event.params.totalEmission);
  tradeItemTotal.usdcCount = tradeItemTotal.usdcCount!.plus(event.params.usdcAmount);
  tradeItemTotal.save()

  // get month and year from block timestamp
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400;
  let dayStartTimestamp = dayID * 86400;

  // get TradeItemTotal entity by month and year if not exist create new one
  let entityKey = `${dayID.toString()}`;
  let tradeDay = TradeDay.load(entityKey)
  if (tradeDay === null) {
    tradeDay = new TradeDay(entityKey)
    tradeDay.tradeCount = BigInt.fromI32(0)
    tradeDay.carbonEmissionCount = BigInt.fromI32(0)
    tradeDay.usdcCount = BigInt.fromI32(0)
  }

  tradeDay.tradeCount = tradeDay.tradeCount!.plus(BigInt.fromI32(1));
  tradeDay.carbonEmissionCount = tradeDay.carbonEmissionCount!.plus(event.params.totalEmission);
  tradeDay.usdcCount = tradeDay.usdcCount!.plus(event.params.usdcAmount);

  tradeDay.save()

  // stat for TradeHour
  let hourIndex = timestamp / 3600;
  let hourStartUnix = hourIndex * 3600;
  let hourKey = `${hourIndex.toString()}`;
  let tradeHour = TradeHour.load(hourKey)
  if (tradeHour === null) {
    tradeHour = new TradeHour(hourKey)
    tradeHour.tradeCount = BigInt.fromI32(0)
    tradeHour.carbonEmissionCount = BigInt.fromI32(0)
    tradeHour.usdcCount = BigInt.fromI32(0)
  }

  tradeHour.tradeCount = tradeHour.tradeCount!.plus(BigInt.fromI32(1));
  tradeHour.carbonEmissionCount = tradeHour.carbonEmissionCount!.plus(event.params.totalEmission);
  tradeHour.usdcCount = tradeHour.usdcCount!.plus(event.params.usdcAmount);

  tradeHour.save()

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

  collectStat(event)
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
