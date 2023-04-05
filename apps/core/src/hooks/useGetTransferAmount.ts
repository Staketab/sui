// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import {
    SUI_TYPE_ARG,
    SuiTransactionBlockResponse,
    getTotalGasUsed,
    getTransactionSender,
} from '@mysten/sui.js';
import { useMemo } from 'react';

export function useGetTransferAmount(txnData: SuiTransactionBlockResponse) {
    const { balanceChanges } = txnData;
    const sender = getTransactionSender(txnData);
    const gas = getTotalGasUsed(txnData);
    const changes = useMemo(
        () =>
            balanceChanges
                ? balanceChanges?.map(({ coinType, owner, amount }) => ({
                      coinType,
                      address:
                          owner === 'Immutable'
                              ? 'Immutable'
                              : 'AddressOwner' in owner
                              ? owner.AddressOwner
                              : 'ObjectOwner' in owner
                              ? owner.ObjectOwner
                              : '',
                      amount:
                          coinType === SUI_TYPE_ARG && BigInt(amount) < 0n
                              ? BigInt(amount) + BigInt(gas ?? 0n)
                              : BigInt(amount),
                  }))
                : [],
        [balanceChanges, gas]
    );
    // take absolute value of the first balance change entry for display
    const amount = changes?.[0]?.amount
        ? changes?.[0].amount < 0n
            ? -changes[0].amount
            : changes[0].amount
        : 0n;

    const coinType = changes?.[0]?.coinType;

    return {
        balanceChanges: changes,
        coinType,
        gas,
        sender,
        amount,
    };
}
